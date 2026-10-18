import{request}from'node:http';
import{readFileSync,writeFileSync,unlinkSync}from'node:fs';import{execFileSync}from'node:child_process';import{createHash,randomUUID}from'node:crypto';import assert from'node:assert/strict';import ts from'typescript';import{extractNotebooks}from'./lib-mdx.mjs';import{renderedHeadings}from'./rendered-headings.mjs';import{requireSuccess}from'./verify-reproducibility.mjs';
function directHttp(port,path,method='GET',body){return new Promise((resolve,reject)=>{const data=body===undefined?null:Buffer.from(JSON.stringify(body));const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let text='';res.setEncoding('utf8');res.on('data',c=>text+=c);res.on('end',()=>{let json;try{json=JSON.parse(text);}catch{}resolve({status:res.statusCode,text,json});});});req.setTimeout(600000,()=>req.destroy(Error('HTTP timeout 600s')));req.on('error',reject);if(data)req.write(data);req.end();});}



const dir='.agent/semester-03/nonlinear-07/',source=readFileSync('content/nonlinear/backstepping.mdx','utf8'),hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
const e={};new Function('exports',ts.transpileModule(readFileSync('lib/backstepping.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(e);
const params=[[3,5,1,'step'],[.5,.5,1,'step'],[8,8,1,'step'],[3,5,.4,'step'],[.5,8,.4,'step'],[8,.5,.7,'step'],[3,5,1,'sine'],[.5,.5,1,'sine'],[8,8,1,'sine'],[3,5,.4,'sine'],[.5,8,.4,'sine'],[8,.5,.7,'sine']];
const cases=[];for(const p of params)for(const law of ['bs','fl','fl7'])cases.push({params:p,law,result:e.simulateBackstepping(law,p[3],...p.slice(0,3))});
const report={pass:true,sourceHash:hash(source),numericsHash:hash(readFileSync('lib/backstepping.ts','utf8')),componentHash:hash(readFileSync('components/wiki/backstepping-explorer.tsx','utf8')),notebooks:[],default:e.simulateBackstepping('bs','step',3,5,1)};
const probes=[
`print(__import__('json').dumps(dict(xstar=float(xstar),A=float(Aeq),B=float(Beq),maxRegularized=float(np.max(np.abs(a1_true))))))`,
`print(__import__('json').dumps(dict(V0=float(V2[0]),Vend=float(V2[-1]),rms=float(np.sqrt(np.mean(z1v[tt>3]**2))),maxu=float(np.max(np.abs(uu))),settle=ts,last=float(tt[-1]),state=XX[::500].tolist())))`,
`print(__import__('json').dumps(dict(ops=[int(r[2]) for r in rows],V0=float(V3[0]),Vend=float(V3[-1]),last=float(tt[-1]),dsc=[dict(tau=ta,last=float(v[0][-1]),escape=v[4],maxu=float(np.max(np.abs(v[2])))) for ta,v in dsc.items()])))`,
`print(__import__('json').dumps(dict(reg=store['reg'][1][-1].tolist(),pe=store['pe'][1][-1].tolist(),scanMax=mu_a.tolist(),scanRMS=rms_a.tolist(),scanFit=float(p),budget=float(x_lim))))`,
`print(__import__('json').dumps(dict(mean=float(mean_off),twoState=float(pred),initial=x0_ok,peak=float(np.max(np.abs(U2))),z0=z0.tolist(),lip=float(lip),stateOnly=float(prod),traceTimes=tt2[::100].tolist(),trace=H2[::100].tolist())))`,
`print(__import__('json').dumps(dict(randomDifference=float(np.max(np.abs(u_bs-u_fl))),overshoots=[float(os_a),float(os_b),float(th_a)],cases=[dict(m=m,key=key,rms=float(np.sqrt(np.mean(E[tt>15]**2))),maxu=float(np.max(np.abs(U))),tv=float(np.sum(np.abs(np.diff(U[tt>18]))))) for (m,key),(tt,H,U,E,TH) in cache.items()])))`,
`print(__import__('json').dumps(dict(linearStateEstimate=10*90*.001,symbolic=proofs,qeq=qeq,peq=peq,staticU=float(uf(qeq,0,peq,0)),rms=float(np.sqrt(np.mean(sq))),maxu=maxu,overshoot=max(0.,peak-1)*100)))`
];
const notebooks=extractNotebooks(source);assert.deepEqual(notebooks.map(n=>n.cells.length),[3,2,4,5,6,6,1]);
const reuse=process.argv.includes('--refresh-last')?JSON.parse(readFileSync(dir+'reconciliation.json','utf8')):null;
if(reuse){for(const k of ['sourceHash','numericsHash','componentHash'])assert.equal(reuse[k],report[k]);report.notebooks=reuse.notebooks.slice(0,6);}
for(const[i,nb]of notebooks.entries()){
 if(reuse&&i<6)continue;
 console.log('Running',i+1,nb.title);const id='nonlinear07-'+randomUUID();try{
 assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
 const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'source code');await execute(nb.setup.value);const cells=[];
 for(const[ci,c]of nb.cells.entries()){const begin=Date.now(),out=await execute(c.value);console.log(' cell',ci+1,Date.now()-begin,'ms');cells.push({outputs:out.map(o=>o.type==='image'?{type:'image',bytes:o.data.length}:o)});}
 const out=await execute(probes[i]);const metrics=JSON.parse(out.filter(o=>o.type==='text'||o.type==='stream').map(o=>o.text??'').join(''));report.notebooks.push({title:nb.title,cells,metrics});
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
 writeFileSync('logs/nonlinear07-execution-progress.json',JSON.stringify(report.notebooks,null,2)+'\n');
}
const temp='logs/nonlinear07-actual.json';try{writeFileSync(temp,JSON.stringify({cases,notebooks:report.notebooks.map(b=>b.metrics)}));report.independent=JSON.parse(execFileSync('python',[dir+'reference.py',temp],{encoding:'utf8',maxBuffer:8*1024*1024}));}finally{try{unlinkSync(temp);}catch{}}
for(const key of ['rmsE','maxU']){const mk=key==='rmsE'?'rms':'maxu';assert(Math.abs(report.default[key]-report.notebooks[6].metrics[mk])<1e-8,key);}
const h=await renderedHeadings(source,'nonlinear/backstepping'),old=JSON.parse(readFileSync(dir+'baseline-headings.json','utf8'));old.ids.forEach(id=>assert(h.ids.includes(id),id));assert.equal(new Set(h.ids).size,h.ids.length);report.oldIds=old.ids.length;writeFileSync(dir+'headings.json',JSON.stringify(h,null,2));
writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.independent));
