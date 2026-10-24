import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const root='D:/Workspace/control-universe',target='D:/Workspace/control-universe-rank12-rlearn02',dir='.agent/semester-03/rlearn-02/',key='robot-learning/imitation-learning',id='RLEARN-02',log='docs/discuss-log/semester-03/18-robot-learning/02-imitation-learning.md';
const files=['content/'+key+'.mdx','components/wiki/imitation-learning-explorer.tsx','lib/imitation-learning.ts',log];
const shared=['content/catalog.ts','lib/wiki-components.ts','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/delivery-tracker.md','OUTLINE.md','lib/python-support.json','docs/deployment/python-expansion-local.json','docs/semester-02/03-glossary.md'];
const git=(...args)=>execFileSync('git',['-C',root,...args],{maxBuffer:128*1024*1024});
const read=(r,p)=>fs.readFileSync(r+'/'+p,'utf8').replace(/\r\n/g,'\n');
const write=(r,p,s)=>{fs.mkdirSync(path.dirname(r+'/'+p),{recursive:true});fs.writeFileSync(r+'/'+p,s);};
const infoPath=target+'/'+dir+'projection.json';
const project=process.argv.includes('--project'),signed=process.argv.includes('--signed'),candidate=process.argv.includes('--candidate');
if(project){
 const head=git('rev-parse','HEAD').toString().trim();
 const previous=fs.existsSync(infoPath)?JSON.parse(fs.readFileSync(infoPath,'utf8')).base:read(root,dir+'base-commit.txt').trim();
 const changed=git('diff','--name-only',previous,head).toString().trim().split('\n').filter(Boolean);
 if(changed.length){const archive=root+'/.git/rlearn02-delta.tar';fs.writeFileSync(archive,git('archive','--format=tar',head,...changed));execFileSync('tar',['-xf',archive,'-C',target]);}
 // Shared files always start from committed HEAD; working-tree changes of other sessions stay out.
 for(const p of shared)write(target,p,git('show',head+':'+p));
 for(const p of files)write(target,p,fs.readFileSync(root+'/'+p));
 fs.cpSync(root+'/'+dir,target+'/'+dir,{recursive:true,filter:p=>fs.statSync(p).isDirectory()||/\.(mjs|cjs|py|md|txt)$/.test(p)});
 const info={base:head,initial:read(root,dir+'base-commit.txt').trim(),files,shared,dir,id,key,log};
 write(target,dir+'projection.json',JSON.stringify(info,null,2)+'\n');write(root,dir+'projection.json',JSON.stringify(info,null,2)+'\n');
}
const destination=process.argv.includes('--main')?root:target;
if(candidate&&destination===root)throw Error('Candidate state belongs only to isolated validation');
const source=read(destination,'content/'+key+'.mdx');const hs=await renderedHeadings(source,key);
write(destination,dir+'headings.json',JSON.stringify(hs,null,2)+'\n');
let catalog=read(destination,'content/catalog.ts');
const a=catalog.indexOf('      {\n        "slug": "imitation-learning"'),b=catalog.indexOf('      {\n        "slug": "offline-online-learning"',a);
if(a<0||b<0)throw Error('Catalog block not found');
const record={slug:'imitation-learning',title:'模仿学习',subsections:hs.h2.map(h=>({slug:h.id,title:h.text})),prereq:['robot-learning/robot-data','machine-learning/supervised-learning'],level:'grad',type:'learning',status:signed||candidate?'v1.3':'draft'};
write(destination,'content/catalog.ts',catalog.slice(0,a)+JSON.stringify(record,null,2).split('\n').map(l=>'      '+l).join('\n')+',\n'+catalog.slice(b));
let registry=read(destination,'lib/wiki-components.ts');
if(!registry.includes("import { ImitationLearningExplorer }"))registry="import { ImitationLearningExplorer } from '@/components/wiki/imitation-learning-explorer';\n"+registry;
if(!/\bImitationLearningExplorer,/.test(registry))registry=registry.replace(/export const wikiComponents(?:\s*:\s*[^=]+)?\s*=\s*\{/,m=>m+'\n  ImitationLearningExplorer,');
if(!/\bImitationLearningExplorer,/.test(registry))throw Error('Component key registration failed');
write(destination,'lib/wiki-components.ts',registry);
let glossary=read(destination,'docs/semester-02/03-glossary.md');
const terms=[
 ['模仿学习','| 模仿学习 | Imitation Learning | — | 1 门 / 1 次 | RLEARN-02：借助专家示范或反馈学习策略；不等同强化学习。 |'],
 ['行为克隆','| 行为克隆 | Behavior Cloning、BC | — | 1 门 / 1 次 | RLEARN-02：监督拟合专家动作；动作损失不等于闭环任务代价。 |'],
 ['数据集聚合','| 数据集聚合 | Dataset Aggregation、DAgger | — | 1 门 / 1 次 | RLEARN-02：在学习者访问的观测上查询专家并聚合训练；性能界有条件。 |'],
];
for(const[name,row]of terms)if(!glossary.includes('| '+name+' |'))glossary=glossary.replace('\n<!-- REGISTER-END -->','\n'+row+'\n<!-- REGISTER-END -->');
write(destination,'docs/semester-02/03-glossary.md',glossary);
let checklist=read(destination,'.agent/semester-03-checklist.md');
const rows=checklist.split('\n').filter(l=>/^\| [A-Z]+-\d+ \|/.test(l));
const before=rows.slice(0,rows.findIndex(l=>l.startsWith('| '+id+' |')));
const skipped=before.filter(l=>l.split('|')[7].trim()!=='[x]').map(l=>l.split('|')[1].trim());
const phase=signed?'[x] | [x] | [x] | [x] | [x]':'[x] | [x] | [ ] | [ ] | [ ]';
checklist=checklist.replace(/^\| RLEARN-02 .*$/m,'| '+id+' | '+phase+' | [ ] | '+log+';'+dir+'acceptance.md;rank12，独立8203/9002验收 |');
write(destination,'.agent/semester-03-checklist.md',checklist);
let plan=read(destination,'.agent/semester-03-plan.md');
const exception='| '+id+' | '+skipped.join(';')+' | 2026-10-24用户明确指定继续RLEARN-02，rank12；保留并行课程，只依赖已交付机器人数据与监督学习，以闭式拟合替代未交付自动微分 | '+dir+'acceptance.md |';
const old=plan.split('\n').find(l=>l.startsWith('| '+id+' |')&&l.includes('用户'));
plan=old?plan.replace(old,exception):plan.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',exception+'\n<!-- S3-ORDER-EXCEPTIONS-END -->');
write(destination,'.agent/semester-03-plan.md',plan);
if(signed||candidate){let tracker=read(destination,'.agent/delivery-tracker.md');tracker=tracker.replace(/^\| \[[ x]\] 模仿学习 \(imitation-learning\).*$/m,'| [x] 模仿学习 (imitation-learning) | RLEARN-02学期3；11H2/4Notebook/1Explorer/五题五答；证据'+dir+'acceptance.md |');write(destination,'.agent/delivery-tracker.md',tracker);}
const proofPath=target+'/'+dir+'pyodide.json';
if(fs.existsSync(proofPath)){
 const {default:assert}=await import('node:assert/strict');const {createHash}=await import('node:crypto');
 const proof=JSON.parse(fs.readFileSync(proofPath,'utf8')),lesson=proof.lessons.find(l=>l.key===key);
 assert(proof.complete&&lesson);assert.equal(lesson.sourceHash,createHash('sha256').update(source).digest('hex'));
 for(const nb of lesson.notebooks)assert(nb.status==='passed'&&nb.cells.every(c=>c.status==='passed'&&!c.outputs.some(o=>o.type==='error')));
 const policy=JSON.parse(read(destination,'lib/python-support.json'));assert.equal(policy.workerHash,proof.workerHash);
 policy.lessons[key]={sourceHash:lesson.sourceHash,notebooks:lesson.notebooks.map(n=>({id:n.id,title:n.title,status:'enabled',reason:'',cells:n.cellCount}))};
 const report=JSON.parse(read(destination,'docs/deployment/python-expansion-local.json'));
 const i=report.lessons.findIndex(l=>l.key===key);if(i<0)report.lessons.push(lesson);else report.lessons[i]=lesson;
 if(!(report.provenance||[]).some(p=>p.inputPath===dir+'pyodide.json'&&p.testedAt===proof.testedAt))report.provenance=[...(report.provenance||[]),{testedAt:proof.testedAt,url:proof.url,inputPath:dir+'pyodide.json'}];
 report.totals={lessons:report.lessons.length,notebooks:report.lessons.reduce((n,l)=>n+l.notebooks.length,0),enabled:report.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>b.status==='passed').length,0),codeOnly:report.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>b.status==='code').length,0)};
 report.releaseTotals={lessons:Object.keys(policy.lessons).length,notebooks:Object.values(policy.lessons).reduce((n,l)=>n+l.notebooks.length,0),enabled:Object.values(policy.lessons).reduce((n,l)=>n+l.notebooks.filter(b=>b.status==='enabled').length,0),codeOnly:Object.values(policy.lessons).reduce((n,l)=>n+l.notebooks.filter(b=>b.status==='code').length,0)};
 write(destination,'lib/python-support.json',JSON.stringify(policy,null,2)+'\n');write(destination,'docs/deployment/python-expansion-local.json',JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({destination,id,status:record.status,h2:hs.h2.length,skipped:skipped.length}));
