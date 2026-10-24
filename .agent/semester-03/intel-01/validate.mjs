import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/intel-01/',key='intelligent/fuzzy-control-basics';
const read=f=>JSON.parse(fs.readFileSync(dir+f,'utf8'));
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n'),tested=fs.readFileSync(dir+'source-tested.mdx','utf8').replace(/\r\n/g,'\n');
const hash=s=>createHash('sha256').update(s).digest('hex');
const r=read('reconciliation.json'),py=read('pyodide.json'),native=read('browser-native.json'),mobile=read('browser-mobile.json');
assert(r.pass&&r.reference.pass);assert.equal(r.sourceHash,hash(tested));assert.equal(py.lessons[0].sourceHash,hash(source));assert(py.complete);
const code=s=>extractNotebooks(s).map(n=>[n.setup.value,...n.cells.map(c=>c.value)]);
assert.deepEqual(code(source),code(tested));
r.sourceReconciliation={testedSourceHash:r.sourceHash,currentSourceHash:hash(source),method:'Exact setup/cell equality; only local table wrappers added after native capture'};
r.sourceHash=hash(source);fs.writeFileSync(dir+'reconciliation-final.json',JSON.stringify(r,null,2)+'\n');
const stream=outs=>outs.filter(o=>o.type==='stream'&&o.name!=='stderr').map(o=>o.text||'').join('');
const numbers=s=>[...s.matchAll(/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi)].map(m=>+m[0]);
let compared=0,maxNormalizedError=0;
for(const[i,b]of r.notebooks.entries()){
 const other=py.lessons[0].notebooks[i];assert.equal(other.status,'passed');assert.equal(b.cells,other.cellCount);
 for(const[j,c]of other.cells.entries()){
  assert.equal(c.status,'passed');
  if(i===9)continue; // Current-load benchmark times have no cross-runtime equality contract.
  const a=numbers(stream(b.outputs[j+1])),e=numbers(stream(c.outputs));assert.equal(a.length,e.length,`${i+1}/${j+1} number count`);
  for(let k=0;k<a.length;k++){
   const tol=Math.max(2e-5,Math.abs(a[k])*1e-6);const err=Math.abs(a[k]-e[k]);
   assert(err<=tol,`${i+1}/${j+1}/${k}: native ${a[k]} browser ${e[k]}`);compared++;maxNormalizedError=Math.max(maxNormalizedError,err/tol);
  }
 }
}
const rendered=await renderedHeadings(source,key),old=read('headings-before.json');
assert.deepEqual(rendered.h2,old.h2);assert.deepEqual(mobile.h2,rendered.h2.map(({id,text})=>({id,text})));
for(const id of old.ids)assert(mobile.ids.includes(id),id);
assert.equal(new Set(mobile.ids).size,mobile.ids.length);
for(const a of mobile.anchors){const id=decodeURIComponent(a.split('#')[1]);if(id)assert(mobile.ids.includes(id),a);}
assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375&&mobile.bodyScrollWidth<=375);assert.equal(mobile.canvases,3);assert.equal(mobile.katexErrors,0);assert(mobile.images.every(i=>i.loaded));
assert.equal(native.h1,1);assert.equal(native.h2,12);assert.equal(native.katexErrors,0);assert.equal(native.charts,3);assert(native.restored);assert(native.defaults.valid);assert.equal(native.wideOverlap,'4 / 5');assert.equal(native.noCoverage.text,'无覆盖：回退0');
assert.equal(r.reference.configs,868);assert(r.twoInputSampleErrors.every(e=>e<1e-6));
const strict=fs.readFileSync(dir+'notebooks.log','utf8');assert(strict.includes('33 个 cell，其中 error 0 个'));assert(!strict.includes('SKIPPED'));
const dynamic=read('dynamics-reference.json');assert(dynamic.pass);assert.equal(dynamic.cases.length,28);
const pp=read('browser-pages.json');assert.deepEqual(pp.h2,mobile.h2);assert.equal(pp.canvases,3);assert.equal(pp.katexErrors,0);assert.equal(pp.defaultNotebookUi.status,'运行完成');assert.equal(pp.errors.length,0);assert(pp.images.every(i=>i.loaded&&i.src.startsWith('/control-universe/')));
for(const id of old.ids)assert(pp.ids.includes(id),id);
for(const f of ['pages-build-final.log','scoped-check.log','scoped-semester.log','scoped-fix-check.log','scoped-python-policy.log'])assert(fs.existsSync(dir+f),f);
const pagesBuild=fs.readFileSync(dir+'pages-build-final.log','utf8');assert(pagesBuild.includes('First Load JS'));assert(pagesBuild.includes('"lessons":205'));assert(!/Failed to compile|MDX 编译失败|Error occurred prerendering/.test(pagesBuild));
const build=fs.readFileSync(dir+'build-final.log','utf8');assert(build.includes('First Load JS'));assert(!/Failed to compile|MDX 编译失败|Error occurred prerendering/.test(build));
const report={pass:true,sourceHash:hash(source),notebooks:r.notebooks.length,cells:r.notebooks.reduce((n,b)=>n+b.cells,0),comparedQuantities:compared,maxNormalizedError,configs:868,maxTsError:Math.max(...Object.values(r.reference.maxTsErrors)),maxTwoInputQuadratureError:Math.max(...r.twoInputSampleErrors),independentDynamicCases:28,oldIds:old.ids.length,h2:12,exercises:6,mobileWidth:375,mobileScrollWidth:mobile.scrollWidth,pagesDefaultNotebookUiPassed:true};
fs.writeFileSync(dir+'validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
