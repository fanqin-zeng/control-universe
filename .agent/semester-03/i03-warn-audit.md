# I03：36项基线WARN审计与处置台账

日期：2026-10-17；起点master `d8805ff`；工作包 `wp/s3-i03-warn-audit`。本次审计、分类和登记，不批量修改课程、目录、组件或降低检查级别。

## 口径与证据

`npm run check` 当前实测 PASS17 / WARN36 / FAIL0，与学期3立项口径一致。**36指脚本发出的WARN条目数**，不是受影响课程、锚点或资产的数量：

| 问题类别 | WARN数 | 受影响范围 | 处置主线 |
|---|---|---|---|
| 重复slug | 3 | 三组迁移期重复课程 | S02/S03合并及兼容 |
| 缺讨论日志 | 1 | 35份现有正文 | 按附表A逐课Phase1–4，不批量追认 |
| 孤儿组件 | 2 | 两个不同登记状态的Explorer | W02资产去向审查 |
| 小节锚点差异 | 26 | 源码预估75处差异；26页DOM已实查 | W01/W04，受损正文先W05 |
| 章内先修倒置 | 2 | 离散控制两课 | S01/S02重排与核依赖 |
| 孤立课程 | 1 | 30条源课程，见附表B | W03逐课审查 |
| 整章零先修边 | 1 | 7章 | W03/S01核先修合同 |
| **合计** | **36** | 聚合警告不拆计数，不遗漏其成员 | |

[机器输出快照](i03-warnings-baseline.json) 固化36条原始message、来源节号和附带明细；[DOM实测](i03-anchor-evidence.json) 保存26页HTTP、H2数量、KaTeX错误和catalog/源码预估/DOM三路锚点差异。JSON是本期审计证据，不是另一份运行catalog或进度源。

分类：7项“已知待处理”、29项“阻塞”、本次新增脚本WARN为0。这里的阻塞指表内指定的**结构验收或相应课程签发**，不表示审计任务不能合入。I03勾选仅代表每项已查清并有去向，I03当时36项底层问题均为待处理；当前状态列已按S04追加关闭证据，分类/优先级保留最初风险口径，不予笼统豁免。P0是整段正文不可读，P1是导航/依赖/日志交付门槛，P2是兼容期或资产治理。

## 逐项处置

每行ID对应快照中同名记录，精确原文和锚点对照保留在JSON；表内任务ID都必须存在于全局checklist。组件关联课程只是待Phase1确认的复用候选，不据此直接插入教学内容。

