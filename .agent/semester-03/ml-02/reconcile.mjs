import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';import {request} from 'node:http';import {randomUUID,createHash} from 'node:crypto';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/ml-02/',key='machine-learning/supervised-learning',m={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/supervised-learning.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m);
const cases={regression:[],classification:[]};let nodeCount=0,min=Infinity,max=-Infinity;
for(const lambda of m.ridgeValues){
  for(let ai=0;ai<=4;ai++){
    const disturbance=ai/2,result=m.fitRegression(lambda,disturbance);cases.regression.push({lambda,disturbance,result});
    for(let i=0;i<=100;i++){
      const x=-2+i/25;for(const y of [result.b+result.w*x,1+x]){assert(y>=-3&&y<=6);min=Math.min(min,y);max=Math.max(max,y);nodeCount++;}
    }
  }
  for(const budget of m.iterationBudgets){
    const result=m.fitClassifier(lambda,budget);cases.classification.push({lambda,budget,result});
    for(let i=0;i<=100;i++){const x=-2+i/25,p=m.sigmoid(result.b+result.w*x);assert(p>=0&&p<=1);nodeCount++;}
    for(let ti=1;ti<=9;ti++){const accuracy=m.trainingAccuracy(result.probabilities,ti/10);assert(accuracy>=0&&accuracy<=1);}
  }
}
for(const x of [-1000,0,1000])assert(Number.isFinite(m.sigmoid(x)));
assert.throws(()=>m.fitRegression(-1,0),RangeError);assert.throws(()=>m.fitClassifier(1,3),RangeError);
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(cases,null,2));
const reference=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'actual-ts.json'],{encoding:'utf8'}));
function http(path,method,body){return new Promise((resolve,reject)=>{const data=body?Buffer.from(JSON.stringify(body)):null;const req=request({hostname:'127.0.0.1',port:8992,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{let raw='';res.on('data',s=>raw+=s);res.on('end',()=>{try{assert.equal(res.statusCode,200,raw);resolve(JSON.parse(raw));}catch(e){reject(e);}});});req.on('error',reject);req.setTimeout(60000,()=>req.destroy(Error('kernel timeout')));if(data)req.write(data);req.end();});}
let quantities=0,maxNotebookError=0;
function compare(a,b,path=''){
  if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>compare(a[i],v,path+i));return;}
  if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))compare(a[k],v,path+'.'+k);return;}
  if(typeof b==='boolean'){assert.equal(a,b);return;}
  const error=Math.abs(a-b);quantities++;maxNotebookError=Math.max(maxNotebookError,error);assert(Number.isFinite(a)&&error<1e-9,`${path}: ${a} != ${b}`);
}
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),notebooks=extractNotebooks(source);assert.equal(notebooks.length,2);
const report={pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),reference,axis:{regressionMin:min,regressionMax:max,nodeCount,thresholdConfigs:216},notebooks:[]};
for(const[i,nb]of notebooks.entries()){
  const id='ml02-'+randomUUID();try{
    await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const outputs=[];
    for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){const result=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!result.outputs.some(o=>o.type==='error'),JSON.stringify(result));outputs.push(result.outputs.map(o=>o.type==='image'?{type:'image',bytes:o.data.length}:o));}
    const query=i===0?"{'default_reg':default_reg,'selection_rows':selection_rows,'first_step':first_step.tolist()}":"{'default_class':default_class,'root':root}";
    const result=await http('/api/notebook/'+id+'/execute','POST',{code:'import json\nprint("AUDIT:"+json.dumps('+query+',allow_nan=False))'});
    const values=JSON.parse(result.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').match(/AUDIT:(.+)/)[1]);compare(values,reference.expected_notebooks[i]);report.notebooks.push({title:nb.title,outputs,values});
  }finally{await http('/api/notebook/'+id,'DELETE');}
}
report.maxNotebookError=maxNotebookError;report.quantities=quantities;report.headings=await renderedHeadings(source,key);assert.equal(report.headings.h2.length,9);assert.equal(new Set(report.headings.ids).size,report.headings.ids.length);
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:true,sourceHash:report.sourceHash,regressionCases:20,classificationCases:24,thresholdConfigs:216,tsError:reference.maximum_error,maxNotebookError,quantities,nodeCount}));
