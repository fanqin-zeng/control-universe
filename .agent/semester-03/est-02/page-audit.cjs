const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],consoleErrors=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 await page.route(/http:\/\/127\.0\.0\.1:(8891|8981)\//,route=>route.continue({url:route.request().url().replace(/:(8891|8981)\//,':19204/')}));
 const url=process.env.EST02_PAGE_URL||'http://127.0.0.1:18204/estimation/least-squares-ml',name=process.env.EST02_AUDIT_NAME||'native';
 const response=await page.goto(url);assert.equal(response.status(),200);
 const section=page.getByRole('region',{name:'统计估计目标探索'});await section.getByRole('button',{name:'恢复默认'}).waitFor();
 const readout=page.getByTestId('statistics-readout');
 assert((await readout.textContent()).includes('WLS / ML 23.6000 °C，标称方差 0.8000 °C²；高斯后验均值 / MAP 23.0000 °C，后验方差 0.6667'));
 const initialCanvas=await section.locator('canvas').screenshot();let canvasChanged=false;
 const refs=JSON.parse(fs.readFileSync('.agent/semester-03/est-02/reference-controls.json','utf8')),cases=[];
 for(const r of refs){
  await section.getByLabel('读数一方差',{exact:true}).selectOption(String(r.r1));
  await section.getByLabel('读数二方差',{exact:true}).selectOption(String(r.r2));
  await section.getByLabel('先验方差',{exact:true}).selectOption(String(r.p));
  const text=await readout.textContent();
  const expected='等权 LS 23.0000 °C；WLS / ML '+r.weighted.toFixed(4)+' °C，标称方差 '+r.weightedVariance.toFixed(4)+' °C²；高斯后验均值 / MAP '+r.posterior.toFixed(4)+' °C，后验方差 '+r.posteriorVariance.toFixed(4)+' °C²。';
  assert.equal(text,expected);
  if(cases.length===0){const boundary=await section.locator('canvas').screenshot({path:'.agent/semester-03/est-02/curve-boundary-'+name+'.png'});canvasChanged=!initialCanvas.equals(boundary);assert(canvasChanged,'Parameter change must redraw the chart');}
  cases.push({r1:r.r1,r2:r.r2,p:r.p,text});
 }
 await section.getByRole('button',{name:'恢复默认'}).click();assert((await readout.textContent()).includes('WLS / ML 23.6000'));
 assert.equal(await section.locator('canvas').count(),1);
 const buttons=page.getByRole('button',{name:/全部运行/});assert.equal(await buttons.count(),2);
 await buttons.nth(0).click();await page.waitForFunction(()=>document.body.innerText.includes('rank_deficient_same_fit'),{timeout:180000});
 await buttons.nth(1).click();await page.waitForFunction(()=>document.body.innerText.includes('SSE_at_mean_median_L1_at_mean_median'),{timeout:180000});
 const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
 assert.equal(dom.h1,1);assert.equal(dom.h2.length,10);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))),href);
 const expected=JSON.parse(fs.readFileSync('.agent/semester-03/est-02/reconciliation.json','utf8')).headings.h2;
 assert.deepEqual(dom.h2,expected.map(h=>({id:h.id,text:h.text})));
 assert(dom.images.some(x=>x.loaded&&x.src.endsWith('statistical-estimation.svg')));
 for(const token of ['LS_WLS_MAP 23.0 23.6 23.0','vector_LS_rank_coefficients_SSE','truth_OLS_WLS_MAP_MSE','unknown_variance_mean_SSE_ML_unbiased','[80.0, 100.0, 16.0, 10.0]'])assert(dom.text.includes(token),token);
 await page.screenshot({path:'.agent/semester-03/est-02/desktop-'+name+'.png',fullPage:true});
 await page.setViewportSize({width:375,height:812});await page.waitForTimeout(500);
 const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width,JSON.stringify(mobile));
 await page.screenshot({path:'.agent/semester-03/est-02/mobile-'+name+'.png',fullPage:true});
 await page.locator('img[src$="statistical-estimation.svg"]').screenshot({path:'.agent/semester-03/est-02/diagram-mobile-'+name+'.png'});
 await section.screenshot({path:'.agent/semester-03/est-02/explorer-mobile-'+name+'.png'});
 assert.equal(errors.length,0,errors.join('\n'));assert.equal(consoleErrors.length,0,consoleErrors.join('\n'));
 fs.writeFileSync('.agent/semester-03/est-02/browser-'+name+'.json',JSON.stringify({url,pass:true,gatewayRouting:'native gateway -> isolated 19204',canvasChanged,dom,cases,mobile,errors,consoleErrors},null,2));
 console.log('PASS real DOM 10 H2 / exact anchors / 4 original cells / 75 controls + reset / SVG / 375px / no browser errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
