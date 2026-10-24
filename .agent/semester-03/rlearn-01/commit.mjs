// Isolate the index, commit only the validated projection, and atomically advance master.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {parseCatalog} from '../../../scripts/lib-catalog.mjs';
const root='D:/Workspace/control-universe',projection='D:/Workspace/control-universe-rank12-rlearn01',dir='.agent/semester-03/rlearn-01/';
let info=JSON.parse(fs.readFileSync(projection+'/'+dir+'commit-projection.json','utf8'));
const git=(args,env={})=>execFileSync('git',args,{cwd:root,env:{...process.env,...env},encoding:'utf8',maxBuffer:16*1024*1024}).trim();
const receipt=process.argv.includes('--receipt');
let base=info.base;
if(git(['rev-parse','HEAD'])!==base){
 const current=git(['rev-parse','HEAD']);const changes=git(['diff','--name-only',base,current]).split('\n').filter(Boolean);
 const protectedPaths=['content/robot-learning/robot-data.mdx','docs/discuss-log/semester-03/18-robot-learning/01-robot-data.md','components/wiki/jupyter-notebook.tsx','components/wiki/browser-notebook.tsx','lib/content.ts','lib/mdx-headings.mjs','public/python-worker.js','next.config.mjs','package.json','package-lock.json'];
 assert(changes.every(p=>!p.startsWith(dir)&&!protectedPaths.includes(p)&&!p.startsWith('scripts/')),'This lesson or its runtime changed; refresh and validate before committing');
 const validatedBase=base;
 execFileSync('node',[root+'/'+dir+'project.mjs'],{cwd:root,stdio:'pipe'});
 info=JSON.parse(fs.readFileSync(projection+'/'+dir+'commit-projection.json','utf8'));base=info.base;
 const proofEnv={...process.env,GIT_DIR:root+'/.git'};
 const outputs=[];
 for(const script of [dir+'audit-projection.mjs','scripts/check-python-support.mjs',dir+'semester-batch.mjs'])outputs.push(execFileSync('node',[script],{cwd:projection,env:proofEnv,encoding:'utf8'}));
 fs.writeFileSync(projection+'/'+dir+'concurrent-rebase.log',outputs.join('\n'));
 fs.writeFileSync(projection+'/'+dir+'concurrent-rebase.json',JSON.stringify({validatedBase,finalBase:base,unrelatedCommittedChanges:changes,lessonAndRuntimeUnchanged:true},null,2)+'\n');
}
assert.equal(git(['rev-parse','HEAD']),base,'master changed; refresh and validate projection before committing');
const paths=receipt?[dir,'.agent/semester-03-checklist.md','.agent/delivery-tracker.md','OUTLINE.md']:info.ownFiles;
if(receipt){
 const delivery=JSON.parse(fs.readFileSync(root+'/'+dir+'delivery-commit.json','utf8'));
 const p='.agent/semester-03-checklist.md';const own='| RLEARN-01 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/18-robot-learning/01-robot-data.md;'+dir+'acceptance.md;commit:'+delivery.hash+' |';
 const latest=git(['show',base+':'+p]).replace(/^\| RLEARN-01 .*$/m,own);fs.writeFileSync(projection+'/'+p,latest+'\n');
 const lessons=parseCatalog(fs.readFileSync(projection+'/content/catalog.ts','utf8')).flatMap(c=>c.lessons);
 const delivered=lessons.filter(l=>l.status==='v1.3').length;
 assert.equal(Number(/已交付 v1\.3\*\*:\s*(\d+)/.exec(fs.readFileSync(projection+'/OUTLINE.md','utf8'))?.[1]),delivered,'Regenerate OUTLINE before receipt');
 assert.equal(Number(/统计\*\*：\s*(\d+)/.exec(fs.readFileSync(projection+'/.agent/delivery-tracker.md','utf8'))?.[1]),delivered,'Regenerate tracker statistics before receipt');
 const audit=execFileSync('node',[dir+'semester-batch.mjs'],{cwd:projection,env:{...process.env,GIT_DIR:root+'/.git'},encoding:'utf8'});
 fs.writeFileSync(projection+'/'+dir+'receipt-semester.log',audit);
}
const initiallyStaged=new Set(git(['diff','--cached','--name-only','--',...paths]).split('\n').filter(Boolean));
const env={GIT_DIR:root+'/.git',GIT_WORK_TREE:projection,GIT_INDEX_FILE:root+'/.git/rlearn12-'+(receipt?'receipt':'delivery')+'.index'};
git(['read-tree',base],env);
git(['add','--',...paths],env);
const changed=git(['diff','--cached','--name-only',base],env).split('\n').filter(Boolean);
for(const file of changed)assert(paths.some(p=>p.endsWith('/')?file.startsWith(p):file===p),'Out of scope: '+file);
if(receipt)assert(changed.every(p=>p.startsWith(dir)||['.agent/semester-03-checklist.md','.agent/delivery-tracker.md','OUTLINE.md'].includes(p)),'Receipt changed a product file');
const stat=git(['diff','--cached','--stat',base],env);
fs.writeFileSync(projection+'/'+dir+(receipt?'receipt-diff.txt':'delivery-diff.txt'),stat+'\n');
// Capture the ordinary index entries; reset only if no concurrent writer changed them.
const indexEntries=()=>new Map(git(['ls-files','-s','--',...changed]).split('\n').filter(Boolean).map(l=>[l.split('\t')[1],l]));
const entries=indexEntries();
const tree=git(['write-tree'],env);
const title=receipt?'docs: record RLEARN-01 master delivery and scoped validation':'feat: deliver RLEARN-01 robot data contracts and causal audits';
const message=root+'/.git/rlearn12-message.txt';fs.writeFileSync(message,title+'\n');
const hash=git(['commit-tree',tree,'-p',base,'-F',message]);
git(['update-ref','-m',title,'refs/heads/master',hash,base]);
const preserved=[],updates=[],currentEntries=indexEntries();
const treeEntries=new Map(git(['ls-tree','-r',hash,'--',...changed]).split('\n').filter(Boolean).map(l=>[l.split('\t')[1],l]));
for(const p of changed){
 if(initiallyStaged.has(p)||currentEntries.get(p)!==entries.get(p)){preserved.push(p);continue;}
 const match=/^(\d+) blob ([a-f0-9]+)\t/.exec(treeEntries.get(p));assert(match,p);
 updates.push(match[1]+' '+match[2]+'\t'+p);
}
if(updates.length)execFileSync('git',['update-index','--index-info'],{cwd:root,env:process.env,input:updates.join('\n')+'\n',encoding:'utf8'});
const result={hash,parent:base,tree,files:changed,concurrentIndexPathsPreserved:preserved};
fs.writeFileSync(root+'/'+dir+(receipt?'receipt-commit.json':'delivery-commit.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
