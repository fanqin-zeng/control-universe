# 学期3全局 checklist

目标范围与课程顺序见 [semester-03-plan.md](semester-03-plan.md)，历史起点见 [baseline](semester-03-baseline.json)。本文件是学期3唯一进度总入口；已有v1.3不等于本期完成。校验：`node scripts/check-semester03.mjs`。

状态规则：`[ ]` 未完成（进行中/阻塞写证据栏）；`[x]` 完成且有持久证据。课程逐列顺序推进；每个阶段应及时链接同一课日志，旧“合并”列表示交付已进入master，须有真实 `commit:<hash>`（普通提交或历史合并提交均可）；日常直接在master提交并推送，Pages另行授权。任务新增到任务表，课程新增/合并/拆分先改计划；不要删除来源或重置已完成历史。所有证据路径相对仓库根目录，支持 `#锚点`；多份证据用分号分隔。

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
| R01 | 全站验收与缺陷清零/明确处置 | [ ] | check、verify:all、nb、术语、build、链接及旧路由回归；正文主题对比度已本地修复并验收，.agent/fix-logs/2026-10-17-032.md;docs/deployment/lesson-theme-browser.json;已获授权并发布1df6328，docs/deployment/lesson-theme-public-http.json;docs/deployment/lesson-theme-public-browser.json；块级公式居中/围栏分行已获授权发布000f3b3（含MATH-03），.agent/semester-03/math-layout/acceptance.md; .agent/semester-03/math-layout/public-actions.json; .agent/semester-03/math-layout/public-http.json; .agent/semester-03/math-layout/public-browser.json；R01其余全站验收仍待执行 |
| R02 | 205课全交付与141来源去向复核 | [ ] | 所有课程合并列完成，56原文资产无遗失，统计以脚本为准 |
| R03 | 归因回顾、学期总结与版本标签 | [ ] | 沿用fix-tracker回顾，记录最终验收和semester03标签 |
| DEP01 | GitHub Pages静态导出与发布分支闸门 | [x] | docs/deployment/github-pages.md;docs/deployment/acceptance.md |
| DEP02 | 首次远端发布及公网验收 | [x] | docs/deployment/first-release.md;docs/deployment/first-release-http.json;docs/deployment/first-release-actions.json |
| DEP03 | Pyodide数学两课试验、控制库支持清单与授权发布 | [x] | docs/deployment/pyodide-trial.md;docs/deployment/pyodide-public-results.json;docs/deployment/pyodide-public-actions.json;docs/deployment/pyodide-public-ui.json |
| DEP04 | Pyodide逐课扩展、实验级降级与待办清单、授权发布 | [x] | docs/deployment/python-expansion-delivery.md;docs/deployment/python-expansion.md;docs/deployment/python-expansion-final-public-actions.json;docs/deployment/python-expansion-final-public-http.json;docs/deployment/python-expansion-final-public-ui.json |
| DEP05 | 数学章18课现有成果授权发布与公网验收 | [x] | docs/deployment/math18-release.md;docs/deployment/math18-public-actions.json;docs/deployment/math18-public-http.json;docs/deployment/math18-public-browser.json;docs/deployment/math18-public-python.json;发布commit:f01e0bbb52308a9cf277f1f2ff65b377c7e73cac |
| DEP06 | 经典控制11课现有成果授权发布与公网验收 | [x] | docs/deployment/classic11-release.md;docs/deployment/classic11-public-actions.json;docs/deployment/classic11-public-http.json;docs/deployment/classic11-public-browser.json;docs/deployment/classic11-public-python.json;docs/deployment/classic10-public-python.json;docs/deployment/classic11-public-validation.json;发布commit:0dad5f04b701f443752e10529720e07bcb46b918 |
| W06 | MATH-03开篇改用生活直观例子并讨论验收 | [x] | docs/discuss-log/semester-03/02-math/intro-proofreading-2026-10-18.md;.agent/semester-03/intro-proofreading/notebooks.json;.agent/semester-03/intro-proofreading/verify.log |
| W07 | MATH-04开篇建立已有概念或生活入口并讨论验收 | [x] | docs/discuss-log/semester-03/02-math/intro-proofreading-2026-10-18.md;.agent/semester-03/intro-proofreading/build.log;.agent/semester-03/intro-proofreading/browser.json |
| W08 | 数学不等号被轻量MDX扫描误认JSX导致实验漏检，补强扫描并全仓审计 | [ ] | .agent/semester-03/math-11/scanner-followup.md;.agent/semester-03/math-11/scanner-count.json |
| W09 | 开发IAB直连本地Jupyter网关的连接边界复核 | [ ] | .agent/semester-03/classic-01/acceptance.md;IAB页面显示Failed to fetch，8891原始严格内核与生产Pyodide实跑正常；后续区分浏览器环境/跨端口连接原因，不伪记原生UI通过 |
| P06 | 固化批阅新增开篇入口要求并核对MATH-06 | [x] | .agent/semester-03/proofreading-followup-2026-10-18.md;.agent/skills/wiki-discussion/references/semester-03-core.md;docs/discuss-log/semester-03/02-math/06-multivariable-calculus.md |
| W10 | 全站字符/公式框图逐项核图并重绘 | [ ] | .agent/semester-03/intro-proofreading/diagram-followup.md;.agent/semester-03/intro-proofreading/diagram-candidates.json;18课35候选待逐项处理，不含已修传递函数四图 |
| W11 | 传递函数字符框图改用SVG图示 | [x] | .agent/semester-03/intro-proofreading/diagram-followup.md;.agent/semester-03/intro-proofreading/feedback.png;.agent/semester-03/intro-proofreading/transfer-notebooks.json |
| W12 | 手机课程目录独立滚动与Pages验收 | [x] | .agent/semester-03/mobile-sidebar-scroll/acceptance.md;.agent/semester-03/mobile-sidebar-scroll/browser.json;.agent/semester-03/mobile-sidebar-scroll/pages-build.log;手机/横屏与Pages静态预览通过，待授权发布 |
| W13 | 非线性入口课长扫描来源保留与后续审查 | [ ] | .agent/semester-03/nonlinear-01/followup.md;.agent/semester-03/nonlinear-01/source-before.mdx;NONLINEAR-02已审拖块坐标/平衡偏移并做三速度三扰动T400局部核验；NONLINEAR-12跳跃/分支仍待审，不继承完整吸引域或抖振保证 |
| P07 | 改为master直接提交推送并兼容普通提交回执 | [x] | .agent/semester-03/master-workflow/acceptance.md;scripts/check-semester03.test.mjs;规则/技能与提交回执校验同步，11测试通过 |
| DEP07 | MODERN-01及此前现有修改授权发布与公网验收 | [x] | docs/deployment/modern01-release.md;docs/deployment/modern01-public-validation.json;发布commit:42eed1d509b90699fda0eff8d45f369d7dd7a210 |
| DEP08 | 现代控制章现有成果授权发布与公网验收 | [x] | docs/deployment/modern09-release.md;docs/deployment/modern09-public-validation.json;发布commit:9c8e988cd6cd10c1066c479f57799c76ef2514a4 |
| LP01 | 独立中文润色交接、完整计划与专用分支 | [x] | .agent/semester-03/zh-lang-edit/README.md;.agent/semester-03/zh-lang-edit/PLAN.md |
| LP02 | 清理代码框/前置课程的内部流程文案（已完成） | [x] | .agent/semester-03/zh-lang-edit/archive/classic-01/acceptance.md |
| LP03 | CLASSIC-01润色试稿后续处理 | [ ] | .agent/semester-03/zh-lang-edit/records/CLASSIC-01.md;未收到用户认可，后续交其他模型 |
<!-- S3-TASKS-END -->

