import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const e='.agent/semester-03/impl-05/',snap='D:/Workspace/control-universe-rank1-impl05-validation/',read=p=>JSON.parse(fs.readFileSync(e+p,'utf8'));
const source=fs.readFileSync('content/implementation/embedded-implementation.mdx','utf8').replace(/\r\n/g,'\n'),hash=createHash('sha256').update(source).digest('hex');
const num=read('reconciliation.json'),ref=read('reference.json'),py=read('pyodide.json');
assert(num.pass);assert.equal(num.sourceHash,hash);assert.equal(py.lessons[0].sourceHash,hash);assert(py.complete);assert(py.lessons[0].notebooks.every(n=>n.status==='passed'&&n.cells.length===2&&n.cells.every(c=>c.status==='passed')));
const builds=read('build-results.json');assert.equal(builds.length,2);assert(builds.every(b=>b.exit===0));const origin=read('build-origin.json');assert.equal(origin.sourceHash,hash);
const cfg=fs.readFileSync(snap+'postcss.config.mjs');assert.deepEqual(cfg,fs.readFileSync('postcss.config.mjs'));assert.equal(origin.postcssHash,createHash('sha256').update(cfg).digest('hex'));
const page=fs.readFileSync(snap+'out/implementation/embedded-implementation/index.html','utf8');const cssPaths=[...page.matchAll(/href="([^" ]+\.css)"/g)].map(m=>m[1]);assert(cssPaths.length>0);
const css=cssPaths.map(url=>{const bytes=fs.readFileSync(snap+'out/'+url.replace(/^\/control-universe\//,''));return {url,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),typographyCompiled:bytes.toString().includes('.prose')};});assert(css.some(c=>c.typographyCompiled));assert(css.every(c=>c.bytes>0));
for(const name of ['narrow-layout.json','pages-narrow-layout.json']){const v=read(name);assert.equal(v.width,v.scroll);assert(v.canvas>200);assert(v.table>v.region);}
for(const name of ['native-dom.json','pages-dom.json']){const v=read(name);assert.equal(v.h1.length,1);assert.equal(v.h2.length,9);assert.equal(v.katex,0);assert.equal(v.canvas,1);assert.deepEqual(v.missing,[]);assert.deepEqual(v.duplicates,[]);assert(v.images.every(i=>i.loaded));assert.equal(v.width,v.scroll);assert(v.articleWidth<v.width-100);assert.deepEqual(v.h2,num.rendered.h2.map(h=>({text:h.text,id:h.id})));}
assert.deepEqual(read('pages-errors.json'),[]);
let compared=0;function near(a,b,tol=1e-10){if(Array.isArray(b)){assert.equal(a.length,b.length);b.forEach((v,i)=>near(a[i],v,tol));return;}if(b&&typeof b==='object'){for(const[k,v]of Object.entries(b))near(a[k],v,tol);return;}if(typeof b!=='number'){assert.equal(a,b);return;}assert(Number.isFinite(a));assert(Math.abs(a-b)<=tol,`${a} != ${b}`);compared++;}
for(const row of read('native-interactions.json')){
 const c=ref.cases.find(c=>c.bits===row.bits&&c.slots===row.slots&&c.target===row.target);assert(c);
 const first=row.first.match(/-?\d+(?:\.\d+)?/g).map(Number);near(first,[c.firstCode,c.firstRead,c.firstPWM,c.firstY],5.1e-7);
 const metrics=row.metrics.match(/-?\d+(?:\.\d+)?/g).map(Number);near(metrics,[10,c.finalY,c.finalIdeal,c.maxGap,c.saturated],5.1e-7);
}
const rows=source.split('\n').filter(s=>/^\| (20|60|110) \|/.test(s));assert.equal(rows.length,9);
for(const row of rows){const a=row.split('|').slice(1,-1).map(s=>Number(s.trim())),c=ref.cases.find(c=>c.target===a[0]&&c.bits===a[1]&&c.slots===100);near(a.slice(2),[c.finalY,c.finalIdeal,c.maxGap,c.saturated],5.1e-9);}
for(const name of ['native-notebook-ui.json','pages-notebook-ui.json']){
 const r=read(name);assert.deepEqual(r.busy,[]);assert.equal(r.outputs.length,4);const values=r.outputs.map(s=>JSON.parse(s.trim()));
 near(values[0],num.values[0]);near(values[1],num.values[1]);assert.equal(values[1].maximumEquilibrium,100);near(values[2],num.values[2].events);near(values[3],num.values[2].boundaries);assert.equal(r.images,4);
}
const cssReport={pass:true,configMatchesWorkspace:true,postcssHash:origin.postcssHash,css,articleWidth:read('pages-dom.json').articleWidth,viewport:read('pages-dom.json').width,narrow:read('pages-narrow-layout.json')};fs.writeFileSync(e+'css-verification.json',JSON.stringify(cssReport,null,2)+'\n');
const summary={pass:true,sourceHash:hash,configs:num.configs,tsQuantities:num.tsQuantities,tsError:num.tsError,allNumericQuantities:num.quantities,compared,notebooks:3,cells:6,h2:9,nativeAndPagesNotebookUi:true,narrowLayout:read('pages-narrow-layout.json'),postcssHash:origin.postcssHash,builds};
fs.writeFileSync(e+'validation.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));
