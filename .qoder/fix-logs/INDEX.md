# Wiki修复日志索引

| # | 日期 | 文档 | 章节 | 类型 | 归因角色 | 摘要 |
|---|------|------|------|------|------|------|
| 001 | 2026-09-22 | classic/time-domain-analysis.mdx | 一阶系统的阶跃响应 | BOTH | 苏绘+何仿（清单缺项） | 缺少动态控件→新增FirstOrderStepExplorer交互组件，拖动T滑块感受各指标含义 |
| 002 | 2026-09-22 | classic/time-domain-analysis.mdx | 一阶系统的阶跃响应 | BOTH | 苏绘+何仿（清单缺项） | 横坐标轴动态缩放→改为固定范围(30s)，让T/3T/4T标注线随参数变化而移动 |
| 003 | 2026-09-22 | classic/time-domain-analysis.mdx | 一阶系统的阶跃响应 | BOTH | 苏绘+何仿（清单缺项） | 标注线渐入动画→禁用animation，拖动时即时响应无闪烁 |
| 004 | 2026-09-22 | classic/system-modeling.mdx | 阻尼的关键作用 | BUG | 苏绘+何仿（清单缺项） | ipywidgets不可用→改用React交互组件SuspensionExplorer，带ζ滑块实时响应 |
| 005 | 2026-09-23 | transfer-function, time-domain-analysis | StepBodeExplorer/ImpulseExplorer/SuspensionTimeExplorer/PoleZeroExplorer | BUG | 苏绘+何仿（清单缺项） | 四个组件违反Fix-002（动态坐标轴）→改为固定xAxis/yAxis常量，确保曲线在稳定参考系中移动 |
| 006 | 2026-09-23 | classic/frequency-domain-analysis.mdx | 频域分析 | BOTH | 苏绘+何仿（清单缺项） | 4个ipywidgets笔记本→转为React组件（BodeZetaExplorer/NyquistZetaExplorer/BandwidthCorrespondenceExplorer/RCFilterBodeExplorer），符合Fix-002/003/004 |
| 007 | 2026-09-23 | classic/root-locus.mdx | 增益 K 如何影响阶跃响应 | BUG | 苏绘+何仿（清单缺项） | ipywidgets不可用→改用React交互组件RootLocusKExplorer，带K滑块展示过阻尼/分离点/欠阻尼/临界稳定/不稳定五种状态，固定时间轴(0-10s)，禁用动画 |
| 008 | 2026-09-23 | classic/pid-controller.mdx | PID控制器参数调节 | BUG | 苏绘+何仿（清单缺项） | 2个ipywidgets笔记本→转为React组件（PidDerivativeFilterExplorer单Tf滑块+PidKiKdExplorer双Ki/Kd滑块），固定坐标轴，禁用动画 |
| 009 | 2026-09-23 | classic/stability-analysis.mdx | 系统稳定性分析 | BUG | 苏绘+何仿（清单缺项） | 2个ipywidgets笔记本→转为React组件（StabilityThirdOrderExplorer单a2滑块展示三阶系统稳定域+StabilityDelayExplorer单K滑块展示时滞稳定性），固定坐标轴，禁用动画 |
| 010 | 2026-09-23 | classic/compensator-design.mdx | 校正网络设计 | BUG | 苏绘+何仿（清单缺项） | 4个ipywidgets笔记本→转为React组件（LeadCompensatorExplorer单K滑块展示超前校正Bode图+LagCompensatorExplorer单K滑块展示滞后校正Bode图+LeadLagCompensatorExplorer单K滑块展示超前-滞后校正+AntiWindupExplorer单u_limit滑块展示抗饱和仿真），固定坐标轴，禁用动画 |
| 011 | 2026-09-23 | components/wiki/jupyter-notebook.tsx | 全站（多Notebook课程页） | BUG | 秦构（B1 新设） | 同页多个Notebook的kernel id都是`nb-<时间戳>-0`（useRef计数器是每实例的）→共用一个内核命名空间、变量互相覆盖，报出与本页代码无关的ValueError；改为模块级`nbSeq`生成唯一id |
| 012 | 2026-09-24 | content/nonlinear/backstepping.mdx | 全站（多行display math） | BUG | 苏绘+何仿（清单缺项）※Q24 | 多行公式把内容写在开/闭`$$`同一行（`$$\begin{aligned}`、`\end{aligned}$$`）→remark-math吞首行/不闭合，其后全文被当成一个数学块以katex-error原文渲染；规范化为`$$`独占开/闭行，并给浏览器验收加"h2数==catalog小节数、katex-error==0"两条断言 |
| 013 | 2026-09-24 | content/intelligent/fuzzy-control-basics.mdx | 全站（JupyterNotebook 组件写法） | BUG | 秦构（B1 新设） | `setupCode={`...`},` 收尾带逗号在 JSX 里非法（属性间只能用空白分隔）→next-mdx-remote 编译抛错、getLesson throw、页面表现为 404 而非 500；本地 Python harness 不解析 MDX 故抓不到。全文去掉 8 处逗号，并把"页面 200 且 h2 数==catalog"列为交付硬门槛 |
| 014 | 2026-09-25 | components/wiki/nyquist-limit-cycle-explorer.tsx | 全站（交互组件与正文手算例配对） | BOTH | 柯验（B1 新设） | 组件 -1/N(A) 轨迹从 A=1.05 起（继电器分支共用该下限）→ 默认参数下画不出正文手算例的交点 A0=4/(3π)=0.4244；交点检测只算 Nyquist 穿越点、不检查轨迹覆盖 → 不存在极限环时也误报。修法：轨迹起点按类型分开（relay 从 0.02）、默认改 relay、加覆盖性判据+二分反解 A/插值反解 ω、legend 随交点存在性变化 |
| 015 | 2026-09-25 | lib/content.ts | 全站（新增交互组件的课程页） | BUG | 秦构（B1 新设） | 组件注册表有两份：mdx-components.tsx 与 lib/content.ts 的 compileMDX components 映射，课程页走后者且显式传参会覆盖前者→只改 mdx-components.tsx 时页面 500 "Expected component X to be defined"；新增组件必须两处同改，并以 curl 课程页 200 为交付门槛。**E2（2026-09-26）已根治**，机制改为单一来源 `lib/wiki-components.ts`，见下方《根治记录 015》；本行「显式传参会覆盖前者」这句机制描述经实测**不成立**（真实原因是 `mdx-components.tsx` 对课程页从未生效），更正也记在那里 |
| 016 | 2026-09-25 | components/wiki/phase-plane-explorer.tsx | 相平面分析（Van der Pol 读数） | BUG | 柯验（B1 新设） | rk4 按 keep=round(steps/1200) 抽稀后返回，过零事件下标是输出点不是积分步，用 T/steps 换算时间使周期小 keep 倍（0.319 vs 6.381 s）→改用 dtStored=T/(len-1) 自洽换算，读数回到 6.380664 s 与 Notebook 1 一致 |
| 017 | 2026-09-25 | content/nonlinear/nonlinear-characteristics.mdx | 全站（JupyterNotebook cell 拼接流程） | BUG | 秦构（B1 新设） | 拼接脚本的占位符 `%%NBn%%` 经过一层 `%` 格式化被折叠成 `%NBn%`，9 个 cell 首行由 `# 注释` 变成 `%# 注释` → IPython 当成 line magic，一运行就 `UsageError: Line magic function '%#' not found`；改回 `#` 并新增"MDX cell 与 harness cell 字符串全等"校验脚本作为交付门槛 |
| 018 | 2026-09-25 | components/wiki/nonlinearity-explorer.tsx | 非线性系统特性（间隙环面积读数） | BUG | 柯验（B1 新设） | 有记忆非线性预热循环停在 t=6π（u≈0，下降支），上升支扫描却从 u=-A 起，prevY 带着 +b 残留把上升支钉高 1.0 → 环面积 0.520000 而手算 0.84（max\|y-u\| 仍正确，最难发现）；预热末相位改为与扫描起点重合 θ=-π/2，面积回到 0.839999 |