<!-- I03-WARNINGS-BEGIN -->
| ID | 对象/证据 | 分类 | 优先级 | 影响与处置 | 后续任务 | 截止/关闭条件 | 状态 |
|---|---|---|---|---|---|---|---|
| BW-001 | modern/kalman-filter、estimation/kalman-filter | 已知待处理 | P2 | 按计划合一到estimation/kalman-filter；保留有正文一侧，校验旧URL、引用及先修迁移；关闭证据: .agent/semester-03/s04-structure-acceptance.md | S02;S03;EST-03 | S04前完成迁移；重复slug当前不造成路由冲突 | 已关闭 |
| BW-002 | rl-control/safe-rl、safety-ftc/safe-rl | 已知待处理 | P2 | 按计划合一到safety-ftc/safe-rl；保留有正文一侧，校验旧URL、引用及先修迁移；关闭证据: .agent/semester-03/s04-structure-acceptance.md | S02;S03;SAFE-06 | S04前完成迁移；重复slug当前不造成路由冲突 | 已关闭 |
| BW-003 | rl-control/multi-agent-rl、multi-agent/multi-agent-rl | 已知待处理 | P2 | 按计划合一到multi-agent/multi-agent-rl；保留有正文一侧，校验旧URL、引用及先修迁移；关闭证据: .agent/semester-03/s04-structure-acceptance.md | S02;S03;MULTI-08 | S04前完成迁移；重复slug当前不造成路由冲突 | 已关闭 |
| BW-004 | 35课缺讨论日志（附表A逐课列出） | 阻塞 | P1 | 按生产顺序逐课执行Phase1–4，生成真实本期日志，不伪造历史补档；由35个目标课程行跟踪 | R02 | 每门对应课程签发前补齐；全部覆盖后关闭本项 | 待处理 |
| BW-005 | BodeMarginsExplorer，未引用且未登记 | 已知待处理 | P2 | W02核教学需求；需复用则关联课程后注册并显式引用、跑默认值/边界验收；无用途则移除或归档；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W02;CLASSIC-09 | 引用前必须登记；W02关闭须有去向及全站引用扫描 | 已关闭 |
| BW-006 | FirstOrderComparisonExplorer，已登记未引用 | 已知待处理 | P2 | W02核对fix023删组件背景和后续需求；不再使用则同步清理实现/注册，保留复用须指定目标课与交付时点；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W02;CLASSIC-01 | 不得仅为消WARN插入课文；明确去向后复查孤儿数 | 已关闭 |
| BW-007 | classic/frequency-domain-analysis（源码差异1处；DOM H2 13/13） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;CLASSIC-05 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-008 | classic/frequency-response-design（源码差异1处；DOM H2 10/10） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;CLASSIC-09 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-009 | modern/state-observer（源码差异1处；DOM H2 9/9） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;MODERN-05 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-010 | modern/optimal-control-basics（源码差异4处；DOM H2 10/10） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;MODERN-06 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-011 | nonlinear/nonlinear-characteristics（源码差异3处；DOM H2 11/11） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;NONLINEAR-01 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-012 | nonlinear/phase-plane（源码差异6处；DOM H2 15/15） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;NONLINEAR-02 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-013 | nonlinear/lyapunov-stability（源码差异3处；DOM H2 13/13） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;NONLINEAR-03 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-014 | nonlinear/feedback-linearization（源码差异3处；DOM H2 15/15） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;NONLINEAR-05 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-015 | discrete-sampled/z-transform-analysis（源码差异4处；DOM H2 11/11） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;DISCRETE-04 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-016 | discrete-sampled/discretization-methods（源码差异2处；DOM H2 8/8） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;DISCRETE-06 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-017 | discrete-sampled/discrete-stability-criteria（源码差异3处；DOM H2 9/9） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;DISCRETE-05 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-018 | implementation/digital-pid（源码差异3处；DOM H2 8/8） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;IMPL-02 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-019 | mpc/mpc-principle（源码差异3处；DOM H2 1/8） | 阻塞 | P0 | W01按实际DOM校正catalog小节slug与旧锚点兼容；先由W05恢复正文和数学渲染，再核锚点；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;W05;MPC-01 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-020 | mpc/prediction-model（源码差异1处；DOM H2 10/10） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;MPC-02 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-021 | mpc/receding-horizon（源码差异4处；DOM H2 2/11） | 阻塞 | P0 | W01按实际DOM校正catalog小节slug与旧锚点兼容；先由W05恢复正文和数学渲染，再核锚点；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;W05;MPC-03 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-022 | mpc/constraint-handling（源码差异1处；DOM H2 12/12） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;MPC-04 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-023 | mpc/mpc-case-study（源码差异1处；DOM H2 12/12） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;MPC-11 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-024 | mpc/generalized-predictive-control（源码差异8处；DOM H2 16/16） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;MPC-06 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-025 | mpc/nonlinear-mpc（源码差异6处；DOM H2 16/16） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;MPC-08 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-026 | mpc/distributed-mpc（源码差异3处；DOM H2 13/13） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;MULTI-07 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-027 | robust/robustness-concept（源码差异2处；DOM H2 10/10） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;ROBUST-01 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-028 | robust/h-infinity-basics（源码差异1处；DOM H2 9/9） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;ROBUST-05 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-029 | robust/mu-synthesis（源码差异3处；DOM H2 11/11） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;ROBUST-08 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-030 | intelligent/fuzzy-control-basics（源码差异2处；DOM H2 12/12） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;INTEL-01 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-031 | intelligent/fuzzy-controller-design（源码差异3处；DOM H2 14/14） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;INTEL-02 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-032 | intelligent/neural-network-control（源码差异3处；DOM H2 12/12） | 阻塞 | P1 | W01按实际DOM校正catalog小节slug与旧锚点兼容；结合W04统一锚点生成/验收，禁止只信源码预估；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W01;INTEL-05 | S04及关联课程签发前：实际链接目标存在，H2对齐，katex-error=0 | 已关闭 |
| BW-033 | discrete-sampled/z-transform-analysis 先修本章后面的discrete-time-freq | 阻塞 | P1 | S01依目标顺序先安排采样与量化，S02重排并核真实依赖，不靠删边掩盖逆序；关闭证据: .agent/semester-03/s04-structure-acceptance.md | S01;S02;DISCRETE-04 | S04前章内倒置为0；相关课交付前先修实际可学 | 已关闭 |
| BW-034 | discrete-sampled/discretization-methods 先修本章后面的discrete-time-freq | 阻塞 | P1 | S01依目标顺序先安排采样与量化，S02重排并核真实依赖，不靠删边掩盖逆序；关闭证据: .agent/semester-03/s04-structure-acceptance.md | S01;S02;DISCRETE-06 | S04前章内倒置为0；相关课交付前先修实际可学 | 已关闭 |
| BW-035 | 30条孤立源条目（附表B逐课列出） | 已知待处理 | P2 | W03逐条判断缺先修、缺入边或合理独立；迁移后按目标ID复核，合理独立写证据，不为连图伪造依赖；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W03;S01 | S01形成逐条审查表；各目标课P1复核后写catalog | 已关闭 |
| BW-036 | modern、nonlinear、mpc、robust、intelligent、rl-control、multi-agent共7章 | 已知待处理 | P2 | W03核已有图谱与课程输入，分清零边是元数据缺失还是合理；记录迁移后逐课先修和可验证例外；关闭证据: .agent/semester-03/s04-structure-acceptance.md | W03;S01 | S01完成7章审查；各课签发前必须核真实先修 | 已关闭 |
<!-- I03-WARNINGS-END -->

