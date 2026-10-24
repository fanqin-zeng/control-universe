const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],kernelCalls=[];page.setDefaultTimeout(240000);page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(/127\.0\.0\.1:89\d\d/.test(r.url()))kernelCalls.push(r.url());});
 const name=process.env.ROBUST04_AUDIT_NAME||'native',url=process.env.ROBUST04_PAGE_URL||'http://127.0.0.1:19295/robust/robust-performance';
 assert.equal((await page.goto(url)).status(),200);
 const buttons=page.getByRole('button',{name:/全部运行/});await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===3,null,{timeout:240000});
 for(let i=0;i<3;i++){await buttons.nth(i).click();await page.waitForFunction(t=>document.body.innerText.includes(t),['lft_complete','plots_complete','all_answers_complete'][i],{timeout:240000});}
 const defaults=await page.getByTestId('performance-readings').innerText();
 const expected=JSON.parse(fs.readFileSync('.agent/semester-03/robust-04/reconciliation.json','utf8')).default;
 for(const k of ['nominal','actual','worst','pole','rs','weightAtWb','unity'])assert(defaults.includes(expected[k].toFixed(6)),k);
 for(const [label,value]of [['增益 k','19'],['归一化静态 δ','0'],['权重参数 ωb','5']]){await page.getByRole('slider',{name:label,exact:true}).fill(value);await page.getByRole('slider',{name:label,exact:true}).dispatchEvent('input');assert.notEqual(await page.getByTestId('performance-readings').innerText(),defaults);await page.getByRole('button',{name:'恢复性能默认'}).click();assert.equal(await page.getByTestId('performance-readings').innerText(),defaults);}
 await page.getByRole('button',{name:'标称边界9'}).click();assert((await page.getByTestId('performance-status').innerText()).includes('标称DC严格达标：否'));
 await page.getByRole('button',{name:'鲁棒DC边界18'}).click();assert((await page.getByTestId('performance-status').innerText()).includes('鲁棒DC严格达标：否'));
 await page.getByRole('button',{name:'增益19',exact:true}).click();assert((await page.getByTestId('performance-status').innerText()).includes('鲁棒DC严格达标：是'));await page.getByRole('button',{name:'恢复性能默认'}).click();
 const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
 assert.equal(dom.h1,1);assert.equal(dom.h2.length,10);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);
 for(const h of dom.links)assert(dom.ids.includes(decodeURIComponent(h.slice(1))),h);
 const old=JSON.parse(fs.readFileSync('.agent/semester-03/robust-04/headings-before.json','utf8'));for(const id of old.ids)assert(dom.ids.includes(id),'missing historical ID '+id);
 assert(dom.images.some(x=>x.loaded&&x.src.endsWith('robust-performance-lft.svg')));assert.equal(errors.length,0);
 if(name==='native'){assert(kernelCalls.length>0);assert(kernelCalls.every(u=>u.startsWith('http://127.0.0.1:8995/')));}
 await page.screenshot({path:'.agent/semester-03/robust-04/desktop-'+name+'.png',fullPage:true});await page.locator('section[aria-label="鲁棒性能实验"]').screenshot({path:'.agent/semester-03/robust-04/explorer-'+name+'.png'});
 await page.setViewportSize({width:375,height:812});await page.waitForTimeout(300);const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
 fs.writeFileSync('.agent/semester-03/robust-04/browser-'+name+'.json',JSON.stringify({url,pass:mobile.scroll<=mobile.width,dom,mobile,defaults,errors,kernelCalls},null,2));
 assert(mobile.scroll<=mobile.width,JSON.stringify(mobile));await page.screenshot({path:'.agent/semester-03/robust-04/mobile-'+name+'.png',fullPage:true});await page.locator('section[aria-label="鲁棒性能实验"]').screenshot({path:'.agent/semester-03/robust-04/explorer-mobile-'+name+'.png'});
 console.log('PASS real DOM / all historical anchors / 10 H2 / 3 notebooks and 5 cells / sliders, strict boundaries, reset / SVG and 375px / no page errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
