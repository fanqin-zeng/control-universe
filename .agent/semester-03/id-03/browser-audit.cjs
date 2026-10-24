const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
let browser;
(async()=>{
 browser=await chromium.launch({channel:'msedge',headless:true});
 for(const [key,file] of [['identification/least-squares-rls','pyodide.json'],['nonlinear/adaptive-control-basics','adaptive-pyodide.json']].filter(([key])=>!process.argv[2]||key===process.argv[2])){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:18393/python-expansion.html?lesson='+key);await page.locator('#run').click();
  await page.waitForFunction(()=>!document.querySelector('#save').disabled,null,{timeout:600000});
  const report=JSON.parse(await page.locator('#results').textContent());fs.writeFileSync('.agent/semester-03/id-03/'+file,JSON.stringify(report,null,2));
  assert(report.complete);assert(report.lessons[0].notebooks.every(nb=>nb.status==='passed'&&nb.cells.every(c=>c.status==='passed'&&!c.outputs.some(o=>o.type==='error'))));assert.equal(errors.length,0);
  console.log(JSON.stringify({key,pass:true,notebooks:report.totals.notebooks,cells:report.lessons[0].notebooks.reduce((n,b)=>n+b.cells.length,0)}));await page.close();
 }
 await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1});
