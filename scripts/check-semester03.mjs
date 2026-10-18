/** 学期3规划/进度校验。目标读计划，当前站点仍读catalog，不维护第三份目录。 */
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,relative,isAbsolute} from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {parseCatalog} from './lib-catalog.mjs';

function table(text,marker,width){
  const start=`<!-- ${marker}-BEGIN -->`,end=`<!-- ${marker}-END -->`;
  if(text.split(start).length!==2||text.split(end).length!==2)throw Error(`${marker}: 标记必须各出现一次`);
  const section=text.split(start)[1].split(end)[0];
  return section.split(/\r?\n/).filter(l=>l.startsWith('|')).map(l=>l.split('|').slice(1,-1).map(v=>v.trim()))
    .filter(r=>!r.every(v=>/^:?-+:?$/.test(v))&&!['ID','导航序'].includes(r[0]))
    .map(r=>{if(r.length!==width)throw Error(`${marker}: 列数错误 ${r[0]}`);return r;});
}

export function assertCommitOnMaster(root, hash) {
  execFileSync('git', ['rev-parse', '--verify', `${hash}^{commit}`], {cwd: root, stdio: 'ignore'});
  execFileSync('git', ['merge-base', '--is-ancestor', hash, 'master'], {cwd: root, stdio: 'ignore'});
}

