import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash,randomUUID} from 'node:crypto';import assert from 'node:assert/strict';import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const dir='.agent/semester-03/modern-08/',source=readFileSync('content/modern/multivariable-systems.mdx','utf8');
const actual={};new Function('exports',ts.transpileModule(readFileSync('lib/mimo-model.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(actual);
assert(readFileSync('components/wiki/mimo-proportional-explorer.tsx','utf8').includes('useMemo(() => simulateMimo(kp1, kp2)'));
const binary=new Float64Array(2116*501*4);let offset=0;const summaries=[];
for(let i=5;i<=50;i++)for(let j=5;j<=50;j++){
 const d=actual.simulateMimo(i/10,j/10);assert.equal(d.points.length,501);for(const p of d.points){assert(p.y1>=-.1&&p.y1<=1.1&&p.y2>=-.1&&p.y2<=1.1&&p.u1>=-1&&p.u1<=5.1&&p.u2>=-1&&p.u2<=5.1,'axis clipping');for(const f of ['y1','y2','u1','u2'])binary[offset++]=p[f];}
 summaries.push({params:[i/10,j/10],steady:[d.steady1,d.steady2],peak:[Math.abs(d.peak2.y2),d.peak2.t]});
}
for(const p of [[0,2],[2,6],[NaN,1]])assert.throws(()=>actual.simulateMimo(...p));
const bin='logs/modern08-actual.bin';let ref;try{writeFileSync(bin,Buffer.from(binary.buffer));ref=JSON.parse(execFileSync('python',[dir+'reference.py',bin],{encoding:'utf8',maxBuffer:8*1024*1024}));}finally{try{unlinkSync(bin);}catch{}}
function diff(a,b,tol=1e-8){if(Array.isArray(a)){assert.equal(a.length,b.length);return Math.max(...a.map((v,i)=>diff(v,b[i],tol)));}assert(Number.isFinite(a)&&Number.isFinite(b));const d=Math.abs(a-b);assert(d<tol,`${a} vs ${b}`);return d;}
let steadyError=0;for(let k=0;k<summaries.length;k++){steadyError=Math.max(steadyError,diff(summaries[k].steady,ref.records[k].steady));diff(summaries[k].peak,ref.records[k].peak);}
const report={sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),component:{cases:2116,nodes:501,maxError:ref.maxError,worst:ref.worst,maxRealPole:ref.maxRealPole,steadyError,default:actual.simulateMimo(2,2)},notebooks:[],maxNotebookResponseError:0};
// Store only observable default readings rather than duplicating 501 points in report.
report.component.default={...summaries.find(c=>c.params[0]===2&&c.params[1]===2),last:report.component.default.points.at(-1)};
const text=out=>out.filter(o=>o.type==='stream'||o.type==='text').map(o=>o.text??'').join('');
for(const [i,nb]of extractNotebooks(source).entries()){
 const id='modern08-'+randomUUID();try{assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'source execution');await execute(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await execute(c.value));report.notebooks.push({title:nb.title,cells:nb.cells.length,pass:true,outputs:outputs.map(o=>o.type==='image'?{type:'image',length:o.data?.length}:o)});
 if(i===3){const got=JSON.parse(text(await execute('import json\nprint(json.dumps(grid_records))')));assert.equal(got.length,2116);for(let k=0;k<got.length;k++)for(const f of ['params','samples','steady','peak'])report.maxNotebookResponseError=Math.max(report.maxNotebookResponseError,diff(got[k][f],ref.records[k][f]));}
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const h=await renderedHeadings(source,'modern/multivariable-systems'),old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));assert.equal(h.h2.length,8);assert.equal(new Set(h.ids).size,h.ids.length);for(const id of old.ids)assert(h.ids.includes(id)||source.includes(`id="${id}"`),id);
report.oldIds=old.ids.length;report.pass=true;writeFileSync(dir+'headings.json',JSON.stringify(h,null,2)+'\n');writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,notebooks:report.notebooks.map(n=>({title:n.title,cells:n.cells,pass:n.pass}))}));
