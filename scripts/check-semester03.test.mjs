import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateSemester03,assertCommitOnMaster} from './check-semester03.mjs';
const input={plan:readFileSync('.agent/semester-03-plan.md','utf8'),checklist:readFileSync('.agent/semester-03-checklist.md','utf8'),baseline:JSON.parse(readFileSync('.agent/semester-03-baseline.json','utf8')),evidence:false};
test('当前计划与台账一致',()=>assert.deepEqual(validateSemester03(input).errors,[]));
const rejects=(name,mutate,pattern)=>test(name,()=>assert.match(validateSemester03({...input,...mutate()}).errors.join('\n'),pattern));
rejects('遗漏来源会失败',()=>({plan:input.plan.replace('| math/complex-numbers | 复数基础 | 重构 | math/complex-numbers |','| math/complex-numbers | 复数基础 | 新写 | — |')}),/来源未覆盖 math\/complex-numbers/);
rejects('误把旧文算新写会失败',()=>({plan:input.plan.replace('| 复数基础 | 重构 |','| 复数基础 | 新写 |')}),/模式与来源正文不符 MATH-02/);
rejects('重复目标路径会失败',()=>({plan:input.plan.replace('| math/complex-numbers |','| math/calculus-basics |')}),/目标路径 重复/);
rejects('遗漏课程进度会失败',()=>({checklist:input.checklist.replace(/^\| MATH-01 .*\r?\n/m,'')}),/课程未入台账 MATH-01/);
rejects('跳阶段打勾会失败',()=>({checklist:input.checklist.replace(/^\| MATH-01 .*$/m,'| MATH-01 | [ ] | [x] | [ ] | [ ] | [ ] | [ ] | — |')}),/阶段跳勾 MATH-01/);
rejects('无master提交证据不能交付',()=>({checklist:input.checklist.replace(/^\| MATH-01 .*$/m,'| MATH-01 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/fake.md |')}),/合并缺commit证据/);
rejects('不能跳过前课',()=>({checklist:input.checklist.replace(/^\| MATH-01 .*$/m,'| MATH-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |')}),/跳过未合入前课/);
rejects('移除用户换课登记后仍拒绝跳过前课',()=>({plan:input.plan.replace(/<!-- S3-ORDER-EXCEPTIONS-BEGIN -->[\s\S]*?<!-- S3-ORDER-EXCEPTIONS-END -->/,'')}),/跳过未合入前课 DISCRETE-02/);
rejects('DISCRETE-02例外本身不放行DISCRETE-03',()=>({plan:input.plan.replace(/^\| DISCRETE-03 \| DISCRETE-01 \|.*\r?\n/m,''),checklist:input.checklist.replace(/^\| DISCRETE-03 .*$/m,'| DISCRETE-03 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/fake.md |')}),/跳过未合入前课 DISCRETE-03/);
rejects('其它课例外本身不放行DISCRETE-04',()=>({plan:input.plan.replace(/^\| DISCRETE-04 \| DISCRETE-01 \|.*\r?\n/m,''),checklist:input.checklist.replace(/^\| DISCRETE-04 .*$/m,'| DISCRETE-04 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/fake.md |')}),/跳过未合入前课 DISCRETE-04/);
rejects('其它课例外本身不放行DISCRETE-05',()=>({plan:input.plan.replace(/^\| DISCRETE-05 \| DISCRETE-01 \|.*\r?\n/m,''),checklist:input.checklist.replace(/^\| DISCRETE-05 .*$/m,'| DISCRETE-05 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/fake.md |')}),/跳过未合入前课 DISCRETE-05/);
rejects('其它课例外本身不放行DISCRETE-06',()=>({plan:input.plan.replace(/^\| DISCRETE-06 \| DISCRETE-01 \|.*\r?\n/m,''),checklist:input.checklist.replace(/^\| DISCRETE-06 .*$/m,'| DISCRETE-06 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/fake.md |')}),/跳过未合入前课 DISCRETE-06/);
rejects('其它课例外本身不放行DISCRETE-07',()=>({plan:input.plan.replace(/^\| DISCRETE-07 \| DISCRETE-01 \|.*\r?\n/m,''),checklist:input.checklist.replace(/^\| DISCRETE-07 .*$/m,'| DISCRETE-07 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/fake.md |')}),/跳过未合入前课 DISCRETE-07/);
rejects('换课例外不能登记不存在的前课',()=>({plan:input.plan.replace('| DISCRETE-02 | DISCRETE-01 |','| DISCRETE-02 | NONEXISTENT-01 |')}),/顺序例外不是有效前课/);
rejects('换课例外必须有用户依据',()=>({plan:input.plan.replace('2026-10-19用户明确要求“继续DISCRETE-02”','模型自行决定')}),/顺序例外缺用户换课依据/);
rejects('不能改成长章名',()=>({plan:input.plan.replace('| 数学基础 | 18 |','| 数学基础：控制理论所需的全部工具 | 18 |')}),/章名过长/);
test('证据文件不存在会失败',()=>{
  const result=validateSemester03({...input,evidence:true,checklist:input.checklist.replace('.agent/semester-03-baseline.json;','.agent/semester-03-never-exists.json;')});
  assert.match(result.errors.join('\n'),/证据不可读/);
});

test('master普通提交和历史合并均可交付，未进入master或不存在的提交不能交付',t=>{
  const prefix=join(tmpdir(),'control-universe-git-policy-');
  const root=mkdtempSync(prefix);
  t.after(()=>{assert(resolve(root).startsWith(resolve(prefix)));rmSync(root,{recursive:true,force:true});});
  const git=(...args)=>execFileSync('git',['-c','user.name=Policy Test','-c','user.email=policy@example.invalid','-c','commit.gpgsign=false',...args],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-b','master');
  git('commit','--allow-empty','-m','initial');
  git('commit','--allow-empty','-m','direct master work');
  const direct=git('rev-parse','HEAD');
  assert.doesNotThrow(()=>assertCommitOnMaster(root,direct));
  git('checkout','-b','maintenance');
  git('commit','--allow-empty','-m','independent work');
  const other=git('rev-parse','HEAD');
  git('checkout','master');
  assert.throws(()=>assertCommitOnMaster(root,other));
  assert.throws(()=>assertCommitOnMaster(root,'0000000000000000000000000000000000000000'));
  git('merge','--no-ff','maintenance','-m','historical merge');
  assert.doesNotThrow(()=>assertCommitOnMaster(root,git('rev-parse','HEAD')));
  assert.doesNotThrow(()=>assertCommitOnMaster(root,other));
});

rejects('其它课例外本身不放行DISCRETE-08',()=>({plan:input.plan.replace(/^\| DISCRETE-08 \| DISCRETE-01 \|.*\r?\n/m,''),checklist:input.checklist.replace(/^\| DISCRETE-08 .*$/m,'| DISCRETE-08 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/fake.md |')}),/跳过未合入前课 DISCRETE-08/);

rejects('已登记例外不自动放行DISCRETE-09',()=>({checklist:input.checklist.replace(/^\| DISCRETE-09 .*$/m,'| DISCRETE-09 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/fake.md |')}),/跳过未合入前课 DISCRETE-09/);
