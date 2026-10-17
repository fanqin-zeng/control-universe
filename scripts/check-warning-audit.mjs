/** I03审计覆盖校验；check-catalog仍是运行目录/警告的唯一测量来源。 */
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export function parseCheckWarnings(stdout){
  const lines=stdout.replace(/\r\n/g,'\n').split('\n'),warnings=[];let section=0;
  for(let i=0;i<lines.length;i++){
    const header=lines[i].match(/^\[(\d+)\] /);if(header)section=Number(header[1]);
    const match=lines[i].match(/^  WARN  (.*)$/);if(!match)continue;
    const details=[];for(let j=i+1;j<lines.length&&/^ {8}\S/.test(lines[j]);j++)details.push(lines[j].trim());
    warnings.push({id:'BW-'+String(warnings.length+1).padStart(3,'0'),section,message:match[1],details});
  }
  return warnings;
}
function fingerprint(w){
  // 普通INFO不是警告成员；聚合问题与锚点对照必须比较明细，不能只看条数。
  const details=w.section===6?w.details.filter(s=>s.startsWith('「')):
    /已有 MDX 但无讨论日志|^孤儿课 /.test(w.message)?w.details.slice(0,1):[];
  return JSON.stringify([w.section,w.message,details]);
}
export function auditWarnings({snapshot,audit,checklist,anchors,plan,live}){
  const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg);};
  const start='<!-- I03-WARNINGS-BEGIN -->',end='<!-- I03-WARNINGS-END -->';
  check(audit.split(start).length===2&&audit.split(end).length===2,'I03表标记缺失/重复');
  const section=audit.split(start)[1]?.split(end)[0]??'';
  const rows=section.split(/\r?\n/).filter(l=>/^\| BW-/.test(l)).map(l=>l.split('|').slice(1,-1).map(s=>s.trim()));
  const ids=new Set(),known=new Set(snapshot.warnings.map(w=>w.id));
  const tasks=new Set([...checklist.matchAll(/^\| ([A-Z]+(?:-\d+|\d+)) \|/gm)].map(m=>m[1]));
  check(known.size===snapshot.warnings.length,'快照WARN ID重复');
  check(snapshot.warnings.length===snapshot.summary.warn&&snapshot.exitCode===0&&snapshot.summary.fail===0,'快照计数/退出状态不符');
  for(const row of rows){
    const [id,,category,priority,action,owners,gate,state]=row;
    check(row.length===8,'表列数错误 '+id);check(!ids.has(id),'重复审计项 '+id);ids.add(id);
    check(known.has(id),'非基线审计项 '+id);
    check(['已知待处理','新增','阻塞'].includes(category),'分类非法 '+id);
    check(['P0','P1','P2'].includes(priority),'优先级非法 '+id);
    check(Boolean(action)&&Boolean(gate),'缺处置/关闭条件 '+id);
    check(Boolean(owners),'缺后续任务 '+id);
    for(const owner of (owners??'').split(';'))check(tasks.has(owner),'未知后续任务 '+id+': '+owner);
    check(['待处理','已关闭'].includes(state),'状态非法 '+id);
    if(state==='已关闭')check(/关闭证据[:：]\s*\S+/.test(action??''),'关闭缺证据 '+id);
  }
  for(const id of known)check(ids.has(id),'遗漏基线WARN '+id);
  const sourceTargets=new Map();
  for(const line of (plan??'').split(/\r?\n/).filter(l=>/^\| [A-Z]+-\d+ \|/.test(l))){
    const [id,path,,,sources]=line.split('|').slice(1,-1).map(s=>s.trim());
    for(const source of (sources??'').split(';')){
      if(!sourceTargets.has(source))sourceTargets.set(source,new Set());sourceTargets.get(source).add(path+'|'+id);
    }
  }
  for(const [id,heading]of [['BW-004','附表A'],['BW-035','附表B']]){
    const expected=new Set(snapshot.warnings.find(w=>w.id===id)?.details[0]?.split(', ')??[]);
    const part=audit.split('## '+heading)[1]?.split(/\r?\n## /)[0]??'';
    const members=part.split(/\r?\n/).filter(l=>/^\| [a-z][a-z0-9-]*\//.test(l)).map(l=>l.split('|').slice(1,-1).map(s=>s.trim()));
    const seen=new Set();
    for(const [source,target,owner]of members){
      check(!seen.has(source),'聚合成员重复 '+id+': '+source);seen.add(source);
      check(expected.has(source),'聚合成员多余 '+id+': '+source);
      check(tasks.has(owner)&&sourceTargets.get(source)?.has(target+'|'+owner),'聚合成员去向不符 '+id+': '+source);
    }
    for(const source of expected)check(seen.has(source),'聚合成员遗漏 '+id+': '+source);
  }
  const expectedAnchors=snapshot.warnings.filter(w=>w.section===6).map(w=>w.id);
  const seenAnchors=new Set(anchors.results.map(r=>r.id));
  check(seenAnchors.size===anchors.results.length,'DOM证据重复');
  for(const id of expectedAnchors)check(seenAnchors.has(id),'DOM证据遗漏 '+id);
  for(const result of anchors.results){
    check(expectedAnchors.includes(result.id),'多余DOM证据 '+result.id);
    check(!result.error&&result.http===200,'DOM取证失败 '+result.id);
    if(result.actualH2!==result.expectedH2||result.katexErrors>0){
      const row=rows.find(r=>r[0]===result.id);
      check(row?.[2]==='阻塞'&&row?.[3]==='P0'&&row?.[5]?.split(';').includes('W05'),'渲染损坏未登记P0/W05 '+result.id);
    }
  }
  let delta;
  if(live){
    const baseline=new Set(snapshot.warnings.map(fingerprint)),current=new Set(live.map(fingerprint));
    delta={current:live.length,newOrChanged:live.filter(w=>!baseline.has(fingerprint(w))).length,resolvedCandidates:snapshot.warnings.filter(w=>!current.has(fingerprint(w))).length};
    check(delta.newOrChanged===0,'发现基线外/变化的WARN，必须重新审计登记：'+delta.newOrChanged);
  }
  return {errors,stats:{baseline:snapshot.warnings.length,audited:ids.size,blocked:rows.filter(r=>r[2]==='阻塞').length,pending:rows.filter(r=>r[2]==='已知待处理').length,closed:rows.filter(r=>r[7]==='已关闭').length,anchorPages:seenAnchors.size,...delta}};
}
export function readWarningAudit(){return {
  snapshot:JSON.parse(readFileSync('.agent/semester-03/i03-warnings-baseline.json','utf8')),
  audit:readFileSync('.agent/semester-03/i03-warn-audit.md','utf8'),checklist:readFileSync('.agent/semester-03-checklist.md','utf8'),
  anchors:JSON.parse(readFileSync('.agent/semester-03/i03-anchor-evidence.json','utf8')),
  plan:readFileSync('.agent/semester-03-plan.md','utf8'),
};}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{
    const input=readWarningAudit();
    if(process.argv.includes('--live')){
      const run=spawnSync(process.execPath,['scripts/check-catalog.mjs'],{encoding:'utf8'});
      if(run.status!==0)throw Error('check-catalog失败，退出码 '+run.status);
      input.live=parseCheckWarnings(run.stdout);
      const total=run.stdout.match(/PASS (\d+) · WARN (\d+) · FAIL (\d+)/);
      if(!total||Number(total[2])!==input.live.length)throw Error('WARN提取数量与权威汇总不符');
    }
    const result=auditWarnings(input);console.log(JSON.stringify(result.stats,null,2));
    if(result.errors.length){result.errors.forEach(e=>console.error('FAIL',e));process.exitCode=1;}else console.log('PASS I03 warning audit');
  }catch(err){console.error('FAIL',err.message);process.exitCode=1;}
}
