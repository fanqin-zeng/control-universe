import {test} from 'node:test';
import assert from 'node:assert/strict';
import {auditFixLogs,readFixLogs} from './check-fix-logs.mjs';
const index=`<!-- FIX-INDEX-BEGIN -->
| # | 日期 | 文档 | 章节 | 类型 | 归因角色 | 摘要 |
|---|---|---|---|---|---|---|
| [001](2026-09-22-001.md) | 2026-09-22 | content/a/b.mdx | 例 | BUG | 秦构（清单缺项） | max\\|e\\| |
<!-- FIX-INDEX-END -->
<!-- FIX-RESERVED-BEGIN -->
| 编号 | 状态 | 依据 |
|---|---|---|
| 002 | 预留待核 | 证据不足，不是已修复 |
<!-- FIX-RESERVED-END -->`;
const detail=`---
date: 2026-09-22
doc: content/a/b.mdx
type: BUG
---
# Fix-001
归因角色：秦构
`;
const fixture={index,files:{'2026-09-22-001.md':detail},personas:'| 验证团队 | 2 | 秦构、柯验 | 否 |\n## 教授团队'};
test('真实仓库双向一致',()=>assert.deepEqual(auditFixLogs(readFixLogs()).errors,[]));
test('转义竖线与预留号不产生伪错误',()=>assert.deepEqual(auditFixLogs(fixture).errors,[]));
test('后续句子提及其他角色不改变归因',()=>assert.deepEqual(auditFixLogs({...fixture,files:{'2026-09-22-001.md':detail.replace('归因角色：秦构','归因角色：秦构。其他核验由柯验执行。')}}).errors,[]));
const reject=(name,mutate,pattern)=>test(name,()=>assert.match(auditFixLogs({...fixture,...mutate()}).errors.join('\n'),pattern));
reject('遗留合并标记会失败',()=>({index:index+'\n'+ '<'.repeat(7)+' HEAD'}),/冲突标记/);
reject('缺详情会失败',()=>({files:{}}),/缺详情文件/);
reject('孤儿详情会失败',()=>({files:{...fixture.files,'2026-09-22-003.md':detail}}),/未入索引详情/);
reject('重复索引编号会失败',()=>({index:index.replace('<!-- FIX-INDEX-END -->',index.split('\n')[3]+'\n<!-- FIX-INDEX-END -->')}),/索引编号重复/);
reject('文件日期与索引链接不符会失败',()=>({index:index.replace('[001](2026-09-22-001.md)','[001](2026-09-23-001.md)')}),/索引日期\/编号与链接不符/);
reject('详情声明日期不符会失败',()=>({files:{'2026-09-22-001.md':detail.replace('date: 2026-09-22','date: 2026-09-23')}}),/详情日期不一致/);
reject('详情类型不符会失败',()=>({files:{'2026-09-22-001.md':detail.replace('type: BUG','type: BOTH')}}),/详情类型不一致/);
reject('详情角色不符会失败',()=>({files:{'2026-09-22-001.md':detail.replace('归因角色：秦构','归因角色：柯验')}}),/详情归因角色不一致/);
reject('未解释的编号空洞会失败',()=>({index:index.replace('| 002 |','| 003 |')}),/未解释的编号空洞: 002/);
reject('预留编号不能有详情文件',()=>({files:{...fixture.files,'2026-09-22-002.md':detail}}),/预留号已有详情/);
reject('不能重复使用预留编号',()=>({index:index.replace('| 002 |','| 001 |')}),/预留编号重复\/已占用/);
reject('正文主路径不符会失败',()=>({files:{'2026-09-22-001.md':detail.replace('content/a/b.mdx','content/a/c.mdx')}}),/详情主文档不一致/);
reject('预留标记缺失不能悄悄忽略',()=>({index:index.replace('<!-- FIX-RESERVED-END -->','')}),/FIX-RESERVED 标记/);
