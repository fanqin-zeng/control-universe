import {test} from 'node:test';
import assert from 'node:assert/strict';
import {auditWarnings,parseCheckWarnings,readWarningAudit} from './check-warning-audit.mjs';
const input=readWarningAudit();
test('真实36项完整登记',()=>assert.deepEqual(auditWarnings(input).errors,[]));
test('解析保持多行警告明细而不把汇总算警告',()=>{
  const result=parseCheckWarnings('[6] x\n  WARN  first\n        detail\n  PASS  done\nPASS 17 · WARN 1 · FAIL 0');
  assert.equal(result.length,1);assert.deepEqual(result[0].details,['detail']);assert.equal(result[0].section,6);
});
const reject=(name,modify,pattern)=>test(name,()=>assert.match(auditWarnings({...input,...modify()}).errors.join('\n'),pattern));
reject('遗漏一项即失败',()=>({audit:input.audit.replace(/^\| BW-001 .*\r?\n/m,'')}),/遗漏基线WARN BW-001/);
reject('重复登记不补覆盖缺口',()=>({audit:input.audit.replace('| BW-002 |','| BW-001 |')}),/重复审计项/);
reject('没有可执行后续任务不能通过',()=>({audit:input.audit.replace(/S02;S03;/,'DOES-NOT-EXIST;')}),/未知后续任务/);
reject('不得把待处理直接写成关闭',()=>({audit:input.audit.replace('| 待处理 |','| 已关闭 |')}),/关闭缺证据/);
reject('DOM取证失败不得算已核',()=>({anchors:{...input.anchors,results:input.anchors.results.map((r,i)=>i? r:{...r,http:500})}}),/DOM取证失败/);
reject('丢失正文必须登记P0处置',()=>({audit:input.audit.replace(/(\| BW-019 .*?\| 阻塞 \| )P0/,'$1P1')}),/渲染损坏未登记P0/);
reject('新增WARN不因总量仍是36而被忽略',()=>({live:[...input.snapshot.warnings.slice(1),{id:'NEW',section:5,message:'新的孤儿组件',details:[]}]}),/基线外\/变化/);
reject('聚合警告成员替换也要复审',()=>({live:input.snapshot.warnings.map(w=>w.id==='BW-004'?{...w,details:['new/lesson']} :w)}),/基线外\/变化/);
reject('35课聚合问题不能漏掉一课的处置',()=>({audit:input.audit.replace(/^\| math\/complex-numbers \|.*\r?\n/m,'')}),/聚合成员遗漏 BW-004/);
reject('聚合成员不能关联错误目标课',()=>({audit:input.audit.replace('| math/complex-numbers | math/complex-numbers | MATH-02 |','| math/complex-numbers | math/complex-numbers | MATH-01 |')}),/聚合成员去向不符/);
test('警告消失只报关闭候选，不自动关闭台账',()=>{
  const result=auditWarnings({...input,live:input.snapshot.warnings.slice(1)});
  assert.deepEqual(result.errors,[]);assert.equal(result.stats.resolvedCandidates,1);assert.equal(result.stats.closed,0);
});
