import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const dir='.agent/semester-03/modern-01/';
const source=readFileSync('content/modern/state-space.mdx','utf8');
const reference=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',maxBuffer:16*1024*1024}));
const actual={};
new Function('exports',ts.transpileModule(readFileSync('lib/state-space-response.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(actual);
assert(readFileSync('components/wiki/state-space-explorer.tsx','utf8').includes('stateSpaceResponse(x0, i / 200)'));
let maxPositionError=0,maxVelocityError=0;
for(const c of reference.cases){for(let i=0;i<=600;i++){
 const got=actual.stateSpaceResponse(c.x0,i/200);
 for(const field of ['free','step','total']){const error=Math.abs(got[field]-c[field][i]);maxPositionError=Math.max(maxPositionError,error);assert(error<1e-10);assert(got[field]>=-.16&&got[field]<=.24);}
 maxVelocityError=Math.max(maxVelocityError,Math.abs(got.velocity-c.velocity[i]));assert(Math.abs(got.velocity-c.velocity[i])<1e-9);
 assert(Math.abs(got.total-got.free-got.step)<1e-15);
}}
assert.throws(()=>actual.stateSpaceResponse(-.1,0));assert.throws(()=>actual.stateSpaceResponse(.1,-1));
const report={sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),component:{cases:21,nodes:601,maxPositionError,maxVelocityError,defaultAt1:actual.stateSpaceResponse(.1,1),endpoints:[actual.stateSpaceResponse(0,0),actual.stateSpaceResponse(.2,0)]},reference:{...reference,cases:undefined},notebooks:[]};
for(const [i,nb] of extractNotebooks(source).entries()){
 const id='modern01-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code:nb.setup.value}),'original setup');
  const outputs=[];for(const cell of nb.cells)outputs.push(...requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code:cell.value}),'original cell'));
  report.notebooks.push({index:i+1,title:nb.title,outputs:outputs.map(o=>o.type==='image'?{type:'image',base64Length:o.data?.length}:o),pass:true});
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const headings=await renderedHeadings(source,'modern/state-space');
assert.equal(headings.h2.length,10);assert.equal(new Set(headings.ids).size,headings.ids.length);
for(const id of JSON.parse(readFileSync(dir+'baseline-source.json','utf8')).ids)assert(headings.ids.includes(id)||source.includes(`id="${id}"`),`Missing old heading ${id}`);
writeFileSync(dir+'headings.json',JSON.stringify(headings,null,2));
report.pass=true;writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,cases:21,nodes:601,maxPositionError,maxVelocityError,originalNotebooks:report.notebooks.length,oldIdsPreserved:true,defaultAt1:report.component.defaultAt1}));