## 归因角色列说明（B8 起）

| 标记 | 含义 | 改进方向 |
|------|------|----------|
| `（B1 新设）` | 出 bug 时该角色尚未设立，B1（2026-09-25）才新增 | 新增角色 |
| `（清单缺项）` | 出 bug 时该角色已存在，但其检查清单里没有这一项 | 补清单 |
| `※Qn` | 该条归因存在跨文件冲突，n 是待裁决问题编号 | 见下方裁定 |

两种标记不可混写：前者说明缺人，后者说明缺规范，混在一起会让「该加人还是该加检查项」的判断失效。

- 归因口径、回顾表格式、触发条件 T1/T2/T3、第一次归因回顾结果、18 条的类别级明细（拦截缺口 + 清单更新），全部见 `.qoder/skills/fix-tracker/SKILL.md`《归因回顾机制（B8 起）》。本文件只存结论标记，不存论证。
- `※Q24`（012 条）：`semester-02-plan.md` §0.3 把 012 归给苏绘+何仿，但 B6 已把 012 的检查项写进秦构的清单。B8 保留 §0.3 口径并就地标记冲突，裁定候选见 SKILL.md《归因回顾机制》§6。
- 本表为正序（001 在顶、最新在底），新条目追加到表尾。B8 之前 SKILL.md 写的是「顶部插入（最新在前）」，与实况相反，已更正。
- 另有 2 条已发生但尚未建档的返工（`useECharts` hydration 崩溃、组件已注册却未被正文引用）在 SKILL.md《归因回顾机制》§5 预登为 019 / 020，归因均为秦构；补建详情文件时同步在此追加两行，届时总数 18 → 20。**（E2 2026-09-26 更新：仍未建，且不能照原文建——§5 对这两条的表述已被实测推翻，详见下方《根治记录 015》的"遗留与移交"。）**

