const {chromium}=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await b.newPage({viewport:{width:1280,height:900}});await p.goto('http://127.0.0.1:20195/robust/mu-analysis');const i=p.locator('img[src$="mu-analysis-feedback.svg"]');
 await i.screenshot({path:'.agent/semester-03/robust-07/diagram-desktop.png'});await p.setViewportSize({width:375,height:812});await i.screenshot({path:'.agent/semester-03/robust-07/diagram-mobile.png'});
 console.log('PASS rendered SVG desktop/mobile captured for visual review');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
