# 学期3优化计划

立项日期：2026-10-17。性质：运作方式更新、结构治理、全量逐课重构/新写。角色团队沿用学期2的22名具名角色/14类轮值；中文润色独立交由其他模型执行，见§8。

## 1. 范围与事实基线

本次交付计划、技能、全局 checklist 和计划一致性校验；尚未实施 catalog 结构迁移，也不交付任何课程。后续先完成必要结构/质量基建，再从数学第一课开始，严格一个对话一节课。学期2未完成项目进入本期来源映射，不再另外跑一条相互竞争的 C/D 排期；历史计划、日志和交付标记保留。

2026-10-17 `npm run check` 实测：16章141课，56课有MDX（29课v1.3、27课draft），85课占位；21篇日志覆盖21课，35课有正文但缺日志；614个小节；47个Explorer、45个被引用、2个孤儿；148条先修边，无环/悬空，覆盖69/141课，30个孤立点、7章零先修边。PASS 17 / WARN 36 / FAIL 0。现状与旧 AGENTS 快照不同，以实测为准。

[不可变来源快照](semester-03-baseline.json) 记录起点 commit、141条路径/标题/状态、56份MDX的SHA-256，供迁移和覆盖核对。它是历史证据；运行站点的唯一元数据来源仍为 `content/catalog.ts`。

三份文件各司其职：本计划规定目标范围与顺序；[全局 checklist](semester-03-checklist.md) 是本期进度唯一入口；旧 delivery-tracker 与 catalog 继续遵守旧校验契约，不能用旧 v1.3 状态代替本期完成。本计划的目标表在迁移前不是线上目录事实，不手工修改 OUTLINE。

## 2. 运作方式

### 2.1 全局 checklist

所有本期工作先登记唯一 ID，再实施：治理/调研/结构/工具/发布任务用任务表；每课用独立行跟踪 Phase 1、2、3、4、验收、合并。补研究、返工、阻塞处理及变更裁决也必须新增任务行，禁止散落在对话里。课程子问题详记本课讨论日志，以 ID 链接回全局表；不复制第二份课程进度。

- `[ ]` 未完成，`[x]` 有证据完成；进行中、阻塞和下一步写证据栏。禁止用勾表示“计划会做”。
- 按 P1→P2→P3→P4→验收→合并顺序打勾。每个阶段完成后更新；没有实跑不能勾验收，没有已进入master的真实提交 hash 不能勾最终完成（旧“合并”列）。
- 证据使用仓库内持久文件路径加可选锚点；命令输出、退出码、基线差异在日志，合并记录用 `commit:<hash>`。本机临时 logs 不能充当唯一交付证据。
- 新增/拆分/移动/撤销目标先修改本计划和 checklist，保持稳定 ID，保留来源映射及变更理由。课程撤销不能直接删掉来源记录，须明确合并去向。
- `node scripts/check-semester03.mjs` 校验目标唯一性、141来源全覆盖、56正文保留、模式、课名/章名、台账一致性和勾选顺序；它不代替真实数值、教学或浏览器验收。

### 2.2 两套讨论技能

| 入口 | 触发条件 | 本期优化 |
|---|---|---|
| [wiki-lesson-new](skills/wiki-lesson-new/SKILL.md) | 新增或占位，未沿用任何正文 | 起点与先修合同；目标/H2/算例/练习对应；先跑最小实验，再扩写；从干净环境验证首次可学可跑 |
| [wiki-lesson-refactor](skills/wiki-lesson-refactor/SKILL.md) | 沿用任一旧正文，含迁移、合并、拆分 | 起点审计、保留/纠错/迁移矩阵；独立复算旧数值；变更传播；旧URL/锚点/材料去向和回归核查 |
| [共同流程](skills/wiki-discussion/references/semester-03-core.md) | 两者必读 | 共用 Phase 1–4、日志骨架、M1–M5；三轮生成、六组审校、三方对账、九项门槛、红队放行、实际签发与合并 |

原 wiki-discussion 保留作为角色矩阵与规范权威，不另复制 personas；旧 v1.3-refactor 保留服务历史，学期3统一走上述两入口。计划“模式”是起点判断；后续发现已有正文必须重新判定，不能为了使用新写流程忽略旧材料。

### 2.3 一个对话一节课

默认选择全局 checklist 中生产顺序最前的未合入课程。本期首课 **MATH-01：微积分入门**。先修与基础设施阻塞时记录原因，只处理该课所必需的已登记阻塞，不顺带交付第二课。讨论未完继续同一课程；用户明确换课时保留检查点。课程合入后停止，下一对话再取下一课。

明确换课需在下表登记目标、获准暂缓的前课、用户依据及可读证据；只放行该目标，不免除阶段顺序、验收或其它前课。历史例外保留，不改变课程导航和默认生产顺序。

<!-- S3-ORDER-EXCEPTIONS-BEGIN -->
| ID | 暂缓前课 | 用户依据 | 证据 |
|---|---|---|---|
| DISCRETE-02 | DISCRETE-01 | 2026-10-19用户明确要求“继续DISCRETE-02”；上一课未验收草稿保留，当前课局部补足采样编号定义 | .agent/semester-03/discrete-02/acceptance.md |
| DISCRETE-03 | DISCRETE-01 | 2026-10-19用户明确要求“继续DISCRETE-03”；先修DISCRETE-02与Z变换已交付，保留DISCRETE-01未验收草稿 | .agent/semester-03/discrete-03/acceptance.md |
| DISCRETE-04 | DISCRETE-01 | 2026-10-19用户明确要求“继续DISCRETE-04”；先修差分方程与Z变换已交付，采样/保持定义本课局部补足，保留DISCRETE-01草稿 | .agent/semester-03/discrete-04/acceptance.md |
| DISCRETE-05 | DISCRETE-01 | 2026-10-19用户明确要求“继续DISCRETE-05”；04已交付，保留01草稿，本课局部补足采样定义 | .agent/semester-03/discrete-05/acceptance.md |
| DISCRETE-06 | DISCRETE-01 | 2026-10-19用户明确要求“继续DISCRETE-06”；04/05已交付，保留01草稿，采样保持本课局部解释 | .agent/semester-03/discrete-06/acceptance.md |
| DISCRETE-07 | DISCRETE-01 | 2026-10-19用户明确要求“继续DISCRETE-07”；02–06已交付，保留01草稿，本课局部解释采样保持 | .agent/semester-03/discrete-07/acceptance.md |
| DISCRETE-08 | DISCRETE-01 | 2026-10-19用户明确要求“继续DISCRETE-08”；02–07已交付，保留01草稿，采样保持在本课定义 | .agent/semester-03/discrete-08/acceptance.md |
| DISCRETE-09 | DISCRETE-01 | 2026-10-19用户明确要求“继续DISCRETE-09”；02–08已交付，保留01草稿，本课不依赖其未验收内容 | .agent/semester-03/discrete-09/acceptance.md |
| DISCRETE-10 | DISCRETE-01 | 2026-10-19用户明确要求“继续DISCRETE-10”；02–09已交付，保留01草稿，本课只依赖已交付先修 | .agent/semester-03/discrete-10/acceptance.md |
| ID-01 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09 | 2026-10-24用户明确指定继续ID-01，rank3；暂缓并行会话与此前未交付课程，本课只依赖已交付离散系统及概率基础 | .agent/semester-03/id-01/acceptance.md |
| ML-01 | IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10 | 2026-10-24用户明确指定继续ML-01，rank2；其它会话并行设计实现课，保留其检查点；本课只依赖已交付数学基础 | .agent/semester-03/ml-01/acceptance.md |
| ID-02 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09 | 2026-10-24用户明确指定继续ID-02，rank3；暂缓其他会话与未交付前课，仅依赖已交付ID-01和差分方程 | .agent/semester-03/id-02/acceptance.md |
| EST-01 | IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-01;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09 | 2026-10-24用户明确指定继续EST-01，rank4；保留其它会话检查点，只依赖已交付观测器、随机过程与离散系统 | .agent/semester-03/est-01/acceptance.md |
| ROBUST-01 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08 | 2026-10-24用户指定继续ROBUST-01，rank5；避开并行课程，仅使用已交付先修 | .agent/semester-03/robust-01/acceptance.md |
| DRIVING-01 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-01;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-01;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-01;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-01;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12;MULTI-01;MULTI-02;MULTI-03;MULTI-04;MULTI-05;MULTI-06;MULTI-07;MULTI-08;MULTI-09;SAFE-01;SAFE-02;SAFE-03;SAFE-04;SAFE-05;SAFE-06;SAFE-07;SAFE-08;ROBOT-01;ROBOT-02;ROBOT-03;ROBOT-04;ROBOT-05;ROBOT-06;ROBOT-07;ROBOT-08;ROBOT-09;ROBOT-10;RLEARN-01;RLEARN-02;RLEARN-03;RLEARN-04;RLEARN-05;RLEARN-06;RLEARN-07;RLEARN-08;RLEARN-09;RLEARN-10;EMBODIED-01;EMBODIED-02;EMBODIED-03;EMBODIED-04;EMBODIED-05;EMBODIED-06;EMBODIED-07;EMBODIED-08;EMBODIED-09;EMBODIED-10 | 2026-10-24用户指定继续DRIVING-01，rank14；保留并行课程检查点；只依赖已交付状态空间，安全与回退定义本课局部补足 | .agent/semester-03/driving-01/acceptance.md |
| RLEARN-01 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-01;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-01;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-01;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-01;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12;MULTI-01;MULTI-02;MULTI-03;MULTI-04;MULTI-05;MULTI-06;MULTI-07;MULTI-08;MULTI-09;SAFE-01;SAFE-02;SAFE-03;SAFE-04;SAFE-05;SAFE-06;SAFE-07;SAFE-08;ROBOT-01;ROBOT-02;ROBOT-03;ROBOT-04;ROBOT-05;ROBOT-06;ROBOT-07;ROBOT-08;ROBOT-09;ROBOT-10 | 2026-10-24用户指定继续RLEARN-01，rank12；保留并行课程，只依赖已交付学习问题和概率基础，局部解释数据接口 | .agent/semester-03/rlearn-01/acceptance.md |
| MULTI-01 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-01;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-01;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-01;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-01;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12 | 2026-10-24用户明确指定继续MULTI-01，rank9；保留其它会话检查点，仅依赖已交付图论与状态空间 | .agent/semester-03/multi-01/acceptance.md |
| ML-02 | IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10 | 2026-10-24用户明确指定继续ML-02，rank2；保留并行实现课检查点，只依赖已交付ML-01和凸优化 | .agent/semester-03/ml-02/acceptance.md |
| RL-01 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-01;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-01;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08 | 2026-10-24用户指定继续RL-01，rank8；其它会话并行，暂缓未完成前课；仅依赖三门已交付先修 | .agent/semester-03/rl-01/acceptance.md |
| ROBOT-01 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-01;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-01;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-01;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-01;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12;MULTI-01;MULTI-02;MULTI-03;MULTI-04;MULTI-05;MULTI-06;MULTI-07;MULTI-08;MULTI-09;SAFE-01;SAFE-02;SAFE-03;SAFE-04;SAFE-05;SAFE-06;SAFE-07;SAFE-08 | 2026-10-24用户指定继续ROBOT-01，rank11；保留并行检查点，仅依赖已交付状态空间，局部解释几何投影和牛顿定律 | .agent/semester-03/robot-01/acceptance.md |
| MPC-01 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-01;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11 | 2026-10-24用户指定继续MPC-01，rank6；其它会话并行，保留其检查点；状态可测，不依赖未签发估计课 | .agent/semester-03/mpc-01/acceptance.md |
| INTEL-01 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-01;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-01;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11 | 2026-10-24用户明确指定继续INTEL-01，rank7；保留并行会话检查点，本课仅调用已交付PID/非线性/LQR/Lyapunov概念 | .agent/semester-03/intel-01/acceptance.md |
| EMBODIED-01 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-01;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-01;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-01;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-01;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12;MULTI-01;MULTI-02;MULTI-03;MULTI-04;MULTI-05;MULTI-06;MULTI-07;MULTI-08;MULTI-09;SAFE-01;SAFE-02;SAFE-03;SAFE-04;SAFE-05;SAFE-06;SAFE-07;SAFE-08;ROBOT-01;ROBOT-02;ROBOT-03;ROBOT-04;ROBOT-05;ROBOT-06;ROBOT-07;ROBOT-08;ROBOT-09;ROBOT-10;RLEARN-01;RLEARN-02;RLEARN-03;RLEARN-04;RLEARN-05;RLEARN-06;RLEARN-07;RLEARN-08;RLEARN-09;RLEARN-10 | 2026-10-24用户明确指定继续EMBODIED-01，rank13；避开并行课程与资源，原先修未签发所需定义在本课局部补足 | .agent/semester-03/embodied-01/acceptance.md |
| SAFE-01 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-01;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-01;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-01;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-01;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12;MULTI-01;MULTI-02;MULTI-03;MULTI-04;MULTI-05;MULTI-06;MULTI-07;MULTI-08;MULTI-09 | 2026-10-24用户指定继续SAFE-01，rank10；保留其它会话检查点，只依赖已交付稳定性与Lyapunov | .agent/semester-03/safe-01/acceptance.md |
| APP-01 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-01;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-01;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-01;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-01;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-01;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12;MULTI-01;MULTI-02;MULTI-03;MULTI-04;MULTI-05;MULTI-06;MULTI-07;MULTI-08;MULTI-09;SAFE-01;SAFE-02;SAFE-03;SAFE-04;SAFE-05;SAFE-06;SAFE-07;SAFE-08;ROBOT-01;ROBOT-02;ROBOT-03;ROBOT-04;ROBOT-05;ROBOT-06;ROBOT-07;ROBOT-08;ROBOT-09;ROBOT-10;RLEARN-01;RLEARN-02;RLEARN-03;RLEARN-04;RLEARN-05;RLEARN-06;RLEARN-07;RLEARN-08;RLEARN-09;RLEARN-10;EMBODIED-01;EMBODIED-02;EMBODIED-03;EMBODIED-04;EMBODIED-05;EMBODIED-06;EMBODIED-07;EMBODIED-08;EMBODIED-09;EMBODIED-10;DRIVING-01;DRIVING-02;DRIVING-03;DRIVING-04;DRIVING-05;DRIVING-06;DRIVING-07;DRIVING-08;DRIVING-09;DRIVING-10;DRIVING-11 | 2026-10-24用户指定继续APP-01，rank15；保留并行检查点，连续PI局部定义，不依赖未交付数字实现 | .agent/semester-03/app-01/acceptance.md |
| EST-02 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09 | 2026-10-24用户明确指定继续EST-02，rank4；保留并行检查点，仅依赖已交付EST-01、概率基础与凸优化 | .agent/semester-03/est-02/acceptance.md |
| ID-03 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09 | 2026-10-24用户明确指定继续ID-03，rank3；保留并行会话，仅依赖已交付ID-02、矩阵分解及概率基础 | .agent/semester-03/id-03/acceptance.md |
| DRIVING-02 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12;MULTI-02;MULTI-03;MULTI-04;MULTI-05;MULTI-06;MULTI-07;MULTI-08;MULTI-09;SAFE-01;SAFE-02;SAFE-03;SAFE-04;SAFE-05;SAFE-06;SAFE-07;SAFE-08;ROBOT-02;ROBOT-03;ROBOT-04;ROBOT-05;ROBOT-06;ROBOT-07;ROBOT-08;ROBOT-09;ROBOT-10;RLEARN-02;RLEARN-03;RLEARN-04;RLEARN-05;RLEARN-06;RLEARN-07;RLEARN-08;RLEARN-09;RLEARN-10;EMBODIED-01;EMBODIED-02;EMBODIED-03;EMBODIED-04;EMBODIED-05;EMBODIED-06;EMBODIED-07;EMBODIED-08;EMBODIED-09;EMBODIED-10;MPC-01 | 2026-10-24用户指定继续DRIVING-02，rank14；保留并行检查点，只依赖已交付驾驶系统、微分方程与状态空间 | .agent/semester-03/driving-02/acceptance.md |
| ML-03 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10 | 2026-10-24用户明确指定继续ML-03，rank2；保留并行实现课检查点，仅依赖已交付ML-02与多元微积分 | .agent/semester-03/ml-03/acceptance.md |
| ROBUST-02 | IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08 | 2026-10-24用户明确指定继续ROBUST-02，rank5；保留并行课程，仅依赖已交付ROBUST-01与矩阵基础 | .agent/semester-03/robust-02/acceptance.md |
| EMBODIED-02 | IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12;MULTI-02;MULTI-03;MULTI-04;MULTI-05;MULTI-06;MULTI-07;MULTI-08;MULTI-09;SAFE-02;SAFE-03;SAFE-04;SAFE-05;SAFE-06;SAFE-07;SAFE-08;ROBOT-02;ROBOT-03;ROBOT-04;ROBOT-05;ROBOT-06;ROBOT-07;ROBOT-08;ROBOT-09;ROBOT-10;RLEARN-02;RLEARN-03;RLEARN-04;RLEARN-05;RLEARN-06;RLEARN-07;RLEARN-08;RLEARN-09;RLEARN-10 | 2026-10-24用户明确指定继续EMBODIED-02，rank13；先修表征学习未交付，编码器/表征在本课局部定义，不补写别课 | .agent/semester-03/embodied-02/acceptance.md |
| MPC-02 | IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11 | 2026-10-24用户明确指定继续MPC-02，rank6；保留并行检查点，仅用已交付先修 | .agent/semester-03/mpc-02/acceptance.md |
| RLEARN-02 | IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08;RL-02;RL-03;RL-04;RL-05;RL-06;RL-07;RL-08;RL-09;RL-10;RL-11;RL-12;MULTI-02;MULTI-03;MULTI-04;MULTI-05;MULTI-06;MULTI-07;MULTI-08;MULTI-09;SAFE-02;SAFE-03;SAFE-04;SAFE-05;SAFE-06;SAFE-07;SAFE-08;ROBOT-02;ROBOT-03;ROBOT-04;ROBOT-05;ROBOT-06;ROBOT-07;ROBOT-08;ROBOT-09;ROBOT-10 | 2026-10-24用户明确指定继续RLEARN-02，rank12；保留并行课程，只依赖已交付机器人数据与监督学习，以闭式拟合替代未交付自动微分 | .agent/semester-03/rlearn-02/acceptance.md |
| RL-02 | IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11;INTEL-02;INTEL-03;INTEL-04;INTEL-05;INTEL-06;INTEL-07;INTEL-08 | 2026-10-24用户明确指定继续RL-02，rank8；保留并行前课，先修RL-01与变分法/动态规划已交付 | .agent/semester-03/rl-02/acceptance.md |
| INTEL-02 | IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-02;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-02;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11;MPC-02;MPC-03;MPC-04;MPC-05;MPC-06;MPC-07;MPC-08;MPC-09;MPC-10;MPC-11 | 2026-10-24用户明确指定继续INTEL-02，rank7；保留并行课程，仅依赖已交付INTEL-01及PID/非线性基础 | .agent/semester-03/intel-02/acceptance.md |
| ID-04 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09 | 2026-10-24用户明确指定继续ID-04，rank3；保留并行课程，仅依赖已交付ID-03和矩阵分解 | .agent/semester-03/id-04/acceptance.md |
| EST-03 | IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-01;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09 | 2026-10-24用户明确指定“继续EST-03”，rank4；EST-01/02已交付，仅重构本课 | .agent/semester-03/est-03/acceptance.md |
| MPC-03 | IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-05;ID-06;ID-07;ID-08;ID-09;EST-04;EST-05;EST-06;EST-07;EST-08;ROBUST-03;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11 | 2026-10-24用户明确指定继续MPC-03，rank6；保留并行检查点，仅用已交付先修 | .agent/semester-03/mpc-03/acceptance.md |
| ML-04 | IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10 | 2026-10-24用户明确指定继续ML-04，rank2；保留并行实现课检查点，仅依赖已交付ML-03与数值方法 | .agent/semester-03/ml-04/acceptance.md |
| ROBUST-03 | IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09;EST-03;EST-04;EST-05;EST-06;EST-07;EST-08 | 2026-10-24用户明确指定继续ROBUST-03，rank5；保留并行课程，只用已交付ROBUST-01/02、Lyapunov与Routh基础 | .agent/semester-03/robust-03/acceptance.md |
| EST-04 | IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-01;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09 | 2026-10-24用户明确指定“继续EST-04”，rank4；先修EST-03已交付，仅新写本课 | .agent/semester-03/est-04/acceptance.md |
| ML-05 | IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10 | 2026-10-24用户指定继续ML-05，rank2；保留并行课程，只依赖已交付ML-04与随机过程 | .agent/semester-03/ml-05/acceptance.md |
| MPC-04 | IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-05;ML-06;ML-07;ML-08;ML-09;ID-05;ID-06;ID-07;ID-08;ID-09;EST-05;EST-06;EST-07;EST-08;ROBUST-04;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11 | 2026-10-24用户明确指定继续MPC-04，rank6；保留并行检查点，仅用已交付先修 | .agent/semester-03/mpc-04/acceptance.md |
| ID-05 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09 | 2026-10-24用户明确指定继续ID-05，rank3；保留并行课程，仅依赖已交付ID-04、传递函数、随机过程和PID | .agent/semester-03/id-05/acceptance.md |
| ML-06 | IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10 | 2026-10-24用户明确指定继续ML-06，rank2；ML-05已交付，保留并行实现课，仅依赖已交付时序模型 | .agent/semester-03/ml-06/acceptance.md |
| EST-05 | IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-01;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09 | 2026-10-24用户明确要求继续EST-05，rank4；其它会话并行，保留检查点；仅依赖已交付KF/概率基础 | .agent/semester-03/est-05/acceptance.md |
| ROBUST-04 | IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-07;ML-08;ML-09;ID-06;ID-07;ID-08;ID-09;EST-06;EST-07;EST-08 | 2026-10-24用户指定继续ROBUST-04，rank5；并行课程保留检查点，仅依赖已交付先修 | .agent/semester-03/robust-04/acceptance.md |
| MPC-05 | IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-07;ML-08;ML-09;ID-06;ID-07;ID-08;ID-09;EST-06;EST-07;EST-08;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11 | 2026-10-24用户明确指定继续MPC-05，rank6；保留并行检查点，仅用已交付先修 | .agent/semester-03/mpc-05/acceptance.md |
| ID-06 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09 | 2026-10-24用户明确指定继续ID-06，rank3；保留并行课程，先修模型结构/频域分析/随机过程/频域校正已交付 | .agent/semester-03/id-06/acceptance.md |
| ML-07 | IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10 | 2026-10-24用户指定继续ML-07，rank2；保留并行实现课，只依赖已交付ML-04/06 | .agent/semester-03/ml-07/acceptance.md |
| ID-07 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09 | 2026-10-24用户明确指定继续ID-07，rank3；保留并行课程，先修最小二乘/可控可观/矩阵分解已交付 | .agent/semester-03/id-07/acceptance.md |
| MPC-06 | IMPL-08;IMPL-09;IMPL-10;ML-08;ML-09;ID-07;ID-08;ID-09;EST-06;EST-07;EST-08;ROBUST-05;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11 | 2026-10-24用户明确指定继续MPC-06，rank6；保留并行检查点，仅用已交付先修 | .agent/semester-03/mpc-06/acceptance.md |
| EST-06 | IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-01;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09 | 2026-10-24用户明确指定继续EST-06，rank4；其它会话并行，保留其检查点，仅依赖已交付先修 | .agent/semester-03/est-06/acceptance.md |
| ROBUST-05 | IMPL-09;IMPL-10;ML-08;ML-09;ID-08;ID-09;EST-07;EST-08 | 2026-10-24用户指定继续ROBUST-05，rank5；并行课程保留检查点，仅依赖已交付先修 | .agent/semester-03/robust-05/acceptance.md |
| ID-08 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09 | 2026-10-24用户明确指定继续ID-08，rank3；保留并行课程，先修持续激励/自动微分/时序模型/非线性系统已交付 | .agent/semester-03/id-08/acceptance.md |
| EST-07 | IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09;ID-01;ID-02;ID-03;ID-04;ID-05;ID-06;ID-07;ID-08;ID-09 | 2026-10-24用户明确指定继续EST-07，rank4；其它会话并行，保留检查点，仅依赖已交付KF/EKF | .agent/semester-03/est-07/acceptance.md |
| MPC-07 | IMPL-09;IMPL-10;ML-08;ML-09;ID-09;EST-08;ROBUST-06;ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11 | 2026-10-24用户明确指定继续MPC-07，rank6；保留并行检查点，仅用已交付先修 | .agent/semester-03/mpc-07/acceptance.md |
| ML-08 | IMPL-08;IMPL-09;IMPL-10 | 2026-10-24用户明确指定继续ML-08，rank2；保留并行实现课，仅依赖已交付ML-04/随机过程/ODE | .agent/semester-03/ml-08/acceptance.md |
| EST-08 | IMPL-09;IMPL-10;ML-08;ML-09;ID-09 | 2026-10-24用户明确指定继续EST-08，rank4；保留并行课程，只依赖已交付EST-06/07与KF基础 | .agent/semester-03/est-08/acceptance.md |
| ROBUST-06 | IMPL-10;ML-09;ID-09 | 2026-10-24用户指定继续ROBUST-06，rank5；并行课程保留检查点，仅依赖已交付先修 | .agent/semester-03/robust-06/acceptance.md |
| ID-09 | DISCRETE-01;IMPL-01;IMPL-02;IMPL-03;IMPL-04;IMPL-05;IMPL-06;IMPL-07;IMPL-08;IMPL-09;IMPL-10;ML-01;ML-02;ML-03;ML-04;ML-05;ML-06;ML-07;ML-08;ML-09 | 2026-10-24用户明确指定继续ID-09，rank3；保留并行课程，闭环/频域已交付；评估课未交付，局部定义分区与冻结，ID08提供已交付支撑 | .agent/semester-03/id-09/acceptance.md |
| ML-09 | IMPL-09;IMPL-10 | 2026-10-24用户明确指定继续ML-09，rank2；保留并行实现课，仅依赖已交付监督学习与概率基础 | .agent/semester-03/ml-09/acceptance.md |
| MPC-08 | ROBUST-07;ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11 | 2026-10-24用户明确指定继续MPC-08，rank6；保留并行检查点，仅用已交付先修 | .agent/semester-03/mpc-08/acceptance.md |
| ROBUST-07 | ML-09;ID-09 | 2026-10-24用户指定继续ROBUST-07，rank5；保留并行检查点，仅依赖已交付先修 | .agent/semester-03/robust-07/acceptance.md |
| MPC-09 | ROBUST-08;ROBUST-09;ROBUST-10;ROBUST-11 | 2026-10-24用户明确指定继续MPC-09，rank6；保留并行检查点，仅用已交付先修 | .agent/semester-03/mpc-09/acceptance.md |
<!-- S3-ORDER-EXCEPTIONS-END -->

