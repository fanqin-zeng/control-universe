import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash}from'node:crypto';import {extractNotebooks}from'../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/est-07/',read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'));
const raw=fs.readFileSync('content/estimation/sensor-fusion.mdx','utf8'),sourceHash=createHash('sha256').update(raw.replace(/\r\n/g,'\n')).digest('hex');
const py=read('pyodide.json');assert(py.complete);assert.equal(py.lessons[0].sourceHash,sourceHash);assert.equal(py.totals.enabled,3);assert.equal(py.totals.codeOnly,0);
const extracted=read('extracted.json'),notebooks=extractNotebooks(raw);assert.equal(notebooks.length,3);
for(const [i,nb]of notebooks.entries()){
 assert.equal(nb.setup.value,extracted.notebooks[i].setupCode);assert.deepEqual(nb.cells.map(c=>c.value),extracted.notebooks[i].cells.map(c=>c.code));assert.equal(py.lessons[0].notebooks[i].status,'passed');assert.equal(py.lessons[0].notebooks[i].cells.length,2);
}
const contract=read('notebook-contract.json');for(const [i,nb]of notebooks.entries()){assert.equal(nb.setup.value.replace(/\r\n/g,'\n'),contract.notebooks[i].setupCode.replace(/\r\n/g,'\n'));assert.deepEqual(nb.cells.map(c=>c.value.replace(/\r\n/g,'\n')),contract.notebooks[i].cells.map(c=>c.code.replace(/\r\n/g,'\n')));}const kernel=read('notebooks.json');assert.equal(kernel.kernelRequired,true);assert.equal(kernel.executionStatus,'EXECUTED');assert.equal(kernel.totals.FAIL,0);assert.equal(kernel.totals.SKIPPED,0);assert.equal(kernel.lessons[0].cells.length,6);
const numeric=read('reconciliation.json');assert(numeric.pass);assert.equal(numeric.configurations,64);assert.equal(numeric.ciCases,105);assert(numeric.maxDifference<1e-12);
for(const name of ['native','pages']){const b=read('browser-'+name+'.json');assert(b.pass);assert.equal(b.dom.h2.length,10);assert.equal(b.errors.length,0);assert.equal(b.consoleErrors.length,0);assert.equal(b.cases.length,64);assert(b.mobile.scroll<=375);}

const originalLines=read('original-python.json').flatMap(r=>r.output.trim().split(/\r?\n/));
const numberList=line=>[...line.replace(/np\.float64\(([^)]+)\)/g,'$1').matchAll(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi)].map(m=>Number(m[0]));
function compareOutputs(text){const lines=text.split(/\r?\n/).map(l=>l.trim());const labels=[...new Set(originalLines.map(l=>l.split(' ')[0]))];let count=0;for(const label of labels){const expected=originalLines.filter(l=>l.split(' ')[0]===label),actual=lines.filter(l=>l===label||l.startsWith(label+' '));assert.equal(actual.length,expected.length,label);for(let i=0;i<expected.length;i++){const a=numberList(actual[i]),b=numberList(expected[i]);assert.equal(a.length,b.length,label);for(let j=0;j<a.length;j++)assert(Math.abs(a[j]-b[j])<1e-12,label);count++;}}assert.equal(count,originalLines.length);}
compareOutputs(py.lessons[0].notebooks.flatMap(n=>n.cells.flatMap(c=>c.outputs.filter(o=>o.type==='stream').map(o=>o.text))).join('\n'));
for(const name of ['native','pages'])compareOutputs(read('browser-'+name+'.json').dom.text);

const sourceFiles=['content/estimation/sensor-fusion.mdx','components/wiki/sensor-fusion-explorer.tsx','lib/sensor-fusion.ts','public/diagrams/estimation/sensor-information.svg'],fingerprints={};
for(const name of sourceFiles){const src=fs.readFileSync(name,'utf8').replace(/\r\n/g,'\n');assert.equal(src,fs.readFileSync('D:/Workspace/control-universe-rank4-est07/'+name,'utf8').replace(/\r\n/g,'\n'));fingerprints[name]=createHash('sha256').update(src).digest('hex');}
const dependencies={};for(const name of ["components/wiki/use-echarts.tsx","components/wiki/jupyter-notebook.tsx","lib/content.ts","app/(wiki)/[chapter]/[lesson]/page.tsx"]){const src=fs.readFileSync('D:/Workspace/control-universe-rank4-est07/'+name,'utf8').replace(/\r\n/g,'\n');dependencies[name]=createHash('sha256').update(src).digest('hex');}fs.writeFileSync(dir+'dependency-fingerprints.json',JSON.stringify(dependencies,null,2));
fs.writeFileSync(dir+'source-fingerprints.json',JSON.stringify(fingerprints,null,2));console.log(JSON.stringify({pass:true,sourceHash,notebooks:3,cells:6,tsConfigurations:64,ciCases:105,tolerance:1e-12,fingerprints}));
