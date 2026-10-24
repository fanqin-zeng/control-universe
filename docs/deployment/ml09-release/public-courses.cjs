const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const root='D:/Workspace/control-universe-rank2-ml-pages',dir=__dirname+'/',base='https://fanqin-zeng.github.io/control-universe';
 const {parseCatalog}=await import('file:///'+root+'/scripts/lib-catalog.mjs');
 const {renderedHeadings}=await import('file:///'+root+'/scripts/rendered-headings.mjs');
 const lessons=parseCatalog(fs.readFileSync(root+'/content/catalog.ts','utf8')).find(ch=>ch.slug==='machine-learning').lessons;
 const policy=JSON.parse(fs.readFileSync(root+'/lib/python-support.json','utf8'));
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1280,height:900}});
 let errors=[],consoleErrors=[],localRequests=[],rows=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});page.on('request',r=>{if(/https?:\/\/(127\.0\.0\.1|localhost)/.test(r.url()))localRequests.push(r.url())});
 try{for(const lesson of lessons){
  errors=[];consoleErrors=[];const key='machine-learning/'+lesson.slug,entries=policy.lessons[key].notebooks;
  assert(entries.every(n=>n.status==='enabled'));assert.equal((await page.goto(base+'/'+key+'/',{timeout:120000})).status(),200);
  const notebooks=page.locator('section[data-python-mode="browser"]');await notebooks.first().getByRole('button',{name:'全部运行',exact:true}).waitFor({timeout:120000});assert.equal(await notebooks.count(),entries.length);
  const outputs=[];
  for(let i=0;i<entries.length;i++){
   const section=notebooks.nth(i);await section.getByRole('button',{name:'全部运行',exact:true}).click();
   await page.waitForFunction(idx=>{const s=document.querySelectorAll('section[data-python-mode="browser"]')[idx]?.querySelector('[role="status"]')?.textContent;return s&&!s.startsWith('正在运行')},i,{timeout:240000});
   assert.equal(await section.getByRole('status').textContent(),'运行完成');assert(!(await section.innerText()).includes('Traceback (most recent call last)'));
   const cells=[];for(let c=0;c<entries[i].cells;c++){const output=section.getByLabel('输出 '+(c+1),{exact:true});const text=await output.innerText();assert(text.trim().length>0||await output.locator('img').count()>0);cells.push(text)}outputs.push({title:entries[i].title,cells});
   console.log('Executed',key,i+1+'/'+entries.length);
  }
  await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0),{},{timeout:60000});
  const dom=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,h2:[...document.querySelectorAll('h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')),katexErrors:document.querySelectorAll('.katex-error').length,images:[...document.images].map(x=>({src:x.getAttribute('src'),loaded:x.complete&&x.naturalWidth>0}))}));
  const expected=await renderedHeadings(fs.readFileSync(root+'/content/'+key+'.mdx','utf8'),key);assert.equal(dom.h1,1);assert.deepEqual(dom.h2,expected.h2.map(h=>({id:h.id,text:h.text})));assert.equal(new Set(dom.ids).size,dom.ids.length);assert.equal(dom.katexErrors,0);for(const h of dom.links)assert(dom.ids.includes(decodeURIComponent(h.slice(1))));assert(dom.images.every(i=>i.loaded));
  if(lesson.slug==='learning-evaluation'){
   const controlRows=JSON.parse(fs.readFileSync(root+'/.agent/semester-03/ml-09/controls.json','utf8')),actual=[];
   for(const row of controlRows){await page.getByLabel('漏检代价',{exact:true}).selectOption(String(row.config.cfn));await page.getByLabel('测试工况',{exact:true}).selectOption(row.config.scenario);await page.getByLabel('阈值策略',{exact:true}).selectOption(row.config.policy);await page.waitForFunction(expected=>document.querySelector('[data-evaluation-readout]')?.textContent===expected,row.text);actual.push({config:row.config,text:await page.locator('[data-evaluation-readout]').textContent()})}
   await page.getByRole('button',{name:'恢复默认',exact:true}).click();assert.equal(await page.locator('[data-evaluation-readout]').textContent(),controlRows[0].text);fs.writeFileSync(dir+'public-controls.json',JSON.stringify({pass:true,states:actual.length,rows:actual},null,2));
  }
  await page.setViewportSize({width:375,height:812});await page.waitForTimeout(300);const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(mobile.scroll<=375);
  if(lesson.slug==='learning-evaluation'){await page.getByRole('region',{name:'学习实验评估',exact:true}).screenshot({path:dir+'public-ml09-mobile.png'});await page.screenshot({path:dir+'public-ml09-page.png'})}
  await page.setViewportSize({width:1280,height:900});assert.equal(errors.length,0,errors.join('\n'));assert.equal(consoleErrors.length,0,consoleErrors.join('\n'));
  rows.push({key,url:page.url(),notebooks:entries.length,cells:entries.reduce((n,e)=>n+e.cells,0),outputs,dom,mobile,errors:[...errors],consoleErrors:[...consoleErrors]});fs.writeFileSync(dir+'public-courses.json',JSON.stringify({pass:false,completed:rows.length,rows,localRequests},null,2));console.log('PASS',key);
 }
 assert.equal(rows.length,9);assert.equal(localRequests.length,0);const result={pass:true,completed:rows.length,notebooks:rows.reduce((n,r)=>n+r.notebooks,0),cells:rows.reduce((n,r)=>n+r.cells,0),rows,localRequests};fs.writeFileSync(dir+'public-courses.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,rows:rows.length}));
 }catch(e){fs.writeFileSync(dir+'public-browser-failure.json',JSON.stringify({error:String(e),completed:rows.length,text:await page.locator('body').innerText().catch(()=>''),errors,consoleErrors,localRequests},null,2));throw e}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