推荐新写 Prompt：

> 继续学期3，读取 semester-03-plan.md 和全局 checklist，选择生产顺序最前的未合入课程。确认无正文后，按 wiki-lesson-new 及共同流程完成这一节的 Phase 1–4、真实验收、日志与台账，验收后 --no-ff 合入 master。本对话只交付这一节，不自动开始下一节。

推荐重构 Prompt：

> 继续学期3课程 <ID>。读取计划/全局 checklist，按 wiki-lesson-refactor 先审计全部源正文、代码与旧日志，决定本课具体重构范围，再执行完整 Phase 1–4。保留内容去向和旧链接，数值独立复算；真实验收后同步日志/台账并 --no-ff 合入 master。本对话只交付这一个目标课。

## 3. 结构诊断与取舍

### 3.1 保留骨干，修正边界

经典、现代、非线性、离散、实现、辨识、估计、鲁棒、预测控制仍承担系统建模、分析与设计主干，不以热点替代。现目录的问题主要是命名过长、知识重复、先修边不足，以及把学习算法和应用领域挤在同一章：

1. 导论放导航首位，面向选路；生产放最后，以免反复引用尚未定稿课程。数学从高中起点补微积分和多元微积分，共18课；细化到何种证明与例题留给逐课 Phase 1。
2. 卡尔曼滤波由 modern 迁入 estimation，与已有空条目合一；现代控制保留确定性状态观测器，避免两章重复讲同一推导。
3. H∞滤波放鲁棒章，MHE放预测章，解决先修倒置；状态估计章保留多传感器融合，MHE旧条目中的融合主题在这两处衔接，不能丢失。
4. 分布式MPC迁入多智能体章；安全RL只在安全章，多智能体RL只在多智能体章。RL基础只讲通用算法，指向这两课，不保留重复正文。
5. 数学Z变换负责数学工具；离散控制的Z域分析负责控制系统应用。离散章先采样量化，再系统与稳定性，修复已有两条章内逆序。辨识最小二乘讲动态模型/激励/闭环偏差，估计最小二乘讲统计估计，目标不同。
6. 新增机器学习章，补神经网络、训练、表征和生成建模先修；智能控制保留模糊、专家、神经控制等方法脉络及适用边界，新增迭代学习控制并明确它与RL的差别，不包装成当代具身智能总章。
7. 原 applications 的机器人/驾驶课程分别迁入对应专章，其余六类工程应用保留。飞行器姿态控制统一“领域中的控制任务”命名；微电网控制涵盖可再生能源接入与储能协调；生物医学/半导体等原条目的主题在执行时做范围审计，禁止单靠缩标题静默删掉主题。

### 3.2 学习技术调研与课程归属

调研截止 **2026-10-17**；以下选取可核验的一手论文、作者项目和官方技术报告作为代表路线，不宣称覆盖所有方法或列出最新排行榜。课到执行时复查版本和证据，不能把公司的演示当通用能力证明。