## 根治记录 015（E2 · 2026-09-26）· 组件注册双表 → 单一来源

**归因角色：秦构**

### 现在的机制

组件映射只有一个来源：`lib/wiki-components.ts` 导出的 `wikiComponents`（37 个键，覆盖 `components/wiki/` 下全部被正文引用的交互组件，外加 `JupyterNotebook` 与 `Callout` 两个基础设施组件）。两个消费方都只从它导入并展开：

- `lib/content.ts` 的 `compileMDX` 传 `components: { ...wikiComponents, ...extraComponents }` —— 课程页真正走的路径；
- `mdx-components.tsx` 的 `useMDXComponents()` 返回 `{ ...wikiComponents, ...components }` —— `@next/mdx` 的约定入口。

新增组件从此只改一处：在 `lib/wiki-components.ts` 里加一行 import、加一行键名。原来那句"新增组件必须两处同改"的纪律作废。

### 原记录的机制描述错在哪（B5：叙述服从测量）

015 行写的是"课程页走后者且显式传参会覆盖前者"。实测不成立，有两条各自独立的原因：

1. `next-mdx-remote@4.4.1` 的 RSC 路径在 `node_modules/next-mdx-remote/dist/rsc.js` 里显式写了 `providerImportSource: rsc ? undefined : '@mdx-js/react'`，注释是 "Disable the importSource option for RSC to ensure there's no `useMDXComponents` implemented."；随后 `compileMDX` 用 `React.createElement(Content, { components })`，而 `components` 默认 `{}`。**`useMDXComponents` 根本不会被调用**，谈不上"被覆盖"。
2. `next.config.mjs` 虽然接了 `@next/mdx`（`createMDX`）且 `pageExtensions` 含 `mdx`，但仓库里 `content/` 之外没有任何 `.mdx` 文件、也没有任何模块 import 一个 `.mdx`，所以 `@next/mdx` 无对象可作用，`mdx-components.tsx` 也就永远不会被启用。

即当时的"双注册表"其实是"一份活的 + 一份死的"。症状（只改 `mdx-components.tsx` → 页面 500）是真的，机理判断是错的。**这条错判有实际代价**：它让人以为"只要两处都写就安全"，从而掩盖了"`mdx-components.tsx` 写什么都没用"这个事实；Q3 孤儿组件的登记状态也因此被误记为"已在两个注册表里注册"（更正见 plan 的 E1 批注 ⑤）。

### 为什么保留 `mdx-components.tsx` 而不是删掉

它是 `@next/mdx` 的约定入口，一旦有人新增一个 `.mdx` 页面就会立刻生效。删掉等于把"已知无效"换成"将来静默失效"；保留并让它共享同一来源，两条路径都成立。文件顶部已写明这一点、以及它当前为什么不生效。

### 为什么 `lib/wiki-components.ts` 禁止加 `"use client"`