## 逐课跟踪

严格按照下表顺序；结构/基建前置未完时不能预签发。第一课 MATH-01；共205课、1230个阶段/验收/合并格，初始全部未勾。

<!-- S3-PROGRESS-BEGIN -->
### 数学基础

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| MATH-01 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/01-calculus-basics.md;.agent/semester-03/math-01/acceptance.md;.agent/semester-03/math-02/acceptance.md;commit:0e7e5db670c69677abdb8aff629cc8340125462b |
| MATH-02 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/02-complex-numbers.md;.agent/semester-03/math-02/source-audit.json;.agent/semester-03/math-02/acceptance.md;commit:0af1920a5f103b4c2340c73f107480fe5f158bc5 |
| MATH-03 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/03-linear-algebra-basics.md;.agent/semester-03/math-03/acceptance.md;.agent/semester-03/math-03/reconciliation.json;commit:610cf519523d06a67e0b2431ce45d5a7ca73fd29 |
| MATH-04 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/04-eigen-decomposition.md;.agent/semester-03/math-04/acceptance.md;.agent/semester-03/math-04/reconciliation.json;commit:21e01b2e3fe76ca98402645d38780cd4c8e978fc |
| MATH-05 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/05-matrix-decomposition.md;.agent/semester-03/math-05/acceptance.md;.agent/semester-03/math-05/reconciliation.json;commit:04e98d5af707017cdf1ac293d7914a4a31c274c8 |
| MATH-06 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/06-multivariable-calculus.md;.agent/semester-03/math-06/acceptance.md;.agent/semester-03/math-06/reconciliation.json;commit:92df41203811f0eac79bb66470c53036bde361ad |
| MATH-07 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/07-ode-matrix-exponential.md;.agent/semester-03/math-07/acceptance.md;.agent/semester-03/math-07/reconciliation.json;commit:12bc125d414db3f5a8ffbdb54518357d064e84e9 |
| MATH-08 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/08-laplace-transform.md;.agent/semester-03/math-08/acceptance.md;.agent/semester-03/math-08/reconciliation.json;commit:f092f3e822bdfc4fd406679e4874ae1b91c492b0 |
| MATH-09 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/09-fourier-analysis.md;.agent/semester-03/math-09/acceptance.md;commit:cb048267cdca44cb6e07978306534a21313e0c2d |
| MATH-10 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/10-z-transform.md;.agent/semester-03/math-10/acceptance.md;commit:91e207ac296ff6349b6ab39cff332b156d162a63 |
| MATH-11 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/11-probability-basics.md;.agent/semester-03/math-11/acceptance.md;commit:7cdb3f9d22c16d458fde7e6d4a7ea14fb220d408 |
| MATH-12 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/12-stochastic-processes.md;.agent/semester-03/math-12/acceptance.md;commit:e4404751d8455b8d2d16c63ce9e9d19c2f546227 |
| MATH-13 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/13-convex-optimization.md;.agent/semester-03/math-13/acceptance.md;commit:31484f051c09edda86b7c93c4a50b1d5da430fcd |
| MATH-14 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/14-variational-dp.md;.agent/semester-03/math-14/acceptance.md;commit:c8774d79e26a1207d005c3fc4a679f4482720d1b |
| MATH-15 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/15-diff-geometry.md;.agent/semester-03/math-15/acceptance.md;commit:9cc0ee3814532bdb5ed5bb8006fb1aacde70dbab |
| MATH-16 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/16-graph-theory.md;.agent/semester-03/math-16/acceptance.md;commit:942255b69c73be4a3d864b07a6ffe02833698830 |
| MATH-17 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/17-game-theory-math.md;.agent/semester-03/math-17/acceptance.md;commit:680e508d68527bebc9866a5b40c09c1c4b707230 |
| MATH-18 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/02-math/18-numerical-methods.md;.agent/semester-03/math-18/acceptance.md;commit:b4d3b8e22c63cbbf159fffaa2401d3998aa1c598 |

