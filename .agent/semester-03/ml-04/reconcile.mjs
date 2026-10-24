import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {request} from 'node:http';import {randomUUID,createHash} from 'node:crypto';import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/ml-04/',m={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/autodiff-training.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m);
const cases={runs:[],gradients:[]};let plotted=0;
for(const delta of [0,.3])for(const eta of m.learningRates)for(const budget of m.budgets)for(const initial of Object.values(m.initializations)){
 const result=m.fit(m.trainingData(delta),m.validationData,eta,budget,initial);cases.runs.push({config:{delta,eta,budget,initial},result});
 for(const row of result.history)for(const loss of [row.train,row.validation]){const y=Math.log10(Math.max(loss,1e-12));assert(y>=-12&&y<=6);assert(row.step>=0&&row.step<=200);plotted++;}
}
for(const delta of [0,.3])for(let i=0;i<20;i++){
 const p=[-.8+i/10,.1-i/100,.7-i/30,-.2+i/50];cases.gradients.push({p,delta,result:m.gradient(p,m.trainingData(delta))});
}
const q=new m.Scalar(3),s=q.add(q),loss=s.mul(s).mul(.5);loss.backward();assert.equal(q.grad,12);loss.backward();assert.equal(q.grad,12);
assert.throws(()=>m.fit(m.trainingData(),m.validationData,-1,200,[.5,0,.5,0]),RangeError);
fs.writeFileSync(dir+'ts-cases.json',JSON.stringify(cases));const ref=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'ts-cases.json'],{encoding:'utf8',maxBuffer:10000000}));
fs.writeFileSync(dir+'reference.json',JSON.stringify({...ref,plottedQuantities:plotted},null,2));
const source=fs.readFileSync('content/machine-learning/autodiff-optimization.mdx','utf8').replace(/\r\n/g,'\n');const notebooks=extractNotebooks(source);assert.equal(notebooks.length,2);const python=[];let quantities=0,maxError=0;
function compare(a,b){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>compare(a[i],v));}else if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))compare(a[k],v);}else if(typeof b==='string'||b===null)assert.equal(a,b);else{const e=Math.abs(a-b);quantities++;maxError=Math.max(maxError,e);assert(e<1e-8+Math.abs(b)*1e-11,`${a} != ${b}`);}}
for(const[i,n]of notebooks.entries()){
 const output=execFileSync('python',['-c',n.setup.value+'\n'+n.cells.map(c=>c.value).join('\n')],{encoding:'utf8'});const values=output.trim().split(/\r?\n/).map(s=>JSON.parse(s));compare(values,ref.expected_notebooks[i]);python.push({title:n.title,output,values});
}
fs.writeFileSync(dir+'raw-python.json',JSON.stringify(python,null,2));fs.writeFileSync(dir+'notebook-comparison.json',JSON.stringify({pass:true,quantities,maxError},null,2));
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?JSON.stringify(body):null;const req=request({hostname:'127.0.0.1',port:8992,path,method,headers:data?{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(60000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const native=[];
for(const[i,n]of notebooks.entries()){
 const id='ml04-'+randomUUID();try{
  await http('/api/notebook','POST',{notebook_id:id,setup_code:''});let combined='';const outputs=[];
  for(const code of [n.setup.value,...n.cells.map(c=>c.value)]){const r=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!r.outputs.some(o=>o.type==='error'),JSON.stringify(r));outputs.push(r);combined+=r.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('');}
  const values=combined.trim().split(/\r?\n/).map(s=>JSON.parse(s));compare(values,ref.expected_notebooks[i]);
  let audit=null;
  if(i===0){const r=await http('/api/notebook/'+id+'/execute','POST',{code:'print(json.dumps(dict(q=q.data,s=s.data,dL_ds=s.grad,dL_dq=q.grad)))'});assert(!r.outputs.some(o=>o.type==='error'));audit={outputs:r.outputs,values:JSON.parse(r.outputs.filter(o=>o.type==='stream').map(o=>o.text).join(''))};compare(audit.values,{q:3,s:6,dL_ds:6,dL_dq:12});}
  native.push({title:n.title,outputs,output:combined,values,audit});
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
fs.writeFileSync(dir+'native.json',JSON.stringify({pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),notebooks:native},null,2));
console.log(JSON.stringify({pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),runs:cases.runs.length,gradientCases:cases.gradients.length,referenceError:ref.max_error,referenceQuantities:ref.quantities,notebookQuantities:quantities,maxNotebookError:maxError,plottedQuantities:plotted}));
