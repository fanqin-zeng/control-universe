import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';
import {execFileSync} from 'node:child_process';import {request} from 'node:http';import {createHash,randomUUID} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/impl-08/',key='implementation/industrial-bus-protocols',actual={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/industrial-serial.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(actual);
execFileSync('python',[dir+'reference.py']);const ref=JSON.parse(fs.readFileSync(dir+'reference.json','utf8'));
let quantities=0,maxError=0;function near(a,b,tol=1e-10){
 if(b===null){assert.equal(a,null);return;}if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}
 if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}
 if(typeof b!=='number'){assert.equal(a,b);return;}assert(Number.isFinite(a));const err=Math.abs(a-b);assert(err<=tol,`${a} != ${b}`);maxError=Math.max(maxError,err);quantities++;
}
const cases=ref.cases.map(c=>actual.serialBudget(c.baud,c.registers,c.stations,c.period));cases.forEach((c,i)=>near(c,ref.cases[i]));
for(const v of ref.vectors){near(actual.serialCrc(v.data),v.crc);near(actual.serialFrame(v.data),v.frame);assert.equal(actual.serialCrc(v.frame),0);}
near(actual.serialRequest(),ref.request);near(actual.serialResponse(),ref.response);near(actual.serialDecode(ref.response),{accepted:true,reason:'accepted',registers:ref.decode.registers,temperature:ref.decode.temperature});
for(let n=1;n<=16;n++){assert.equal(actual.serialRequest(n).length,8);const data=actual.serialResponse(n),d=actual.serialDecode(data,n);assert(d.accepted);assert.equal(d.registers.length,n);assert.equal(d.temperature,n<2?null:-10);}
for(let k=0;k<72;k++){const b=[...ref.response];b[Math.floor(k/8)]^=1<<(k%8);assert.equal(actual.serialDecode(b).reason,'crc');}
const faults=actual.serialFaults();assert.deepEqual(faults.map(f=>f.reason),['accepted','crc','length','unit','function','length','exception-2']);
assert.equal(actual.serialDecode([1,3,NaN]).reason,'byte');
for(const args of [[9599,2,1,20],[115201,2,1,20],[19200,0,1,20],[19200,17,1,20],[19200,2,0,20],[19200,2,5,20],[19200,2,1,NaN]])assert.throws(()=>actual.serialBudget(...args),RangeError);
assert.throws(()=>actual.serialCrc([256]),RangeError);assert.throws(()=>actual.serialRequest(1.5),RangeError);assert.throws(()=>actual.serialResponse(0),RangeError);assert.throws(()=>actual.serialDecode([],0),RangeError);
const tsQuantities=quantities,tsError=maxError;fs.writeFileSync(dir+'actual-ts.json',JSON.stringify({cases,faults})+'\n');
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),nbs=extractNotebooks(source);assert.equal(nbs.length,3);
const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const outputs=[],values=[],queries=['dict(protocol=protocol,decoded=values)','dict(default=default,cases=all_cases,table=table,basic=basic)','fault_results'];
for(const[i,nb]of nbs.entries()){
 const id='impl08-rank1-'+randomUUID();try{await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const all=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));all.push(out.outputs);}
  const out=await http('/api/notebook/'+id+'/execute','POST',{code:'print("AUDIT:"+json.dumps('+queries[i]+'))'});assert(!out.outputs.some(o=>o.type==='error'));values.push(JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]));outputs.push(all);
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
near(values[0].protocol,{exampleCrc:0x1241,request:ref.request,response:ref.response,requestCrc:0x0bc4,responseCrc:0x1cff,requestLength:8,responseLength:9,rawSigned:-100});near(values[0].decoded,actual.serialDecode(ref.response));
near(values[1].default,ref.default);near(values[1].cases,ref.cases);values[1].table.forEach(q=>near(q,ref.cases.find(v=>['baud','registers','stations','period'].every(k=>v[k]===q[k]))));near(values[1].basic,{charBits:11,wireMs:9.739583333333334,responsePayload:4});
near(values[2],faults);
const rendered=await renderedHeadings(source,key);assert.equal(rendered.h2.length,10);assert.equal(new Set(rendered.ids).size,rendered.ids.length);
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),configs:cases.length,tsError,tsQuantities,maxError,quantities,values,rendered,outputs};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,configs:cases.length,tsError,tsQuantities,maxError,quantities,sourceHash:report.sourceHash}));
