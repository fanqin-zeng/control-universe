import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.agent/semester-03/impl-01/';
const read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
const hash=createHash('sha256').update(fs.readFileSync('content/implementation/computer-control-architecture.mdx','utf8').replace(/\r\n/g,'\n')).digest('hex');
const r=read('reconciliation.json'),py=read('pyodide.json');
assert(r.pass&&r.reference.pass);assert.equal(r.sourceHash,hash);assert(py.complete);assert.equal(py.lessons[0].sourceHash,hash);
assert.equal(r.reference.configs,1701);assert(r.reference.maxTsError<1e-10);
const stream=outputs=>outputs.filter(o=>o.type==='stream').map(o=>o.text).join('');
const expected=[];
function numeric(a,b){const re=/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi;const aa=a.match(re)||[],bb=b.match(re)||[];assert.equal(aa.length,bb.length);assert.equal(a.replace(re,'#'),b.replace(re,'#'));for(let i=0;i<aa.length;i++)assert(Math.abs(+aa[i]-bb[i])<=1e-9*Math.max(1,Math.abs(bb[i])),`${aa[i]} != ${bb[i]}`);}
for(const[i,nb]of r.notebooks.entries()){
 const other=py.lessons[0].notebooks[i];assert.equal(other.status,'passed');assert.equal(other.cells.length,2);
 for(const[j,cell]of other.cells.entries()){const text=stream(nb.outputs[j+1]);expected.push(text);numeric(stream(cell.outputs),text);}
}
const before=read('headings-before.json');
for(const file of ['browser-native.json','browser-pages.json']){
 const b=read(file),d=b.dom;assert.equal(b.errors.length,0,JSON.stringify(b.errors));assert.equal(d.h1,1);assert.deepEqual(d.h2,r.rendered.h2.map(({text,id})=>({text,id})));
 assert.equal(d.katexErrors,0);assert.equal(d.canvases,1);assert.equal(new Set(d.ids).size,d.ids.length);assert(d.images.length===2&&d.images.every(i=>i.loaded));
 for(const id of before.ids)assert(d.ids.includes(id),id);
 for(const href of d.anchors){const id=decodeURIComponent(href.split('#')[1]);if(id)assert(d.ids.includes(id),href);}
 numeric(d.outputs.join(''),expected.join(''));
 if(file==='browser-pages.json')assert(d.images.every(i=>i.src.startsWith('/control-universe/diagrams/implementation/')));
}
const native=read('browser-native.json');assert(native.productionBuild);
assert(native.presets[0].text.includes('2.40'));assert(native.presets[1].text.includes('5.00'));assert(native.presets[2].text.includes('5.20'));assert(native.presets[3].text.includes('3.00'));
assert(native.boundaryControls[0].includes('1.70'));assert(native.boundaryControls[1].includes('11.70'));
const mobile=read('browser-mobile.json');assert.equal(mobile.method,'375px same-origin iframe viewport');assert(mobile.width<=375&&mobile.width>=360);assert(mobile.scrollWidth<=375);assert.equal(mobile.katexErrors,0);
for(const file of ['build.log','pages-build.log']){const log=fs.readFileSync(dir+file,'utf8');assert(log.includes('First Load JS'));assert(!/Failed to compile|MDX 编译失败|Error occurred prerendering/.test(log));}
const result={pass:true,sourceHash:hash,notebooks:2,cells:4,h2:9,oldIds:before.ids.length,configs:1701,maxTsError:r.reference.maxTsError,maxNotebookError:r.maxNotebookError,nativeAndBrowserOutputsAgree:true,mobileContentWidth:mobile.width,mobileScrollWidth:mobile.scrollWidth};
fs.writeFileSync(dir+'validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
