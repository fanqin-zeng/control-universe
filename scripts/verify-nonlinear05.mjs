import{request}from'node:http';
import{readFileSync,writeFileSync,unlinkSync}from'node:fs';import{execFileSync}from'node:child_process';import{createHash,randomUUID}from'node:crypto';import assert from'node:assert/strict';import ts from'typescript';import{extractNotebooks}from'./lib-mdx.mjs';import{renderedHeadings}from'./rendered-headings.mjs';import{requireSuccess}from'./verify-reproducibility.mjs';
function directHttp(port,path,method='GET',body){return new Promise((resolve,reject)=>{const data=body===undefined?null:Buffer.from(JSON.stringify(body));const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let text='';res.setEncoding('utf8');res.on('data',c=>text+=c);res.on('end',()=>{let json;try{json=JSON.parse(text);}catch{}resolve({status:res.statusCode,text,json});});});req.setTimeout(600000,()=>req.destroy(Error('HTTP timeout 600s')));req.on('error',reject);if(data)req.write(data);req.end();});}

const dir='.agent/semester-03/nonlinear-05/',source=readFileSync('content/nonlinear/feedback-linearization.mdx','utf8');
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
const e={};new Function('exports',ts.transpileModule(readFileSync('lib/zero-dynamics.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(e);
const actual=[];for(let i=-20;i<=20;i++)if(i!==0){const a=i/10;const rows=e.zeroDynamicsSeries(a);assert.equal(rows.length,501);actual.push({a,rows});}
assert.deepEqual(e.zeroDynamicsSeries(0),[]);assert.throws(()=>e.zeroDynamics(0,1),RangeError);
const report={pass:true,sourceHash:hash(source),numericsHash:hash(readFileSync('lib/zero-dynamics.ts','utf8')),componentHash:hash(readFileSync('components/wiki/zero-dynamics-explorer.tsx','utf8')),notebooks:[]};
const probes=[
`print(__import__('json').dumps({'maxError':float(np.max(np.abs(y-y_exact))),'last':float(sol.t[-1])}))`,
`vals=[]
for aa in [1.,.5,.25,-.5,-1.]:
 tt,xx1,xx2=zero_dyn(aa);m=(tt>=1)&(tt<=5)
 vals.append(dict(a=aa,slope=float(np.polyfit(tt[m],np.log(np.abs(xx1[m])),1)[0]),rel=float(np.max(np.abs(xx1+aa*xx2)/np.maximum(np.abs(xx1),1e-300)))))
print(__import__('json').dumps(vals))`,
`values=[]
for kind,wn,x0,T in [('IOL',3.,1.,8.),('Jac',3.,1.,8.),('IOL',3.,-1.,8.),('Jac',3.,-1.,8.),('IOL',.5,1.5,40.),('Jac',.5,1.5,40.)]:
 q=run_reg(make(kind,2*wn,wn**2),x0,T)
 values.append(dict(kind=kind,wn=wn,x0=x0,T=T,t=q.t.tolist(),x=q.y.T.tolist(),settling=float(settle(q.y[0],q.t,x0)),overshoot=float(max(0.,-np.min(q.y[0])/x0)*100) if x0>0 else None))
for kind,wn in [('IOL',3.),('Jac',3.),('Jac',6.),('Jac',12.)]:
 q=run_trk(make(kind,2*wn,wn**2));err=q.y[0]-thd(q.t);m=q.t>12
 values.append(dict(kind=kind,wn=wn,tracking=True,t=q.t.tolist(),x=q.y.T.tolist(),peak=float(np.max(np.abs(err[m]))),rms=float(np.sqrt(np.mean(err[m]**2)))))
print(__import__('json').dumps(values))`,
`print(__import__('json').dumps(dict(t=t.tolist(),x=X.T.tolist(),u=U.tolist(),dropPeak=float(dropped.max()),keptPeak=float(kept.max()),maskRatio=float(np.max(dropped[mask]/kept[mask])),minCos=float(np.cos(X[2]).min()))))`,
`print(__import__('json').dumps(dict(last=float(sol.t[-1]))))`,
`print(__import__('json').dumps(dict(verified=True)))`
];
const notebooks=extractNotebooks(source);assert.equal(notebooks.length,6);assert.equal(notebooks.reduce((n,b)=>n+b.cells.length,0),15);
for(const [i,nb]of notebooks.entries()){
 console.log('Running',i+1,nb.title);const id='nonlinear05-'+randomUUID();try{
 assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
 const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'original code');await execute(nb.setup.value);const cells=[];
 for(const c of nb.cells){const out=await execute(c.value);cells.push({outputs:out.map(o=>o.type==='image'?{type:'image',bytes:o.data.length}:o)});}
 const outputs=await execute(probes[i]);const metrics=JSON.parse(outputs.filter(o=>o.type==='text'||o.type==='stream').map(o=>o.text??'').join(''));
 report.notebooks.push({title:nb.title,cells,metrics});
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const temp='logs/nonlinear05-actual.json';try{writeFileSync(temp,JSON.stringify({actual,notebooks:report.notebooks.map(b=>b.metrics)}));report.independent=JSON.parse(execFileSync('python',[dir+'reference.py',temp],{encoding:'utf8',maxBuffer:8*1024*1024}));}finally{try{unlinkSync(temp);}catch{}}
const h=await renderedHeadings(source,'nonlinear/feedback-linearization'),old=JSON.parse(readFileSync(dir+'baseline-headings.json','utf8'));for(const id of old.ids)assert(h.ids.includes(id),id);assert.equal(new Set(h.ids).size,h.ids.length);report.oldIds=old.ids.length;writeFileSync(dir+'headings.json',JSON.stringify(h,null,2));const traces=[];const encoded=JSON.stringify(report,(key,value)=>['t','x'].includes(key)&&Array.isArray(value)?(traces.push(value),'__trace'+(traces.length-1)+'__'):value,2).replace(/"__trace([0-9]+)__"/g,(_,i)=>JSON.stringify(traces[Number(i)]));assert.deepEqual(JSON.parse(encoded),report);writeFileSync(dir+'reconciliation.json',encoded+'\n');console.log(JSON.stringify(report.independent));
