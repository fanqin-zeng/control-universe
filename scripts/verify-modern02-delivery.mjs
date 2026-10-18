import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const dir='.agent/semester-03/modern-02/';
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const browser=json(dir+'browser.json'),old=json(dir+'baseline-source.json');
assert.equal(browser.desktop.h2.length,9);assert.equal(browser.desktop.errors,0);
assert.equal(new Set(browser.desktop.ids).size,browser.desktop.ids.length);
assert(old.ids.every(id=>browser.desktop.ids.includes(id)));
assert(browser.links.length>=9&&browser.links.every(link=>link.targetExists));
assert(browser.desktop.images.every(i=>i.loaded&&i.src.startsWith('/control-universe/')));
assert.equal(browser.desktop.width,browser.desktop.scrollWidth);
assert.equal(browser.narrow.page.width,browser.narrow.page.scrollWidth);
assert(browser.narrow.scrollWidth<=browser.narrow.width+1); // fractional inline math rounding
assert(browser.narrow.images.every(i=>i.loaded&&i.width<=browser.narrow.width));
assert(browser.courseRun.includes('运行完成')&&browser.narrow.courseRun.includes('运行完成'));
assert(browser.plot.length===1&&browser.plot[0].loaded&&browser.plot[0].height>browser.plot[0].width);
assert.equal(browser.console.length,0);
const imageSize=JSON.parse(execFileSync('python',['-c',`import json; from PIL import Image; print(json.dumps(Image.open('${dir}narrow.png').size))`],{encoding:'utf8'}));
assert.equal(imageSize[0],375); // actual screenshot dimensions, not the requested override
const native=json(dir+'notebooks.json');assert.equal(native.executionStatus,'EXECUTED');
assert.equal(native.totals.FAIL,0);assert.equal(native.totals.SKIPPED,0);assert.equal(native.lessons[0].cells.length,6);
const python=json(dir+'pyodide.json'),numeric=json(dir+'reconciliation.json');
assert(python.complete&&numeric.pass);assert.equal(python.releaseTotals.enabled,6);
assert(python.lessons[0].notebooks.every(n=>n.status==='passed'&&n.cells.every(c=>c.status==='passed')));
const sourceHash=createHash('sha256').update(readFileSync('content/modern/controllability-observability.mdx','utf8').replace(/\r\n/g,'\n')).digest('hex');
assert.equal(python.lessons[0].sourceHash,sourceHash);assert.equal(numeric.sourceHash,sourceHash);
assert.equal(json('lib/python-support.json').lessons['modern/controllability-observability'].sourceHash,sourceHash);
assert(numeric.maxResponseError<1e-10);
for(const file of ['build.log','pages-build.log']){
 const log=readFileSync(dir+file,'utf8');assert(log.includes('prerendered'));assert(!log.includes('Failed to compile'));
}
assert(readFileSync(dir+'pages-build.log','utf8').includes('"pass":true,"lessons":205,"legacyRoutes":9'));
const result={pass:true,notebooks:6,oldIds:old.ids.length,h2:9,links:browser.links.length,mobileScreenshotWidth:imageSize[0],maxResponseError:numeric.maxResponseError,sourceHash};
writeFileSync(dir+'delivery-validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
