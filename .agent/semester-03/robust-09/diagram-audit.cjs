const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await b.newPage({viewport:{width:375,height:812}});await p.goto('http://127.0.0.1:20995/control-universe/robust/h-infinity-filter');const img=p.locator('img[src$="h-infinity-filter-signals.svg"]');
 const before=await img.evaluate(i=>({client:i.parentElement.clientWidth,scroll:i.parentElement.scrollWidth,left:i.parentElement.scrollLeft}));assert(before.scroll>before.client);
 await img.locator('..').screenshot({path:'.agent/semester-03/robust-09/diagram-mobile-left.png'});const after=await img.evaluate(i=>{i.parentElement.scrollLeft=i.parentElement.scrollWidth;return i.parentElement.scrollLeft;});assert(after>0);await img.locator('..').screenshot({path:'.agent/semester-03/robust-09/diagram-mobile-right.png'});
 await p.setViewportSize({width:900,height:340});assert.equal((await p.goto('http://127.0.0.1:20995/control-universe/h-infinity-filter-signals.svg')).status(),200);await p.screenshot({path:'.agent/semester-03/robust-09/diagram-full.png'});
 fs.writeFileSync('.agent/semester-03/robust-09/diagram-audit.json',JSON.stringify({pass:true,before,after},null,2));console.log('PASS complete SVG and locally scrollable mobile diagram');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