## 附表A：35课日志债务逐课去向

| 基线源课程 | 学期3目标 | 跟踪课程ID |
|---|---|---|
| math/complex-numbers | math/complex-numbers | MATH-02 |
| classic/system-modeling | classic/system-modeling | CLASSIC-01 |
| classic/transfer-function | classic/transfer-function | CLASSIC-02 |
| classic/time-domain-analysis | classic/time-domain-analysis | CLASSIC-03 |
| classic/stability-analysis | classic/stability-analysis | CLASSIC-04 |
| classic/frequency-domain-analysis | classic/frequency-domain-analysis | CLASSIC-05 |
| classic/root-locus | classic/root-locus | CLASSIC-06 |
| classic/pid-controller | classic/pid-controller | CLASSIC-07 |
| classic/compensator-design | classic/compensator-design | CLASSIC-08 |
| modern/kalman-filter | estimation/kalman-filter | EST-03 |
| modern/modern-case-study | modern/modern-case-study | MODERN-09 |
| discrete-sampled/z-transform-analysis | discrete-sampled/z-transform-analysis | DISCRETE-04 |
| discrete-sampled/discretization-methods | discrete-sampled/discretization-methods | DISCRETE-06 |
| discrete-sampled/discrete-stability-criteria | discrete-sampled/discrete-stability-criteria | DISCRETE-05 |
| discrete-sampled/discrete-time-freq | discrete-sampled/discrete-time-freq | DISCRETE-01 |
| discrete-sampled/sampling-period-selection | discrete-sampled/sampling-period-selection | DISCRETE-07 |
| implementation/digital-pid | implementation/digital-pid | IMPL-02 |
| implementation/computer-control-architecture | implementation/computer-control-architecture | IMPL-01 |
| implementation/realtime-control | implementation/realtime-control | IMPL-06 |
| mpc/mpc-principle | mpc/mpc-principle | MPC-01 |
| mpc/prediction-model | mpc/prediction-model | MPC-02 |
| mpc/receding-horizon | mpc/receding-horizon | MPC-03 |
| mpc/constraint-handling | mpc/constraint-handling | MPC-04 |
| mpc/mpc-case-study | mpc/mpc-case-study | MPC-11 |
| mpc/generalized-predictive-control | mpc/generalized-predictive-control | MPC-06 |
| mpc/nonlinear-mpc | mpc/nonlinear-mpc | MPC-08 |
| mpc/distributed-mpc | multi-agent/distributed-mpc | MULTI-07 |
| robust/robustness-concept | robust/robustness-concept | ROBUST-01 |
| robust/h-infinity-basics | robust/h-infinity-basics | ROBUST-05 |
| robust/mixed-sensitivity | robust/mixed-sensitivity | ROBUST-06 |
| robust/mu-synthesis | robust/mu-synthesis | ROBUST-08 |
| robust/robust-stability | robust/robust-stability | ROBUST-03 |
| robust/uncertainty-modeling | robust/uncertainty-modeling | ROBUST-02 |
| robust/robust-performance | robust/robust-performance | ROBUST-04 |
| robust/robust-case-study | robust/robust-case-study | ROBUST-11 |

