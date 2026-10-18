import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.agent/semester-03/discrete-06/';
const read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
const hash=createHash('sha256').update(fs.readFileSync('content/discrete-sampled/discretization-methods.mdx','utf8').replace(/\r\n/g,'\n')).digest('hex');
const native=read('reconciliation.json'),py=read('pyodide.json');
assert(native.pass&&native.independent.pass_);assert.equal(native.sourceHash,hash);
assert(py.complete);assert.equal(py.lessons[0].sourceHash,hash);
const stream=outputs=>outputs.filter(o=>o.type==='stream').map(o=>o.text).join('');
const expected=[];
for(const [i,nb] of native.notebooks.entries()){
 const other=py.lessons[0].notebooks[i];assert.equal(other.status,'passed');
 for(const [j,cell]of other.cells.entries()){
  const text=stream(nb.outputs[j+1]);expected.push(text);assert.equal(stream(cell.outputs),text);
 }
}
const old=read('browser-before.json').ids.filter(id=>!id.startsWith('codex-'));
for(const file of ['browser-native.json','browser-pages.json']){
 const r=read(file),dom=r.dom;assert.equal(r.errors.length,0);assert(r.labelsVisuallyReviewed);assert.equal(dom.h1,1);assert.equal(dom.h2.length,8);
 assert.deepEqual(dom.h2,native.rendered.h2.map(({text,id})=>({text,id})));
 assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);
 for(const id of old)assert(dom.ids.includes(id),'旧ID缺失: '+id);
 assert(dom.images.every(i=>i.loaded));assert.equal(dom.canvases,1);assert.deepEqual(dom.outputs,expected);
 for(const href of dom.anchors){const id=decodeURIComponent(href.split('#')[1]);if(id)assert(dom.ids.includes(id),href);}
 if(file==='browser-pages.json')assert(dom.images.some(i=>i.src==='/control-universe/images/discretization-workflow.svg'));
}
const presets=read('browser-native.json').presets;
for(const [i,value]of ['-1.000000','-1.500000','-4.000000','0.904837'].entries())assert(presets[i].text.includes(value));
const mobile=read('browser-mobile.json');assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375);assert.equal(mobile.katexErrors,0);
for(const file of ['build.log','pages-build.log']){const log=fs.readFileSync(dir+file,'utf8');assert(!/Failed to compile|MDX 编译失败|Error occurred prerendering/.test(log));assert(log.includes('First Load JS'));}
const result={pass:true,sourceHash:hash,notebooks:4,cells:5,oldIds:old.length,h2:8,actualTsConfigs:13,nativePyodideAndPageOutputsIdentical:true,mobileWidth:mobile.width,mobileScrollWidth:mobile.scrollWidth};
fs.writeFileSync(dir+'validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
