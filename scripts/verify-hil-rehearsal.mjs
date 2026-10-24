import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';
import {execFileSync} from 'node:child_process';import {request} from 'node:http';import {createHash,randomUUID} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/impl-09/',key='implementation/hil-rapid-prototyping',actual={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/hil-rehearsal.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(actual);
execFileSync('python',[dir+'reference.py']);const ref=JSON.parse(fs.readFileSync(dir+'reference.json','utf8'));
let quantities=0,maxError=0;function near(a,b,tol=1e-10){
 if(b===null){assert.equal(a,null);return;}if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}
 if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}
 if(typeof b!=='number'){assert.equal(a,b);return;}assert(Number.isFinite(a));const err=Math.abs(a-b);assert(err<=tol,`${a} != ${b}`);maxError=Math.max(maxError,err);quantities++;
}
const cases=ref.cases.map(c=>actual.hilExperiment(c.steps,c.mode,c.policy,c.costMs));cases.forEach((c,i)=>near(c,ref.cases[i]));
for(const args of [[0,'clean','zero3',4],[3,'clean','zero3',4],[10,'bad','zero3',4],[10,'clean','bad',4],[10,'clean','zero3',0],[10,'clean','zero3',31],[10,'clean','zero3',4.5],[10,'clean','zero3',NaN]])assert.throws(()=>actual.hilExperiment(...args),RangeError);
for(const c of cases){assert.equal(c.points.length,101);assert.equal(c.jobs.length,100);assert.equal(c.points[0].u,0);assert.equal(c.points[1].x,0);assert(c.points.every(p=>p.x>=0&&p.x<=1));for(const j of c.jobs)assert.equal(j.onTime,j.completeMs<=j.deadlineMs);}
const burst=actual.hilExperiment(10,'burst','zero3');assert.deepEqual(burst.points.filter(p=>p.zero).map(p=>p.k),[23,24,25,26,27,28,29,30]);assert.equal(burst.points[31].failures,0);
assert.equal(actual.hilExperiment(10,'clean','zero3',20).misses,0);assert.equal(actual.hilExperiment(10,'clean','zero3',21).misses,100);
const tsQuantities=quantities,tsError=maxError;fs.writeFileSync(dir+'actual-ts.json',JSON.stringify({cases})+'\n');
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),nbs=extractNotebooks(source);assert.equal(nbs.length,3);
const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const outputs=[],values=[],queries=['dict(default=default,first=first,equilibrium=equilibrium)','dict(cases=all_cases,table=table)','dict(bounds=bounds,boundary=boundary,events=events)'];
for(const[i,nb]of nbs.entries()){
 const id='impl09-rank1-'+randomUUID();try{await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const all=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));all.push(out.outputs);}
  const out=await http('/api/notebook/'+id+'/execute','POST',{code:'print("AUDIT:"+json.dumps('+queries[i]+'))'});assert(!out.outputs.some(o=>o.type==='error'));values.push(JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]));outputs.push(all);
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
near(values[0].default,ref.default);near(values[0].first,ref.default.points.slice(0,3));near(values[0].equilibrium,2/3);
near(values[1].cases,ref.cases);near(values[1].table,ref.table);near(values[2].bounds,ref.bounds);for(const q of values[2].boundary)near(q,Object.fromEntries(Object.keys(q).map(k=>[k,ref.cases.find(c=>c.steps===10&&c.mode==='clean'&&c.policy==='zero3'&&c.costMs===q.costMs)[k]])));
near(values[2].events,{firstZeroFrame:23,lastZeroFrame:30,recoveredFrame:31,submitted:100,states:101});
const rendered=await renderedHeadings(source,key);assert.equal(rendered.h2.length,10);assert.equal(new Set(rendered.ids).size,rendered.ids.length);
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),configs:cases.length,tsError,tsQuantities,maxError,quantities,values,rendered,outputs};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,configs:cases.length,tsError,tsQuantities,maxError,quantities,sourceHash:report.sourceHash}));
