import {readFileSync,writeFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash,randomUUID} from 'node:crypto';import assert from 'node:assert/strict';import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const dir='.agent/semester-03/modern-06/',source=readFileSync('content/modern/optimal-control-basics.mdx','utf8');
assert(![...source].some(c=>c.charCodeAt(0)<32&&!['\n','\r','\t'].includes(c)));
const ref=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',maxBuffer:16*1024*1024}));
const actual={};new Function('exports',ts.transpileModule(readFileSync('lib/optimal-trajectory.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(actual);
assert(readFileSync('components/wiki/optimal-time-explorer.tsx','utf8').includes('optimalTrajectory(T,T*i/400)'));
function diff(a,b,tol=1e-8){if(Array.isArray(a)){assert.equal(a.length,b.length);return Math.max(...a.map((v,i)=>diff(v,b[i],tol)));}assert(Number.isFinite(a)&&Number.isFinite(b));let d=Math.abs(a-b);assert(d<tol*(1+Math.abs(b)),`${a} vs ${b}`);return d;}
let max=0;
for(const c of ref.cases)for(let i=0;i<=400;i++){
 const a=actual.optimalTrajectory(c.T,c.T*i/400);max=Math.max(max,diff([a.x,a.u,a.J,a.lambda0,a.c,a.Jconstant,a.peak,a.saving],[c.x[i],c.u[i],c.J,c.lambda0,c.c,c.Jc,c.peak,c.saving]));
 assert(a.x>=-.05&&a.x<=1.05&&a.u>=-2.1&&a.u<=.05&&a.J>=1e-5&&a.J<=1);
}
for(const [T,t]of [[.4,0],[5.1,0],[2,-1],[2,3],[NaN,0]])assert.throws(()=>actual.optimalTrajectory(T,t));
for(let i=0;i<=200;i++){const T=.5+4.5*i/200,a=actual.optimalTrajectory(T,0);diff(a.J,1/Math.expm1(2*T),1e-12);}
const report={sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),notebooks:[],component:{cases:46,nodes:401,costNodes:201,maxError:max,default:actual.optimalTrajectory(2,0),terminal:actual.optimalTrajectory(2,2),endpoints:[actual.optimalTrajectory(.5,.5),actual.optimalTrajectory(5,5)]},maxNotebookResponseError:0};
const text=out=>out.filter(o=>o.type==='stream'||o.type==='text').map(o=>o.text??'').join('');
for(const [i,nb]of extractNotebooks(source).entries()){
 const id='modern06-'+randomUUID();try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'source execution');await execute(nb.setup.value);
  const outputs=[];for(const c of nb.cells)outputs.push(...await execute(c.value));report.notebooks.push({title:nb.title,cells:nb.cells.length,pass:true,outputs:outputs.map(o=>o.type==='image'?{type:'image',length:o.data?.length}:o)});
  if(i===1){const records=JSON.parse(text(await execute('import json\nprint(json.dumps(energy_records))')));for(let k=0;k<46;k++){const a=records[k],b=ref.cases[k];for(const f of ['T','x','u','J','lambda0','c','Jc','saving','peak'])report.maxNotebookResponseError=Math.max(report.maxNotebookResponseError,diff(a[f],b[f]));}report.observations=records.filter((_,k)=>[0,15,45].includes(k)).map(({T,J,Jc,saving,peak})=>({T,J,Jc,saving,peak}));}
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const h=await renderedHeadings(source,'modern/optimal-control-basics'),old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));assert.equal(h.h2.length,10);assert.equal(new Set(h.ids).size,h.ids.length);for(const id of old.ids)assert(h.ids.includes(id)||source.includes(`id="${id}"`),id);
report.oldIds=old.ids.length;report.pass=true;writeFileSync(dir+'headings.json',JSON.stringify(h,null,2)+'\n');writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,notebooks:report.notebooks.map(n=>({title:n.title,cells:n.cells,pass:n.pass}))}));