加了以后这个导出对象本身会变成一个 client reference，服务端 `lib/content.ts` 里的 `{ ...wikiComponents }` 展开就拿不到各个组件 → 引用任何自定义组件的页面 500。各 explorer 自己带 `"use client"`（`components/wiki/` 下 44 个 `.tsx` 里 42 个带，例外是 `callout.tsx` 与 `lesson-nav.tsx`），中立模块 re-export 它们得到的正是 `compileMDX` 需要的 client reference 形态。**因此 Prompt 第 4 步设想的"client / server 边界导致无法单一来源"并未发生，退化方案没有启用**：交付的是真的单一来源，不是自动一致性检查。这条禁令已写进 `lib/wiki-components.ts` 的头部注释，并由机检守住（见下）。

### 机检（三处，都是 FAIL 级）

| 位置 | 核什么 | 级别 |
|------|--------|------|
| `scripts/verify-lesson.mjs` 第 4 项 | 本课 MDX 引用的自定义组件是否都登记在单一来源；单一来源是否存在且导出 `wikiComponents` | 按课 FAIL |
| `scripts/verify-lesson.mjs` 末尾《附 · 组件注册结构》 | 单一来源存在、有 `export const wikiComponents`、不带 `"use client"`；两个消费方都导入并展开、无 `components/wiki/*` 内联残留 | `--all` 与 `--delivered` 计入退出码，单课运行只提示 |
| `scripts/check-catalog.mjs` 第 5 节 | 单一来源覆盖 MDX 引用的全部组件名、不带 `"use client"`、两个消费方正确消费 | FAIL，`npm run check` 退出码 1 |

结构类缺陷放在全仓附录而不是按课报，是因为一个结构缺陷会让 56 门课全部 FAIL、把健康度分级彻底污染（自行裁定）。

### 负向验证（A7：只对着干净的当前仓库跑等于没测）

对 `.qoder/e1-fixture/` 注入 5 类缺陷，逐条确认门槛会响：

| 注入 | 期望 | 实测 |
|------|------|------|
| 4 单一来源漏登记 `BadExplorer` / `HalfExplorer`，而 `bad-lesson.mdx` 引用了它们 | 第 4 项 FAIL | FAIL「组件已实现且被本课引用，却没登记进单一来源」；对照组 `fx/good-lesson` 第 4 项仍 PASS、退出码 0 |
| A 单一来源文件被删 / 改名 | 第 4 项 FAIL + 附录 FAIL | 两处都报；`check-catalog.mjs` 第 5 节同样 FAIL |
| B 单一来源带 `"use client"` | 附录 FAIL | 报出完整因果（client reference → 展开拿不到组件 → 500）；`check-catalog.mjs` 同口径 FAIL |
| C 消费方导入了却没展开 | 附录 FAIL | 报「映射为空，引用任何自定义组件的页面都会 500」 |
| D 消费方不导入、退回内联 | 附录 FAIL | 报「注册表又分叉了（fix-015）」；B+C+D 叠加跑 `--all` → 附录 5 条、退出码 1 |

fixture 的 `mdx-components.tsx` 常驻保留一条内联 import（注入 4b），使"内联残留"这条检查每次跑 fixture 都被行使。顺带修掉一个误报：消费方**没有**导入时，原逻辑会同时报「导入了却没展开」，已改成 `else if`（变异 D 单发实测只报一条）。

### 验收实测

- `npm run build`：退出码 0，146 个静态页全部预渲染。**这一步本身就是最强的注册表证明**——SSG 逐课执行 `compileMDX`，任何组件缺登记都会在构建期抛 "Expected component … to be defined"，不可能悄悄过去。
- 5 门含交互组件的页（`nonlinear/phase-plane`、`nonlinear/describing-function`、`intelligent/fuzzy-control-basics`、`classic/time-domain-analysis`、`nonlinear/adaptive-control-basics`）：**生产构建下 curl 全 200**（dev 下亦全 200），11 个交互组件逐个在 HTML 里 grep 到"非正文来源"的特征文案（判据：该串出现在组件源码、出现在 HTML、且不作为散文出现在本课 MDX 里；组件标签 props 内的串不算散文，因为它本来就是组件的标题）。5 页 katex 均在、h2 锚点均在、"Expected component" 命中 0 次。
- 非回归：`npx tsc --noEmit` 退出码 0；`npm run check` PASS 17 · WARN 36 · FAIL 0（计数与 A7 起逐字一致，但第 5 节的判据已从"两个注册表 key 集合相等"换成实质检查）；`npm run verify -- --delivered` 19 门 / 171 项 / PASS 149 · WARN 20 · FAIL 2 · SKIPPED 0（与 E1 逐项一致）；`npm run verify:all` 56 门 / 504 项 / PASS 399 · WARN 77 · FAIL 28 · SKIPPED 0，健康度 A 3 / B 29 / C 19 / D 5（与 E1 逐项一致）。

