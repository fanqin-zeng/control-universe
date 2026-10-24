import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.agent/semester-03/ml-04/',read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'));
const source=fs.readFileSync('content/machine-learning/autodiff-optimization.mdx','utf8').replace(/\r\n/g,'\n'),hash=createHash('sha256').update(source).digest('hex');
const ref=read('reference.json'),native=read('native.json'),proof=read('pyodide.json'),page=read('browser-pages.json'),mobile=read('browser-mobile.json');
assert(ref.pass_&&native.pass&&proof.complete);assert.equal(native.sourceHash,hash);const l=proof.lessons.find(l=>l.key==='machine-learning/autodiff-optimization');assert.equal(l.sourceHash,hash);assert.equal(l.notebooks.length,2);
let count=0,error=0;
function eq(a,b){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>eq(a[i],v));}else if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))eq(a[k],v);}else if(typeof b==='string'||b===null)assert.equal(a,b);else{count++;const e=Math.abs(a-b);error=Math.max(error,e);assert(e<1e-8+Math.abs(b)*1e-11);}}
for(const[i,nb]of l.notebooks.entries()){
 assert.equal(nb.status,'passed');assert.equal(nb.cells.length,2);assert(nb.cells.every(c=>c.status==='passed'));
 const values=nb.cells.flatMap(c=>c.outputs.filter(o=>o.type==='stream').flatMap(o=>o.text.trim().split(/\r?\n/).filter(Boolean).map(s=>JSON.parse(s))));eq(values,ref.expected_notebooks[i]);
 assert(page.notebooks[i].text.includes('运行完成'));
 const lines=page.notebooks[i].text.split(/\r?\n/).filter(s=>s.startsWith('{')||s.startsWith('[{')).map(s=>JSON.parse(s));eq(lines,ref.expected_notebooks[i]);
}
assert.equal(page.dom.h1,1);assert.equal(page.dom.h2.length,10);assert.equal(page.dom.katexErrors,0);assert.equal(page.dom.duplicateIds.length,0);assert.equal(page.dom.missingAnchors.length,0);assert.equal(page.dom.canvas,1);assert.equal(page.logs.length,0);
assert.equal(mobile.width,375);assert(mobile.scrollWidth<=mobile.width);assert(mobile.canvasWidth>200);assert(mobile.guard.includes('数值保护'));assert(mobile.restored.includes('选用第54步'));
const c=read('controls.json');assert.equal(c.length,6);assert(c.find(x=>x.name==='全零初始化').text.includes('已接受更新70次'));assert(c.find(x=>x.name==='大步长').text.includes('拒绝第6步'));assert(c.find(x=>x.name==='只看末步').text.includes('选用第200步'));assert(c.find(x=>x.name==='恢复默认').text.includes('选用第54步'));
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));assert.equal(policy.lessons[l.key].sourceHash,hash);assert(policy.lessons[l.key].notebooks.every(n=>n.status==='enabled'));assert.equal(proof.workerHash,policy.workerHash);
console.log(JSON.stringify({pass:true,sourceHash:hash,checkedBrowserQuantities:count,maxBrowserError:error,runs:ref.runs,gradientCases:40,localSteps:ref.local_steps,autonomousDriftCases:ref.autonomous_drift.length}));
