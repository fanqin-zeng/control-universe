const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');let browser,page;
(async()=>{
const dir='.agent/semester-03/mpc-11/',name=process.env.MPC11_AUDIT_NAME||'native',url=process.env.MPC11_PAGE_URL||'http://127.0.0.1:21896/mpc/mpc-case-study';
browser=await chromium.launch({headless:true,channel:'msedge'});page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
for(const port of [8891,8981])await page.route('http://127.0.0.1:'+port+'/**',route=>route.continue({url:route.request().url().replace(':'+port,':9136')}));
assert.equal((await page.goto(url)).status(),200);const read=page.getByTestId('cstr-plan');await read.waitFor();const initial=await read.innerText();assert(initial.includes('F=101.019262')&&initial.includes('40/40'));const metric=await page.getByTestId('cstr-metrics').innerText();assert(metric.includes('347.251350'));
const set=async(name,value)=>page.getByRole('slider',{name,exact:true}).fill(value);const reset=async()=>page.getByRole('button',{name:'恢复默认',exact:true}).click();
for(const [name,value] of [['预测步数 Np','4'],['Q 缩放','2'],['R 缩放','10'],['温度阶跃 K','4'],['每拍输入变化限','1']]){await set(name,value);assert.notEqual(await read.innerText(),initial);await reset();}
await set('2分钟后进料浓度','1');assert((await page.getByTestId('cstr-metrics').innerText()).includes('351.396178'));await reset();assert.equal(await read.innerText(),initial);
await set('温度阶跃 K','0');await set('2分钟后进料浓度','1');assert((await page.getByTestId('cstr-metrics').innerText()).includes('350.000000'));await reset();
await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===2,null,{timeout:180000});
const run=page.getByRole('button',{name:/全部运行/});await run.nth(0).click();
await page.waitForFunction(()=>[...document.querySelectorAll('pre')].some(e=>e.innerText.includes('equilibria_and_exercises_checked')),null,{timeout:240000});
await run.nth(1).click();await page.waitForFunction(()=>[...document.querySelectorAll('pre')].some(e=>e.innerText.includes('prediction_errors_and_interfaces_checked')),null,{timeout:240000});
const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(x=>({text:x.textContent,id:x.id})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(x=>x.getAttribute('href')),katex:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src')?.slice(0,100),loaded:x.complete&&x.naturalWidth>0})),canvases:document.querySelectorAll('canvas').length}));
const expected=JSON.parse(fs.readFileSync(dir+'headings.json','utf8'));assert.equal(dom.h1,1);assert.equal(dom.h2.length,12);assert.equal(dom.katex,0);assert.deepEqual(dom.h2.map(h=>h.id),expected.h2.map(h=>h.id));assert.equal(new Set(dom.ids).size,dom.ids.length);
for(const id of JSON.parse(fs.readFileSync(dir+'anchor-map.json','utf8')).oldIds)assert(dom.ids.includes(id),'lost old ID '+id);for(const id of expected.ids)assert(dom.ids.includes(id),id);for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))),href);
assert(dom.images.some(i=>i.loaded&&i.src.endsWith('cstr-deployment.svg')));assert(dom.images.filter(i=>i.loaded).length>=3);assert(dom.canvases>=2);
await page.locator('section[aria-label="CSTR MPC实验"]').screenshot({path:dir+'explorer-'+name+'.png'});
await page.locator('img[src$="cstr-deployment.svg"]').screenshot({path:dir+'diagram-'+name+'.png'});
for(let i=0;i<2;i++)await page.locator('img[src^="data:image/"]').nth(i).screenshot({path:dir+'notebook-'+i+'-'+name+'.png'});
await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:dir+'desktop-'+name+'.png'});
await page.setViewportSize({width:375,height:812});await page.waitForTimeout(600);
const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width);
await page.screenshot({path:dir+'mobile-'+name+'.png'});assert.deepEqual(errors,[]);
await page.locator('section[aria-label="CSTR MPC实验"]').screenshot({path:dir+'explorer-mobile-'+name+'.png'});
fs.writeFileSync(dir+'browser-'+name+'.json',JSON.stringify({pass:true,url,initial,dom,mobile,errors},null,2));console.log('PASS actual browser 12 H2/all old anchors, default/Np/Q/R/reference/rate/feed/zero/reset, 2 notebooks/4 cells, figure/SVG/375px');await browser.close();
})().catch(async e=>{console.error(e);if(page)fs.writeFileSync('.agent/semester-03/mpc-11/browser-failure.txt',await page.locator('body').innerText());if(browser)await browser.close();process.exitCode=1;});

