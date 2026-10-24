// Build a reviewable HEAD + RLEARN-01 projection, preserving every other committed lesson.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const source='D:/Workspace/control-universe',target='D:/Workspace/control-universe-rank12-rlearn01';
const base='9c11c8b7567cb959a4ebca16d7f1360b9f6c6c81',dir='.agent/semester-03/rlearn-01/',key='robot-learning/robot-data';
const git=(...args)=>execFileSync('git',['-C',source,...args],{maxBuffer:32*1024*1024});
const head=git('rev-parse','HEAD').toString().trim();
const put=(p,v)=>{fs.mkdirSync(path.dirname(target+'/'+p),{recursive:true});fs.writeFileSync(target+'/'+p,v);};
const previousPath=target+'/'+dir+'commit-projection.json';
const previous=fs.existsSync(previousPath)?JSON.parse(fs.readFileSync(previousPath,'utf8')).base:base;
const changed=git('diff','--name-only',previous,head).toString().trim().split(/\r?\n/).filter(Boolean);
if(changed.length){
 const delta=source+'/.git/rlearn12-delta.tar';
 fs.writeFileSync(delta,execFileSync('git',['-C',source,'archive','--format=tar',head,...changed],{maxBuffer:128*1024*1024}));
 execFileSync('tar',['-xf',delta,'-C',target]);
}
const read=(root,p)=>fs.readFileSync(root+'/'+p,'utf8').replace(/\r\n/g,'\n');
let catalog=git('show',head+':content/catalog.ts').toString().replace(/\r\n/g,'\n');
const block=text=>{const a=text.indexOf('      {\n        "slug": "robot-data"'),b=text.indexOf('      {\n        "slug": "imitation-learning"',a);if(a<0||b<0)throw Error('block absent');return[a,b];};
const ownCatalog=read(source,'content/catalog.ts');const[a,b]=block(catalog),[x,y]=block(ownCatalog);
put('content/catalog.ts',catalog.slice(0,a)+ownCatalog.slice(x,y)+catalog.slice(b));
for(const[p,prefix]of [['.agent/delivery-tracker.md','| [x] 机器人数据 (robot-data)'],['.agent/semester-03-checklist.md','| RLEARN-01 |']]){
 let text=git('show',head+':'+p).toString().replace(/\r\n/g,'\n');const own=read(source,p).split('\n').find(l=>l.startsWith(prefix));if(!own)throw Error(p);
 text=text.replace(p.includes('tracker')?/^\| \[[ x]\] 机器人数据 \(robot-data\).*$/m:/^\| RLEARN-01 .*$/m,own);put(p,text);
}
let plan=git('show',head+':.agent/semester-03-plan.md').toString();
const exception=read(source,'.agent/semester-03-plan.md').split('\n').find(l=>l.startsWith('| RLEARN-01 |')&&l.includes('用户'));
if(!plan.includes(exception))plan=plan.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',exception+'\n<!-- S3-ORDER-EXCEPTIONS-END -->');put('.agent/semester-03-plan.md',plan);
const proof=JSON.parse(read(source,dir+'pyodide.json')),lesson=proof.lessons.find(l=>l.key===key);
const policy=JSON.parse(git('show',head+':lib/python-support.json'));policy.lessons[key]=JSON.parse(read(source,'lib/python-support.json')).lessons[key];put('lib/python-support.json',JSON.stringify(policy,null,2)+'\n');
const report=JSON.parse(git('show',head+':docs/deployment/python-expansion-local.json'));
report.lessons=report.lessons.filter(l=>l.key!==key).concat(lesson);report.provenance=[...(report.provenance||[]),{testedAt:proof.testedAt,url:proof.url,inputPath:dir+'pyodide.json'}];
report.totals={lessons:report.lessons.length,notebooks:report.lessons.reduce((s,l)=>s+l.notebooks.length,0),enabled:report.lessons.reduce((s,l)=>s+l.notebooks.filter(n=>n.status==='passed').length,0),codeOnly:report.lessons.reduce((s,l)=>s+l.notebooks.filter(n=>n.status==='code').length,0)};
report.releaseTotals={lessons:Object.keys(policy.lessons).length,notebooks:Object.values(policy.lessons).reduce((s,l)=>s+l.notebooks.length,0),enabled:Object.values(policy.lessons).reduce((s,l)=>s+l.notebooks.filter(n=>n.status==='enabled').length,0),codeOnly:Object.values(policy.lessons).reduce((s,l)=>s+l.notebooks.filter(n=>n.status==='code').length,0)};
put('docs/deployment/python-expansion-local.json',JSON.stringify(report,null,2)+'\n');
for(const p of ['content/'+key+'.mdx','docs/discuss-log/semester-03/18-robot-learning/01-robot-data.md'])put(p,fs.readFileSync(source+'/'+p));
fs.cpSync(source+'/'+dir,target+'/'+dir,{recursive:true,filter:p=>fs.statSync(p).isDirectory()||/\.(md|mjs|cjs|py)$/.test(p)});
const info={base:head,initial:base,ownFiles:['content/'+key+'.mdx','docs/discuss-log/semester-03/18-robot-learning/01-robot-data.md',dir,'.agent/delivery-tracker.md','.agent/semester-03-checklist.md','.agent/semester-03-plan.md','content/catalog.ts','OUTLINE.md','lib/python-support.json','docs/deployment/python-expansion-local.json']};
put(dir+'commit-projection.json',JSON.stringify(info,null,2)+'\n');fs.writeFileSync(source+'/'+dir+'commit-projection.json',JSON.stringify(info,null,2)+'\n');
console.log(JSON.stringify(info));