### 顺带发现：`npm run check` 的 fix-015 门槛会静默空转

只按 Prompt 改 `mdx-components.tsx` 与 `lib/content.ts` 之后，`check-catalog.mjs` 第 5 节原有的 `halfReg` 判据（比较两个注册表的 key 集合）会打印"被引用的交互组件在两个注册表中均已登记（fix-015）"而**实际什么都没比**：它的 `registryNames()` 只匹配花括号形式的 import，重构后两个文件都只 `import { wikiComponents }`，解析出的集合是空的，空集合之间当然"同步"。一个 FAIL 级门槛在底层结构变化后变成恒真 PASS，比没有门槛更危险。已重写第 5 节为实质检查（单一来源覆盖率 + `"use client"` + 两个消费方的导入/展开/内联残留），并用注入 A / B 验证它会响。**这属于 Prompt 涉及文件清单之外，是自行裁定扩的范围**；不扩就等于交付一个假绿门槛。

### 归因三字段（B8 起必填）

- **本该拦住它的角色**：秦构。组件注册结构属前端架构，`personas.md` 里秦构的职责清单含"新增组件已在 mdx-components.tsx 与 lib/content.ts 两处注册"。
- **拦截缺口**：那一条是**靠人记忆执行的纪律**，没有任何机器检查。A7 的 `check-catalog.mjs` 第 5 节虽已把"双注册表不同步"写成 FAIL，但判据依赖两个文件里花括号 import 的字面形态，底层一改就空转（见上一节）。纪律型清单条目在结构变化时会静默失效——这是 015 从"记录在案"到"根治"隔了一整个学期的真实原因。
- **清单更新**：① `personas.md` 秦构清单里那条"两处注册"应改为"单一来源 `lib/wiki-components.ts` 登记一处"（E2 未改 `personas.md`，登记为移交项）；② plan 检查清单里"新增组件已在 mdx-components.tsx 与 lib/content.ts 两处注册（E2 后为单一来源）"那一行的注脚自此生效；③ 新增一条通用教训：**清单里凡是"两处同改"这类纪律条目，都该先问能不能用结构消掉；消不掉的，必须写一个不依赖字面形态的机检，否则它会在下次重构后变成恒真 PASS**。

### 遗留与移交

- `personas.md` 秦构清单的"两处注册"条目未同步（E2 只动了 Prompt 点名的文件 + 3 处自行裁定扩的文件）。
- `check-catalog.mjs` 与 `verify-lesson.mjs` 现在各存一份单一来源解析逻辑（`singleSourceKeys` / `parseSingleSource`），与 `parseCatalog` 的两份副本同病，**E3 应一并抽到 `scripts/lib-catalog.mjs`**。
- **B8 遗留项 019 / 020 的详情文件仍未建**，E2 有意没顺手做（自行裁定）：SKILL.md《归因回顾机制》§5 对这两条的表述已被 E1 / E2 的实测推翻——020 写"组件实现并注册后忘了在 MDX 里引用，现存活实例 = `bode-margins-explorer.tsx`"，而实测该组件在两个注册表里各命中 0 次、**从未被登记**；019 写实例出自 `intelligent/fuzzy-controller-design`，而 E1 抓到的活实例在 `describing-function-explorer.tsx:67` 与 `nyquist-limit-cycle-explorer.tsx:137`（`nonlinear/describing-function` 用）。照原文誊进详情文件等于新造两条假记录，须先更正 §5 再建档。

## 根治记录 017（E3 · 2026-09-26）· cell 拼接与保真度 → 工具化判据

**归因角色：秦构**

### 现在的机制

`scripts/nb-cells.mjs` 一个工具、三个子命令，占位符统一为不含 `%` 的 `<<NBn>>`：

