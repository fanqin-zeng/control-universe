const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.setDefaultTimeout(240000);page.on('pageerror',e=>errors.push(String(e)));
const url=process.env.ROBUST03_PAGE_URL||'http://127.0.0.1:18995/robust/robust-stability';
const name=process.env.ROBUST03_AUDIT_NAME||'native';
const response=await page.goto(url);assert.equal(response.status(),200);
const buttons=page.getByRole('button',{name:/全部运行/});await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===4,null,{timeout:240000});assert.equal(await buttons.count(),4);
const expected=['kharitonov_complete','quadratic_complete','coupling_complete','all_answers_complete'];
for(let i=0;i<4;i++){
 await buttons.nth(i).click();await page.waitForFunction(token=>document.body.innerText.includes(token),expected[i],{timeout:240000});
}
const defaultText=await page.getByTestId('stability-readings').innerText();
for(const [label,value] of [['回路增益 K','10'],['振子阻尼 b','0.5'],['零失败样本数 N','10000']]){
await page.getByRole('slider',{name:label,exact:true}).fill(value);await page.getByRole('slider',{name:label,exact:true}).dispatchEvent('input');assert.notEqual(await page.getByTestId('stability-readings').innerText(),defaultText);await page.getByRole('button',{name:'恢复分析默认'}).click();assert.equal(await page.getByTestId('stability-readings').innerText(),defaultText);
}
await page.getByRole('button',{name:'题2增益10'}).click();assert((await page.getByTestId('stability-status').innerText()).includes('当前回路：不稳定'));await page.getByRole('button',{name:'恢复分析默认'}).click();
await page.getByRole('button',{name:'原始阻尼0.5'}).click();assert((await page.getByTestId('stability-status').innerText()).includes('不存在严格公共二次证书'));
await page.getByRole('button',{name:'二次证书临界值'}).click();assert((await page.getByTestId('stability-status').innerText()).includes('二次证书临界，非严格通过'));
const changed=await page.getByTestId('stability-readings').innerText();await page.getByRole('button',{name:'恢复分析默认'}).click();
await page.getByRole('slider',{name:'回路增益 K',exact:true}).fill('6');await page.getByRole('slider',{name:'回路增益 K',exact:true}).dispatchEvent('input');assert((await page.getByTestId('stability-status').innerText()).includes('当前回路：临界，非严格稳定'));await page.getByRole('button',{name:'恢复分析默认'}).click();
const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
assert.equal(dom.h1,1);assert.equal(dom.h2.length,10);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);
for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))));
const old=JSON.parse(fs.readFileSync('.agent/semester-03/robust-03/headings-before.json','utf8'));for(const id of old.ids)assert(dom.ids.includes(id),'missing old anchor '+id);
assert(dom.images.some(x=>x.loaded&&x.src.endsWith('stability-methods.svg')));assert.equal(errors.length,0);
const grid=JSON.parse(fs.readFileSync('.agent/semester-03/robust-03/reconciliation.json','utf8')).default;
assert(defaultText.includes(grid.zeroUpper.toFixed(9)));
for(const key of ['alpha','gm','gmDB','pMin','qMax'])assert(defaultText.includes(grid[key].toFixed(6)));
await page.screenshot({path:'.agent/semester-03/robust-03/desktop-'+name+'.png',fullPage:true});await page.locator('section[aria-label="鲁棒稳定性实验"]').screenshot({path:'.agent/semester-03/robust-03/explorer-'+name+'.png'});
await page.setViewportSize({width:375,height:812});await page.waitForTimeout(500);
const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width);
await page.screenshot({path:'.agent/semester-03/robust-03/mobile-'+name+'.png',fullPage:true});await page.locator('section[aria-label="鲁棒稳定性实验"]').screenshot({path:'.agent/semester-03/robust-03/explorer-mobile-'+name+'.png'});
fs.writeFileSync('.agent/semester-03/robust-03/browser-'+name+'.json',JSON.stringify({url,pass:true,dom,mobile,errors,defaultText,changed},null,2));
console.log('PASS real DOM, all historical anchors, 10 H2, four notebooks / five cells, sliders/reset, default numerical readings, SVG, 375px, no page errors');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