| 技术线 | 代表一手资料 | 与控制的关系及局限 | 课程归属 |
|---|---|---|---|
| 无模型连续控制 | [PPO](https://arxiv.org/abs/1707.06347)、[SAC](https://arxiv.org/abs/1801.01290)、[RSL-RL作者代码](https://github.com/leggedrobotics/rsl_rl) | 策略优化与采样效率取舍；足式机器人是重要应用。训练回报不等于真实系统稳定性证书 | RL基础讲算法；机器人学习讲运动技能与部署 |
| 离线RL与数据分布 | [IQL](https://arxiv.org/abs/2110.06169) | 固定数据集学习面对分布外动作与评估难题，离线高分不能保证上线安全 | RL离线学习、机器人离线到在线、驾驶评估 |
| 模型式RL与规划 | [DreamerV3作者项目](https://danijar.com/project/dreamerv3/)、[TD-MPC2](https://arxiv.org/abs/2310.16828) | 学习动力学后在想象中优化策略或用潜在模型在线规划；模型误差会随闭环滚动积累 | RL模型式方法；具身世界模型控制；机器人学习与MPC |
| 模仿学习与生成策略 | [Diffusion Policy](https://diffusion-policy.cs.columbia.edu/)、[π0.5官方说明](https://www.pi.website/blog/pi05) | 从示范学习多模态动作；扩散/流匹配是策略表示与训练方式，并不自动构成RL | 机器人模仿学习；具身动作表示、扩散与流策略 |
| 跨本体数据与通用策略 | [Open X-Embodiment/RT-X](https://robotics-transformer-x.github.io/)、[Octo](https://octo-models.github.io/) | 数据接口、动作标准化和多机器人迁移成为核心；不同本体动作不能简单拼接 | 机器人数据；具身通用策略 |
| 视觉语言动作模型 VLA | [OpenVLA](https://openvla.github.io/)、[Gemini Robotics 2（2026-07-30）](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/)、[π0.5](https://www.pi.website/blog/pi05) | 视觉/语言条件到动作；2026代表路线已延伸全身控制、具身推理与端侧部署，但仍有灵巧操作和泛化局限。架构不等于训练范式，延迟/动作频率/安全回退需单独评估 | 具身VLA、分层决策、闭环评估 |
| VLA后训练与经验学习 | [π*0.6（2025-11-17）](https://www.pi.website/blog/pistar06)、[驾驶闭环后训练（2026）](https://developer.nvidia.com/blog/how-to-post-train-autonomous-vehicle-models-in-closed-loop-with-nvidia-alpamayo/) | 从监督/示范基础策略接入离线及在线经验，或在仿真中闭环优化；需要区分基础模型训练与任务后训练的数据、奖励和计算预算 | 机器人离线到在线/人机协同；驾驶学习策略和评估 |
| 视频世界模型到动作与规划 | [Cosmos Policy（2026-01）](https://arxiv.org/abs/2601.16163) | 视频模型微调用于动作、未来状态及价值预测和规划；这说明WM与策略可共建，不能据生成视频质量推出控制成功率 | 具身世界模型、世界模型控制与实验评估 |
| 人在回路的真实机器人学习 | [HIL-SERL作者项目](https://hil-serl.github.io/)、[论文](https://arxiv.org/abs/2410.21845) | 人类示范/干预可支持在线RL，但干预成本、奖励设计与硬件风险仍是约束 | 机器人人机协同学习；安全控制 |
| 驾驶世界模型 WM | [Wayve GAIA-2](https://wayve.ai/thinking/gaia-2/)、[技术报告](https://wayve.ai/wp-content/uploads/2025/03/GAIA_2_Technical_Report.pdf) | 动作条件、多视角生成世界可支持场景生成与测试；逼真视频不等于动力学正确，也不自动等于可部署控制器 | 驾驶世界模型、闭环评估；具身WM讲共同原理 |
| 驾驶推理与VLA | [NVIDIA Alpamayo技术说明](https://developer.nvidia.com/blog/building-autonomous-vehicles-that-reason-with-nvidia-alpamayo/) | 推理、轨迹动作与仿真/数据共同参与研发；研究模型能力与量产自动驾驶认证是不同证据层级 | 自动驾驶的学习策略、驾驶VLA与安全回退 |
| 建筑、储能与能源调度 | [CityLearn v2（2024）](https://arxiv.org/abs/2405.03848) | 热舒适、电池与需求响应构成受约束序贯决策；环境同时支持规则、MPC和RL基线，需比较约束违反和数据成本 | 微电网控制；RL案例与多智能体协同的可选实验 |
| 科学装置控制 | [等离子体磁控制原论文（2022）](https://doi.org/10.1038/s41586-021-04301-9)、[作者后续工作（2024）](https://deepmind.google/research/publications/30578/) | 从模拟训练到实验装置磁控制，体现高动态系统应用；特定装置实验不等于普适安全或可直接搬用 | RL控制案例的扩展阅读；鲁棒/安全控制的适用边界讨论 |

由上述路线作出的课程设计判断：VLA 是感知/语言到动作的模型范式，WM 是学习环境演化的模型；它们可以服务RL、模仿、规划、数据生成与测试。因此分为“强化学习控制基础 → 机器人控制 → 机器人学习 → 具身智能 → 自动驾驶”几条相连主线。机器人控制提供解析模型和经典基线，机器人学习聚焦技能获取与迁移，具身智能聚焦通用多模态策略和世界模型，自动驾驶聚焦车辆/交通闭环及安全。每条都有计算预算、失败场景和可复现实验，不按厂商模型逐个开课。

工程应用还覆盖过程、电力、储能等领域。它们可以采用RL，但每课先以领域约束和可信基线判断是否需要学习控制，不把“有RL论文”当必选方案。当前课程范围保留这些领域的控制基础，RL扩展由该课审计决定并回填 checklist。

### 3.3 命名、顺序与依赖规则

章名尽量4–8字、硬上限10字，不用冒号副标题、不用不并列的“X与Y”。课名最多16字，范围与算法清单放简介/H2，不堆在标题。必要通用缩写如PID、LQR保留。

目标 **21章205课 = 56课重构 + 149课新写**。相对141条基线，合并3组重复后为138课，再增67课；旧56份正文全部映射到56个目标，149新写中82课来自旧空条目、67课是新增。新增不是本次已完成产出。

下表“导航序”是最终显示顺序，“生产批次”是执行顺序。生产从数学开始，导论最后收口；其余从上到下逐课。入口依赖是章级边界合同，逐课的精确 prereq 在 Phase 1 分析后写回 catalog，检查无环、悬空或未解释前向边；不能拿整章全部课程当默认先修。

<!-- S3-CHAPTERS-BEGIN -->
| 导航序 | 生产批次 | slug | 章名 | 课数 | 入口依赖/边界 |
|---|---|---|---|---|---|
| 02 | 01 | math | 数学基础 | 18 | 高中数学；从函数与微积分补桥 |
| 03 | 02 | classic | 经典控制 | 11 | 数学基础的微积分、微分方程、变换 |
| 04 | 03 | modern | 现代控制 | 9 | 线性代数、微分方程、经典控制 |
| 05 | 04 | nonlinear | 非线性控制 | 12 | 现代控制、微分几何、Lyapunov方法 |
| 06 | 05 | discrete-sampled | 离散控制 | 10 | 现代控制、数学Z变换与数值方法 |
| 07 | 06 | implementation | 控制实现 | 10 | 离散控制、经典控制、数值方法 |
| 08 | 07 | machine-learning | 机器学习 | 9 | 概率、优化、线性代数与数值方法 |
| 09 | 08 | identification | 系统辨识 | 9 | 离散控制、概率、最小二乘基础在本章引入；神经辨识依赖机器学习 |
| 10 | 09 | estimation | 状态估计 | 8 | 状态观测器、概率、随机过程与离散控制 |
| 11 | 10 | robust | 鲁棒控制 | 11 | 现代控制、频域设计、状态估计 |
| 12 | 11 | mpc | 预测控制 | 11 | 离散最优控制、凸优化、系统辨识和状态估计 |
| 13 | 12 | intelligent | 智能控制 | 8 | 非线性控制、优化与机器学习 |
| 14 | 13 | rl-control | 强化学习控制基础 | 12 | 动态规划、概率、机器学习、最优控制与离散控制 |
| 15 | 14 | multi-agent | 多智能体控制 | 9 | 图论、博弈论、状态估计、预测控制与强化学习 |
| 16 | 15 | safety-ftc | 安全控制 | 8 | 非线性稳定性、优化、状态估计与强化学习 |
| 17 | 16 | robotics | 机器人控制 | 10 | 微分几何、现代与非线性控制、估计、预测控制与安全控制 |
| 18 | 17 | robot-learning | 机器人学习 | 10 | 机器人控制、强化学习、机器学习与安全控制 |
| 19 | 18 | embodied | 具身智能 | 10 | 机器学习、机器人控制和机器人学习；不是强化学习的同义词 |
| 20 | 19 | autonomous-driving | 自动驾驶 | 11 | 车辆建模在本章引入；估计、预测控制、安全控制、学习与世界模型 |
| 21 | 20 | applications | 工程应用 | 6 | 基础控制、辨识估计、鲁棒控制、预测控制；按行业选择学习路线 |
| 01 | 21 | introduction | 控制导论 | 3 | 导航排第一，生产在全部课程后收口；不作为基础课的必需先修 |
<!-- S3-CHAPTERS-END -->

## 4. 逐课目标与来源映射

<!-- S3-LESSONS-BEGIN -->
### 数学基础（math）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| MATH-01 | math/calculus-basics | 微积分入门 | 新写 | — |
| MATH-02 | math/complex-numbers | 复数基础 | 重构 | math/complex-numbers |
| MATH-03 | math/linear-algebra-basics | 线性代数基础 | 新写 | math/linear-algebra-basics |
| MATH-04 | math/eigen-decomposition | 特征值与对角化 | 新写 | math/eigen-decomposition |
| MATH-05 | math/matrix-decomposition | 矩阵分解 | 新写 | math/matrix-decomposition |
| MATH-06 | math/multivariable-calculus | 多元微积分 | 新写 | — |
| MATH-07 | math/ode-matrix-exponential | 微分方程与矩阵指数 | 新写 | math/ode-matrix-exponential |
| MATH-08 | math/laplace-transform | 拉普拉斯变换 | 新写 | math/laplace-transform |
| MATH-09 | math/fourier-analysis | 傅里叶分析 | 新写 | math/fourier-analysis |
| MATH-10 | math/z-transform | Z变换 | 新写 | math/z-transform |
| MATH-11 | math/probability-basics | 概率基础 | 新写 | math/probability-basics |
| MATH-12 | math/stochastic-processes | 随机过程 | 新写 | math/stochastic-processes |
| MATH-13 | math/convex-optimization | 凸优化 | 新写 | math/convex-optimization |
| MATH-14 | math/variational-dp | 变分法与动态规划 | 新写 | math/variational-dp |
| MATH-15 | math/diff-geometry | 微分几何入门 | 新写 | math/diff-geometry |
| MATH-16 | math/graph-theory | 图论基础 | 新写 | math/graph-theory |
| MATH-17 | math/game-theory-math | 博弈论基础 | 新写 | math/game-theory-math |
| MATH-18 | math/numerical-methods | 数值方法 | 新写 | math/numerical-methods |

### 经典控制（classic）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| CLASSIC-01 | classic/system-modeling | 系统建模 | 重构 | classic/system-modeling |
| CLASSIC-02 | classic/transfer-function | 传递函数 | 重构 | classic/transfer-function |
| CLASSIC-03 | classic/time-domain-analysis | 时域分析 | 重构 | classic/time-domain-analysis |
| CLASSIC-04 | classic/stability-analysis | 系统稳定性 | 重构 | classic/stability-analysis |
| CLASSIC-05 | classic/frequency-domain-analysis | 频域分析 | 重构 | classic/frequency-domain-analysis |
| CLASSIC-06 | classic/root-locus | 根轨迹 | 重构 | classic/root-locus |
| CLASSIC-07 | classic/pid-controller | PID控制 | 重构 | classic/pid-controller |
| CLASSIC-08 | classic/compensator-design | 校正网络 | 重构 | classic/compensator-design |
| CLASSIC-09 | classic/frequency-response-design | 回路整形 | 重构 | classic/frequency-response-design |
| CLASSIC-10 | classic/design-methods-comparison | 设计方法选型 | 新写 | classic/design-methods-comparison |
| CLASSIC-11 | classic/classic-case-study | 经典控制案例 | 重构 | classic/classic-case-study |

### 现代控制（modern）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| MODERN-01 | modern/state-space | 状态空间 | 重构 | modern/state-space |
| MODERN-02 | modern/controllability-observability | 可控性与可观性 | 重构 | modern/controllability-observability |
| MODERN-03 | modern/lyapunov-modern | 线性系统稳定性 | 重构 | modern/lyapunov-modern |
| MODERN-04 | modern/state-feedback | 状态反馈 | 重构 | modern/state-feedback |
| MODERN-05 | modern/state-observer | 状态观测器 | 重构 | modern/state-observer |
| MODERN-06 | modern/optimal-control-basics | 最优控制 | 重构 | modern/optimal-control-basics |
| MODERN-07 | modern/lqr-controller | LQR控制 | 重构 | modern/lqr-controller |
| MODERN-08 | modern/multivariable-systems | 多变量系统 | 重构 | modern/multivariable-systems |
| MODERN-09 | modern/modern-case-study | 现代控制案例 | 重构 | modern/modern-case-study |

### 非线性控制（nonlinear）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| NONLINEAR-01 | nonlinear/nonlinear-characteristics | 非线性系统 | 重构 | nonlinear/nonlinear-characteristics |
| NONLINEAR-02 | nonlinear/phase-plane | 相平面 | 重构 | nonlinear/phase-plane |
| NONLINEAR-03 | nonlinear/lyapunov-stability | Lyapunov稳定性 | 重构 | nonlinear/lyapunov-stability |
| NONLINEAR-04 | nonlinear/describing-function | 描述函数 | 重构 | nonlinear/describing-function |
| NONLINEAR-05 | nonlinear/feedback-linearization | 反馈线性化 | 重构 | nonlinear/feedback-linearization |
| NONLINEAR-06 | nonlinear/sliding-mode-control | 滑模控制 | 重构 | nonlinear/sliding-mode-control |
| NONLINEAR-07 | nonlinear/backstepping | 反步设计 | 重构 | nonlinear/backstepping |
| NONLINEAR-08 | nonlinear/adaptive-control-basics | 自适应控制 | 重构 | nonlinear/adaptive-control-basics |
| NONLINEAR-09 | nonlinear/passivity-control | 无源控制 | 新写 | — |
| NONLINEAR-10 | nonlinear/iss-small-gain | 输入状态稳定性 | 新写 | — |
| NONLINEAR-11 | nonlinear/switched-hybrid-systems | 切换与混杂系统 | 新写 | — |
| NONLINEAR-12 | nonlinear/bifurcation-chaos | 分岔与混沌 | 新写 | — |

### 离散控制（discrete-sampled）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| DISCRETE-01 | discrete-sampled/discrete-time-freq | 采样与量化 | 重构 | discrete-sampled/discrete-time-freq |
| DISCRETE-02 | discrete-sampled/discrete-time-systems | 离散时间系统 | 新写 | discrete-sampled/discrete-time-systems |
| DISCRETE-03 | discrete-sampled/difference-equation | 差分方程 | 新写 | discrete-sampled/difference-equation |
| DISCRETE-04 | discrete-sampled/z-transform-analysis | Z域系统分析 | 重构 | discrete-sampled/z-transform-analysis |
| DISCRETE-05 | discrete-sampled/discrete-stability-criteria | 离散系统稳定性 | 重构 | discrete-sampled/discrete-stability-criteria |
| DISCRETE-06 | discrete-sampled/discretization-methods | 离散化方法 | 重构 | discrete-sampled/discretization-methods |
| DISCRETE-07 | discrete-sampled/sampling-period-selection | 采样周期 | 重构 | discrete-sampled/sampling-period-selection |
| DISCRETE-08 | discrete-sampled/sampled-data-systems | 采样数据系统 | 新写 | discrete-sampled/sampled-data-systems |
| DISCRETE-09 | discrete-sampled/discrete-optimal-control | 离散最优控制 | 新写 | discrete-sampled/discrete-optimal-control |
| DISCRETE-10 | discrete-sampled/event-triggered-control | 事件触发控制 | 新写 | discrete-sampled/event-triggered-control |

### 控制实现（implementation）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| IMPL-01 | implementation/computer-control-architecture | 控制系统架构 | 重构 | implementation/computer-control-architecture |
| IMPL-02 | implementation/digital-pid | 数字PID | 重构 | implementation/digital-pid |
| IMPL-03 | implementation/pid-engineering-tuning | PID工程整定 | 新写 | implementation/pid-engineering-tuning |
| IMPL-04 | implementation/controller-discretization-practice | 控制器部署 | 新写 | implementation/controller-discretization-practice |
| IMPL-05 | implementation/embedded-implementation | 嵌入式控制 | 新写 | implementation/embedded-implementation |
| IMPL-06 | implementation/realtime-control | 实时控制 | 重构 | implementation/realtime-control |
| IMPL-07 | implementation/networked-control | 网络控制 | 新写 | implementation/networked-control |
| IMPL-08 | implementation/industrial-bus-protocols | 工业通信 | 新写 | implementation/industrial-bus-protocols |
| IMPL-09 | implementation/hil-rapid-prototyping | 半实物仿真 | 新写 | implementation/hil-rapid-prototyping |
| IMPL-10 | implementation/implementation-case-study | 控制实现案例 | 新写 | implementation/implementation-case-study |

### 机器学习（machine-learning）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| ML-01 | machine-learning/learning-problem | 学习问题与泛化 | 新写 | — |
| ML-02 | machine-learning/supervised-learning | 监督学习 | 新写 | — |
| ML-03 | machine-learning/neural-networks | 神经网络基础 | 新写 | — |
| ML-04 | machine-learning/autodiff-optimization | 自动微分与训练 | 新写 | — |
| ML-05 | machine-learning/sequence-models | 时序模型 | 新写 | — |
| ML-06 | machine-learning/attention-transformers | 注意力机制 | 新写 | — |
| ML-07 | machine-learning/representation-learning | 表征学习 | 新写 | — |
| ML-08 | machine-learning/generative-models | 扩散与流匹配 | 新写 | — |
| ML-09 | machine-learning/learning-evaluation | 学习实验评估 | 新写 | — |

### 系统辨识（identification）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| ID-01 | identification/identification-framework | 系统辨识框架 | 新写 | identification/identification-framework |
| ID-02 | identification/model-structures | 辨识模型 | 新写 | identification/model-structures |
| ID-03 | identification/least-squares-rls | 最小二乘辨识 | 新写 | identification/least-squares-rls |
| ID-04 | identification/persistent-excitation | 持久激励 | 新写 | identification/persistent-excitation |
| ID-05 | identification/instrumental-variable | 闭环辨识 | 新写 | identification/instrumental-variable |
| ID-06 | identification/frequency-domain-id | 频域辨识 | 新写 | identification/frequency-domain-id |
| ID-07 | identification/subspace-id | 子空间辨识 | 新写 | identification/subspace-id |
| ID-08 | identification/nonlinear-data-driven-id | 非线性辨识 | 新写 | identification/nonlinear-data-driven-id |
| ID-09 | identification/identification-case-study | 系统辨识案例 | 新写 | identification/identification-case-study |

### 状态估计（estimation）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| EST-01 | estimation/estimation-problem | 状态估计框架 | 新写 | estimation/estimation-problem |
| EST-02 | estimation/least-squares-ml | 统计估计 | 新写 | estimation/least-squares-ml |
| EST-03 | estimation/kalman-filter | 卡尔曼滤波 | 重构 | modern/kalman-filter;estimation/kalman-filter |
| EST-04 | estimation/extended-kalman-filter | 扩展卡尔曼滤波 | 新写 | estimation/extended-kalman-filter |
| EST-05 | estimation/unscented-kalman-filter | 无迹卡尔曼滤波 | 新写 | estimation/unscented-kalman-filter |
| EST-06 | estimation/particle-filter | 粒子滤波 | 新写 | estimation/particle-filter |
| EST-07 | estimation/sensor-fusion | 多传感器融合 | 新写 | — |
| EST-08 | estimation/estimation-case-study | 状态估计案例 | 新写 | estimation/estimation-case-study |

### 鲁棒控制（robust）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| ROBUST-01 | robust/robustness-concept | 鲁棒性 | 重构 | robust/robustness-concept |
| ROBUST-02 | robust/uncertainty-modeling | 不确定性建模 | 重构 | robust/uncertainty-modeling |
| ROBUST-03 | robust/robust-stability | 鲁棒稳定性 | 重构 | robust/robust-stability |
| ROBUST-04 | robust/robust-performance | 鲁棒性能 | 重构 | robust/robust-performance |
| ROBUST-05 | robust/h-infinity-basics | H∞控制 | 重构 | robust/h-infinity-basics |
| ROBUST-06 | robust/mixed-sensitivity | 混合灵敏度 | 重构 | robust/mixed-sensitivity |
| ROBUST-07 | robust/mu-analysis | 结构奇异值 | 新写 | — |
| ROBUST-08 | robust/mu-synthesis | μ综合 | 重构 | robust/mu-synthesis |
| ROBUST-09 | robust/h-infinity-filter | H∞滤波 | 新写 | estimation/h-infinity-filter |
| ROBUST-10 | robust/delay-robust-control | 时滞系统控制 | 新写 | — |
| ROBUST-11 | robust/robust-case-study | 鲁棒控制案例 | 重构 | robust/robust-case-study |

### 预测控制（mpc）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| MPC-01 | mpc/mpc-principle | 预测控制原理 | 重构 | mpc/mpc-principle |
| MPC-02 | mpc/prediction-model | 预测模型 | 重构 | mpc/prediction-model |
| MPC-03 | mpc/receding-horizon | 滚动优化 | 重构 | mpc/receding-horizon |
| MPC-04 | mpc/constraint-handling | 约束处理 | 重构 | mpc/constraint-handling |
| MPC-05 | mpc/mpc-stability | 递归可行性与稳定性 | 新写 | — |
| MPC-06 | mpc/generalized-predictive-control | 广义预测控制 | 重构 | mpc/generalized-predictive-control |
| MPC-07 | mpc/explicit-mpc | 显式预测控制 | 新写 | — |
| MPC-08 | mpc/nonlinear-mpc | 非线性预测控制 | 重构 | mpc/nonlinear-mpc |
| MPC-09 | mpc/economic-mpc | 经济预测控制 | 新写 | — |
| MPC-10 | mpc/mhe-fusion | 移动水平估计 | 新写 | estimation/mhe-fusion |
| MPC-11 | mpc/mpc-case-study | 预测控制案例 | 重构 | mpc/mpc-case-study |

### 智能控制（intelligent）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| INTEL-01 | intelligent/fuzzy-control-basics | 模糊控制 | 重构 | intelligent/fuzzy-control-basics |
| INTEL-02 | intelligent/fuzzy-controller-design | 模糊控制器 | 重构 | intelligent/fuzzy-controller-design |
| INTEL-03 | intelligent/expert-system | 专家控制 | 新写 | intelligent/expert-system |
| INTEL-04 | intelligent/genetic-algorithm | 遗传算法 | 新写 | intelligent/genetic-algorithm |
| INTEL-05 | intelligent/neural-network-control | 神经网络控制 | 重构 | intelligent/neural-network-control |
| INTEL-06 | intelligent/fuzzy-neural-network | 模糊神经网络 | 新写 | intelligent/fuzzy-neural-network |
| INTEL-07 | intelligent/iterative-learning-control | 迭代学习控制 | 新写 | — |
| INTEL-08 | intelligent/intelligent-case-study | 智能控制案例 | 新写 | intelligent/intelligent-case-study |

### 强化学习控制基础（rl-control）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| RL-01 | rl-control/rl-basics | 强化学习问题 | 新写 | rl-control/rl-basics |
| RL-02 | rl-control/dynamic-programming | 价值函数与贝尔曼方程 | 新写 | — |
| RL-03 | rl-control/q-learning | Q学习 | 新写 | rl-control/q-learning |
| RL-04 | rl-control/dqn | 深度Q网络 | 新写 | rl-control/dqn |
| RL-05 | rl-control/policy-gradient | 策略梯度 | 新写 | rl-control/policy-gradient |
| RL-06 | rl-control/actor-critic | 演员评论家方法 | 新写 | rl-control/actor-critic |
| RL-07 | rl-control/ppo | PPO算法 | 新写 | — |
| RL-08 | rl-control/sac-td3 | SAC与TD3 | 新写 | — |
| RL-09 | rl-control/offline-rl | 离线强化学习 | 新写 | — |
| RL-10 | rl-control/model-based-rl | 基于模型的强化学习 | 新写 | — |
| RL-11 | rl-control/rl-evaluation | 强化学习评估 | 新写 | — |
| RL-12 | rl-control/rl-control-case | 强化学习控制案例 | 新写 | rl-control/rl-control-case |

### 多智能体控制（multi-agent）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| MULTI-01 | multi-agent/multi-agent-overview | 多智能体系统 | 新写 | multi-agent/multi-agent-overview |
| MULTI-02 | multi-agent/consensus-control | 一致性控制 | 新写 | multi-agent/consensus-control |
| MULTI-03 | multi-agent/distributed-estimation | 分布式估计 | 新写 | multi-agent/distributed-estimation |
| MULTI-04 | multi-agent/distributed-optimization | 分布式优化 | 新写 | multi-agent/distributed-optimization |
| MULTI-05 | multi-agent/game-theory-basics | 控制中的博弈 | 新写 | multi-agent/game-theory-basics |
| MULTI-06 | multi-agent/formation-control | 编队控制 | 新写 | multi-agent/formation-control |
| MULTI-07 | multi-agent/distributed-mpc | 分布式预测控制 | 重构 | mpc/distributed-mpc |
| MULTI-08 | multi-agent/multi-agent-rl | 多智能体强化学习 | 新写 | rl-control/multi-agent-rl;multi-agent/multi-agent-rl |
| MULTI-09 | multi-agent/multi-agent-cooperation | 多智能体协同案例 | 新写 | multi-agent/multi-agent-cooperation |

### 安全控制（safety-ftc）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| SAFE-01 | safety-ftc/safety-overview | 控制安全 | 新写 | safety-ftc/safety-overview |
| SAFE-02 | safety-ftc/control-barrier-functions | 控制屏障函数 | 新写 | safety-ftc/control-barrier-functions |
| SAFE-03 | safety-ftc/reachability-analysis | 可达性分析 | 新写 | safety-ftc/reachability-analysis |
| SAFE-04 | safety-ftc/fault-detection-isolation | 故障诊断 | 新写 | safety-ftc/fault-detection-isolation |
| SAFE-05 | safety-ftc/fault-tolerant-control | 容错控制 | 新写 | safety-ftc/fault-tolerant-control |
| SAFE-06 | safety-ftc/safe-rl | 安全强化学习 | 新写 | rl-control/safe-rl;safety-ftc/safe-rl |
| SAFE-07 | safety-ftc/functional-safety-standards | 功能安全 | 新写 | safety-ftc/functional-safety-standards |
| SAFE-08 | safety-ftc/safety-case-study | 安全控制案例 | 新写 | safety-ftc/safety-case-study |

### 机器人控制（robotics）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| ROBOT-01 | robotics/robot-models | 机器人系统 | 新写 | — |
| ROBOT-02 | robotics/rigid-body-motion | 刚体运动 | 新写 | — |
| ROBOT-03 | robotics/kinematics | 机器人运动学 | 新写 | — |
| ROBOT-04 | robotics/dynamics | 机器人动力学 | 新写 | — |
| ROBOT-05 | robotics/motion-planning | 机器人运动规划 | 新写 | — |
| ROBOT-06 | robotics/trajectory-tracking | 轨迹跟踪 | 新写 | — |
| ROBOT-07 | robotics/impedance-control | 阻抗控制 | 新写 | — |
| ROBOT-08 | robotics/contact-control | 接触控制 | 新写 | — |
| ROBOT-09 | robotics/legged-control | 足式机器人控制 | 新写 | — |
| ROBOT-10 | robotics/robotics-case-study | 机器人控制案例 | 新写 | applications/robotics-control |

### 机器人学习（robot-learning）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| RLEARN-01 | robot-learning/robot-data | 机器人数据 | 新写 | — |
| RLEARN-02 | robot-learning/imitation-learning | 模仿学习 | 新写 | — |
| RLEARN-03 | robot-learning/offline-online-learning | 离线到在线学习 | 新写 | — |
| RLEARN-04 | robot-learning/residual-learning | 残差学习控制 | 新写 | — |
| RLEARN-05 | robot-learning/sim-to-real | 仿真到现实 | 新写 | — |
| RLEARN-06 | robot-learning/locomotion-learning | 运动技能学习 | 新写 | — |
| RLEARN-07 | robot-learning/manipulation-learning | 操作技能学习 | 新写 | — |
| RLEARN-08 | robot-learning/human-in-the-loop | 人机协同学习 | 新写 | — |
| RLEARN-09 | robot-learning/learning-with-mpc | 学习与预测控制 | 新写 | — |
| RLEARN-10 | robot-learning/robot-learning-evaluation | 机器人学习评估 | 新写 | — |

### 具身智能（embodied）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| EMBODIED-01 | embodied/embodied-systems | 具身智能系统 | 新写 | — |
| EMBODIED-02 | embodied/multimodal-observation | 多模态感知 | 新写 | — |
| EMBODIED-03 | embodied/action-representations | 动作表示 | 新写 | — |
| EMBODIED-04 | embodied/generalist-policies | 通用机器人策略 | 新写 | — |
| EMBODIED-05 | embodied/diffusion-flow-policies | 扩散与流策略 | 新写 | — |
| EMBODIED-06 | embodied/vla | 视觉语言动作模型 | 新写 | — |
| EMBODIED-07 | embodied/world-models | 世界模型 | 新写 | — |
| EMBODIED-08 | embodied/world-model-control | 世界模型控制 | 新写 | — |
| EMBODIED-09 | embodied/hierarchical-reasoning | 分层决策 | 新写 | — |
| EMBODIED-10 | embodied/embodied-evaluation | 具身智能评估 | 新写 | — |

### 自动驾驶（autonomous-driving）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| DRIVING-01 | autonomous-driving/driving-system | 自动驾驶系统 | 新写 | — |
| DRIVING-02 | autonomous-driving/vehicle-dynamics | 车辆动力学 | 新写 | — |
| DRIVING-03 | autonomous-driving/localization-prediction | 定位与运动预测 | 新写 | — |
| DRIVING-04 | autonomous-driving/motion-planning | 自动驾驶规划 | 新写 | — |
| DRIVING-05 | autonomous-driving/vehicle-control | 车辆跟踪控制 | 新写 | applications/auto-driving-control |
| DRIVING-06 | autonomous-driving/learning-planning | 学习型驾驶策略 | 新写 | — |
| DRIVING-07 | autonomous-driving/rl-decision | 驾驶决策强化学习 | 新写 | — |
| DRIVING-08 | autonomous-driving/driving-world-models | 驾驶世界模型 | 新写 | — |
| DRIVING-09 | autonomous-driving/driving-vla | 驾驶视觉语言动作模型 | 新写 | — |
| DRIVING-10 | autonomous-driving/closed-loop-evaluation | 闭环驾驶评估 | 新写 | — |
| DRIVING-11 | autonomous-driving/driving-safety | 驾驶安全与回退 | 新写 | — |

### 工程应用（applications）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| APP-01 | applications/power-electronics | 电力电子控制 | 新写 | applications/power-electronics |
| APP-02 | applications/process-control | 过程控制 | 新写 | applications/process-control |
| APP-03 | applications/aerospace-attitude | 飞行器姿态控制 | 新写 | applications/aerospace-attitude |
| APP-04 | applications/energy-storage-microgrid | 微电网控制 | 新写 | applications/energy-storage-microgrid |
| APP-05 | applications/biomedical-control | 生物医学控制 | 新写 | applications/biomedical-control |
| APP-06 | applications/semiconductor-equipment | 半导体装备控制 | 新写 | applications/semiconductor-equipment |

### 控制导论（introduction）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| INTRO-01 | introduction/why-feedback-works | 反馈为什么有效 | 新写 | introduction/why-feedback-works |
| INTRO-02 | introduction/control-landscape | 控制理论地图 | 新写 | introduction/control-landscape |
| INTRO-03 | introduction/controller-selection-guide | 控制方法选型 | 新写 | introduction/controller-selection-guide |

<!-- S3-LESSONS-END -->

## 5. 执行阶段与门槛

所有阶段对应全局 checklist 中的任务 ID，不在本计划再设置第二套完成复选框。

| 阶段 | 全局任务 | 工作与完成定义 |
|---|---|---|
| P 立项 | P01–P05 | 实测快照、调研与结构方案、两技能、全局台账校验、试走技能；本次完成可检查设计，不提前计入课交付 |
| I 开课前基建 | I01–I04 | 解决吞MDX编译错误的构建门槛；核对历史fix索引冲突标记；查清36 WARN并逐项登记处置；确保内核/验收可复现。不得通过清空课程规避错误 |
| S 结构落地 | S01–S04 | 完整映射、课型/难度与逐课先修审查；catalog 21章骨架与纯路径迁移；旧URL/必要锚点/引用和旧台账同步；check+build+迁移页/回归验收后合入 |
| W 基线风险处置 | W01–W05 | I03逐项审计后登记：锚点修复、孤儿组件去向、先修审查、真实DOM锚点门槛、两页MPC渲染修复；具体依赖和关闭条件见I03台账，S04前完成对应门槛 |
| C 逐课交付 | 每课唯一ID行 | 从MATH-01顺序进行，56重构/149新写，Phase1–4、实际验收和合并全部完成；具体缺陷在每课审计时才定 |
| R 收官 | R01–R03 | 全站check/verify:all/nb/术语/build及链接回归；来源与章节覆盖复核；fix归因回顾、统计和semester03标签 |

结构迁移不等于重构：只能搬移资产、改元数据/引用和重定向，保留56份正文的原始教学内容，不能在一个结构对话里代签多课。合并有正文+空条目时保留正文和正确状态；两空条目合一仍是empty；S3课程行仍全部未完成。旧路径不能先删再等新课交付，重定向目标必须可达且保留原可读内容。共享组件移动前核调用者；空目录不需要伪造MDX。

质量基建每项有实际失败样本与通过证据，内容交付按当前 AGENTS 与共同技能执行。build 的 exit=0 不足以覆盖 Q26 类吞错；旧课编译错误若阻塞全站门槛，先登记并修复阻塞，不能把全站未验记成通过。纯技术修复可在 I 任务处理；涉及教学结论的修订仍须课程讨论流程，单独一课一对话。

WARN 分为已知待处理/本课新增/阻塞；全局表登记实际明细文件及处理任务，不能笼统写“旧WARN全部可忽略”。本次快照有36项，后续结构会改变数量，以每次实测为准。旧 plan 的 Q 编号不重新编号，本期新增问题用 S3-Q001 起顺序登记到全局表。

I03审计明细与35课日志/30条孤立课程去向在 [semester-03/i03-warn-audit.md](semester-03/i03-warn-audit.md)。36项WARN原文固化为不可变证据，本期新增技术问题S3-Q001指源码slug预估与最终DOM不同；它由W04处理，不改冻结Q5口径。I03完成仅代表审计登记，底层问题仍须由W/S/逐课任务验收关闭。

S01迁移输入审查见 [结构清单](semester-03/s01-migration-review.md) 与 [205课候选先修](semester-03/s01-dependency-review.md)。141来源/56正文全部保留，8个旧入口改变、2份正文移动；148旧边逐条登记处置，候选图464边无环/悬空/未解释前向边，保留两条采样先修。S02按该审查落地课型/难度和先修，S03处理旧入口/引用/台账；仍由catalog提供线上元数据，逐课Phase 1复核教学依赖。W03仅完成审查部分，不提前关闭；S01未更改本计划目标范围或课程生产顺序。

S02已实施21章205课与464先修边，正文56份逐字保留，149空课和29个旧v1.3状态不变。为保证独立合入后可用，S03中必要的旧URL永久跳转和旧tracker/自动大纲同步前置到S02；S03仍负责锚点、引用与完整兼容验收，S04不提前关闭。迁移后30项WARN的实际审计及新发现存量notebook失败见 [S02记录](semester-03/s02-structure-migration.md)，I03/S01不可变快照保留；S01校验转对历史提交取证，迁移后用 `node scripts/check-structure-migration.mjs`。

S03迁移兼容已完成，见 [验收记录](semester-03/s03-compatibility.md)：统一9条旧入口与历史日志身份映射，规范化8份正文的10处课程URL，在渲染层保留分布式MPC的3个旧片段，全部迁移前渲染ID保留。只改引用/兼容，不改教学内容；旧台账状态与历史证据保留。W01/W04/W05的全站锚点和MPC正文渲染问题不由S03代签，S04仍待其相应门槛完成。

2026-10-18用户更新：日常直接在master修改、验收、提交并推送origin master；只暂存本任务文件，不带入用户未提交修改。确有长期维护需求才建分支，不再按课/工作包建短命分支或要求--no-ff。旧台账“合并”列保留为兼容名称，含义为交付提交已进入master；普通提交与历史合并提交均有效。Pages仍独立授权发布，历史回执与分支图不重写。

## 6. 目标清单与范围变更

上面的课程表是本期目标范围唯一清单，课程具体 H2/算例/习题/保留或重写方案均留到执行时讨论。source 用分号表示合并来源，`—` 表示新增；来源与新写/重构由基线有无正文判定。

本期暂不引入新角色、重新定义catalog状态枚举、制作另一套线上目录数据源或批量生成课文。结构落地中若出现新约束，新增全局任务与 S3-Q 记录，说明证据、候选、对顺序/来源的影响；用户目标范围改变时更新本计划、清单与映射，不能擅自修改冻结的学期2诊断。

变更记录：2026-10-17 初版立项；21章205课，141条基线全覆盖。实际校验与交付记录见全局 checklist 的 P04/P05 证据。

S04结构验收完成：W01–W05已按实际条件关闭，21章205课、56正文/149空课、464先修边，生产路径/真实锚点/数学/旧入口通过；check为PASS21/WARN2/FAIL0。全站verify仍有课程内容与组件存量债务，逐课登记，R01不提前关闭。参见 [S04证据](semester-03/s04-structure-acceptance.md)。下一对话从MATH-01微积分入门开始，新写技能与一个对话一节课节奏不变。

MATH-01微积分入门已完成新写Phase 1–4和实际验收，详见[本课验收](semester-03/math-01/acceptance.md)与全局checklist；目标范围/来源/顺序不变，本对话不生产MATH-02。check的35门日志债务成员不变，新增有日志正文令占比63%→61%，两项WARN复审见[逐课快照](semester-03/math-01/warnings.json)，不覆盖I03/S04历史快照。

MATH-02复数基础已按重构技能完成Phase1–4与实际验收，来源保留/纠错矩阵和证据见[本次验收](semester-03/math-02/acceptance.md)。同次按批阅及追加授权修订MATH-01开篇，补运动演示、无穷级数与泰勒桥；目录分别13/8个H2，不改本期课程范围与顺序。MATH-02先修明确为已交付的微积分入门，用户开工前正文删除保持。WARN日志债务仅复数基础关闭，35→34门，其余逐字保留；不改历史快照，不生产MATH-03。

2026-10-17用户要求增加GitHub Pages发布：DEP01准备静态导出与gh-pages源码发布分支，DEP02首次上线需单独确认版本。master更新不自动上线，每次用户明确同意后才反合gh-pages并推送；课程范围和Phase1–4门槛不变，静态版不承担Python内核运行。细则见docs/deployment/github-pages.md和全局checklist。

2026-10-17追加 DEP03：按用户本次条件授权，试验 Pyodide 本地浏览器执行，先交付数学两课并实测 python-control/Slycot 支持清单，本地验收通过即发布 gh-pages。其余课程继续静态代码展示，真实本地 Jupyter 保留；不改变课程范围和讨论工作流。此条更新此前“静态版不承担Python内核运行”的能力边界，详见 docs/deployment/pyodide-trial.md。

2026-10-17追加 DEP04：按本次用户授权，扩展所有经逐课实跑验证的兼容 Python 实验；以实验为单位启用，不兼容的保留源代码、明确原因并登记待处理清单。本地验收通过后直接发布 gh-pages，随后公网复验。课程正文/算法/交付状态不因执行能力扩展而变更，课程后续修改仍按讨论 SKILL。权威结果见 docs/deployment/python-expansion.md 与 python-expansion-delivery.md。

### MATH-03 执行回执（2026-10-17）

MATH-03「线性代数基础」按新写专用讨论技能完成Phase1–4；12节、7题答案、4个严格内核及Pyodide实跑实验、1个列合成/共线Explorer。数值、真实页面与生产构建证据见[本课验收](semester-03/math-03/acceptance.md)。不新增大学数学先修边，不生产MATH-04；下一课仍按原计划为「特征值与对角化」。合并只在全局checklist记录真实hash，gh-pages需另获具体版本授权。

2026-10-18排版裁决：全站块级公式恢复居中，所有开闭$$与公式分行（包含原单行式，引用保留>前缀）；行内单美元及代码不改。守卫npm run math:check，专项证据见semester-03/math-layout/acceptance.md。属于公共排版维护，不改变课程交付顺序/状态；新写与重构课一律沿用最新规则，历史讨论决定保留。

### MATH-04 执行回执（2026-10-18）

MATH-04「特征值与对角化」按新写专用讨论技能完成Phase1–4；12节、6题答案、5个严格内核及Pyodide实跑实验、1个特征倍率Explorer。主例与剪切/旋转边界、数域条件与初值作用的证据见[本课验收](semester-03/math-04/acceptance.md)。先修明确为已交付的线性代数基础与复数基础，不生产MATH-05；合并hash仅在全局checklist记录，gh-pages需另获具体版本授权。

### MATH-05 执行回执（2026-10-18）

MATH-05「矩阵分解」按新写专用讨论技能完成Phase1–4；14节、6题步骤答案、6个严格内核及Pyodide原始实验、1个SVD敏感性与截断Explorer。LU/QR/Cholesky/SVD、最小二乘与伪逆的前提和数值、阈值舍弃真实信号的代价见[本课验收](semester-03/math-05/acceptance.md)。保持已交付特征值课为前置；不生产MATH-06。合并hash仅在全局checklist登记，发布仍需具体版本授权。

### MATH-06 执行回执（2026-10-18）

MATH-06「多元微积分」按新写专用讨论技能完整完成Phase1–4；13节、6题步骤答案、6个严格内核及Pyodide实验、1个地图/高度剖面双图Explorer。从登山地图与既有单变量求导进入，贯穿偏导、全微分、梯度、链式法则、雅可比、Hessian与二重积分；可微性及驻点反例一并审校。证据见[本课验收](semester-03/math-06/acceptance.md)。批阅新增开篇原则固化为P06，MATH-03/04旧开篇返修分别登记W06/W07，仍待办；不生产MATH-07。真实合并hash登记全局checklist，发布仍需具体版本授权。

### MATH-07 执行回执（2026-10-18）

MATH-07「微分方程与矩阵指数」按新写专用讨论技能完整完成Phase1–4；15节、6题步骤答案、7个严格内核及Pyodide原始实验、1个串联水箱Explorer。从染料浓度的直观变化进入，逐步连接一阶初值、矩阵级数、对角化/不可对角化和输入积分，附非唯一/有限时间发散/时变系数边界。实际TS与通用矩阵指数及ODE独立交叉核对，近重根的参考精度问题与修复留证，见[本课验收](semester-03/math-07/acceptance.md)。不生产MATH-08；W06/W07旧开篇返修仍待办。合并hash在全局checklist登记，发布需具体版本授权。

### MATH-08 执行回执（2026-10-18）

MATH-08「拉普拉斯变换」按新写专用讨论技能完整完成Phase1–4；15节、6题步骤答案、7个严格内核及Pyodide原始实验、1个权重/有限积分Explorer。从前课衰减曲线深化到加权积分，串联ROC、导数初值项、逆变换、延迟/卷积与零初值传递函数，保留终值定理振荡/增长反例；实际TS与独立quad/高精度积分核对，详见[本课验收](semester-03/math-08/acceptance.md)。不生产MATH-09；W06/W07旧开篇批阅仍待办。真实合并hash在全局checklist登记，发布仍需具体版本授权。


### MATH-09 执行回执（2026-10-18）

MATH-09「傅里叶分析」按新写专用技能完整Phase1–4交付15节、6题步骤答案、7严格内核及Pyodide原始实验、1个双图合成Explorer。从风扇支架慢快振动叠加进入，讲解正交系数、幅相、截断/Parseval、普通傅里叶变换与稳定频响、DFT及采样；保留Gibbs、零幅相位、混叠/泄漏、奈奎斯特边界反例。实际TS114组68514采样点对独立积分参考，另36复积分及七实验精确契约；详见[本课验收](semester-03/math-09/acceptance.md)。不生产MATH-10，W06/W07仍待办；真实合并hash在全局checklist登记，发布另需具体授权。


### MATH-10 执行回执（2026-10-18）

MATH-10「Z变换」按新写专用技能完整执行Phase1–4；14节、6题步骤答案、6个严格内核及Pyodide原始实验、1个序列与加权和Explorer。从每分钟记录温差进入，讲双/单边变换与ROC、同分式左右序列、延迟初值、递推卷积、单位圆稳定与频响、模态采样，保留交替边界与终值失效反例。实际TS1923组24999点核独立高精度递推/求和，另9复级数与9单位圆反演；详见[验收记录](semester-03/math-10/acceptance.md)。本对话不生产MATH-11；W06/W07旧开篇仍待办，实际合并hash在全局checklist登记，发布另需版本授权。


### MATH-11 执行回执（2026-10-18）

MATH-11「概率基础」按新写专用技能完整Phase1–4交付15节、6题步骤答案、7严格内核及Pyodide原始实验、1个条件概率Explorer。从门口感应灯亮后是否有访客进入，讲条件反转/全概率贝叶斯、独立、分布与密度、矩/协方差、二项正态、样本与平均；补真实微积分先修，保留零概率条件、零协方差非独立和共同误差反例。实际TS220组对精确事件树，另256基础样本配置/32共同误差配置及独立正态积分，详见[验收记录](semester-03/math-11/acceptance.md)。本课发现轻量MDX扫描把数学a<X误识别为JSX而漏提取实验，排版调整并独立验证七项完整覆盖后放行；公共扫描修复/全仓审计另登记W08，未宣称已修。W06/W07仍待办，本对话不生产MATH-12；合并hash在全局checklist登记，发布另需版本授权。


### MATH-12 执行回执（2026-10-18）

MATH-12「随机过程」按新写专用技能完整Phase1–4交付16节、6题步骤答案、7严格内核及Pyodide原始实验、1个双图AR过程Explorer。从电子秤逐秒记录进入，讲轨迹/总体、均值与R/C、平稳/均方遍历、白与独立、AR初始化/相关平均/谱、Markov链、游走、向量协方差及Brownian基本概念；补真实傅里叶先修。实际TS728组对创新权重矩阵与卷积参考，另协方差Fourier谱积分、Kronecker矩阵解，详见[验收记录](semester-03/math-12/acceptance.md)。不生产MATH-13；W06/W07/W08继续待办，七实验独立计数核全；实际合并hash在全局checklist登记，发布另需具体版本授权。

### MATH-13执行回执（2026-10-18）

MATH-13「凸优化」按新写技能完整Phase1–4交付16节、6题步骤答案、6严格内核及Pyodide原始实验、双图功率分配Explorer。从两间房电暖器请求与总功率限制进入，贯穿凸性/存在唯一/对偶/KKT/Slater/投影梯度与停止证书，明确非凸与退化边界。实际TS750组与独立活跃集KKT参考对账；详见[验收记录](semester-03/math-13/acceptance.md)。W06/W07/W08继续待办，不生产MATH-14；真实合并hash登记全局checklist，发布仍需具体版本授权。

### MATH-14执行回执（2026-10-18）

MATH-14「变分法与动态规划」按新写技能完整Phase1–4交付16节、6题步骤答案、6严格内核及Pyodide原始实验、双图有限步小车Explorer。由归一化小车回家问题连接泛函/变分/EL/端点与充分性、Bellman/Riccati倒推与前向执行、协态/Hamilton/HJB；软终点和硬终点、离散和连续明确区分。实际TS960组对独立整段稠密正定QP；详见[验收记录](semester-03/math-14/acceptance.md)。W06/W07/W08继续待办，不生产MATH-15；合并hash登记全局checklist，发布仍需具体版本授权。

### MATH-15执行回执（2026-10-18）

MATH-15「微分几何入门」按新写技能完整Phase1–4交付16节、6题步骤答案、7严格内核及Pyodide原始实验、双图差速搬运车Explorer。由不能直接侧滑的具体运动连接局部坐标/切空间/正则约束/长度/推前、向量场与流、Lie导数/括号、常秩分布/Frobenius、旋转集合与相对阶退化；局部/全局及有限/二阶边界明确。实际TS120组对独立solve_ivp全101节点、81点曲线对expm；详见[验收记录](semester-03/math-15/acceptance.md)。W06/W07/W08继续待办，不生产MATH-16；实际合并hash登记全局checklist，发布仍需具体版本授权。

### MATH-16执行回执（2026-10-18）

MATH-16「图论基础」按新写技能完整Phase1–4交付16节、6题步骤答案、7严格内核及Pyodide原始实验、双图通信与一致性Explorer。从四个库房记录器交换参考数进入，连接路径/树/割、接收行邻接、拉普拉斯/关联能量、零谱与代数连通度、固定无向连续/离散一致性及有向加权极限；出根、平衡、步长、有限轮与解析极限明确。实际TS735组全21轮对独立BWB转置/eigvalsh/矩阵幂；详见[验收记录](semester-03/math-16/acceptance.md)。W06/W07/W08继续待办，不生产MATH-17；实际合并hash登记全局checklist，发布仍需具体版本授权。

### MATH-17执行回执（2026-10-18）

MATH-17「博弈论基础」按新写技能完整Phase1–4交付14节、6题步骤答案、7严格内核及Pyodide原始实验、双图充电选择/最佳响应Explorer。由两户各自决定功率但费用互相影响进入，讲清单方响应/NE/共同目标、独立混合与零和极小极大、存在/唯一、精确势/更新收敛、先行承诺与信息；静态教学模型不外推电价或真实电网控制。实际TS810组全81点曲线对独立二次拟合区间最小化与线性系统；40行对账、限定对照三工况含持平及完整有限表，详见[验收记录](semester-03/math-17/acceptance.md)。W06/W07/W08继续待办，不生产MATH-18；实际合并hash登记全局checklist，发布仍需具体版本授权。


### MATH-18执行回执（2026-10-18）

MATH-18「数值方法」按新写专用技能完整Phase1–4交付14节、6题步骤答案、7严格内核及Pyodide原始实验与双图冷却误差Explorer。从热水降温选步长进入，讲清误差/条件与残差、分解与最小二乘、求根停止、差分求积、阶数/稳定域/刚性、自适应事件与仿真口径。实际TS45组全部时间节点和201解析样点对独立80位稳定函数幂；保留同网格不同预算、零误差持平与显式高阶刚性失败，详见[验收记录](semester-03/math-18/acceptance.md)。数学章本期18课逐课完成；全站收官R01及W06/W07/W08仍待办，不生产下一课。实际合并hash登记全局checklist，发布仍需具体版本授权。


### CLASSIC-01执行回执（2026-10-18）

CLASSIC-01「系统建模」按重构专用技能完整Phase1–4，旧761行/13H2/0Notebook审计与逐项去向固化附录D；保留全部领域与原三题并扩六题，纠正输入/初值、反电势与电机降阶、液压量纲、辐射工作点时间尺度、LV/SIS及摆初值。13节短标题、七严格原始内核/Pyodide实验、自由释放/能量双图、三SVG；41阻尼×301全节点及四游标对独立矩阵指数，48行六列对账；36旧ID以7canonical+29别名全保留，无其它课正文变更。详见[验收](semester-03/classic-01/acceptance.md)。W06/W07/W08保持待办，新增W09复核开发IAB原生网关连接边界，严格内核和生产Pyodide不受该UI环境问题替代；不生产CLASSIC-02，不自动发布。实际合并hash登记全局checklist。


### CLASSIC-02执行回执（2026-10-18）

CLASSIC-02「传递函数」按重构专用技能完整Phase1–4，旧稿/页面/实验/组件审计与保留矩阵固化附录D。保留九题与正确推导，纠正二阶1/k归一化、外力与路面输入、幅频峰/截止、稳定定义、非单位反馈推广及内部对消顺序/扰动通道。11节、五严格原始内核/Pyodide实验；实际TS对独立scipy 27组×401时间节点与24组×401频率节点，57行对账；4别名+21保留ID兼容旧25全集，两组件默认ζ.5/wn8及上下双图窄屏验收。详见[验收](semester-03/classic-02/acceptance.md)。W06/W07/W08/W09保持待办，只交付本课，不自动发布。实际合并hash登记全局checklist；下一课CLASSIC-03另起对话。

### CLASSIC-03执行回执（2026-10-18）

CLASSIC-03「时域分析」按重构专用技能完整Phase1–4，原稿/页面/两实验/五组件审计与保留矩阵固化D。11节和九题全部保留，纠正无零点与路面含零点模型混用、临界除零、过阻尼冲激系数、调节时间粗估当保证、主导倍率误差承诺、题5/6/8/9；七原始严格内核/Pyodide实验、实际TS对独立状态空间36组全节点/连续指标、91行对账。两短H2以2别名+41保留ID兼容旧43全集；五图默认/边界/恢复/窄屏通过，两宽表局部横滚。详见[验收](semester-03/classic-03/acceptance.md)。W06/W07/W08/W09保持待办，只交付本课，不自动发布。实际合并hash登记全局checklist；下一课另起对话。

### CLASSIC-04执行回执（2026-10-18）

CLASSIC-04「系统稳定性」按重构专用技能完整Phase1–4，原稿/页面/四实验/两组件审计固化D。14节与十题保留，分开BIBO/内部/临界稳定、虚轴半单与重根，修Routh特殊行、倒立摆局部转矩模型、精确/Padé时滞边界和题3/4/6/8/9；八原始严格内核/Pyodide实验、118行对账、20×5151三阶节点/2601PD点与12极点工况/146独立边界通过。54旧ID以2别名兼容，五滑块端点/恢复/临界及生产窄屏图文验收；标题图例重叠及色块不一致已修后重建。详见[验收](semester-03/classic-04/acceptance.md)。W06/W07/W08/W09保持待办，只交付本课，不自动发布；真实合并hash登记全局checklist。


### CLASSIC-06执行回执（2026-10-18）

CLASSIC-06「根轨迹」按重构专用SKILL完整Phase1–4，保留12节/七题及原四实验全部教学目的，扩六原始实验七cell。纠正K0与隐藏模态、主导近似/4sigma保证、零点重心符号与普适优胜、PI输入条件；原Explorer改真实三阶根/响应双图，127增益×501全响应点与601背景根独立核、92行对账，48旧ID以4别名兼容。Q5保留原候选代数而改完整响应验收，不以采样签发假连续区间。生产默认/分离/零/48/60端点、390px无溢出和答案Pyodide通过，详见[验收](semester-03/classic-06/acceptance.md)。W06/W07/W08/W09与27待办保持开放；仅本课，不自动发布；真实合并hash登记全局checklist。

### CLASSIC-07执行回执（2026-10-18）

本轮仅交付classic/pid-controller，按重构专用SKILL完成Phase1–4。十三主题/九题/原五实验用途保留，52旧ID+5别名；真TS响应与独立SciPy115组对账，六原Notebook严格内核/Pyodide通过。修电机模型/虚假达标、Routh与结构排名、滤波/饱和/离散状态；87行对账和实际验收见.agent/semester-03/classic-07/acceptance.md。W06–09与27Python待办不关闭；仅合master，不发布。进度以全局checklist真实合并回执为准。

### CLASSIC-08执行回执（2026-10-18）

本轮仅交付classic/compensator-design「校正网络」，按重构专用SKILL完整Phase1–4。12主题/十题及四交互用途保留，54旧ID以2别名兼容；真实完整传函与状态方程替伪二阶/错误抗饱和模型。六原始Notebook严格内核及Pyodide执行，102环路独立幅相/根/响应与12限幅工况三状态量对照；98行对账、生产十图/端点恢复/390px与课程运行通过。撤销旧组合虚假达标及结构排名，Kv归一化/电机位置/题8启发式条件明确，见.agent/semester-03/classic-08/acceptance.md。W06–09及27Python待办开放；仅合master，不发布。真实合并回执见全局checklist，CLASSIC-09另起对话。

### CLASSIC-09执行回执（2026-10-18）

本轮仅交付classic/frequency-response-design「回路整形」，完整重构Phase1–4，保留十主题/十一题/三交互，39旧ID以五别名（四新增）兼容。补S/T/GS/CS频段合同，纠正归一化/GM单位/临界及复数互补、ZN分子、Q3欠定与Q5/7/9/11；六原实验严格内核/Pyodide与实际TS对200K/142ζ/五延迟通过，128项对账和生产5图/临界按钮/390px/课程运行见.agent/semester-03/classic-09/acceptance.md。W06–09与27Python待办仍开放，仅合master、不发布；真实合并回执登记全局checklist，CLASSIC-10另起对话。

### CLASSIC-10执行回执（2026-10-18）

本轮仅新写classic/design-methods-comparison「设计方法选型」，按新写SKILL完整Phase1–4：八节/六题/三原始Notebook，四合同同对象筛固定候选，不作结构排名；完整PI状态、目标误差口径、限幅不可达及噪声通道边界明确。独立状态空间对3候选×3幅值×2001节点y/u与6频点复响应通过；63项对账、严格内核/Pyodide3/3、生产页/390px/普通及Pages构建见.agent/semester-03/classic-10/acceptance.md。W06–09及27Python待办保持开放，只有本课合master，不发布；真实hash另登记全局checklist，CLASSIC-11另起对话。

### CLASSIC-11执行回执（2026-10-18）

本轮仅重构classic/classic-case-study「经典控制案例」，按重构SKILL完整Phase1–4，保留12主题/34H3/十题/六实验及P交互，47旧ID以单旧H1别名兼容。物理系数101→100.1、负载尺度、PI/PID/反算/灵敏度和十题全链纠错；补温和PI与305V输入反例，三种子360组不冒充全域保证。真实TS107K/601节点对独立状态，六严格内核/Pyodide、136行对账与390px/数字环路/两构建见.agent/semester-03/classic-11/acceptance.md，fix-043记录。W06–09及27Python待办继续开放，只合master，不发布。真实合并hash登记全局checklist；下一课MODERN-01另开对话。

## MODERN-01交付（2026-10-18）

状态空间按重构技能Phase1–4完成，保留10节/三物理例/十题及原两实验用途，五严格内核/Pyodide、65行对账、真实TS21×601点与独立物理参考、36旧ID/两别名/390px/两构建验收通过，详见semester-03/modern-01/acceptance.md。直接master提交推送后登记回执；用户另授权本课完成后发布届时master已有修改，DEP07据实际结果更新。不生产MODERN-02。

## MODERN-02 执行回执（2026-10-18）

仅本课modern/controllability-observability按重构SKILL完整Phase1–4，九主题/七例/十题及原三实验目的保留，扩六原始Notebook。对偶/PBH左右向量与Jordan、SISO证明及MIMO边界、反馈符号/坐标、Q1/Q6/Q9矩阵和Gramian时域/尺度/Hankel平方根纠错；两车具体入口与SVG、上下双图。六严格内核/Pyodide、44项对账、独立模态解析3×301全状态节点及Gramian，33旧标题ID保留；实际命令见semester-03/modern-02/acceptance.md。直接master验收提交并推送，真实hash随后登记全局checklist；不自动发布Pages，不交付MODERN-03。W08/W09/W10及27Python待办保持开放。


### MODERN-03 本轮执行记录（2026-10-18）

线性系统稳定性按重构技能Phase1–4推进，范围仅modern/lyapunov-modern。保留三例/十题/原三Notebook八cell用途；补小车能量SVG与三阻尼图、唯一性与指数界、半正定证书反例和可检测条件，LQR/Q6/Q8明确就地推导与边界。五H2缩短并保留旧ID，新增实际PBH先修modern/controllability-observability；OUTLINE拓扑层级由工具自动传播。学期3签发与master真实提交以全局checklist及.agent/semester-03/modern-03/acceptance.md为准。五Notebook十一cell严格Jupyter、独立闭式/符号/解析复核与Pyodide逐份执行；Pages仅本地构建预览，本轮未发布。W08/W09/W10及27Python待办不关闭，下一课MODERN-04另开会话。


### MODERN-04 本轮执行记录（2026-10-18）

状态反馈按重构技能Phase1–4完成，保留八主题/五例/十题/原两实验用途，扩五Notebook六cell。纠正SISO/MIMO边界、Ackermann坐标与行向量证明、Q6矩阵/Q7缩放/Q10正常秩及含D输出；原组件开环闭式纠错、等DC基线与施力双图，独立物理ODE核全部19滑块值×501点。Q9保留正确K并补精确指标/包络验收。路径/先修不变，短标题保留旧ID；签发、验收与master真实提交以全局checklist及.agent/semester-03/modern-04/acceptance.md为准。W08/W09/W10与27Python待办不关闭，未发布Pages，MODERN-05另开会话。

### MODERN-05 本轮执行记录（2026-10-18）

状态观测器使用重构技能Phase1–4，保留九主题、三例十题与原两实验用途。小车只测位置引入，真实SVG；纠正Q2伴随型/增益、Q5增广矩阵、例3根虚部，补可检测、分离性瞬态/实际输入/已知D、降阶z完整实现与偏差边界。真实组件26档×401对独立ODE，五原始实验严格内核/Pyodide，31旧ID兼容。最终签发及提交以全局checklist与.agent/semester-03/modern-05/acceptance.md为准；27项Python待办及W08/W09/W10不关闭，未发布Pages，MODERN-06另开会话。

### MODERN-06 本轮执行记录（2026-10-18）

最优控制按重构专用技能Phase1–4，保留10主题、四例十题与原BVP/代价cell用途。小车按时停车的目标冲突引入与任务SVG；修例3方向、Q1完整积分、Q5/Q7中间轨迹及Q9链式，补PMP正常型/必要与充分/终端条件/奇异弧、同T基线与可行性。真实组件三图全46档×401对独立Gramian/ODE，五实验六cell严格内核与Pyodide，35旧ID兼容。签发/实际master提交见checklist与.agent/semester-03/modern-06/acceptance.md；W08/W09/W10及27Python待办不关闭，未发布Pages，MODERN-07另开会话。

### MODERN-07 本轮执行记录（2026-10-18）

LQR控制按重构专用技能Phase1–4，保留10主题/三例十题和原CARE四cell用途。小车状态/加速度权衡引入与SVG；补DRE对TPBVP/终项、DARE正确Kd/求和尾项、权重缩放/单位、标量b0与采样边界。两模式组件真实模块785组、每组601轴界/四独立时刻与默认601全点复核；五实验八cell严格内核/Pyodide，30旧ID兼容。签发/真实master回执见checklist与.agent/semester-03/modern-07/acceptance.md；27Python待办/W08/W09/W10不关闭，本轮未发布Pages，MODERN-08另开会话。

### MODERN-08 本轮执行记录（2026-10-18）

多变量系统按重构专用技能Phase1–4，保留8主题/三例八题/原六cell用途。供暖耦合SVG入口；补约束增益/单位缩放、近奇异方向、静态逆瞬态/频率与适当性实证，澄清稳态条件与集中MPC。真实组件提纯模块，2116组各501点对独立ODE，四实验九cell严格内核与Pyodide，29旧ID兼容。实际签发/提交见checklist与.agent/semester-03/modern-08/acceptance.md；27Python待办和W08/W09/W10不关闭，本轮未发布Pages，MODERN-09另开会话。

### MODERN-09 本轮执行记录（2026-10-18）

现代控制案例按重构专用Phase1–4，保留12主题/七步链/八题/五原实验用途，统一均匀杆质量矩阵、Q/R、噪声SDE时标和实际限幅输入，补双输入弹簧项/平衡映射与局部稳定边界。新增噪声React实际CARE，123工况/三种子、九参数与四初角实测；公开3秒未达与85度退出，六实验十一cell/41旧ID。PY-004/PY-005本地闭环，其它25项与W08/W09/W10保留；签发/实际master回执见checklist及.agent/semester-03/modern-09/acceptance.md。本轮未发布Pages，本对话只交付本课。

### NONLINEAR-01 本轮执行记录（2026-10-18）

非线性系统按重构专用技能完成Phase1–4：抽屉间隙/推力上限引入，保留六类模型、叠加/频谱/切线/周期/限幅教学目的与七题，形成11短H2、五实验五cell。修连续性/光滑性、任意回线耗能、THD跳变、局部到全局与PI推导，真实TS组件30组对独立Python闭式/FFT及轴范围核验，原始Notebook严格Jupyter与Pyodide全部通过，43旧ID保留。旧跳跃/粘滑长扫描完整保留source-before快照，移入W13待NONLINEAR-02/12分别审查，未冒称其完成。签发、实际master提交与命令输出见全局checklist及.agent/semester-03/nonlinear-01/acceptance.md。原25项Python待办及W08/W09/W10保持；本轮不发布Pages，下一课另开对话。
### NONLINEAR-02 本轮执行记录（2026-10-18）

相平面按重构专用技能Phase1–4，保留十二组原实验/六题并补拖块摩擦与分类/答案核验，形成15短H2、14Notebook/27cell。秋千位置/速度SVG引入；修奇异J与双曲重根、nullcline、PB条件、有限扫描/数值停止/混沌断言和冲击状态/夹角；两真实组件对独立DOP853/矩阵指数/径向闭式，保留全部旧ID。W13中本课局部材料已审，NONLINEAR-12仍待审；25Python待办、W08/W09/W10不关闭。签发与实际master提交见全局checklist及.agent/semester-03/nonlinear-02/acceptance.md。本轮不发布Pages，不交付下一课。

## 8. 独立中文润色工作（2026-10-18用户调整）

润色目的、要求、完整205课计划和逐课记录统一维护在 [.agent/semester-03/zh-lang-edit/README.md](semester-03/zh-lang-edit/README.md) 及同目录 PLAN.md。由其他模型在 `codex/semester-03-zh-lang-edit` 长期分支完成，不使用角色讨论或 Phase 1–4，不向既有内容生产 SKILL 添加润色职责。原22人团队恢复，课程生产规则照旧。

润色结果仅在用户明确要求合入时，由维护 Agent 做简单审核后合入 master；不得自行合并或发布 Pages。当前 CLASSIC-01 试稿保留，未视为用户认可；历史材料迁入该目录 archive，仅供参考。

### NONLINEAR-03 本轮执行记录（2026-10-18）

Lyapunov稳定性按重构技能完整Phase1–4，仅本课。保留13主题、原四实验八cell与五题，补抽屉储能SVG/两核验实验/临界第六题；纠稳定性包含、反例-2、圆外收敛过推、摆多圈与紧势阱、平面PD/关节调节/电网边界。实际TS195组292695点对独立DOP853，六符号恒等与PD独立expm；六Notebook十cell严格Jupyter/Pyodide及真实工具栏通过，17旧ID保留、375px表内滚动。签发/真实master回执见全局checklist及.agent/semester-03/nonlinear-03/acceptance.md；原25Python待办及W08/W09/W10不关闭，独立中文润色目录/分支不动，本轮不发布Pages。

### NONLINEAR-04 本轮执行记录（2026-10-18）

描述函数按重构专用Phase1–4，仅本课。保留原12主题、六实验21cell和六题，增恒温器SVG引入及手算/习题核验，共七实验22cell；修正圆判据全局保证、HB候选与真实周期轨道混淆、双根网格误差、饱和临界解族、谐波指标与步长解释。两实际组件共享纯数值实现，对独立分段积分390组、HB4608组和事件驱动连续仿真复核；真实页面分支/恢复/375px及20旧ID通过。S04本课组件第5项债务关闭，W08/W09/W10及原25项Python待办保留；实际签发和master回执见全局checklist与.agent/semester-03/nonlinear-04/acceptance.md。不操作中文润色分支、不发布Pages，下一课另起对话。

### NONLINEAR-05 本轮执行记录（2026-10-18）

反馈线性化按重构专用Phase1–4，仅本课。保留15主题、四原实验十二cell与五题，纠对合分布、跟踪符号、Q2导数/Q4速度、球梁三阶余项与局部证明、机械臂向量相对阶及惯性/重力失配。增真实SVG、三带宽及三惯性缩放/答案核验，共六实验十五cell/六题；零动态组件统一初值、解析实际末时/控制量、a0改r2与默认恢复。实际TS40工况20040点、9符号恒等、摆误差坐标及球梁z坐标DOP853、原始内核/Pyodide、42旧ID与375px通过。验收与实际master回执见全局checklist及.agent/semester-03/nonlinear-05/acceptance.md。W08/W09/W10和原25项Python待办保留，不操作中文润色分支，不发布Pages，不交付下一课。

### NONLINEAR-06 本轮执行记录（2026-10-18）

滑模控制按重构专用Phase1–4，仅本课。保留13主题、原五实验17cell、六题与四应用，纠滑动不变性、输入增益/量纲、sat/tanh界、STA导数假设、RK4阶段控制、电机静差及恢复比较；增真实SVG与手算/默认核验，共六实验18cell。组件全步指标与真实终时、四律禁用参数及恢复通过；实际TS48工况72048点、4符号/秩核验、连续DOP853/步长收敛、原生/Pyodide及44旧ID、375px通过。实际签发与master回执见全局checklist及.agent/semester-03/nonlinear-06/acceptance.md。原25Python待办与W08/W09/W10保留，不动中文润色分支，不发布Pages，不交付下一课。

### NONLINEAR-07 本轮执行记录（2026-10-18）

反步设计按重构专用Phase1–4，仅本课。保留12主题、六原实验26cell、六题，纠二阶等价推广、全局条件、自适应两估计器与PE平方窗口、四阶静差、采样和吸引域误称。增SVG与完整数学/默认核验，共七实验27cell；组件公开ZOH、实际终时、全节点指标、默认恢复及完整增益域。真实TS36配置198036绘图节点、4符号恒等、expm/自适应与机器人DOP853、原生/Pyodide、41旧ID及375px通过。实际签发与master回执见全局checklist及.agent/semester-03/nonlinear-07/acceptance.md；原25Python待办与W08/W09/W10保留，不动中文润色分支，不发布Pages，不续做下一课。

### NONLINEAR-08 本轮执行记录（2026-10-18）

自适应控制按重构专用Phase1–4，仅本课。保留13主题、九原实验38cell、六题，纠高阶输入信息、固定V参数界、有限时域无界/PE推断、泄漏唯一性、RLS先验、机器人初速及谐波；追加核验共十实验39cell。组件真实19配置27465点独立对账、三种子、DOP853、原生/Pyodide及55旧ID验收见本期讨论日志与.agent/semester-03/nonlinear-08/acceptance.md。原25项Python待办及W08/W09/W10保留，中文润色分支不动，Pages另行授权；真实签发与master回执以全局checklist为准。

### NONLINEAR-09 本轮执行记录（2026-10-18）

无源控制从空占位按新写专用Phase1–4完成。以三次弹簧小车贯穿能量收支、无源输入输出、阻尼与目标能量整形，补互联适定、隐藏状态及限幅/延迟边界；10H2、3Notebook3cell、四题四答、SVG和PassivityExplorer。实际TS五配置2505点对独立DOP853、原生/Pyodide完整实验及375px页面通过，详见.agent/semester-03/nonlinear-09/acceptance.md。用户批阅与润色分支保持，25Python待办及W14保留；仅本课进入master，Pages另行授权。

### NONLINEAR-10 本轮执行记录（2026-10-19）

输入状态稳定性从空占位按新写专用Phase1–4完成：线性积分解引入ISS，标量非线性给直接界与Lyapunov界，二维耦合证明小增益，保留临界/失败及反向仍稳定反例。10H2、3Notebook3cell、四题四答、耦合SVG和IssSmallGainExplorer；真实TS九配置3609点对独立增广矩阵指数、原生/Pyodide全部实验、真实标题/锚点与375px页面通过。证据.agent/semester-03/nonlinear-10/acceptance.md，实际master回执以全局checklist为准。用户批阅与长期润色分支保持，25Python待办及W14不关闭，Pages另行授权，不交付下一课。


### NONLINEAR-11 本轮执行记录（2026-10-19）

切换与混杂系统从空占位按新写专用Phase1–4完成。恒温器引入模式记忆、守卫与重置；稳定矩阵的快切反例引出共同Lyapunov与最小驻留证明；事件检测弹跳球说明Zeno有限累积与接触续接缺口。11H2、4Notebook4cell、四题四答、状态图SVG与SwitchedHybridExplorer；实际TS九配置7209点对独立SciPy矩阵指数、原生/Pyodide全部实验、真实锚点和375px页面通过。证据.agent/semester-03/nonlinear-11/acceptance.md，实际master回执以全局checklist为准。25项Python待办及W14保留，用户批阅和长期润色分支保持，Pages另行授权，本对话不续写下一课。


### NONLINEAR-12 本轮执行记录（2026-10-19）

分岔与混沌从空占位按新写专用Phase1–4完成：电机带摆平衡消失引入折叠/叉形，再以径向方程证明Hopf；Logistic逐步更新解释乘子、周期倍化、窗口和有限指数，保留正指数不稳定不动点反例。13H2、4Notebook5cell、五题五答、SVG与BifurcationExplorer；14配置140014实际TS轨道点及三初态17424点云核高精度短程/稳定周期/逐步残差，Duffing周期解由独立Radau+差分乘子复算，原生/Pyodide、真实锚点/375px页面通过。W13指定旧跳跃/鞍结/吸引子材料逐项审完，四组修正扫频核驻留/步长/网格；只认有限窗口区间，不认证完整分支或吸引域。证据.agent/semester-03/nonlinear-12/acceptance.md及source-audit.md；实际master回执以checklist为准。25Python待办及W14保持，用户批阅和长期润色分支保持，Pages另行授权，不顺带交付后续课。


### DISCRETE-02 本轮执行记录（2026-10-19）

离散时间系统由空占位按新写专用Phase1–4完成。每分钟房间温差引入递推，区分初始状态与加热输入，矩阵同步更新以错误覆盖反例解释，脉冲/卷积连接零初值传递函数。8H2、3Notebook3cell、四题四答、两SVG；独立几何和/矩阵幂/SciPy、原生与Pyodide、375px及Pages本地基路径验收通过。证据.agent/semester-03/discrete-02/acceptance.md；master真实回执见全局checklist。DISCRETE-01未完草稿保留检查点，不继承签发；本课局部解释采样编号，不依赖其未验收数值。25项Python待办、W14、用户批阅及长期润色分支保持；本地端口四文件不提交，Pages另行授权，不顺带交付下一课。


### DISCRETE-03 本轮执行记录（2026-10-19）

差分方程从空占位按新写专用Phase1–4完成，math课型由方数、岳自、小初、陆阅参与。沿用上一课温差递推引出差分与初值，一阶几何和/特解核a=1边界，二阶不同根与非零重根用代入与等差数列推导，单边Z保留初值并限定ROC。9H2、3Notebook3cell、四题四答、一SVG；独立Fraction精确算术与增广矩阵幂、原生/Pyodide/页面输出、375px及Pages本地基路径全部通过。目录Z大小写按真实渲染ID纠正；证据.agent/semester-03/discrete-03/acceptance.md，master真实回执见全局checklist。本次用户指定DISCRETE-03的顺序例外单独登记，未沿用上一课授权；DISCRETE-01未完草稿保留，不使用其未验收数值。25Python待办、W14及用户批阅不关闭，端口四处本地修改不提交，Pages另行授权，本对话不生产下一课。


### DISCRETE-04 本轮执行记录（2026-10-19）

Z域系统分析按重构专用Phase1–4完成，保留11H2主题、旧标题ID、原三组实验及四组全部子题，纠正ZOH增益、离散模态指数、终值适用条件、反变换答案、频率方向和递推延迟。新增模态映射交互与SVG；实际TS十配置对独立60位mpmath，五Notebook六cell由严格原生内核、Pyodide及两种实际页面核验。证据.agent/semester-03/discrete-04/acceptance.md，真实master回执见checklist。PY-007关闭，Python待办25→24；其余任务元数据保留。必要fix索引历史七处元数据问题补齐后双向校验通过，未改历史正文。用户明确指定本课的顺序例外单独登记，DISCRETE-01草稿、proofreading及四处本地端口排除提交；仅本地Pages验收，不发布、不续写下一课。


### DISCRETE-05 本轮执行记录（2026-10-19）

离散系统稳定性按重构专用Phase1–4完成，保留原9H2/38标题主题/41旧课程ID、三实验组四cell和全部四题。纠正状态/BIBO与单位根条件、二阶根、采样PI数值、伪临界回退、理想PID不真有理、离散频响与裕度交点、Schur-Cohn定义及题3近似冒充精确上限；原正确w映射保留并补z1例外。新增Jury交互与SVG，五Notebook六cell、真实TS十三配置、独立状态矩阵指数/解析频响/SymPy、375px及Pages本地页面验收通过。证据.agent/semester-03/discrete-05/acceptance.md；真实master回执见全局checklist。PY-008/009实测修复，Python待办24→22，其余任务元数据保留。用户指定05的顺序例外独立登记，01草稿与用户批阅、本地端口四文件不提交；本次不发布Pages、不顺带生产下一课。


### DISCRETE-06 本轮执行记录（2026-10-19）

离散化方法按重构专用Phase1–4完成，原八H2/39标题主题/41课程ID、三实验组四cell及四题保留纠错，新增一实验共四Notebook五cell。修Euler因果/绝对稳定区、Tustin方向/预扭曲、matched积分器增益与默认API、反算符号/单位/真实状态/未触饱和基线、导数滤波和首达指标。数字PI由原生/浏览器及独立MP/Decimal/状态模型核，真实TS十三配置、375px及Pages本地验收通过。正式H1与首H2同名，旧离散化方法ID转H1开篇，H2canonical为离散化方法-1，旧数字控制器设计span保留；歧义明确登记，未伪称段落未变。PID工程材料本页全文保留，IMPL-02迁移未完不计交付。证据.agent/semester-03/discrete-06/acceptance.md；master真实回执见checklist。PY-010/011实测修复，待办22→20，其它元数据保留；W10仅处理本课错误Euler字符图。01草稿、用户批阅及四端口不提交；Pages不发布，本对话止于06。


### DISCRETE-07 本轮执行记录（2026-10-19）

用户指定继续“采样周期”，单独登记暂缓DISCRETE-01，草稿隔离保存。按重构SKILL推进Phase1–4，仅本课。三旧Notebook均因ipywidgets导致setup失败，S04完整性债务随本课修复；原七H2/十二H3/三实验对象与用途/四题保留，来源映射见.agent/semester-03/discrete-07/source-audit.md。新增微分滤波明确建立可实现PID新基线，所有数字独立状态复算；单位圆频响/相位支路、无交越、真实采样轴、ADC串行预算与多率固定精度/整数调度纠错，保留未胜/失稳和执行代价。

本课verify唯一WARN：event-triggered-control为后续阅读占位，不作为前置；归DISCRETE-10交付后复核链接。PY-012/013/014经真实浏览器原始cell实跑后关闭，其余17项保留。S04历史快照不改，当前PASS证据在本课acceptance；W10仅本课三字符图已审/图文及SVG替代，其余候选未清零。fix-068归因既有职责执行不足，不扩编角色或改润色SKILL。最终签发、命令/退出码及master提交见checklist链接。


### DISCRETE-08 本轮执行记录（2026-10-19）

用户指定继续08，单独登记暂缓01，草稿隔离。空占位按wiki-lesson-new完整Phase1–4，仅交付采样数据系统：一阶精确段内轨迹/保持、Phi/Gamma积分与奇异A、采样状态反馈及一拍延迟、旋转输出漏采、完整Schur采样状态到连续指数衰减的有条件证明。七H2、两Notebook四cell、一个真实TS交互与SVG，四题答案独立复算。十三TS配置与39493个原始cell数值量核验；顺读把实验移到对应矩阵解释后，源hash变化全链路重跑。

新课不追认旧v1.3/历史讨论，无旧正文迁移或历史fix需伪造。新增两实验通过浏览器实跑才启用Pyodide，原17待办与W08/W09/W10保持；不借此生产09/10或关闭07后续占位提示。实际命令/退出码与最终签发、master回执见本课checklist链接。本次不发布Pages。

### DISCRETE-09 本轮执行记录（2026-10-19）

离散最优控制从空占位按新写专用Phase1–4完成。保温箱交班问题→离散有限步Bellman/标量配方→Riccati倒推/正向执行→DARE条件→输入约束边界；8H2、四题四答、一个Explorer与SVG、两Notebook四cell。实际TS十五参数配置对独立Fraction全输入稠密消元；原始内核、Pyodide、两种页面与375px验收通过。证据.agent/semester-03/discrete-09/acceptance.md；master真实提交见checklist。独立登记暂缓01的用户顺序例外，不继承08授权；01草稿、用户批阅及四处本地端口排除提交。本对话仅生产09，不发布Pages、不生产10。新增两实验支持，17项Python待办元数据保留；zh计划只更新生产交接、不代做润色。

### DISCRETE-10 本轮执行记录（2026-10-19）

事件触发控制从空占位按新写专用Phase1–4完成。温室无线读数入口→测量/发送/控制更新→保持误差与理想连续Lyapunov条件→周期检查→通信代价/漏检/Zeno/自触发边界；八H2、四题四答、两Notebook四cell、一个Explorer/SVG。17真实TS配置对独立60位解析事件段，195控件组合固定轴范围、36610个原始Notebook量、严格内核、Pyodide、两种真实页面与375px验收通过。默认/每拍持平/两路线发散/少发但趋−2均保留，未将连续定理套到周期程序。证据.agent/semester-03/discrete-10/acceptance.md，真实master回执见checklist。仅本课；01草稿、用户批阅、四处本地端口排除提交；本轮顺序例外独立登记，不发布Pages、不生产下一章。新增两实验可运行，17项Python待办元数据保持，zh只登记生产交接。07历史后续阅读的目标现已交付并验收HTTP200，不重写历史记录。


### DISCRETE-01 恢复交付（2026-10-19）

采样与量化旧稿按重构专用Phase1–4恢复完成。原九H2、十九H3、三实验主题、四题全部子问有保留映射；纠正混叠相位、ZOH归一化、带宽、有限ADC、离线/反馈量化、滤波衰减与不可实现PID。新增一Explorer、两SVG，六Notebook七cell。独立高精度解析参考、真实TS210配置、严格内核与Pyodide、普通/Pages/375px验收证据见.agent/semester-03/discrete-01/acceptance.md；真实提交回执与发布结果见全局checklist。历史02–10顺序例外保留为事实，不再有01生产缺口。仅本课；W14/W15及用户批阅、本地端口不随课修改。

### ROBUST-01 鲁棒性（2026-10-24）

按用户指定rank5隔离完成重构Phase1–4：保留10H2、四题全部子问与三组实验用途，四Notebook四cell原生/Pyodide实跑，共振交互真实TS对独立Python九配置，旧锚点、375px与本地Pages基路径通过。纠范数/网格、裕度单位、最近距离圆、小增益前提、LQR条件及题解，PY-018关闭。证据.agent/semester-03/robust-01/acceptance.md，master真实回执见全局checklist；不发布Pages，不续写下一课。


### MULTI-01执行回执（2026-10-24）

多智能体系统由空占位按新写Phase1–4完成：三辆独立车道小车的速度协调串联局部对象、接收信息图、局部反馈与团队目标，区分一致/跟踪/编队，保留断图、单向根节点、临界与超界采样反例。八H2、四题四答、一个Explorer与SVG、两Notebook四cell；135组真TS对独立谱解/Jordan闭式/矩阵幂，严格内核与Pyodide、普通与Pages原始输出、两种页面375px及固定轴全部通过。rank9独立副本/8199/8999/8499；完整证据.agent/semester-03/multi-01/acceptance.md。仅本课，保留其它会话与用户批阅；不发布Pages、不续写MULTI-02。真实master回执 commit:9d920bbaed693d869f943701acc8658c4d9914b6；最终冻结投影完整check及学期校验退出0，证据见验收记录。

### SAFE-01 控制安全交付

2026-10-24按用户rank10指定完成新写Phase1–4。仓库小车停车引出稳定与安全、约束/可行行动、延迟/误差/制动预算、监测回退及安全论证边界；9H2、四题四答、1Explorer/1SVG、2Notebook3cell。192真实TS配置对独立ODE、矩阵指数/Fraction、严格内核/Pyodide、实际Pages运行和375px验收通过。证据.agent/semester-03/safe-01/acceptance.md；仅本课，不依赖并行草稿、不发布Pages；真实master提交见checklist。W09原生IAB连接边界及其它会话检查点保留，中文仅生产交接。

### DRIVING-01 本轮执行记录（2026-10-24）

自动驾驶系统从空占位按新写Phase1–4完成。直路障碍停车问题引出运行范围、功能闭环、消息合同、延迟预算、监控与回退及闭环证据；十H2、四题四答、两Notebook四cell、一Explorer/SVG。实际TS六配置对精确Fraction速度积分，7098固定轴组合；原生内核、生产Pyodide、普通/Pages本地页面与375px验收通过，证据.agent/semester-03/driving-01/acceptance.md；真实master提交后登记回执。用户指定本课及rank14，独立登记顺序例外；移除对并行未签发安全课的硬依赖，局部定义补足。无整车试验或认证声明，不发布Pages、不生产下一课；其它会话及用户修改保留。

### RL-01执行回执（2026-10-24）

强化学习问题从空占位按新写Phase1–4完成，送餐机器人贯穿状态/动作/联合核/回报/策略与评估，九H2、两Notebook三cell、双图Explorer/SVG、四题四答。真实TS61206配置对独立Fraction概率树，严格原生内核与最终Pyodide、Pages基路径页面实跑和375px验收见.agent/semester-03/rl-01/acceptance.md。以rank8隔离副本避开共享.next及他课端口，提交只含本课。已知模型精确计算不冒充训练；错误奖励循环另设模型，含充电落败及持平工况。顺序例外单独登记，仅本课；W09原生UI连接债务、用户批阅与其它课程保持；不发布Pages、不生产RL-02。真实master hash在全局checklist登记。


### ROBOT-01 执行回执（2026-10-24）

机器人系统从空占位按新写Phase 1–4完成：固定底座两杆投影与水平滑台贯穿构型/任务量/状态/测量/输入，止挡给出模型失效边界。十H2、两Notebook三cell、一Explorer、一SVG、四题四答；实际TS1309组132209点对独立Fraction与状态转移，严格内核、Pyodide、原生/Pages基路径及375px通过。证据.agent/semester-03/robot-01/acceptance.md；真实master提交见全局checklist。用户指定顺序例外只放行本课，保留其它会话和用户批阅，不发布Pages、不生产下一课。


### INTEL-01 执行回执（2026-10-24）

模糊控制按重构Phase1–4保留12H2、6题及9原实验，新增默认值/条件反例实验。纠正归一化、FAMM行列、MOM、积分与比较边界；868真实TS配置及非对称两输入点独立核。严格原生33cell与Pyodide10实验、生产/375px/Pages本地验收见.agent/semester-03/intel-01/acceptance.md。真实master提交回执仅见全局checklist；用户批阅、其它并行课程、共享端口与Pages发布排除本课。


### EMBODIED-01 本轮执行记录（2026-10-24）

用户指定rank13，具身智能系统从空占位按新写Phase1–4完成。杯子任务引出身体/环境/观测/策略/动作接口与多率闭环；10H2、2Notebook2cell、1Explorer与SVG、四题四答。实际TS750配置与Fraction独立实现135750量核对，保留H5恰好到位反例；原生内核、固定Pyodide、真实锚点与窄屏、生产构建验收见.agent/semester-03/embodied-01/acceptance.md。作者原始资料与本课简化模型分开，未训练或部署完整模型。共享端口脚本、用户批阅与其它课程修改保留；只提交本课，未发布Pages，不生产下一课。

### IMPL-02 数字PID本轮交付

按重构SKILL Phase1–4完成，仅本课。八主题/四题用途、36旧ID保留；修正位置/增量状态、BE/Tustin导数、c=0、反算时序/单位、分离与无扰历史、ZN规则、不可达和级联题解。承接离散化方法工程材料但不删已交付来源。真实TS750配置对Decimal、原始四Notebook八cell对独立卷积/解析、111行对账；严格内核/Pyodide/两实际页面248量及375px、静态Pages构建通过，详见.agent/semester-03/impl-02/acceptance.md。fix-074；并行会话元数据与独占资源保留，实际master回执见全局checklist。本次不发布Pages，不开始IMPL-03。


### ML-03 本轮执行记录（2026-10-24）

神经网络基础从空占位按新写Phase1–4交付：两台水泵XOR指示需求贯穿表达问题，以1→2→1的可手算ReLU构造讲层/偏置/激活/前向，再给XOR不等式证明、域外负输出及失活梯度边界。十H2、两Notebook四cell、四题四答、一Explorer/SVG；真实TS4080前向/240损失/25二维对独立解析与高精度参考，原始严格内核、Pyodide、最终课程页及375px通过。证据.agent/semester-03/ml-03/acceptance.md，真实master提交后见全局checklist。rank2独立8196/8992与Git索引，保留其它会话与共享暂存；用户指定的本课顺序例外独立登记，不继承ML-02授权。W09/W16/QA01保留，不发布Pages、不生产ML-04。

### DRIVING-02 本轮执行记录（2026-10-24）

车辆动力学从空占位按新写Phase1–4完成。后轴无侧滑几何→CG侧偏力/力矩→横向状态空间→总附着与低速边界；十H2、四题四答、两Notebook四cell、一Explorer/SVG。真实TS六工况2412轨迹量对独立轴力/力矩矩阵指数，3213控件状态；严格内核、生产Pyodide、普通/Pages本地及375px全部通过。证据.agent/semester-03/driving-02/acceptance.md，真实master回执另补。只依赖已交付驾驶系统、微分方程和状态空间，用户指定rank14换课的未完成前课单独登记；不代签并行课程。无实车或算法精度比较，不发布Pages、不生产DRIVING-03。

### IMPL-03 PID工程整定本轮交付

新写单课；阶跃模型、SIMC PI与约束下四工况、现场交接。讨论和真实验收见 `.agent/semester-03/impl-03/acceptance.md`；rank1使用独立目录与索引，未发布Pages。


### EMBODIED-02 本轮执行记录（2026-10-24）

用户指定rank13；多模态感知按新写Phase1–4完成。夹爪遮挡杯子引出视觉/本体/触觉互补、时间/坐标/掩码合同、标量融合与学习表征；10H2、2Notebook2cell、1Explorer和SVG、4题4答。实际TS600配置与独立Fraction协方差计算3450量一致，保留迟到/相关/缺失反例；干净内核、固定Pyodide、真实DOM/窄屏及生产构建证据见.agent/semester-03/embodied-02/acceptance.md。先修表征学习未交付，所需概念本课局部定义，不生产别课；未训练真实模型或发布Pages。

### MPC-02 学期3交付（2026-10-24）

预测模型按重构Phase1–4完成，保留十H2、全部旧标题ID、三类模型/辨识/失配与五题目标。纠正阶跃和脉冲系数混用、增广可观测条件、CARIMA延迟/递推、FOPTD判定、ZOH及无条件鲁棒结论。新增Explorer，两Notebook六cell，440组实际TS对独立Fraction及连续状态矩阵指数；严格内核、Pyodide、普通与Pages本地页面实跑及375px通过。证据.agent/semester-03/mpc-02/acceptance.md；真实master回执见全局checklist。rank6隔离端口/缓存/索引，保留其它会话及用户修改；本课顺序例外独立登记，不发布Pages、不生产MPC-03。

### RL-02执行回执（2026-10-24）

价值函数与贝尔曼方程从空占位按新写Phase1–4完成；沿用一次送餐解释V/Q，另设循环模型，十H2、双图Explorer与SVG、两Notebook四cell、四题四答。线性系统/矩阵幂/有限时域LP独立核真实TS，严格内核与最终Pyodide及Pages/375px验收见.agent/semester-03/rl-02/acceptance.md。残差按返回向量重算，收缩条件与gamma=1边界清楚；已知模型规划不冒充训练，不比较不同任务回报大小。rank8隔离副本/独立暂存保留并行修改；顺序例外单独登记，仅本课，不发布Pages、不生产RL-03，真实hash见全局checklist。

<!-- EST-03-RECEIPT-BEGIN -->
### EST-03 学期3交付（2026-10-24）

卡尔曼滤波按重构Phase1—4完成，保留原12H2、十题全部子问及三条Notebook教学目的。纠正噪声采样/单位、Q-R对偶与稳态条件、LQG裕度、退化ARE与工程题欠定；独立复算确认题2/10原极点舍入可接受，未虚报错误。3Notebook6cell、解析噪声失配Explorer与SVG，真实TS15配置1515点对ARE/Lyapunov/ODE及消元/迭代独立核，严格内核和Pyodide、普通与完整build:pages本地页面通过。rank4使用独立副本/索引，18214冲突保留原进程改18544，不碰共享服务与暂存；证据.agent/semester-03/est-03/acceptance.md，真实master回执见全局checklist，不发布Pages、不生产EST-04。
<!-- EST-03-RECEIPT-END -->

### IMPL-04 控制器部署本轮交付

新写单课；离散系数与状态、有限字长、真实时序与部署验收。讨论和真实验收见 `.agent/semester-03/impl-04/acceptance.md`；rank1使用独立目录与索引，未发布Pages。

### IMPL-04 样式复验补正

隔离快照补齐实际postcss.config.mjs，两种生产构建及正确CSS下Pages/窄屏/浏览器Python已复验。数值源码不变；历史预览配置完整性仅登记QA02待核，见`.agent/semester-03/impl-04/css-isolation-audit.md`。


### ML-04 本轮执行记录（2026-10-24）

自动微分与训练从空占位按新写Phase1–4完成：温升预测误差引出计算图/共享边累加、最小反向AD、真实tanh网络全批更新、验证检查点与三种停止原因，再讲小批量计数和推理接口。十H2、两Notebook四cell、四题四答、一Explorer/SVG。真实TS120配置/40梯度点/5028实际更新对独立复步，保留两自主不稳定漂移；原始native/Pyodide/最终静态页面396量、两种构建与375px通过。手机长行内参数已修为逐项换行，证据.agent/semester-03/ml-04/acceptance.md，实际master回执提交后见checklist。rank2独立8212/8992与Git索引，保留并行会话与正常索引；本课独立顺序例外不沿用ML-03授权，W09/W16/QA01保留，不发布Pages、不生产ML-05。

### MPC-03 学期3交付（2026-10-24）

滚动优化按重构Phase1–4完成，保留11H2、全部旧标题ID、原20步实验主题及五题全部子问。统一输入增量与累计输入、当前/未来费用，纠正有限时域末输入/临界极点、终端可行性、尾部反馈、QP/热启动/显式实时承诺及自行车模型。新增Explorer/SVG，三Notebook六cell；160组实际TS对独立Fraction，20QP对独立BVLS及五题解析核。严格内核、Pyodide、普通/Pages本地页面与375px验收证据.agent/semester-03/mpc-03/acceptance.md；真实master回执见全局checklist。rank6改用空闲18696/9016/18796/18896，隔离缓存与索引，保留并行/用户修改；本课顺序例外单独登记，不发布Pages、不生产MPC-04。

<!-- EST-04-RECEIPT-BEGIN -->
### EST-04 学期3交付（2026-10-24）

扩展卡尔曼滤波从空占位按新写Phase1—4完成，十H2、四题所有子问、2Notebook4cell、后验Explorer及SVG。非线性函数与误差Jacobian分工、Joseph近似含义、平方测量零点/正负歧义、雷达角度与稳定性条件清楚；72组真实TS/17352曲线点对无穷自适应积分，含线性持平与双峰失败例。严格内核、Pyodide、普通与完整build:pages实页/375px均通过，最终源码指纹绑定。rank4独立副本/端口/私有索引保留其它课程与暂存，证据.agent/semester-03/est-04/acceptance.md；真实master回执见全局checklist，不发布Pages、不生产EST-05。
<!-- EST-04-RECEIPT-END -->


### ML-05 本轮执行记录（2026-10-24）

rank2按用户指定新写时序模型；单课讨论、288配置独立闭式对账、严格内核及实际静态浏览器已执行。独立端口8214，完整archive隔离，保留其它在制课程。完整命令与交付回执见 .agent/semester-03/ml-05/acceptance.md；未发布Pages。

### IMPL-05 嵌入式控制本轮交付

新写单课；ADC端点标定、PWM时隙、闭环量化与样本交接。讨论和真实验收见 `.agent/semester-03/impl-05/acceptance.md`；rank1使用独立目录与索引，未发布Pages。


### ML-06 本轮执行记录（2026-10-24）

rank2按用户指定新写注意力机制；先修ML-05已交付，18配置独立Decimal对账、原始严格kernel/Pyodide、真实静态页面与375px、两种构建已执行。仅给定QKV算子，不声称完整Transformer训练或性能排名；独立预览8216，不发布Pages。证据.agent/semester-03/ml-06/acceptance.md，真实master回执提交后登记。

### MPC-04 学期3交付（2026-10-24）

约束处理按重构Phase1–4完成，保留12H2、全部旧标题ID、四类约束/软硬/KKT/可行性/优先级/原40步主题及五题全部目标。纠正物理界软化、有限二次罚精确性、下界法向与活跃零乘子、14行计数、公共松弛5、层级恢复和原实验维度/输出约束。新增Explorer/SVG，三Notebook六cell；952组实际TS对独立LP、目标导数及强对偶证书，40QP对独立矩阵幂/对偶证书。严格内核、Pyodide、普通/Pages本地页面及375px验收见.agent/semester-03/mpc-04/acceptance.md；真实master回执见全局checklist。rank6隔离19096/9036/19196/19296/缓存/索引，保留并行与用户修改；本轮顺序例外独立登记，不发布Pages、不生产MPC-05。

<!-- EST-05-RECEIPT-BEGIN -->
### EST-05 学期3交付（2026-10-24）

无迹卡尔曼滤波从空占位按新写Phase1—4完成：10H2/四题全部子问、2Notebook4cell、UnscentedKalmanExplorer、sigma点SVG。两套权重、Cholesky列方向、预测后重取点含Q、交叉协方差与Gaussian近似边界清楚；保留默认方差落败、线性持平、零点双峰失败、三次/二维乘积反例。72组真实TS/17352点对独立解析矩与无穷quad最大差1.563194e-13；严格内核、Pyodide、普通/完整build:pages两实页及375px通过。rank4独立副本/端口/私有索引保留并行修改，证据.agent/semester-03/est-05/acceptance.md；真实master回执见checklist。不发布Pages、不生产EST-06。
<!-- EST-05-RECEIPT-END -->


### ROBUST-04 本期交付记录（2026-10-24）

鲁棒性能按重构Phase1–4执行，保留10H2、全部历史标题ID、原四题及子问、原两个Notebook四cell用途；完整精确LFT/可行D界替代对角伪μ上界，修正NP/RP、性能块维数、权重/接口、理想PID和无来源综合数据。三Notebook五cell、双图Explorer与SVG，实际TS/独立模型及符号复核、严格原生内核和Pyodide、两构建与375px验收见.agent/semester-03/robust-04/acceptance.md。明确固定滤波PID在当前权重下失败，上界/网格/实际反例分开。rank5使用独立端口/缓存/索引，只提交本课，不发布Pages、不生产ROBUST-05；真实master hash在全局checklist登记。

### MPC-05 学期3交付（2026-10-24）

递归可行性与稳定性从空占位按新写Phase1–4完成：有解陷阱→终端三条件→移位可行→值函数下降与上下界，十H2、四题四答、两Notebook四cell、Explorer/SVG。实际TS3536配置对独立LP/直接目标及对偶证书，20名义QP另用复步梯度核；严格内核/生产Pyodide/普通与Pages本地/375px验收见.agent/semester-03/mpc-05/acceptance.md。名义证明与失配、可行次优/超时边界分开，不把样本当稳态或真实安全认证。rank6隔离19496/9056/19596/19696与独立Git索引，保留其它会话；只交付本课，不发布Pages、不生产MPC-06，真实hash见全局checklist。

### IMPL-06 实时控制本轮交付

重构单课；保留九H2/五题，修正调度判据、时序与实现边界。讨论和真实验收见 `.agent/semester-03/impl-06/acceptance.md`；rank1使用独立目录与索引，未发布Pages。


### ML-07 本轮执行记录（2026-10-24）

rank2按用户指定新写表征学习；PCA受限重构、冻结探针/七方向验证选择、增强/坍塌目标与标定失败边界，未训练完整SimCLR。18配置/7795量独立NumPy/Decimal对账，严格kernel/Pyodide、最终实页/375px、两种构建已执行；独立预览8232，保留并行课程，不发布Pages。完整证据.agent/semester-03/ml-07/acceptance.md，真实master回执另登记。

### IMPL-07 网络控制本轮交付

新写单课；时延、丢包、乱序与信息年龄。讨论和真实验收见 `.agent/semester-03/impl-07/acceptance.md`；rank1使用独立目录与索引，未发布Pages。

### MPC-06 学期3交付（2026-10-24）

广义预测控制按重构Phase1–4完成，保留16H2/64旧H2-H3/73旧ID、五题全部子问与原E/F/80拍/60拍五权重主题。统一有限递推/总离散延迟/阶跃系数与历史自由响应，纠正C噪声方向、MV方差、题3矩阵与GMV/LQ/PI/稳定边界，替换错误旧图为真SVG。1444组实际TS对独立状态空间延迟链/QR、32恒等式对Fraction长除法、380QP独立复算；严格内核3Notebook6cell与生产Pyodide、普通/Pages本地及375px见.agent/semester-03/mpc-06/acceptance.md，S04本课债务已实测清除。rank6隔离19896/9076/19996/20096与私有索引，保留并行修改；仅本课，不发布Pages、不生产MPC-07。真实hash见全局checklist。

<!-- EST-06-RECEIPT-BEGIN -->
### EST-06 学期3交付（2026-10-24）

粒子滤波从空占位按新写Phase1—4完成：10H2/四题全部子问、3Notebook6cell、ParticleFilterExplorer与纵向SVG。一般重要性权重、bootstrap逐拍更新、按需系统重采样、ESS与祖先丢失、log权重和支持覆盖完整；四点离散先验与Gaussian采样严格分开。114真实TS组合对独立SciPy/quad/CDF，90单拍与30×20拍多种子保留失败，FFT参考另对直接转移矩阵核；严格内核、Pyodide、两构建/实页/375px通过。rank4独立副本/端口/私有索引保留并行修改，证据.agent/semester-03/est-06/acceptance.md；真实master回执见checklist。不发布Pages，不生产EST-07。
<!-- EST-06-RECEIPT-END -->


### ROBUST-05 本期交付记录（2026-10-24）

H∞控制按重构Phase1–4交付，保留九H2、全部历史标题、四题子问与原三Notebook四cell用途。纠正内部稳定/堆叠目标、权重、DGKF/LMI条件、反陷波失稳、恒100权重与理想PD边界；新增可实现低通候选，保留低带宽代价及9/11rad/s失配超标。四Notebook五cell、五参数双图Explorer/SVG；实际TS270配置/1620频点、独立控制模型及完整驻点/符号复核，严格内核/Pyodide、双构建与375px证据见.agent/semester-03/robust-05/acceptance.md。未运行通用H∞综合，不冒称最优或全集鲁棒。rank5独立端口/缓存/索引，保留并行工作；仅本课，不发布Pages、不生产ROBUST-06。真实master hash见全局checklist。

### IMPL-08 工业通信本轮交付

新写单课；协议分层、CRC解码与轮询预算。讨论和真实验收见 `.agent/semester-03/impl-08/acceptance.md`；rank1使用独立目录与索引，未发布Pages。

<!-- EST-07-RECEIPT-BEGIN -->
### EST-07 学期3交付（2026-10-24）

多传感器融合从空占位按Phase1—4新写完成：10H2、四题及全部子问、3Notebook6cell、SensorFusionExplorer与纵向SVG。独立信息相加、相关噪声白化、共享先验/重复数据、未知相关CI与时间/坐标/非线性线性化边界；64配置对独立矩阵/Joseph与密度，CI105边界保留失败与持平。严格内核、Pyodide、两构建/实页/375px均通过。rank4独立副本/端口/私有索引保留并行修改，证据.agent/semester-03/est-07/acceptance.md；实际master回执见checklist。未发布Pages，不生产EST-08。
<!-- EST-07-RECEIPT-END -->

### ML-08 本轮执行记录（2026-10-24）

扩散与流匹配从空占位按新写Phase1–4完成。包装机整批重量问题贯穿加噪/噪声预测、条件均值与后验、独立端点CFM、解析高斯速度/输运及Euler失败；九H2、双Notebook四cell、四题四答、一Explorer/SVG。实际TS900配置102600量对独立60位协方差与仿射矩阵，原生/最终Pyodide/Pages页面2444量和15状态195读数、双构建及375px通过，证据.agent/semester-03/ml-08/acceptance.md。明确已知分布oracle未训练图像网络，不作DDPM/FM性能比较。rank2隔离8234/8992与私有索引，保留并行/用户修改；本课顺序例外独立登记，不发布Pages、不生产ML-09，真实master回执提交后登记。

### MPC-07 学期3交付（2026-10-24）

显式预测控制从空占位按新写Phase1–4完成：参数QP/KKT→五临界区域→分段仿射律→边界/退化/部署与稳定条件；十H2、四题四答、两Notebook四cell、Explorer/SVG。实际TS5098参数对独立原QP数值求解及完整有理区域证书，共享边界/域外/错误容差/模型失配均核。严格内核、生产Pyodide、普通与Pages本地/375px验收见.agent/semester-03/mpc-07/acceptance.md。rank6隔离20296/9096/20396/20496与独立Git索引，保留其它会话；只交付本课，不发布Pages、不生产MPC-08，真实hash见全局checklist。

### IMPL-09 半实物仿真本轮交付

新写单课；验证层次、虚拟时序与HIL证据边界。讨论和真实验收见 `.agent/semester-03/impl-09/acceptance.md`；rank1使用独立目录与索引，未发布Pages。


### ROBUST-06 本期交付记录（2026-10-24）

混合灵敏度按Phase1–4重构，九H2/全部标题/四题全部子问/原二Notebook四cell用途保留。修正Bode条件、P维度、权重接口/包络、DGKF/LMI前提；诊断原两控制器失稳，补proper名义族候选和同预算三权重网格、9/10/11失配含9失稳。三Notebook五cell、四参数双图Explorer/SVG，严格内核与Pyodide、实际TS/独立复算、双构建/375px/锚点证据见.agent/semester-03/robust-06/acceptance.md。未运行Slycot/MATLAB通用综合、不冒称最优。rank5独立资源，仅本课，不发布Pages，不生产ROBUST-07；真实master hash见checklist。

<!-- EST-08-RECEIPT-BEGIN -->
### EST-08 学期3交付（2026-10-24）

状态估计案例从空占位按Phase1—4新写：10H2/四题全子问、3Notebook6cell、EstimationCaseExplorer/PCG64输入/SVG；二维小车共同预测/双路更新/缺测/创新门限/统计与部署边界。默认融合落败、三工况持平/改善与极端噪声误拒边界保留；378配置4536拍对独立信息形式、360多种子统计、54UI配置×12时刻全实页读数。严格内核/Pyodide/普通与官方Pages构建及实页/375px通过。rank4独立资源与私有索引保留并行修改，证据.agent/semester-03/est-08/acceptance.md；真实master回执见checklist。不发布Pages，不生产其它课。
<!-- EST-08-RECEIPT-END -->

### ML-09 本轮执行记录（2026-10-24）

学习实验评估从空占位按新写Phase1–4完成：缺陷检测贯穿协议/组和时间隔离、训练类中心/验证阈值、指标与代价、配对批次bootstrap及胜负持平。10H2、两Notebook四cell、四题四答、一Explorer/纵排SVG；实际TS36配置18096主量+23边界对独立Fraction/多项式权重，原始执行1488量加56补充审计量、11状态253UI读数、双构建/Pages页面/375px通过。证据.agent/semester-03/ml-09/acceptance.md；真实master回执另记。四构造批次不保证总体覆盖，评分非概率；rank2隔离8238/8992与私有索引，保留并行工作，不发布Pages、不顺带生产其它课。

### IMPL-10 控制实现案例本轮交付

新写单课；水箱PI全链路回归、量化码值、故障记录与验收边界。讨论和真实验收见 `.agent/semester-03/impl-10/acceptance.md`；rank1使用独立目录与索引，未发布Pages。

### MPC-08 学期3交付（2026-10-24）

非线性预测控制按重构Phase1–4完成，保留16主题/五题全部子问与69旧ID，37标题别名。纠正非线性/约束激活、SQP/RTI/CLF与终端全域条件，重建同RK4同参数摆比较，撤回旧未实测硬件/性能表。实际TS432组与独立复步原目标核、240闭环输入独立核；两Notebook四cell严格内核/生产Pyodide、普通/Pages本地/375px见.agent/semester-03/mpc-08/acceptance.md。S04本课债务实跑清除。rank6隔离20696/9106/20796/20896与私有索引，保留并行工作；仅本课、不发布Pages、不生产MPC-09。真实hash见全局checklist。


### ROBUST-07 本期交付记录（2026-10-24）

结构奇异值按新写Phase1–4交付：九H2、四题全子问、三Notebook五cell、四滑块/双结构双图/SVG。可解析A/(s+1)证明结构集合、精确μ、合法D上界/见证下界、DC/全频与实μ不连续；完整标量性能增广含通过/等号/失败。真实TS960配置对独立SVD/反馈极点/行列式/SymPy、严格内核/Pyodide、双生产构建和375px证据见.agent/semester-03/robust-07/acceptance.md。未运行通用mussv，不冒称D普遍精确。相邻ROBUST-08错误只登记RB08待返修，不改其正文；rank5独立端口/缓存/索引，不发布Pages、不生产ROBUST-08。真实master回执见checklist。

### MPC-09 学期3交付（2026-10-24）

经济预测控制从空占位按新写Phase1–4完成：分时储水→同尺度目标→精确QP→常价耗散与旋转→终端反例→周期与预测边界。十一H2、四题四答、两Notebook四cell、Explorer/SVG。5120配置实际TS对原QP、144个有理恒等式；严格内核、生产Pyodide、普通与Pages本地页面及375px实测见.agent/semester-03/mpc-09/acceptance.md。rank6隔离21096/9116/21196/21296，临时独立索引与原子引用更新；保留并行内容。本会话不发布Pages，不生产MPC-10，真实hash见checklist。
