import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';
import {execFileSync} from 'node:child_process';import {request} from 'node:http';import {createHash,randomUUID} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/impl-10/',key='implementation/implementation-case-study',actual={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/implementation-case.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(actual);
execFileSync('python',[dir+'reference.py']);const ref=JSON.parse(fs.readFileSync(dir+'reference.json','utf8'));
let quantities=0,maxError=0;function near(a,b,tol=1e-10){
 if(b===null){assert.equal(a,null);return;}if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}
 if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}
 if(typeof b!=='number'){assert.equal(a,b);return;}assert(Number.isFinite(a));const err=Math.abs(a-b);assert(err<=tol,`${a} != ${b}`);maxError=Math.max(maxError,err);quantities++;
}
const cases=ref.cases.map(c=>actual.implementationCase(c.bits,c.mode,c.path,c.costMs));cases.forEach((c,i)=>near(c,ref.cases[i],1e-9));
cases.forEach((c,i)=>c.points.forEach((p,k)=>{
 for(const name of ['u','measured','integral','valid','stale','degraded','saturated'])assert.equal(p[name],ref.cases[i].points[k][name],`${i}/${k}/${name}`);
}));
for(const args of [[3,'nominal','guarded',4],[8,'bad','guarded',4],[8,'nominal','bad',4],[8,'nominal','guarded',0],[8,'nominal','guarded',121]])assert.throws(()=>actual.implementationCase(...args),RangeError);
const drop=actual.implementationCase(8,'drop');assert.deepEqual(drop.points.filter(p=>p.degraded).map(p=>p.k),Array.from({length:13},(_,i)=>i+102));assert(drop.points[115].valid);assert.equal(actual.implementationCase(8,'nominal','guarded',100).invalid,0);assert.equal(actual.implementationCase(8,'nominal','guarded',101).invalid,300);
const tsQuantities=quantities,tsError=maxError;fs.writeFileSync(dir+'actual-ts.json',JSON.stringify({cases})+'\n');
if(process.argv.includes('--ts-only')){console.log(JSON.stringify({pass:true,configs:cases.length,tsQuantities,tsError}));process.exit(0);}
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),nbs=extractNotebooks(source);assert.equal(nbs.length,3);
const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const outputs=[],values=[],queries=['dict(default=default,first=first,quantization=quantization)','dict(cases=all_cases,table=table)','dict(bounds=bounds,boundary=boundary,events=events)'];
for(const[i,nb]of nbs.entries()){
 const id='impl10-rank1-'+randomUUID();try{await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const all=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));all.push(out.outputs);}
  const out=await http('/api/notebook/'+id+'/execute','POST',{code:'print("AUDIT:"+json.dumps('+queries[i]+'))'});assert(!out.outputs.some(o=>o.type==='error'));values.push(JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]));outputs.push(all);
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
near(values[0].default,ref.default);near(values[0].first,ref.first);near(values[0].quantization,{measurementStep:4/255,outputStep:1/255,measurementHalf:2/255});
near(values[1].cases,ref.cases);near(values[1].table,ref.table);near(values[2].bounds,ref.bounds);near(values[2].boundary,ref.boundary);near(values[2].events,ref.events);
const rendered=await renderedHeadings(source,key);assert.equal(rendered.h2.length,10);assert.equal(new Set(rendered.ids).size,rendered.ids.length);
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),configs:cases.length,tsError,tsQuantities,maxError,quantities,values,rendered,outputs};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,configs:cases.length,tsError,tsQuantities,maxError,quantities,sourceHash:report.sourceHash}));
