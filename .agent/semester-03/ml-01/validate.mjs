import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.agent/semester-03/ml-01/',read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
const source=fs.readFileSync('content/machine-learning/learning-problem.mdx','utf8').replace(/\r\n/g,'\n');
const hash=createHash('sha256').update(source).digest('hex');
const browser=read('pyodide.json');assert(browser.complete);assert.equal(browser.lessons[0].sourceHash,hash);
for(const n of browser.lessons[0].notebooks){assert.equal(n.status,'passed');assert(n.cells.every(c=>c.status==='passed'&&!c.outputs.some(o=>o.type==='error')));}
const page=read('browser-pages.json');assert.equal(page.h1,1);assert.equal(page.h2.length,8);assert.equal(page.katexErrors,0);assert.equal(page.duplicates.length,0);assert(page.links);assert.equal(page.browserNotebooks,2);assert.equal(page.outputs.length,3);assert(page.outputs[0].includes('validation selected 1'));assert(page.outputs[2].includes('leaked all-data mean= 34.0'));
const mobile=read('browser-mobile.json');assert.equal(mobile.width,375);assert(mobile.scrollWidth<=mobile.width);
const results=read('reconciliation.json');assert(results.pass&&results.independent.maximum_error<1e-9);assert.equal(results.independent.cases,297);
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));assert.equal(policy.lessons['machine-learning/learning-problem'].sourceHash,hash);
assert(policy.lessons['machine-learning/learning-problem'].notebooks.every(n=>n.status==='enabled'));
console.log(JSON.stringify({pass:true,hash,notebooks:2,cells:3,configs:297,mobile:mobile.scrollWidth,anchors:8}));
