import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const dir='.agent/semester-03/intel-02/';
const native=JSON.parse(readFileSync(dir+'native-outputs.json','utf8'));
const browser=JSON.parse(readFileSync(dir+'pyodide-download.json','utf8'));
const text=outputs=>outputs.filter(o=>o.type==='stream'&&o.name==='stdout').map(o=>o.text).join('');
const numbers=t=>[...t.matchAll(/[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi)].map(m=>Number(m[0]));
let count=0,maxError=0;
for(const [i,nb]of browser.lessons[0].notebooks.entries()){
 assert.equal(nb.status,'passed');
 for(const [j,cell]of nb.cells.entries()){
  const a=numbers(text(native[i].outputs[j+1].outputs)),b=numbers(text(cell.outputs));
  assert.equal(a.length,b.length,`NB${i+1} cell${j+1}`);
  for(let k=0;k<a.length;k++){const error=Math.abs(a[k]-b[k]);maxError=Math.max(maxError,error);assert(error<1e-7+Math.abs(a[k])*1e-10,`NB${i+1} cell${j+1} item${k}: ${a[k]} vs ${b[k]}`);count++;}
 }
}
const reference=JSON.parse(readFileSync(dir+'reference.json','utf8'));
assert.equal(reference.static.length,396);
assert(Math.max(...reference.static.map(r=>r.error))<2e-8);
const headings=JSON.parse(readFileSync(dir+'headings.json','utf8'));assert.equal(headings.missing.length,0);assert.equal(headings.current.h2.length,14);
for(const name of ['browser-mobile.json','browser-pages.json']){
 const dom=JSON.parse(readFileSync(dir+name,'utf8'));assert.equal(dom.viewport,375);assert(dom.documentWidth<=375);assert(dom.bodyWidth<=375);
 assert.equal(dom.duplicates.length,0);assert.equal(dom.canvases,2);assert.equal(dom.katexErrors,0);
 assert.deepEqual(dom.h2,headings.current.h2.map(({id,text})=>({id,text})));
 assert(headings.old.ids.every(id=>dom.ids.includes(id)),'Missing real DOM alias in '+name);
 assert(dom.images.every(i=>i.complete&&i.width>0));assert(dom.sidebarTargets.every(t=>t.exists));
}
const normalize=s=>s.replace('load=1 ','').replace('sample period=','sample=').replace(/=(\d+(?:\.\d+)?)/g,m=>'='+Number(m.slice(1))).trim();
const lines=native.flatMap(n=>n.outputs.flatMap(o=>text(o.outputs).split('\n'))).filter(l=>l.includes(' rms='));
const component=JSON.parse(readFileSync(dir+'component-measurements.json','utf8'));
let componentMetricChecks=0,largestComponentError=0;
for(const c of component){
 const label=c.label.replace('mode=','');
 const line=lines.find(l=>normalize(l.split(' rms=')[0])===normalize(label));assert(line,'No native line '+label);
 for(const k of ['rms','final','tail','tv','maxU','saturation','gaps']){
  const match=line.match(new RegExp('(?:^| )'+k+'=\\s*([-+0-9.e]+)'));assert(match,k+' missing in '+line);
  const error=Math.abs(c.metrics[k]-Number(match[1]));largestComponentError=Math.max(largestComponentError,error);
  assert(error<(label==='legacy'?2e-4:1e-6),`${label} ${k} mismatch ${error}`);componentMetricChecks++;
 }
}
const result={pass:true,nativeVsBrowserNumbers:count,maxNativeBrowserError:maxError,componentConfigurations:component.length,componentMetricChecks,largestComponentError,legacyTolerance:2e-4,continuousTolerance:1e-6,staticCases:396,maxQuadratureError:Math.max(...reference.static.map(r=>r.error)),heldDOP853Cases:reference.dynamics.length,maxDynamicMetricError:Math.max(...reference.dynamics.flatMap(r=>Object.values(r.errors))),oldIds:headings.old.ids.length,missingIds:0};
writeFileSync(dir+'validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
