# 第二学期结构诊断报告（固化版）

> **文档编号**：semester-02 / 01
> **产出日期**：2026-09-25
> **来源**：`.qoder/semester-02-plan.md` 第 0 节（现状盘点）与第 1 节（结构诊断 P1–P11）
> **对应计划条目**：A1 · 固化结构诊断报告
> **性质**：**只读诊断**。本报告不修改任何既有文件，全部结论均可用文末命令复现。

---

## 目录

- [0. 证据规则与复现方式](#0-证据规则与复现方式)
- [1. 实测基线（2026-09-25 重算）](#1-实测基线2026-09-25-重算)
- [2. 对 semester-02-plan.md 的更正与补充](#2-对-semester-02-planmd-的更正与补充)
- [3. 已证实的 11 个结构问题（P1–P11）](#3-已证实的-11-个结构问题p1p11)
- [4. 重叠矩阵](#4-重叠矩阵)
- [5. 依赖倒置清单](#5-依赖倒置清单)
- [6. catalog ↔ MDX 一致性缺陷](#6-catalog--mdx-一致性缺陷)
- [7. 推测性判断（不可用现有文件证实）](#7-推测性判断不可用现有文件证实)
- [8. 待用户裁决事项](#8-待用户裁决事项)
- [9. 裁决执行记录与执行后新增发现](#9-裁决执行记录与执行后新增发现)

---

## 0. 证据规则与复现方式

### 0.1 三级证据标注

本报告对每条结论标注证据等级，**不允许无标注的判断混入已证实结论**：

| 标注 | 含义 | 举例 |
|------|------|------|
| **【实测】** | 可由文件行号、目录列表或统计脚本输出直接复核 | `catalog.ts` 章节数 = 11 |
| **【声明】** | 某个文件自称的数字，未必与实测一致 | `delivery-tracker.md` 底部写"17 / 83" |
| **【推测】** | 无法用现有文件证实，属行业判断、价值排序或因果推断 | "专家系统在 2026 年已边缘化" |

所有【推测】集中在[第 7 节](#7-推测性判断不可用现有文件证实)，不与实测结论混排。

### 0.2 行号基准

本报告引用的 `content/catalog.ts` 行号，基于**执行完 Q1 + Q2 之后的工作区版本（925 行）**。

诊断阶段最初的基线是 933 行（含一处未提交回归，见 [6.3](#63-未提交改动引入的回归)）；Q1 恢复 HEAD 后为 930 行，Q2 对齐两门 robust 课后为 925 行。正文与附录的全部行号已按这两次位移重编号，逐条复核结果见附录开头。第 6 节保留诊断当时（933 行基线）的原始观测记录，其中标注"原 L×××"的条目指已被删除的行。

**A2 执行后的位移（同日，见 [9.6](#96-a2-已执行catalog-数据模型升级)）**：A2 在接口块内新增 9 行类型定义（`LessonMeta` 的 `prereq`/`level`/`type`/`status`，`Chapter` 的 `order`），`catalog.ts` 由 925 行变为 **934 行**。本报告的行号**仍钉在 925 行基线**，换算规则：

| 报告中的行号 | 当前工作区行号 |
|--------------|----------------|
| L1–L9（`SubsectionMeta` 及 `LessonMeta` 前 3 字段） | 不变 |
| L10–L17（原接口块尾部） | 需单独对照，见下两行 |
| **L18 及以后（整个 `export const catalog` 数据区）** | **统一 +9** |
| `LessonMeta` 接口 原 L6–L10 | 现 L6–L17 |
| `Chapter` 接口 原 L12–L16 | 现 L19–L25 |

520 处引用中仅 3 处落在接口块内（P6 正文与其附录行、附录的 `export const catalog` 行），已在原地标注；其余全部适用"+9"。

**为什么不做全量重编号**：A3–A6 将合并、重排、新增章节，`catalog.ts` 的行号会再次全面失效。把诊断报告定位为**时点快照 + 显式偏移声明**，比每次改动都重映射 500 多个引用更可靠，也避免重映射本身引入错误（A1 执行中已发生过一次，见 9.4）。

### 0.3 复现方式

```bash
cd D:/Workspace/control-universe

# 章节数 / 课程数 / 小节数
node -e 'const fs=require("fs");const s=fs.readFileSync("content/catalog.ts","utf8");
console.log("章=",(s.match(/^    slug: "/gm)||[]).length,
            "课=",(s.match(/^      \{ slug: "|^        slug: "/gm)||[]).length)'

# MDX 文件数
find content -name '*.mdx' | wc -l

# 交互组件：定义数 / 在用数 / 孤儿
ls components/wiki/*-explorer.tsx | wc -l
grep -rho '<[A-Z][A-Za-z]*Explorer' content/ | sort -u | wc -l

# 讨论日志篇数
find docs/discuss-log -name '*.md' | wc -l

# delivery-tracker 勾选计数
grep -c '^| \[x\]' .qoder/delivery-tracker.md
grep -c '^| \[ \]' .qoder/delivery-tracker.md

# fix-logs：INDEX 条目数 vs 独立文件数
grep -c '^| 0[0-9][0-9] |' .qoder/fix-logs/INDEX.md
ls .qoder/fix-logs/*.md | grep -v INDEX | wc -l

# 渲染维度门槛 / 侧栏死链 / 截断检测：需 dev server 在 8080 运行，
# 逐课 fetch 后提取 <h1-6 id> 与 catalog 的 sub.slug 比对，逻辑与两个解析陷阱见 9.5
```

### 0.4 本次变更声明

| 文件 | 操作 | 授权来源 |
|------|------|---------|
| `docs/semester-02/01-structure-diagnosis.md` | **新建**（本报告）；Q1 / Q2 执行后全量重编号 + 新增第 9 节；A2 执行后同步 §0.2 / P6 / §8 / §9.6 / 附录 | A1 交付物 |
| `.qoder/semester-02-plan.md` | 把 A1、A2 的 `[ ]` 改为 `[x]` | A1 / A2 prompt 明确要求 |
| `content/catalog.ts` | Q1：`git checkout HEAD --` 丢弃未提交回归（933 → 930 行）<br>Q2：robust 两课对齐 MDX，+3 / −8（930 → 925 行）<br>**A2**：接口块新增 9 行可选字段（925 → **934 行**），未动任何 slug / title / subsections | 用户裁决 Q1=(a)、Q2=(a)、Q8=(a)；A2 推荐 Prompt |
| `.next/`（构建产物，非源码） | 为修复 N16 缓存损坏而 `rm -rf` 并重启 dev server 重建 | 项目既定补救手段，见 9.6 |
| 其他任何文件 | **未改动**（MDX 正文、`components/`、`lib/`、`app/`、`delivery-tracker.md`、`OUTLINE.md`、`fix-logs/` 全部原样） | — |

---

## 1. 实测基线（2026-09-25 重算）

### 1.1 catalog.ts 规模【实测】

| # | 章节 | slug | catalog 起始行 | 课程数 | 小节数 | 有 subsections 的课 | 已写 MDX |
|---|------|------|---------------|-------|-------|-------------------|---------|
| 1 | 数学基础 | `math` | L20 | 1 | 7 | 1 | 1 |
| 2 | 经典控制 | `classic` | L39 | 10 | 122 | 10 | 10 |
| 3 | 现代控制 | `modern` | L227 | 10 | 97 | 10 | 10 |
| 4 | 鲁棒控制 | `robust` | L390 | 8 | 80 | 8 | 8 |
| 5 | 计算机控制 | `computer-control` | L492 | 8 | 70 | 8 | 8 |
| 6 | 预测控制 | `mpc` | L584 | 8 | 98 | 8 | 8 |
| 7 | 非线性控制 | `nonlinear` | L704 | 8 | 104 | 8 | 8 |
| 8 | 智能控制 | `intelligent` | L830 | 7 | 38 | 3 | 3 |
| 9 | 强化学习控制 | `rl-control` | L884 | 8 | 0 | 0 | 0 |
| 10 | 离散控制 | `discrete` | L898 | 8 | 0 | 0 | 0 |
| 11 | 多智能体控制 | `multi-agent` | L912 | 8 | 0 | 0 | 0 |
| | **合计** | | | **84** | **616** | **56** | **56** |

> 上表为 **Q1 + Q2 执行后**的当前值。诊断当时（933 行基线）的对应数字是：`robust` 85、`intelligent` 41、合计 **624**；Q1 使 `intelligent` −3（15 个小节恢复为 12），Q2 使 `robust` −5（1 + 4）。第 3–7 节中凡引用 624 的均为诊断当时的观测值。

**派生事实（重要）**：`有 subsections 的课程数 (56) == 磁盘 MDX 文件数 (56)`，且**逐章相等、集合一致**（见 1.2）。
这意味着 `subsections` 字段事实上已在充当"本课已写"的标记，但**没有任何类型约束或校验强制这一点**（见 P6 / P11）。

**另**：`rl-control`、`discrete`、`multi-agent` 三章共 24 课，`subsections` 全为空、MDX 全为零——即**四分之一的目录是纯占位**。

### 1.2 内容文件【实测】

`content/` 下含 MDX 的目录共 8 个：

```
classic 10 | computer-control 8 | intelligent 3 | math 1
modern  10 | mpc               8 | nonlinear   8 | robust 8      → 合计 56
```

- catalog 中登记但磁盘无 MDX 目录的章：`rl-control`、`discrete`、`multi-agent`
- 磁盘有 MDX 但 catalog 无对应章的目录：**无**
- 逐章核对："MDX 存在但不在 catalog" 的课程：**0 门**；"catalog 有但无 MDX" 的课程：**28 门**（intelligent 4 + rl-control 8 + discrete 8 + multi-agent 8）

### 1.3 交互组件【实测】

| 指标 | 数量 | 说明 |
|------|------|------|
| `components/wiki/*.tsx` 总文件数 | 43 | 含 `use-echarts.tsx`、`jupyter-notebook.tsx` 等基建 |
| 其中 `*-explorer.tsx` | **36** | 交互组件 |
| MDX 中实际引用的 explorer（去重） | **35** | |
| **定义了但从未被引用的孤儿组件** | **1** | `BodeMarginsExplorer`（`components/wiki/bode-margins-explorer.tsx:97`） |
| MDX 引用了但未定义的组件（会导致 500） | 0 | 无 fix-015 类隐患 |

`BodeMarginsExplorer` 的状态【实测】：

- 在 `mdx-components.tsx` 中：**未注册**
- 在 `lib/content.ts` 的 `compileMDX({ components })` 中：**未注册**
- 在 `content/**/*.mdx` 中：**未被引用**（0 次）

即它是一个**完整实现但完全悬空**的组件（含 `calculateBodeData`、针对 `G(s)=K/(s(s+1)(s+10))` 的 Bode 计算逻辑）。任何人若在 MDX 里写 `<BodeMarginsExplorer />`，会立刻触发 fix-015 记录的 500 错误。

**导出风格不一致**【实测】：36 个 explorer 中，34 个用 `export function XxxExplorer()`，2 个用 `export default function XxxExplorer()`：

- `components/wiki/fuzzy-tuning-explorer.tsx:149`
- `components/wiki/neural-network-explorer.tsx:82`

这不影响运行，但会让"按 `export function` 扫描组件清单"的自动化脚本漏掉这 2 个（本次统计已 special-case 处理）。

### 1.4 讨论日志【实测】

```
docs/discuss-log/
└── course-01/
    ├── 07-nonlinear/     8 篇
    └── 08-intelligent/   3 篇
                          ─────
                          11 篇
```

完整清单：

| 目录 | 文件 |
|------|------|
| `07-nonlinear/` | `01-nonlinear-characteristics` `02-phase-plane` `03-describing-function` `04-lyapunov-stability` `05-feedback-linearization` `06-sliding-mode-control` `07-backstepping` `08-adaptive-control-basics` |
| `08-intelligent/` | `01-fuzzy-control-basics` `02-fuzzy-controller-design` `03-neural-network-control` |

**覆盖缺口**：已写 56 课中，**45 课没有讨论日志**（覆盖率 11/56 = 19.6%）。

无讨论日志的 45 课【实测清单】：

```
classic(10):      classic-case-study, compensator-design, frequency-domain-analysis,
                  frequency-response, pid-controller, root-locus, stability-analysis,
                  system-modeling, time-domain-analysis, transfer-function
computer-control(8): computer-control-architecture, digital-controller-design, digital-pid,
                  discrete-stability, realtime-control, sampling-period,
                  sampling-quantization, z-transform-basics
math(1):          complex-numbers
modern(10):       controllability-observability, kalman-filter, linear-system-theory,
                  lqr-controller, modern-case-study, multivariable-systems,
                  optimal-control-basics, state-feedback, state-observer, state-space
mpc(8):           constraint-handling, distributed-mpc, generalized-predictive-control,
                  mpc-case-study, mpc-principle, nonlinear-mpc, prediction-model,
                  receding-horizon
robust(8):        h-infinity-basics, mixed-sensitivity, mu-synthesis, robust-case-study,
                  robust-performance, robust-stability, robustness-concept,
                  uncertainty-modeling
```

反向核对：有讨论日志但无 MDX 的课程 = **0**（日志与课程一一对应，无悬空日志）。

### 1.5 fix-logs【实测】

| 指标 | 数量 |
|------|------|
| `INDEX.md` 表格条目 | **18** |
| `.qoder/fix-logs/` 下独立日志文件（除 INDEX） | **14** |
| INDEX 有条目但**无独立日志文件** | **4**：`007` `008` `009` `010` |

实际文件名采用 `YYYY-MM-DD-NNN.md` 格式：

```
2026-09-22-001.md  2026-09-22-002.md  2026-09-22-003.md  2026-09-22-004.md
2026-09-23-005.md  2026-09-23-006.md  2026-09-23-011.md  2026-09-24-012.md
2026-09-24-013.md  2026-09-25-014.md  2026-09-25-015.md  2026-09-25-016.md
2026-09-25-017.md  2026-09-25-018.md
```

`007`–`010` 只有 INDEX 摘要，无独立记录。这四条恰好都是 "ipywidgets → React 组件" 的批量转换（pid-controller、stability-analysis、compensator-design、root-locus），细节仅存于 INDEX 的一行摘要。

**INDEX 无"本该由谁拦住"字段**【实测】：18 条记录的表头为 `# | 日期 | 文档 | 章节 | 类型 | 摘要`，没有归因列，因此无法从 fix-log 反推角色职责缺口——这是 0.3 节归因分析必须手工完成的原因（见 P11）。

### 1.6 三处声明口径对照【声明 vs 实测】

| 指标 | `OUTLINE.md` 声明 | `delivery-tracker.md` 声明 | **实测** | 偏差 |
|------|------------------|--------------------------|---------|------|
| 章节数 | 10（L142） | —（表头列出 11 章） | **11** | OUTLINE 少 1（缺 `math`） |
| 课程/模块数 | 79（L143） | 83（底部统计分母） | **84** | OUTLINE −5；tracker −1 |
| 已完成 | 1（L144） | 17（底部统计分子） | **19** | OUTLINE −18；tracker −2 |
| 待编写 | 78（L145） | — | 65（tracker `[ ]` 行数） | — |
| 交互组件数 | — | 33 | **35 在用**（36 定义，1 孤儿） | tracker −2 |
| tracker 表格行数 | — | — | `[x]`19 + `[ ]`65 = **84** | 与自己声明的分母 83 差 1 |

**三方交叉核对结论**：

1. `delivery-tracker.md` 的**表格本身是准确的**——84 行与 catalog 的 84 课**一一对应**，双向无缺漏无多余【实测】：
   - tracker 有但 catalog 无：**0**
   - catalog 有但 tracker 无：**0**
   - 已打勾但实际无 MDX 的课：**0**（19 门打勾课程全部有 MDX）
2. 但 tracker **底部的统计行是错的**：写 "17 / 83"，实际应为 "19 / 84"。分子分母**同时**错。
3. `OUTLINE.md` 已完全失效：缺整个 `math` 章，状态列几乎全为"⬜ 待编写"（连已交付 8 课的 `classic` 章也标待编写），四项统计全部与实测不符。
4. 已写 MDX 但未打勾的课程 = **37 门**（56 − 19），与 `semester-02-plan.md` 阶段 C 的"已写但未交付的 37 课"一致【实测，方案该数字正确】。

---

## 2. 对 semester-02-plan.md 的更正与补充

A1 的核心价值之一是**用实测校正方案里的手写数字**。以下 4 处更正、12 项新发现。

### 2.1 更正（方案原文有误）

| # | 方案原文位置 | 方案写法 | **实测** | 性质 |
|---|-------------|---------|---------|------|
| C1 | §0.2 | "`07-nonlinear`（8 篇）与 `08-intelligent`（3 篇），**合计 13 个** md 文件" | **11 篇**（8 + 3 = 11） | 算术错误 |
| C2 | §0.2 | "已写 56 课中，**43 课**没有讨论日志" | **45 课**（56 − 11） | 承 C1 的连带错误 |
| C3 | §1 P4 | "`nonlinear` 6.7 与 6.8 都含'处理参数不确定性'（catalog.ts:809 / **825**）" | catalog.ts:809 / **824**（L820 是"应用案例"） | 行号偏移 1 |
| C4 | §1 P10 | "`nonlinear/phase-plane` 有 15 个 H2、`feedback-linearization` 有 **14** 个" | phase-plane **15**（正确）、feedback-linearization **15** | H2 计数偏差 1 |

方案中经实测**确认无误**的关键数字：章节数 11、课程数 84、已写 MDX 56、已交付 19、未交付 37、`components/wiki` 43 个文件、fix-logs 18 条、以及 P4/P5 引用的其余全部行号（`不确定性建模` L433/L452、`对偶原理` L253/L281、`频域指标与时域指标的对应` L103/L177、`Q 和 R 的选择` L314/L333、`交互式可视化` L630/L661/L678、`与其他非线性控制方法的对比` L792/L806/L821、`Lyapunov方法：二次稳定性` L443、`模型辨识基础` L602、`时滞系统的稳定性` L161、`时滞对频率响应的影响` L179、`工程应用：Ziegler-Nichols整定法` L181、`multi-agent-rl` L894/L922、`linear-system-theory` 小节 L344–L348）。

### 2.2 新发现（方案未记录）

| # | 发现 | 证据 | 影响 |
|---|------|------|------|
| **N1** | **3 门课违反 fix-013 的"H2 数 == catalog 小节数"交付硬门槛**（工作区版本）；HEAD 版本为 2 门 | 见[第 6 节](#6-catalog--mdx-一致性缺陷) | 高：这是 fix-013 明文列为交付门槛的检查项，至今仍不通过 |
| **N2** | `BodeMarginsExplorer` 是孤儿组件：已实现、两处注册表均未注册、MDX 零引用 | `components/wiki/bode-margins-explorer.tsx:97`；grep 全仓仅此 1 处命中 | 中：死代码；一旦被引用即 500（fix-015 类型） |
| **N3** | **fix-logs `007`–`010` 无独立日志文件**，只有 INDEX 一行摘要 | `.qoder/fix-logs/` 实有 14 个文件，INDEX 有 18 条 | 中：4 条返工的过程细节已丢失，无法复盘 |
| **N4** | 组件导出风格不一致：34 个 `export function` + 2 个 `export default function` | `fuzzy-tuning-explorer.tsx:149`、`neural-network-explorer.tsx:82` | 低：会让自动化组件清单脚本漏检 |
| **N5** | `mpc` 章另有 3 组重复小节，方案 P4 只列了"交互式可视化"一组 | `数值例子` L656/L676/L692；`工业应用` L662/L680/L695；`软件工具` L679/L694 | 中 |
| **N6** | `intelligent` 章 `工程实践要点` 重复 | L858（fuzzy-controller-design）/ L872（neural-network-control） | 低 |
| **N7** | `设计实例` 小节在 5 门课中同名出现，跨 2 章 | L421、L434、L470（robust）；L500、L523（computer-control） | 中：无法从目录判断讲的是哪个对象 |
| **N8** | `稳定性分析` 小节在 4 门课中同名出现，跨 2 章 | L591、L660、L675（mpc）；L857（intelligent） | 中：与 `classic/stability-analysis` 整课（L149）也构成层级错位 |
| **N9** | `应用案例`（7 课）与 `局限性讨论`（7 课）在 nonlinear + intelligent 两章高度模板化 | 应用案例 L729/L743/L760/L791/L805/L820/L840；局限性讨论 L732/L746/L778/L793/L807/L822/L842 | 低（可能是刻意的体例统一） |
| **N10** | `computer-control/digital-controller-design` 与 `discrete/digital-controller` 的 **title 逐字相同**（"数字控制器设计"），方案 P1 表述为"标题几乎相同" | catalog.ts L516 与 L903 | 低（表述精确化） |
| **N11** | tracker 底部统计的**分子分母同时错**（写 17/83，实测 19/84），而**表格本身完全准确**（84 行与 catalog 双向一一对应） | 见 [1.6](#16-三处声明口径对照声明-vs-实测) | 中：说明错误只在手工汇总环节，A7 自动化可直接根治 |
| **N12** | P7"缺失主题"清单可用关键词计数**硬证实**，其中"网络控制系统 NCS"的一次匹配是 `神经网络控制` 的子串误命中，实际为 0 | 见 [3.7](#p7--完全缺失的主流控制主题严重) | 低（强化证据） |

---

## 3. 已证实的 11 个结构问题（P1–P11）

以下每条均附可核查证据。凡涉及内容层面的判断（而非结构层面）已移至[第 7 节](#7-推测性判断不可用现有文件证实)。

### P1 · 计算机控制 vs 离散控制：整章级主题撞车【严重】

**结构证据**【实测】：

| 章 | catalog 起始行 | 课程数 | 小节数 | MDX 文件数 |
|---|---------------|-------|-------|-----------|
| `computer-control` | L492 | 8 | 70 | **8（全部已写）** |
| `discrete` | L898 | 8 | **0** | **0（零内容）** |

5 组主题撞车（按 catalog 中的课程 title / slug 对照）：

| # | `computer-control` | `discrete` | 撞车类型 | 证据 |
|---|---|---|---|---|
| 1 | `z-transform-basics`（Z变换基础） | `z-transform-analysis`（Z变换分析） | 主题同一，标题仅差一词 | L506 / L903 |
| 2 | `discrete-stability`（离散系统稳定性） | `discrete-stability-criteria`（离散稳定性判据） | 主题同一 | L529 / L904 |
| 3 | `digital-controller-design`（数字控制器设计） | `digital-controller`（数字控制器设计） | **title 逐字相同**（N10） | L519 / L905 |
| 4 | `sampling-quantization` + `sampling-period` | `sampled-data-systems`（采样系统设计） | 二对一覆盖 | L495、L550 / L907 |
| 5 | `z-transform-basics` 内小节"差分方程实现" | `discrete-time-systems` + `difference-equation` | 小节升格为整课 | L513 / L901、L902 |

**独占部分**【实测】：

- `discrete` 章唯一无对撞的课程：`discrete-optimal-control`（离散最优控制，L906）
- `computer-control` 章唯一无对撞的课程：`digital-pid`（L540）、`computer-control-architecture`（L559）、`realtime-control`（L570）

**关键事实**：`discrete` 章 8 课**零 MDX、零 subsections**，重组的边际成本为**零**——不需要迁移任何正文，只需改 catalog 条目。这是全方案成本最低、收益最高的一项动作（对应 A3）。

> ⚠️ 精确化：`discrete` 章无内容，因此这里的"重复"是**目录层面的主题撞车**，不是"两份重复正文"。内容是否真会重复无法证实（见 7.1）。

### P2 · 数学基础章严重不完整【严重】

**结构证据**【实测】：`math` 章仅 1 课（`complex-numbers`，catalog.ts L24，7 个小节 L27–L33）。

**人设承诺 vs 目录**：`.qoder/skills/wiki-discussion/personas.md` 中方数教授的"擅长话题"列了 7 项，与 catalog 对照：

| 方数擅长话题（personas.md） | math 章是否有对应课程 |
|---------------------------|---------------------|
| 线性代数（矩阵分析、特征值理论、Jordan 标准型） | ❌ 无 |
| 常微分方程与动力系统 | ❌ 无 |
| 变分法与最优控制数学基础 | ❌ 无 |
| 概率论与随机过程（卡尔曼滤波的数学基础） | ❌ 无 |
| 凸优化基础 | ❌ 无 |
| 泛函分析入门（无穷维系统） | ❌ 无 |
| 复变函数（频域方法的数学基础） | ⚠️ 仅 `complex-numbers`（复数基础），非复变函数 |

**7 项中 0 项有完整对应课程。**

**规则不可执行**【实测】：`.qoder/skills/wiki-discussion/SKILL.md` L272–L282 规定"遇到需要较多篇幅解释的数学概念，则不在原地展开完整讲解……引用数学基础章节的对应课程"。但被引用的目标课程**不存在**，该规则当前无法遵守。

**已在正文中出现、却无 math 课可引用的依赖**（抽样，附 catalog 行号）：

| 数学依赖 | 出现位置 | catalog 行号 |
|---------|---------|-------------|
| 矩阵指数、状态方程求解 | `modern/state-space` 小节"状态方程的求解" | L238 |
| 变分法、Hamilton 函数、极小值原理 | `modern/optimal-control-basics`（L291）小节"变分法：对泛函求极值"、"Hamilton 函数与极小值原理" | L296、L297 |
| Riccati 方程、二次型、正定矩阵 | `modern/lqr-controller` 小节"无穷时间 LQR——代数 Riccati 方程"；`robust/robust-stability` 小节"Lyapunov方法：二次稳定性" | L312；L443 |
| 概率论、白噪声、条件期望 | `modern/kalman-filter` 小节"随机系统模型" | L327 |
| QP、KKT 条件、凸集 | `mpc/constraint-handling`（L622）、`mpc/receding-horizon`（L609） | L609–L634 |
| Lie 导数、Lie 括号、微分同胚 | `nonlinear/feedback-linearization` | L766 起 |
| 迹–行列式平面、Floquet 乘子、分岔 | `nonlinear/phase-plane` | L720 起 |
| 结构化奇异值、LFT、Kharitonov 定理 | `robust/mu-synthesis`、`robust/uncertainty-modeling`、`robust/robust-stability` | L427 起、L452 起、L440 起 |
| 图拉普拉斯、代数连通性 | `multi-agent/*`（未写，即将需要） | L912 起 |
| 贝尔曼方程、马尔可夫决策过程 | `rl-control/*`（未写，即将需要） | L884 起 |

完整依赖图谱由 **A4** 产出（`docs/semester-02/02-math-dependency-map.md`）。

### P3 · 章节顺序违反依赖关系【严重】

**当前章序**【实测，按 catalog.ts 行号】：

```
L20 math → L39 classic → L227 modern → L390 robust → L492 computer-control
→ L584 mpc → L704 nonlinear → L830 intelligent → L884 rl-control
→ L898 discrete → L912 multi-agent
```

三处章级倒置：

| # | 倒置 | 证据 |
|---|------|------|
| 1 | **`mpc`（第 6 章）依赖 `discrete`（第 10 章）与 `computer-control`（第 5 章）** | `mpc/prediction-model`（L597）讲状态空间预测模型，需离散状态空间与 Z 变换；Z 变换在 `computer-control/z-transform-basics`（L506）与 `discrete/z-transform-analysis`（L903，未写） |
| 2 | **`robust`（第 4 章）依赖 `nonlinear`（第 7 章）与 `modern`（第 3 章）的 Lyapunov 工具** | `robust/robust-stability`（L440）含小节"Lyapunov方法：二次稳定性"（**catalog.ts L443**）；而 Lyapunov 的系统讲解在 `nonlinear/lyapunov-stability`（L751 起）与 `modern/linear-system-theory`（L341，其 5 个小节 L344–L348 全是 Lyapunov 内容） |
| 3 | **`mpc/nonlinear-mpc`（第 6 章）依赖 `nonlinear`（第 7 章）** | `mpc/nonlinear-mpc` slug 在 L668，其小节含 Lyapunov-based NMPC 内容（L674 附近）；而 `nonlinear` 章整体在 L704 之后 |

> 说明：`mpc` 依赖 `computer-control`（第 5 章）这一项**不是**倒置（5 < 6）。真正的倒置是依赖第 10 章的 `discrete`，以及 `discrete` 章零内容导致该依赖完全悬空。

### P4 · 章内顺序倒置、名实不符与小节级重复【中等】

| # | 位置 | 问题 | 证据（已复核行号） |
|---|------|------|------------------|
| 1 | `robust` 3.4 `mu-synthesis`（L427）→ 3.6 `uncertainty-modeling`（L452） | **依赖倒置**：μ 综合的前提是不确定性建模，却排在它之前两课 | 章内顺序 L427 < L452 |
| 2 | 同上 | **小节与整课重复**：`mu-synthesis` 内有一个名为"不确定性建模"的小节（**L433**），与 3.6 整课（**L452**）同名 | grep 命中 L433、L452 |
| 3 | `modern` 2.8 `linear-system-theory`（L341） | **名实不符**：标题"线性系统理论"，但 5 个内容小节全部是 Lyapunov 主题 | L344 为什么需要 Lyapunov 理论 / L345 Lyapunov 稳定性理论 / L346 内部稳定性与外部稳定性 / L347 可稳定性与可检测性 / L348 Lyapunov 方程与 LQR 的关系 |
| 4 | 同上 | **依赖倒置**：排在 `lqr-controller`（L307）之后，但 Lyapunov 是理解"LQR 为什么稳定"的前提 | L307 < L341 |
| 5 | `classic` 1.4 `frequency-domain-analysis`（L96）vs 1.8 `frequency-response`（L169） | **小节逐字重复**："频域指标与时域指标的对应"同名出现两次 | **L103 与 L177** |
| 6 | 同上 | `frequency-response` 的"稳定性判据"（**L176**）与 `stability-analysis`（L149）的"从频域看稳定性"（**L159**）主题重复 | grep 命中 L176、L159 |
| 7 | `classic` 1.7 `stability-analysis`（L149）排在 1.6 `pid-controller`（L130）之后 | **依赖倒置**：`frequency-response` 的"工程应用：Ziegler-Nichols整定法"（**L181**）需要临界增益这一稳定性概念 | L130 < L149 < L181 |
| 8 | `nonlinear` 6.6/6.7/6.8（`sliding-mode-control` L783、`backstepping` L798、`adaptive-control-basics` L812） | 三课都含同名小节"与其他非线性控制方法的对比" | **L792 / L806 / L821** |
| 9 | 同上 6.7/6.8 | 两课都含"处理参数不确定性" | **L804 / L819**（方案原写 L820，见更正 C3） |
| 10 | `modern` 2.2 `controllability-observability` vs 2.4 `state-observer` | "对偶原理"同名小节出现两次 | **L253 与 L281** |
| 11 | `mpc` 5.4/5.6/5.7 | 三课都留有独立小节"交互式可视化"，属 **v1.2 遗留**（v1.3 已规定交互组件内联到概念旁） | **L630 / L661 / L678** |
| 12 | `modern` 2.7 `kalman-filter`（L323）vs 2.6 `lqr-controller`（L307） | "Q 和 R 的选择"同名小节重复（虽为 LQG 对偶性使然，仍应一处主讲） | **L314 与 L333** |

### P5 · 跨章重复 slug 与重复 title【中等】

| 类型 | 值 | 出现位置 | 行号 |
|------|---|---------|------|
| **重复 slug** | `multi-agent-rl` | `rl-control` / `multi-agent` | **L894 / L922** |
| **重复 title** | `多智能体RL` | `rl-control/multi-agent-rl` / `multi-agent/multi-agent-rl` | L894 / L922 |
| **重复 title** | `数字控制器设计` | `computer-control/digital-controller-design` / `discrete/digital-controller` | L519 / L905 |

**路由层面不冲突**：`/rl-control/multi-agent-rl` 与 `/multi-agent/multi-agent-rl` 是两条不同路径（路由为 `app/(wiki)/[chapter]/[lesson]/page.tsx`，章 slug 参与路径）。

**但有三处实际危害**【实测可推】：

1. `delivery-tracker.md` 中出现两行同名待办"多智能体RL (multi-agent-rl)"，任何按 slug 聚合的统计都会重复计数或相互覆盖
2. 站内链接若只写 slug 不写章前缀，指向不确定
3. 两课内容必然需要划分边界，而 catalog 无任何字段能表达"这课与那课的分工"（见 P6）

### P6 · catalog 缺少结构性元数据【中等】【已由 A2 修复 · 2026-09-25】

> **状态更新**：A2 条目已落地——`LessonMeta` 增加 `prereq?` / `level?` / `type?` / `status?`，`Chapter` 增加 `order?`，全部可选、全部有 TS 字面量联合约束，`npx tsc --noEmit` 退出码 0。**本条目只解决了"字段不存在"**；下表"后果"一列中依赖数据填充的部分（依赖图校验、角色矩阵自动派生、状态口径统一）仍待 A3–A8 填数据后才生效。详见 [9.6](#96-a2-已执行catalog-数据模型升级)。

**实测**（诊断当时）：`content/catalog.ts` L6–L10 的 `LessonMeta` 接口只有 3 个字段（A2 后该接口为 L6–L17）：

```ts
export interface LessonMeta {      // L6
  slug: string;                    // L7
  title: string;                   // L8
  subsections?: SubsectionMeta[];  // L9
}                                  // L10

export interface Chapter {         // L12
  slug: string;                    // L13
  title: string;
  lessons: LessonMeta[];
}
```

缺失字段与后果：

| 缺失字段 | 后果 | 已发生的实例 |
|---------|------|-------------|
| `prereq` | 无法做依赖图校验；无法在 UI 上提示"先学什么" | P3 的 3 处章级倒置、P4 的 3 处课级倒置**全部无法自动发现** |
| `level` | 读者无法判断难度（本科 / 硕士 / 博士） | `math/complex-numbers`（高中起点）与 `robust/mu-synthesis`（研究生）在目录里视觉权重相同 |
| `type` | 无法自动决定"哪些角色上场" | **直接阻塞** semester-02-plan §3.6 的课程类型→角色矩阵落地 |
| `status` | 交付状态只能靠 `delivery-tracker.md` 手工维护 | 已经与事实脱节：tracker 底部写 17/83，实测 19/84（见 1.6） |
| `order` | 章序/课序只能靠数组位置隐式表达 | 调整顺序时无 diff 可读，PR review 无法判断"是重排还是增删" |

**注**：`subsections` 字段事实上兼任了"本课已写"的隐式状态标记（56 课有 subsections == 56 个 MDX，见 1.1），但这是**巧合而非契约**——没有任何机制阻止有人给未写的课填 subsections。

### P7 · 完全缺失的主流控制主题【严重】

**关键词计数实测**（`grep -c <关键词> content/catalog.ts`，诊断当时的全 624 个小节 + 84 个课程标题；Q1 / Q2 后为 616 个，下列计数中与 robust 两课、`neural-network-control` 无关的条目不受影响）：

| 缺失主题 | 关键词命中数 | 实际命中位置 | 判定 |
|---------|-------------|-------------|------|
| 无源性 / 耗散理论（PBC） | `无源` 0、`耗散` 0 | — | **完全缺失** |
| 输入–状态稳定性 ISS | `ISS` 0、`输入状态稳定` 0 | — | **完全缺失** |
| 控制屏障函数 CBF / 安全集不变性 | `屏障` 0、`CBF` 0 | — | **完全缺失** |
| 故障诊断与容错控制 FDI/FTC | `故障` 0、`容错` 0 | — | **完全缺失** |
| 网络控制系统 NCS | `网络控制` 1 | **误命中**：该 1 次来自 `神经网络控制`（子串），NCS 实为 0（N12） | **完全缺失** |
| 事件触发 / 自触发控制 | `事件触发` 0 | — | **完全缺失** |
| 切换与混合系统 | `切换系统` 0、`混合系统` 0 | — | **完全缺失** |
| 迭代学习控制 ILC | `迭代学习` 0 | — | **完全缺失** |
| 分布参数 / 无穷维系统（PDE 控制） | `分布参数` 0、`无穷维` 0 | — | **完全缺失** |
| 功能安全标准 | `26262` 0、`61508` 0、`功能安全` 0 | — | **完全缺失** |
| 模型基础 RL / 离线 RL / 模仿学习 | `离线强化` 0、`模仿学习` 0 | — | **完全缺失** |
| 时滞系统专题 | `时滞` **2** | L161"时滞系统的稳定性"（`classic/stability-analysis`）、L179"时滞对频率响应的影响"（`classic/frequency-response`） | **仅 2 个小节，无专题课** |
| 系统辨识 | `辨识` **2** | L602"模型辨识基础"（`mpc/prediction-model`）、L868"递归网络与系统辨识"（`intelligent/neural-network-control`） | **仅 2 个小节，无专题课** |
| 状态估计与滤波（Kalman 之外） | `卡尔曼` 7、`滤波` 8 | 全部集中在 `modern/kalman-filter`（L323–L335）与 `modern/modern-case-study`（L378） | **只有线性 Kalman 一课**；EKF / UKF / 粒子滤波 / H∞ 滤波 / MHE / 多传感器融合全缺 |
| 控制理论史与方法论地图 | — | 无导论章 | **完全缺失** |

**补充**：`RLS / 递归最小二乘 / 最小二乘` 在 catalog.ts 中命中 **0 次**——`semester-02-plan.md` P7 提到的 "`nonlinear/adaptive-control-basics` 的 RLS 小节" 只存在于 MDX 正文与 `delivery-tracker.md` 的描述中，未反映到 catalog 小节标题。

**结论**：一门独立学科（系统辨识）被压成 2 个小节；状态估计只有 1/6 的覆盖面；无源性、ISS、CBF、FDI/FTC、NCS、事件触发、切换系统、ILC、无穷维系统、功能安全标准 **10 个主题命中数为 0**。

### P8 · intelligent 章选题的时代性【中等】

**结构证据**【实测】：`intelligent` 章 7 课（L830 起），其中 4 课无 MDX、无 subsections：

| 课程 | slug | 行号 | 状态 |
|------|------|------|------|
| 模糊控制基础 | `fuzzy-control-basics` | L833 | 已写、已 v1.3 交付 |
| 模糊控制器设计 | `fuzzy-controller-design` | L847 | 已写、已 v1.3 交付 |
| 神经网络控制 | `neural-network-control` | L863 | 已写、已 v1.3 交付 |
| 专家控制系统 | `expert-system` | L877 | 空 |
| 遗传算法优化 | `genetic-algorithm` | L878 | 空 |
| 模糊神经网络 | `fuzzy-neural-network` | L879 | 空 |
| 智能控制综合案例 | `intelligent-case-study` | L880 | 空 |

**覆盖不一致**【实测】：`neural-network-control` 已有小节"直接策略优化：进化策略与策略梯度"（L866）与"深度强化学习：从REINFORCE到PPO"（L867），即**进化策略已在神经网络课中讲过**；而 `genetic-algorithm` 作为独立一课仅覆盖 GA。

> "专家系统在 2026 年已边缘化"属行业判断，见 [7.2](#72-价值与行业判断)。

### P9 · 缺少跨章横向课程与应用专题【中等】

**实测**：

- 11 章中，带 `*-case-study` 的章有 5 个：`classic`（L207）、`modern`（L370）、`robust`（L476）、`mpc`（L636）、`intelligent`（L880，空）——**均为章内案例，无跨章选型总纲**
- 无导论章：catalog 第 1 章直接是 `math`（L20），没有任何"控制理论全局地图 / 方法选型"课程
- `.qoder/skills/wiki-discussion/personas.md` 定义了 7 类轮值领域专家（化工过程控制 / 自动驾驶 / 航空航天 / 机器人控制 / 电力系统 / 电机驱动 / 生物医学），但 catalog 中**没有任何一章承接行业专题**——7 类专家的行业知识只能在单课里出现一次即消失

### P10 · 角色团队的职责真空【严重】

**fix-log 归因实测**（18 条，按"本该由谁拦住"分类）：

| 归因类别 | 条目 | 数量 | 现有 14 角色中是否有人负责 |
|---------|------|------|--------------------------|
| 前端 / 构建 / MDX 工程 | 011, 013, 015, 017 | 4 | **无** |
| 组件默认值与正文手算例不一致 | 014, 016, 018 | 3 | **无** |
| 交互组件设计规范（坐标轴 / 动画 / ipywidgets） | 001–010, 012 | 11 | 有（苏绘 + 何仿） |

**18 条中 7 条（38.9%）落在职责真空区。**

七项具体缺口：

| # | 缺口 | 支撑证据 |
|---|------|---------|
| 1 | **无人负责前端工程** | fix-011（kernel id 冲突）、fix-013（MDX 属性逗号致 404）、fix-015（双注册表）、fix-017（cell 首行 `%#` magic）全部是 React/MDX/构建问题，personas.md 14 个角色无一具备该职责 |
| 2 | **无独立数值仲裁者** | fix-014（−1/N 轨迹起点）、fix-016（rk4 抽稀致周期小 keep 倍）、fix-018（间隙预热相位致环面积 0.52 vs 手算 0.84）——三条都是"正文数字 / notebook 输出 / 组件默认参数"三方不一致，而何仿自己写的仿真无法自己审计 |
| 3 | **无人负责学习体验** | 实测 H2 数：`mpc/generalized-predictive-control` 16、`mpc/nonlinear-mpc` 16、`nonlinear/phase-plane` 15、`nonlinear/feedback-linearization` 15、`classic/stability-analysis` 14、`classic/frequency-response` 14、`intelligent/fuzzy-controller-design` 14（中位数 11，最大 16）。已接近可读性上限却无人把关 |
| 4 | **无红队角色** | 项目记忆记录的 ABS 稻草人基线事故（"对比基线必须整定过——ABS 的门限逻辑若写成每步继电器，湿卵石上会比无 ABS 还差"）属定量对比公平性问题，现有角色无此职责 |
| 5 | **无功能安全 / 标准视角** | P7 实测：`26262`/`61508`/`功能安全` 在 catalog 中命中 0 次，而方案拟新增 `safety-ftc` 章 |
| 6 | **无控制史与方法论视角** | P9 实测：无导论章，而方案拟新增 `introduction` 章 |
| 7 | **学生团队 4 人全部是自动化 / 控制背景** | personas.md：小初（自动化大三）、李稳（控制研一）、赵工（自动化在职）、钱锐（控制博三）。而方案拟新增/扩容的 `rl-control`(11) + `intelligent`(8) + `multi-agent`(10) = 29 课主力读者是 CS/ML 背景；`math` 章 16 课需要"只有高中数学"的读者哨兵，小初已修过微积分/线代/概率，无法承担 |

### P11 · 流程机制缺失【中等】

| 缺口 | 证据 | 实测确认 |
|------|------|---------|
| **无自动化验收脚本** | fix-013 明确记录"本地 Python harness 不解析 MDX 故抓不到"，并把"页面 200 且 h2 数 == catalog 小节数"列为交付硬门槛 | ✅ 该门槛**至今仍不通过**：3 门课 H2 ≠ 小节数（见第 6 节）。若脚本存在，这 3 门不会漏过 |
| **notebook cell 一致性靠人工** | fix-017 要求"MDX cell 与 harness cell 字符串全等"校验脚本作为交付门槛 | ✅ 仓库内无该校验脚本 |
| **双注册表未根治** | fix-015 记录为"新增组件必须两处同改"，用纪律规避而非结构消除 | ✅ 实测两处注册表当前一致（无单侧注册组件），但 `BodeMarginsExplorer` 两处都未注册（N2），说明纪律也已出现漏网 |
| **统计口径靠手工** | 见 1.6 | ✅ tracker 底部 17/83 vs 实测 19/84；OUTLINE 四项全错；tracker 声明组件 33 vs 实测在用 35 |
| **fix-log 无归因闭环** | INDEX 表头为 `# \| 日期 \| 文档 \| 章节 \| 类型 \| 摘要`，无"本该谁拦住"列 | ✅ 因此 0.3 的归因分析只能人工完成 |
| **fix-log 归档不完整**（新增） | — | ✅ INDEX 18 条 vs 独立文件 14 个，`007`–`010` 缺独立记录（N3） |

---

## 4. 重叠矩阵

### 4.1 章级主题撞车

| 撞车对 | 撞车课数 | 内容存量 | 建议处置 |
|--------|---------|---------|---------|
| `computer-control` ↔ `discrete` | 5 组（见 P1 表） | computer-control 8 课全写；discrete 0 课 | **合并重组**为 `discrete-sampled`（理论）+ `implementation`（工程实现），删除 `discrete` 章（A3） |
| `rl-control` ↔ `multi-agent` | 1 组（`multi-agent-rl`，L894/L922） | 两章均 0 课 | **一处主讲 + 一处引用**：保留在 `multi-agent`（协同视角），`rl-control` 改为"多智能体强化学习算法"或删除（A6） |
| `modern` ↔ `estimation`（拟新增） | `modern/kalman-filter`（L323） | 已写 | **迁移**：`modern/kalman-filter` → `estimation/kalman-filter`，`modern` 章保留引用（A6） |

### 4.2 课程级 slug / title 重复

| 重复项 | 位置 | 行号 | 建议处置 |
|--------|------|------|---------|
| slug `multi-agent-rl` | `rl-control` / `multi-agent` | L894 / L922 | 改名其一，或删除 `rl-control` 侧（见 4.1） |
| title `多智能体RL` | 同上 | L894 / L922 | 同上 |
| title `数字控制器设计` | `computer-control/digital-controller-design` / `discrete/digital-controller` | L519 / L905 | 随 P1 重组消解：`discrete-sampled/discretization-methods`（离散化方法）+ `implementation/digital-pid`（数字 PID 实现） |

### 4.3 小节标题重复 —— 真重复（需处置）

**同章跨课**（10 组，实测）：

| 小节标题 | 出现课程 | 行号 | 建议处置 |
|---------|---------|------|---------|
| 频域指标与时域指标的对应 | `classic/frequency-domain-analysis`、`classic/frequency-response` | L103 / L177 | **一处主讲 + 一处引用**：主讲留在 `frequency-domain-analysis`，`frequency-response` 改为引用 |
| 对偶原理 | `modern/controllability-observability`、`modern/state-observer` | L253 / L281 | **一处主讲 + 一处引用**：主讲留在 `controllability-observability` |
| Q 和 R 的选择 | `modern/lqr-controller`、`modern/kalman-filter` | L314 / L333 | **一处主讲 + 一处引用**：主讲留在 `lqr-controller`，`kalman-filter` 侧改为"LQG 对偶：Q/R 与噪声权重的对应" |
| 交互式可视化 | `mpc/constraint-handling`、`mpc/generalized-predictive-control`、`mpc/nonlinear-mpc` | L630 / L661 / L678 | **删除**：v1.2 遗留，v1.3 规定交互组件内联到概念旁 |
| 数值例子 | `mpc/generalized-predictive-control`、`mpc/nonlinear-mpc`、`mpc/distributed-mpc` | L656 / L676 / L692 | **改名**：加上对象限定词（如"数值例子：CSTR 温度控制"） |
| 工业应用 | 同上三课 | L662 / L680 / L695 | **改名**：加行业限定词，或合并为一门 `mpc` 章内应用课 |
| 软件工具 | `mpc/nonlinear-mpc`、`mpc/distributed-mpc` | L679 / L694 | **合并**：上移为章级共享小节或独立一课 |
| 与其他非线性控制方法的对比 | `nonlinear/sliding-mode-control`、`backstepping`、`adaptive-control-basics` | L792 / L806 / L821 | **拆分**：每课只保留"本方法 vs 其余两法"的两两对比，三方总对比移入章末综合课 |
| 处理参数不确定性 | `nonlinear/backstepping`、`adaptive-control-basics` | L804 / L819 | **一处主讲 + 一处引用**：主讲留在 `adaptive-control-basics` |
| 工程实践要点 | `intelligent/fuzzy-controller-design`、`neural-network-control` | L858 / L872 | **保留**（体例统一，见 4.4 判定标准），但内容需去重 |

**跨章跨课**（非样板类，实测）：

| 小节标题 | 出现课程 | 行号 | 建议处置 |
|---------|---------|------|---------|
| 设计实例 | `robust/mixed-sensitivity`、`robust/mu-synthesis`、`robust/robust-performance`、`computer-control/sampling-quantization`、`computer-control/digital-controller-design` | L421 / L434 / L470 / L500 / L523 | **改名**：全部加对象限定词。目录里 5 个"设计实例"无法区分讲的是哪个系统 |
| 稳定性分析 | `mpc/mpc-principle`、`mpc/generalized-predictive-control`、`mpc/nonlinear-mpc`、`intelligent/fuzzy-controller-design` | L591 / L660 / L675 / L857 | **改名**：加限定词（"终端约束的稳定性"、"模糊闭环稳定性"等）。另注意与 `classic/stability-analysis` 整课（L149）构成层级错位 |
| 问题描述 | `classic/classic-case-study`、`modern/modern-case-study`、`mpc/mpc-case-study` | L210 / L373 / L637 | **保留**（案例课统一体例） |
| 建立被控对象模型 | `classic/classic-case-study`、`mpc/mpc-case-study` | L211 / L638 | **保留**（同上） |
| 工程实现细节 | `classic/classic-case-study`、`mpc/mpc-case-study` | L217 / L644 | **保留**（同上） |
| 应用案例 | `nonlinear/phase-plane`、`describing-function`、`lyapunov-stability`、`sliding-mode-control`、`backstepping`、`adaptive-control-basics`、`intelligent/fuzzy-control-basics` | L729 / L743 / L760 / L791 / L805 / L820 / L840 | **保留**（体例统一） |
| 局限性讨论 | `nonlinear/phase-plane`、`describing-function`、`feedback-linearization`、`sliding-mode-control`、`backstepping`、`adaptive-control-basics`、`intelligent/fuzzy-control-basics` | L732 / L746 / L778 / L793 / L807 / L822 / L842 | **保留**（体例统一） |

### 4.4 样板小节（设计如此，不处置）

以下 4 个标题在**每一门课**中重复出现，是刻意的体例统一，**不是问题**：

| 小节标题 | 出现次数 | 覆盖范围 |
|---------|---------|---------|
| 小结 | 56 | 全部 56 门有 subsections 的课 |
| 习题 | 55 | 除 `math/complex-numbers` 外全部（该课无习题小节） |
| 答案 | 55 | 同上 |
| 深入讨论 | 44 | classic / modern / robust / computer-control / mpc / `nonlinear/nonlinear-characteristics` |
| 引言 | 11 | nonlinear 全 8 课 + intelligent 全 3 课 |

**判定标准**（供后续自动化脚本使用）：
- 若某标题出现次数 ≥ 该章课程数的 80%，视为**样板小节**，不报重复
- 否则视为**真重复**，需给出处置建议

> 注意：`nonlinear` / `intelligent` 两章用"引言 + 应用案例 + 局限性讨论 + 工程实践要点"，而 classic / modern / robust / mpc 用"深入讨论 + 小结 + 习题 + 答案"——**两套体例并存**。这不是错误，但应在 SKILL.md 中明确写清各自适用范围，否则新学期 71 门新课会随机选一套。

---

## 5. 依赖倒置清单

"倒置"定义：课程 B 的理解**必需**课程 A 的概念，但在目录中 A 排在 B 之后。

### 5.1 章级倒置（3 处）

| # | 后置章（先出现） | 前置章（后出现） | 具体依赖 | 行号证据 | 严重性 |
|---|-----------------|-----------------|---------|---------|-------|
| D1 | `mpc`（第 6 章，L584） | `discrete`（第 10 章，L898） | `mpc/prediction-model`（L597）需离散状态空间与 Z 变换；`discrete/z-transform-analysis`（L900）是其正主 | L584 < L898 | **高**（且 `discrete` 零内容，依赖完全悬空） |
| D2 | `robust`（第 4 章，L390） | `nonlinear`（第 7 章，L704） | `robust/robust-stability` 小节"Lyapunov方法：二次稳定性"（L443）需 Lyapunov 理论；系统讲解在 `nonlinear/lyapunov-stability`（L752 起） | L390 < L704 | **高** |
| D3 | `mpc`（第 6 章，L584） | `nonlinear`（第 7 章，L704） | `mpc/nonlinear-mpc`（L668）整课依赖非线性 Lyapunov / ISS 工具 | L584 < L704 | **中高** |

> D2 的另一半依赖指向 `modern/linear-system-theory`（L341，第 3 章），**不构成倒置**（3 < 4）。但该课自身有课级倒置，见 D5。

### 5.2 课级倒置（3 处）

| # | 后置课（先出现） | 前置课（后出现） | 具体依赖 | 行号证据 |
|---|-----------------|-----------------|---------|---------|
| D4 | `robust/mu-synthesis`（3.4，L427） | `robust/uncertainty-modeling`（3.6，L452） | μ 综合的定义域就是结构化不确定性；`mu-synthesis` 内还自带一个"不确定性建模"小节（L433），说明作者也意识到缺前置 | L427 < L452 |
| D5 | `modern/lqr-controller`（2.6，L307） | `modern/linear-system-theory`（2.8，L341） | LQR 的稳定性证明依赖 Lyapunov 方程；`linear-system-theory` 的 5 个内容小节（L344–L348）全是 Lyapunov，其中 L348 就叫"Lyapunov 方程与 LQR 的关系" | L307 < L341 |
| D6 | `classic/pid-controller`（1.6，L130） | `classic/stability-analysis`（1.7，L149） | `classic/frequency-response` 的"工程应用：Ziegler-Nichols整定法"（L181）需临界增益概念；而 PID 整定在 L130 就已出现 | L130 < L149 < L181 |

> D6 的严格表述：`pid-controller`（1.6）本身不强依赖 `stability-analysis`（1.7），但 **1.8 `frequency-response` 的 Ziegler–Nichols 小节同时依赖 1.6 与 1.7**，因此 1.7 排在 1.6 之后是合理的，真正的错位在于 `stability-analysis` 未在其小节中声明对 `frequency-response` 的反向依赖。此项严重性低于 D4/D5。

### 5.3 小节级层级错位（2 处）

| # | 现象 | 行号证据 | 处置 |
|---|------|---------|------|
| D7 | `robust/mu-synthesis` 内的小节"不确定性建模"（L433）与整课 `robust/uncertainty-modeling`（L452）**同名** | grep `title: "不确定性建模"` → L433、L452 | 小节改名为"结构化不确定性的 μ 表示"，整课保留 |
| D8 | 小节"稳定性分析"出现在 4 门课中（L591/L660/L675/L857），而 `classic/stability-analysis` 是**整课**（L149） | grep 命中 | 4 处小节全部加限定词 |

### 5.4 依赖倒置的根因

D1–D6 全部**无法被自动发现**，因为 `LessonMeta` 没有 `prereq` 字段（P6）。这是 A2（catalog 数据模型升级）与 A8（依赖校验脚本）必须先于 A3–A6（结构调整）执行的原因：先有表达依赖的能力，再调整顺序，才能验证调整是否正确。

---

## 6. catalog ↔ MDX 一致性缺陷

`.qoder/fix-logs/INDEX.md` 的 fix-013 把"页面 200 且 h2 数 == catalog 小节数"列为**交付硬门槛**。实测该门槛当前**不通过**。

### 6.1 全量核对结果【实测】

门槛有两个可测维度，必须分开看：**源文件维度**（MDX 的 `## ` 数 vs catalog 的 `subsections.length`）与**渲染维度**（页面实际渲染出的 H2 数 vs catalog）。fix-013 的原文"页面 200 且 h2 数 == catalog 小节数"指的是后者。

| 版本 | 源文件维度通过 | 渲染维度通过 |
|------|--------------|-------------|
| `HEAD`（已提交） | 54 / 56 | 54 / 56 |
| 工作区（含未提交改动，诊断当时） | 53 / 56 | 53 / 56 |
| **Q1 + Q2 执行后（当前工作区）** | **56 / 56** | **54 / 56** |

Q1 + Q2 后仍不通过的 2 门是 `mpc/mpc-principle` 与 `mpc/receding-horizon`，**失败原因与 catalog 无关**：两页都被一个 KaTeX 解析错误截断，渲染出的 H2 分别只有 1 / 2 个（源文件各有 8 / 11 个），HTTP 仍返回 200。详见 [N14](#93-执行后新增的三项实测发现)。

H2 数分布：最大 16，中位数 11。

### 6.2 三门不通过课程的失败模式（诊断当时；前两行已由 Q2 修复，第三行已由 Q1 修复）

| 课程 | H2 | catalog 小节 | 失败模式 | 具体差异 |
|------|----|-----------|---------|---------|
| `robust/robust-stability` | 10 | 11 | **层级降级**：catalog 多声明 1 个小节 | catalog 的"Kharitonov定理"（原 L443，属 `robust-stability` 课 L440）在 MDX 中是 H3（`content/robust/robust-stability.mdx:68`，位于 H2"参数空间方法"之下），不是独立 H2。**Q2 已删除该条目**；其 slug 还拼错为 `kharonov`（正确渲染 id 是 `kharitonov-定理`），删除前该侧栏链接本来就是死链 |
| `robust/robust-case-study` | 11 | 15 | **层级降级**：catalog 多声明 5 个小节 | catalog 的"为什么选柔性结构"、"物理系统"、"运动方程"、"频率响应特征"、"LFT模型构造"（原 L478–L483 中的 5 条）在 MDX 中全部是 H3（分别在 `robust-case-study.mdx:30 / 43 / 69 / 83 / 242`），被合并进一个新 H2"问题描述"。**Q2 已删除这 5 条并补上 `问题描述`**，11 个小节与 11 个 H2 逐一对应 |
| `intelligent/neural-network-control` | 12 | 15 | **catalog 是完全不同的另一套大纲**（仅存在于未提交改动中） | catalog 15 个小节中，**10 个在 MDX 的任何标题层级都不存在**（见下）。**Q1 已 `git checkout HEAD --` 恢复**，现为 12 个小节且与 MDX 一致 |

`neural-network-control` 的详细核对——catalog 小节标题在 MDX 全文中的出现次数：

| catalog 小节（L864–L875） | 在 MDX 中出现次数 |
|--------------------------|------------------|
| 神经网络在控制中的四种角色 | **0** |
| 前馈网络作为静态控制器 | **0** |
| 网络深度与宽度的影响 | **0** |
| 监督学习：行为克隆 | **0**（"行为克隆"命中 0） |
| 直接策略优化：进化策略与策略梯度 | 0（但"进化策略"命中 11 次，散落在 H2"直接优化：让 NN 超越 PID"下） |
| 深度强化学习：从REINFORCE到PPO | **0**（"REINFORCE"命中 0） |
| 递归网络与系统辨识 | **0** |
| 定量对比：从浅层到深度 | 0（MDX 的 H2 是"定量对比"） |
| 鲁棒性与泛化 | 0（MDX 的 H2 是"鲁棒性测试"） |
| 稳定性与安全性 | 0（MDX 的 H2 是"稳定性问题"） |

MDX 实际的 12 个 H2（`content/intelligent/neural-network-control.mdx`）：

```
L8   引言                        L480 定量对比
L22  从模糊控制的失败说起          L623 鲁棒性测试
L42  前馈神经网络：结构与万能逼近    L751 稳定性问题
L197 监督学习：用 NN 模仿 PID      L785 工程实践要点
L355 直接优化：让 NN 超越 PID      L820 小结 / L832 习题 / L844 答案
```

### 6.3 未提交改动引入的回归

`git diff content/catalog.ts` 显示工作区有 **1 处未提交改动**（+10 / −7 行），内容正是把 `neural-network-control` 的小节列表从**与 MDX 一致**换成**另一套大纲**：

```diff
       { slug: "neural-network-control", title: "神经网络控制", subsections: [
         { slug: "引言", title: "引言" },
-        { slug: "从模糊控制的失败说起", title: "从模糊控制的失败说起" },
-        { slug: "前馈神经网络：结构与万能逼近", title: "前馈神经网络：结构与万能逼近" },
-        { slug: "监督学习：用NN模仿PID", title: "监督学习：用NN模仿PID" },
-        { slug: "直接优化：让NN超越PID", title: "直接优化：让NN超越PID" },
-        { slug: "定量对比", title: "定量对比" },
-        { slug: "鲁棒性测试", title: "鲁棒性测试" },
-        { slug: "稳定性问题", title: "稳定性问题" },
+        { slug: "神经网络在控制中的四种角色", title: "神经网络在控制中的四种角色" },
+        { slug: "前馈网络作为静态控制器", title: "前馈网络作为静态控制器" },
+        { slug: "网络深度与宽度的影响", title: "网络深度与宽度的影响" },
+        { slug: "监督学习：行为克隆", title: "监督学习：行为克隆" },
+        { slug: "直接策略优化：进化策略与策略梯度", title: "直接策略优化：进化策略与策略梯度" },
+        { slug: "深度强化学习：从REINFORCE到PPO", title: "深度强化学习：从REINFORCE到PPO" },
+        { slug: "递归网络与系统辨识", title: "递归网络与系统辨识" },
+        { slug: "定量对比：从浅层到深度", title: "定量对比：从浅层到深度" },
+        { slug: "鲁棒性与泛化", title: "鲁棒性与泛化" },
+        { slug: "稳定性与安全性", title: "稳定性与安全性" },
         { slug: "工程实践要点", title: "工程实践要点" },
```

**判定**：被删除的 7 行与 MDX 的 H2 **逐条对应**（`从模糊控制的失败说起` = MDX L22，`前馈神经网络：结构与万能逼近` = MDX L42，依此类推）；被新增的 10 行与 MDX **零对应**。因此 **HEAD 版本是正确的，工作区版本是回归**。

**处置**：诊断阶段本报告未对该改动做任何处置（既不 revert 也不 commit），列入[第 8 节待裁决事项](#8-待用户裁决事项) Q1。用户裁决为 (a)，已于 2026-09-25 执行 `git checkout HEAD -- content/catalog.ts`，详见 [9.1](#91-q1-已执行恢复-head)。上面的 diff 保留为历史记录。

### 6.4 根因与处置建议

| 失败模式 | 根因 | 处置 | 状态 |
|---------|------|------|------|
| 层级降级（`robust-stability`、`robust-case-study`） | 写正文时把小节合并为 H3，但未回写 catalog | **改 catalog**：把这 6 个条目从 `subsections` 移除，或把 MDX 的 H3 提升为 H2。前者成本低 | **已执行**（Q2，见 9.2） |
| 大纲漂移（`neural-network-control`） | catalog 条目是**规划期**产物，交付后未与正文对齐 | **恢复 HEAD 版本**（`git checkout HEAD -- content/catalog.ts` 会连带丢弃该文件其他改动，需先确认无其他有用改动——实测该文件**仅此一处**改动，故安全） | **已执行**（Q1，见 9.1） |
| 渲染截断（`mpc-principle`、`receding-horizon`） | `$$\boxed{\begin{aligned}` 写在同一行，KaTeX 解析失败后正文被截断 | **改 MDX**：把 `$$`、`\boxed{`、`\begin{aligned}` 拆成三行（同项目内 3 处正确写法可对照） | **未执行**——超出 Q1/Q2 授权范围，见 [N14](#93-执行后新增的三项实测发现) |
| 侧栏锚点失效（27 门课、92 个小节） | catalog 的 `sub.slug` 是手写的，未经 github-slugger 规范化 | **A2 / E1**：`slug` 不应手写，应由脚本从 MDX 标题派生并校验 | **未执行**——超出 Q1/Q2 授权范围，见 [N13](#93-执行后新增的三项实测发现) |
| 共同根因 | 无自动化校验（P11） | **A7 / E1**：把"页面 200 且**渲染出的** h2 数 == catalog 小节数"与"catalog slug ∈ 页面标题 id 集合"写进 `npm run verify`，作为交付门槛强制执行 | 待 A7 / E1 |

---

## 7. 推测性判断（不可用现有文件证实）

以下条目**不是实测结论**，是行业判断、价值排序或因果推断。执行 A3–A6 时应把它们与第 3 节的实测证据分开对待。

### 7.1 内容层面的推断

| # | 判断 | 为何无法证实 | 如何转为实测 |
|---|------|-------------|-------------|
| S1 | `computer-control` 与 `discrete` 的 5 组撞车课"内容会重复" | `discrete` 章零 MDX，**不存在可比对的内容**。已证实的只是目录层面的主题撞车 | 无法证实，也无需证实——A3 直接删除 `discrete` 章即可 |
| S2 | `nonlinear` 三课的"与其他非线性控制方法的对比"小节"内容必然互相覆盖" | 三门课 MDX 均存在，但 A1 是结构诊断，**未做正文级比对** | 阶段 C 重写这三课时做正文 diff |
| S3 | `rl-control/multi-agent-rl` 与 `multi-agent/multi-agent-rl` "内容必然重复" | 两章均零 MDX | 同 S1 |
| S4 | `设计实例` 5 处、`稳定性分析` 4 处同名小节"读者无法区分" | 这是读者体验推断，未做用户测试 | 阶段 E 的可读性检查可加"同名小节必须带限定词"规则 |

### 7.2 价值与行业判断

| # | 判断 | 性质 |
|---|------|------|
| S5 | "`expert-system`（专家系统）在 2026 年已高度边缘化，作为一整课性价比很低" | **行业趋势判断**，非文件可证。catalog 只能证实该课存在且为空（L877） |
| S6 | "控制器整定实际更常用 PSO / 差分进化 / CMA-ES" | 行业实践判断 |
| S7 | P7 表中各缺失主题的"严重性"分级（高 / 中高 / 中 / 低） | **价值排序**，反映的是编写优先级偏好，不是客观测量 |
| S8 | "无源性与耗散理论是 backstepping、机器人力控、电力电子控制的共同基础" | 学科共识陈述，本仓库无文件可证 |
| S9 | "读者学完 11 章仍无法回答'面对一个实际系统我该用哪种方法'" | 对读者认知状态的推断 |
| S10 | "轮值专家的行业知识只在单课里出现一次就消失，无法沉淀" | 对流程效果的推断；personas.md 只证实了 7 类专家的定义存在 |

### 7.3 组织设计推断

| # | 判断 | 性质 |
|---|------|------|
| S11 | "何仿自己写的仿真无法自己审计" | **组织设计原则**（审计独立性），不是对已发生事实的陈述。支撑它的实测事实是 fix-014/016/018 三条确实发生了 |
| S12 | "39% 的返工落在职责真空区 ⇒ 增加对应角色可减少返工" | 前半句是实测（7/18），**后半句是因果推断**，需新学期数据验证 |
| S13 | 角色池扩到 22 人后，单课出席 7–10 人仍能控制讨论长度 | 设计假设，未经实践检验 |

### 7.4 已排除的伪发现

| 项 | 初判 | 实测结论 |
|---|------|---------|
| "网络控制系统 NCS 在 catalog 中出现 1 次" | 疑似已有覆盖 | **误命中**：该 1 次来自 `神经网络控制` 的子串。NCS 实际命中 0（N12） |
| "`adaptive-control-basics` 有 RLS 小节" | 方案 P7 如此表述 | catalog.ts 中 `RLS`/`递归最小二乘`/`最小二乘` 命中 **0**。该内容只在 MDX 正文与 `delivery-tracker.md` 描述中，未反映到小节标题 |
| "小结/习题/答案/深入讨论/引言 是重复小节" | 脚本报出 12 组跨章重复 | **设计如此的样板小节**，不处置（见 4.4 判定标准） |
| "有 subsections 的 56 课与 56 个 MDX 只是数量巧合" | — | **逐章核对集合一致**，非巧合（见 1.1） |

---

## 8. 待用户裁决事项

A1 是只读诊断。下表 Q1–Q7 为诊断阶段及其执行过程中积累的待决事项（Q1/Q2 已裁决执行），**Q8/Q9 是 A2 执行前新增的裁决**——它们暴露的是 `semester-02-plan.md` 自身的内部矛盾与失效门槛，不是 catalog 的问题：

| # | 事项 | 选项 | 建议 | 裁决与执行 |
|---|------|------|------|-----------|
| **Q1** | `content/catalog.ts` 有一处未提交改动，把 `neural-network-control` 的正确小节列表换成了与 MDX 零对应的另一套大纲（见 6.3）。**HEAD 版本正确，工作区版本是回归** | (a) `git checkout HEAD -- content/catalog.ts` 丢弃该改动；(b) 保留改动并反向重写 MDX 正文以匹配新大纲；(c) 保留改动不动，仅在 catalog 里标注"待对齐" | **(a)**。实测该文件仅此一处改动，丢弃无副作用。但需用户确认这套新大纲不是有意为之的重写计划 | **已裁决 (a)，已执行**，见 9.1 |
| **Q2** | `robust/robust-stability`（1 处）与 `robust/robust-case-study`（5 处）的 catalog 小节在 MDX 中已降级为 H3 | (a) 改 catalog，删掉这 6 个条目；(b) 改 MDX，把 H3 提升为 H2 | **(a)**。改 catalog 不动正文，风险低；且 H3 结构本身是合理的（"问题描述"下分物理系统/运动方程/…） | **已裁决 (a)，已执行**，见 9.2 |
| **Q3** | `BodeMarginsExplorer` 孤儿组件（已实现、未注册、未引用） | (a) 删除；(b) 注册并接入 `classic/frequency-response` 的"在Bode图上读取裕度"小节（L174）；(c) 保留不动 | **(b)**。该组件算的正是 `G(s)=K/(s(s+1)(s+10))` 的 Bode 裕度，与 `frequency-response` 的裕度主题高度契合，且该课尚未 v1.3 交付（tracker 中标注"待重构（7个ipywidgets笔记本）"） | **待裁决** |
| **Q4** | fix-logs `007`–`010` 缺独立日志文件 | (a) 从 git 历史补写；(b) 在 INDEX 中标注"仅存摘要"；(c) 不处理 | **(b)**。这 4 条是同批次 ipywidgets→React 转换，细节同质，补写性价比低；标注可避免后人误以为文件丢失 | **待裁决** |
| **Q5**（新增） | 27 门课的 92 个侧栏小节锚点是死链（N13），根因是 `sub.slug` 手写未经规范化 | (a) 写脚本从 MDX 标题批量派生全部 616 个 slug；(b) 只修死链的 92 个；(c) 留到 A2 数据模型升级时一并处理 | **(a) 或 (c)**。派生逻辑与 A2 要加的校验脚本是同一份代码，分两次写会重复劳动；(b) 手工修 92 处必然再次漂移 | **待裁决** |
| **Q6**（新增） | `mpc/mpc-principle` 与 `mpc/receding-horizon` 两页被 KaTeX 解析错误截断，读者只能看到 1/8 与 2/11 的正文，但 HTTP 200（N14） | (a) 改 MDX，把 `$$\boxed{\begin{aligned}` 拆成三行（2 处、各 1 行改动）；(b) 暂不处理，记入待办 | **(a)**，且应优先于 A3–A6 的任何新课编写。这是当前唯一"读者可见的正文丢失"，修复成本 2 行 | **待裁决**——A1 授权范围禁止改 `content/` 下的 MDX |
| **Q7**（新增） | `npm run build` 在 HEAD 上就失败（12 个 ESLint error，4 个组件文件，N15） | (a) 修掉 12 个 error；(b) 在 `next.config` / `.eslintrc` 中降级相关规则；(c) 给 build 加 `--no-lint` | **(a)**。12 个 error 全是未使用变量、`any`、未转义引号，机械可修；(b)(c) 会让门槛永久失效，正是 P10/P11 指出的"无前端工程角色"的后果 | **待裁决** |
| **Q8**（A2 前新增） | A2 推荐 Prompt **自相矛盾**：第 1 步写 `Chapter` 增加 `order: number`（必填），验收条款却写"新字段有 TS 类型约束且**全部可选**"；同时第 3 步又写"数据填充留给 A3–A6" | (a) `order?: number` 可选、本次不填数据；(b) 可选但顺手按数组下标填 0..10；(c) 严格按第 1 步用必填并填 0..10 | **(a)**。验收条款与第 3 步一致指向"只加 schema 不填数据"；且 A3 要合并重排章节、A5 要插 5 个新章，现在写的 0..10 立刻作废。(b) 还会制造"`order` 与数组下标"的双份真相，而项目没有任何校验器能发现二者漂移（P11） | **已裁决 (a)，已执行**，见 9.6 |
| **Q9**（A2 前新增） | A2 验收门槛"`npm run build` 通过"在 HEAD 上**已经是红的**（Q7 的 12 个 ESLint error），与 catalog 改动无关，导致 A2 无论怎么做都无法按字面验收 | (a) 改验 `npx tsc --noEmit` + curl 3 页 200，build 转绿留给 Q7 单独裁决；(b) 在 A2 内顺手修掉 12 个 error；(c) `next build --no-lint` | **(a)**。新增可选字段唯一可能引入的错误类型是类型错误，`tsc --noEmit` 正好覆盖；(b) 会把 4 个组件文件的改动混进"目录元数据升级"这一个 diff，回溯时无法分离；(c) 会把 Q7 的 12 个真实 error 永久藏起来 | **已裁决 (a)，已执行**，见 9.6 |

---

## 9. 裁决执行记录与执行后新增发现

第 8 节的 Q1 / Q2 已于 2026-09-25 裁决并执行（9.1 / 9.2），执行过程中的实测暴露出三项诊断阶段未发现的问题，记为 N13–N15（9.3）。同日 **A2 条目**开工前又裁决了 Q8 / Q9，执行记录与其带来的新发现 **N16** 见 9.6。

### 9.1 Q1 已执行：恢复 HEAD

**裁决**：(a) 丢弃 `content/catalog.ts` 的未提交改动。

**执行**：`git checkout HEAD -- content/catalog.ts`。执行前再次确认 `git diff` 只有 `neural-network-control` 小节列表这**一处** hunk（+10 / −7），无其他有用改动被连带丢弃。

**结果**【实测】：`catalog.ts` 933 → 930 行；`neural-network-control`（L863）恢复为 12 个小节（L864–L875），与 `content/intelligent/neural-network-control.mdx` 的 12 个 H2 逐条对应；源文件维度的门槛不通过数由 3 门降为 2 门。

### 9.2 Q2 已执行：catalog 对齐 MDX

**裁决**：(a) 改 catalog，不改 MDX。

**执行前的关键发现**：`components/wiki/sidebar.tsx:118` 用 `href={`/${lessonKey}#${sub.slug}`}` 拼侧栏锚点，而页面标题 id 由 `lib/content.ts:8,91` 的 `rehypeSlug`（即 `github-slugger`）生成。因此"对齐"不只是**数量**对齐，`sub.slug` 还必须**逐字等于** slugger 对该标题的输出，否则侧栏链接是死链。这一约束在诊断阶段（第 6 节）没有被识别出来。

据此，Q2 的实际改动比裁决时的设想多了 slug 规范化：

| 课程 | 改动 | 依据（渲染后实测 id） |
|------|------|---------------------|
| `robust/robust-stability` | 删除 `{ slug: "kharonov-定理", title: "Kharitonov定理" }` | 该标题在 MDX 中是 H3，渲染 id 为 `kharitonov-定理`；catalog 的 `kharonov-定理` 既层级错又拼写错，本来就是死链 |
| `robust/robust-case-study` | 删除 `为什么选柔性结构` / `物理系统` / `运动方程` / `频率响应特征` / `LFT-模型构造` 5 条；新增 `问题描述`；`H∞-混合灵敏度设计` → `h-混合灵敏度设计`；`Monte-Carlo-验证` → `monte-carlo-验证` | 页面渲染出的 11 个 H2 id 依次为 `问题描述`、`不确定性分析`、`设计需求`、`h-混合灵敏度设计`、`μ-分析验证`、`μ-综合改进`、`monte-carlo-验证`、`深入讨论`、`小结`、`习题`、`答案` |

**一个反直觉的实测结果**：`H∞ 混合灵敏度设计` 的渲染 id 是 `h-混合灵敏度设计`——`∞` 被 slugger **删除**而不是保留，`H` 小写化，空格转 `-`。凭直觉写成 `h∞-混合灵敏度设计` 会依然是死链。这类规则只能实测，不能推导，正是 N13 主张"slug 必须由脚本派生"的直接理由。

**净改动**：`catalog.ts` 930 → 925 行，`git diff` 为 +3 / −8，小节总数 621 → 616。

**验证**【实测，浏览器 DOM 而非静态推断】：

| 课程 | 渲染 H2 | 侧栏小节链接 | 死链 |
|------|--------|------------|------|
| `/robust/robust-stability` | 10 | 10 | **0** |
| `/robust/robust-case-study` | 11 | 11 | **0** |

被删除的 6 个标题在页面上仍然存在（作为 H3），右侧目录由真实标题生成（`components/wiki/table-of-contents.tsx:52` 用 `href={`#${h.id}`}`），因此读者不会失去任何入口——`kharitonov-定理` 等 id 实测仍在 DOM 中。

全站门槛：源文件维度 **56 / 56 通过**；渲染维度 **54 / 56**，剩余 2 门见 N14。

### 9.3 执行后新增的三项实测发现

**N13 · 92 个侧栏小节锚点是死链，涉及 27 门已交付课程【实测，严重】**

对 56 门已写课程逐门取渲染后 HTML 的标题 id 集合，与 catalog 的 616 个 `sub.slug` 比对：

| 指标 | 数值 |
|------|------|
| catalog 小节总数 | 616 |
| 锚点失效（页面上无此 id） | **92**（有效率 85.1%） |
| 受影响课程 | **27 / 56** |
| 其中：slug 与标题不一致 | 81 |
| 其中：标题存在但页面未渲染（= N14 的截断） | 11 |

81 处 slug 不一致的成因分布（一项可含多种）：

| 成因 | 处数 | 例子 |
|------|------|------|
| slug 保留大写字母，未小写化 | 52 | `Z变换的定义` → 实际 id `z变换的定义`；`MPC的三大核心思想` → `mpc的三大核心思想` |
| title 含中文标点，slug 的处理方式与 slugger 不同 | 20 | `工程实例：RC 低通滤波器的频率分析`：catalog 写成 `工程实例rc低通滤波器的频率分析`（空格被删），实际 id 是 `工程实例rc-低通滤波器的频率分析`（空格转 `-`） |
| title 含空格 | 16 | `为什么需要 LQR` → `为什么需要-lqr`，catalog 写成 `为什么需要-LQR`（大小写错） |
| slug 里**直接含空格** | 8 | `LaSalle 不变集原理`、`Lyapunov-based NMPC`、`Poincaré-Bendixson 定理与极限环`——href 中的空格会被编码为 `%20`，必然匹配不上 |
| 特殊数学符号被 slugger 删除 | 5 | `H∞范数` → `h-范数`（`∞` 消失）；`结构化奇异值μ` → `结构化奇异值`（`μ` 消失）；`μ鲁棒稳定性与鲁棒性能` → `鲁棒稳定性与鲁棒性能` |

死链最多的 5 门：`mpc/receding-horizon` 10、`mpc/mpc-principle` 8、`mpc/generalized-predictive-control` 8、`modern/lqr-controller` 6、`mpc/nonlinear-mpc` 6、`nonlinear/phase-plane` 6。

**根因**：`sub.slug` 是**手写**的，且项目内同时存在两种写法（一部分已正确小写化并去标点，一部分是标题原文照抄）。手写规则不可能与 `github-slugger` 的实现细节长期一致——`∞` 被删、`é` 被保留、`——` 被删、空格转 `-`，这些都没有文档，只能实测。

**处置建议**：`slug` 不应手写。A2 升级数据模型时，让 `slug` 由脚本从 MDX 标题派生（或干脆去掉 `slug` 字段、只留 `title`，运行时派生），并把"catalog slug ∈ 页面标题 id 集合"写进 E1 的验收脚本。见 Q5。

**N14 · 2 门课的正文被 KaTeX 解析错误截断，读者只能看到零头【实测，严重】**

| 课程 | MDX 源 H2 | 页面渲染 H2 | HTTP | KaTeX 错误 |
|------|----------|-----------|------|-----------|
| `mpc/mpc-principle` | 8 | **1** | 200 | 2 |
| `mpc/receding-horizon` | 11 | **2** | 200 | 2 |

浏览器 DOM 实测 `/mpc/mpc-principle`：正文仅 21931 字符、页面高度 7985px，只有 1 个 H2 与 2 个 H3，其后全部内容（`线性MPC的数学公式`、`MPC与LQR的区别`、`稳定性分析`、`深入讨论`、`小结`、`习题`、`答案` 共 7 个 H2）**不存在于 DOM**。

**根因**【实测，1:1 对应】：两课各有一处把 `$$`、`\boxed{`、`\begin{aligned}` 写在**同一行**：

```
content/mpc/mpc-principle.mdx:54     $$\boxed{\begin{aligned}
content/mpc/receding-horizon.mdx:65  $$\boxed{\begin{aligned}
```

KaTeX 报 `ParseError: Expected 'EOF', got '&' at position 16: \min_{U} \quad &̲ J = \sum_{i=0}…`——`&` 是 `aligned` 环境的对齐符，但 KaTeX 收到的字符串里 `aligned` 环境已经丢失，于是 `&` 成了非法字符。

全项目 `^\$\$\\boxed\{\\begin\{aligned\}` 只匹配到这 **2 处**，与出错的 **2 个页面**完全一一对应。同项目内 3 处**正确**写法可对照（`modern/state-space.mdx:75-82`、`modern/optimal-control-basics.mdx:45-54`、`nonlinear/nonlinear-characteristics.mdx:52-57`），它们把 `$$`、`\boxed{`、`\begin{aligned}` 分成三行，渲染正常。

**为什么一直没被发现**：页面返回 **200**，没有 error digest，没有报错弹窗，`</html>` 正常闭合，KaTeX 错误只以一个红色 `<span class="katex-error">` 的形式出现在被截断的位置。fix-013 的门槛写的是"页面 200 且 h2 数 == catalog 小节数"——**后半句恰好能抓住它，但从未被自动执行过**（P11）。这是"门槛存在但未自动化"造成实际损失的第一个确证案例。

**处置建议**：改 MDX 各 1 行（把 `$$\boxed{\begin{aligned}` 拆成三行），修复成本极低、收益是恢复两门课约 85% 的正文。但 A1 的授权范围明确禁止修改 `content/` 下的 MDX，故未执行，列为 Q6。

**N15 · `npm run build` 在 HEAD 上就失败，12 个 ESLint error【实测，中高】**

`npm run build` 输出 `✓ Compiled successfully` 后，在 `Linting and checking validity of types` 阶段 `Failed to compile`，共 **12 个 error**（另有 5 个 warning）：

| 文件 | error 数 | 类型 |
|------|---------|------|
| `components/wiki/nyquist-limit-cycle-explorer.tsx` | 8 | 5 个未使用变量（L15/17/18/20/21）+ 3 个 `no-explicit-any`（L153/162/184） |
| `components/wiki/nonlinearity-explorer.tsx` | 2 | L481 未转义的 `"` ×2（`react/no-unescaped-entities`） |
| `components/wiki/describing-function-explorer.tsx` | 1 | L97 `no-explicit-any` |
| `components/wiki/phase-plane-explorer.tsx` | 1 | L402 未使用变量 `ys` |

**归因证明**：`git status --short components/` 为空——这 4 个文件在本次会话中**未被修改**，内容等于 HEAD，因此该失败在 HEAD 上同样发生，与 Q1 / Q2 无关。`catalog.ts` 未出现在任何 error 中（类型检查通过）。

**含义**：这 4 个文件全部来自最近一次提交 `dd1b29f`（backstepping / sliding mode / phase plane / describing function 等章）。也就是说**最近一次提交把生产构建弄坏了，且没有被任何机制拦住**——这正是 P10（无前端工程角色，fix-011/013/015/017 占历史返工的 4/18）与 P11（无自动化验收）的直接后果，也是"交付门槛从未包含 build"的证据。

**处置建议**：12 个 error 全是机械可修的（删未使用变量、`any` 换具体类型、`"` 换 `&quot;`）。不应通过降级 ESLint 规则或 `--no-lint` 绕过——那会让门槛永久失效。列为 Q7。

### 9.4 本次会话的变更清单

| 文件 | 变更 | 授权来源 |
|------|------|---------|
| `content/catalog.ts` | Q1：`git checkout HEAD --` 丢弃未提交回归（933 → 930 行） | 用户裁决 Q1 = (a) |
| `content/catalog.ts` | Q2：robust 两课对齐 MDX，+3 / −8（930 → 925 行） | 用户裁决 Q2 = (a) |
| `content/catalog.ts` | **A2**：接口块新增 9 行可选字段（`LessonMeta` 的 `prereq`/`level`/`type`/`status`、`Chapter` 的 `order`），925 → **934 行**；未动任何 slug / title / subsections，未调整顺序 | 用户裁决 Q8 = (a) + A2 推荐 Prompt，见 9.6 |
| `.next/`（构建产物） | 为修复 N16 缓存损坏，kill 进程树后 `rm -rf .next` 并 `npm run dev` 重启重建 | 项目既定补救手段，见 9.6 |
| `docs/semester-02/01-structure-diagnosis.md` | A1 产出；Q1/Q2 后全量重编号（523 个 `L<n>` 令牌，改写 317 个）；新增第 9 节；§0.2 / §6.1 / §6.2 / §6.3 / §6.4 / §8 同步更新。**A2 后再次同步**：§0.2 加行号换算表、P6 标注已修复、附录头与 3 处接口引用就地标注、§8 增 Q8/Q9、新增 9.6（含 N16） | A1 交付物本身 |
| `.qoder/semester-02-plan.md` | A1、A2 勾选框 `[ ]` → `[x]` | A1 / A2 prompt 明确要求 |

**未改动**：任何 MDX 正文、`components/`、`lib/`、`app/`、`.qoder/delivery-tracker.md`、`OUTLINE.md`、`.qoder/fix-logs/`。N13 / N14 / N15 三项均只记录、未修复（见 Q5 / Q6 / Q7）；N16 已修复（属环境问题，非源码缺陷）。

### 9.5 复现命令

```bash
# 门槛与锚点全量核对（需 dev server 已在 8080 运行）
# 脚本逻辑：解析 catalog.ts → 逐课 fetch → 提取渲染后的 <h1-6 id> → 与 sub.slug 比对
#   维度A：渲染 H2 数 == catalog subsections.length（fix-013）
#   维度B：MDX 源 H2 数 == 渲染 H2 数（截断检测，需跳过 ``` 围栏与多行 <Component .../> JSX）
#   维度C：每个 sub.slug ∈ 渲染 id 集合（侧栏死链检测）
#   自检：朴素 ^## 计数 vs 跳过代码/JSX 后的计数，本次结果"无差异"

# N14 根因定位
grep -rn '^\$\$\\boxed{\\begin{aligned}' --include=*.mdx content/     # → 恰好 2 处
grep -n 'quad &' content/mpc/mpc-principle.mdx content/mpc/receding-horizon.mdx

# N15 归因证明
git status --short components/                                        # → 空，故失败在 HEAD 上同样存在
npm run build 2>&1 | grep -c "Error:"                                 # → 12
```

**MDX 解析的两个陷阱**（本次踩到，写验收脚本时必须注意）：

1. **文件是 CRLF**。用 `split("\n")` 后再匹配 `/^(#{1,6})\s+(.*)$/` 会**一个标题都匹配不到**——`$` 不带 `m` 标志时只匹配串尾，而 `.` 不匹配行终止符 `\r`。必须 `split(/\r?\n/)`。这个 bug 会让校验脚本静默地"全部通过"。
2. **`<JupyterNotebook>` 的 Python cell 里有 `#` 注释**，朴素计数会把它们当成 H1。必须跳过 ``` 围栏**和**多行 JSX 组件块；且 JSX 的收尾 `/>` 常常**不在独立行上**（`distributed-mpc.mdx:407` 是 ``...`}]} />``），终止条件要写成"行尾是 `/>`"而不是"整行只有 `/>`"。

### 9.6 A2 已执行：catalog 数据模型升级

**前置裁决**：Q8 = (a) `order?: number` 可选且本次不填数据；Q9 = (a) 验收改验 `npx tsc --noEmit` + curl，`npm run build` 转绿留给 Q7。两项均由用户在 A2 开工前裁决。

**改动**【实测】：只动 `content/catalog.ts` 的接口块，`LessonMeta` 增 `prereq?: string[]` / `level?` / `type?` / `status?`，`Chapter` 增 `order?: number`，四个联合类型全部按 Prompt 字面写成内联字面量联合（未额外抽 `type` 别名——A8 真正需要时再抽，避免提前抽象）。净 **+9 行插入、0 行删除**，文件 925 → **934 行**；相对 HEAD 的 `git diff --stat` 为 +12/−8，其中 A1 的 Q1/Q2 占 +3/−8。**未改任何已有 slug / title / subsections，未调整章节或课程顺序**（`git diff` 中除接口块外只有 A1 已授权的两处 hunk）。

**消费方核查**（Prompt 第 4 步）：实际消费 catalog 的有 **3 处**，比 Prompt 列出的多出 `components/wiki/sidebar.tsx:3`：

| 文件 | 读取的字段 | 是否需适配 |
|------|-----------|-----------|
| `app/(wiki)/page.tsx:1,12,21` | `ch.slug` `ch.title` `ch.lessons` `l.slug` `l.title` | 否 |
| `app/(wiki)/[chapter]/[lesson]/page.tsx:4,8` | `ch.slug` `ch.lessons` `l.slug`（`generateStaticParams`） | 否 |
| `components/wiki/sidebar.tsx:3,14,57` | 上述 + `l.subsections` | 否 |
| `lib/content.ts` | **完全不 import catalog** | 否 |

`lib/content.ts:51` 自己声明了一个 `export interface LessonMeta { title; description }`（MDX frontmatter 用），与 `content/catalog.ts:6` 的 `LessonMeta` **同名但不同义**。两者无 import 关系故不冲突，但这是一个待命名的隐患，记录备查，本次未改（超出 A2 范围）。

**验收实测**（按 Q9 调整后的门槛）：

| 门槛 | 结果 |
|------|------|
| `npx tsc --noEmit` | 退出码 **0**，零输出 |
| `curl classic/time-domain-analysis` | **200**，h1=1，h2=11，2,153,462 字节 |
| `curl nonlinear/phase-plane` | **200**，h1=1，h2=15，4,441,053 字节 |
| `curl intelligent/fuzzy-control-basics` | **200**，h1=1，h2=12，3,277,129 字节 |
| 三页错误标记（`MODULE_NOT_FOUND` / `Application error` / `vendor-chunks`） | **0** |
| `npm run build` | **未验**——按 Q9 转由 Q7 处理 |

H2 数与 catalog 小节数一致（`phase-plane` 的 15 个 H2 正好对上 P10 第 3 条"已接近可读性上限"的实测），说明三页都是完整渲染，不是 Q6 那种"200 但正文被截断"。

**未在 A2 内处理**：Q5（92 个死链锚点）。A2 的推荐 Prompt 不含 slug 重算，故未顺手做；Q5 仍待裁决。

#### N16 · `.next` 缓存损坏会让"curl 200"门槛产生假阴性

**现象**【实测】：A2 改完后首次 curl 三门课**全部 HTTP 500**，响应体 `__NEXT_DATA__` 里是

```
Cannot find module './vendor-chunks/@base-ui.js'
Require stack: .next\server\webpack-runtime.js → .next\server\app\(wiki)\[chapter]\[lesson]\page.js → …\static-paths-worker.js
```

**根因排查**：`.next/server/vendor-chunks/` 下只剩 2 个文件（`@swc.js`、`next.js`），被 require 的 `@base-ui.js` 确实不存在；而 `node_modules/@base-ui` 存在，`components/ui/` 下 5 个文件（badge / button / scroll-area / separator / sheet）引用它。**是构建缓存不完整，不是依赖缺失、也不是源码问题。**

**归因实验**（关键一步）：`git stash push -- content/catalog.ts` 把 catalog 退回 HEAD，复测 `classic/time-domain-analysis` 与 `nonlinear/phase-plane` —— **仍然 500**。随后 `git stash pop` 恢复（diff 回到 +12/−8，stash list 为空）。这证明 500 与 A2 改动**无关**。

**日志佐证**：`logs/dev.log` 首次出现该错误在 `14:02:17.521`，共 8 次；但同一时段**同一页面 200 与 500 交替出现**——`14:03:39.139 GET /robust/robust-stability 200`、`14:03:48.599 GET /intelligent/neural-network-control 200`，与 `14:03:48 GET /intelligent/neural-network-control 500`、`GET /robust/robust-stability 500` 并存。200 来自主服务进程，500 来自 `static-paths-worker`（跑 `generateStaticParams` 的 jest-worker 子进程），两者用的 chunk 图不一致，正是缓存半写坏的特征。

**处置**：kill 整棵进程树（`npm run dev` 15508 → 12104 → `serve.mjs` 23096 → `next dev` 16232 → `start-server` 7160，连带 Jupyter PID 396）→ 确认 8080 释放 → `rm -rf .next` → `npm run dev` 重启 → 三页恢复 200。`logs/dev.log` 是追加式的，重启未丢失上述证据。

**为什么值得记入诊断报告**：这是项目记忆中已登记的 Windows 复发问题第二次被实测确认，而它直接攻击 A2/A3–A8 都要用的验收手段。**缓存损坏时"curl 200"会给出假阴性**：页面 500 而源码无恙，若不做 stash 对照，极容易误判成"我刚改的东西引入了回归"并去回滚正确的改动。因此后续每个条目的验收都应当：① 遇到 500 先读响应体里的 `err.message` 判断是源码错还是 chunk 错；② 用定向 `git stash push -- <file>` 做归因实验，再决定是否重建缓存。这是 P11"门槛存在但不可靠"的又一例证。

---


## 附：本报告引用的全部行号索引

以下每一条均在 2026-09-25 用 `grep -n` 对当前工作区文件逐条复核过；Q1 / Q2 执行后（见第 9 节）已按 `catalog.ts` 933 → 930 → 925 行的两次位移**全量重编号并再次复核**（523 个 `L<n>` 令牌，317 个改写，0 个越界）。

**下表行号钉在 925 行基线。** A2 又新增 9 行类型定义使文件变为 934 行，故下表 **L18 及以后一律 +9** 才是当前工作区行号；接口块 3 行已就地标注现值。换算表见 [0.2](#02-行号基准)，不重编号的理由同见该节。

### `content/catalog.ts`（925 行基线；A2 后为 934 行）

| 行号 | 内容 |
|------|------|
| L6–L10 | `LessonMeta` 接口定义（诊断当时仅 slug / title / subsections 三字段）→ **A2 后为 L6–L17**，7 字段 |
| L12–L16 | `Chapter` 接口定义 → **A2 后为 L19–L25**，4 字段 |
| L18 | `export const catalog` → **A2 后为 L27** |
| L20, L39, L227, L390, L492, L584, L704, L830, L884, L898, L912 | 11 个章的起始行（math / classic / modern / robust / computer-control / mpc / nonlinear / intelligent / rl-control / discrete / multi-agent） |
| L24, L27–L33 | `complex-numbers` 课及其 7 个小节 |
| L96, L169 | `frequency-domain-analysis` / `frequency-response` 课 |
| L103, L177 | 小节 `频域指标与时域指标的对应` ×2 |
| L112, L130, L149 | `root-locus` / `pid-controller` / `stability-analysis` 课 |
| L159, L176 | 小节 `从频域看稳定性` / `稳定性判据` |
| L161, L179 | 时滞相关 2 个小节 |
| L174 | 小节 `在Bode图上读取裕度` |
| L181 | 小节 `工程应用：Ziegler-Nichols整定法` |
| L189, L207 | `compensator-design` / `classic-case-study` 课 |
| L210, L211, L217 | `classic-case-study` 的 `问题描述` / `建立被控对象模型` / `工程实现细节` |
| L231, L238 | `state-space` 课 / 小节 `状态方程的求解` |
| L247, L253 | `controllability-observability` 课 / 小节 `对偶原理` |
| L276, L281 | `state-observer` 课 / 小节 `对偶原理` |
| L291, L296, L297 | `optimal-control-basics` 课 / 小节 `变分法：对泛函求极值` / `Hamilton 函数与极小值原理` |
| L307, L312, L314 | `lqr-controller` 课 / 小节 `无穷时间 LQR——代数 Riccati 方程` / `Q 和 R 的选择` |
| L323, L327, L333 | `kalman-filter` 课 / 小节 `随机系统模型` / `Q 和 R 的选择` |
| L341, L344–L348 | `linear-system-theory` 课及其 5 个 Lyapunov 小节 |
| L370, L373 | `modern-case-study` 课 / 小节 `问题描述` |
| L393, L405, L416 | `robustness-concept` / `h-infinity-basics` / `mixed-sensitivity` 课 |
| L421, L434, L470, L500, L523 | 小节 `设计实例` ×5 |
| L427, L433 | `mu-synthesis` 课 / 其内小节 `不确定性建模` |
| L440, L443 | `robust-stability` 课 / 小节 `Lyapunov方法：二次稳定性`（原 L443 的 `Kharitonov定理` 条目已由 Q2 删除，见 9.2） |
| L452 | `uncertainty-modeling` 课（整课，与 L433 小节同名） |
| L464, L476, L477–L487 | `robust-performance` / `robust-case-study` 课 / 其 11 个小节（Q2 后与 MDX 的 11 个 H2 一一对应；原 5 个降级为 H3 的条目已删除，见 9.2） |
| L492–L577 | `computer-control` 章：`sampling-quantization` L495、`z-transform-basics` L506、小节 `差分方程实现` L513、`digital-controller-design` L519、`discrete-stability` L529、`digital-pid` L540、`sampling-period` L550、`computer-control-architecture` L559、`realtime-control` L570 |
| L584, L591, L597, L602 | `mpc` 章起始 / 小节 `稳定性分析` / `prediction-model` 课 / 小节 `模型辨识基础` |
| L609, L622 | `receding-horizon` / `constraint-handling` 课 |
| L630, L656, L661, L662, L676, L678, L679, L680, L692, L694, L695 | 小节 `交互式可视化` ×3、`数值例子` ×3、`工业应用` ×3、`软件工具` ×2 |
| L636, L637, L638, L644 | `mpc-case-study` 课及其 `问题描述` / `建立被控对象模型` / `工程实现细节` |
| L668 | `nonlinear-mpc` 课 |
| L707, L720, L751, L766, L783, L798, L812 | `nonlinear` 章各课：`nonlinear-characteristics` / `phase-plane` / `lyapunov-stability` / `feedback-linearization` / `sliding-mode-control` / `backstepping` / `adaptive-control-basics` |
| L729, L743, L760, L791, L805, L820, L840 | 小节 `应用案例` ×7 |
| L732, L746, L778, L793, L807, L822, L842 | 小节 `局限性讨论` ×7 |
| L792, L806, L821 | 小节 `与其他非线性控制方法的对比` ×3 |
| L804, L819 | 小节 `处理参数不确定性` ×2 |
| L833, L847, L863 | `intelligent` 章已写三课：`fuzzy-control-basics` / `fuzzy-controller-design` / `neural-network-control` |
| L858, L872 | 小节 `工程实践要点` ×2 |
| L864–L875 | `neural-network-control` 的 12 个小节（Q1 已恢复 HEAD，与 MDX 的 12 个 H2 一致；被丢弃的回归大纲见 6.3） |
| L866, L867, L868 | 小节 `前馈神经网络：结构与万能逼近` / `监督学习：用NN模仿PID` / `直接优化：让NN超越PID` |
| L877, L878, L879, L880 | `intelligent` 章 4 门空课：`expert-system` / `genetic-algorithm` / `fuzzy-neural-network` / `intelligent-case-study` |
| L884–L897 | `rl-control` 章（8 课，零 subsections），含 `multi-agent-rl` L894 |
| L898–L911 | `discrete` 章（8 课，零 subsections、零 MDX）：`discrete-time-systems` L901、`difference-equation` L902、`z-transform-analysis` L903、`discrete-stability-criteria` L904、`digital-controller` L905、`discrete-optimal-control` L906、`sampled-data-systems` L907、`discrete-case-study` L908 |
| L912–L924 | `multi-agent` 章（8 课，零 subsections），含 `multi-agent-rl` L922 |

### 其他文件

| 文件 | 行号 | 内容 |
|------|------|------|
| `content/robust/robust-stability.mdx` | L68 | `### Kharitonov 定理`（H3，非 H2） |
| `content/robust/robust-case-study.mdx` | L30, L43, L69, L83, L242 | 5 个降级为 H3 的小节 |
| `content/intelligent/neural-network-control.mdx` | L8, L22, L42, L197, L355, L480, L623, L751, L785, L820, L832, L844 | 实际 12 个 H2 |
| `components/wiki/bode-margins-explorer.tsx` | L97 | `export function BodeMarginsExplorer`（孤儿组件） |
| `components/wiki/fuzzy-tuning-explorer.tsx` | L149 | `export default function FuzzyTuningExplorer` |
| `components/wiki/neural-network-explorer.tsx` | L82 | `export default function NeuralNetworkExplorer` |
| `.qoder/delivery-tracker.md` | 底部统计行 | 声明"17 / 83 课程已完成（33个交互组件已交付）"；L115 为 `neural-network-control` 行 |
| `.qoder/fix-logs/INDEX.md` | 全表 18 行 | 表头 `# \| 日期 \| 文档 \| 章节 \| 类型 \| 摘要`，无归因列 |
| `OUTLINE.md` | L142–L145 | 声明 10 章 / 79 模块 / 已完成 1 / 待编写 78 |
| `.qoder/skills/wiki-discussion/SKILL.md` | L272–L282 | 数学基础章节引用规则 |
| `.qoder/skills/wiki-discussion/personas.md` | 方数条目"擅长话题" | 7 项数学主题 |

#### 第 9 节新增引用（Q1 / Q2 / A2 执行与 N13–N16）

| 文件 | 行号 | 内容 |
|------|------|------|
| `components/wiki/sidebar.tsx` | L118 | ``href={`/${lessonKey}#${sub.slug}`}``——侧栏锚点直接取 catalog 的 `sub.slug`，这是 N13 的传导路径 |
| `components/wiki/table-of-contents.tsx` | L52 | ``href={`#${h.id}`}``——右侧目录取**真实渲染出的**标题 id，因此不受 N13 影响 |
| `lib/content.ts` | L8, L91 | `import rehypeSlug from "rehype-slug"` / `rehypeSlug as any`——标题 id 的生成来源（底层即 `github-slugger`） |
| `content/mpc/mpc-principle.mdx` | L54 | `$$\boxed{\begin{aligned}`——N14 截断根因之一 |
| `content/mpc/receding-horizon.mdx` | L65 | `$$\boxed{\begin{aligned}`——N14 截断根因之二 |
| `content/modern/state-space.mdx` | L75–L82 | 正确写法对照：`$$` / `\boxed{` / `\begin{aligned}` 分三行 |
| `content/modern/optimal-control-basics.mdx` | L45–L54 | 正确写法对照（同上） |
| `content/nonlinear/nonlinear-characteristics.mdx` | L52–L57 | 正确写法对照（同上） |
| `content/mpc/distributed-mpc.mdx` | L407 | ``...`}]} />``——JSX 收尾 `/>` 不在独立行上，解析脚本的终止条件必须按"行尾"而非"整行"判断 |
| `components/wiki/nyquist-limit-cycle-explorer.tsx` | L15, L17, L18, L20, L21, L153, L162, L184 | N15 的 8 个 ESLint error：5 个未使用变量 + 3 个 `no-explicit-any` |
| `components/wiki/nonlinearity-explorer.tsx` | L481 | N15 的 2 个 error：未转义的 `"`（`react/no-unescaped-entities`） |
| `components/wiki/describing-function-explorer.tsx` | L97 | N15 的 1 个 error：`no-explicit-any` |
| `components/wiki/phase-plane-explorer.tsx` | L402 | N15 的 1 个 error：未使用变量 `ys` |
| `app/(wiki)/page.tsx` | L1, L12, L21 | catalog 消费方之一，只读 `ch.slug` / `ch.title` / `ch.lessons` / `l.slug` / `l.title` |
| `app/(wiki)/[chapter]/[lesson]/page.tsx` | L4, L8 | catalog 消费方之二，`generateStaticParams` 只取 `ch.slug` + `l.slug` |
| `components/wiki/sidebar.tsx` | L3, L14, L57 | catalog 消费方之三——**A2 推荐 Prompt 的"涉及文件"漏列了它**，实测补上；另读 `l.subsections` |
| `lib/content.ts` | L51 | 本地另有一个**同名** `export interface LessonMeta { title; description }`（MDX frontmatter 用），与 `catalog.ts` L6 的同名接口无 import 关系，故不冲突但易混淆 |
| `components/ui/badge.tsx` `button.tsx` `scroll-area.tsx` `separator.tsx` `sheet.tsx` | L1–L4 | `@base-ui/react` 的 5 个实际引用方——N16 中缺失的 vendor chunk 正是这个包 |
| `.next/server/vendor-chunks/` | 仅剩 `@swc.js`、`next.js` | N16 根因：`webpack-runtime.js` 要 require 的 `@base-ui.js` 未被生成 |
| `logs/dev.log` | 首次错误 `14:02:17.521`，共 8 次 | N16 时间线证据：同一页面 200 与 500 交替（`14:03:39` robust 200 / `14:03:48` robust 500） |
| `scripts/serve.mjs` | L38–L68, L72–L86 | 同一进程内先拉起 Jupyter（8891）再拉起 Next（8080），故重启 dev server 会连带重启内核 |

---

**本报告完。** A1、A2、A3、A4、A5 已交付（见 9.1 / 9.2 / 9.6；A3 的执行快照与 Q10–Q14 裁决、A4 与 A5 的执行快照记在 `.qoder/semester-02-plan.md` 的对应条目注解中；A4 的产出物是 `docs/semester-02/02-math-dependency-map.md`）。**自 A3 起本报告冻结**：后续阶段的新发现一律记入 plan 的对应条目注解，不再回写本报告（避免 A1 曾发生的全量重编号自伤）。**P3（章节顺序违反依赖关系）已于 A5 关闭**：catalog 数组按 §2.0 学习路径全量重排为 16 章、`order` 重编号 0..15，11 个既有章块经脚本 diff 证明除 `order:` 行外字节不变。**站点规模随 A5 变为 16 章 / 140 课**，其中 84 门为 `status: "empty"` 骨架课，由 `app/(wiki)/[chapter]/[lesson]/page.tsx` 渲染"本课尚未编写"占位页（Q16 裁决，inline style + prereq 链接），不再 404；本报告中所有行号与"11 章 / 103 课"一类的规模数字均为 A5 之前的时点值。下一步：**A6**（章内课程重组与 MDX 迁移：`modern/kalman-filter` → `estimation/`、`rl-control/safe-rl` → `safety-ftc/`、`rl-control/multi-agent-rl` → `multi-agent/`，并把 multi-agent 章标题改为 §2.0 的"多智能体与分布式控制"）。仍悬置的裁决：**Q3 / Q4 / Q5 / Q6**（第 8 节）——其中 **Q6 是读者可见损失最大的一项**（两门 mpc 课正文只剩 1/8 与 2/11），建议优先处理；**Q7 已解决**（2026-09-25，作为 A3 的独立前置改动）；**Q14** 仍为 **5 处**（A4 修掉了 `feedback-linearization` 的 `/math/linear-algebra`，剩余 5 处全在 classic 章：3 处 `/classic/pid-control`、2 处死锚点）；A4 第 4 步的 284 行 `📐` 引用批量插入清单仍等用户确认。



