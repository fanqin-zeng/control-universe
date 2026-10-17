/** S01 审查输入检查及可再生清单；不修改线上 catalog。 */
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseCatalog} from './lib-catalog.mjs';

export function rows(text, marker) {
  const parts=text.split(`<!-- ${marker}-BEGIN -->`);
  if(parts.length!==2||parts[1].split(`<!-- ${marker}-END -->`).length!==2)throw Error(`标记错误 ${marker}`);
  return parts[1].split(`<!-- ${marker}-END -->`)[0].split(/\r?\n/)
    .filter(l=>l.startsWith('|')).map(l=>l.split('|').slice(1,-1).map(s=>s.trim()))
    .filter(r=>r[0]!=='ID'&&!/^[-:]+$/.test(r[0]));
}
export function reviewGraph(lessons, dependencies) {
  const errors=[], ids=new Map(lessons.map((l,i)=>[l[0],i])), seen=new Set(),graph=new Map();
  for(const [id,type,level,cell] of dependencies){
    if(seen.has(id))errors.push(`重复 ${id}`);seen.add(id);
    if(!ids.has(id))errors.push(`未知课程 ${id}`);
    if(!['math','theory','impl','case','frontier','learning','history'].includes(type))errors.push(`非法type ${id}`);
    if(!['undergrad','grad','advanced'].includes(level))errors.push(`非法level ${id}`);
    const pre=cell==='—'?[]:cell.split(';');graph.set(id,pre);
    if(new Set(pre).size!==pre.length)errors.push(`重复先修 ${id}`);
    for(const p of pre){if(!ids.has(p))errors.push(`悬空 ${id} -> ${p}`);else if(ids.get(p)>=ids.get(id))errors.push(`先修未先生产 ${id} -> ${p}`);}
  }
  for(const id of ids.keys())if(!seen.has(id))errors.push(`缺课 ${id}`);
  const active=new Set(),done=new Set();
  function visit(id){if(active.has(id)){errors.push(`依赖环 ${id}`);return;}if(done.has(id))return;active.add(id);for(const p of graph.get(id)||[])visit(p);active.delete(id);done.add(id);}
  for(const id of graph.keys())visit(id);
  for(const id of ['DISCRETE-04','DISCRETE-06'])if(!graph.get(id)?.includes('DISCRETE-01'))errors.push(`采样先修被删除 ${id}`);
  return errors;
}
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
export function collectReview(root=process.cwd(),ref=null){
  const read=p=>ref?execFileSync('git',['show',`${ref}:${p}`],{cwd:root,encoding:'utf8'}):readFileSync(resolve(root,p),'utf8');
  const present=p=>{if(!ref)return existsSync(resolve(root,p));try{execFileSync('git',['cat-file','-e',`${ref}:${p}`],{cwd:root,stdio:'ignore'});return true;}catch{return false;}};
  const plan=read('.agent/semester-03-plan.md'),lessons=rows(plan,'S3-LESSONS');
  const deps=rows(read('.agent/semester-03/s01-dependency-review.md'),'S01-DEPENDENCIES');
  const errors=reviewGraph(lessons,deps),baseline=JSON.parse(read('.agent/semester-03-baseline.json'));
  const catalog=parseCatalog(read('content/catalog.ts'));
  const current=new Map(catalog.flatMap(c=>c.lessons.map(l=>[`${c.slug}/${l.slug}`,l])));
  const mapped=new Map();for(const l of lessons)if(l[4]!=='—')for(const s of l[4].split(';')){if(mapped.has(s))errors.push(`重复来源 ${s}`);mapped.set(s,l);}
  const sources=baseline.chapters.flatMap(c=>c.lessons).map(s=>{
    const target=mapped.get(s.path),file=`content/${s.path}.mdx`,exists=present(file);
    if(!target)errors.push(`来源遗漏 ${s.path}`);
    if(exists!==s.hasMdx)errors.push(`正文数量漂移 ${s.path}`);
    if(!current.has(s.path))errors.push(`当前来源缺失 ${s.path}`);
    let baselineHash=null,currentHash=null,exception=null;
    if(exists){
      baselineHash=hash(execFileSync('git',['show',`${baseline.commit}:${file}`],{cwd:root,encoding:'utf8'}));currentHash=hash(read(file));
      if(currentHash!==baselineHash){
        if(s.path==='classic/stability-analysis'){
          const original=execFileSync('git',['show',`${baseline.commit}:${file}`],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n');
          const fixed=original.replaceAll("plt.rcParams['axes.unicode_minus'] = False}","plt.rcParams['axes.unicode_minus'] = False`}");
          if(fixed===original||hash(fixed)!==currentHash)errors.push(`I01例外不再仅为闭合反引号 ${s.path}`);
          exception='I01：两处 setupCode 闭合反引号；357badd';
        }else errors.push(`未登记正文漂移 ${s.path}`);
      }
    }
    return {source:s.path,id:target?.[0],target:target?.[1],hasMdx:exists,status:current.get(s.path)?.status,
      action:s.path===target?.[1]?'保留':exists?'git mv正文并保留旧入口':'合并或迁移空条目并保留旧入口',baselineNormalizedSha256:baselineHash,currentNormalizedSha256:currentHash,exception};
  });
  for(const s of mapped.keys())if(!sources.some(r=>r.source===s))errors.push(`未知来源 ${s}`);
  const files=execFileSync('git',ref?['ls-tree','-r','--name-only',ref,'--','content','app','components','lib','scripts','next.config.mjs','mdx-components.tsx','.agent/delivery-tracker.md','docs/discuss-log']:['ls-files','content','app','components','lib','scripts','next.config.mjs','mdx-components.tsx','.agent/delivery-tracker.md','docs/discuss-log'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/);
  const moved=sources.filter(s=>s.source!==s.target),references=[];
  for(const file of files){if(!/\.(mdx?|tsx?|mjs|json)$/.test(file))continue;
    const lines=read(file).split(/\r?\n/);for(const [i,line]of lines.entries()){
      for(const s of moved)if(line.includes(s.source))references.push({file,line:i+1,source:s.source,target:s.target,scope:file.startsWith('docs/discuss-log/')?'历史原文保留，靠旧URL兼容':'S03审查调用/链接；fixture与历史证据须保留来源语义'});
    }
  }
  const oldEdges=catalog.flatMap(c=>c.lessons.flatMap(l=>(l.prereq||[]).map(p=>({source:`${c.slug}/${l.slug}`,prereq:p,targetId:mapped.get(`${c.slug}/${l.slug}`)?.[0],prereqId:mapped.get(p)?.[0]}))));
  const allEdges=deps.flatMap(d=>d[3]==='—'?[]:d[3].split(';').map(p=>({id:d[0],prereq:p})));
  const graph=new Map(deps.map(d=>[d[0],d[3]==='—'?[]:d[3].split(';')]));
  const exceptions={
    'EST-03/MODERN-07':'LQR对偶为扩展；滤波推导由统计估计/可检测性与概率支撑，不要求先设计LQR',
    'EST-05/EST-04':'UKF以sigma点传播替代Jacobian线性化；EKF作为比较阅读，不是算法必需先修',
    'EST-06/EST-03':'粒子滤波由概率递推/采样起步，不以线性高斯Kalman为唯一入口',
    'EST-08/EST-05':'案例选择EKF融合与粒子滤波基线；UKF扩展比较需Phase1再登记',
    'DISCRETE-05/DISCRETE-06':'稳定性判据适用于已给定离散模型，无需先学连续模型离散化；保留Z域/线性稳定性工具，解除目标顺序新倒置',
    'IMPL-05/IMPL-06':'嵌入式先学部署和硬件，实时调度下一课引入；实时约束细节不得在本课未经解释先用',
    'ID-03/EST-02':'辨识章先于估计章，最小二乘在辨识局部引入；统计估计另讲似然/不确定性，不循环依赖',
    'ID-03/NONLINEAR-08':'RLS直接由最小二乘递推，不强制先学自适应控制器；控制应用列扩展',
    'ID-08/INTEL-05':'原神经控制前向边改ML-04/05训练与时序模型，不依赖控制器设计',
    'ID-09/MPC-02':'先完成模型验证与激励案例；MPC预测应用作为后续阅读，不能反向要求尚未生产课程',
  };
  function reaches(x,p,seen=new Set()){if(seen.has(x))return false;seen.add(x);return (graph.get(x)||[]).some(y=>y===p||reaches(y,p,seen));}
  for(const e of oldEdges){
    e.disposition=graph.get(e.targetId)?.includes(e.prereqId)?'直接保留':reaches(e.targetId,e.prereqId)?'经候选先修链保留':'边界调整';
    e.reason=e.disposition==='边界调整'?exceptions[`${e.targetId}/${e.prereqId}`]:e.disposition==='直接保留'?'旧依赖仍必要，映射目标ID后保留':'工具已由候选先修的前置链覆盖，不丢失知识要求';
    if(!e.reason)errors.push(`旧边未解释 ${e.source} -> ${e.prereq}`);
  }
  const incoming=new Set(oldEdges.map(e=>e.prereq));
  const isolated=catalog.flatMap(c=>c.lessons.filter((l,i)=>i>0&&l.type!=='case'&&!/-case(-study)?$/.test(l.slug)&&!l.prereq?.length&&!incoming.has(`${c.slug}/${l.slug}`)).map(l=>({source:`${c.slug}/${l.slug}`,id:mapped.get(`${c.slug}/${l.slug}`)?.[0]})));
  const zeroChapters=catalog.filter(c=>c.lessons.every(l=>!l.prereq?.length)).map(c=>c.slug);
  const navigation=rows(plan,'S3-CHAPTERS').sort((a,b)=>Number(a[0])-Number(b[0])).map(c=>c[2]);
  const forward=allEdges.filter(e=>{
    const own=lessons.find(l=>l[0]===e.id)[1].split('/')[0],pre=lessons.find(l=>l[0]===e.prereq)[1].split('/')[0];
    return navigation.indexOf(pre)>navigation.indexOf(own);
  });
  if(forward.some(e=>!e.id.startsWith('INTRO-')))errors.push('非导论导航前向边');
  return {errors,stats:{sources:sources.length,mdx:sources.filter(s=>s.hasMdx).length,movedSources:moved.length,movedMdx:moved.filter(s=>s.hasMdx).length,targets:lessons.length,oldEdges:oldEdges.length,candidateEdges:allEdges.length,isolated:isolated.length,zeroChapters:zeroChapters.length,forward:forward.length},sources,dependencies:deps.map(d=>({id:d[0],type:d[1],level:d[2],prereq:d[3]==='—'?[]:d[3].split(';')})),oldEdges,isolated,zeroChapters,forward,references};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{const migrated=/\| S02 \|[^\n]*\[x\]/.test(readFileSync('.agent/semester-03-checklist.md','utf8'));
    if(migrated&&process.argv.includes('--write'))throw Error('S01历史证据冻结；迁移后禁止覆盖');
    const result=collectReview(process.cwd(),migrated?'4c06e93':null);if(process.argv.includes('--write')&&!result.errors.length)writeFileSync('.agent/semester-03/s01-migration-inventory.json',JSON.stringify(result,null,2)+'\n');if(!process.argv.includes('--write')&&JSON.stringify(result)!==JSON.stringify(JSON.parse(readFileSync('.agent/semester-03/s01-migration-inventory.json','utf8'))))result.errors.push('审查快照与当前输入不一致；检查差异后显式 --write');console.log(JSON.stringify(result.stats));for(const e of result.errors)console.error('FAIL',e);if(result.errors.length)process.exitCode=1;else console.log('PASS S01 migration review');}catch(e){console.error('FAIL',e.message);process.exitCode=1;}
}
