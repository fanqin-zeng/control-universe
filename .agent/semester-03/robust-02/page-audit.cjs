const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.setDefaultTimeout(240000);page.on('pageerror',e=>errors.push(String(e)));
const url=process.env.ROBUST02_PAGE_URL||'http://127.0.0.1:18695/robust/uncertainty-modeling';
const name=process.env.ROBUST02_AUDIT_NAME||'native';
const response=await page.goto(url);assert.equal(response.status(),200);
const buttons=page.getByRole('button',{name:/全部运行/});await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===4,null,{timeout:240000});assert.equal(await buttons.count(),4);
const expected=['fit_complete','msd_complete','mimo_complete','all_answers_complete'];
for(let i=0;i<4;i++){
 await buttons.nth(i).click();await page.waitForFunction(token=>document.body.innerText.includes(token),expected[i],{timeout:240000});
}
const defaultText=await page.getByTestId('uncertainty-readings').innerText();
for(const [label,value] of [['对象增益 K','1.2'],['时间常数 T','0.8'],['控制器输入增益 g','4'],['读数频率','1']]){
await page.getByRole('slider',{name:label,exact:true}).fill(value);await page.getByRole('slider',{name:label,exact:true}).dispatchEvent('input');assert.notEqual(await page.getByTestId('uncertainty-readings').innerText(),defaultText);await page.getByRole('button',{name:'恢复建模默认'}).click();assert.equal(await page.getByTestId('uncertainty-readings').innerText(),defaultText);
}
await page.getByRole('button',{name:'单位控制器'}).click();const changed=await page.getByTestId('uncertainty-readings').innerText();assert(changed.includes('矩阵差F范数=0.000000'));await page.getByRole('button',{name:'恢复建模默认'}).click();
const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
assert.equal(dom.h1,1);assert.equal(dom.h2.length,10);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);
for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))));
const old=JSON.parse(fs.readFileSync('.agent/semester-03/robust-02/headings-before.json','utf8'));for(const id of old.ids)assert(dom.ids.includes(id),'missing old anchor '+id);
assert(dom.images.some(x=>x.loaded&&x.src.endsWith('lft-ports.svg')));assert.equal(errors.length,0);
const grid=JSON.parse(fs.readFileSync('.agent/semester-03/robust-02/reconciliation.json','utf8')).default;
for(const key of ['absolute','relative','weight','svOutput','svInput','matrixDifference'])assert(defaultText.includes(grid[key].toFixed(6)));
await page.screenshot({path:'.agent/semester-03/robust-02/desktop-'+name+'.png',fullPage:true});await page.locator('section[aria-label="不确定性建模实验"]').screenshot({path:'.agent/semester-03/robust-02/explorer-'+name+'.png'});
await page.setViewportSize({width:375,height:812});await page.waitForTimeout(500);
const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width);
await page.screenshot({path:'.agent/semester-03/robust-02/mobile-'+name+'.png',fullPage:true});await page.locator('section[aria-label="不确定性建模实验"]').screenshot({path:'.agent/semester-03/robust-02/explorer-mobile-'+name+'.png'});
fs.writeFileSync('.agent/semester-03/robust-02/browser-'+name+'.json',JSON.stringify({url,pass:true,dom,mobile,errors,defaultText,changed},null,2));
console.log('PASS real DOM, all historical anchors, 10 H2, four notebooks / five cells, sliders/reset, default numerical readings, SVG, 375px, no page errors');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
