const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],consoleErrors=[],nativeKernelIds=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 page.on('request',req=>{if(/:(8891|8981)\/api\/notebook$/.test(req.url())&&req.method()==='POST')nativeKernelIds.push(req.postDataJSON().notebook_id)});
 await page.route(/http:\/\/127\.0\.0\.1:(8891|8981)\//,route=>route.continue({url:route.request().url().replace(/:(8891|8981)\//,':19846/')}));
 const url=process.env.EST06_PAGE_URL||'http://127.0.0.1:19646/estimation/particle-filter',name=process.env.EST06_AUDIT_NAME||'native';
 const response=await page.goto(url);assert.equal(response.status(),200);
 const section=page.getByRole('region',{name:'粒子权重与重采样探索'});await section.getByRole('button',{name:'恢复默认'}).waitFor();
 const readout=page.getByTestId('particle-readout');assert((await readout.textContent()).includes('方差 3.967039、ESS 2.044431'));
 const initialCanvas=await section.locator('canvas').screenshot();let canvasChanged=false;
 const refs=JSON.parse(fs.readFileSync('.agent/semester-03/est-06/reference-controls.json','utf8')),cases=[];
 const show=v=>Math.abs(v)<.0000005?'0.000000':v.toFixed(6);
 for(const r of refs){
  await section.getByLabel('先验模式',{exact:true}).selectOption(r.mode);
  if(r.mode==='gaussian')for(const [label,value]of [['高斯粒子数',r.count],['先验均值',r.mu],['随机种子',r.seed]])await section.getByLabel(label,{exact:true}).selectOption(String(value));
  else for(const label of ['高斯粒子数','先验均值','随机种子'])assert(await section.getByLabel(label,{exact:true}).isDisabled());
  for(const [label,value]of [['测量噪声方差',r.noise],['本拍读数',r.observation]])await section.getByLabel(label,{exact:true}).selectOption(String(value));
  const b=r.before,a=r.after,ref=r.reference,text=await readout.textContent();
  assert.equal(text,`加权均值 ${show(b.mean)}、方差 ${show(b.variance)}、ESS ${show(b.ess)}、负分支 ${show(b.negativeMass)}；重采样均值 ${show(a.mean)}、方差 ${show(a.variance)}、ESS ${show(a.ess)}、不同祖先 ${r.uniqueAncestors}；参考均值 ${show(ref.mean)}、方差 ${show(ref.variance)}。`);
  if(cases.length===0){const changed=await section.locator('canvas').screenshot({path:'.agent/semester-03/est-06/curve-boundary-'+name+'.png'});canvasChanged=!initialCanvas.equals(changed);assert(canvasChanged);}
  cases.push({mode:r.mode,n:r.count,mu:r.mu,r:r.noise,z:r.observation,seed:r.seed,text});
 }
 await section.getByRole('button',{name:'恢复默认'}).click();assert((await readout.textContent()).includes('方差 3.967039、ESS 2.044431'));
 assert.equal(await section.locator('canvas').count(),1);
 await page.waitForFunction(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('全部运行')).length===3,{},{timeout:180000});
 const buttons=page.getByRole('button',{name:/全部运行/});
 for(const [i,token]of ['hand_resampling_checks_passed','multi_seed_checks_passed','sequential_filter_checks_passed'].entries()){
  await buttons.nth(i).click();await page.waitForFunction(t=>document.body.innerText.includes(t),token,{timeout:240000});
 }
 const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0})),text:document.body.innerText}));
 assert.equal(dom.h1,1);assert.equal(dom.h2.length,10);assert.equal(dom.katexErrors,0);assert.equal(new Set(dom.ids).size,dom.ids.length);for(const href of dom.links)assert(dom.ids.includes(decodeURIComponent(href.slice(1))),href);
 const expected=JSON.parse(fs.readFileSync('.agent/semester-03/est-06/reconciliation.json','utf8')).headings.h2;assert.deepEqual(dom.h2,expected.map(h=>({id:h.id,text:h.text})));
 assert(dom.images.some(x=>x.loaded&&x.src.endsWith('particle-resampling.svg')));
 for(const token of ['four_particles_weights','invalid_likelihood_rejected','multi_seed_count','sequential_grid_steps_max_difference_last'])assert(dom.text.includes(token),token);
 assert(!dom.text.includes('Traceback (most recent call last)'));
 if(name==='native'){assert.equal(nativeKernelIds.length,3);assert.equal(new Set(nativeKernelIds).size,3);}
 await page.screenshot({path:'.agent/semester-03/est-06/desktop-'+name+'.png',fullPage:true});
 await page.setViewportSize({width:375,height:812});await page.waitForTimeout(500);
 const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=mobile.width,JSON.stringify(mobile));
 await page.screenshot({path:'.agent/semester-03/est-06/mobile-'+name+'.png',fullPage:true});
 await page.locator('img[src$="particle-resampling.svg"]').screenshot({path:'.agent/semester-03/est-06/diagram-mobile-'+name+'.png'});await section.screenshot({path:'.agent/semester-03/est-06/explorer-mobile-'+name+'.png'});
 assert.equal(errors.length,0,errors.join('\n'));assert.equal(consoleErrors.length,0,consoleErrors.join('\n'));
 fs.writeFileSync('.agent/semester-03/est-06/browser-'+name+'.json',JSON.stringify({url,pass:true,gatewayRouting:'8891/8981 -> isolated19846',nativeKernelIds,canvasChanged,dom,cases,mobile,errors,consoleErrors},null,2));
 console.log('PASS 10 exact DOM headings / 6 original cells / 114 controls + reset + redraw / SVG / 375px / no browser errors');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