export function validateSemester03({plan,checklist,baseline,root=process.cwd(),evidence=true}){
  const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg);};
  let chapters,lessons,tasks,progress;
  try{
    chapters=table(plan,'S3-CHAPTERS',6);lessons=table(plan,'S3-LESSONS',5);
    tasks=table(checklist,'S3-TASKS',4);progress=table(checklist,'S3-PROGRESS',8);
  }catch(e){return {errors:[e.message]};}
  const unique=(values,label)=>check(new Set(values).size===values.length,`${label} 重复`);
  const pathPattern=/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/;
  const sources=new Map(baseline.chapters.flatMap(c=>c.lessons.map(l=>[l.path,l])));
  const coverage=new Map(),chapterMap=new Map(chapters.map(c=>[c[2],c]));
  unique(chapters.map(c=>c[2]),'章slug');unique(lessons.map(l=>l[0]),'课程ID');unique(lessons.map(l=>l[1]),'目标路径');
  unique([...tasks.map(t=>t[0]),...progress.map(p=>p[0])],'全局ID');
  for(const [i,c]of chapters.entries()){
    check(/^[a-z][a-z0-9-]*$/.test(c[2]),`非法章slug ${c[2]}`);
    check([...c[3]].length<=10&&!/[:：]/.test(c[3]),`章名过长/含冒号 ${c[3]}`);
    check(Number(c[1])===i+1,`生产批次不连续 ${c[2]}`);
    check(Number(c[4])===lessons.filter(l=>l[1].split('/')[0]===c[2]).length,`章课数不符 ${c[2]}`);
  }
  const nav=chapters.map(c=>Number(c[0])).sort((a,b)=>a-b);
  check(nav.every((n,i)=>n===i+1),'导航序不连续/重复');
  let lastChapter=-1;
  for(const [id,path,title,mode,source]of lessons){
    check(/^[A-Z]+-\d{2,}$/.test(id),`非法课程ID ${id}`);
    check(pathPattern.test(path),`非法目标路径 ${path}`);
    check(chapterMap.has(path.split('/')[0]),`未定义章节 ${path}`);
    const chapterIndex=chapters.findIndex(c=>c[2]===path.split('/')[0]);
    check(chapterIndex>=lastChapter,`课程生产顺序跨章倒置 ${id}`);lastChapter=chapterIndex;
    check([...title].length>0&&[...title].length<=16&&!/[:：]/.test(title),`课名过长/含冒号 ${id}`);
    const old=source==='—'?[]:source.split(';');unique(old,`${id} 来源`);
    for(const s of old){check(sources.has(s),`未知来源 ${id}: ${s}`);coverage.set(s,(coverage.get(s)||0)+1);}
    const expected=old.some(s=>sources.get(s)?.hasMdx)?'重构':'新写';
    check(mode===expected,`模式与来源正文不符 ${id}: 应为${expected}`);
  }
  for(const s of sources.keys())check(coverage.has(s),`来源未覆盖 ${s}`);
  for(const l of sources.values())check(l.hasMdx?/^[a-f0-9]{64}$/.test(l.sha256):l.sha256===null,`基线hash缺失/非法 ${l.path}`);
  const lessonIds=new Set(lessons.map(l=>l[0])),progressIds=new Set(progress.map(p=>p[0]));
  for(const id of lessonIds)check(progressIds.has(id),`课程未入台账 ${id}`);
  for(const id of progressIds)check(lessonIds.has(id),`台账多余课程 ${id}`);
  check(progress.map(p=>p[0]).join('\n')===lessons.map(l=>l[0]).join('\n'),'台账生产顺序与计划不符');
  const evidenceFiles=(cell,id,needCommit=false)=>{
    const refs=cell.split(';').map(s=>s.trim());
    const commits=refs.filter(r=>/^commit:[a-f0-9]{7,40}$/.test(r));
    if(needCommit)check(commits.length>0,`${id} 合并缺commit证据`);
    const files=refs.filter(r=>/^(?:\.agent|docs|scripts)\//.test(r));
    check(files.length>0,`${id} 完成缺持久文件证据`);
    if(evidence){
      for(const ref of files){const p=resolve(root,ref.split('#')[0]),rel=relative(root,p);
        check(!isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..\\')&&!rel.startsWith('../')&&existsSync(p)&&statSync(p).isFile(),`${id} 证据不可读/越界 ${ref}`);}
      for(const ref of commits)try{
        const hash=ref.slice(7);
        if(needCommit)assertCommitOnMaster(root,hash);
        else execFileSync('git',['rev-parse','--verify',`${hash}^{commit}`],{cwd:root,stdio:'ignore'});
      }catch{check(false,`${id} 提交不存在或未合入master ${ref}`);}
    }
    return files;
  };
  for(const [id,,state,refs]of tasks){
    check(/^[A-Z]+\d{2,}$/.test(id),`非法任务ID ${id}`);
    check(['[ ]','[x]'].includes(state),`非法任务状态 ${id}`);
    if(state==='[x]')evidenceFiles(refs,id);
  }
  let incomplete=false;
  for(const p of progress){
    const states=p.slice(1,7);let missing=false;
    for(const state of states){check(['[ ]','[x]'].includes(state),`非法课程状态 ${p[0]}`);if(state==='[ ]')missing=true;else check(!missing,`阶段跳勾 ${p[0]}`);}
    if(states.some(s=>s==='[x]')){
      check(!incomplete,`跳过未合入前课 ${p[0]}`);
      const refs=evidenceFiles(p[7],p[0],states[5]==='[x]');
      const log=refs.find(r=>r.startsWith('docs/discuss-log/semester-03/'));
      check(Boolean(log),`${p[0]} 缺学期3课程日志`);
      if(evidence&&log&&existsSync(resolve(root,log.split('#')[0])))check(readFileSync(resolve(root,log.split('#')[0]),'utf8').includes(p[0]),`${p[0]} 日志未标课程ID`);
    }
    if(states[5]!=='[x]')incomplete=true;
  }
  const refactor=lessons.filter(l=>l[3]==='重构').length;
  return {errors,stats:{chapters:chapters.length,lessons:lessons.length,refactor,new:lessons.length-refactor,sources:sources.size,mdx:[...sources.values()].filter(s=>s.hasMdx).length,tasks:tasks.length,doneTasks:tasks.filter(t=>t[2]==='[x]').length,merged:progress.filter(p=>p[6]==='[x]').length}};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{
    const result=validateSemester03({plan:readFileSync('.agent/semester-03-plan.md','utf8'),checklist:readFileSync('.agent/semester-03-checklist.md','utf8'),baseline:JSON.parse(readFileSync('.agent/semester-03-baseline.json','utf8'))});
    console.log(JSON.stringify(result.stats??{},null,2));
    if(result.errors.length){for(const e of result.errors)console.error('FAIL',e);process.exitCode=1;}else console.log('PASS semester-03 plan/checklist');
  }catch(e){console.error('FAIL',e.message);process.exitCode=1;}
}