| 子命令 | 做什么 |
|--------|--------|
| `extract <目标>… [--out f.json]` | 把每个 `JupyterNotebook` 的 `setupCode` 与 `cells` 抽成 JSON，附组件 id、kernel id 生成方式、逐块的转义失真清单 |
| `verify <目标>…\|--all\|--delivered` | 静态判据 S0–S8；内核在 8891 上活着就把每个 cell 真跑一遍（S6），不在就明说 SKIPPED 并给启动方法 |
| `assemble <json> [--out f] [--skeleton]` | 从 JSON 生成 JSX 片段，并对生成结果做**反向校验**（重新 extract 后与源 JSON 逐字全等；不等就拒绝产出） |

`package.json` 新增 `"nb:verify": "node scripts/nb-cells.mjs verify --all"`。三个脚本（`nb-cells` / `verify-lesson` / `check-catalog`）现在共用 `scripts/lib-mdx.mjs` 与 `scripts/lib-catalog.mjs`，E2 移交的 `parseCatalog` / 单一来源解析重复副本一并清掉。负向测试夹具 `.qoder/e3-fixture/`（7 组）是**仓库产物**，不是临时文件。

### 核心口径：比对与执行都用「求值后」的字符串

这是本条根治的要点，也是 017 原记录没写到的部分。cell 代码写在反引号里，浏览器先按 **JS 模板字面量**求值，再把结果 POST 给内核。所以 **MDX 字面 ≠ 内核收到的代码**：`\n` 会变真换行、`\lambda` 会掉反斜杠、`\\n` 才是字面的 `\n`。E3 实测：529 个代码块里 **80 个（15.1%）**存在这种差异。

017 当时补的门槛是「MDX cell 与 harness cell 字符串全等」，但 harness 的 cell 也是从同一份 MDX 抽的——**两边被同一套解析污染时恒为全等**。原记录自己写着当时 `9/9 ALL MATCH` 而 bug 照样上线。所以根治必须换掉比对口径（对求值后的串判）并加一条独立证据（真跑内核）。

### 判据表

| 判据 | 查什么 | 级别 | 对应事故 |
|------|--------|------|---------|
| S0 | 结构：缺 `setupCode` / `setupCode` 是空串 / 缺 `cells` / 模板未闭合 / 属性解析失败 | FAIL | 空串这一条是 E3 新增：服务端 `body.get("setup_code", DEFAULT_SETUP)` 的默认值**只在键缺失时**生效，键在而值为空串等于显式要求「什么都别 setup」，第一个 cell 就 NameError。实测现网 182 个 notebook 里空串 0 个、纯空白 0 个、无 import 行 0 个 → 加它对现网输出零回归，属预防性收口 |
| S1 | 求值后首行不得是 IPython line magic | FAIL | **fix-017 本体** |
| S2 | 不得出现 ipywidgets 家族 | FAIL | 轻量内核不渲染 widget |
| S3 | JSX 属性之间不得有逗号 | FAIL | **fix-013**（页面 404） |
| S4 | 不得残留拼接占位符 `%%NBn%%` / `%NBn%` / `<<NBn>>` | FAIL | **fix-017 本体** |
| S5 | 模板字面量保真度：掉反斜杠 / 行连接 / `${` 插值 → FAIL；`\n` `\uXXXX` 等求值差异 → WARN | FAIL/WARN | E3 新发现的一类 |
| S6 | 每个 cell 真跑内核，error 输出 → FAIL；非良性 stderr → WARN；良性噪声折叠成一条 | FAIL/WARN | 唯一能抓住「页面 200、点运行才炸」的判据 |
| S7 | 组件 props 之外的属性（如 `language="python"`） | WARN | React 静默忽略，实测全仓 37 处 |
| S8 | fix-011 结构前提：模块级 `nbSeq` / `newNotebookId()` / 无 `useRef` 计数器 / 服务端重复 id 兜底 | FAIL/WARN | **fix-011** |

### 为什么 fix-013 的 grep 判据被换掉（E3 撞出来的既存文档缺陷）

`v1.3-refactor/SKILL.md` §5 原写 ``grep -c '`},'``。**形态判据不成立**：一个合法的 cell 分隔符和一个被禁的 JSX 属性逗号，字面形状完全相同。实测它在 `content/mpc/distributed-mpc.mdx:290` 假阳；换一种空格写法又会漏掉真缺陷。已换成 S3——按 **JSX 属性上下文**判定，而不是按字符形状。

