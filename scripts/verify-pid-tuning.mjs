import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
import {request} from 'node:http';
import {createHash,randomUUID} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/impl-03/',key='implementation/pid-engineering-tuning';
const actual={};new Function('exports',ts.transpileModule(fs.readFileSync('lib/pid-tuning.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(actual);
const cases=[];
for(const lambda of [.25,.5,.75,1,1.5,2,3])for(const scenario of actual.tuningScenarios)cases.push(actual.tuningExperiment(lambda,scenario));
for(const value of [-1,0,.24,3.1,Infinity,NaN])assert.throws(()=>actual.tunePi(value),RangeError);
assert.throws(()=>actual.tuningExperiment(1,'bad'),RangeError);
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(cases)+'\n');
execFileSync('python',[dir+'reference.py',dir+'actual-ts.json']);
const reference=JSON.parse(fs.readFileSync(dir+'reference.json','utf8'));
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n');
const notebooks=extractNotebooks(source);assert.equal(notebooks.length,2);
const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
let maxError=0,quantities=0;
function near(a,b,tol=1e-10){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}assert(Number.isFinite(a));const error=Math.abs(a-b);assert(error<=tol,`${a} != ${b}`);maxError=Math.max(maxError,error);quantities++;}
const values=[],outputs=[];
for(const [i,nb]of notebooks.entries()){
 const id='impl03-rank1-'+randomUUID();try{
  await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const all=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));all.push(out.outputs);}
  const out=await http('/api/notebook/'+id+'/execute','POST',{code:'print("AUDIT:"+json.dumps('+(i===0?'identification':'results')+'))'});
  assert(!out.outputs.some(o=>o.type==='error'));values.push(JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]));outputs.push(all);
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
near(values[0],reference.identification,1e-12);
const expected=reference.cases.filter(v=>[.5,1,2].includes(v.lambda)).map(v=>({lambda:v.lambda,scenario:v.scenario,...v.metrics}));
for(let i=0;i<expected.length;i++){assert.equal(values[1][i].scenario,expected[i].scenario);const {scenario,...numbers}=expected[i];near(values[1][i],numbers);}
const rendered=await renderedHeadings(source,key);assert.equal(rendered.h2.length,8);assert.equal(new Set(rendered.ids).size,rendered.ids.length);
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),configs:cases.length,tsError:reference.maxTsError,tsQuantities:reference.quantities,maxError,quantities,values,rendered,outputs};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,configs:cases.length,tsError:report.tsError,maxError,quantities,sourceHash:report.sourceHash}));
