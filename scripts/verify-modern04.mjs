import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const dir='.agent/semester-03/modern-04/',source=readFileSync('content/modern/state-feedback.mdx','utf8');
assert(![...source].some(c=>c.charCodeAt(0)<32&&!['\n','\r','\t'].includes(c)));
const ref=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',maxBuffer:16*1024*1024}));
const actual={};new Function('exports',ts.transpileModule(readFileSync('lib/state-feedback-response.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(actual);
assert(readFileSync('components/wiki/state-feedback-pole-explorer.tsx','utf8').includes('stateFeedbackResponse(p,4*i/500)'));
let maxComponentError=0;
function compare(a,b,tol=1e-8){if(Array.isArray(a)){assert.equal(a.length,b.length);return Math.max(...a.map((v,i)=>compare(v,b[i],tol)));}assert(Number.isFinite(a)&&Number.isFinite(b));const e=Math.abs(a-b);assert(e<=tol*(1+Math.abs(b)),`${a} vs ${b}`);return e;}
for(const c of ref.cases)for(let i=0;i<=500;i++){
 const got=actual.stateFeedbackResponse(c.p,4*i/500);
 for(const [field,val] of Object.entries({position:c.states[i][0],velocity:c.states[i][1],force:c.force[i],baseline:c.baseline[i]}))maxComponentError=Math.max(maxComponentError,compare(got[field],val));
 assert(got.position>=-1e-12&&got.position<=1.1);assert(got.force>=-30&&got.force<=105);
 compare(got.k1,c.K[0]);compare(got.k2,c.K[1]);compare(got.N,c.N);
}
for(const [p,t]of [[0,0],[-11,0],[-5,-1],[NaN,0]])assert.throws(()=>actual.stateFeedbackResponse(p,t));
const textOf=outputs=>outputs.filter(o=>o.type==='stream'||o.type==='text').map(o=>o.text??'').join('');
const report={sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),notebooks:[],component:{cases:19,nodes:501,maxError:maxComponentError,default:actual.stateFeedbackResponse(-5,4),endpoints:[actual.stateFeedbackResponse(-10,4),actual.stateFeedbackResponse(-.5,4)]},maxNotebookResponseError:0};
for(const [i,nb]of extractNotebooks(source).entries()){
 const id='modern04-'+randomUUID();try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'source execution');
  await execute(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await execute(c.value));
  report.notebooks.push({title:nb.title,cells:nb.cells.length,pass:true,outputs:outputs.map(o=>o.type==='image'?{type:'image',length:o.data?.length}:o)});
  const query=async expr=>JSON.parse(textOf(await execute('import json\nprint(json.dumps('+expr+'))')));
  if(i===1){const got=await query('response_records');for(let c=0;c<19;c++){compare(got[c].p,ref.cases[c].p);for(const field of ['states','force'])report.maxNotebookResponseError=Math.max(report.maxNotebookResponseError,compare(got[c][field],ref.cases[c][field]));}report.componentNotebookDefault=got.find(r=>r.p===-5);delete report.componentNotebookDefault.states;delete report.componentNotebookDefault.force;}
  if(i===2)report.q7=await query('q7_records');
  if(i===4){const got=await query('motor_records');for(const field of ['ts','tp','overshoot'])compare(got[field],ref.motor[field],1e-10);compare(got.statesY,ref.motor.y,1e-10);report.motor={...got,statesY:undefined};}
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const headings=await renderedHeadings(source,'modern/state-feedback'),old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));
assert.equal(headings.h2.length,8);assert.equal(new Set(headings.ids).size,headings.ids.length);
for(const id of old.ids)assert(headings.ids.includes(id)||source.includes(`id="${id}"`),id);
writeFileSync(dir+'headings.json',JSON.stringify(headings,null,2)+'\n');
report.oldIds=old.ids.length;report.pass=true;writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,notebooks:report.notebooks.length,cells:report.notebooks.reduce((n,b)=>n+b.cells,0),oldIds:report.oldIds,component:report.component,maxNotebookResponseError:report.maxNotebookResponseError,motor:report.motor}));
