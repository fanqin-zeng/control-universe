const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');let browser;
(async()=>{
 const fixture=JSON.parse(fs.readFileSync('D:/Workspace/control-universe-rank3-id03/public/python-expansion.json','utf8'));
 const lesson=fixture.lessons.find(l=>l.key==='nonlinear/adaptive-control-basics');assert(lesson);const records=[];let last;
 browser=await chromium.launch({channel:'msedge',headless:true});
 for(const nb of lesson.notebooks){
  const path=`.agent/semester-03/id-03/adaptive-nb-${nb.index}.json`;
  if(fs.existsSync(path)){const cached=JSON.parse(fs.readFileSync(path));if(cached.workerHash===fixture.workerHash&&cached.lessons[0].sourceHash===lesson.sourceHash&&cached.lessons[0].notebooks[0].status==='passed'&&cached.releaseTotals.enabled===1){records.push(cached.lessons[0].notebooks[0]);last=cached;console.log('REUSE verified notebook '+nb.index);continue;}}
  const page=await browser.newPage();let status='';const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.route('**/python-expansion.json',route=>route.fulfill({json:{workerHash:fixture.workerHash,lessons:[{...lesson,notebooks:[nb]}]}}));
  await page.goto('http://127.0.0.1:18393/python-expansion.html?lesson='+lesson.key);await page.locator('#run').click();
  const started=Date.now();while(await page.locator('#save').isDisabled()){
   await page.waitForTimeout(1000);const next=await page.locator('#status').textContent();if(next!==status){console.log(next);status=next;}
   if(Date.now()-started>660000)throw Error('Notebook '+nb.index+' exceeded 660 seconds');
  }
  last=JSON.parse(await page.locator('#results').textContent());fs.writeFileSync(path,JSON.stringify(last,null,2));assert(last.complete);assert.equal(errors.length,0);
  const actual=last.lessons[0].notebooks[0];assert.equal(actual.status,'passed',JSON.stringify(actual.reason));assert.equal(last.releaseTotals.enabled,1);assert.equal(actual.cells.length,nb.cells.length);assert(actual.cells.every(c=>c.status==='passed'&&!c.outputs.some(o=>o.type==='error')));records.push(actual);console.log('PASS notebook '+nb.index+' / '+nb.cells.length+' cells');await page.close();
 }
 const report={...last,scope:'nonlinear/adaptive-control-basics, each notebook in a clean Worker',lessons:[{key:lesson.key,title:lesson.title,sourceHash:lesson.sourceHash,notebooks:records}],complete:true,totals:{lessons:1,notebooks:records.length,enabled:records.length,codeOnly:0},releaseTotals:{enabled:records.length,codeOnly:0}};
 fs.writeFileSync('.agent/semester-03/id-03/adaptive-pyodide.json',JSON.stringify(report,null,2));await browser.close();console.log('PASS full adaptive lesson '+records.length+' notebooks');
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1});
