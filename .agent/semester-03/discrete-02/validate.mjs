import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.agent/semester-03/discrete-02/';
const read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
const source=fs.readFileSync('content/discrete-sampled/discrete-time-systems.mdx','utf8').replace(/\r\n/g,'\n');
const hash=createHash('sha256').update(source).digest('hex');
const native=read('reconciliation.json'), browser=read('pyodide.json');
assert(native.pass&&native.independent.passed);
assert.equal(native.sourceHash,hash);
assert(browser.complete);
assert.equal(browser.lessons[0].sourceHash,hash);
const text=outputs=>outputs.filter(o=>o.type==='stream').map(o=>o.text).join('');
for(const [i,nb] of native.notebooks.entries()){
 const result=browser.lessons[0].notebooks[i];
 assert.equal(result.status,'passed'); assert.equal(result.cells.length,1);
 assert.equal(text(nb.outputs[1]),text(result.cells[0].outputs));
}
for(const file of ['browser-native.json','browser-pages.json']){
 const r=read(file), dom=r.dom;
 assert.equal(r.errors.length,0); assert.equal(dom.h1,1); assert.equal(dom.h2.length,8);
 assert.equal(dom.katexErrors,0); assert.equal(new Set(dom.ids).size,dom.ids.length);
 assert(dom.images.every(i=>i.loaded)); assert.equal(dom.outputs.length,3);
 for(const href of dom.anchors){const id=decodeURIComponent(href.split('#')[1]);if(id)assert(dom.ids.includes(id),href);}
 for(const [i,nb]of native.notebooks.entries())assert.equal(dom.outputs[i],text(nb.outputs[1]));
 if(file==='browser-native.json'){assert.equal(dom.width,375);assert(dom.scrollWidth<=375);}
}
for(const file of ['build.log','pages-build.log']){
 const log=fs.readFileSync(dir+file,'utf8');
 assert(!/Failed to compile|MDX 编译失败|Error occurred prerendering/.test(log));
 assert(log.includes('First Load JS'));
}
const result={pass:true,sourceHash:hash,nativeAndPyodideIdentical:true,coursePageRuns:3,staticPageRuns:3,h2:8,uniqueIds:true,mobileWidth:375,overflow:false};
fs.writeFileSync(dir+'validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
