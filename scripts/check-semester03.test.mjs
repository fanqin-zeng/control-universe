import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateSemester03} from './check-semester03.mjs';
const input={plan:readFileSync('.agent/semester-03-plan.md','utf8'),checklist:readFileSync('.agent/semester-03-checklist.md','utf8'),baseline:JSON.parse(readFileSync('.agent/semester-03-baseline.json','utf8')),evidence:false};
test('当前计划与台账一致',()=>assert.deepEqual(validateSemester03(input).errors,[]));
const rejects=(name,mutate,pattern)=>test(name,()=>assert.match(validateSemester03({...input,...mutate()}).errors.join('\n'),pattern));
rejects('遗漏来源会失败',()=>({plan:input.plan.replace('| math/complex-numbers | 复数基础 | 重构 | math/complex-numbers |','| math/complex-numbers | 复数基础 | 新写 | — |')}),/来源未覆盖 math\/complex-numbers/);
rejects('误把旧文算新写会失败',()=>({plan:input.plan.replace('| 复数基础 | 重构 |','| 复数基础 | 新写 |')}),/模式与来源正文不符 MATH-02/);
rejects('重复目标路径会失败',()=>({plan:input.plan.replace('| math/complex-numbers |','| math/calculus-basics |')}),/目标路径 重复/);
rejects('遗漏课程进度会失败',()=>({checklist:input.checklist.replace(/^\| MATH-01 .*\r?\n/m,'')}),/课程未入台账 MATH-01/);
rejects('跳阶段打勾会失败',()=>({checklist:input.checklist.replace('| MATH-01 | [ ] | [ ] |','| MATH-01 | [ ] | [x] |')}),/阶段跳勾 MATH-01/);
rejects('无合并证据不能交付',()=>({checklist:input.checklist.replace('| MATH-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |','| MATH-01 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/fake.md |')}),/合并缺commit证据/);
rejects('不能跳过前课',()=>({checklist:input.checklist.replace('| MATH-02 | [ ] |','| MATH-02 | [x] |')}),/跳过未合入前课/);
rejects('不能改成长章名',()=>({plan:input.plan.replace('| 数学基础 | 18 |','| 数学基础：控制理论所需的全部工具 | 18 |')}),/章名过长/);
test('证据文件不存在会失败',()=>{
  const result=validateSemester03({...input,evidence:true,checklist:input.checklist.replace('.agent/semester-03-baseline.json;','.agent/semester-03-never-exists.json;')});
  assert.match(result.errors.join('\n'),/证据不可读/);
});
