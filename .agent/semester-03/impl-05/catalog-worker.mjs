/** Private runner for the unchanged catalog CLI. Its existing in-memory
 * renderedHeadings cache survives repeated runs; changed source has a new key.
 * Capture the CLI's real exit status, never replace its predicates.
 */
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
import {createServer} from 'node:http';import {pathToFileURL} from 'node:url';import {format} from 'node:util';
const root='D:/Workspace/control-universe-rank1-impl05-validation';
const evidence='D:/Workspace/control-universe/.agent/semester-03/impl-05';
const deps=['scripts/check-catalog.mjs','scripts/rendered-headings.mjs','scripts/lib-mdx.mjs','scripts/lib-catalog.mjs','lib/mdx-headings.mjs','lib/lesson-compat.mjs','package-lock.json'];
const fingerprint=()=>createHash('sha256').update(deps.map(p=>p+'\n'+fs.readFileSync(path.join(root,p),'utf8')).join('\n')+process.version).digest('hex');
const initial=fingerprint();let runs=0,queue=Promise.resolve();const realExit=process.exit;
class CliExit extends Error{constructor(code){super('catalog CLI exit');this.code=code;}}
async function run(fix){
 if(fingerprint()!==initial)return {restart:true,code:409};
 const output=[],saved={argv:process.argv,exit:process.exit,log:console.log,warn:console.warn,error:console.error};
 let code=0;
 try{
  process.argv=[process.execPath,path.join(root,'scripts/check-catalog.mjs'),'--root',root,...(fix?['--fix-outline','--fix-tracker-stats']:[])];
  console.log=(...a)=>output.push(format(...a));console.warn=console.log;console.error=console.log;
  process.exit=c=>{throw new CliExit(Number(c)||0);};
  await import(pathToFileURL(path.join(root,'scripts/check-catalog.mjs')).href+'?private-run='+ ++runs);
 }catch(e){if(e instanceof CliExit)code=e.code;else{code=1;output.push(e.stack||String(e));}}
 finally{process.argv=saved.argv;process.exit=saved.exit;console.log=saved.log;console.warn=saved.warn;console.error=saved.error;}
 return {code,output:output.join('\n')+'\n',run:runs,pipeline:initial,cache:'unchanged renderedHeadings module, exact source+lesson key'};
}
const server=createServer(async(req,res)=>{
 if(req.headers.origin){res.writeHead(403);res.end();return;}
 if(req.method==='POST'&&req.url==='/close'){res.end('{}');server.close(()=>realExit(0));return;}
 if(req.method!=='POST'||req.url!=='/run'){res.writeHead(404);res.end();return;}
 let raw='';for await(const part of req)raw+=part;
 let body;try{body=JSON.parse(raw);}catch{res.writeHead(400);res.end();return;}
 const job=queue.then(()=>run(body.fix===true));queue=job.catch(()=>{});
 try{const result=await job;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));}
 catch(e){res.writeHead(500);res.end(JSON.stringify({error:String(e)}));}
});
server.listen(0,'127.0.0.1',()=>{
 const info={port:server.address().port,pid:process.pid,pipeline:initial,root,dependencies:deps};
 fs.writeFileSync(path.join(evidence,'catalog-worker.json'),JSON.stringify(info,null,2)+'\n');
 console.log(JSON.stringify(info));
});
