import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.agent/semester-03/ml-03/',read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'));
const source=fs.readFileSync('content/machine-learning/neural-networks.mdx','utf8').replace(/\r\n/g,'\n'),hash=createHash('sha256').update(source).digest('hex');
const ref=read('reference.json'),native=read('native.json'),proof=read('pyodide.json'),page=read('browser-pages.json'),mobile=read('browser-mobile.json');
assert(ref.pass&&native.pass&&proof.complete);assert.equal(native.sourceHash,hash);const l=proof.lessons.find(l=>l.key==='machine-learning/neural-networks');assert.equal(l.sourceHash,hash);assert.equal(l.notebooks.length,2);
let count=0;
function eq(a,b){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>eq(a[i],v));}else if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))eq(a[k],v);}else{count++;assert(Math.abs(a-b)<1e-10);}}
for(const[i,nb]of l.notebooks.entries()){
 assert.equal(nb.status,'passed');assert.equal(nb.cells.length,2);assert(nb.cells.every(c=>c.status==='passed'));
 const values=nb.cells.flatMap(c=>c.outputs.filter(o=>o.type==='stream').flatMap(o=>o.text.trim().split(/\r?\n/).filter(Boolean).map(s=>JSON.parse(s.slice(s.indexOf('{'))))));eq(values,ref.expected_notebooks[i]);
 assert(page.notebooks[i].text.includes('运行完成'));
 const lines=page.notebooks[i].text.split(/\r?\n/).filter(s=>s.includes('{')).map(s=>JSON.parse(s.slice(s.indexOf('{'))));eq(lines,ref.expected_notebooks[i]);
}
assert.equal(page.dom.h1,1);assert.equal(page.dom.h2.length,10);assert.equal(page.dom.katexErrors,0);assert.equal(page.dom.duplicateIds.length,0);assert.equal(page.dom.missingAnchors.length,0);assert.equal(page.dom.canvas,1);assert.equal(page.logs.length,0);
assert.equal(mobile.width,375);assert(mobile.scrollWidth<=mobile.width);assert(mobile.canvasWidth>200);assert(mobile.dead.includes('训练MSE=0.66666667'));assert(mobile.restored.includes('输出=0.50000000'));
const c=read('controls.json');assert.equal(c.length,7);assert(c.find(x=>x.name==='练习2').value.includes('输出=2.00000000'));assert(c.find(x=>x.name==='恢复默认').value.includes('输出=0.50000000'));
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));assert.equal(policy.lessons[l.key].sourceHash,hash);assert(policy.lessons[l.key].notebooks.every(n=>n.status==='enabled'));assert.equal(proof.workerHash,policy.workerHash);
console.log(JSON.stringify({pass:true,sourceHash:hash,checkedBrowserQuantities:count,forwardCases:ref.forwardCases,lossCases:ref.lossCases,xorCases:ref.xorCases,nativeQuantities:read('notebook-comparison.json').quantities}));