### 全量验收实测（56 门 · 182 notebook · 347 cell，内核在线）

- 课程级 **PASS 19 · WARN 7 · FAIL 30**，退出码 **1**。
- 按判据：`FAIL S2×44`、`FAIL S6×63`、`WARN S5×20`、`WARN S6×17`、`WARN S7×37`。
- **S0 / S1 / S3 / S4 命中数全是 0**，S8 四条结构前提全绿（模块级 `nbSeq` ✓ `newNotebookId()` ✓ 无 `useRef` 计数器 ✓ 服务端重复 id 兜底 ✓）。即 017 那一类缺陷在现网已绝迹。**判据不是恒真**：夹具里 `S0×4 S1×1 S2×2 S3×1 S4×1 S5×5 S7×1 S8×4` 逐条会红（E2 新发现 ②：绿 ≠ 在测量）。
- 63 个 S6 error cell 的诚实分级——**30 个是 ipywidgets**（16 个 `interact` NameError + 14 个 `ModuleNotFoundError`），即 S2×44 的运行时后果、A6 已登记的存量债务、v1.3-refactor 存在的理由本身，不是新缺陷；**另 33 个是本工具第一次跑出来的新缺陷**：

| 类别 | 数量 | 明细 |
|------|------|------|
| `setupCode` 缺 import / 跨 cell 依赖断裂 | 15 | `feedback`×6、`La`×2、`tf`×1、`cp`×1、`sol`×1、`valid`×1、`min_energy_ode`×1、`plot_lambda_effect`×1、`plot_diophantine_convergence`×1 |
| 库 API 漂移 | 5 | `control.pole`×2、`scipy.signal.dcgain`×1、`bode(plot=)`×1、`Unknown transformation method 'forward_euler'`×1 |
| 数值 / 建模错 | 11 | 极点重复超 `rank(B)`×4、`T` 必须是采样周期整数倍×3、`Improper transfer function`×2、解包数目不符×1、`IndexError` 维数×1 |
| 模板字面量保真度 | 1 | `robust/h-infinity-basics.mdx:444` 的 `print("\n结论…")` → 真换行落进 Python 字符串字面量 → `SyntaxError: unterminated string literal`。**正是 S5 有意不定论、交给 S6 实跑裁定的那一类**（S5 只对转义差异 WARN，免得把安全的双写形式判成缺陷） |
| 纯运行时错 | 1 | `discrete-sampled/z-transform-analysis.mdx:259` 的 `linefmt=colors[i]+'-'`，而 `colors = ['blue','green',…]` → matplotlib 格式串只认单字母色码，`'blue-'` 非法。**MDX 字面与求值后的串都查不出来，只有真跑才暴露**——与 017 同一性质 |

cell 是**在同一个内核里顺序执行**的（traceback 显示 `Cell In[2]` / `In[3]`，`In[1]` 是 `setupCode`），状态照常传递，所以上面那些 NameError 是真缺陷、不是工具把 cell 孤立执行造成的假象。

### 非回归（四项）

| 项 | 结果 |
|----|------|
| `npm run check` | 退出码 **0**，md5 `aae7a07ed3d39df2`，PASS 17 · WARN 36 · FAIL 0 —— 与 E2 时点**逐字一致** |
| `npm run verify:all` | 退出码 **1**，md5 `16cf8d243c47bdc5`，56 门 / A 3 · B 29 · C 19 · D 5 / 课程项 FAIL 28 + 组件规范违规 3 —— 与 E2 时点**逐字一致** |
| `npx tsc --noEmit` | 退出码 **0**、零输出（夹具里故意写坏的 `.tsx` 不在编译范围，机理见 plan 的 E2 批注 ⑨-i） |
| e1-fixture | 退出码 **1**、课程项 FAIL 7 + 组件规范违规 1 + 注册结构违规 1，对照组 `fx/good-lesson` 0 FAIL（B 级）—— 与 plan `:1717` / `:1792` 记的预期逐项吻合 |

### 顺带发现：md5 作非回归判据不成立（本条自己的教训）

