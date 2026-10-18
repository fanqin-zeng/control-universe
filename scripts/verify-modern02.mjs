import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const dir='.agent/semester-03/modern-02/';
const source=readFileSync('content/modern/controllability-observability.mdx','utf8');
const reference=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',maxBuffer:8*1024*1024}));
const report={sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),notebooks:[],maxResponseError:0};
function textOutput(outputs){return outputs.filter(o=>(o.type==='text'||o.type==='stream')).map(o=>o.content??o.text??o.data??'').join('\n');}
function maxError(a,b){if(Array.isArray(a)){assert.equal(a.length,b.length);return Math.max(...a.map((x,i)=>maxError(x,b[i])));}return Math.abs(a-b);}
for(const [i,nb] of extractNotebooks(source).entries()){
 const id='modern02-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code:nb.setup.value}),'original setup');
  const outputs=[];for(const cell of nb.cells)outputs.push(...requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code:cell.value}),'original cell'));
  report.notebooks.push({index:i+1,title:nb.title,outputs:outputs.map(o=>o.type==='image'?{type:'image',base64Length:o.data?.length}:o),pass:true});
  if(i===0){
   const extra=requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code:'import json\nprint(json.dumps(records))'}),'actual notebook arrays');
   const actual=JSON.parse(textOutput(extra));
   for(let c=0;c<3;c++){assert.equal(actual[c].k,reference.cases[c].k);for(const key of ['forced','free'])report.maxResponseError=Math.max(report.maxResponseError,maxError(actual[c][key],reference.cases[c][key]));}
   assert(report.maxResponseError<1e-10);report.mechanicalSummary=actual.map(c=>({k:c.k,forcedAt6:c.forced.at(-1),freeAt6:c.free.at(-1)}));
  }
  if(i===4){
   const extra=requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code:'import json\nprint(json.dumps({"W":W.tolist(),"WT":WT.tolist(),"energy":float(np.linalg.solve(WT,[1,0])[0])}))'}),'actual Gramian');
   const actual=JSON.parse(textOutput(extra));
   for(const key of ['W','WT','energy'])assert(maxError(actual[key],reference[key])<1e-10);
   report.gramian=actual;
  }
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const headings=await renderedHeadings(source,'modern/controllability-observability');
const old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));
assert.equal(headings.h2.length,9);assert.equal(new Set(headings.ids).size,headings.ids.length);
for(const id of old.ids)assert(headings.ids.includes(id),`Missing old heading ${id}`);
writeFileSync(dir+'headings.json',JSON.stringify(headings,null,2));
report.pass=true;report.oldIds=old.ids.length;
writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,notebooks:report.notebooks.length,oldIds:report.oldIds,cases:3,nodes:301,maxResponseError:report.maxResponseError,gramian:report.gramian}));
