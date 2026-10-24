import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root='D:/Workspace/control-universe',target='D:/Workspace/control-universe-rank12-rlearn02',dir='.agent/semester-03/rlearn-02/';
const git=(...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',maxBuffer:64*1024*1024}).trim();
const sync=()=>{for(const n of fs.readdirSync(target+'/'+dir))if(/\.(json|log|png)$/.test(n)&&n!=='pyodide-before-terms.json'&&!/^deliver.*\.log$/.test(n))fs.copyFileSync(target+'/'+dir+n,root+'/'+dir+n);fs.cpSync(root+'/'+dir,target+'/'+dir,{recursive:true,filter:p=>!/^deliver.*\.log$/.test(p.split(/[\\/]/).at(-1))});};
const run=(args,name,allow=false)=>{let out='',code=0;try{out=execFileSync('node',args,{cwd:target,env:{...process.env,GIT_DIR:root+'/.git'},encoding:'utf8',maxBuffer:64*1024*1024});}catch(e){code=e.status;out=(e.stdout||'')+'\n'+(e.stderr||'');}fs.writeFileSync(target+'/'+dir+name,out+'\nEXIT_CODE='+code+'\n');if(code&&!allow)throw Error(name+' failed');};
for(let attempt=1;attempt<=5;attempt++){
 const old=JSON.parse(fs.readFileSync(target+'/'+dir+'projection.json','utf8')).base,head=git('rev-parse','HEAD');
 const delta=git('diff','--name-only','4ed302698915b30c3228a60753bb450d13cf56ed',head).split('\n').filter(Boolean);
 const runtime=['next.config.mjs','package.json','package-lock.json','public/python-worker.js','lib/content.ts','lib/mdx-headings.mjs','components/wiki/jupyter-notebook.tsx','components/wiki/browser-notebook.tsx','components/wiki/use-echarts.ts'];
 assert(delta.every(p=>!runtime.includes(p)&&!['content/robot-learning/imitation-learning.mdx','lib/imitation-learning.ts','components/wiki/imitation-learning-explorer.tsx'].includes(p)),'Lesson/runtime changed since full build; revalidate before commit');
 sync();
 execFileSync('node',[root+'/'+dir+'manage.mjs','--project','--signed'],{cwd:root,stdio:'inherit'});
 const info=JSON.parse(fs.readFileSync(target+'/'+dir+'projection.json','utf8'));
 fs.writeFileSync(root+'/'+dir+'build-origin.json',JSON.stringify({buildBase:'4ed302698915b30c3228a60753bb450d13cf56ed',finalCombinationBase:info.base,otherCommittedChanges:delta,lessonAndSharedRuntimeUnchanged:true,fullBuildAtFinalCombination:false,scope:'Final catalog, policy, semester, projection checks refreshed after other course commits; full browser-mode build and production browser checks at buildBase with this lesson.'},null,2)+'\n');
 fs.copyFileSync(root+'/'+dir+'build-origin.json',target+'/'+dir+'build-origin.json');
 run(['scripts/check-catalog.mjs','--fix-outline','--fix-tracker-stats'],'check-final-refresh.log',true);
 run(['scripts/check-catalog.mjs'],'check-final.log');
 run([dir+'audit-projection.mjs'],'audit-final.log');
 run([dir+'semester-batch.mjs'],'semester-final.log');
 run(['scripts/check-python-support.mjs'],'python-policy-final.log');
 if(git('rev-parse','HEAD')!==info.base){console.log('Concurrent master advanced during checks; refresh '+attempt);continue;}
 const a=root+'/'+dir+'acceptance.md';let s=fs.readFileSync(a,'utf8');s+='\n最终组合检查基线：'+info.base+'；check-final.log、semester-final.log、audit-final.log、python-policy-final.log均exit0。完整构建仍以build-origin.json列出的4ed3026组合为准；后续并行课内容未冒称重构建，本课正文/共享运行时未变。\n';fs.writeFileSync(a,s);
 sync();
 // sync starts with target evidence, so restore the just-updated prose explicitly.
 fs.copyFileSync(a,target+'/'+dir+'acceptance.md');
 execFileSync('node',[root+'/'+dir+'commit.mjs'],{cwd:root,stdio:'inherit'});
 console.log('PASS exact scoped delivery committed');process.exit(0);
}
throw Error('Master advanced in all five attempts; no out-of-date combination committed');
