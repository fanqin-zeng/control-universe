import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash}from'node:crypto';
import {extractNotebooks}from'../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/est-03/',read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'));
const rawSource=fs.readFileSync('content/estimation/kalman-filter.mdx','utf8'),source=rawSource.replace(/\r\n/g,'\n'),sourceHash=createHash('sha256').update(source).digest('hex');
const py=read('pyodide.json');assert(py.complete);assert.equal(py.lessons[0].sourceHash,sourceHash);assert.equal(py.totals.enabled,3);assert.equal(py.totals.codeOnly,0);
const extracted=read('extracted.json'),notebooks=extractNotebooks(rawSource);assert.equal(notebooks.length,3);
for(const [i,nb]of notebooks.entries()){
 assert.equal(nb.setup.value,extracted.notebooks[i].setupCode);assert.deepEqual(nb.cells.map(c=>c.value),extracted.notebooks[i].cells.map(c=>c.code));assert.equal(py.lessons[0].notebooks[i].status,'passed');assert.equal(py.lessons[0].notebooks[i].cells.length,2);
}
const kernel=read('notebooks.json');assert.equal(kernel.kernelRequired,true);assert.equal(kernel.executionStatus,'EXECUTED');assert.equal(kernel.totals.FAIL,0);assert.equal(kernel.totals.SKIPPED,0);assert.equal(kernel.lessons[0].cells.length,6);
const numeric=read('reconciliation.json');assert(numeric.pass);assert.equal(numeric.configurations,15);assert.equal(numeric.curvePoints,1515);assert(numeric.reference.maxDifference<1e-10);
for(const name of ['native','pages']){const b=read('browser-'+name+'.json');assert(b.pass);assert.equal(b.dom.h2.length,12);assert.equal(b.errors.length,0);assert.equal(b.consoleErrors.length,0);assert.equal(b.cases.length,15);assert(b.mobile.scroll<=375);}
const sourceFiles=['content/estimation/kalman-filter.mdx','components/wiki/kalman-noise-explorer.tsx','lib/kalman-noise.ts','public/diagrams/estimation/kalman-cycle.svg'],fingerprints={};
for(const name of sourceFiles){const src=fs.readFileSync(name,'utf8').replace(/\r\n/g,'\n');assert.equal(src,fs.readFileSync('D:/Workspace/control-universe-rank4-est03/'+name,'utf8').replace(/\r\n/g,'\n'));fingerprints[name]=createHash('sha256').update(src).digest('hex');}
fs.writeFileSync(dir+'source-fingerprints.json',JSON.stringify(fingerprints,null,2));
console.log(JSON.stringify({pass:true,sourceHash,notebooks:3,cells:6,tsConfigurations:15,curvePoints:1515,tolerance:1e-10,fingerprints}));
