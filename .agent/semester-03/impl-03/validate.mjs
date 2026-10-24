import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const e='.agent/semester-03/impl-03/',read=p=>JSON.parse(fs.readFileSync(e+p,'utf8'));
const source=fs.readFileSync('content/implementation/pid-engineering-tuning.mdx','utf8').replace(/\r\n/g,'\n');
const sha=createHash('sha256').update(source).digest('hex');
const numerical=read('reconciliation.json'),reference=read('reference.json'),py=read('pyodide.json');
assert(numerical.pass);assert.equal(numerical.sourceHash,sha);assert.equal(py.lessons[0].sourceHash,sha);assert(py.complete);
assert(py.lessons[0].notebooks.every(n=>n.status==='passed'&&n.cells.every(c=>c.status==='passed')));
const builds=read('build-results.json');assert.equal(builds.length,2);assert(builds.every(b=>b.exit===0));
const layout=read('narrow-layout-final.json');assert.equal(layout.width,layout.scroll);assert(layout.canvas>200);assert(layout.table>layout.tableRegion);
const dom=read('pages-dom.json');assert.equal(dom.h1.length,1);assert.equal(dom.h2.length,8);assert.equal(dom.katex,0);assert.equal(dom.canvas,1);assert.deepEqual(dom.missing,[]);assert.deepEqual(dom.duplicates,[]);assert(dom.images.every(i=>i.loaded));assert.equal(dom.width,dom.scroll);
assert.deepEqual(read('pages-errors.json'),[]);
let compared=0;const near=(x,y,tol=5.1e-5)=>{assert(Math.abs(x-y)<=tol,`${x} != ${y}`);compared++;};
for(const v of read('native-interactions.json')){
 const expected=reference.cases.find(r=>r.lambda===Number(v.lambda)&&r.scenario===v.scenario);assert(expected);
 const metrics=v.metrics.match(/-?\d+(?:\.\d+)?/g).map(Number);Object.values(expected.metrics).forEach((n,i)=>near(metrics[i],n));
 const gains=v.gains.match(/-?\d+(?:\.\d+)?/g).map(Number);[expected.Kp,expected.Ti,expected.Ki].forEach((n,i)=>near(gains[i],n));
}
// Every printed experiment table value is checked, not just the default.
const rows=source.split('\n').filter(l=>/^\| (标称|延迟增大|不可达|扰动与噪声) \|/.test(l));assert.equal(rows.length,12);
const names={'标称':'nominal','延迟增大':'delay','不可达':'unreachable','扰动与噪声':'noise'};
for(const row of rows){const cells=row.split('|').slice(1,-1).map(s=>s.trim());const expected=reference.cases.find(r=>r.lambda===Number(cells[1])&&r.scenario===names[cells[0]]);Object.values(expected.metrics).forEach((n,i)=>near(Number(cells[i+2]),n));}
const native=read('native-notebook-ui.json');assert.deepEqual(native.busy,[]);assert.equal(native.outputs.length,2);
const nb=read('pages-notebook-ui.json');assert.deepEqual(nb.busy,[]);assert.equal(nb.outputs.length,2);
const summary={pass:true,sourceHash:sha,configs:numerical.configs,tsQuantities:numerical.tsQuantities,tsError:numerical.tsError,maxNotebookError:numerical.maxError,notebooks:2,cells:4,compared,h2:8,nativeAndPagesNotebookUi:true,narrowLayout:layout,builds};
fs.writeFileSync(e+'validation.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));
