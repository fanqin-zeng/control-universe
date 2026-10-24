import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
import {createHash, randomUUID} from 'node:crypto';
import {request} from 'node:http';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';

const dir='.agent/semester-03/impl-01/', key='implementation/computer-control-architecture';
const module={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/control-architecture.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(module);
const cases=[];
for(let c=0;c<=80;c++)for(let w=0;w<=20;w++)cases.push({net:c/10,waiting:w/10,result:module.controlArchitectureBudget(c/10,w/10)});
for(const args of [[-1,0],[9,0],[0,-1],[0,3],[NaN,0],[0,Infinity]])assert.throws(()=>module.controlArchitectureBudget(...args),RangeError);
const defaults=module.controlArchitectureBudget();assert.equal(defaults.total,3);assert.equal(defaults.slack,2);
assert(module.controlArchitectureBudget(2.8,.5).meetsDeadline);
assert(!module.controlArchitectureBudget(3,.5).meetsDeadline);
assert(cases.every(c=>c.result.total>=0&&c.result.total<=12));
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(cases)+'\n');
const reference=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'actual-ts.json'],{encoding:'utf8'}));
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n');
const nbs=extractNotebooks(source);assert.equal(nbs.length,2);assert(nbs.every(n=>n.cells.length===2));
const port=Number(process.env.JUPYTER_PORT||8991);
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(120000,()=>req.destroy(Error('timeout')));if(data)req.write(data);req.end();});}
let maxNotebookError=0,quantities=0;
function numeric(actual,expected){if(Array.isArray(expected)){assert.equal(actual.length,expected.length);expected.forEach((e,i)=>numeric(actual[i],e));return;}if(expected&&typeof expected==='object'){for(const[k,v]of Object.entries(expected))numeric(actual[k],v);return;}assert(Number.isFinite(actual));const error=Math.abs(actual-expected);assert(error<1e-9,`${actual} != ${expected}`);maxNotebookError=Math.max(error,maxNotebookError);quantities++;}
const queries=['{"budgets":[v["total"] for v in budgets],"bound":bound,"u":u,"response":response,"phase":phase}', '{"mttf_parallel":mttf_parallel,"mttf_tmr":mttf_tmr,"reliability":reliability,"extra_total":extra_total}'];
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),reference,defaults,notebooks:[]};
for(const[i,nb]of nbs.entries()){
 const id='impl01-rank1-'+randomUUID();
 try{
  await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const outputs=[];
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const out=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!out.outputs.some(o=>o.type==='error'),JSON.stringify(out));outputs.push(out.outputs);}
  const out=await http('/api/notebook/'+id+'/execute','POST',{code:'import json\nprint("AUDIT:"+json.dumps('+queries[i]+'))'});
  assert(!out.outputs.some(o=>o.type==='error'));const values=JSON.parse(out.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]);
  for(const[k,v]of Object.entries(values))numeric(v,reference[k]);
  report.notebooks.push({title:nb.title,outputs,values});
 }finally{await http('/api/notebook/'+id,'DELETE');}
}
report.maxNotebookError=maxNotebookError;report.quantities=quantities;
report.rendered=await renderedHeadings(source,key);
const before=JSON.parse(fs.readFileSync(dir+'headings-before.json','utf8'));
assert.equal(report.rendered.h2.length,9);
assert.deepEqual(report.rendered.h2,before.h2);
// Explicit compatibility spans are checked in real DOM too; rehype collector
// collects generated heading IDs, while JSX spans remain MDX nodes.
for(const id of before.ids)assert(report.rendered.ids.includes(id)||source.includes('id='+JSON.stringify(id)),id);
assert.equal(new Set(report.rendered.ids).size,report.rendered.ids.length);
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,configs:cases.length,tsError:reference.maxTsError,quantities,maxNotebookError,sourceHash:report.sourceHash}));
