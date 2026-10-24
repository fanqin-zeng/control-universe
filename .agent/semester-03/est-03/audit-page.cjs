const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],consoleErrors=[],nativeKernelIds=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 page.on('request',req=>{if(/:(8891|8981)\/api\/notebook$/.test(req.url())&&req.method()==='POST')nativeKernelIds.push(req.postDataJSON().notebook_id)});
 await page.route(/http:\/\/127\.0\.0\.1:(8891|8981)\//,route=>route.continue({url:route.request().url().replace(/:(8891|8981)\//,':19214/')}));
 const url=process.env.EST03_PAGE_URL||'http://127.0.0.1:18544/estimation/kalman-filter',name=process.env.EST03_AUDIT_NAME||'native';
 const response=await page.goto(url);assert.equal(response.status(),200);
 const section=page.getByRole('region',{name:'卡尔曼噪声假设探索'});await section.getByRole('button',{name:'恢复默认'}).waitFor();
 const readout=page.getByTestId('kalman-readout');
 assert((await readout.textContent()).includes('增益 0.414214；标称方差 0.414214；真实稳态方差 0.414214'));
 const initialCanvas=await section.locator('canvas').screenshot();let canvasChanged=false;
 const refs=JSON.parse(fs.readFileSync('.agent/semester-03/est-03/reference-controls.json','utf8')),cases=[];
 for(const r of refs){
  await section.getByLabel('假设过程强度',{exact:true}).selectOption(String(r.q));
  await section.getByLabel('假设测量强度',{exact:true}).selectOption(String(r.r));
  const text=await readout.textContent();
  const expected=`增益 ${r.gain.toFixed(6)}；标称方差 ${r.nominal.toFixed(6)}；真实稳态方差 ${r.actual.toFixed(6)}；匹配基线 ${r.optimal.toFixed(6)}；误差极点 ${r.pole.toFixed(6)}。`;
  assert.equal(text,expected);
  if(cases.length===0){const boundary=await section.locator('canvas').screenshot({path:'.agent/semester-03/est-03/curve-boundary-'+name+'.png'});canvasChanged=!initialCanvas.equals(boundary);assert(canvasChanged);}
  cases.push({q:r.q,r:r.r,text});
 }
 await section.getByRole('button',{name:'恢复默认'}).click();assert((await readout.textContent()).includes('真实稳态方差 0.414214'));
 assert.equal(await section.locator('canvas').count(),1);
 await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===3,{},{timeout:180000});
 const buttons=page.getByRole('button',{name:/全部运行/});assert.equal(await buttons.count(),3);
 for(const [i,token]of ['exercise10_S_K_control_poles_all','simulation_seed0_final_state_estimate','all_numeric_checks_passed'].entries()){
  await buttons.nth(i).click();await page.waitForFunction(token=>document.body.innerText.includes(token),token,{timeout:240000});
 }
 const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
 assert.equal(dom.h1,1);assert.equal(dom.h2.length,12);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))),href);
 const expected=JSON.parse(fs.readFileSync('.agent/semester-03/est-03/reconciliation.json','utf8')).headings.h2;
 assert.deepEqual(dom.h2,expected.map(h=>({id:h.id,text:h.text})));
 assert(dom.images.some(x=>x.loaded&&x.src.endsWith('kalman-cycle.svg')));
 for(const token of ['one_update_K_mean_variance','exercise2_poles_trace','exercise7_prior_posterior_K_poles','simulation_RMSE_seeds_0_to_4'])assert(dom.text.includes(token),token);
 assert(!dom.text.includes('Traceback (most recent call last)'));
 await page.screenshot({path:'.agent/semester-03/est-03/desktop-'+name+'.png',fullPage:true});
 await page.setViewportSize({width:375,height:812});await page.waitForTimeout(500);
 const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width,JSON.stringify(mobile));
 await page.screenshot({path:'.agent/semester-03/est-03/mobile-'+name+'.png',fullPage:true});
 await page.locator('img[src$="kalman-cycle.svg"]').screenshot({path:'.agent/semester-03/est-03/diagram-mobile-'+name+'.png'});
 await section.screenshot({path:'.agent/semester-03/est-03/explorer-mobile-'+name+'.png'});
 let compatibility;
 if(name==='native'){
  assert.equal(nativeKernelIds.length,3);assert.equal(new Set(nativeKernelIds).size,3);
  const legacy=await page.request.get(url.replace('/estimation/','/modern/'),{maxRedirects:0});
  assert([307,308].includes(legacy.status()));compatibility={status:legacy.status(),location:legacy.headers().location};assert(compatibility.location.endsWith('/estimation/kalman-filter'));
 }else{
  const legacy=await page.request.get(url.replace('/estimation/','/modern/'));assert.equal(legacy.status(),200);
  const html=await legacy.text();assert(html.includes('estimation/kalman-filter'));compatibility={status:200,staticCompatibility:true};
 }
 assert.equal(errors.length,0,errors.join('\n'));assert.equal(consoleErrors.length,0,consoleErrors.join('\n'));
 fs.writeFileSync('.agent/semester-03/est-03/browser-'+name+'.json',JSON.stringify({url,pass:true,gatewayRouting:'native gateway -> isolated 19214',nativeKernelIds,canvasChanged,dom,cases,mobile,compatibility,errors,consoleErrors},null,2));
 console.log('PASS real DOM 12 H2 / original anchors / 6 original cells / 15 controls + reset / SVG / compatibility / 375px / no browser errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
