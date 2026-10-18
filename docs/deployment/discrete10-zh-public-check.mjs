import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const sha='2dd926fe7d2a4daa810a76690d69582933b54a0b',prefix='docs/deployment/discrete10-zh-public-',read=name=>JSON.parse(fs.readFileSync(prefix+name+'.json','utf8'));
const actions=read('actions');assert.equal(actions.head_sha,sha);assert.equal(actions.conclusion,'success');assert(actions.jobs.every(j=>j.conclusion==='success'));
const http=read('http');assert(http.pass);const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));
let notebooks=0,cells=0,quantities=0;
function numeric(a,b){const regex=/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi;const aa=a.match(regex)||[],bb=b.match(regex)||[];assert.equal(a.replace(regex,'#'),b.replace(regex,'#'));assert.equal(aa.length,bb.length);aa.forEach((x,i)=>{assert(Math.abs(+x- +bb[i])<=1e-8*Math.max(1,Math.abs(+bb[i])),`${x} != ${bb[i]}`);quantities++;});}
const stream=o=>o.filter(x=>x.type==='stream').map(x=>x.text).join('').replace(/\r\n/g,'\n');
for(let n=2;n<=10;n++){
 const id=String(n).padStart(2,'0'),actual=read('python-'+id),expected=JSON.parse(fs.readFileSync('.agent/semester-03/discrete-'+id+'/pyodide.json','utf8'));
 assert(actual.complete);assert.equal(actual.workerHash,policy.workerHash);assert.equal(actual.lessons.length,1);const a=actual.lessons[0],e=expected.lessons[0];assert.equal(a.key,e.key);assert.equal(a.sourceHash,policy.lessons[a.key].sourceHash);assert.equal(a.sourceHash,e.sourceHash);assert.equal(a.notebooks.length,e.notebooks.length);
 a.notebooks.forEach((b,i)=>{assert.equal(b.status,'passed');assert.equal(b.cells.length,e.notebooks[i].cells.length);b.cells.forEach((c,j)=>{assert.equal(c.status,'passed');assert(!c.outputs.some(o=>o.type==='error'));numeric(stream(c.outputs),stream(e.notebooks[i].cells[j].outputs));cells++;});notebooks++;});
}
assert.equal(notebooks,29);assert.equal(cells,39);
const browser=read('browser');assert(browser.math.correctedIntro&&browser.math.katex===0&&browser.math.outputs.length>0);assert(browser.alias.oldAlias&&browser.alias.newHeading);assert.equal(browser.event.h2,8);assert.equal(browser.event.katex,0);assert.equal(browser.event.canvases,1);assert(browser.event.outputs.length>=4);assert.equal(browser.errors.length,0);
const mobile=read('mobile');assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375);assert.equal(mobile.katex,0);
execFileSync('git',['diff','--exit-code','58d828d',sha,'--','content','components','lib','public','scripts','.github'],{stdio:'pipe'});
const result={pass:true,release:sha,sourceMaster:'58d828d77b38f34a684035dcd774e17950f713e0',lessons:9,notebooks,cells,comparedNumbers:quantities,tolerance:1e-8,mobileWidth:mobile.width,mobileScrollWidth:mobile.scrollWidth,sourceTreeEquivalent:true};fs.writeFileSync(prefix+'validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
