const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],kernelCalls=[];page.setDefaultTimeout(240000);page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(/127\.0\.0\.1:89\d\d/.test(r.url()))kernelCalls.push(r.url());});
 const name=process.env.ROBUST06_AUDIT_NAME||'native',url=process.env.ROBUST06_PAGE_URL||'http://127.0.0.1:19895/robust/mixed-sensitivity';assert.equal((await page.goto(url)).status(),200);
 await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===3,null,{timeout:240000});
 const buttons=page.getByRole('button',{name:/全部运行/});for(let i=0;i<3;i++){await buttons.nth(i).click();await page.waitForFunction(t=>document.body.innerText.includes(t),['weights_complete','verification_complete','all_answers_complete'][i],{timeout:240000});}
 const defaults=await page.getByTestId('mixed-readings').innerText(),r=JSON.parse(fs.readFileSync('.agent/semester-03/robust-06/reconciliation.json','utf8')).default;
 for(const key of ['scanPeak','gamma','T10','DC','initialControl'])assert(defaults.includes(r[key].toFixed(6)),key);
 for(const [label,value]of [['阻尼参数 a','5'],['增益参数 k','900'],['控制权重 rho','0.2'],['性能权重 wb','10']]){const s=page.getByRole('slider',{name:label,exact:true});await s.fill(value);await s.dispatchEvent('input');assert.notEqual(await page.getByTestId('mixed-readings').innerText(),defaults);await page.getByRole('button',{name:'恢复默认',exact:true}).click();assert.equal(await page.getByTestId('mixed-readings').innerText(),defaults);}
 await page.getByRole('button',{name:'较慢候选',exact:true}).click();assert((await page.getByTestId('mixed-status').innerText()).includes('未小于1'));
 await page.getByRole('button',{name:'较快候选',exact:true}).click();assert((await page.getByTestId('mixed-readings').innerText()).includes('4.500000'));
 await page.getByRole('button',{name:'加重控制代价',exact:true}).click();assert((await page.getByTestId('mixed-readings').innerText()).includes('0.770908'));await page.getByRole('button',{name:'恢复默认',exact:true}).click();assert.equal(await page.getByTestId('mixed-readings').innerText(),defaults);
 const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
 assert.equal(dom.h1,1);assert.equal(dom.h2.length,9);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))),href);
 const old=JSON.parse(fs.readFileSync('.agent/semester-03/robust-06/headings-before.json','utf8'));for(const id of old.ids)assert(dom.ids.includes(id),'missing old ID '+id);
 assert(dom.images.some(x=>x.loaded&&x.src.endsWith('mixed-sensitivity-signals.svg')));assert(dom.images.filter(x=>x.loaded&&x.src.startsWith('data:image/png')).length>=3);assert.equal(errors.length,0);
 if(name==='native'){assert(kernelCalls.length>0);assert(kernelCalls.every(u=>u.startsWith('http://127.0.0.1:8995/')));}
 await page.screenshot({path:'.agent/semester-03/robust-06/desktop-'+name+'.png',fullPage:true});await page.locator('section[aria-label="混合灵敏度权衡实验"]').screenshot({path:'.agent/semester-03/robust-06/explorer-'+name+'.png'});
 await page.setViewportSize({width:375,height:812});await page.waitForTimeout(300);const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
 fs.writeFileSync('.agent/semester-03/robust-06/browser-'+name+'.json',JSON.stringify({url,pass:mobile.scroll<=mobile.width,dom,mobile,defaults,errors,kernelCalls},null,2));assert(mobile.scroll<=mobile.width,JSON.stringify(mobile));
 await page.screenshot({path:'.agent/semester-03/robust-06/mobile-'+name+'.png',fullPage:true});await page.locator('section[aria-label="混合灵敏度权衡实验"]').screenshot({path:'.agent/semester-03/robust-06/explorer-mobile-'+name+'.png'});
 console.log('PASS real DOM/all old IDs/9 H2/3 notebooks 5 cells/four sliders/presets/reset/SVG/375px/no pageerror');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
