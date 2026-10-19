import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const sha='636d0de2ab8bcd95ea17e39c3cde518ad502ecf5',prefix='docs/deployment/discrete01-public-',read=name=>JSON.parse(fs.readFileSync(prefix+name+'.json','utf8'));
const actions=read('actions');assert.equal(actions.head_sha,sha);assert.equal(actions.conclusion,'success');assert(actions.jobs.every(j=>j.conclusion==='success'));assert(read('http').pass);
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8')),actual=read('python'),expected=JSON.parse(fs.readFileSync('.agent/semester-03/discrete-01/pyodide.json','utf8'));
assert(actual.complete);assert.equal(actual.workerHash,policy.workerHash);assert.equal(actual.lessons.length,1);const a=actual.lessons[0],e=expected.lessons[0];assert.equal(a.key,e.key);assert.equal(a.sourceHash,policy.lessons[a.key].sourceHash);assert.equal(a.sourceHash,e.sourceHash);assert.equal(a.notebooks.length,6);
let cells=0,numbers=0;const stream=o=>o.filter(x=>x.type==='stream').map(x=>x.text).join('');
function compare(x,y){const rx=/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi,A=x.match(rx)||[],B=y.match(rx)||[];assert.equal(A.length,B.length);assert.equal(x.replace(rx,'#'),y.replace(rx,'#'));A.forEach((v,i)=>{assert(Math.abs(+v- +B[i])<=2e-6+1e-9*Math.abs(+B[i]));numbers++;});}
a.notebooks.forEach((b,i)=>{assert.equal(b.status,'passed');b.cells.forEach((c,j)=>{assert.equal(c.status,'passed');assert(!c.outputs.some(o=>o.type==='error'));compare(stream(c.outputs),stream(e.notebooks[i].cells[j].outputs));cells++;});});assert.equal(cells,7);
const browser=read('browser');assert.equal(browser.katexErrors,0);assert.equal(browser.h2.length,9);assert.equal(browser.canvases,1);assert.equal(browser.errors.length,0);assert(browser.images.every(i=>i.loaded));assert.equal(new Set(browser.ids).size,browser.ids.length);
compare(browser.outputs.join(''),a.notebooks.flatMap(b=>b.cells.map(c=>stream(c.outputs))).join(''));
const mobile=read('mobile');assert.equal(mobile.width,375);assert(mobile.scrollWidth<=375);assert.equal(mobile.katexErrors,0);
execFileSync('git',['diff','--exit-code','500cb53',sha,'--','content','components','lib','public','scripts','.github'],{stdio:'pipe'});
const result={pass:true,release:sha,sourceMaster:'500cb53',notebooks:6,cells,comparedNumbers:numbers,sourceTreeEquivalent:true,mobileWidth:mobile.width,mobileScrollWidth:mobile.scrollWidth};fs.writeFileSync(prefix+'validation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