## 附表B：30条孤立源课程逐课去向

| 基线源课程 | 学期3目标 | 跟踪课程ID |
|---|---|---|
| modern/controllability-observability | modern/controllability-observability | MODERN-02 |
| modern/lyapunov-modern | modern/lyapunov-modern | MODERN-03 |
| modern/kalman-filter | estimation/kalman-filter | EST-03 |
| modern/multivariable-systems | modern/multivariable-systems | MODERN-08 |
| nonlinear/phase-plane | nonlinear/phase-plane | NONLINEAR-02 |
| nonlinear/describing-function | nonlinear/describing-function | NONLINEAR-04 |
| nonlinear/backstepping | nonlinear/backstepping | NONLINEAR-07 |
| mpc/generalized-predictive-control | mpc/generalized-predictive-control | MPC-06 |
| mpc/nonlinear-mpc | mpc/nonlinear-mpc | MPC-08 |
| mpc/distributed-mpc | multi-agent/distributed-mpc | MULTI-07 |
| robust/mixed-sensitivity | robust/mixed-sensitivity | ROBUST-06 |
| robust/mu-synthesis | robust/mu-synthesis | ROBUST-08 |
| robust/robust-stability | robust/robust-stability | ROBUST-03 |
| robust/uncertainty-modeling | robust/uncertainty-modeling | ROBUST-02 |
| robust/robust-performance | robust/robust-performance | ROBUST-04 |
| intelligent/fuzzy-controller-design | intelligent/fuzzy-controller-design | INTEL-02 |
| intelligent/expert-system | intelligent/expert-system | INTEL-03 |
| intelligent/genetic-algorithm | intelligent/genetic-algorithm | INTEL-04 |
| intelligent/fuzzy-neural-network | intelligent/fuzzy-neural-network | INTEL-06 |
| rl-control/q-learning | rl-control/q-learning | RL-03 |
| rl-control/dqn | rl-control/dqn | RL-04 |
| rl-control/actor-critic | rl-control/actor-critic | RL-06 |
| rl-control/safe-rl | safety-ftc/safe-rl | SAFE-06 |
| rl-control/multi-agent-rl | multi-agent/multi-agent-rl | MULTI-08 |
| multi-agent/formation-control | multi-agent/formation-control | MULTI-06 |
| multi-agent/distributed-optimization | multi-agent/distributed-optimization | MULTI-04 |
| multi-agent/game-theory-basics | multi-agent/game-theory-basics | MULTI-05 |
| multi-agent/multi-agent-cooperation | multi-agent/multi-agent-cooperation | MULTI-09 |
| multi-agent/distributed-estimation | multi-agent/distributed-estimation | MULTI-03 |
| multi-agent/multi-agent-rl | multi-agent/multi-agent-rl | MULTI-08 |

