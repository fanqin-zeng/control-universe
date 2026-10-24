const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],consoleErrors=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
// The isolated build uses the committed gateway port. Redirect only gateway requests
// to rank4's own server; never start, alter, or stop the shared gateway.
await page.route(/http:\/\/127\.0\.0\.1:(8891|8981)\//,route=>route.continue({url:route.request().url().replace(/:(8891|8981)\//,':8994/')}));
const url=process.env.EST01_PAGE_URL||'http://127.0.0.1:18194/estimation/estimation-problem';
const name=process.env.EST01_AUDIT_NAME||'native';
const response=await page.goto(url);assert.equal(response.status(),200);
const explorer=page.getByRole('region',{name:'标量估计修正探索'});
await explorer.getByRole('button',{name:'恢复默认'}).waitFor();
const readout=page.getByTestId('estimation-readout');
assert((await readout.textContent()).includes('22.4000 °C；模型均方误差 0.8000'));
const cases=[];
for(const p of [1,4,9])for(const r of [0,1,4,9]){
 await explorer.getByLabel('预测误差方差',{exact:true}).selectOption(String(p));
 await explorer.getByLabel('测量噪声方差',{exact:true}).selectOption(String(r));
 for(const k of [0,1]){
  await explorer.getByLabel('修正增益',{exact:true}).fill(String(k));
  const text=await readout.textContent();const estimate=k===0?20:23,risk=k===0?p:r;
  assert(text.includes(estimate.toFixed(4)+' °C；模型均方误差 '+risk.toFixed(4)),text);
  cases.push({p,r,k,text});
 }
 await explorer.getByRole('button',{name:'使用模型最优增益'}).click();
 const text=await readout.textContent();assert(text.includes((p*r/(p+r)).toFixed(4)+' °C²'),text);cases.push({p,r,optimal:true,text});
}
await explorer.getByRole('button',{name:'恢复默认'}).click();
assert((await readout.textContent()).includes('22.4000 °C；模型均方误差 0.8000'));
assert.equal(await explorer.locator('canvas').count(),1);
await page.getByRole('button',{name:/全部运行/}).first().waitFor();
const buttons=page.getByRole('button',{name:/全部运行/});assert.equal(await buttons.count(),2);
await buttons.nth(0).click();await page.waitForFunction(()=>document.body.innerText.includes('R_zero_gain_risk'),{timeout:180000});
await buttons.nth(1).click();await page.waitForFunction(()=>document.body.innerText.includes('exercise3_mean_P_K_estimate_MSE'),{timeout:180000});
const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
assert.equal(dom.h1,1);assert.equal(dom.h2.length,9);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))),href);
const expected=JSON.parse(fs.readFileSync('.agent/semester-03/est-01/reconciliation.json','utf8')).headings.h2;
assert.deepEqual(dom.h2,expected.map(h=>({id:h.id,text:h.text})));
assert(dom.images.some(x=>x.loaded&&x.src.endsWith('predict-correct.svg')));
for(const token of ['gain_estimate_risk 0.8 22.4 0.8','biased_mean_MSE_keep_prediction -2.4 6.56','exercise2_K_estimate_MSE','exercise3_mean_P_K_estimate_MSE'])assert(dom.text.includes(token),token);
await page.screenshot({path:'.agent/semester-03/est-01/desktop-'+name+'.png',fullPage:true});
await page.setViewportSize({width:375,height:812});await page.waitForTimeout(500);
const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width,JSON.stringify(mobile));
await page.screenshot({path:'.agent/semester-03/est-01/mobile-'+name+'.png',fullPage:true});
assert.equal(errors.length,0,errors.join('\n'));assert.equal(consoleErrors.length,0,consoleErrors.join('\n'));
fs.writeFileSync('.agent/semester-03/est-01/browser-'+name+'.json',JSON.stringify({url,pass:true,gatewayRouting:'committed port -> isolated 8994 (native only)',dom,cases,mobile,errors,consoleErrors},null,2));
console.log('PASS real DOM, 9 H2, exact anchors, image, 4 cell outputs, 36 control cases + reset, 375px, no browser errors');
} finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
