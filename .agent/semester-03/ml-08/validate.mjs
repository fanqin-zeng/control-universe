import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';import {createHash} from 'node:crypto';
const dir='.agent/semester-03/ml-08/',read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8')),expected=read('expected-notebooks.json');let quantities=0,maxError=0;
function compare(a,b){if(typeof b==='number'){const e=Math.abs(a-b);assert(e<=1e-10);quantities++;maxError=Math.max(maxError,e);}else if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>compare(a[i],v));}else for(const k in b)compare(a[k],b[k]);}
const proof=read('pyodide.json'),lesson=proof.lessons.find(l=>l.key==='machine-learning/generative-models'),source=fs.readFileSync('content/machine-learning/generative-models.mdx','utf8').replace(/\r\n/g,'\n'),hash=createHash('sha256').update(source).digest('hex');assert(proof.complete);assert.equal(lesson.sourceHash,hash);
const values=cells=>cells.map(c=>JSON.parse(c.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('').trim()));
lesson.notebooks.forEach((n,i)=>{assert.equal(n.status,'passed');compare(values(n.cells),expected[i]);});
const native=read('native.json');assert(native.pass);native.notebooks.forEach((n,i)=>compare(values(n.cells),expected[i]));
compare(read('python-raw.json').map(n=>n.cells),expected);
const page=read('browser-pages.json');page.notebooks.forEach((n,i)=>{assert(n.text.includes('运行完成'));compare(n.text.split(/\r?\n/).filter(l=>l.startsWith('{')).map(l=>JSON.parse(l)),expected[i]);});
assert.equal(page.dom.h1,1);assert.equal(page.dom.h2.length,9);assert.equal(page.dom.katexErrors,0);assert.equal(page.dom.duplicateIds.length,0);assert.equal(page.dom.missingAnchors.length,0);assert.equal(page.dom.canvas,1);assert.equal(page.logs.length,0);
assert.deepEqual(page.dom.h2.map(h=>h.text),[...source.matchAll(/^## (.+)$/gm)].map(m=>m[1]));assert.deepEqual(page.dom.h2.map(h=>h.id),page.dom.h2.map(h=>h.text));
const m={};new Function('exports',ts.transpileModule(fs.readFileSync('lib/generative-basics.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m);
const controls=read('controls.json');assert(controls.length>=8);let uiQuantities=0;const seen=new Set();
for(const row of controls){const r=m.generativeSnapshot(row.config),d=r.diffusion,f=r.field,g=r.flow;const vals=[d.mean,d.variance,d.noise,d.estimate,d.posteriorVariance,d.estimateVariance,f.velocity,f.risk,g.mean,g.std,g.w2,row.config.m,row.config.s];const patterns=['加噪均值','；方差','最优噪声预测','条件均值','后验方差','仅条件均值输出的方差','流速度','条件标签剩余MSE','Euler终点均值','；标准差','高斯W₂距离','目标均值','；标准差'];
 // Extract sequential readouts to avoid confusing terminal std with target std.
 const found=[...row.text.matchAll(/=\s*(-?\d+(?:\.\d+)?)/g)].map(v=>+v[1]);
 // y=1 and x=1 are fixed probe annotations.
 found.splice(3,1);found.splice(6,1);assert.equal(found.length,13);vals.forEach((v,i)=>{assert(Math.abs(found[i]-v)<=5.1e-7,JSON.stringify({row,i,v,actual:found[i]}));uiQuantities++;});Object.entries(row.config).forEach(([k,v])=>seen.add(k+':'+v));}
for(const k of ['m','s','a','t','n','sign'])assert([...seen].filter(x=>x.startsWith(k+':')).length>=2);
assert.deepEqual(controls.at(-1).config,m.GENERATIVE_DEFAULT);
const mobile=read('browser-mobile.json');assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375);assert(mobile.canvasWidth>200);assert(mobile.resetText.includes('标准差=0.414785'));
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));assert.equal(policy.lessons[lesson.key].sourceHash,hash);assert.equal(policy.workerHash,proof.workerHash);assert(policy.lessons[lesson.key].notebooks.every(n=>n.status==='enabled'));
console.log(JSON.stringify({pass:true,sourceHash:hash,checkedNativePythonBrowserQuantities:quantities,maxError,uiQuantities,controls:controls.length,tolerance:1e-10}));