### 经典控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| CLASSIC-01 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/01-system-modeling.md;.agent/semester-03/classic-01/acceptance.md;commit:c8fb52614a20e35331d666f2ab0d5c68e80e7508 |
| CLASSIC-02 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/02-transfer-function.md;.agent/semester-03/classic-02/acceptance.md;commit:1b3481632b724d91c6d9eee481b19ccbff2e864d |
| CLASSIC-03 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/03-time-domain-analysis.md;.agent/semester-03/classic-03/acceptance.md;commit:54e282c063f164ae4d6c21cfa6ab7af57be6b0c0 |
| CLASSIC-04 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/04-stability-analysis.md;.agent/semester-03/classic-04/acceptance.md;commit:e2ef9828b225e15b2fa7714e45589802605b86ea |
| CLASSIC-05 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/05-frequency-domain-analysis.md;.agent/semester-03/classic-05/acceptance.md;commit:be726e8967190e4d01e979fcf6fec62c9183a7cf |
| CLASSIC-06 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/06-root-locus.md;.agent/semester-03/classic-06/acceptance.md;commit:605c2827164fcbd5c0d9cbed0a6055a79108a9db |
| CLASSIC-07 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/07-pid-controller.md;.agent/semester-03/classic-07/acceptance.md;commit:b6d6322da07120330c796585a4864d95cf0bbd2f |
| CLASSIC-08 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/08-compensator-design.md;.agent/semester-03/classic-08/acceptance.md;commit:5c65da108a2376b81e52b6aeed49c4cda86a36ef |
| CLASSIC-09 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/09-frequency-response-design.md;.agent/semester-03/classic-09/acceptance.md;commit:950cbc5627c0f6ea70709fafa0c8c9d1a0c361e7 |
| CLASSIC-10 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/10-design-methods-comparison.md;.agent/semester-03/classic-10/acceptance.md;commit:5194247ebad0d62c72b96e26ce67eb123f016f1f |
| CLASSIC-11 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/03-classic/11-classic-case-study.md;.agent/semester-03/classic-11/acceptance.md;commit:eed1fd736d54b3bd5620ee4884957aa3609f88a3 |