## 追加发现与后续任务的完成定义

### S3-Q001：源码slug预估不是最终DOM锚点

26页均HTTP200且均存在catalog链接未命中对应DOM的情况；其中24页H2数量完整，另两页正文被数学块吞掉。现有check只对MDX源码中的H2调用makeSlugger，实际渲染先rehypeKatex再rehypeSlug，且后者在全部级别标题之间处理重复ID。实测差异包括：

- discrete-sampled/z-transform-analysis：源码预估 `z-平面与-s-平面的映射`，DOM为 `zzz-平面与-sss-平面的映射`。
- robust/robustness-concept：源码预估 `mathcalh_infty-范数`，DOM为 `hmathcalh_inftyh-范数`。
- robust/h-infinity-basics：源码预估 `标准-mathcalh_infty-问题`，DOM为 `标准-hmathcalh_inftyh-问题`。
- mpc/generalized-predictive-control：源码预估 `数值例子`，DOM实际 `数值例子-1`；仅遍历H2遗漏了其它级别标题对去重的影响。

W04先确定与实际渲染一致且兼容既有链接的锚点生成契约，补含数学标题、混合级别同名标题的真实渲染负向测试；再由W01对齐catalog和旧锚点。不能把“源码检查不再WARN”当成“侧栏链接全部可用”。本次不裁改冻结的Q5诊断，新增技术问题用S3-Q001追踪。

### Q6既有页面损坏复核（W05，P0）

实测 mpc/mpc-principle：H2=1/8；mpc/receding-horizon：H2=2/11。两页HTTP均200，均匹配到1个实际class为katex-error的元素，闭合数学环境仍写成 `\end{aligned}}$$` 同行，后文进入错误数学块。它们早在学期2E1的Q6说明中出现，本次是重新测量，不是新增WARN。

另外实跑 `npm run verify -- mpc/mpc-principle mpc/receding-horizon --quiet` 退出1，PASS8/WARN4/FAIL6：两课各在第1项（公式语法）、第3项（ipywidgets存量）、第6项（H2/数学渲染）失败。verify按HTML中字符串出现次数各报2处katex-error，本次DOM证据按class匹配各报1个元素，口径不同但都未通过。ipywidgets债务已有课程去向MPC-01/MPC-03，不把它并入纯语法修复或忽略为通过。

W05只修复公式围栏/多余闭合符等渲染语法并验证数值文本保留，执行页面verify和build；关闭必须第1/6项通过且build成功，其余存量FAIL逐项留证并关联课程，不能把整课verify仍退出1写成全绿。完整课程验收的ipywidgets等问题由MPC-01/MPC-03按Phase1–4处理；如需改教学结论，同样转对应课程并遵守一对话一课。W05未过不得签发这两课，W01也不能对丢失的H2先做伪修。

### 全局任务与关闭条件

| 任务 | 视角责任 | 排期/依赖 | 关闭条件 |
|---|---|---|---|
| W01 | 秦构；郑核核档 | W04/W05后，S04前；涉及26课按课程ID关联 | 26页真实侧栏目标存在，H2与catalog对齐，旧锚点去向可核；check相应WARN消失、页面导航/数学检查通过；既有widget/日志债务归逐课，不冒充整课签发 |
| W02 | 苏绘判教学用途，秦构核调用，郑核核去向 | S04前给出去向决定；引入课程需该课Phase1确认 | 两组件有明确删除/归档/实际使用证据，清理注册/调用后check+适用build/verify；有计划但未交付的复用不算W02已关闭，S04须明示该未交付项 |
| W03 | 主责教授核先修，郑核登记 | S01审查30源课程及7章，逐课P1复核 | 逐项写缺失边/合理独立/课型误判原因与目标ID，catalog图无环/悬空/未登记前向边；逐课交付前核先修可学 |
| W04 | 秦构 | S3-Q001；先于W01和S04 | 定义并实现同源锚点策略，真实渲染测试覆盖数学与跨级重复标题，错误链接能被验收工具检出 |
| W05 | 秦构；涉及教学修改时按课程技能上场 | Q6；先于两页的锚点修复和S04 | 两页H2恢复8/8和11/11，katex-error=0，build及verify第1/6项通过；第3项widget债务由MPC-01/MPC-03关闭，语法修改无教学/数值漂移 |

