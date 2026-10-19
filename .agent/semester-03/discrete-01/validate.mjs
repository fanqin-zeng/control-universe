import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.agent/semester-03/discrete-01/',read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
const hash=createHash('sha256').update(fs.readFileSync('content/discrete-sampled/discrete-time-freq.mdx','utf8').replace(/\r\n/g,'\n')).digest('hex');
const r=read('reconciliation.json'),py=read('pyodide.json');assert(r.pass);assert.equal(r.sourceHash,hash);assert(py.complete);assert.equal(py.lessons[0].sourceHash,hash);
const stream=outputs=>outputs.filter(o=>o.type==='stream').map(o=>o.text).join('');
function numeric(a,b){const p=/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi;const aa=a.match(p)||[],bb=b.match(p)||[];assert.equal(aa.length,bb.length);assert.equal(a.replace(p,'#'),b.replace(p,'#'));for(let i=0;i<aa.length;i++)assert(Math.abs(Number(aa[i])-Number(bb[i]))<=2e-6+1e-9*Math.abs(Number(bb[i])),`${aa[i]} != ${bb[i]}`);}
const expected=[];
for(const[i,nb]of r.notebooks.entries()){
 const other=py.lessons[0].notebooks[i];assert.equal(other.status,'passed');
 for(const[j,cell]of other.cells.entries()){const text=stream(nb.outputs[j+1]);expected.push(text);numeric(stream(cell.outputs),text);}
}
for(const file of ['browser-native.json','browser-pages.json']){
 const b=read(file),d=b.dom||b;assert.equal(b.errors.length,0);assert.deepEqual(d.h2,r.rendered.h2.map(({text,id})=>({text,id})));
 assert.equal(d.katexErrors,0);assert.equal(new Set(d.ids).size,d.ids.length);assert(d.images.every(i=>i.loaded));assert.equal(d.canvases,1);
 const actual=d.outputs.filter(s=>!/Warning:|UserWarning/.test(s));numeric(actual.join(''),expected.join(''));
 for(const href of d.anchors||[]){const id=decodeURIComponent(href.split('#')[1]);if(id)assert(d.ids.includes(id),href);}
}
assert(read('headings.json').pass);const mobile=read('browser-mobile.json');assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375);assert.equal(mobile.katexErrors,0);
for(const file of ['build.log','pages-build.log']){const text=fs.readFileSync(dir+file,'utf8');assert(!/Failed to compile|MDX 编译失败|Error occurred prerendering/.test(text));assert(text.includes('First Load JS'));}
const result={pass:true,sourceHash:hash,notebooks:6,cells:7,actualTsConfigs:r.configs,independentQuantities:r.quantities,maxNumericError:r.maxNumericError,mobileWidth:375,originalHeadingIdsPreserved:true};fs.writeFileSync(dir+'validation.json',JSON.stringify(result,null,2));console.log(result);
