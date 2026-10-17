# 学期3全局 checklist

目标范围与课程顺序见 [semester-03-plan.md](semester-03-plan.md)，历史起点见 [baseline](semester-03-baseline.json)。本文件是学期3唯一进度总入口；已有v1.3不等于本期完成。校验：`node scripts/check-semester03.mjs`。

状态规则：`[ ]` 未完成（进行中/阻塞写证据栏）；`[x]` 完成且有持久证据。课程逐列顺序推进；每个阶段应及时链接同一课日志，合并列须有真实 `commit:<hash>`。任务新增到任务表，课程新增/合并/拆分先改计划；不要删除来源或重置已完成历史。所有证据路径相对仓库根目录，支持 `#锚点`；多份证据用分号分隔。

## 治理、结构、基建与收官

<!-- S3-TASKS-BEGIN -->
| ID | 事项 | 完成 | 证据/下一步 |
|---|---|---|---|
| P01 | 起点实测与不可变来源快照 | [x] | .agent/semester-03-baseline.json;.agent/semester-03-validation.md |
| P02 | 结构诊断、技术调研与完整目标映射 | [x] | .agent/semester-03-plan.md |
| P03 | 新写/重构技能及共同门槛 | [x] | .agent/skills/wiki-lesson-new/SKILL.md;.agent/skills/wiki-lesson-refactor/SKILL.md;.agent/skills/wiki-discussion/references/semester-03-core.md |
| P04 | 全局台账、覆盖/勾选校验及异常用例 | [x] | .agent/semester-03-validation.md;scripts/check-semester03.mjs;scripts/check-semester03.test.mjs |
| P05 | 两技能静态验证与场景试走 | [x] | .agent/semester-03-validation.md |
| I01 | 构建吞MDX错误门槛修复与失败样本验证 | [x] | .agent/semester-03/i01-mdx-errors.md;.agent/fix-logs/2026-10-17-027.md |
| I02 | 历史fix索引冲突标记与记录一致性审计 | [x] | .agent/semester-03/i02-fix-index.md;.agent/fix-logs/2026-10-17-028.md |
| I03 | 36项基线WARN逐项分类并登记处置 | [x] | .agent/semester-03/i03-warn-audit.md;.agent/semester-03/i03-warnings-baseline.json;.agent/semester-03/i03-anchor-evidence.json |
| I04 | 内核、数值与页面验收可复现性 | [x] | .agent/semester-03/i04-reproducibility.md;.agent/semester-03/i04-reproducibility-results.json;.agent/fix-logs/2026-10-17-029.md |
| S01 | 结构迁移清单与来源/依赖审查 | [x] | .agent/semester-03/s01-migration-review.md;.agent/semester-03/s01-dependency-review.md;.agent/semester-03/s01-migration-inventory.json;scripts/check-migration-review.mjs |
| S02 | 21章catalog骨架与纯资产迁移 | [x] | .agent/semester-03/s02-structure-migration.md;scripts/check-structure-migration.mjs;.agent/semester-03/s02-route-results.json;.agent/semester-03/s02-warnings.json |
| S03 | 旧URL、锚点、引用与台账兼容 | [x] | .agent/semester-03/s03-compatibility.md;.agent/semester-03/s03-compat-results.json;scripts/verify-migration-compat.mjs;9旧入口、迁移旧片段、10活跃引用及历史日志身份通过；全站锚点W01/W04/W05仍待办 |
| S04 | 结构迁移验收与master合入 | [x] | .agent/semester-03/s04-structure-acceptance.md;.agent/semester-03/s04-acceptance-results.json;结构技术门槛已过；课程仍按Phase1–4 |
| W01 | Q5：26页侧栏锚点对齐与旧链接兼容 | [x] | .agent/semester-03/s04-structure-acceptance.md;.agent/semester-03/s04-acceptance-results.json;真实DOM、旧ID与canonical去向通过 |
| W02 | Q3：两个孤儿组件的用途与资产去向 | [x] | .agent/semester-03/s04-structure-acceptance.md;.agent/semester-03/s04-acceptance-results.json;结构技术门槛已过；课程仍按Phase1–4 |
| W03 | Q20：30条孤立课程与7零先修章逐项核验 | [x] | .agent/semester-03/s04-structure-acceptance.md;.agent/semester-03/s04-acceptance-results.json;结构技术门槛已过；课程仍按Phase1–4 |
| W04 | S3-Q001：真实渲染锚点生成与验收契约 | [x] | .agent/semester-03/s04-structure-acceptance.md;.agent/semester-03/s04-acceptance-results.json;结构技术门槛已过；课程仍按Phase1–4 |
| W05 | Q6：两页MPC正文吞入数学块的渲染修复 | [x] | .agent/semester-03/s04-structure-acceptance.md;.agent/semester-03/s04-acceptance-results.json;结构技术门槛已过；课程仍按Phase1–4 |
| R01 | 全站验收与缺陷清零/明确处置 | [ ] | check、verify:all、nb、术语、build、链接及旧路由回归；旧正文在当前主题下的对比度另审，docs/deployment/python-expansion-contrast-local.png;本次仅修复Python实验区 |
| R02 | 205课全交付与141来源去向复核 | [ ] | 所有课程合并列完成，56原文资产无遗失，统计以脚本为准 |
| R03 | 归因回顾、学期总结与版本标签 | [ ] | 沿用fix-tracker回顾，记录最终验收和semester03标签 |
| DEP01 | GitHub Pages静态导出与发布分支闸门 | [x] | docs/deployment/github-pages.md;docs/deployment/acceptance.md |
| DEP02 | 首次远端发布及公网验收 | [x] | docs/deployment/first-release.md;docs/deployment/first-release-http.json;docs/deployment/first-release-actions.json |
| DEP03 | Pyodide数学两课试验、控制库支持清单与授权发布 | [x] | docs/deployment/pyodide-trial.md;docs/deployment/pyodide-public-results.json;docs/deployment/pyodide-public-actions.json;docs/deployment/pyodide-public-ui.json |
| DEP04 | Pyodide逐课扩展、实验级降级与待办清单、授权发布 | [x] | docs/deployment/python-expansion-delivery.md;docs/deployment/python-expansion.md;docs/deployment/python-expansion-final-public-actions.json;docs/deployment/python-expansion-final-public-http.json;docs/deployment/python-expansion-final-public-ui.json |
<!-- S3-TASKS-END -->