### 现代控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| MODERN-01 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/04-modern/01-state-space.md;.agent/semester-03/modern-01/acceptance.md;commit:7e4ee5f20a2eea96801cd309c8ccfbf126d83a55 |
| MODERN-02 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/04-modern/02-controllability-observability.md;.agent/semester-03/modern-02/acceptance.md;commit:0d30ee53c995c853053625854687ca18b7d070da |
| MODERN-03 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/04-modern/03-lyapunov-modern.md;.agent/semester-03/modern-03/acceptance.md;commit:58d4e41048ac211950c14581e071c638501c1a00 |
| MODERN-04 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/04-modern/04-state-feedback.md;.agent/semester-03/modern-04/acceptance.md;commit:d58259df22e3c214f372da5472ce4764bff71bb8 |
| MODERN-05 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/04-modern/05-state-observer.md;.agent/semester-03/modern-05/acceptance.md;commit:acf35e839be30e6a902d2d684509ae7626c7cd00 |
| MODERN-06 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/04-modern/06-optimal-control-basics.md;.agent/semester-03/modern-06/acceptance.md;commit:cbfc8a937171640a7a8667a89032444d5a11a766 |
| MODERN-07 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/04-modern/07-lqr-controller.md;commit:e9ff6c6bb0cf5ffceee48713ff9dc2bd76ac222a |
| MODERN-08 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/04-modern/08-multivariable-systems.md;commit:3a2192e6210406717f91d4ba20f11e9d3b9a769a |
| MODERN-09 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/04-modern/09-modern-case-study.md;.agent/semester-03/s04-course-debts.json;commit:3a29ccf820779fe8ef6ef9016bfaa27d49351d7d |

### 非线性控制

| ID | Phase 1 | Phase 2 | Phase 3 | Phase 4 | 验收 | 合并 | 证据 |
|---|---|---|---|---|---|---|---|
| NONLINEAR-01 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/05-nonlinear/01-nonlinear-characteristics.md;.agent/semester-03/nonlinear-01/acceptance.md;.agent/semester-03/nonlinear-01/delivery-validation.json;commit:9d6d31e22b460a1102d3dbf6d8672770939f4be8 |
| NONLINEAR-02 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/05-nonlinear/02-phase-plane.md;.agent/semester-03/nonlinear-02/acceptance.md;.agent/semester-03/nonlinear-02/delivery-validation.json;commit:064e0d47a70f7e805d4d6a7df777ed5b82e4da41 |
| NONLINEAR-03 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/05-nonlinear/03-lyapunov-stability.md;.agent/semester-03/nonlinear-03/acceptance.md;commit:15e7512a3361343fee8b75c80693c9f3f6310d6e |
| NONLINEAR-04 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/05-nonlinear/04-describing-function.md;.agent/semester-03/nonlinear-04/acceptance.md;commit:8dc6b5234ad7a7b721895a3c11b928c106b159c4;S04本课第5项债务已验收 |
| NONLINEAR-05 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/05-nonlinear/05-feedback-linearization.md;.agent/semester-03/nonlinear-05/acceptance.md;commit:c249d3bc0df1f2005f794d0c2a4486b4eedc8ead |
| NONLINEAR-06 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/05-nonlinear/06-sliding-mode-control.md;.agent/semester-03/nonlinear-06/acceptance.md;commit:0e10841f328442190c4afab041f83af7d0f9b20b |
| NONLINEAR-07 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/05-nonlinear/07-backstepping.md;.agent/semester-03/nonlinear-07/acceptance.md;commit:dd961a7caf18390888c3e3c78ee29044cb82f789 |
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

## 独立中文润色

全205课名单、状态及每课记录见 `.agent/semester-03/zh-lang-edit/PLAN.md`。润色分支 `codex/semester-03-zh-lang-edit`，仅用户明确要求时审核合入 master；此表原课程生产状态不受润色状态影响。
