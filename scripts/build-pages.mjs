import {spawnSync,execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {lessonRedirects} from '../lib/lesson-compat.mjs';
const require=createRequire(import.meta.url);
const base=process.env.NEXT_PUBLIC_BASE_PATH || '/control-universe';
const prepare=spawnSync(process.execPath,['scripts/prepare-pyodide.mjs'],{stdio:'inherit'});
if(prepare.status!==0)process.exit(prepare.status??1);
if(!/^\/[a-zA-Z0-9_-]+$/.test(base))throw Error('Pages basePath must be one repository segment');
const run=spawnSync(process.execPath,[require.resolve('next/dist/bin/next'),'build'],{stdio:'inherit',env:{...process.env,PAGES_BUILD:'1',NEXT_PUBLIC_BASE_PATH:base,NEXT_PUBLIC_STATIC_EXPORT:'true'}});
if(run.status!==0)process.exit(run.status??1);
for(const [old,target] of lessonRedirects){
  const destination=base+'/'+target+'/';
  const directory=resolve('out',old);mkdirSync(directory,{recursive:true});
  writeFileSync(resolve(directory,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>课程地址已更新</title><link rel="canonical" href="${destination}"><meta http-equiv="refresh" content="0;url=${destination}"><script>location.replace(${JSON.stringify(destination)}+location.search+location.hash)</script><body><a href="${destination}">打开课程新地址</a></body></html>`);
}
writeFileSync('out/.nojekyll','');
writeFileSync('out/release.json',JSON.stringify({sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),basePath:base,pythonExecution:'browser-verified-notebooks',pyodide:'0.27.7',sourceDirty:execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim().length>0,builtAt:new Date().toISOString()},null,2));
const verify=spawnSync(process.execPath,['scripts/verify-pages.mjs'],{stdio:'inherit',env:{...process.env,NEXT_PUBLIC_BASE_PATH:base}});process.exitCode=verify.status??1;
