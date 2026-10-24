/** Reproduce this lesson's scoped metadata on a clean snapshot of master. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parseCatalog} from '../../../scripts/lib-catalog.mjs';
const source=process.argv[3]||process.cwd(),target=process.argv[2]||source,ready=process.argv.includes('--ready');
const task='.agent/semester-03/driving-02',key='autonomous-driving/vehicle-dynamics';
const read=p=>fs.readFileSync(path.join(target,p),'utf8').replace(/\r\n/g,'\n');
const write=(p,s)=>fs.writeFileSync(path.join(target,p),s);
const own=['content/'+key+'.mdx','components/wiki/vehicle-dynamics-explorer.tsx','lib/vehicle-dynamics.ts','public/diagrams/autonomous-driving/bicycle-model.svg','docs/discuss-log/semester-03/20-autonomous-driving/02-vehicle-dynamics.md',task];
if(path.resolve(source)!==path.resolve(target))for(const p of own)fs.cpSync(path.join(source,p),path.join(target,p),{recursive:true});
let s=read('content/catalog.ts');
const old=parseCatalog(s).find(c=>c.slug==='autonomous-driving').lessons.find(l=>l.slug==='vehicle-dynamics');
const titles=['引言','坐标与状态','无侧滑的转弯几何','纵向力与附着预算','轮胎怎样产生侧向力','从力与力矩得到横向模型','算例与模型边界','小结','习题','答案'];
const lesson={...old,prereq:['autonomous-driving/driving-system','math/ode-matrix-exponential','modern/state-space'],status:ready?'v1.3':'draft',subsections:titles.map(title=>({slug:title,title}))};
s=s.replace(/      \{\n        "slug": "vehicle-dynamics",[\s\S]*?\n      \}/,JSON.stringify(lesson,null,2).split('\n').map(l=>'      '+l).join('\n'));write('content/catalog.ts',s);
s=read('lib/wiki-components.ts');
if(!s.includes('import { VehicleDynamicsExplorer }'))s='import { VehicleDynamicsExplorer } from "@/components/wiki/vehicle-dynamics-explorer";\n'+s;
if(!s.includes('  VehicleDynamicsExplorer,'))s=s.replace(/(export const wikiComponents[^=]*= \{)/,'$1\n  VehicleDynamicsExplorer,');write('lib/wiki-components.ts',s);
let checks=read('.agent/semester-03-checklist.md');
const sourceChecks=fs.readFileSync(path.join(source,'.agent/semester-03-checklist.md'),'utf8');
const started=sourceChecks.split(/\r?\n/).find(l=>l.startsWith('| DRIVING-02 |')&&l.includes('docs/discuss-log'));
const row=started||'| DRIVING-02 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/20-autonomous-driving/02-vehicle-dynamics.md;.agent/semester-03/driving-02/acceptance.md;rank14隔离执行 |';
checks=checks.replace(/^\| DRIVING-02 \|.*$/m,row);write('.agent/semester-03-checklist.md',checks);
let plan=read('.agent/semester-03-plan.md');
if(!plan.slice(0,plan.indexOf('<!-- S3-ORDER-EXCEPTIONS-END -->')).includes('| DRIVING-02 |')){
 const pending=[];for(const line of checks.split('\n')){if(line.startsWith('| DRIVING-02 |'))break;const m=line.match(/^\| ([A-Z]+-\d+) \|/);if(m&&line.includes('| [ ] |'))pending.push(m[1]);}
 const srcPlan=fs.readFileSync(path.join(source,'.agent/semester-03-plan.md'),'utf8');
 const prior=srcPlan.slice(0,srcPlan.indexOf('<!-- S3-ORDER-EXCEPTIONS-END -->')).split(/\r?\n/).find(l=>l.startsWith('| DRIVING-02 |'));
 const exception=prior||`| DRIVING-02 | ${pending.join(';')} | 2026-10-24用户指定继续DRIVING-02，rank14；保留并行检查点，只依赖已交付驾驶系统、微分方程与状态空间 | .agent/semester-03/driving-02/acceptance.md |`;
 plan=plan.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',exception+'\n<!-- S3-ORDER-EXCEPTIONS-END -->');
}
// A clean HEAD may lag the shared working checklist during concurrent receipts.
// Record every unfinished predecessor of this named user-authorized target.
const pendingHere=[];for(const line of checks.split('\n')){if(line.startsWith('| DRIVING-02 |'))break;const match=line.match(/^\| ([A-Z]+-\d+) \|/);if(match&&line.includes('| [ ] |'))pendingHere.push(match[1]);}
plan=plan.replace(/^\| DRIVING-02 \| ([A-Z0-9;\-]+) \| (.*)$/m,(_,list,rest)=>'| DRIVING-02 | '+[...new Set([...list.split(';'),...pendingHere])].join(';')+' | '+rest);
const receipt='### DRIVING-02 本轮执行记录';
const sourcePlan=fs.readFileSync(path.join(source,'.agent/semester-03-plan.md'),'utf8');
if(sourcePlan.includes(receipt)&&!plan.includes(receipt))plan+='\n'+sourcePlan.slice(sourcePlan.indexOf(receipt)).split(/\n### /)[0];
write('.agent/semester-03-plan.md',plan);
if(ready){
 s=read('.agent/delivery-tracker.md').replace(/^\| \[.\] 车辆动力学 \(vehicle-dynamics\) \|.*$/m,'| [x] 车辆动力学 (vehicle-dynamics) | 学期3 DRIVING-02；单轨模型、侧偏力与附着边界；证据 .agent/semester-03/driving-02/acceptance.md |');write('.agent/delivery-tracker.md',s);
 s=read('.agent/semester-03/zh-lang-edit/PLAN.md').replace(/^(\| 187 \| DRIVING-02 \|.*?\| )待完成 \| 待生产 \| — \|/m,'$1已完成 | 待润色 | — |');const n=s.split('\n').filter(l=>/^\| \d+ \|/.test(l)&&l.includes('| 已完成 |')).length;s=s.replace(/当前\d+课完成学期3生产/,'当前'+n+'课完成学期3生产');write('.agent/semester-03/zh-lang-edit/PLAN.md',s);
}
const proofFile=path.join(source,task,'pyodide.json');
if(fs.existsSync(proofFile)){
 const report=JSON.parse(fs.readFileSync(proofFile,'utf8')),proof=report.lessons.find(l=>l.key===key);
 if(!report.complete||proof.notebooks.some(b=>b.status!=='passed'||b.cells.some(c=>c.status!=='passed')))throw Error('Browser proof has not passed');
 if(createHash('sha256').update(read('content/'+key+'.mdx')).digest('hex')!==proof.sourceHash)throw Error('Stale browser proof');
 const policy=JSON.parse(read('lib/python-support.json'));policy.lessons[key]={sourceHash:proof.sourceHash,notebooks:proof.notebooks.map(b=>({id:b.id,title:b.title,status:'enabled',reason:'',cells:b.cells.length}))};write('lib/python-support.json',JSON.stringify(policy,null,2)+'\n');
 const all=JSON.parse(read('docs/deployment/python-expansion-local.json'));all.lessons=all.lessons.filter(l=>l.key!==key);all.lessons.push(proof);write('docs/deployment/python-expansion-local.json',JSON.stringify(all,null,2)+'\n');
}
console.log('Projected DRIVING-02 only onto '+target+'; ready='+ready);
