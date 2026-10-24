import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
import {request} from 'node:http';
import {createHash,randomUUID} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/impl-02/',key='implementation/digital-pid';
const module={};new Function('exports',ts.transpileModule(fs.readFileSync('lib/digital-pid.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(module);
const cases=[];for(let N=1;N<=50;N++)for(const c of [0,.5,1])for(const kb of [0,2,19.5,20,25])cases.push({N,c,kb,result:module.digitalPidSample(N,c,kb)});
for(const args of [[0,0,2],[51,0,2],[10,-1,2],[10,2,2],[10,0,-1],[10,0,26],[NaN,0,2],[10,Infinity,2]])assert.throws(()=>module.digitalPidSample(...args),RangeError);
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(cases)+'\n');
const reference=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'actual-ts.json'],{encoding:'utf8'}));
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n');
const notebooks=extractNotebooks(source);assert.equal(notebooks.length,4);
const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
let maxError=0,quantities=0;
function near(a,b,tol=1e-8){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}assert(Number.isFinite(a));const error=Math.abs(a-b);assert(error<=tol,`${a} != ${b}`);maxError=Math.max(maxError,error);quantities++;}
const queries=['{k:v["position"] for k,v in equivalence.items()}','{"sample":sample,"metrics":metrics}','{"sampled":cascade_metrics,"outer_gain":k_outer,"continuous":continuous}','tuning'];
const values=[],outputs=[];
for(const[i,nb]of notebooks.entries()){
 const id='impl02-rank1-'+randomUUID();try{
  await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const all=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));all.push(out.outputs);}
  const out=await http('/api/notebook/'+id+'/execute','POST',{code:'print("AUDIT:"+json.dumps('+queries[i]+'))'});
  assert(!out.outputs.some(o=>o.type==='error'));values.push(JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]));
  outputs.push(all);
  if(i===1){
   // Execute the displayed algorithm verbatim, not a separately copied test implementation.
   const displayed=source.match(/```python\n(def pid_tick[\s\S]+?)\n```/)[1];
   const check=`${displayed}\np={'Ts':.1,'Kp':2.,'Ki':1.,'Kd':.5,'N':10.,'Kb':2.,'b':1.,'c':0.,'umin':-1.,'umax':1.,'rate':100.}\nu,s=pid_tick(1.,0.,(1.,0.,0.,0.),p)\nassert np.allclose([u,*s],[1.,.7,0.,0.,1.])\np['rate']=2.\nu,s=pid_tick(1.,0.,(1.,0.,0.,0.),p)\nassert np.allclose([u,s[0]],[.2,.54])\n# Consistent manual transfer including derivative history.\nu,s=pid_tick(1.,.4,(-.5,-.2,-.4,.6),p)\nassert abs(u-.6)<1e-12\nprint('displayed pid_tick: amplitude, rate and transfer PASS')`;
   const checked=await http('/api/notebook/'+id+'/execute','POST',{code:check});assert(!checked.outputs.some(o=>o.type==='error'),JSON.stringify(checked));outputs.push(checked);
  }
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
near(values[0],reference.equivalence);near(values[1].metrics,reference.metrics);
near(values[1].sample,{alpha:.5,D_c0:0,D_c1:2.5,D_measurement:-.5,raw:3,actual:1,I_next:.7,pole:.8,rate_step:.2,manual_I:-.5},1e-12);
near(values[2].sampled,reference.cascade);near(values[2].outer_gain,reference.outer_gain,1e-12);
near(values[2].continuous.inner_dc,1);near(values[2].continuous.cross_magnitude,1);
near(values[3],{ZN_P:4,ZN_PI_Kp:3.6,ZN_PI_Ti:5/3,ZN_PID_Kp:4.8,ZN_PID_Ti:1,ZN_PID_Td:.25,IMC_Kp:4/3,IMC_Ti:4,PI_rect_A:2.1,PI_rect_B:2,PI_trap_A:2.05,PI_trap_B:1.95,unreachable_upper:5,initial_error:10,minimum_error_limit:5,rate_per_sample:.2,tracking_pole_kb20:-1,tracking_pole_kb25:-1.5},1e-12);
const rendered=await renderedHeadings(source,key),before=JSON.parse(fs.readFileSync(dir+'headings-before.json','utf8'));
assert.deepEqual(rendered.h2,before.h2);
for(const id of before.ids)assert(rendered.ids.includes(id)||source.includes('id='+JSON.stringify(id)),id);
assert.equal(new Set(rendered.ids).size,rendered.ids.length);
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),configs:cases.length,tsError:reference.maxTsError,maxError,quantities,values,rendered,reference,outputs};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,configs:cases.length,tsError:reference.maxTsError,maxError,quantities,sourceHash:report.sourceHash}));
