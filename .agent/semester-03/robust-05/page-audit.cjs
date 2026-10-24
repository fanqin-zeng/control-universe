const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],kernelCalls=[];page.setDefaultTimeout(240000);page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(/127\.0\.0\.1:89\d\d/.test(r.url()))kernelCalls.push(r.url());});
 const name=process.env.ROBUST05_AUDIT_NAME||'native',url=process.env.ROBUST05_PAGE_URL||'http://127.0.0.1:19595/robust/h-infinity-basics';assert.equal((await page.goto(url)).status(),200);
 const buttons=page.getByRole('button',{name:/全部运行/});await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===4,null,{timeout:240000});
 for(let i=0;i<4;i++){await buttons.nth(i).click();await page.waitForFunction(t=>document.body.innerText.includes(t),['plant_complete','design_complete','comparison_complete','all_answers_complete'][i],{timeout:240000});}
 const defaults=await page.getByTestId('hinfinity-readings').innerText(),expected=JSON.parse(fs.readFileSync('.agent/semester-03/robust-05/reconciliation.json','utf8')).default;
 for(const key of ['scanPeak','T10','DC','notchRatio'])assert(defaults.includes(expected[key].toFixed(6)),key);
 assert((await page.getByTestId('hinfinity-status').innerText()).includes('闭环严格稳定'));
 for(const [label,value]of [['增益 K','10'],['滤波中心频率','9'],['零点阻尼','0.1'],['极点阻尼','0.7'],['低通角频率','0.2']]){const slider=page.getByRole('slider',{name:label,exact:true});await slider.fill(value);await slider.dispatchEvent('input');assert.notEqual(await page.getByTestId('hinfinity-readings').innerText(),defaults);await page.getByRole('button',{name:'恢复整形默认'}).click();assert.equal(await page.getByTestId('hinfinity-readings').innerText(),defaults);}
 await page.getByRole('button',{name:'原稿参数',exact:true}).click();assert((await page.getByTestId('hinfinity-status').innerText()).includes('闭环不稳定'));assert((await page.getByTestId('hinfinity-status').innerText()).includes('不宣称阶跃稳态存在'));
 await page.getByRole('button',{name:'仅交换阻尼'}).click();assert((await page.getByTestId('hinfinity-status').innerText()).includes('闭环严格稳定'));const swap=await page.getByTestId('hinfinity-readings').innerText();assert(swap.includes('4.261302'));
 await page.getByRole('button',{name:'低通加快到0.2'}).click();assert((await page.getByTestId('hinfinity-readings').innerText()).includes('1.875286'));await page.getByRole('button',{name:'恢复整形默认'}).click();assert.equal(await page.getByTestId('hinfinity-readings').innerText(),defaults);
 const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
 assert.equal(dom.h1,1);assert.equal(dom.h2.length,9);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);
 for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))),href);
 const old=JSON.parse(fs.readFileSync('.agent/semester-03/robust-05/headings-before.json','utf8'));for(const id of old.ids)assert(dom.ids.includes(id),'missing old ID '+id);
 assert(dom.images.some(x=>x.loaded&&x.src.endsWith('hinfinity-generalized-plant.svg')));assert(dom.images.filter(x=>x.loaded&&x.src.startsWith('data:image/png')).length>=4);assert.equal(errors.length,0);
 if(name==='native'){assert(kernelCalls.length>0);assert(kernelCalls.every(u=>u.startsWith('http://127.0.0.1:8995/')));}
 await page.screenshot({path:'.agent/semester-03/robust-05/desktop-'+name+'.png',fullPage:true});await page.locator('section[aria-label="H∞回路整形实验"]').screenshot({path:'.agent/semester-03/robust-05/explorer-'+name+'.png'});
 await page.setViewportSize({width:375,height:812});await page.waitForTimeout(300);const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
 fs.writeFileSync('.agent/semester-03/robust-05/browser-'+name+'.json',JSON.stringify({url,pass:mobile.scroll<=mobile.width,dom,mobile,defaults,errors,kernelCalls},null,2));assert(mobile.scroll<=mobile.width,JSON.stringify(mobile));
 await page.screenshot({path:'.agent/semester-03/robust-05/mobile-'+name+'.png',fullPage:true});await page.locator('section[aria-label="H∞回路整形实验"]').screenshot({path:'.agent/semester-03/robust-05/explorer-mobile-'+name+'.png'});
 console.log('PASS real DOM/all old IDs/9 H2/4 notebooks 5 cells and four PNG outputs/five sliders, presets and reset/SVG/375px/no pageerror');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
