import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.agent/semester-03/rl-01/',read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'));
const key='rl-control/rl-basics',source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n');
const hash=createHash('sha256').update(source).digest('hex');
const p=read('pyodide.json');assert(p.complete);assert.equal(p.lessons[0].sourceHash,hash);
assert.equal(p.totals.enabled,2);assert.equal(p.totals.codeOnly,0);
for(const n of p.lessons[0].notebooks){assert.equal(n.status,'passed');assert.equal(n.cells.length,n.cellCount);for(const c of n.cells){assert.equal(c.status,'passed');assert(!c.outputs.some(o=>o.type==='error'));}}
const native=read('notebooks.json');assert.equal(native.totals.FAIL,0);assert.equal(native.totals.SKIPPED,0);assert.equal(native.executionStatus,'EXECUTED');
const reconciliation=read('reconciliation.json');assert(reconciliation.pass);assert.equal(reconciliation.independent.configs,61206);
for(const name of ['browser-pages.json','browser-mobile.json']){
 const dom=read(name);assert.equal(dom.h1,1);assert.equal(dom.h2.length,9);assert.equal(dom.katex,0);
 assert.equal(new Set(dom.ids).size,dom.ids.length);
 for(const href of dom.hrefs){const id=decodeURIComponent(href.split('#')[1]||'');assert(!id||dom.ids.includes(id),href);}
 assert(dom.scrollWidth<=dom.width+1,name);
}
const page=read('browser-pages.json');assert(page.notebookText.includes('2.5999999999999996'));assert(page.notebookText.includes('5.42'));assert(page.notebookText.includes('terminal guard'));assert(!page.notebookText.includes('Failed to fetch'));
const controls=read('browser-controls.json');assert(controls.find(c=>c.name==='持平工况').text.includes('4.4000；先充电 4.4000'));
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));assert.equal(policy.lessons[key].sourceHash,hash);assert(policy.lessons[key].notebooks.every(n=>n.status==='enabled'));
console.log(JSON.stringify({pass:true,sourceHash:hash,notebooks:2,cells:3,configs:61206,browserPages:true,mobile:true,policy:true}));
