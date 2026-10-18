import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';
import {execFileSync} from 'node:child_process';import {createHash,randomUUID} from 'node:crypto';import {request} from 'node:http';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/discrete-10/',key='discrete-sampled/event-triggered-control',read=p=>fs.readFileSync(p,'utf8');
const mod={};new Function('exports',ts.transpileModule(read('lib/event-triggered.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod);
const cases=[[.05,.1],[.05,.25],[.05,1],[.05,2],[.1,.1],[.1,.25],[.2,.25],[.2,1],[.5,.1],[.5,.25],[.5,1],[.5,2],[1.2,.1],[1.2,.25],[1.2,1],[1.2,2],[.05,.25,0]].map(([h,sigma,x0=1])=>({h,sigma,x0,result:mod.eventTriggered(h,sigma,x0)}));
for(const [h,s] of [[0,.25],[.051,.25],[.05,0],[.05,2.01],[.05,NaN],[.05,Infinity]])assert.throws(()=>mod.eventTriggered(h,s),RangeError);
assert.throws(()=>mod.eventTriggered(.05,.25,2),RangeError);
let axisMin=Infinity,axisMax=-Infinity;
for(const h of mod.eventCheckSteps)for(let i=2;i<=40;i++){
 const r=mod.eventTriggered(h,i/20);for(const [t,x]of [...r.curve,...r.baselineCurve]){assert(t>=0&&t<=6+1e-12);axisMin=Math.min(axisMin,x);axisMax=Math.max(axisMax,x);assert(x>=-2.2&&x<=2.2);}
}
fs.writeFileSync(dir+'axis-range.json',JSON.stringify({configs:195,axisMin,axisMax,pass:true})+'\n');
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(cases,null,2)+'\n');
const independent=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'actual-ts.json'],{encoding:'utf8',maxBuffer:12e6}));
const source=read('content/'+key+'.mdx'),nbs=extractNotebooks(source);assert.equal(nbs.length,2);assert.equal(nbs.reduce((n,b)=>n+b.cells.length,0),4);
const port=Number(process.env.JUPYTER_PORT||8891);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
let maxNumericError=0;let quantities=0;
function compare(a,e,path=''){if(Array.isArray(e)){assert.equal(a.length,e.length,path);e.forEach((v,i)=>compare(a[i],v,path+'['+i+']'));return;}if(e&&typeof e==='object'){for(const[k,v]of Object.entries(e))compare(a[k],v,path+'.'+k);return;}assert(Number.isFinite(a),path);const error=Math.abs(a-e);maxNumericError=Math.max(error,maxNumericError);quantities++;assert(error<=1e-9,`${path}: ${a} != ${e}, ${error}`);}
const queries=['{"default":default,"cases":cases,"origin":origin}','{"proof_values":proof_values,"miss_samples":miss_samples,"answer_values":answer_values}'];
const report={pass:true,sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),configs:cases.length,independent,notebooks:[]};
for(const[i,nb]of nbs.entries()){const id='discrete10-'+randomUUID();try{await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const outputs=[];for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out.outputs));outputs.push(out.outputs.map(o=>o.type==='image'?{type:'image',bytes:o.data.length}:o));}const audit=await http('/api/notebook/'+id+'/execute','POST',{code:'import json\nprint("AUDIT:"+json.dumps('+queries[i]+',allow_nan=False))'});assert(!audit.outputs.some(o=>o.type==='error'),JSON.stringify(audit.outputs));const values=JSON.parse(audit.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]);for(const[name,value]of Object.entries(values))compare(value,independent[name],name);report.notebooks.push({title:nb.title,outputs,values});}finally{await http('/api/notebook/'+id,'DELETE');}}
report.maxNumericError=maxNumericError;report.quantities=quantities;report.rendered=await renderedHeadings(source,key);assert.equal(report.rendered.h2.length,8);assert.equal(new Set(report.rendered.ids).size,report.rendered.ids.length);
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,sourceHash:report.sourceHash,configs:cases.length,notebooks:2,cells:4,maxNumericError,quantities,tsError:independent.max_ts_error}));
