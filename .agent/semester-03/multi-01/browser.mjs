import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir='.agent/semester-03/multi-01/',mode=process.argv[2]||'normal';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
// The committed native UI uses 8891. Rank9 rewrites only this browser's requests
// to its own gateway; no shared source or other session's gateway is changed.
if(mode==='normal')await page.route('http://127.0.0.1:8891/**',r=>r.continue({url:r.request().url().replace(':8891/',':8999/')}));
if(mode==='pyodide'){
 await page.goto('http://127.0.0.1:8499/python-expansion.html?lesson=multi-agent/multi-agent-overview');
 await page.locator('#run').click();
 await page.waitForFunction(()=>document.querySelector('#results').textContent.includes('"complete"'),{},{timeout:240000});
 const proof=JSON.parse(await page.locator('#results').textContent());
 fs.writeFileSync(dir+'pyodide.json',JSON.stringify(proof,null,2));
 assert(proof.complete);assert.equal(proof.totals.enabled,2);
 assert(proof.lessons[0].notebooks.every(n=>n.status==='passed'&&n.cells.every(c=>c.status==='passed')));
 fs.writeFileSync(dir+'browser-pyodide-errors.json',JSON.stringify(errors));
 console.log(JSON.stringify(proof.totals));
}else{
 const base=mode==='pages'?'http://127.0.0.1:8499/control-universe':'http://127.0.0.1:8199';
 const response=await page.goto(base+'/multi-agent/multi-agent-overview/');assert.equal(response.status(),200);
 await page.locator('[data-multi-readout]').waitFor();
 async function metrics(){return await page.evaluate(()=>{
  const a=document.querySelector('article'),els=[...document.querySelectorAll('[id]')],ids=els.map(x=>x.id);
  return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:a.querySelectorAll('h1').length,h2:[...a.querySelectorAll('h2')].map(x=>({id:x.id,text:x.textContent})),katexErrors:document.querySelectorAll('.katex-error').length,duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),brokenFragments:[...document.querySelectorAll('a[href*="#"]')].flatMap(x=>{const u=new URL(x.href);return u.pathname===location.pathname&&u.hash&&!document.getElementById(decodeURIComponent(u.hash.slice(1)))?[x.href]:[]}),images:[...a.querySelectorAll('img')].map(i=>({src:i.src,loaded:i.complete&&i.naturalWidth>0})),readout:document.querySelector('[data-multi-readout]').textContent,notebooks:document.querySelectorAll('button').length,charts:document.querySelectorAll('canvas').length};
 });}
 let snapshot=await metrics();assert.equal(snapshot.h1,1);assert.equal(snapshot.h2.length,8);assert.equal(snapshot.katexErrors,0);assert.equal(snapshot.duplicates.length,0);assert.equal(snapshot.brokenFragments.length,0);assert(snapshot.images.every(i=>i.loaded));
 assert(snapshot.readout.includes('(0.2500, 1.7500, 4.0000)'));assert(snapshot.charts>0);
 fs.writeFileSync(dir+`browser-${mode}.json`,JSON.stringify(snapshot,null,2));
 const controls=[];
 const vectors=JSON.parse(fs.readFileSync(dir+'actual-ts.json','utf8'));
 async function check(topology,alpha,selected){
  const expected=vectors.find(r=>r.topology===topology&&Math.abs(r.alpha-alpha)<1e-12&&r.selected===selected).result.values.map(v=>v.toFixed(4)).join(', ');
  await page.waitForFunction(e=>document.querySelector('[data-multi-readout]').textContent.includes(e),'('+expected+')');
  controls.push({topology,alpha,selected,readout:await page.locator('[data-multi-readout]').innerText()});
 }
 await page.getByRole('button',{name:'失联末步',exact:true}).click();await check('split',.25,20);
 await page.getByRole('button',{name:'单向末步',exact:true}).click();await check('directed',.25,20);
 await page.getByRole('button',{name:'过大步长',exact:true}).click();await check('chain',.7,20);
 await page.getByRole('button',{name:'恢复默认',exact:true}).click();await check('chain',.25,1);
 await page.getByRole('slider',{name:'更新幅度',exact:true}).focus();await page.keyboard.press('Home');await check('chain',.05,1);
 await page.keyboard.press('End');await check('chain',.7,1);
 await page.getByRole('button',{name:'恢复默认',exact:true}).click();await check('chain',.25,1);
 fs.writeFileSync(dir+`controls-${mode}.json`,JSON.stringify(controls,null,2));
 await page.locator('[aria-label="三辆小车局部协调实验"]').scrollIntoViewIfNeeded();await page.screenshot({path:dir+`desktop-${mode}.png`});
 if(mode==='pages'||mode==='normal'){
  const buttons=page.getByRole('button',{name:/全部运行/});await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===2,{},{timeout:180000});assert.equal(await buttons.count(),2);
  for(let i=0;i<2;i++){
   await buttons.nth(i).click();
   await page.waitForFunction(()=>![...document.querySelectorAll('button')].some(b=>b.textContent.includes('运行中')||b.textContent.includes('全部运行')&&b.disabled),{},{timeout:240000});
  }
  const outputs=await page.locator('article pre').allTextContents();
  // Persist actual displayed output even when output wrappers use a different class.
  const body=await page.locator('article').innerText();
  assert(outputs.join('\n').includes("exact step1= ['1/4', '7/4', '4']")&&outputs.join('\n').includes('disagreement factors=')&&outputs.join('\n').includes('shifted example average= 3'));
  assert(!body.includes('Traceback (most recent call last)'));
  fs.writeFileSync(dir+`page-python-${mode}.json`,JSON.stringify({pass:true,outputs,body,errors},null,2));
 }
 await page.setViewportSize({width:375,height:900});await page.getByRole('button',{name:'恢复默认',exact:true}).click();
 await page.locator('[aria-label="三辆小车局部协调实验"]').scrollIntoViewIfNeeded();
 snapshot=await metrics();assert(snapshot.scrollWidth<=375);assert.equal(snapshot.duplicates.length,0);
 fs.writeFileSync(dir+`mobile-${mode}.json`,JSON.stringify(snapshot,null,2));await page.screenshot({path:dir+`mobile-${mode}.png`});
 fs.writeFileSync(dir+`errors-${mode}.json`,JSON.stringify(errors,null,2));assert.equal(errors.length,0);
 console.log(JSON.stringify({mode,pass:true,controls:controls.length,mobile:snapshot.scrollWidth}));
}
await browser.close();
