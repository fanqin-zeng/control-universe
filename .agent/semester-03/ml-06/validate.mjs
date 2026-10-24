import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.agent/semester-03/ml-06/',read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'));
const source=fs.readFileSync('content/machine-learning/attention-transformers.mdx','utf8').replace(/\r\n/g,'\n'),hash=createHash('sha256').update(source).digest('hex');
const ref=read('reference.json'),native=read('native.json'),proof=read('pyodide.json'),page=read('browser-pages.json'),mobile=read('browser-mobile.json');
assert(ref.pass_&&native.pass&&proof.complete);assert.equal(native.sourceHash,hash);const lesson=proof.lessons.find(l=>l.key==='machine-learning/attention-transformers');assert.equal(lesson.sourceHash,hash);assert.equal(lesson.notebooks.length,2);
let count=0,maxError=0;
function compare(a,b){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>compare(a[i],v));}else if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))compare(a[k],v);}else{count++;const error=Math.abs(a-b);maxError=Math.max(maxError,error);assert(error<=1e-10+1e-12*Math.abs(b));}}
for(const[i,n]of lesson.notebooks.entries()){
 assert.equal(n.status,'passed');assert(n.cells.every(c=>c.status==='passed'));
 const values=n.cells.flatMap(c=>c.outputs.filter(o=>o.type==='stream').flatMap(o=>o.text.trim().split(/\r?\n/).filter(Boolean).map(s=>JSON.parse(s))));compare(values,ref.expected_notebooks[i]);
 assert(page.notebooks[i].text.includes('运行完成'));const lines=page.notebooks[i].text.split(/\r?\n/).filter(s=>s.startsWith('{')||s.startsWith('[{')).map(s=>JSON.parse(s));compare(lines,ref.expected_notebooks[i]);
}
assert.equal(page.dom.h1,1);assert.equal(page.dom.h2.length,10);assert.equal(page.dom.katexErrors,0);assert.equal(page.dom.duplicateIds.length,0);assert.equal(page.dom.missingAnchors.length,0);assert.equal(page.dom.canvas,1);assert.equal(page.logs.length,0);
assert.deepEqual(page.dom.h2.map(h=>h.text),[...source.matchAll(/^## (.+)$/gm)].map(m=>m[1]));
assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375);assert(mobile.canvasWidth>200);
const controls=read('controls.json'),cases=read('ts-cases.json').runs;let controlQuantities=0;
assert.equal(controls.length,6);
for(const row of controls){const{temperature,delta,causal,query}=row.config,r=cases.find(c=>c.config.temperature===temperature&&c.config.delta===delta&&c.config.causal===causal).result,base=cases.find(c=>c.config.temperature===temperature&&c.config.delta===0&&c.config.causal===causal).result;
 const values=[...row.text.matchAll(/(?:输出=|的变化=|j=\d：)([-\d.]+)/g)].map(m=>Number(m[1]));const expected=[r.output[query][0],r.output[query][0]-base.output[query][0],...r.weights[query]];assert.equal(values.length,expected.length);expected.forEach((v,i)=>{assert(Math.abs(values[i]-v)<5.1e-9);controlQuantities++;});
}
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));assert.equal(policy.lessons[lesson.key].sourceHash,hash);assert(policy.lessons[lesson.key].notebooks.every(n=>n.status==='enabled'));assert.equal(proof.workerHash,policy.workerHash);
console.log(JSON.stringify({pass:true,sourceHash:hash,checkedBrowserQuantities:count,controlQuantities,maxBrowserError:maxError,runs:ref.runs,referenceQuantities:ref.quantities}));
