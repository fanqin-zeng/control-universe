import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {parseCatalog} from '../../../scripts/lib-catalog.mjs';
const folder='.agent/semester-03/id-02/',key='identification/model-structures';
const json=p=>JSON.parse(readFileSync(folder+p,'utf8'));
const source=readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n');
const hash=createHash('sha256').update(source).digest('hex');
const py=json('pyodide.json');assert(py.complete);assert.equal(py.lessons[0].sourceHash,hash);assert.equal(py.lessons[0].key,key);assert.equal(py.lessons[0].notebooks.length,2);
let cells=0;for(const nb of py.lessons[0].notebooks){assert.equal(nb.status,'passed');assert.equal(nb.cells.length,nb.cellCount);for(const cell of nb.cells){assert.equal(cell.status,'passed');assert(!cell.outputs.some(o=>o.type==='error'));cells++;}}assert.equal(cells,4);
const reference=json('reconciliation.json');assert(reference.pass);assert.equal(reference.values,178);assert(reference.maxError<1e-12);
const lesson=parseCatalog(readFileSync('content/catalog.ts','utf8')).find(c=>c.slug==='identification').lessons.find(l=>l.slug==='model-structures');
for(const name of ['native','pages']){const report=json('browser-'+name+'.json');assert(report.pass);assert.equal(report.dom.h1,1);assert.equal(report.dom.katexErrors,0);assert.deepEqual(report.dom.h2.map(h=>h.text),lesson.subsections.map(h=>h.title));assert.deepEqual(report.dom.h2.map(h=>h.id),lesson.subsections.map(h=>h.slug));assert.equal(new Set(report.dom.ids).size,report.dom.ids.length);assert(report.dom.images.every(i=>i.loaded));assert(report.dom.images.some(i=>i.src==='inline-python-plot'));assert(report.mobile.scroll<=report.mobile.width);assert.equal(report.errors.length,0);assert(report.dom.text.includes('pole_zero_same_noise_channel True'));assert(report.dom.text.includes('steady_tail_loss_cm 0.4096'));}
for(const file of ['build.log','pages-build.log']){const log=readFileSync(folder+file,'utf8');assert(!log.includes('Failed to compile'));assert(log.includes('Route (app)'));}
const nb=json('notebooks.json');assert.equal(nb.executionStatus,'EXECUTED');assert.equal(nb.totals.FAIL,0);assert(nb.kernelRequired);
console.log(JSON.stringify({pass:true,sourceHash:hash,notebooks:2,cells,independentValues:reference.values,maxError:reference.maxError,realPages:2,h2:10}));
