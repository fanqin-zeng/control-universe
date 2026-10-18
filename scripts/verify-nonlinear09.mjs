import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';import{execFileSync}from'node:child_process';import{createHash}from'node:crypto';import{extractNotebooks}from'./lib-mdx.mjs';
import {request} from 'node:http';import{randomUUID}from'node:crypto';
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port:8891,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},r=>{let raw='';r.on('data',s=>raw+=s);r.on('end',()=>{assert.equal(r.statusCode,200);resolve(JSON.parse(raw));});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const dir='.agent/semester-03/nonlinear-09/',source=fs.readFileSync('content/nonlinear/passivity-control.mdx','utf8'),mod={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/passivity.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod);
const cases=[[0,.2,true],[.8,.2,true],[6,.2,true],[0,0,true],[.8,.2,false]].map(params=>({params,result:mod.simulatePassivity(...params)}));
const file=dir+'actual-ts.json';fs.writeFileSync(file,JSON.stringify(cases));
const independent=JSON.parse(execFileSync('python',[dir+'reference.py',file],{encoding:'utf8'}));
const nbs=extractNotebooks(source);assert.equal(nbs.length,3);assert(nbs.every(nb=>nb.cells.length===1));
assert.equal(cases[1].result.initial,1.25);assert.equal(cases[1].result.rows[0][5],3);
assert(Math.abs(cases[1].result.final[1]-.9942935967)<1e-8);assert(cases[3].result.rows.every(a=>Math.abs(a[3]-1.25)<1e-7));assert(cases[4].result.rows.every(a=>a[1]===0));
const result={pass:true,sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),configs:5,nodes:cases.reduce((n,c)=>n+c.result.rows.length,0),independent};
result.notebooks=[];
for(const nb of nbs){const id='nonlinear09-'+randomUUID();try{await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const outputs=[];for(const code of[nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'));outputs.push(out.outputs.map(o=>o.type==='image'?{type:'image',bytes:o.data.length}:o));}result.notebooks.push({title:nb.title,outputs});}finally{await http('/api/notebook/'+id,'DELETE');}}
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