上表 e1-fixture 那一项**没能**用 md5 复核。E3 早先记下的 `993e7972…` 在任何调用形态下都复现不出来：试过 `--all` / `--no-http` / `--quiet` / `--delivered` / 绝对路径 `--root` 共 6 种组合，各得 `97145bda` / `217ebef1` / `ac6f1b25` / `21b5309c`，无一命中；而那串 md5 **没写进任何文件**，脚本本身又是 untracked（`git status` 显示 `?? scripts/verify-lesson.mjs`），git 里没有基线可 diff。三条叠加 → 判据不可复核，只能改用「实质项对齐已记录预期」。

两条通用教训：

1. **md5 只对固定调用形态的命令有意义。** `npm run check` 与 `npm run verify:all` 都是 npm script 形式，两者都逐字复现了；带自由 flag 的 ad-hoc 命令，输出里含 root 路径回显与 dev server 探测行，flag 一变哈希就变——看着严谨，实则不可复核。
2. 与 E2 那个「fix-015 门槛静默空转」同类：**一个无法复现的判据 ≈ 没有判据**。要么把命令固化成 npm script，要么把预期值写进文件（`.qoder/e3-fixture/README.md` 就是这么做的：每组夹具都写死预期级别与判据计数）。

### 归因三字段（B8 起必填）

- **本该拦住它的角色**：秦构。cell 拼接与前端交付门槛属其职责，`personas.md` 秦构清单里原有「MDX 中每个 `JupyterNotebook` 的 cell 字符串与验证脚本中的 cell 逐字全等」一条。
- **拦截缺口**：那条门槛的**两边同源**——验证脚本的 cell 也是从同一份 MDX 抽的，同一套解析把两边一起污染时结果恒为「全等」。当时实测 `9/9 ALL MATCH` 而 bug 照样上线。缺的不是纪律，是**独立第三方口径**（对求值后的串判 + 真跑内核）。另一半缺口是**门槛无载体**：当时用的 `nc-verify.py` 从未进仓库，纪律写在清单里却没有可执行的东西。
- **清单更新**：① 两个 SKILL.md 的 §5「cell 逐字全等」表述已替换为具体命令 `npm run nb:verify`（twin block，改完重新 diff 仍 `TWIN-IDENTICAL`）；② `personas.md` 秦构清单同步；③ 新增一条通用教训：**凡是「A 与 B 全等」型门槛，先问 A 与 B 是否同源；同源就不构成验证，只构成自我一致**。

### 遗留与移交

- **33 个新缺陷未修**。E3 只交付工具与测量，改 MDX 正文属 A6 / C1 范围。已按上表五类分级；其中 30 个 ipywidgets 归 v1.3-refactor。
- 33 个里最该优先的两条：`h-infinity-basics:444` 的 SyntaxError 与 `z-transform-analysis:259` 的 `'blue-'`——都是「页面 200、点运行才炸」，与 017 同性质，且都是整 cell 不出图。
- `RE_WIDGETS` / `RE_MAGIC_FIRST` / `RE_PLACEHOLDER` 三个脚本已共用同一份（`lib-mdx.mjs`），但**作用对象不同**：`verify-lesson.mjs` 第 3 项作用于 MDX 字面（`extractNotebookCode`），`nb-cells.mjs` 的 S1/S2/S4 作用于求值后的串（`extractNotebooks`）。命中数因此不同，**不是矛盾，是口径差异**；两处输出都应注明口径，E4 之后可考虑统一。
- plan 的 E3 推荐 Prompt 里那句「必须用 `new ProxyHandler({})` 绕过」是**错的**：`ProxyHandler` 是 Python `urllib` 的东西，Node 的 `http.request` 从不读代理环境变量；需要 `--noproxy '*'` 的是 `curl`。plan 自 Q13 起冻结，按 B5「叙述服从测量」就地更正、不改原文（见 plan 的 E3 批注）。
- **B8 遗留项 019 / 020 的详情文件仍未建**（E2 移交，E3 未动，理由同 E2：须先更正 `fix-tracker/SKILL.md`《归因回顾机制》§5 再建档）。
- **`scripts/` 下全部工具脚本目前都是 untracked**（`verify-lesson.mjs` / `check-catalog.mjs` / `lib-mdx.mjs` / `lib-catalog.mjs` / `nb-cells.mjs`，以及 `lib/wiki-components.ts`）。这意味着 E1–E3 的三个门槛在 git 里没有任何历史，误删即不可恢复，也正是上面那条 md5 无法复核的根因之一。**是否入库由用户裁定**，E3 未自行 commit。
