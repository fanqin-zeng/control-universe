const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage({viewport:{width:375,height:812}});
 await page.goto('http://127.0.0.1:18494/control-universe/estimation/estimation-problem/');
 await page.locator('img[src$="predict-correct.svg"]').screenshot({path:'.agent/semester-03/est-01/diagram-mobile.png'});
 await page.getByRole('region',{name:'标量估计修正探索'}).screenshot({path:'.agent/semester-03/est-01/explorer-mobile.png'});
 console.log('PASS mobile diagram and explorer screenshots');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
