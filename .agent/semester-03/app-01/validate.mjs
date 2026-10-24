import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/app-01/';
const load=n=>JSON.parse(readFileSync(dir+n,'utf8'));
const rawSource=readFileSync('content/applications/power-electronics.mdx','utf8');
const source=rawSource.replace(/\r\n/g,'\n');
const hash=createHash('sha256').update(source).digest('hex');
const proof=load('pyodide.json');
assert(proof.complete);assert.equal(proof.lessons[0].sourceHash,hash);
const original=extractNotebooks(rawSource),archived=load('original-notebooks.json');
assert.deepEqual(original,archived);
assert.equal(original.length,3);assert.equal(original.flatMap(n=>n.cells).length,4);
assert(proof.lessons[0].notebooks.every(n=>n.status==='passed'&&n.cells.every(c=>c.status==='passed')));
const native=load('notebooks.json');assert.equal(native.executionStatus,'EXECUTED');assert.equal(native.totals.FAIL,0);assert.equal(native.totals.SKIPPED,0);
const reference=load('reconciliation.json');assert(reference.maxTsError<1e-10);assert(reference.piError<1e-8);
const desktop=load('browser-native.json'),pages=load('browser-pages.json');
const headings=[...source.matchAll(/^## (.+)$/gm)].map(m=>m[1]);
for(const ui of [desktop,pages]) {
  assert.deepEqual(ui.h2.map(x=>x.text),headings);
  assert.equal(ui.katex,0);
  assert.equal(new Set(ui.ids).size,ui.ids.length);
  for(const link of ui.links) assert(ui.ids.includes(decodeURIComponent(link.split('#')[1])));
  assert(ui.images.every(i=>i.ok));assert.equal(ui.outputs.length,4);
  assert(ui.outputs[0].includes('12.0 2.0 24.0 0.3 0.01875 1.85 80.0'));
  assert(ui.outputs[1].includes('INVALID'));
  const lines=ui.outputs[1].split('\n').filter(x=>x.startsWith('R, Imin'));
  for(const [i,line]of lines.entries()) {
    const values=line.split(':')[1].trim().split(/\s+/).map(Number),truth=reference.periodic[i];
    for(const [value,expected]of [[values[1],truth.minCurrent],[values[2],truth.ripple[0]],[values[3],truth.ripple[1]]])assert(Math.abs(value-expected)<1e-8);
  }
  const pi=ui.outputs[2].split('\n').find(x=>x.startsWith('v(20ms)')).split(':')[1].trim().split(/\s+/).map(Number);
  assert(Math.abs(pi[0]-reference.piVoltage20ms)<1e-8);assert(Math.abs(pi[1]-reference.piVoltage50ms)<1e-8);
}
assert(pages.images.some(i=>i.src?.startsWith('/control-universe/diagrams/')));
assert(pages.status.filter(t=>t==='运行完成').length===3);
const mobile=load('browser-mobile.json');assert.equal(mobile.width,360);assert.equal(mobile.scrollWidth,360);assert.equal(mobile.h2,8);assert.equal(mobile.katex,0);
const result={pass:true,sourceHash:hash,notebooks:3,cells:4,tsCases:reference.cases,maxTsError:reference.maxTsError,piError:reference.piError,headings:8,mobileWidth:360};
writeFileSync(dir+'validation.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
