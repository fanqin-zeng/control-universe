import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/est-01/';
const read=name=>JSON.parse(fs.readFileSync(dir+name,'utf8'));
const source=fs.readFileSync('content/estimation/estimation-problem.mdx','utf8').replace(/\r\n/g,'\n');
const hash=createHash('sha256').update(source).digest('hex');
const proof=read('pyodide.json');assert(proof.complete);assert.equal(proof.lessons[0].sourceHash,hash);assert.equal(proof.totals.enabled,2);assert.equal(proof.totals.codeOnly,0);
const nbs=extractNotebooks(source);assert.equal(nbs.length,2);
for(const [i,nb]of nbs.entries()){
 const tested=proof.lessons[0].notebooks[i];assert.equal(tested.status,'passed');assert.equal(tested.cells.length,nb.cells.length);
 const extracted=read('extracted.json').notebooks[i];assert.equal(nb.setup.value,extracted.setupCode);assert.deepEqual(nb.cells.map(c=>c.value),extracted.cells.map(c=>c.code));
}
const kernel=read('notebooks.json');assert.equal(kernel.kernelRequired,true);assert.equal(kernel.executionStatus,'EXECUTED');assert.equal(kernel.totals.FAIL,0);assert.equal(kernel.totals.SKIPPED,0);assert.equal(kernel.lessons[0].cells.length,4);
const numeric=read('reconciliation.json');assert(numeric.pass);assert.equal(numeric.configs,1216);assert(numeric.reference.maxDifference<1e-12);
for(const name of ['native','pages']){const browser=read('browser-'+name+'.json');assert(browser.pass);assert.equal(browser.dom.h2.length,9);assert.equal(browser.errors.length,0);assert.equal(browser.consoleErrors.length,0);assert.equal(browser.cases.length,36);assert(browser.mobile.scroll<=375);}
console.log(JSON.stringify({pass:true,sourceHash:hash,notebooks:2,cells:4,tsConfigurations:numeric.configs,tolerance:1e-12}));
