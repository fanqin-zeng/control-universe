const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://127.0.0.1:18396/python-expansion.html?lesson=mpc/mpc-principle');await page.locator('#run').click();
await page.waitForFunction(()=>!document.querySelector('#save').disabled,{timeout:240000});
const report=JSON.parse(await page.locator('#results').textContent());fs.writeFileSync('.agent/semester-03/mpc-01/pyodide.json',JSON.stringify(report,null,2));
assert(report.complete);assert.equal(report.totals.enabled,2);assert.equal(report.totals.codeOnly,0);assert.deepEqual(errors,[]);
console.log('PASS Pyodide 2 notebooks / 3 cells');await browser.close();})().catch(e=>{console.error(e);process.exitCode=1;});
