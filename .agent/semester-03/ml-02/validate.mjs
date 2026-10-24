import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.agent/semester-03/ml-02/',read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
const source=fs.readFileSync('content/machine-learning/supervised-learning.mdx','utf8').replace(/\r\n/g,'\n'),hash=createHash('sha256').update(source).digest('hex');
const proof=read('pyodide.json');assert(proof.complete);assert.equal(proof.lessons[0].sourceHash,hash);
for(const n of proof.lessons[0].notebooks){assert.equal(n.status,'passed');assert.equal(n.cells.length,2);assert(n.cells.every(c=>c.status==='passed'&&!c.outputs.some(o=>o.type==='error')));}
const reconcile=read('reconciliation.json');assert.equal(reconcile.sourceHash,hash);assert(reconcile.pass&&reconcile.reference.maximum_error<1e-9&&reconcile.maxNotebookError<1e-9);assert.equal(reconcile.quantities,34);
const page=read('browser-pages.json');assert.equal(page.h1,1);assert.equal(page.h2.length,9);assert.equal(page.katexErrors,0);assert.equal(page.duplicates.length,0);assert(page.links);assert.equal(page.browserNotebooks,2);assert.equal(page.outputs.length,4);assert(page.outputs[0].includes('default'));assert(page.outputs[2].includes('independent stationary root'));assert(page.outputs[3].includes('Q3 threshold .8 prediction= 0'));
const mobile=read('browser-mobile.json');assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375);
const controls=read('browser-controls.json');assert(controls.length>=7);assert(controls.find(c=>c.name==='可分分类').readout.includes('未达梯度容差'));assert(controls.find(c=>c.name==='高阈值分类').readout.includes('训练准确率=0.50'));
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));assert.equal(policy.lessons['machine-learning/supervised-learning'].sourceHash,hash);assert(policy.lessons['machine-learning/supervised-learning'].notebooks.every(n=>n.status==='enabled'));
console.log(JSON.stringify({pass:true,sourceHash:hash,regressionConfigs:20,classificationConfigs:24,thresholdConfigs:216,notebooks:2,cells:4,quantities:34,mobileScrollWidth:mobile.scrollWidth}));
