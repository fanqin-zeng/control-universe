import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';
import {execFileSync} from 'node:child_process';import {request} from 'node:http';import {createHash,randomUUID} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/impl-05/',key='implementation/embedded-implementation',actual={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/embedded-control.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(actual);
execFileSync('python',[dir+'reference.py']);const ref=JSON.parse(fs.readFileSync(dir+'reference.json','utf8'));
let quantities=0,maxError=0;function near(a,b,tol=1e-10){
 if(b===null){assert.equal(a,null);return;}if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}
 if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}
 if(typeof b!=='number'){assert.equal(a,b);return;}assert(Number.isFinite(a));const err=Math.abs(a-b);assert(err<=tol,`${a} != ${b}`);maxError=Math.max(maxError,err);quantities++;
}
const cases=ref.cases.map(c=>actual.embeddedExperiment(c.bits,c.slots,c.target));cases.forEach((c,i)=>near(c,ref.cases[i]));
ref.conversions.forEach(c=>{assert.equal(actual.adcCode(c.input,c.bits),c.code);near(100*actual.adcCode(c.input,c.bits)/(2**c.bits-1),c.read);});
for(const args of [[3,100,60],[13,100,60],[8.5,100,60],[8,0,60],[8,1001,60],[8,100,NaN],[8,100,121]])assert.throws(()=>actual.embeddedExperiment(...args),RangeError);
for(const v of [-1,0,.37,.375,1,1.2])assert.equal(actual.pwmCount(v,100),v<0?0:v>1?100:Math.floor(v*100+.5));
assert.throws(()=>actual.consumeSample(0,{seq:1,stamp:0,code:256},0),RangeError);
const eventExpected=[{age:100,reason:'accepted',accepted:true,lastSeq:10,pwm:100},{age:200,reason:'duplicate-or-old',accepted:false,lastSeq:10,pwm:0},{age:600,reason:'stale',accepted:false,lastSeq:10,pwm:0},{age:100,reason:'accepted',accepted:true,lastSeq:12,pwm:100}];
let last=9;const events=[[10,1000,1100],[10,1000,1200],[11,2000,2600],[12,2**32-50,50]].map(([seq,stamp,now])=>{const v=actual.consumeSample(last,{seq,stamp,code:51},now);last=v.lastSeq;return v;});near(events,eventExpected);
const boundaries=[actual.consumeSample(12,{seq:13,stamp:1000,code:51},1500),actual.consumeSample(12,{seq:13,stamp:1000,code:51},1501),actual.consumeSample(12,{seq:11,stamp:1000,code:51},1100),actual.consumeSample(2**32-1,{seq:0,stamp:1000,code:51},1100)];
assert.deepEqual(boundaries.map(v=>v.accepted),[true,false,false,true]);assert.equal(boundaries[0].age,500);assert.equal(boundaries[1].age,501);
const tsQuantities=quantities,tsError=maxError;fs.writeFileSync(dir+'actual-ts.json',JSON.stringify({cases,events,boundaries})+'\n');
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),nbs=extractNotebooks(source);assert.equal(nbs.length,3);
const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const outputs=[],values=[],queries=['dict(budget=budget,conversions=conversion_results)','dict(default=default,table=table,equilibrium=equilibrium,offset=60-equilibrium)','dict(events=event_results,boundaries=boundary_results)'];
for(const[i,nb]of nbs.entries()){
 const id='impl05-rank1-'+randomUUID();try{await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const all=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));all.push(out.outputs);}
  const out=await http('/api/notebook/'+id+'/execute','POST',{code:'print("AUDIT:"+json.dumps('+queries[i]+'))'});assert(!out.outputs.some(o=>o.type==='error'));values.push(JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]));outputs.push(all);
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
near(values[0].conversions,ref.conversions);near(values[0].budget,{step8:100/255,bound8:50/255,step12:100/4095,bound12:50/4095,pwmHalf100:.005,code20:51,code50:128,pwm37:37,pwmHalf:38,pwmFull:100});
const {points,...def}=ref.default;near(values[1].default,def);near(values[1].equilibrium,164/3.4);near(values[1].offset,60-164/3.4);
for(const r of values[1].table){const c=ref.cases.find(c=>c.bits===r.bits&&c.slots===r.slots&&c.target===r.target);near(r,Object.fromEntries(Object.keys(r).map(k=>[k,c[k]])));}
near(values[2].events,eventExpected);near(values[2].boundaries,boundaries);
const rendered=await renderedHeadings(source,key);assert.equal(rendered.h2.length,9);assert.equal(new Set(rendered.ids).size,rendered.ids.length);
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),configs:cases.length,tsError,tsQuantities,maxError,quantities,values,rendered,outputs};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,configs:cases.length,tsError,tsQuantities,maxError,quantities,sourceHash:report.sourceHash}));
