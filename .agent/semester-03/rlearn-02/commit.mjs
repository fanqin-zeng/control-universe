// Commit the verified projection with a private index; never reset the shared index.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root='D:/Workspace/control-universe',target='D:/Workspace/control-universe-rank12-rlearn02',dir='.agent/semester-03/rlearn-02/';
const info=JSON.parse(fs.readFileSync(target+'/'+dir+'projection.json','utf8'));
const git=(args,extra={})=>execFileSync('git',args,{cwd:root,env:{...process.env,...extra},encoding:'utf8',maxBuffer:64*1024*1024}).trim();
assert.equal(git(['symbolic-ref','--short','HEAD']),'master');
assert.equal(git(['rev-parse','HEAD']),info.base,'Refresh projection and check the current committed combination first');
const receipt=process.argv.includes('--receipt');
const paths=receipt?[dir,'.agent/semester-03-checklist.md']:[...info.files,...info.shared,dir];
const env={GIT_DIR:root+'/.git',GIT_WORK_TREE:target,GIT_INDEX_FILE:root+'/.git/rlearn02-'+(receipt?'receipt':'delivery')+'.index'};
git(['read-tree',info.base],env);
git(['add','--',...paths],env);
const changed=git(['diff','--cached','--name-only',info.base],env).split('\n').filter(Boolean);
assert(changed.length);
for(const p of changed)assert(paths.some(a=>a.endsWith('/')?p.startsWith(a):p===a),'Out of scope: '+p);
const stat=git(['diff','--cached','--stat',info.base],env);
fs.writeFileSync(root+'/'+dir+(receipt?'receipt-diff.txt':'delivery-diff.txt'),stat+'\n');
const staged=new Set(git(['diff','--cached','--name-only','--',...changed]).split('\n').filter(Boolean));
const entries=()=>new Map(git(['ls-files','-s','--',...changed]).split('\n').filter(Boolean).map(l=>[l.split('\t')[1],l]));
const oldEntries=entries();
const tree=git(['write-tree'],env);
const title=receipt?'docs: record RLEARN-02 master delivery and acceptance':'feat: deliver RLEARN-02 imitation learning and closed-loop experiments';
const message=root+'/.git/rlearn02-message.txt';fs.writeFileSync(message,title+'\n');
const hash=git(['commit-tree',tree,'-p',info.base,'-F',message]);
git(['update-ref','-m',title,'refs/heads/master',hash,info.base]);
const preserved=[],updates=[],now=entries();
const treeEntries=new Map(git(['ls-tree','-r',hash,'--',...changed]).split('\n').filter(Boolean).map(l=>[l.split('\t')[1],l]));
for(const p of changed){
 if(staged.has(p)||now.get(p)!==oldEntries.get(p)){preserved.push(p);continue;}
 const m=/^(\d+) blob ([a-f0-9]+)\t/.exec(treeEntries.get(p));assert(m,p);updates.push(m[1]+' '+m[2]+'\t'+p);
}
if(updates.length)execFileSync('git',['update-index','--index-info'],{cwd:root,input:updates.join('\n')+'\n',encoding:'utf8'});
const result={hash,parent:info.base,tree,files:changed,concurrentIndexPathsPreserved:preserved};
fs.writeFileSync(root+'/'+dir+(receipt?'receipt-commit.json':'delivery-commit.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
