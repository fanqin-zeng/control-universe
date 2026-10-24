const { chromium } = require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
let browser;
(async()=>{
 browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:18393/python-expansion.html?lesson=identification/model-structures');
 await page.locator('#run').click();
 await page.waitForFunction(()=>!document.querySelector('#save').disabled,null,{timeout:240000});
 const report=JSON.parse(await page.locator('#results').textContent());
 fs.writeFileSync('.agent/semester-03/id-02/pyodide.json',JSON.stringify(report,null,2));
 assert.equal(report.complete,true);assert.equal(report.totals.enabled,2);assert.equal(report.totals.codeOnly,0);
 assert.equal(errors.length,0);
 await browser.close();console.log('PASS Pyodide 2 notebooks / 4 cells');
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