## 逐课跟踪

严格按照下表顺序；结构/基建前置未完时不能预签发。第一课 MATH-01；共205课、1230个阶段/验收/合并格，初始全部未勾。

<!-- S3-PROGRESS-BEGIN -->
### 数学基础

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| MATH-01 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/01-calculus-basics.md;.agent/semester-03/math-01/acceptance.md;.agent/semester-03/math-02/acceptance.md;commit:0e7e5db670c69677abdb8aff629cc8340125462b |
| MATH-02 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/02-complex-numbers.md;.agent/semester-03/math-02/source-audit.json;.agent/semester-03/math-02/acceptance.md;commit:0af1920a5f103b4c2340c73f107480fe5f158bc5 |
| MATH-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-11 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-12 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-13 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-14 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-15 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-16 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-17 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MATH-18 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 经典控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| CLASSIC-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| CLASSIC-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| CLASSIC-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| CLASSIC-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| CLASSIC-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| CLASSIC-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| CLASSIC-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| CLASSIC-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| CLASSIC-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| CLASSIC-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| CLASSIC-11 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 现代控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| MODERN-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MODERN-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MODERN-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MODERN-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MODERN-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MODERN-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MODERN-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MODERN-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MODERN-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |

### 非线性控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| NONLINEAR-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| NONLINEAR-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-11 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| NONLINEAR-12 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 离散控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| DISCRETE-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DISCRETE-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DISCRETE-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DISCRETE-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DISCRETE-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DISCRETE-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DISCRETE-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| DISCRETE-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DISCRETE-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DISCRETE-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 控制实现

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| IMPL-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| IMPL-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| IMPL-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| IMPL-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| IMPL-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| IMPL-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| IMPL-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| IMPL-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| IMPL-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| IMPL-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 机器学习

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| ML-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ML-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ML-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ML-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ML-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ML-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ML-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ML-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ML-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 系统辨识

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| ID-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ID-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ID-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ID-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ID-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ID-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ID-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ID-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ID-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 状态估计

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| EST-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EST-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EST-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s02-structure-migration.md;S02实跑发现存量setup缺plt及ipywidgets，Phase1审计;.agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| EST-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EST-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EST-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EST-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EST-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 鲁棒控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| ROBUST-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| ROBUST-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBUST-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBUST-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBUST-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| ROBUST-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBUST-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBUST-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBUST-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBUST-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBUST-11 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 预测控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| MPC-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| MPC-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| MPC-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| MPC-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| MPC-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MPC-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| MPC-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MPC-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |
| MPC-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MPC-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MPC-11 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s04-course-debts.json;Phase1处理已登记验收债务 |

### 智能控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| INTEL-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| INTEL-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| INTEL-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| INTEL-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| INTEL-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| INTEL-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| INTEL-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| INTEL-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 强化学习控制基础

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| RL-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-11 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RL-12 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 多智能体控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| MULTI-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MULTI-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MULTI-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MULTI-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MULTI-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MULTI-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MULTI-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | .agent/semester-03/s02-structure-migration.md;S02保留锚点/无效language属性与日志债务 |
| MULTI-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| MULTI-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 安全控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| SAFE-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| SAFE-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| SAFE-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| SAFE-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| SAFE-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| SAFE-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| SAFE-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| SAFE-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 机器人控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| ROBOT-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBOT-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBOT-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBOT-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBOT-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBOT-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBOT-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBOT-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBOT-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| ROBOT-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 机器人学习

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| RLEARN-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RLEARN-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RLEARN-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RLEARN-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RLEARN-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RLEARN-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RLEARN-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RLEARN-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RLEARN-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| RLEARN-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 具身智能

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| EMBODIED-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EMBODIED-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EMBODIED-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EMBODIED-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EMBODIED-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EMBODIED-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EMBODIED-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EMBODIED-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EMBODIED-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| EMBODIED-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 自动驾驶

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| DRIVING-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-07 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-08 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-09 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-10 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| DRIVING-11 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 工程应用

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| APP-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| APP-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| APP-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| APP-04 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| APP-05 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| APP-06 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |

### 控制导论

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| INTRO-01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| INTRO-02 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
| INTRO-03 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | — |
<!-- S3-PROGRESS-END -->
