import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.agent/semester-03/rl-02/',read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'));
const key='rl-control/dynamic-programming';
const hash=createHash('sha256').update(fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n')).digest('hex');
const p=read('pyodide.json');assert(p.complete);assert.equal(p.lessons[0].sourceHash,hash);
assert.equal(p.totals.enabled,2);assert.equal(p.totals.codeOnly,0);
let cells=0;for(const n of p.lessons[0].notebooks){assert.equal(n.status,'passed');assert.equal(n.cells.length,n.cellCount);for(const c of n.cells){cells++;assert.equal(c.status,'passed');assert(!c.outputs.some(o=>o.type==='error'));}}assert.equal(cells,4);
const native=read('notebooks.json');assert.equal(native.totals.FAIL,0);assert.equal(native.totals.SKIPPED,0);assert.equal(native.executionStatus,'EXECUTED');
const r=read('reconciliation.json');assert(r.pass);assert.equal(r.independent.configs,364);assert.equal(r.independent.finiteHorizonLP,74);assert.equal(r.axis.configs,70602);assert(r.independent.maxError<1e-9);
for(const name of ['browser-pages.json','browser-mobile.json']){
 const d=read(name);assert.equal(d.h1,1);assert.equal(d.h2.length,10);assert.equal(d.katex,0);assert.equal(new Set(d.ids).size,d.ids.length);
 for(const href of d.hrefs){const id=decodeURIComponent(href.split('#')[1]||'');assert(!id||d.ids.includes(id),href);}
 assert(d.scrollWidth<=d.width+1,name);assert(d.charts.every(c=>c.width>100&&c.height>=290));
}
const page=read('browser-pages.json');assert.equal(page.outputs.length,4);for(const text of ['episodic V_H Q_deliver Q_charge V_L 6.0 2.0 4.4 2.6','gamma=1 cyclic rank 1','policy solve 2','backups 206','tolerance met True','finite horizon gamma=1 episodic charge return 5'])assert(page.outputs.some(t=>t.includes(text)),text);
assert(!page.notebookText.includes('Failed to fetch'));assert(!page.notebookText.includes('Traceback'));
assert.equal(read('browser-console.json').length,0);
const controls=read('browser-controls.json');assert.equal(controls.length,12);assert(controls.find(c=>c.name==='N=0').text.includes('0.000000 / 0.000000'));
assert(controls.find(c=>c.name==='持平阈值').text.includes('配送 23.157895，充电 23.157895'));
for(const name of ['配送最优','充电最优','持平阈值'])assert(controls.find(c=>c.name===name).sliders.find(c=>c.label==='充电概率 α').disabled);
assert(!controls.find(c=>c.name==='恢复默认').sliders.find(c=>c.label==='充电概率 α').disabled);
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));assert.equal(policy.lessons[key].sourceHash,hash);assert(policy.lessons[key].notebooks.every(n=>n.status==='enabled'));
console.log(JSON.stringify({pass:true,sourceHash:hash,notebooks:2,cells,independent:364,finiteHorizonLP:74,axisConfigs:70602,browserPages:true,mobile:true,policy:true}));
