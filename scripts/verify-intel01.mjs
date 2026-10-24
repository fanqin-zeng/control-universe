import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
import {request} from 'node:http';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/intel-01/',key='intelligent/fuzzy-control-basics';
const mod={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/fuzzy-inference.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(mod);
const ug=mod.buildUG(),cases=[];
for(const n of [3,5,7,9])for(let h=10;h<=40;h++)for(const x of [-30,-22.5,-5,0,5,7.5,30]){
 const hs=h/20,P=mod.partition(-30,30,n,hs),U=mod.partition(-15,15,n,1);
 const grid=U.map(p=>ug.map(u=>mod.trimf(u,...p)));
 const out=mod.inferOne(x,P,ug,grid,P.map((_,i)=>n-1-i));
 cases.push({n,hs,x,cog:out.cog,bis:out.bis,mom:out.mom,fired:out.alphas.filter(a=>a>0).length});
}
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(cases));
const reference=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8'}));assert(reference.pass);
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),before=fs.readFileSync(dir+'source-before.mdx','utf8').replace(/\r\n/g,'\n');
const headings=await renderedHeadings(source,key),oldHeadings=await renderedHeadings(before,key);
assert.deepEqual(headings.h2,oldHeadings.h2);
fs.writeFileSync(dir+'headings-before.json',JSON.stringify(oldHeadings,null,2));
for(const h of oldHeadings.ids)assert(headings.ids.includes(h)||source.includes('id='+JSON.stringify(h)),h);
const port=8997;
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(180000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const report={sourceHash:createHash('sha256').update(source).digest('hex'),reference,rendered:headings,notebooks:[],pass:false};
for(const[i,nb]of extractNotebooks(source).entries()){
 const id='intel01-rank7-'+randomUUID(),outputs=[];console.log('Running',i+1,nb.title);
 try{
  await http('/api/notebook','POST',{notebook_id:id,setup_code:''});
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){
   const out=await http('/api/notebook/'+id+'/execute','POST',{code});
   assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));
   outputs.push(out.outputs.map(o=>o.type==='image'?{type:'image',sha256:createHash('sha256').update(o.data).digest('hex')}:o));
  }
  if(i===1){
   const code='import json\naudit_controller=Mamdani2(XR,WR,UR,5,famm(5),ng=20001)\nprint("AUDIT:"+json.dumps([audit_controller(th*DEG,w*DEG) for th,w in [(-23,1),(-15,70),(20,-50),(5,10),(0,0),(30,120)]]))';
   const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'));
   const actual=JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]);
   report.twoInputSampleErrors=actual.map((v,j)=>Math.abs(v-reference.twoInputSamples[j].cog));
   assert(report.twoInputSampleErrors.every(v=>v<1e-6),JSON.stringify(report.twoInputSampleErrors));
  }
  report.notebooks.push({title:nb.title,cells:nb.cells.length,outputs});
  fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
report.pass=true;fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:true,configs:cases.length,notebooks:report.notebooks.length,cells:report.notebooks.reduce((s,n)=>s+n.cells,0),reference}));
