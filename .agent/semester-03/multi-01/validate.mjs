import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.agent/semester-03/multi-01/',read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
const source=fs.readFileSync('content/multi-agent/multi-agent-overview.mdx','utf8').replace(/\r\n/g,'\n');
const hash=createHash('sha256').update(source).digest('hex'),proof=read('pyodide.json');
assert(proof.complete);assert.equal(proof.lessons[0].sourceHash,hash);assert.equal(proof.lessons[0].notebooks.length,2);
for(const n of proof.lessons[0].notebooks){assert.equal(n.status,'passed');assert.equal(n.cells.length,2);assert(n.cells.every(c=>c.status==='passed'&&!c.outputs.some(o=>o.type==='error')));}
const reconciliation=read('reconciliation.json');assert(reconciliation.pass);assert.equal(reconciliation.configs,135);assert(reconciliation.independent.maximum_error<1e-9);
for(const mode of ['normal','pages']){
 const p=read(`browser-${mode}.json`);assert.equal(p.h1,1);assert.equal(p.h2.length,8);assert.equal(p.katexErrors,0);assert.equal(p.duplicates.length,0);assert.equal(p.brokenFragments.length,0);assert(p.images.every(x=>x.loaded));
 const mobile=read(`mobile-${mode}.json`);assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375);
 assert.equal(read(`controls-${mode}.json`).length,7);assert.equal(read(`errors-${mode}.json`).length,0);
}
const shown=read('page-python-pages.json');assert(shown.pass);assert.equal(shown.errors.length,0);assert(shown.outputs.join('\n').includes("exact step1= ['1/4', '7/4', '4']"));
assert.equal(read('notebooks.json').executionStatus,'EXECUTED');assert.equal(read('notebooks.json').totals.FAIL,0);assert.equal(read('notebooks.json').totals.SKIPPED,0);
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));assert.equal(policy.lessons['multi-agent/multi-agent-overview'].sourceHash,hash);assert(policy.lessons['multi-agent/multi-agent-overview'].notebooks.every(n=>n.status==='enabled'));
console.log(JSON.stringify({pass:true,hash,configurations:135,notebooks:2,cells:4,mobile:375,headings:8}));
