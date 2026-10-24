const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],consoleErrors=[],nativeKernelIds=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 page.on('request',req=>{if(/:(8891|8981)\/api\/notebook$/.test(req.url())&&req.method()==='POST')nativeKernelIds.push(req.postDataJSON().notebook_id)});
 await page.route(/http:\/\/127\.0\.0\.1:(8891|8981)\//,route=>route.continue({url:route.request().url().replace(/:(8891|8981)\//,':19874/')}));
 const url=process.env.EST07_PAGE_URL||'http://127.0.0.1:19674/estimation/sensor-fusion',name=process.env.EST07_AUDIT_NAME||'native';
 const response=await page.goto(url);assert.equal(response.status(),200);
 const section=page.getByRole('region',{name:'相关噪声融合探索'});await section.getByRole('button',{name:'恢复默认'}).waitFor();
 const readout=page.getByTestId('fusion-readout');assert((await readout.textContent()).includes('完整模型均值 1.833333、方差 0.666667'));
 const initialCanvas=await section.locator('canvas').screenshot();let canvasChanged=false;
 const refs=JSON.parse(fs.readFileSync('.agent/semester-03/est-07/reference-controls.json','utf8')),cases=[];
 const show=v=>Math.abs(v)<.0000005?'0.000000':v.toFixed(6);
 for(const r of refs){
  for(const [label,value]of [['先验方差',r.prior],['第二路噪声方差',r.secondVariance],['噪声相关系数',r.correlation],['第一路读数',r.firstReading],['第二路读数',r.secondReading]])await section.getByLabel(label,{exact:true}).selectOption(String(value));
  const text=await readout.textContent(),singleVariance=r.prior/(r.prior+1);
  assert.equal(text,`完整模型均值 ${show(r.mean)}、方差 ${show(r.variance)}、实际MSE ${show(r.variance)}；错误独立模型均值 ${show(r.naiveMean)}、报告方差 ${show(r.naiveVariance)}、实际MSE ${show(r.naiveActualMse)}；单路均值 ${show(singleVariance*r.firstReading)}、方差 ${show(singleVariance)}。`);
  assert((await page.getByTestId('fusion-whitening').textContent()).startsWith(`白化顺序均值 ${show(r.mean)}、方差 ${show(r.variance)}；逆序均值 ${show(r.mean)}、方差 ${show(r.variance)}`));
  if(cases.length===0){const changed=await section.locator('canvas').screenshot({path:'.agent/semester-03/est-07/curve-boundary-'+name+'.png'});canvasChanged=!initialCanvas.equals(changed);assert(canvasChanged);}
  cases.push({...r,text});
 }
 await section.getByRole('button',{name:'恢复默认'}).click();assert((await readout.textContent()).includes('完整模型均值 1.833333、方差 0.666667'));
 assert.equal(await section.locator('canvas').count(),1);
 await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===3,{},{timeout:180000});
 const buttons=page.getByRole('button',{name:/全部运行/});
 for(const [i,token]of ['joint_whitening_checks_passed','shared_information_checks_passed','alignment_nonlinear_checks_passed'].entries()){
  await buttons.nth(i).click();await page.waitForFunction(t=>document.body.innerText.includes(t),token,{timeout:240000});
 }
 const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
 assert.equal(dom.h1,1);assert.equal(dom.h2.length,10);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))),href);
 const expected=JSON.parse(fs.readFileSync('.agent/semester-03/est-07/reconciliation.json','utf8')).headings.h2;assert.deepEqual(dom.h2,expected.map(h=>({id:h.id,text:h.text})));
 assert(dom.images.some(x=>x.loaded&&x.src.endsWith('sensor-information.svg')));
 for(const token of ['joint_whitened_64_cases_max_difference','track_naive_mean_P_actualMSE','scalar_variance_objective_best_P_omega','nonlinear_same_point_batch_mean_P'])assert(dom.text.includes(token),token);
 assert(!dom.text.includes('Traceback (most recent call last)'));
 if(name==='native'){assert.equal(nativeKernelIds.length,3);assert.equal(new Set(nativeKernelIds).size,3);}
 await page.screenshot({path:'.agent/semester-03/est-07/desktop-'+name+'.png',fullPage:true});
 await page.setViewportSize({width:375,height:812});await page.waitForTimeout(500);
 const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width,JSON.stringify(mobile));
 await page.screenshot({path:'.agent/semester-03/est-07/mobile-'+name+'.png',fullPage:true});
 await page.locator('img[src$="sensor-information.svg"]').screenshot({path:'.agent/semester-03/est-07/diagram-mobile-'+name+'.png'});await section.screenshot({path:'.agent/semester-03/est-07/explorer-mobile-'+name+'.png'});
 assert.equal(errors.length,0,errors.join('\n'));assert.equal(consoleErrors.length,0,consoleErrors.join('\n'));
 fs.writeFileSync('.agent/semester-03/est-07/browser-'+name+'.json',JSON.stringify({url,pass:true,gatewayRouting:'8891/8981 -> isolated19874',nativeKernelIds,canvasChanged,dom,cases,mobile,errors,consoleErrors},null,2));
 console.log('PASS 10 exact DOM headings / 6 original cells / 64 controls + reset + redraw / SVG / 375px / no browser errors');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
