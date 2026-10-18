import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const dir='.agent/semester-03/modern-05/',source=readFileSync('content/modern/state-observer.mdx','utf8');
const ref=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',maxBuffer:16*1024*1024}));
const actual={};new Function('exports',ts.transpileModule(readFileSync('lib/observer-response.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(actual);
assert(readFileSync('components/wiki/observer-speed-explorer.tsx','utf8').includes('observerResponse(p,i/200)'));
function diff(a,b,tol=1e-8){if(Array.isArray(a)){assert.equal(a.length,b.length);return Math.max(...a.map((v,i)=>diff(v,b[i],tol)));}assert(Number.isFinite(a)&&Number.isFinite(b));const e=Math.abs(a-b);assert(e<tol*(1+Math.abs(b)),`${a} vs ${b}`);return e;}
let maximum=0;
for(const c of ref.cases)for(let i=0;i<=400;i++){
 const a=actual.observerResponse(c.p,i/200),x=c.x[i],e=c.e[i],h=c.estimate[i];
 maximum=Math.max(maximum,diff([a.position,a.velocity,a.estimate,a.velocityEstimate,a.e1,a.e2,a.noiseVelocity],[...x,...h,...e,c.noise]));
 assert(a.position>=-.1&&a.position<=1.2&&a.estimate>=-.1&&a.estimate<=1.2&&a.e2>=-1e-10&&a.e2<=10);
}
for(const [p,t]of [[-31,0],[-4,0],[-15,-1],[NaN,0]])assert.throws(()=>actual.observerResponse(p,t));
const report={sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),notebooks:[],component:{cases:26,nodes:401,maxError:maximum,default:actual.observerResponse(-15,2),endpoints:[actual.observerResponse(-30,2),actual.observerResponse(-5,2)]},maxNotebookResponseError:0};
const text=out=>out.filter(o=>o.type==='stream'||o.type==='text').map(o=>o.text??'').join('');
for(const [i,nb]of extractNotebooks(source).entries()){
 const id='modern05-'+randomUUID();try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'source execution');
  await execute(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await execute(c.value));
  report.notebooks.push({title:nb.title,cells:nb.cells.length,pass:true,outputs:outputs.map(o=>o.type==='image'?{type:'image',length:o.data?.length}:o)});
  if(i===2){const records=JSON.parse(text(await execute('import json\nprint(json.dumps(observer_records))')));for(let k=0;k<26;k++){const a=records[k],b=ref.cases[k];diff(a.p,b.p);for(const f of ['x','e','estimate'])report.maxNotebookResponseError=Math.max(report.maxNotebookResponseError,diff(a[f],b[f]));diff(a.noise,b.noise);}
   report.observations=records.filter(r=>[-30,-15,-5].includes(r.p)).map(({p,L,peak,peakTime,noise})=>({p,L,peak,peakTime,noise}));}
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const h=await renderedHeadings(source,'modern/state-observer'),old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));
assert.equal(h.h2.length,9);assert.equal(new Set(h.ids).size,h.ids.length);
for(const id of old.ids)assert(h.ids.includes(id)||source.includes(`id="${id}"`),id);
report.oldIds=old.ids.length;report.pass=true;
writeFileSync(dir+'headings.json',JSON.stringify(h,null,2)+'\n');writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,notebooks:report.notebooks.map(n=>({title:n.title,pass:n.pass})),observations:report.observations}));
