import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';
import {execFileSync} from 'node:child_process';import {request} from 'node:http';import {createHash,randomUUID} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/impl-07/',key='implementation/networked-control',actual={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/network-feedback.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(actual);
execFileSync('python',[dir+'reference.py']);const ref=JSON.parse(fs.readFileSync(dir+'reference.json','utf8'));
let quantities=0,maxError=0;function near(a,b,tol=1e-10){
 if(b===null){assert.equal(a,null);return;}if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}
 if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}
 if(typeof b!=='number'){assert.equal(a,b);return;}assert(Number.isFinite(a));const err=Math.abs(a-b);assert(err<=tol*(1+Math.abs(b)),`${a} != ${b}`);maxError=Math.max(maxError,err);quantities++;
}
const cases=ref.cases.map(c=>actual.networkExperiment(c.K,c.mode,c.policy));cases.forEach((c,i)=>near(c,ref.cases[i]));
for(const K of [4,10,12])near(actual.networkPoles(K),{clean:ref.roots[K].clean,rho:ref.roots[K].rho});
for(const args of [[0,'clean','fresh'],[13,'clean','fresh'],[4.5,'clean','fresh'],[NaN,'clean','fresh'],[4,'bad','fresh'],[4,'clean','bad']])assert.throws(()=>actual.networkExperiment(...args),RangeError);
const tsQuantities=quantities,tsError=maxError;fs.writeFileSync(dir+'actual-ts.json',JSON.stringify({cases})+'\n');
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),nbs=extractNotebooks(source);assert.equal(nbs.length,3);
const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const outputs=[],values=[],queries=['dict(roots=root_results,first_steps=first_steps)','dict(default=default,results=results)','replay_results'];
for(const[i,nb]of nbs.entries()){
 const id='impl07-rank1-'+randomUUID();try{await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const all=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));all.push(out.outputs);}
  const out=await http('/api/notebook/'+id+'/execute','POST',{code:'print("AUDIT:"+json.dumps('+queries[i]+'))'});assert(!out.outputs.some(o=>o.type==='error'));values.push(JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]));outputs.push(all);
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
near(values[0].first_steps,{clean:.7,delay:1.1,uclean:-4,udelay:0});
values[0].roots.forEach(v=>{const q=ref.roots[v.K];near(v.clean,q.clean);near(v.rho,q.rho);near(v.real,q.delay[0][0]);near(v.imag,Math.abs(q.delay[0][1]));});
near(values[1].default,ref.default);values[1].results.forEach(v=>near(v,ref.cases.find(q=>q.K===v.K&&q.mode===v.mode&&q.policy===v.policy)));
const seq={fresh:[null,1,1,3,3,3],arrival:[null,1,0,3,2,2]},payload={0:1,1:.7,2:.49,3:.343};
for(const policy of ['fresh','arrival'])near(values[2][policy],seq[policy].map((s,k)=>({k,seq:s,value:s===null?0:payload[s],age:s===null?null:(k-s)*.1})));
const rendered=await renderedHeadings(source,key);assert.equal(rendered.h2.length,10);assert.equal(new Set(rendered.ids).size,rendered.ids.length);
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),configs:cases.length,tsError,tsQuantities,maxError,quantities,values,rendered,outputs};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,configs:cases.length,tsError,tsQuantities,maxError,quantities,sourceHash:report.sourceHash}));
