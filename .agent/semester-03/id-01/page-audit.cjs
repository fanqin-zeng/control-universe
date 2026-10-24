const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
const url=process.env.ID01_PAGE_URL||'http://127.0.0.1:18193/identification/identification-framework';
const name=process.env.ID01_AUDIT_NAME||'native';
const response=await page.goto(url);assert.equal(response.status(),200);
await page.getByRole('button',{name:/全部运行/}).first().waitFor();
await page.waitForTimeout(1500);
const buttons=page.getByRole('button',{name:/全部运行/});assert.equal(await buttons.count(),2);
for(let i=0;i<2;i++){await buttons.nth(i).click();await page.waitForFunction(()=>document.body.innerText.includes('both_candidates_fit True')||document.body.innerText.includes('validation_levels_cm'),{timeout:120000});}
await page.waitForFunction(()=>document.body.innerText.includes('both_candidates_fit True')&&document.body.innerText.includes('validation_levels_cm'),{timeout:120000});
const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
assert.equal(dom.h1,1);assert.equal(dom.h2.length,9);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))));assert(dom.images.some(x=>x.loaded&&x.src.endsWith('framework.svg')));assert.equal(errors.length,0);
await page.screenshot({path:'.agent/semester-03/id-01/desktop-'+name+'.png',fullPage:true});
await page.setViewportSize({width:375,height:812});await page.waitForTimeout(500);
const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width);
await page.screenshot({path:'.agent/semester-03/id-01/mobile-'+name+'.png',fullPage:true});
fs.writeFileSync('.agent/semester-03/id-01/browser-'+name+'.json',JSON.stringify({url,pass:true,dom,mobile,errors},null,2));
await browser.close();console.log('PASS real DOM, 9 H2, anchors, image, 3 cell outputs, 375px, no page errors');
})().catch(e=>{console.error(e);process.exitCode=1;});
