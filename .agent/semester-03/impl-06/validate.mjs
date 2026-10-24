import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const e='.agent/semester-03/impl-06/',snap='D:/Workspace/control-universe-rank1-impl06-validation/',read=p=>JSON.parse(fs.readFileSync(e+p,'utf8'));
const source=fs.readFileSync('content/implementation/realtime-control.mdx','utf8').replace(/\r\n/g,'\n'),hash=createHash('sha256').update(source).digest('hex'),num=read('reconciliation.json'),ref=read('reference.json'),py=read('pyodide.json');
assert(num.pass);assert.equal(num.sourceHash,hash);assert.equal(py.lessons[0].sourceHash,hash);assert(py.complete);assert.equal(py.lessons[0].notebooks.length,4);assert(py.lessons[0].notebooks.every(n=>n.status==='passed'&&n.cells.length===2&&n.cells.every(c=>c.status==='passed')));
const builds=read('build-results.json');assert.equal(builds.length,2);assert(builds.every(b=>b.exit===0));const origin=read('build-origin.json');assert.equal(origin.sourceHash,hash);
const cfg=fs.readFileSync(snap+'postcss.config.mjs');assert.deepEqual(cfg,fs.readFileSync('postcss.config.mjs'));assert.equal(origin.postcssHash,createHash('sha256').update(cfg).digest('hex'));
const html=fs.readFileSync(snap+'out/implementation/realtime-control/index.html','utf8'),paths=[...html.matchAll(/href="([^" ]+\.css)"/g)].map(m=>m[1]);assert(paths.length>0);
const css=paths.map(url=>{const b=fs.readFileSync(snap+'out/'+url.replace(/^\/control-universe\//,''));return {url,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex'),typographyCompiled:b.toString().includes('.prose')};});assert(css.some(c=>c.typographyCompiled));assert(css.every(c=>c.bytes>0));
for(const name of ['narrow-layout.json','pages-narrow-layout.json']){const v=read(name);assert.equal(v.width,v.scroll);assert(v.canvas>200);assert(v.table>v.region);}
for(const name of ['native-dom.json','pages-dom.json']){const v=read(name);assert.equal(v.h1.length,1);assert.equal(v.h2.length,9);assert.equal(v.h3.length,23);assert.equal(v.katex,0);assert.equal(v.canvas,1);assert.deepEqual(v.missing,[]);assert.deepEqual(v.duplicates,[]);assert(v.images.every(i=>i.loaded));assert.equal(v.width,v.scroll);assert(v.articleWidth<v.width-100);assert.deepEqual(v.h2,num.rendered.h2.map(h=>({text:h.text,id:h.id})));assert(num.oldAnchors.every(id=>v.ids.includes(id)));}
assert.deepEqual(read('pages-errors.json'),[]);
let compared=0;function near(a,b,tol=1e-10){if(b===null){assert.equal(a,null);return;}if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}if(typeof b!=='number'){assert.equal(a,b);return;}assert(Number.isFinite(a));assert(Math.abs(a-b)<=tol,`${a} != ${b}`);compared++;}
for(const row of read('native-interactions.json')){
 const c=ref.cases.find(c=>c.caseId===row.caseId&&(row.caseId!==0||c.c3===row.c3)&&c.policy===row.policy);assert(c);
 const a=row.metrics.match(/-?\d+(?:\.\d+)?/g).map(Number);near(a,[c.utilization,c.bound,...c.first,c.due,c.misses,c.pending],5.1e-7);
}
const table=source.split('\n').filter(s=>/^\| (默认|两任务示例|高利用率|过载) \|/.test(s));assert.equal(table.length,4);
table.forEach((row,i)=>{const a=row.split('|').slice(2,-1).map(s=>Number(s.trim())),r=ref.cases.find(c=>c.caseId===i&&c.c3===3&&c.policy==='RMS'),d=ref.cases.find(c=>c.caseId===i&&c.c3===3&&c.policy==='EDF');near(a,[r.utilization,r.misses,d.misses,r.due],5.1e-9);});
for(const name of ['native-notebook-ui.json','pages-notebook-ui.json']){
 const r=read(name);assert.deepEqual(r.busy,[]);assert.equal(r.outputs.length,5);const values=r.outputs.map(s=>JSON.parse(s.trim()));
 near(values[0],num.values[0]);near(values[1],num.values[1]);near(values[2],num.values[2]);near(values[3],{implementation:num.values[3].implementation,lookup:num.values[3].lookup});near(values[4],num.values[3].watchdog);assert.equal(r.images,5);
}
const audit=read('audit.json');assert.equal(audit.h3.length,23);assert(audit.sameAsHEAD);assert.equal(audit.notebooks,1);assert.equal((source.match(/\*\*习题 [1-5]/g)||[]).length,5);assert.equal((source.match(/\*\*答案 [1-5]/g)||[]).length,5);
const cssReport={pass:true,configMatchesWorkspace:true,postcssHash:origin.postcssHash,css,articleWidth:read('pages-dom.json').articleWidth,viewport:read('pages-dom.json').width,narrow:read('pages-narrow-layout.json')};fs.writeFileSync(e+'css-verification.json',JSON.stringify(cssReport,null,2)+'\n');
const result={pass:true,sourceHash:hash,configs:num.configs,tsQuantities:num.tsQuantities,tsError:num.tsError,allNumericQuantities:num.quantities,compared,notebooks:4,cells:8,h2:9,preservedH3:23,exercises:5,nativeAndPagesNotebookUi:true,narrowLayout:read('pages-narrow-layout.json'),postcssHash:origin.postcssHash,builds};fs.writeFileSync(e+'validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
