import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';import {execFileSync} from 'node:child_process';import {request} from 'node:http';import {createHash,randomUUID} from 'node:crypto';import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/impl-06/',key='implementation/realtime-control',actual={};new Function('exports',ts.transpileModule(fs.readFileSync('lib/realtime-scheduling.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(actual);
execFileSync('python',[dir+'reference.py']);const ref=JSON.parse(fs.readFileSync(dir+'reference.json','utf8'));
let quantities=0,maxError=0;function near(a,b,tol=1e-10){if(b===null){assert.equal(a,null);return;}if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}if(typeof b!=='number'){assert.equal(a,b);return;}assert(Number.isFinite(a));const err=Math.abs(a-b);assert(err<=tol,`${a} != ${b}`);maxError=Math.max(err,maxError);quantities++;}
const cases=[];for(const c of ref.cases){const v=actual.schedulingExperiment(c.caseId,c.c3,c.policy);const {caseId,c3,policy,...expected}=c;near(v,expected);cases.push({caseId,c3,...v});
 // Every released job is conserved, even after missing its deadline.
 assert.equal(v.jobs.length,v.tasks.reduce((n,t)=>n+Math.ceil(60/t.period),0));near(v.work,v.trace.filter(i=>i>=0).length/2);assert(v.jobs.every(j=>j.remaining>=0&&j.remaining<=v.tasks[j.task].cost));
}
for(const args of [[-1,3,'RMS'],[4,3,'RMS'],[0,0,'EDF'],[0,15,'EDF'],[0,3,'bad']])assert.throws(()=>actual.schedulingExperiment(...args),RangeError);
for(const tasks of [[],[{period:0,cost:1}],[{period:1,cost:NaN}],[{period:2.1,cost:1}]])assert.throws(()=>actual.scheduleTasks(tasks),RangeError);
// Completion exactly at deadline; a missed job is not silently replaced.
const exact=actual.scheduleTasks([{period:2,cost:2}],'RMS',4);assert.equal(exact.misses,0);assert.deepEqual(exact.first,[2]);
const overload=actual.scheduleTasks([{period:2,cost:3}],'EDF',6);assert.equal(overload.jobs.length,3);assert.equal(overload.jobs[0].finish,3);assert.equal(overload.jobs[1].finish,6);assert.equal(overload.misses,3);assert.equal(overload.jobs[2].remaining,3);
const tsQuantities=quantities,tsError=maxError;fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(cases)+'\n');
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),nbs=extractNotebooks(source);assert.equal(nbs.length,4);const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const values=[],outputs=[],queries=['dict(default={k:v for k,v in default.items() if k not in ["trace","jobs"]},comparison=comparison)','analysis','inversion_results','dict(implementation=implementation,lookup=lookup,watchdog=watchdog)'];
for(const[i,nb]of nbs.entries()){
 const id='impl06-rank1-'+randomUUID();try{await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const all=[];
 for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const o=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!o.outputs.some(o=>o.type==='error'),JSON.stringify(o));all.push(o.outputs);}
 const out=await http('/api/notebook/'+id+'/execute','POST',{code:'print("AUDIT:"+json.dumps('+queries[i]+'))'});assert(!out.outputs.some(o=>o.type==='error'));values.push(JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]));outputs.push(all);
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
for(const row of values[0].comparison){const c=ref.cases.find(c=>c.caseId===row.caseId&&c.c3===3&&c.policy===row.policy);near(row,{U:c.utilization,first:c.first,misses:c.misses,due:c.due,pending:c.pending});}
near(values[0].default,{U:.55,bound:ref.facts.bounds['3'],first:[1,3,7],misses:0,due:21,pending:0});
const a=values[1];near(a.bounds,ref.facts.bounds);near(a.limit,ref.facts.limit);near(a,{ex1U:ref.facts.exercise1U,ex1C4:ref.facts.exercise1C4,ex2U:5/6,ex2First:[2,4],ex5U:ref.facts.exercise5U,ex5Order:[100,1000,2000,5000,500000],latencyUs:20/168,latencyPercent:20/168});
near(a.defaultResponse.map(r=>r.response),[1,3,7]);near(a.defaultResponse[2].iterations,[3,6,7,7]);near(a.highResponse.map(r=>r.response),[2,8]);assert.equal(a.highResponse[1].pass_,false);near(a.ex2Response.map(r=>r.response),[2,4]);
// Independent event oracle also verifies the original half-ms exercise task set.
const ex1=actual.scheduleTasks([{period:2,cost:.5},{period:5,cost:1},{period:10,cost:1.5},{period:20,cost:2}]);assert(ex1.misses===0);near(a.ex1Response.map(r=>r.response),ex1.response.map(r=>r.response));
for(const row of values[2]){near(row,{blocking:row.inherit?1:1+row.medium,response:row.inherit?4:4+row.medium});}
near(values[3].implementation,Object.fromEntries(['qA','qB','qProduct','qWord','qValue','qError','qAdd','qHalfProduct','qMinSquared'].map(k=>[k,ref.facts[k]])));near(values[3].implementation,{q15Resolution:2**-15,q31Resolution:2**-31,q114Resolution:2**-14});
near(values[3].implementation,{q075:24576,q0125:4096,qSum:28672,qHalf:16384,qHalfWide:268435456,qHalfLow:0,qHalfValue:.25,qMinSquareRaw:32768});near(a.ex1Increase,ref.facts.exercise1C4-2);
near(a.ex2Jobs.map(j=>({task:j.task,release:j.release,deadline:j.deadline,finish:j.finish})),[{task:0,release:0,deadline:4,finish:2},{task:1,release:0,deadline:6,finish:4},{task:0,release:4,deadline:8,finish:6},{task:1,release:6,deadline:12,finish:8},{task:0,release:8,deadline:12,finish:10}]);
for(const row of values[3].lookup){near(row.tableBytes,row.n*2);assert(row.directSampledMax<=row.directBound&&row.linearSampledMax<=row.linearBound);near(row.directBound,2*Math.PI/row.n);near(row.linearBound,(2*Math.PI/row.n)**2/8);}
near(values[3].watchdog.map(v=>v.feed),[false,true,true,true,false]);
const old=fs.readFileSync(dir+'source-before.mdx','utf8'),rendered=await renderedHeadings(source,key),before=await renderedHeadings(old,key);assert.equal(rendered.h2.length,9);assert.deepEqual(rendered.h2.map(h=>h.text),before.h2.map(h=>h.text));assert.equal(new Set(rendered.ids).size,rendered.ids.length);
const oldH3=before.headings.filter(h=>h.level===3);assert(oldH3.every(h=>rendered.ids.includes(h.id)),'Every old H3 anchor must remain');
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),configs:cases.length,tsQuantities,tsError,quantities,maxError,values,outputs,rendered,oldAnchors:oldH3.map(h=>h.id)};fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,configs:cases.length,tsQuantities,tsError,quantities,sourceHash:report.sourceHash}));
