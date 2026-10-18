import {readFileSync,writeFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash,randomUUID} from 'node:crypto';import assert from 'node:assert/strict';import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const dir='.agent/semester-03/modern-07/',source=readFileSync('content/modern/lqr-controller.mdx','utf8');assert(![...source].some(c=>c.charCodeAt(0)<32&&!['\n','\r','\t'].includes(c)));
const ref=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const actual={};new Function('exports',ts.transpileModule(readFileSync('lib/lqr-model.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(actual);
assert(readFileSync('components/wiki/lqr-explorer.tsx','utf8').includes('useMemo(() => lqrModel(q1, q2, r, gain)'));
function diff(a,b,tol=1e-8){if(Array.isArray(a)){assert.equal(a.length,b.length);return Math.max(...a.map((v,i)=>diff(v,b[i],tol)));}assert(Number.isFinite(a)&&Number.isFinite(b));const d=Math.abs(a-b);assert(d<tol*(1+Math.abs(b)),`${a} vs ${b}`);return d;}
let max=0;
for(const c of ref.cases){const a=actual.lqrModel(...c.params);max=Math.max(max,diff([[a.p11,a.p12],[a.p12,a.p22]],c.P),diff([a.k1,a.k2],c.K));for(const [k,i]of [0,40,200,600].entries())max=Math.max(max,diff([a.points[i].x,a.points[i].v,a.points[i].u],[...c.states[k],c.u[k]]));
 for(const p of a.points)assert(p.x>=-1&&p.x<=1.1&&p.v>=-5&&p.v<=1&&p.u>=-16&&p.u<=16,'axis clipping '+c.params);
}
for(const c of [[0,1,1,1],[1,1,0,1],[1,1,1,0],[NaN,1,1,1]])assert.throws(()=>actual.lqrModel(...c));
const d=actual.lqrModel(1,1,1,1),report={sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),notebooks:[],component:{cases:ref.cases.length,nodes:601,independentNodes:[0,40,200,600],maxError:max,default:{K:[d.k1,d.k2],P:[[d.p11,d.p12],[d.p12,d.p22]],t1:d.points[40],pole:d.pole,J:d.p11/2}},maxNotebookResponseError:0};
const text=out=>out.filter(o=>o.type==='stream'||o.type==='text').map(o=>o.text??'').join('');
for(const [i,nb]of extractNotebooks(source).entries()){
 const id='modern07-'+randomUUID();try{assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'source execution');await execute(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await execute(c.value));report.notebooks.push({title:nb.title,cells:nb.cells.length,pass:true,outputs:outputs.map(o=>o.type==='image'?{type:'image',length:o.data?.length}:o)});
 const query=async expr=>JSON.parse(text(await execute('import json\nprint(json.dumps('+expr+'))')));
 if(i===0)report.finite=await query('finite_records');if(i===2)report.discrete=await query('discrete_record');
 if(i===4){const got=await query('component_records');assert.equal(got.length,ref.cases.length);for(let k=0;k<got.length;k++){const a=got[k],b=ref.cases[k];for(const f of ['params','P','K','states','u'])report.maxNotebookResponseError=Math.max(report.maxNotebookResponseError,diff(a[f],b[f]));}}
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const h=await renderedHeadings(source,'modern/lqr-controller'),old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));assert.equal(h.h2.length,10);assert.equal(new Set(h.ids).size,h.ids.length);for(const id of old.ids)assert(h.ids.includes(id)||source.includes(`id="${id}"`),id);
report.oldIds=old.ids.length;report.pass=true;writeFileSync(dir+'headings.json',JSON.stringify(h,null,2)+'\n');writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,notebooks:report.notebooks.map(n=>({title:n.title,cells:n.cells,pass:n.pass}))}));
