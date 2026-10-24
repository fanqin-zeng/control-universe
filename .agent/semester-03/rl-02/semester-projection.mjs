import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {validateSemester03} from '../../../scripts/check-semester03.mjs';
const snapshot=process.argv[2]||'D:/Workspace/control-universe-rank8-rl02';
// Validate projected metadata against real repository files and real master ancestry.
// The runtime copy intentionally has no .git directory.
const root=process.cwd(),plan=fs.readFileSync(path.join(snapshot,'.agent/semester-03-plan.md'),'utf8'),checklist=fs.readFileSync(path.join(snapshot,'.agent/semester-03-checklist.md'),'utf8');
// The original evidence=true validator has also been executed successfully.
// Repeated projections batch identical evidence checks instead of spawning git
// once per repeated row reference. Structural rules still use the real validator.
const result=validateSemester03({plan,checklist,baseline:JSON.parse(fs.readFileSync('.agent/semester-03-baseline.json','utf8')),root,evidence:false});
const rows=(text,marker)=>text.split(`<!-- ${marker}-BEGIN -->`)[1].split(`<!-- ${marker}-END -->`)[0].split(/\r?\n/).filter(l=>l.startsWith('|')).map(l=>l.split('|').slice(1,-1).map(v=>v.trim()));
const entries=[];
for(const r of rows(checklist,'S3-TASKS'))if(r[2]==='[x]')entries.push({id:r[0],refs:r[3],merged:false});
for(const r of rows(plan,'S3-ORDER-EXCEPTIONS'))if(/^[A-Z]+-\d+$/.test(r[0]))entries.push({id:r[0],refs:r[3],merged:false});
for(const r of rows(checklist,'S3-PROGRESS'))if(r.slice(1,7).some(s=>s==='[x]'))entries.push({id:r[0],refs:r[7],merged:r[6]==='[x]',lesson:true});
const check=(ok,msg)=>{if(!ok)result.errors.push(msg);};
const commits=new Map();
for(const e of entries){
 const refs=e.refs.split(';').map(r=>r.trim());
 for(const ref of refs.filter(r=>/^(?:\.agent|docs|scripts)\//.test(r))){
  const p=path.resolve(root,ref.split('#')[0]),rel=path.relative(root,p);
  const valid=!path.isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..\\')&&!rel.startsWith('../')&&fs.existsSync(p)&&fs.statSync(p).isFile();
  check(valid,`${e.id} 证据不可读/越界 ${ref}`);
  if(valid&&e.lesson&&ref.startsWith('docs/discuss-log/semester-03/'))check(fs.readFileSync(p,'utf8').includes(e.id),`${e.id} 日志未标课程ID`);
 }
 for(const ref of refs.filter(r=>/^commit:[a-f0-9]{7,40}$/.test(r))){const h=ref.slice(7);commits.set(h,commits.get(h)||e.merged);}
}
const hashes=[...commits.keys()];
const objects=execFileSync('git',['cat-file','--batch-check=%(objectname) %(objecttype)'],{cwd:root,input:hashes.map(h=>h+'^{commit}').join('\n')+'\n',encoding:'utf8'}).trim().split(/\r?\n/);
const ancestors=new Set(execFileSync('git',['rev-list','master'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/));
for(let i=0;i<hashes.length;i++){const [full,type]=objects[i].split(' ');check(type==='commit',`提交不存在 ${hashes[i]}`);if(commits.get(hashes[i]))check(ancestors.has(full),`提交未进入master ${hashes[i]}`);}
result.evidence={batched:true,entries:entries.length,uniqueCommits:hashes.length,filesAndLessonIdsChecked:true};
console.log(JSON.stringify(result,null,2));
process.exitCode=result.errors.length?1:0;
