const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.setDefaultTimeout(240000);page.on('pageerror',e=>errors.push(String(e)));
const url=process.env.ROBUST01_PAGE_URL||'http://127.0.0.1:18195/robust/robustness-concept';
const name=process.env.ROBUST01_AUDIT_NAME||'native';
const response=await page.goto(url);assert.equal(response.status(),200);
const buttons=page.getByRole('button',{name:/全部运行/});await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===4,null,{timeout:240000});assert.equal(await buttons.count(),4);
const expected=['Routh_J_upper_strict','resonance_complete','MS_margin_bounds','all_answers_complete'];
for(let i=0;i<4;i++){
 await buttons.nth(i).click();await page.waitForFunction(token=>document.body.innerText.includes(token),expected[i],{timeout:240000});
}
const defaultText=await page.getByTestId('resonance-values').innerText();
await page.getByRole('slider',{name:'共振频率',exact:true}).fill('50');
await page.getByRole('slider',{name:'共振频率',exact:true}).dispatchEvent('input');
await page.waitForTimeout(300);
const changed=await page.getByTestId('resonance-values').innerText();assert.notEqual(changed,defaultText);
await page.getByRole('button',{name:'恢复共振默认'}).click();assert.equal(await page.getByTestId('resonance-values').innerText(),defaultText);
await page.getByRole('slider',{name:'共振阻尼',exact:true}).fill('0.01');await page.getByRole('slider',{name:'共振阻尼',exact:true}).dispatchEvent('input');
assert.notEqual(await page.getByTestId('resonance-values').innerText(),defaultText);
await page.getByRole('button',{name:'恢复共振默认'}).click();
const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
assert.equal(dom.h1,1);assert.equal(dom.h2.length,10);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);
for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))));
const old=JSON.parse(fs.readFileSync('.agent/semester-03/robust-01/headings-before.json','utf8'));for(const id of old.ids)assert(dom.ids.includes(id),'missing old anchor '+id);
assert(dom.images.some(x=>x.loaded&&x.src.endsWith('robustness-signals.svg')));assert.equal(errors.length,0);
const grid=JSON.parse(fs.readFileSync('.agent/semester-03/robust-01/reconciliation.json','utf8')).default_grid;
for(const value of [grid.tMax,grid.deltaMax,grid.tMax*grid.deltaMax,grid.productMax])assert(defaultText.includes(value.toFixed(6)));
await page.screenshot({path:'.agent/semester-03/robust-01/desktop-'+name+'.png',fullPage:true});await page.locator('section[aria-label="共振与鲁棒性实验"]').screenshot({path:'.agent/semester-03/robust-01/explorer-'+name+'.png'});
await page.setViewportSize({width:375,height:812});await page.waitForTimeout(500);
const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width);
await page.screenshot({path:'.agent/semester-03/robust-01/mobile-'+name+'.png',fullPage:true});await page.locator('section[aria-label="共振与鲁棒性实验"]').screenshot({path:'.agent/semester-03/robust-01/explorer-mobile-'+name+'.png'});
fs.writeFileSync('.agent/semester-03/robust-01/browser-'+name+'.json',JSON.stringify({url,pass:true,dom,mobile,errors,defaultText,changed},null,2));
console.log('PASS real DOM, all historical anchors, 10 H2, four original cells, sliders/reset, default numerical readings, SVG, 375px, no page errors');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