BW-001–003由S02/S03负责迁移，完成前保留三组旧入口，禁止先删正文。BW-033/034由S01确认先采样量化的目标顺序再由S02落地，不删除真实先修来压低警告。BW-004的35课分别由附表A的现有课程行跟踪；每课签发前必须有本期真实日志，R02收官汇总。

## 复验与变化处理

运行 `node scripts/check-warning-audit.mjs` 验证36项覆盖、分类、处置、任务引用、35/30课去向及26页证据齐备；`--live` 另跑唯一权威check，识别基线外或内容变化的警告，不重新抓取DOM。JSON中的DOM记录是本次取证快照，后续关闭仍需实际页面复测。消失的WARN只报“关闭候选”，不自动改成已关闭；新增/变化必须审查并以新审计快照/台账记录，保留本次不可变快照，禁止覆盖历史使对比恒等。

每个WARN在实际修复后，将状态改为已关闭，并在处置栏追加“关闭证据: 仓库路径”，关联真实任务/课程验收。单看数量下降不足以关闭聚合警告：35课缺档、30孤立课、7章零边都要核成员，不能被新的缺档/孤立成员替换而漏报。S3-Q001是新发现的验收缺口，未改变check脚本的36项基线计数。

本次仅观测现有8080开发服务，没有重启服务、构建或运行课程notebook；26页HTTP200并不等于页面验收通过，W05两页就是反例。

## I03验收记录

| 命令/检查 | 退出码/结果 | 实际输出与边界 |
|---|---|---|
| npm run check | 0 | PASS17 / WARN36 / FAIL0；与基线一致 |
| node scripts/check-warning-audit.mjs --live | 0 | baseline36 / audited36 / blocked29 / pending7 / closed0 / anchorPages26 / current36 / newOrChanged0 / resolvedCandidates0 |
| node --test scripts/check-warning-audit.test.mjs | 0 | tests13 / pass13 / fail0 / skipped0；含漏项、重复、未知任务、虚关闭、聚合成员替换/遗漏、P0漏登等负向用例 |
| node --test scripts/check-warning-audit.test.mjs scripts/check-fix-logs.test.mjs scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs | 0 | tests44 / pass44 / fail0 / skipped0 |
| node scripts/check-fix-logs.mjs | 0 | 索引26 / 详情26 / 预留2，PASS |
| node scripts/check-semester03.mjs | 0 | 21治理任务，I03完成后8项已完成；课程合并0/205 |
| 26页HTTP/DOM取证 | 全部HTTP200；24页H2完整，2页损坏 | 数学标题/全级标题去重缺口已登记W04，正文损坏已登记W05；不能当作页面全绿 |
| npm run verify -- mpc/mpc-principle mpc/receding-horizon --quiet | 1（复现存量失败） | PASS8 / WARN4 / FAIL6 / SKIPPED0；本次未修复，明确归W05及MPC-01/MPC-03；不计为通过 |
| git diff --check | 0 | 无空白错误输出 |

I03的关闭条件是36项完成逐条审计、分类、来源核对和后续登记，已满足；不是警告清零或两页课程修复。W01–W05保持未勾，课程行保持原状态。新增审计技术缺口S3-Q001已固化于计划和W04，后续执行按各任务的明确关闭条件推进。

## S04关闭复核（2026-10-17）

上述I03命令/DOM快照保留当时事实；状态列已追加S04关闭证据。36项中35项经S01–S04及W01–W05实测关闭，BW-004的35课日志债务仍待逐课Phase1–4。完整证据见 `s04-structure-acceptance.md`；S02新增加的独立领域motion-planning同slug提示仍为接受项，不属于I03三组重复迁移债务。
