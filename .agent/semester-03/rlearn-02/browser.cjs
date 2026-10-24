const fs=require('fs'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir='.agent/semester-03/rlearn-02/',url='http://127.0.0.1:8203';
const ts=require('typescript'),calc={exports:{}};new Function('exports','module',ts.transpileModule(fs.readFileSync('lib/imitation-learning.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText)(calc.exports,calc);
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 if(process.argv.includes('--audit')){
  await page.goto(url+'/python-expansion.html?lesson=robot-learning%2Fimitation-learning');await page.locator('#run').click();
  await page.waitForFunction(()=>!document.querySelector('#save').disabled,{},{timeout:180000});
  const proof=JSON.parse(await page.locator('#results').textContent());fs.writeFileSync(dir+'pyodide.json',JSON.stringify(proof,null,2)+'\n');assert(proof.complete);assert.equal(proof.totals.enabled,4);
 }else{
  const response=await page.goto(url+'/robot-learning/imitation-learning',{waitUntil:'domcontentloaded',timeout:120000});assert.equal(response.status(),200);
  await page.waitForFunction(()=>document.querySelectorAll('a[href*="#"]').length>=11,{},{timeout:60000});
  const dom=await page.evaluate(()=>({h1:document.querySelectorAll('article h1').length,h2:[...document.querySelectorAll('article h2')].map(h=>({id:h.id,text:h.textContent})),ids:[...document.querySelectorAll('article [id]')].map(h=>h.id),links:[...document.querySelectorAll('a[href*="#"]')].map(a=>a.getAttribute('href')),katex:document.querySelectorAll('.katex-error').length,svg:document.querySelectorAll('article svg[role="img"]').length}));
  assert.equal(dom.h1,1);assert.equal(dom.h2.length,11);assert.equal(dom.katex,0);assert.equal(new Set(dom.ids).size,dom.ids.length);assert.equal(dom.svg,1);
  const hs=JSON.parse(fs.readFileSync(dir+'headings.json','utf8')).h2.map(({id,text})=>({id,text}));assert.deepEqual(dom.h2,hs);
  for(const h of dom.h2)assert(dom.links.some(l=>decodeURIComponent(l.split('#')[1]||'')===h.id),h.id);
  const widget=page.getByRole('region',{name:'模仿策略闭环探索'});const readout=page.getByTestId('imitation-readout');
  const checkReadout=async()=>{const parameters={};for(const[key,label]of [['k','候选反馈系数'],['b','候选动作偏置'],['x0','初始误差']])parameters[key]=Number(await page.getByLabel(label,{exact:true}).inputValue());const expected=calc.exports.imitationRollout(parameters);const text=await readout.innerText();for(const token of [expected.trainMSE.toExponential(6),expected.finalX.toFixed(6),'第 '+expected.lastStep+' 步',expected.expert[expected.lastStep][1].toExponential(6)])assert(text.includes(token),token+' in '+text);return text;};
  const initial=await checkReadout();assert(initial.includes('1.666667e-4'));assert(initial.includes('0.300000'));
  const presets=[];
  for(const[name,expected]of [['反馈可表达','0.000000'],['从窗口内偏离','0.200000'],['错误反馈方向','第 11 步'],['零初值持平','0.000000']]){await widget.getByRole('button',{name,exact:true}).click();const text=await checkReadout();assert(text.includes(expected),name);presets.push({name,text});}
  const endpoints=[];
  for(const[label,values]of [['候选反馈系数',['-0.2','1.5']],['候选动作偏置',['-0.02','0.02']],['初始误差',['-0.5','0.5']]])for(const value of values){await page.getByLabel(label,{exact:true}).evaluate((el,v)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},value);endpoints.push({label,value,text:await checkReadout()});}
  await widget.getByRole('button',{name:'恢复默认',exact:true}).click();assert.equal(await readout.innerText(),initial);
  const books=page.locator('section[data-python-mode="browser"]');assert.equal(await books.count(),4);
  for(let i=0;i<4;i++){await books.nth(i).getByRole('button',{name:'全部运行',exact:true}).click();await books.nth(i).getByRole('status').filter({hasText:'运行完成'}).waitFor({timeout:120000});}
  const text=await page.locator('article').innerText();for(const token of ['constant_train_mse: 0.000066667','first_outside_training_step: 3','after_constant_x20: [-0.35, -0.25, -0.15]','mean_inside_obstacle: True'])assert(text.includes(token),token);
  await widget.screenshot({path:dir+'explorer-desktop.png'});await page.screenshot({path:dir+'desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});await widget.screenshot({path:dir+'explorer-mobile.png'});await page.locator('article svg[role="img"]').screenshot({path:dir+'diagram-mobile.png'});await page.screenshot({path:dir+'mobile.png',fullPage:true});
  const narrow=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,article:document.querySelector('article').getBoundingClientRect().width,svg:document.querySelector('article svg').getBoundingClientRect().width,canvases:[...document.querySelectorAll('article canvas')].map(c=>c.getBoundingClientRect().width)}));
  assert.equal(narrow.client,narrow.scroll);assert(narrow.svg<=narrow.article);assert(narrow.canvases.every(w=>w<=narrow.article));
  fs.writeFileSync(dir+'browser.json',JSON.stringify({dom,initial,presets,endpoints,narrow,text,errors},null,2)+'\n');
 }
 fs.writeFileSync(dir+(process.argv.includes('--audit')?'audit-errors.json':'page-errors.json'),JSON.stringify(errors,null,2)+'\n');assert.deepEqual(errors,[]);await browser.close();console.log('PASS browser '+process.argv.slice(2).join(' '));
})().catch(e=>{console.error(e);process.exit(1)});
