import{readFileSync,writeFileSync}from'node:fs';import{execFileSync}from'node:child_process';import{createHash,randomUUID}from'node:crypto';import assert from'node:assert/strict';import ts from'typescript';import{extractNotebooks}from'./lib-mdx.mjs';import{directHttp,requireSuccess}from'./verify-reproducibility.mjs';import{renderedHeadings}from'./rendered-headings.mjs';
const dir='.agent/semester-03/classic-03/',out={},source=readFileSync('lib/time-domain.ts','utf8');
new Function('exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(out);
const ref=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));let maxTrajectoryError=0,maxMetricError=0;const cases=[];
for(const r of ref.cases){
 for(const[kind,end,n]of [['step',15,1500],['impulse',3,600],['road',3,600]]){
  const actual=out.responseCurve(r.zeta,r.wn,end,n,kind);assert.equal(actual.length,n+1);
  actual.forEach((row,i)=>{assert(Math.abs(row[0]-r[kind][i][0])<1e-12);const e=Math.abs(row[1]-r[kind][i][1]);maxTrajectoryError=Math.max(maxTrajectoryError,e);assert(e<1e-8,`${kind} ${r.zeta} ${r.wn} ${i}: ${e}`);});
 }
 for(const road of [false,true]){const a=out.responseMetrics(r.zeta,r.wn,road),b=road?r.roadMetrics:r.metrics;for(const k of ['tp','mp','tr','ts']){if(b[k]===null)assert.equal(a[k],null);else {const e=Math.abs(a[k]-b[k]);maxMetricError=Math.max(maxMetricError,e);assert(e<1e-7,`${r.zeta}/${r.wn}/${road}/${k}: ${a[k]} != ${b[k]}`);}}}
 cases.push({zeta:r.zeta,wn:r.wn,standard:out.responseMetrics(r.zeta,r.wn),road:out.responseMetrics(r.zeta,r.wn,true),hAtQuarter:out.responseAt(r.zeta,r.wn,.25,'impulse'),standardEnd:out.responseAt(r.zeta,r.wn,3),roadEnd:out.responseAt(r.zeta,r.wn,3,'road')});
}
for(const tau of [.2,.5,1,5]){const d=out.firstOrder(tau);assert(Math.abs(d.tr-tau*Math.log(9))<1e-12);assert(Math.abs(d.ts2+tau*Math.log(.02))<1e-12);assert.equal(d.samples.length,501);for(const[t,y]of d.samples)assert(Math.abs(y-(1-Math.exp(-t/tau)))<1e-12);}
for(const p of [[-1,8,1],[3,8,1],[NaN,8,1],[.5,0,1],[.5,8,-1]])assert.throws(()=>out.responseAt(...p));assert.throws(()=>out.firstOrder(0));assert.throws(()=>out.settlingTime(.5,8,0));
const mdx=readFileSync('content/classic/time-domain-analysis.mdx','utf8'),nbs=extractNotebooks(mdx);assert.equal(nbs.length,7);assert.equal((mdx.match(/<JupyterNotebook\b/g)||[]).length,7);
const contracts=[
 "assert abs(.5*np.log(9)-1.0986122886681098)<1e-12;assert max(abs(h-analytic))<1e-10;assert abs(8/np.sqrt(.75)*np.exp(-1)*np.sin(2*np.sqrt(.75))-3.354237037330655)<1e-12",
 "assert abs(metrics(.5,8)['ts']-1.0095436217410005)<1e-9;assert abs(metrics(.7,3.2)['ts']-1.8683726148127409)<1e-9;assert abs(settle(1,1)-5.833921701917391)<1e-9",
 "assert abs(max(abs(full-approx))-.10290109222001464)<1e-10;assert np.allclose(np.roots([1,2,10]),[-1+3j,-1-3j])",
 "assert abs(metrics(.3,8,True)['mp']-45.09754528931265)<1e-7;assert abs(metrics(.5,8,True)['ts']-.938148961767938)<1e-9;assert abs(at(.5,8,0,True))<1e-12",
 "assert abs(ze-.7)<.001;assert abs(we-8)<.05;assert max(abs(y-ye))<.01",
 "assert float(left.subs(t,0))==.5;assert float(sp.diff(right,t).subs(t,0))==-1;assert min(pade[times<tau])<0;assert abs(2/tau-4)<1e-12",
 "assert abs(metrics(.6,8)['ts']-.742868)<1e-3;assert metrics(1,8)['ts']<metrics(.6,8)['ts'];assert metrics(1,8)['ts']<metrics(2,8)['ts'];assert abs(peak-.25297552247821187)<1e-12;assert abs(metrics(z,wn)['ts']-1.1049469899454818)<1e-9"
];
const report={sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),maxTrajectoryError,maxMetricError,cases,notebooks:[]};
for(const[i,nb]of nbs.entries()){const id='classic03-'+randomUUID();try{assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);const run=async c=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code:c}),'original cell');await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));console.log('contract',i+1);const contractOutputs=await run(contracts[i]);report.notebooks.push({index:i+1,title:nb.title,outputs,contract:contracts[i],contractOutputs,pass:true});}finally{await directHttp(8891,'/api/notebook/'+id,'DELETE');}}
const headings=await renderedHeadings(mdx,'classic/time-domain-analysis'),old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));for(const h of old.headings)assert(headings.ids.includes(h.id),h.id);assert.equal(new Set(headings.ids).size,headings.ids.length);writeFileSync(dir+'headings.json',JSON.stringify(headings,null,2));report.pass=true;writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(`PASS actual TS core used by all five Explorers vs independent scipy: ${cases.length} cases, each 1501 step + 601 impulse + 601 road points; trajectory error ${maxTrajectoryError}; metric error ${maxMetricError}; seven original notebook contracts; ${old.headings.length} old IDs`);
