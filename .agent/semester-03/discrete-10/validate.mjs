import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.agent/semester-03/discrete-10/',read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
const hash=createHash('sha256').update(fs.readFileSync('content/discrete-sampled/event-triggered-control.mdx','utf8').replace(/\r\n/g,'\n')).digest('hex');
const native=read('reconciliation.json'),py=read('pyodide.json');assert(native.pass&&native.independent.pass_);assert.equal(native.sourceHash,hash);assert(py.complete);assert.equal(py.lessons[0].sourceHash,hash);
const stream=outputs=>outputs.filter(o=>o.type==='stream').map(o=>o.text).join('');
const expected=[];function numeric(a,b){const p=/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi;const aa=a.match(p)||[],bb=b.match(p)||[];assert.equal(aa.length,bb.length);assert.equal(a.replace(p,'#'),b.replace(p,'#'));for(let i=0;i<aa.length;i++)assert(Math.abs(Number(aa[i])-Number(bb[i]))<=1e-9*Math.max(1,Math.abs(Number(bb[i]))),`${aa[i]} != ${bb[i]}`);}
for(const[i,nb]of native.notebooks.entries()){
 const other=py.lessons[0].notebooks[i];assert.equal(other.status,'passed');assert.equal(other.cells.length,nb.outputs.length-1);
 for(const[j,cell]of other.cells.entries()){const text=stream(nb.outputs[j+1]);expected.push(text);numeric(stream(cell.outputs),text);}
}
for(const file of ['browser-native.json','browser-pages.json']){
 const r=read(file),d=r.dom;assert.equal(r.errors.length,0);assert(r.curvesVisuallyReviewed);assert.equal(d.h1,1);assert.deepEqual(d.h2,native.rendered.h2.map(({text,id})=>({text,id})));
 assert.equal(d.katexErrors,0);assert.equal(new Set(d.ids).size,d.ids.length);assert(d.images.every(i=>i.loaded));assert.equal(d.canvases,1);numeric(d.outputs.join(''),expected.join(''));
 for(const href of d.anchors){const id=decodeURIComponent(href.split('#')[1]);if(id)assert(d.ids.includes(id),href);}
 if(file==='browser-pages.json')assert(d.images.some(i=>i.src==='/control-universe/images/event-triggered-loop.svg'));
}
for(const[i,text]of ['60 次；每拍更新 60','-1.584454','-1.992564','120 次'].entries())assert(read('browser-native.json').presets[i].text.includes(text));
const axes=read('axis-range.json');assert(axes.pass);assert.equal(axes.configs,195);assert(axes.axisMin>=-2.2&&axes.axisMax<=2.2);
const mobile=read('browser-mobile.json');assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375);assert.equal(mobile.katexErrors,0);
for(const file of ['build.log','pages-build.log']){const log=fs.readFileSync(dir+file,'utf8');assert(!/Failed to compile|MDX 编译失败|Error occurred prerendering/.test(log));assert(log.includes('First Load JS'));}
const r={pass:true,sourceHash:hash,notebooks:2,cells:4,actualTsConfigs:native.configs,independentQuantities:native.quantities,maxNumericError:native.maxNumericError,h2:8,outputsAgreeWithinTolerance:true,numericTolerance:1e-9,mobileWidth:mobile.width,mobileScrollWidth:mobile.scrollWidth};
fs.writeFileSync(dir+'validation.json',JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(r));
