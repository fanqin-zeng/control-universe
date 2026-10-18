import{request}from'node:http';
import{readFileSync,writeFileSync,unlinkSync}from'node:fs';import{execFileSync}from'node:child_process';import{createHash,randomUUID}from'node:crypto';import assert from'node:assert/strict';import ts from'typescript';import{extractNotebooks}from'./lib-mdx.mjs';import{renderedHeadings}from'./rendered-headings.mjs';import{requireSuccess}from'./verify-reproducibility.mjs';
function directHttp(port,path,method='GET',body){return new Promise((resolve,reject)=>{const data=body===undefined?null:Buffer.from(JSON.stringify(body));const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let text='';res.setEncoding('utf8');res.on('data',c=>text+=c);res.on('end',()=>{let json;try{json=JSON.parse(text);}catch{}resolve({status:res.statusCode,text,json});});});req.setTimeout(600000,()=>req.destroy(Error('HTTP timeout 600s')));req.on('error',reject);if(data)req.write(data);req.end();});}


const dir='.agent/semester-03/nonlinear-06/',source=readFileSync('content/nonlinear/sliding-mode-control.mdx','utf8'),hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
const e={};new Function('exports',ts.transpileModule(readFileSync('lib/sliding-mode.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(e);
const params=[[3,2,.05,.3],[1,2,.05,.3],[10,2,.05,.3],[3,.5,.05,.3],[3,8,.05,.3],[3,2,.01,.3],[3,2,.3,.3],[3,2,.05,0],[3,2,.05,.6],[3,.5,.05,.6],[10,.5,.3,.6],[1,8,.01,0]];
const cases=[];for(const p of params)for(const law of ['sgn','sat','tanh','sta'])cases.push({params:p,law,result:e.simulateSliding(...p,law)});
assert.throws(()=>e.simulateSliding(0),RangeError);assert.throws(()=>e.simulateSliding(3,2,0),RangeError);
const refinement=[2e-4,1e-4].map(dt=>({dt,result:e.simulateSliding(3,2,.05,.3,'sat',dt)}));
const report={pass:true,sourceHash:hash(source),numericsHash:hash(readFileSync('lib/sliding-mode.ts','utf8')),componentHash:hash(readFileSync('components/wiki/sliding-mode-explorer.tsx','utf8')),notebooks:[],default:e.simulateSliding()};
const probes=[
`print(__import__('json').dumps(dict(bandEnter=float(t_r),slope=float(slope),bound=float(abs(S[0])/ETA))))`,
`vals=[]
for law,(tt,xx,ss,uu) in data.items():
 ee=xx-ref(tt)[0];m=tt>6
 vals.append(dict(law=law,rms=float(np.sqrt(np.mean(ee[m]**2))),smax=float(np.max(np.abs(ss[m]))),tv=float(np.sum(np.abs(np.diff(uu[m])))),umax=float(np.max(np.abs(uu)))))
print(__import__('json').dumps(vals))`,
`print(__import__('json').dumps(metrics))`,
`vals=[]
for kk,row in res.items():
 vals.append(dict(K=kk,matched=float(row['matched'][0]),unmatched=float(row['unmatched'][0]),both=float(row['both'][0])))
print(__import__('json').dumps(vals))`,
`vals=[]
for name,(_,_,ee,uu,_) in rows.items():
 vals.append(dict(name=name,lateMean=float(np.mean(ee[-1000:])),postRMS=float(np.sqrt(np.mean(ee[T>5.5]**2))),umax=float(np.max(np.abs(uu))),tv=float(np.sum(np.abs(np.diff(uu))))))
print(__import__('json').dumps(vals))`,
`print(__import__('json').dumps(dict(reach=reach,band=float(band),rms=float(np.sqrt(np.mean(sq))),tv=float(tv),last=n*dt)))`
];
const notebooks=extractNotebooks(source);assert.equal(notebooks.length,6);assert.equal(notebooks.reduce((n,b)=>n+b.cells.length,0),18);
for(const[i,nb]of notebooks.entries()){
 console.log('Running',i+1,nb.title);const id='nonlinear06-'+randomUUID();try{
 assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
 const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'source code');await execute(nb.setup.value);const cells=[];
 for(const[ci,c]of nb.cells.entries()){const begin=Date.now(),out=await execute(c.value);console.log(' cell',ci+1,Date.now()-begin,'ms');cells.push({outputs:out.map(o=>o.type==='image'?{type:'image',bytes:o.data.length}:o)});}
 const out=await execute(probes[i]);const metrics=JSON.parse(out.filter(o=>o.type==='text'||o.type==='stream').map(o=>o.text??'').join(''));
 report.notebooks.push({title:nb.title,cells,metrics});
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const temp='logs/nonlinear06-actual.json';try{writeFileSync(temp,JSON.stringify({cases,refinement,notebooks:report.notebooks.map(b=>b.metrics)}));report.independent=JSON.parse(execFileSync('python',[dir+'reference.py',temp],{encoding:'utf8',maxBuffer:8*1024*1024}));}finally{try{unlinkSync(temp);}catch{}}
for(const key of ['reach','band','rms','tv'])assert(Math.abs(report.default[key]-report.notebooks[5].metrics[key])<1e-7,key);
const h=await renderedHeadings(source,'nonlinear/sliding-mode-control'),old=JSON.parse(readFileSync(dir+'baseline-headings.json','utf8'));old.ids.forEach(id=>assert(h.ids.includes(id),id));assert.equal(new Set(h.ids).size,h.ids.length);report.oldIds=old.ids.length;writeFileSync(dir+'headings.json',JSON.stringify(h,null,2));
// Keep every plot point without thousands of one-number-per-line records.
const traces=[];const encoded=JSON.stringify(report,(key,value)=>key==='rows'&&Array.isArray(value)?(traces.push(value),'__trace'+(traces.length-1)+'__'):value,2).replace(/"__trace([0-9]+)__"/g,(_,i)=>JSON.stringify(traces[Number(i)]));assert.deepEqual(JSON.parse(encoded),report);writeFileSync(dir+'reconciliation.json',encoded+'\n');console.log(JSON.stringify(report.independent));
