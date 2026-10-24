// Same plan validator, with evidence existence/ancestry checked in two Git batches.
// Avoid spawning one Git process per historical receipt during concurrent builds.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {validateSemester03} from '../../../scripts/check-semester03.mjs';
const root=process.cwd(),plan=fs.readFileSync('.agent/semester-03-plan.md','utf8'),checklist=fs.readFileSync('.agent/semester-03-checklist.md','utf8');
const result=validateSemester03({plan,checklist,baseline:JSON.parse(fs.readFileSync('.agent/semester-03-baseline.json','utf8')),root,evidence:false});
const table=(text,name)=>text.split('<!-- '+name+'-BEGIN -->')[1].split('<!-- '+name+'-END -->')[0].split(/\r?\n/).filter(l=>l.startsWith('|')).map(l=>l.split('|').slice(1,-1).map(s=>s.trim())).filter(r=>!['ID','导航序'].includes(r[0])&&!/^[-:]+$/.test(r[0]));
const records=[];
for(const r of table(checklist,'S3-TASKS'))if(r[2]==='[x]')records.push({id:r[0],refs:r[3],master:false});
for(const r of table(checklist,'S3-PROGRESS'))if(r.slice(1,7).some(v=>v==='[x]'))records.push({id:r[0],refs:r[7],master:r[6]==='[x]'});
for(const r of table(plan,'S3-ORDER-EXCEPTIONS'))records.push({id:r[0],refs:r[3],master:false});
const hashes=[];
for(const r of records)for(const ref of r.refs.split(';').map(s=>s.trim())){
 if(/^(?:\.agent|docs|scripts)\//.test(ref)){
  const resolved=path.resolve(root,ref.split('#')[0]),rel=path.relative(root,resolved);
  if(path.isAbsolute(rel)||rel==='..'||rel.startsWith('../')||rel.startsWith('..\\')||!fs.existsSync(resolved)||!fs.statSync(resolved).isFile())result.errors.push(r.id+' evidence missing/outside root: '+ref);
 }
 if(/^commit:[a-f0-9]{7,40}$/.test(ref))hashes.push({...r,hash:ref.slice(7)});
}
const env={...process.env,GIT_DIR:'D:/Workspace/control-universe/.git'};
const objects=execFileSync('git',['cat-file','--batch-check=%(objectname) %(objecttype)'],{cwd:root,env,input:hashes.map(r=>r.hash+'^{commit}').join('\n')+'\n',encoding:'utf8'}).trim().split('\n');
const ancestry=new Set(execFileSync('git',['rev-list','master'],{cwd:root,env,encoding:'utf8'}).trim().split('\n'));
for(let i=0;i<hashes.length;i++){
 const m=/^([a-f0-9]{40}) commit$/.exec(objects[i]);
 if(!m||hashes[i].master&&!ancestry.has(m[1]))result.errors.push(hashes[i].id+' commit missing/not on master: '+hashes[i].hash);
}
console.log(JSON.stringify({...result,evidenceRecords:records.length,commitChecks:hashes.length,gitProcesses:2},null,2));
if(result.errors.length)process.exitCode=1;else console.log('PASS semester-03 structure, evidence paths, commit existence and master ancestry (batched)');
