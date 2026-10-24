import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';
import {execFileSync} from 'node:child_process';import {request} from 'node:http';import {createHash,randomUUID} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/impl-04/',key='implementation/controller-discretization-practice';
const actual={};new Function('exports',ts.transpileModule(fs.readFileSync('lib/controller-deployment.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(actual);
const cases=[];for(const h of [.01,.02,.05,.1])for(const F of [4,8,12])for(const kind of ['step','pulse','decay'])cases.push(actual.deploymentExperiment(h,F,kind));
for(const args of [[0,8,'step'],[.11,8,'step'],[NaN,8,'step'],[.02,3,'step'],[.02,13,'step'],[.02,4.5,'step'],[.02,8,'bad']])assert.throws(()=>actual.deploymentExperiment(...args),RangeError);
assert.equal(actual.roundAway(.5),1);assert.equal(actual.roundAway(-.5),-1);assert.equal(actual.signedWord(100,12),32767);assert.equal(actual.signedWord(-100,12),-32768);
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(cases)+'\n');execFileSync('python',[dir+'reference.py',dir+'actual-ts.json']);
const ref=JSON.parse(fs.readFileSync(dir+'reference.json','utf8')),source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),nbs=extractNotebooks(source);assert.equal(nbs.length,3);
const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
const outputs=[],values=[];let maxError=0,quantities=0;
function near(a,b,tol=1e-11){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}if(typeof b==='string'){assert.equal(a,b);return;}assert(Number.isFinite(a));const error=Math.abs(a-b);assert(error<=tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);maxError=Math.max(maxError,error/Math.max(1,Math.abs(b)));quantities++;}
const queries=['{"coefficients":coefficients,"golden":outputs.tolist(),"replayed":replayed,"wrong":bad}','{"table":fixed_results,"default":{k:v for k,v in fixed_experiment().items() if k!="points"},"decay":{k:v for k,v in fixed_experiment(kind="decay").items() if k!="points"}}','timing_results'];
for(const[i,nb]of nbs.entries()){
 const id='impl04-rank1-'+randomUUID();try{
  await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const all=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));all.push(out.outputs);}
  const out=await http('/api/notebook/'+id+'/execute','POST',{code:'print("AUDIT:"+json.dumps('+queries[i]+'))'});assert(!out.outputs.some(o=>o.type==='error'));values.push(JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]));outputs.push(all);
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
near(values[0].coefficients,{a:19/21,b:2/21,library_a1:-19/21,first:2/21,stateFirst:31/84,A_F8:232,B_F8:24,positiveHalf:1,negativeHalf:-1,maxStoredF12:32767/4096,minStoredF12:-8});
// Independent exact-fraction finite reference vector, not another JS recurrence.
const golden=JSON.parse(execFileSync('python',['-c','from fractions import Fraction as Q;import json;u=Q(0);e0=Q(0);v=[]\nfor e in [1,1,Q(1,2),0,Q(-1,2),-1,0,1]:\n u=Q(19,21)*u+Q(2,21)*(e+e0);v.append(float(u));e0=e\nprint(json.dumps(v))'],{encoding:'utf8'}));
near(values[0].golden,golden);near(values[0].replayed,golden);assert.notDeepEqual(values[0].wrong,golden);
for(const r of values[1].table){const expected=ref.cases.find(c=>c.Ts===.02&&c.F===r.F&&c.signal===r.signal);near(r,{finalFloat:expected.finalFloat,finalFixed:expected.finalFixed,maxError:expected.maxError,clipped:expected.clipped});}
for(const name of ['default','decay']){const r=name==='default'?ref.example:ref.decay;near(values[1][name],Object.fromEntries(['a','b','A','B','aq','first','fixedFirst','finalFloat','finalFixed','maxError','clipped','deadbandBound'].map(k=>[k,r[k]])));}
for(let i=0;i<3;i++){const {eigenvalues,...expected}=ref.timing[i];near(values[2][i],expected);}
const rendered=await renderedHeadings(source,key);assert.equal(rendered.h2.length,9);assert.equal(new Set(rendered.ids).size,rendered.ids.length);
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),configs:cases.length,tsError:ref.maxTsError,tsQuantities:ref.quantities,maxError,quantities,values,rendered,outputs};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,configs:cases.length,tsError:report.tsError,maxError,quantities,sourceHash:report.sourceHash}));
