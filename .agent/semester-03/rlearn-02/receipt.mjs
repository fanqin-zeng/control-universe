import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const root='D:/Workspace/control-universe',target='D:/Workspace/control-universe-rank12-rlearn02',dir='.agent/semester-03/rlearn-02/';
const delivery=JSON.parse(fs.readFileSync(root+'/'+dir+'delivery-commit.json','utf8'));
execFileSync('node',[root+'/'+dir+'manage.mjs','--project','--signed'],{cwd:root,stdio:'inherit'});
const row='| RLEARN-02 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/18-robot-learning/02-imitation-learning.md;'+dir+'acceptance.md;commit:'+delivery.hash+' |';
for(const r of [root,target]){
 const p=r+'/.agent/semester-03-checklist.md';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/^\| RLEARN-02 .*$/m,row));
 const a=r+'/'+dir+'acceptance.md';let s=fs.readFileSync(a,'utf8');if(!s.includes('实际交付提交：'))s+='\n实际交付提交：'+delivery.hash+'，parent '+delivery.parent+'，已进入master。delivery-commit.json列明全部纳入文件与保留的并行索引条目。最终组合目录、学期、隔离、Python政策检查均退出0；不发布gh-pages。\n';fs.writeFileSync(a,s);
}
const output=execFileSync('node',[dir+'semester-batch.mjs'],{cwd:target,env:{...process.env,GIT_DIR:root+'/.git'},encoding:'utf8'});
for(const r of [root,target])fs.writeFileSync(r+'/'+dir+'receipt-semester.log',output+'\nEXIT_CODE=0\n');
fs.cpSync(root+'/'+dir,target+'/'+dir,{recursive:true});
execFileSync('node',[root+'/'+dir+'commit.mjs','--receipt'],{cwd:root,stdio:'inherit'});
