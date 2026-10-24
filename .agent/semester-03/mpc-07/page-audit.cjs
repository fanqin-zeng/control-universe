const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');let browser,page;
(async()=>{
const dir='.agent/semester-03/mpc-07/',name=process.env.MPC07_AUDIT_NAME||'native',url=process.env.MPC07_PAGE_URL||'http://127.0.0.1:20296/mpc/explicit-mpc';
browser=await chromium.launch({headless:true,channel:'msedge'});page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
for(const port of [8891,8981])await page.route('http://127.0.0.1:'+port+'/**',route=>route.continue({url:route.request().url().replace(':'+port,':9096')}));
assert.equal((await page.goto(url)).status(),200);const read=page.getByTestId('explicit-readout');await read.waitFor();
const initial=await read.innerText();assert(initial.includes('R2')&&initial.includes('u=-1.000000')&&initial.includes('J=5.00000000'));
const xs=page.getByRole('slider',{name:'当前状态 x',exact:true}),rs=page.getByRole('slider',{name:'目标参考 r',exact:true});
for(const [x,r,u] of [[1,0,'-0.500000'],[2,3,'0.000000'],[1,3,'1.000000'],[0,0,'0.000000']]){await xs.fill(String(x));await rs.fill(String(r));assert((await read.innerText()).includes('u='+u));}
assert((await read.innerText()).includes('J=0.00000000'));
await xs.fill('1');await rs.fill('3');assert((await read.innerText()).includes('R0,R1,R3'));
await xs.fill('0');await rs.fill('3.25');assert((await read.innerText()).includes('未批准'));assert((await page.getByTestId('explicit-qp').innerText()).includes('u=1.000000'));
await xs.fill('3.25');await rs.fill('0');assert((await page.getByTestId('explicit-qp').innerText()).includes('原QP也不可行'));
await page.getByRole('button',{name:'载入容差反例',exact:true}).click();assert((await read.innerText()).includes('u=-1.000000'));assert((await page.getByTestId('explicit-tolerance').innerText()).includes('违反量=0.005000'));
await page.getByRole('button',{name:'恢复默认',exact:true}).click();assert.equal(await read.innerText(),initial);
await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===2,null,{timeout:180000});
const run=page.getByRole('button',{name:/全部运行/});await run.nth(0).click();
await page.waitForFunction(()=>[...document.querySelectorAll('pre')].some(e=>e.innerText.includes('regions_and_shared_boundaries_checked')),null,{timeout:240000});
await run.nth(1).click();await page.waitForFunction(()=>[...document.querySelectorAll('pre')].some(e=>e.innerText.includes('domain_tolerance_and_model_limits_checked')),null,{timeout:240000});
const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(x=>({text:x.textContent,id:x.id})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(x=>x.getAttribute('href')),katex:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src')?.slice(0,100),loaded:x.complete&&x.naturalWidth>0})),canvases:document.querySelectorAll('canvas').length}));
const expected=JSON.parse(fs.readFileSync(dir+'headings.json','utf8'));assert.equal(dom.h1,1);assert.equal(dom.h2.length,10);assert.equal(dom.katex,0);assert.deepEqual(dom.h2.map(h=>h.id),expected.h2.map(h=>h.id));assert.equal(new Set(dom.ids).size,dom.ids.length);
for(const id of expected.ids)assert(dom.ids.includes(id),id);for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))),href);
assert(dom.images.some(i=>i.loaded&&i.src.endsWith('explicit-offline-online.svg')));assert(dom.images.filter(i=>i.loaded).length>=3);assert(dom.canvases>=2);
await page.locator('section[aria-label="显式MPC实验"]').screenshot({path:dir+'explorer-'+name+'.png'});
await page.locator('img[src$="explicit-offline-online.svg"]').screenshot({path:dir+'diagram-'+name+'.png'});
for(let i=0;i<2;i++)await page.locator('img[src^="data:image/"]').nth(i).screenshot({path:dir+'notebook-'+i+'-'+name+'.png'});
await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:dir+'desktop-'+name+'.png'});
await page.setViewportSize({width:375,height:812});await page.waitForTimeout(600);
const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width);
await page.screenshot({path:dir+'mobile-'+name+'.png'});assert.deepEqual(errors,[]);
await page.locator('section[aria-label="显式MPC实验"]').screenshot({path:dir+'explorer-mobile-'+name+'.png'});
fs.writeFileSync(dir+'browser-'+name+'.json',JSON.stringify({pass:true,url,initial,dom,mobile,errors},null,2));console.log('PASS actual browser 10 H2/all anchors, default/central/boundary/domain/tolerance/reset/equilibrium, 2 notebooks/4 cells, figure/SVG/375px');await browser.close();
})().catch(async e=>{console.error(e);if(page)fs.writeFileSync('.agent/semester-03/mpc-07/browser-failure.txt',await page.locator('body').innerText());if(browser)await browser.close();process.exitCode=1;});

