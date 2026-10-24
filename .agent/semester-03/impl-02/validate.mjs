import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.agent/semester-03/impl-02/';const read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
const rec=read('reconciliation.json'),native=read('browser-native.json'),pages=read('browser-pages.json'),mobile=read('browser-mobile.json'),proof=read('pyodide.json'),nb=read('notebooks.json');
const source=fs.readFileSync('content/implementation/digital-pid.mdx','utf8').replace(/\r\n/g,'\n');
assert.equal(rec.sourceHash,createHash('sha256').update(source).digest('hex'));
assert.equal(proof.lessons[0].sourceHash,rec.sourceHash);assert(proof.complete);
assert(proof.lessons[0].notebooks.every(n=>n.status==='passed'&&n.cells.every(c=>c.status==='passed')));
assert.equal(nb.executionStatus,'EXECUTED');assert.equal(nb.totals.FAIL,0);assert.equal(nb.totals.SKIPPED,0);
let compared=0;function near(a,b){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v));return;}if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v);return;}assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);compared++;}
for(const record of [native,pages]){
 const d=record.dom;assert.equal(d.h1,1);assert.equal(d.h2.length,8);assert.equal(d.katexErrors,0);assert.equal(d.canvases,1);
 assert.equal(new Set(d.ids).size,d.ids.length);assert.deepEqual(d.missingOld,[]);assert.deepEqual(d.badAnchors,[]);assert(d.images.every(i=>i.loaded));
 const streams=d.outputs.filter(s=>s.trim().startsWith('{')).map(s=>JSON.parse(s.split('\n')[0]));assert.equal(streams.length,5);
 for(const rule of ['rectangle','trapezoid']){near(streams[0][rule].position,rec.values[0][rule]);near(streams[0][rule].increment,rec.values[0][rule]);assert(streams[0][rule].max_difference<1e-12);}
 near(streams[1],rec.values[1].sample);near(streams[2],rec.values[1].metrics);near(streams[3],{sampled:rec.values[2].sampled,continuous:rec.values[2].continuous});near(streams[4],rec.values[3]);
}
assert.equal(mobile.width,mobile.scrollWidth);assert(mobile.width<=375);assert.equal(mobile.katexErrors,0);
assert(pages.dom.modes.every(m=>m==='browser'));assert(pages.dom.images.filter(i=>i.src.includes('diagrams')).every(i=>i.src.startsWith('/control-universe/')));
assert.deepEqual(pages.errors,[]);assert(native.boundary.includes('4.1667')&&native.boundary.includes('-3.9000'));assert(native.lower.includes('Kb=0'));assert(native.defaults.includes('0.7000'));
const report={pass:true,sourceHash:rec.sourceHash,compared,oldIds:read('headings-before.json').ids.length,configs:rec.configs,tsError:rec.tsError,numericalError:rec.maxError,notebooks:4,cells:8,mobileWidth:mobile.width,productionErrors:pages.errors.length,transientDevErrors:native.errors.length};
fs.writeFileSync(dir+'validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
