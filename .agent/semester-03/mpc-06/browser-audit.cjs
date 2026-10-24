const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');let browser;
(async()=>{browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://127.0.0.1:19996/python-expansion.html?lesson=mpc/generalized-predictive-control');await page.locator('#run').click();
await page.waitForFunction(()=>!document.querySelector('#save').disabled,null,{timeout:300000});
const report=JSON.parse(await page.locator('#results').textContent());fs.writeFileSync('.agent/semester-03/mpc-06/pyodide.json',JSON.stringify(report,null,2));
assert(report.complete);assert.equal(report.totals.enabled,3);assert.equal(report.totals.codeOnly,0);assert.deepEqual(errors,[]);console.log('PASS production Pyodide 3 notebooks / 6 cells');await browser.close();})().catch(async e=>{console.error(e);if(browser)await browser.close();process.exitCode=1;});
