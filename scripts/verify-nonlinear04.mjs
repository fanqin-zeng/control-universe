import{request}from'node:http';
import{readFileSync,writeFileSync,unlinkSync}from'node:fs';import{execFileSync}from'node:child_process';import{createHash,randomUUID}from'node:crypto';import assert from'node:assert/strict';import ts from'typescript';import{extractNotebooks}from'./lib-mdx.mjs';import{renderedHeadings}from'./rendered-headings.mjs';import{requireSuccess}from'./verify-reproducibility.mjs';
function directHttp(port,path,method='GET',body){return new Promise((resolve,reject)=>{const data=body===undefined?null:Buffer.from(JSON.stringify(body));const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let text='';res.setEncoding('utf8');res.on('data',c=>text+=c);res.on('end',()=>{let json;try{json=JSON.parse(text);}catch{}resolve({status:res.statusCode,text,json});});});req.setTimeout(600000,()=>req.destroy(Error('HTTP timeout 600s')));req.on('error',reject);if(data)req.write(data);req.end();});}
const dir='.agent/semester-03/nonlinear-04/',source=readFileSync('content/nonlinear/describing-function.mdx','utf8');
const e={};new Function('exports',ts.transpileModule(readFileSync('lib/describing-function.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(e);
const df=[],hb=[];
for(const type of ['relay','saturation','deadzone','hysteresis','backlash'])for(const k of [.5,1,2])for(const a of [.1,.3,1,2])for(const A of new Set([.5,1,2,5,a,Math.max(.01,a-1e-5),a+1e-5]))if(A>0)df.push({type,k,a,A,...e.describingN(type,A,k,a)});
for(let i=0;i<=15;i++)for(let j=0;j<=15;j++)for(let q=0;q<=8;q++)for(const type of ['relay','saturation']){const K=.5+.1*i,a=.5+.1*j,T=.2+.1*q,r=e.harmonicCandidate(type,K,a,T);hb.push({type,K,a,T,...r,g:e.describingG(r.omega,K,a,T)});}
for(const args of [['relay',0,1,1],['saturation',1,-1,1],['backlash',1,1,-1]])assert.throws(()=>e.describingN(...args),RangeError);
for(const args of [[0,1,1,1],[1,0,1,1],[1,1,-1,1]])assert.throws(()=>e.describingG(...args),RangeError);
const temp='logs/nonlinear04-actual.json';let reference;try{writeFileSync(temp,JSON.stringify({df,hb}));reference=JSON.parse(execFileSync('python',[dir+'reference.py',temp],{encoding:'utf8',maxBuffer:4*1024*1024}));}finally{try{unlinkSync(temp);}catch{}}
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
const report={pass:true,sourceHash:hash(source),numericsHash:hash(readFileSync('lib/describing-function.ts','utf8')),componentHashes:Object.fromEntries(['describing-function','nyquist-limit-cycle'].map(n=>[n,hash(readFileSync('components/wiki/'+n+'-explorer.tsx','utf8'))])),component:reference,defaults:{df:e.describingN('saturation',2,1,1),hb:e.harmonicCandidate('relay',1,1,.5)},notebooks:[]};
writeFileSync(dir+'component-final.json',JSON.stringify(report,null,2));
if(process.argv.includes('--components-only')){console.log(JSON.stringify(reference));process.exit(0);}
const notebooks=extractNotebooks(source);assert.equal(notebooks.length,7,'Every actual notebook must be visible to the extractor');assert.equal(notebooks.reduce((n,b)=>n+b.cells.length,0),22);
for(const [index,nb]of notebooks.entries()){
 console.log('Running',index+1,nb.title);const id='nonlinear04-'+randomUUID();try{assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'source code');await execute(nb.setup.value);const cells=[];for(const [ci,c]of nb.cells.entries()){const begin=Date.now();const out=await execute(c.value);console.log(' cell',ci+1,Date.now()-begin,'ms');cells.push({milliseconds:Date.now()-begin,outputs:out.map(o=>o.type==='image'?{type:'image',bytes:o.data.length}:o)});}let refinement=null;
if(index===2){const code=`import json
refinement=[]
for tc in [.5,.05]:
 ts1,es1=sim_relay(80.,5e-5,tc,1.)
 mm=measure(ts1,es1,40.,5e-5)
 refinement.append(dict(Tc=tc,dt=5e-5,**mm))
print(json.dumps(refinement))`;const out=await execute(code);refinement=JSON.parse(out.filter(o=>o.type==='text'||o.type==='stream').map(o=>o.text??'').join(''));}
const auditText=(await execute('import json\nprint(json.dumps(RUN_AUDIT))')).filter(o=>o.type==='text'||o.type==='stream').map(o=>o.text??'').join('');
const runs=JSON.parse(auditText);assert(runs.every(a=>a.n>0&&Math.abs(a.last-(a.n-1)*a.dt)<1e-9));
let metrics=null;if(index===4){const txt=(await execute('import json\nprint(json.dumps(SUMMARY))')).filter(o=>o.type==='text'||o.type==='stream').map(o=>o.text??'').join('');metrics=JSON.parse(txt);}
report.notebooks.push({title:nb.title,cells,runs,metrics,refinement});}finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const textOutputs=cell=>cell.outputs.filter(o=>o.type==='text'||o.type==='stream').map(o=>o.text??'').join('');
const relayRows=[...textOutputs(report.notebooks[2].cells[1]).matchAll(/实测 基波=([0-9.]+).*?周期=([0-9.]+)/g)];assert.equal(relayRows.length,2);
const comparisons=[];
for(const [i,key] of ['relay-0.5','relay-0.05'].entries()){const ref=reference.continuous[key],amp=Number(relayRows[i][1]),period=Number(relayRows[i][2]);assert(Math.abs(amp/ref.amplitude-1)<.005&&Math.abs(period/ref.period-1)<.005);comparisons.push({key,amp,period,reference:ref});}
for(const [index,key]of [[0,'hysteresis-2'],[1,'hysteresis-3'],[2,'saturation-6'],[4,'inverse']]){const actual=report.notebooks[4].metrics[index],ref=reference.continuous[key];assert(Math.abs(actual.meas/ref.amplitude-1)<.005&&Math.abs(actual.Tm/ref.period-1)<.005);comparisons.push({key,amp:actual.meas,period:actual.Tm,reference:ref});}
assert(Math.abs(report.notebooks[4].metrics[3].meas-reference.continuous['saturation-2'].peak30to40)<1e-4);
for(const actual of report.notebooks[2].refinement){const ref=reference.continuous['relay-'+actual.Tc],base=comparisons.find(c=>c.key==='relay-'+actual.Tc);assert(Math.abs(actual.amp-ref.amplitude)<Math.abs(base.amp-ref.amplitude));assert(Math.abs(actual.per-ref.period)<Math.abs(base.period-ref.period));}
const compositeText=textOutputs(report.notebooks[3].cells[3]),composite=/实测 A2 基波 = ([0-9.]+)/.exec(compositeText);assert(composite);assert(Math.abs(Number(composite[1])/reference.continuous.composite.amplitude-1)<.005);
for(const m of [...textOutputs(report.notebooks[5].cells[0]).matchAll(/实测: 基波 ([0-9.]+).*?周期 ([0-9.]+)/g)].map((m,i)=>({m,key:['resonance-0.02','resonance-0.1','resonance-0.2'][i]}))){const ref=reference.continuous[m.key];assert(Math.abs(Number(m.m[1])/ref.amplitude-1)<.005&&Math.abs(Number(m.m[2])/ref.period-1)<.005);}
report.independentComparisons=comparisons;
const h=await renderedHeadings(source,'nonlinear/describing-function'),old=JSON.parse(readFileSync(dir+'baseline-headings.json','utf8'));old.ids.forEach(id=>assert(h.ids.includes(id),id));assert.equal(new Set(h.ids).size,h.ids.length);report.oldIds=old.ids.length;writeFileSync(dir+'headings.json',JSON.stringify(h,null,2)+'\n');writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,component:reference,defaults:report.defaults,oldIds:report.oldIds,notebooks:report.notebooks.length}));
