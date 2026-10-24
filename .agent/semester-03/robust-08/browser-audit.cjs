const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const page=await browser.newPage(),errors=[];page.setDefaultTimeout(240000);page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:20595/python-expansion.html?lesson=robust/mu-synthesis');
 await page.locator('#run').click();
 await page.waitForFunction(()=>!document.querySelector('#save').disabled,null,{timeout:240000});
 const report=JSON.parse(await page.locator('#results').textContent());
 fs.writeFileSync('.agent/semester-03/robust-08/pyodide.json',JSON.stringify(report,null,2));
 assert.equal(report.complete,true);assert.equal(report.totals.enabled,3);assert.equal(report.totals.codeOnly,0);assert.equal(report.releaseTotals.enabled,3);assert.equal(errors.length,0);
 await browser.close();console.log('PASS Pyodide 3 notebooks / 6 original cells, no warnings blocking release');
})().catch(e=>{console.error(e);process.exitCode=1;});
