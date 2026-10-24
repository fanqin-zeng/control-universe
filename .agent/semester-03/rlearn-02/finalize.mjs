import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root='D:/Workspace/control-universe',target='D:/Workspace/control-universe-rank12-rlearn02',dir='.agent/semester-03/rlearn-02/';
const read=(r,p)=>fs.readFileSync(r+'/'+p,'utf8');
assert(read(target,dir+'build.log').includes('EXIT_CODE=0'));
assert(read(target,dir+'browser-production.log').includes('PASS browser'));
assert(read(target,dir+'verify-production.log').includes('PASS 9 · WARN 0 · FAIL 0 · SKIPPED 0'));
assert(JSON.parse(read(target,dir+'reconciliation.json')).pyodideIdentical);
for(const name of fs.readdirSync(target+'/'+dir))if(/\.(json|log|png)$/.test(name)&&name!=='pyodide-before-terms.json')fs.copyFileSync(target+'/'+dir+name,root+'/'+dir+name);
const log='docs/discuss-log/semester-03/18-robot-learning/02-imitation-learning.md';let s=read(root,log);
s=s.replace('待全部门槛完成后签发。',`[秦构] 最终浏览器模式生产构建exit0；生产verify九项PASS、SKIPPED0；生产真实页面四个Notebook全部运行、五预设/六端点/恢复默认、标题锚点和390px布局再次通过。最初普通构建漏传浏览器模式开关，实验断言0/4失败，保留原日志，显式设置NEXT_PUBLIC_STATIC_EXPORT=true重建后才算通过。

[柯验] 对账A.1十三行全部通过；450组/4112点、最大差1.3322676295501878e-15；四份原始cell已在严格9002与浏览器执行，stdout逐字一致，源hash绑定最终正文。

[何疑] 附录C三个限定比较全部放行，未把解析专家参考或常数类反例写成普遍性能结论。

[孙助] 五题五答已逐题核对推导、数值及边界，登记的三条术语与正文首现一致。

[郑核] 代陆阅核查Phase1–4、A.1、B、C四份档案齐备。签发本课学期3完成态；catalog与旧台账同步v1.3，学期checklist本课P1–P4与验收打勾，真实master回执在提交后补。最终组合若有并行提交，仅刷新本课共享条目并重新核对元数据，不带入未提交他课内容；构建基线另列build-origin.json。`);
s=s.replace('下列路径以.agent/semester-03/rlearn-02/为前缀。最终构建/目录门槛通过前不签发。','下列路径以.agent/semester-03/rlearn-02/为前缀；完整候选构建基线4ed302698915b30c3228a60753bb450d13cf56ed，最终并行组合另跑目录/学期/政策及隔离检查。');
s=s.replace('| 1 | npm run build通过 | 独立候选构建待执行，build.log | 待完成 |','| 1 | npm run build通过 | NEXT_PUBLIC_STATIC_EXPORT=true npm run build；210/210页；build.log EXIT_CODE=0 | ✅ |');
s=s.replace('最终目录检查待组合核定','候选目录检查PASS21/WARN2/FAIL0，最终组合另留check-final.log');
s+='\n最终生产回执：verify-production.log为PASS9/WARN0/FAIL0/SKIPPED0；browser-production.log为PASS browser；build.log为EXIT_CODE=0。早期verify-draft.log渲染项SKIPPED，不将该次计为九项全绿。候选check PASS21/WARN2/FAIL0；原始semester-candidate.log EXIT_CODE=0；glossary PASS3/WARN3/FAIL0、Python policy pass:true。最终组合的目录/学期检查留check-final.log、semester-final.log与audit-final.log。\n';
fs.writeFileSync(root+'/'+log,s);
execFileSync('node',[root+'/'+dir+'manage.mjs','--main','--signed'],{cwd:root,stdio:'inherit'});
execFileSync('node',[root+'/'+dir+'manage.mjs','--project','--signed'],{cwd:root,stdio:'inherit'});
const run=(args,name,allowFailure=false)=>{
 let output,code=0;try{output=execFileSync('node',args,{cwd:target,env:{...process.env,GIT_DIR:root+'/.git'},encoding:'utf8',maxBuffer:64*1024*1024});}catch(e){code=e.status;output=(e.stdout||'')+'\n'+(e.stderr||'');}
 fs.writeFileSync(target+'/'+dir+name,output+'\nEXIT_CODE='+code+'\n');if(code&&!allowFailure)throw Error(name+' failed with '+code);
};
run(['scripts/check-catalog.mjs','--fix-outline','--fix-tracker-stats'],'check-final-refresh.log',true);
run(['scripts/check-catalog.mjs'],'check-final.log');
run([dir+'audit-projection.mjs'],'audit-final.log');
run([dir+'semester-batch.mjs'],'semester-final.log');
run(['scripts/check-python-support.mjs'],'python-policy-final.log');
console.log('PASS signed final projection checks');
