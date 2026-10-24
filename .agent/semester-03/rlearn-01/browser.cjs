const fs=require('fs');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir='.agent/semester-03/rlearn-01/';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 if(process.argv.includes('--audit')){
  await page.goto('http://127.0.0.1:8202/python-expansion.html?lesson=robot-learning%2Frobot-data');
  await page.locator('#run').click();
  await page.waitForFunction(()=>!document.querySelector('#save').disabled,{},{timeout:180000});
  const proof=JSON.parse(await page.locator('#results').textContent());
  fs.writeFileSync(dir+'pyodide.json',JSON.stringify(proof,null,2)+'\n');
  assert(proof.complete,JSON.stringify(proof));assert.equal(proof.totals.enabled,3);
 }else{
  const response=await page.goto('http://127.0.0.1:8202/robot-learning/robot-data',{waitUntil:'domcontentloaded',timeout:120000});assert.equal(response.status(),200);
  await page.waitForSelector('article h2');
  await page.waitForFunction(()=>document.querySelectorAll('a[href*="#"]').length>=10,{},{timeout:60000});
  const dom=await page.evaluate(()=>({h1:document.querySelectorAll('article h1').length,h2:[...document.querySelectorAll('article h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('article [id]')].map(e=>e.id),links:[...document.querySelectorAll('a[href*="#"]')].map(e=>e.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,notebooks:document.querySelectorAll('[data-notebook-id]').length,svg:document.querySelectorAll('article svg[role="img"]').length,buttons:[...document.querySelectorAll('button')].map(b=>b.textContent)}));
  fs.writeFileSync(dir+'dom.json',JSON.stringify(dom,null,2)+'\n');
  assert.equal(dom.h1,1);assert.equal(dom.h2.length,10);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);assert.equal(dom.svg,1);
  for(const h of dom.h2)assert(dom.links.some(l=>decodeURIComponent(l.split('#')[1]||'')===h.id),h.id);
  const run=page.getByRole('button',{name:/全部运行/});await run.first().waitFor();assert.equal(await run.count(),3);
  for(let i=0;i<3;i++){
   await run.nth(i).click();
   await page.waitForFunction(i=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行'))[i]?.disabled===false,i,{timeout:120000});
  }
  const text=await page.locator('article').innerText();
  assert(text.includes('selected_capture_ms: [0, 80, 120, None]'));assert(text.includes('global_windows/cross_episode/valid: 22 6 16'));assert(text.includes('leaked_mean: 5.666667'));
  await page.screenshot({path:dir+'desktop-top.png'});
  await page.screenshot({path:dir+'desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  const narrow=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,article:document.querySelector('article').getBoundingClientRect().width,svg:document.querySelector('article svg').getBoundingClientRect().width}));
  assert.equal(narrow.width,narrow.scroll);assert(narrow.svg<=narrow.article);
  await page.screenshot({path:dir+'mobile-top.png'});
  await page.screenshot({path:dir+'mobile.png',fullPage:true});
  fs.writeFileSync(dir+'browser.json',JSON.stringify({dom,narrow,output:text,errors},null,2)+'\n');
 }
 fs.writeFileSync(dir+(process.argv.includes('--audit')?'audit-console.json':'page-console.json'),JSON.stringify(errors,null,2)+'\n');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS browser '+process.argv.slice(2).join(' '));
})().catch(e=>{console.error(e);process.exit(1)});
