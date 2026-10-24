import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/est-02/';const read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'));
const source=fs.readFileSync('content/estimation/least-squares-ml.mdx','utf8').replace(/\r\n/g,'\n');
const sourceHash=createHash('sha256').update(source).digest('hex');
const py=read('pyodide.json');assert(py.complete);assert.equal(py.lessons[0].sourceHash,sourceHash);assert.equal(py.totals.enabled,2);assert.equal(py.totals.codeOnly,0);
const extracted=read('extracted.json'),notebooks=extractNotebooks(source);assert.equal(notebooks.length,2);
for(const [i,nb]of notebooks.entries()){
 assert.equal(nb.setup.value,extracted.notebooks[i].setupCode);assert.deepEqual(nb.cells.map(c=>c.value),extracted.notebooks[i].cells.map(c=>c.code));
 assert.equal(py.lessons[0].notebooks[i].status,'passed');assert.equal(py.lessons[0].notebooks[i].cells.length,nb.cells.length);
}
const kernel=read('notebooks.json');assert.equal(kernel.kernelRequired,true);assert.equal(kernel.executionStatus,'EXECUTED');assert.equal(kernel.totals.FAIL,0);assert.equal(kernel.totals.SKIPPED,0);assert.equal(kernel.lessons[0].cells.length,4);
const numeric=read('reconciliation.json');assert(numeric.pass);assert.equal(numeric.configurations,75);assert.equal(numeric.axis.points,9075);assert(numeric.reference.maxDifference<1e-12);
for(const name of ['native','pages']){const b=read('browser-'+name+'.json');assert(b.pass);assert.equal(b.dom.h2.length,10);assert.equal(b.errors.length,0);assert.equal(b.consoleErrors.length,0);assert.equal(b.cases.length,75);assert(b.mobile.scroll<=375);}
console.log(JSON.stringify({pass:true,sourceHash,notebooks:2,cells:4,tsConfigurations:75,curvePoints:9075,tolerance:1e-12}));
