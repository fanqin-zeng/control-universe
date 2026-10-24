import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
import {request} from 'node:http';import {randomUUID,createHash} from 'node:crypto';
const dir='.agent/semester-03/ml-03/',m={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/neural-network-basics.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m);
const cases={forward:[],losses:[],xor:[]};let points=0;
for(const kind of ['relu','linear','tanh'])for(const c of m.centers)for(const g of m.gains)for(const d of m.hiddenOffsets){
 for(let i=0;i<=16;i++){const x=-2+i/4,result=m.forward(x,c,g,d,kind);cases.forward.push({p:[x,c,g,d,kind],result});}
 cases.losses.push({p:[c,g,d,kind],result:m.losses(c,g,d,kind)});
 for(let i=0;i<=160;i++){const result=m.forward(-2+i/40,c,g,d,kind);for(const v of [...result.h,result.output]){assert(v>=-12&&v<=8);points++;}}
}
for(let i=0;i<=4;i++)for(let j=0;j<=4;j++){const x=[i/2,j/2];cases.xor.push({x,result:m.xorForward(...x)});}
fs.writeFileSync(dir+'ts-cases.json',JSON.stringify(cases));
const ref=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'ts-cases.json'],{encoding:'utf8'}));fs.writeFileSync(dir+'reference.json',JSON.stringify({...ref,plottedQuantities:points},null,2));
// Execute the actual evaluated setup/cell strings in clean CPython processes.
const notebooks=extractNotebooks(fs.readFileSync('content/machine-learning/neural-networks.mdx','utf8'));
const outputs=[];
for(const [i,n] of notebooks.entries()){
 const code=n.setup.value+'\n'+n.cells.map(c=>c.value).join('\n');
 const output=execFileSync('python',['-c',code],{encoding:'utf8'});outputs.push({title:n.title,output});
}
fs.writeFileSync(dir+'raw-python.json',JSON.stringify(outputs,null,2));
let quantities=0,notebookError=0;
function compare(a,b){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>compare(a[i],v));}else if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))compare(a[k],v);}else{quantities++;const e=Math.abs(a-b);notebookError=Math.max(notebookError,e);assert(e<1e-10);}}
for(const[i,n]of outputs.entries()){const values=n.output.trim().split(/\r?\n/).map(s=>JSON.parse(s.slice(s.indexOf('{'))));compare(values,ref.expected_notebooks[i]);}
fs.writeFileSync(dir+'notebook-comparison.json',JSON.stringify({pass:true,quantities,maxError:notebookError},null,2));
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?JSON.stringify(body):null;const req=request({hostname:'127.0.0.1',port:8992,path,method,headers:data?{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(60000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const native=[];
for(const[i,nb]of notebooks.entries()){
 const id='ml03-'+randomUUID();try{
  await http('/api/notebook','POST',{notebook_id:id,setup_code:''});let combined='';const results=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const result=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!result.outputs.some(o=>o.type==='error'),JSON.stringify(result));results.push(result);combined+=result.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('');}
  assert.equal(combined.replace(/\r/g,''),outputs[i].output.replace(/\r/g,''));native.push({title:nb.title,results,output:combined});
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
const normalized=fs.readFileSync('content/machine-learning/neural-networks.mdx','utf8').replace(/\r\n/g,'\n');
fs.writeFileSync(dir+'native.json',JSON.stringify({pass:true,sourceHash:createHash('sha256').update(normalized).digest('hex'),notebooks:native},null,2));
console.log(JSON.stringify({...ref,plottedQuantities:points,notebooks:notebooks.length,cells:notebooks.reduce((s,n)=>s+n.cells.length,0)}));
