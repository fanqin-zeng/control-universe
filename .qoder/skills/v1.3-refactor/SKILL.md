---
name: v1.3-refactor
description: v1.3 可视化双轨制重构。自动查找交付记录中未打勾的前3个课程，按决策流程将 ipywidgets 改为 React 交互组件，将纯演示代码保持为 JupyterNotebook。
triggers:
  - v1.3重构
  - 重构代码块
  - 执行重构计划
---

# v1.3 可视化双轨制重构

## 概述

本技能执行 v1.3 重构计划（`.qoder/v1.3-refactor-plan.md`），将课程中的代码块按"可视化双轨制"原则分类重构：
- **代码演示** → `<JupyterNotebook>`（静态输出：文本/表格/图表）
- **交互探索** → React 组件（ECharts + useECharts hook，带可调控件）

## 执行流程

### Step 1: 确定本次重构目标

1. 读取 `.qoder/delivery-tracker.md`，找到**未打勾的前 3 个有代码的课程**
2. 跳过纯理论课程（无代码块的）
3. 记录本次要重构的 3 个课程列表

```
目标课程：
1. <chapter>/<lesson-1>
2. <chapter>/<lesson-2>
3. <chapter>/<lesson-3>
```

### Step 2: 逐课程分析与重构

对每个课程执行以下流程：

#### 2a. 读取课程内容

读取 `content/<chapter>/<lesson>.mdx`，找出所有代码块（`<JupyterNotebook>` 和 ` ```python `）。

#### 2b. 分类每个代码块

对每个代码块应用决策树：

```
这个代码块有可调参数吗？
├── 否 → 保持 <JupyterNotebook>（静态输出）
└── 是 → 读者需要拖动参数看变化趋势吗？
    ├── 否 → 保持 <JupyterNotebook>（静态多曲线对比）
    └── 是 → 改为 React 交互组件（<XxxExplorer>）
```

**判断"需要交互化"的信号**：
- 代码使用了 ipywidgets（interact, FloatSlider, IntSlider 等）→ **必须交互化**
- 代码展示"改变某参数 → 观察响应变化"的模式 → 交互化
- 代码有多个参数组合的对比图 → 考虑交互化
- 代码只是计算并打印结果 → 保持静态
- 代码只是画一条固定曲线 → 保持静态

#### 2c. 执行重构

**对于需要交互化的代码块**：

1. 创建 React 组件 `components/wiki/<name>-explorer.tsx`：
   - 使用 `useECharts` hook（已存在于 `components/wiki/use-echarts.tsx`）
   - 固定坐标轴范围
   - 禁用动画（`animation: false`）
   - 提供合适的控件（滑块、按钮组、下拉菜单等）
   - 用纯 TypeScript 实现计算逻辑（不依赖 Python）

2. 在 `lib/wiki-components.ts` 登记组件（**E2 起单一来源**：一行 import + 一行键名。`mdx-components.tsx` 与 `lib/content.ts` 都只从它展开，**不要再改这两处**）
3. 在 MDX 文件中替换对应的 `<JupyterNotebook>` 为新的 `<XxxExplorer>`

**对于保持 JupyterNotebook 的代码块**：

1. 检查是否有 ipywidgets 引用 → 如有，改为静态多曲线/多参数对比
2. 确保 setupCode 不包含 ipywidgets
3. 确认代码可独立运行

#### 2d. fix-logs 回归检查

在验证之前，查阅 `.qoder/fix-logs/INDEX.md`，检查本次重构的课程是否有历史修复记录：

1. 根据课程路径（如 `classic/time-domain-analysis`）在 INDEX.md 中搜索相关条目
2. 阅读相关的 individual fix logs（`.qoder/fix-logs/*.md`），特别关注：
   - 交互组件设计规范（固定坐标轴范围、禁用动画）
   - 已知的可视化 bug 及修复方案
   - ipywidgets 兼容性问题的处理经验
3. 确保本次重构不会引入回归问题

**示例**：如果重构 `classic/time-domain-analysis` 中的阶跃响应章节，必须检查 fix-log 002（横坐标轴动态缩放问题），确保新组件使用固定坐标轴范围。

**与 Step 2e 的关系**：本步是「按课找历史」，Step 2e 是「按项找历史」——九项清单每一项后面都括注了对应的 fix-log 编号（§1），两处一起看才不会漏。

#### 2e. 验证（前端交付硬门槛，B6 起）

> **本节是九项清单的权威副本，全仓恰好两份**：一份在 `.qoder/skills/wiki-discussion/SKILL.md`《前端交付硬门槛（B6 起）》，一份在 `.qoder/skills/v1.3-refactor/SKILL.md` Step 2e。**两份逐字一致**，改一处必须同步另一处；不同步即视为规范漂移（B6 的验收就是用脚本把两份抽出来 `diff`）。执行者是**秦构**，郑核只核对他是否把实际输出粘进讨论日志附录 B，不自己重跑。

**§1 九项清单**（照 `semester-02-plan.md` §3.7 M3 逐字抄入，每项附执行方式与 fix-log 编号）

- [ ] npm run build 通过
  - 执行方式：先停 dev server（build 与 dev 共用 `.next`），再 `npm run build`；判定 = 退出码 0、输出无 `Failed to compile`。这一项是**真检测**：`app/(wiki)/[chapter]/[lesson]/page.tsx:12` 的 `generateStaticParams()` 返回 catalog 全部 141 门课，构建时逐门预渲染，MDX 编译错误与组件未注册都会在这里炸出来。`npx tsc --noEmit` **不能替代**——它不检查 `.mdx`。
  - fix-log：013、015
- [ ] curl 课程页 → HTTP 200
  - 执行方式：dev server 在 **8080**（`npm run dev` = `node scripts/serve.mjs dev`，绑 `127.0.0.1:8080`，不是默认 3000）。`curl -s -o /tmp/p.html -w "%{http_code}\n" http://127.0.0.1:8080/<chapter>/<lesson>`，判定 = `200`。**404 不一定是路由问题**：`getLesson` 抛错会走 `notFound()`，所以 MDX 编译失败在 dev 下表现为 **404 而非 500**。排查先查 `logs/app.log` 里的 `MDX 编译失败`（`lib/content.ts:142` 经 `lib/logger.ts:42` 写入；B6 实测该文件有 **44** 条历史记录）；`logs/dev.log` 只是当次 dev server 的 stdout，当次没跑到的失败里面没有（B6 实测 **0** 条）。
  - fix-log：013、015
- [ ] 页面 H2 数 == catalog.ts 该课 subsections 数
  - 执行方式：**必须在渲染后的 HTML 上量**，数 MDX 源码的 `## ` 不算。`npm run check` §6 走 `mdxH2Titles()`（`scripts/check-catalog.mjs:93`）扫的是**源文件**，所以 `check` 全绿**不等于**本项通过。命令：`grep -oE "<h2[ >]" /tmp/p.html | wc -l`，与 `content/catalog.ts` 里该课 `subsections` 数组长度比对，判定 = 相等；顺带 `grep -oE "<h1[ >]" /tmp/p.html | wc -l` 应为 **1**。
  - fix-log：012（实测：源码 12 个 H2、DOM 只渲染出 2 个）
- [ ] katex-error 元素数 == 0
  - 执行方式：`rehype-katex` 在**编译期**运行，`katex-error` 的 span 直接落在 SSR HTML 里，**不需要开浏览器**：`grep -c "katex-error" /tmp/p.html`，判定 = `0`。
  - fix-log：012
- [ ] MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等
  - 执行方式：**E3 起已自动化**，一条命令 `npm run nb:verify`（= `node scripts/nb-cells.mjs verify --all`）；单课用 `node scripts/nb-cells.mjs verify <chapter>/<lesson>`。它先 extract（按 JS 模板字面量**求值后**取 cell，不是抓 MDX 字面），再把每个 cell 逐个 POST 给 8891 的真内核跑一遍，assemble 侧还有反向校验（骨架 → 填充 → 重新 extract → 与源 JSON 逐字全等）。判定 = 本课 S0–S8 无 FAIL 且退出码 **0**。内核不在时 S6 打 **SKIPPED** 并给出启动方法，**SKIPPED 不算过**。不再需要每课现场重建 `scripts/verify-<lesson>.py`。
  - **本项抓不到 fix-017 的原形态**：拼接脚本同时污染 MDX 与验证脚本时两边仍然全等——当时 `9/9 ALL MATCH` 而 bug 照样上线。真正兜住它的是同一命令里的三条判据：S1（求值后首行不得以 `%` 开头）、S4（不得残留 `%%NBn%%` / `%NBn%` / `<<NBn>>`）、S6（cell 真跑一遍）。所以 §5 那条「人工看拼接脚本的占位符 + 浏览器里跑一次」已被取代。
  - **E3 实测**（全仓 56 门有 MDX 的课 · 182 个 notebook · 347 个 cell）：S0 / S1 / S3 / S4 命中均为 **0**，fix-017 与 fix-013 的原形态已无存量；S5（模板字面量保真度）WARN **20** 处、S7（组件没有的属性）WARN **37** 处、S2（ipywidgets）FAIL **44** 处涉及 **21** 门课。判据本身有负向测试：`.qoder/e3-fixture/README.md` 逐条给了命令与预期退出码。
  - fix-log：017（E3 已根治，见 `.qoder/fix-logs/INDEX.md`）
- [ ] 新增组件已在 `lib/wiki-components.ts` 登记（**E2 起单一来源，fix-015 已根治**；本项在 B6 九项里排第 6、在 `verify-lesson.mjs` 里排第 4，两套编号不通用）
  - 执行方式：**已自动化，三处 FAIL 级机检**。① `npm run check` 第 5 节：MDX 引用的组件是否都登记进单一来源、单一来源是否误带 `"use client"`、`mdx-components.tsx` 与 `lib/content.ts` 是否都从它导入并展开且无内联残留；② `npm run verify -- <chapter>/<lesson>` 第 4 项：本课引用的每个标签是否都已登记（未实现 / 未导出 / 未登记都是 FAIL）；③ 同脚本末尾《附 · 组件注册结构》：全仓结构事实 + 孤儿组件的登记状态，**只在 `--all` / `--delivered` 下计入退出码**，单课运行只作提示。判定 = `npm run check` 无 FAIL 且退出码 0，且 `npm run verify -- --delivered` 的第 4 项与附录无 FAIL。新增一个交互组件 = **两处**改动：`components/wiki/xxx-explorer.tsx` + `lib/wiki-components.ts`（一行 import + 一行键名）；**不要再动 `mdx-components.tsx` 与 `lib/content.ts`**，二者都只从单一来源展开。`lib/wiki-components.ts` **禁止加 `"use client"`**：加了以后导出对象整体变成一个 client reference，服务端 `{...wikiComponents}` 展开后一个组件都拿不到 → 引用任何自定义组件的页面 500（三处机检都盯这条）。
  - fix-log：015
- [ ] 新增组件已在 MDX 中用 <ComponentName /> 显式引用
  - 执行方式：`npm run check` 只把孤儿组件报成 **WARN**（已登记的 Q3 孤儿 `components/wiki/bode-margins-explorer.tsx` 长期在册），**WARN 不能阻断签发**，所以本项必须按课单查：`grep -c "<ComponentName" content/<chapter>/<lesson>.mdx`，判定 = ≥ 1，本课每个新增组件都要查一遍。
  - fix-log：**无编号**。两起事故只记在项目记忆与 Q3：① `intelligent/neural-network-control` 的 `NeuralNetworkExplorer` 已实现已注册却未在 MDX 引用 → 页面不出图；② `bode-margins-explorer.tsx` 至今仍是孤儿。**B8 应补登一条 fix-log。**
- [ ] 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅
  - 执行方式（四个子项分别查）：
    1. 固定坐标轴：`xAxis` 与 `yAxis` 都有显式 `min` 和 `max`。粗筛 `grep -L "min:" components/wiki/*-explorer.tsx` 应为空（B6 实测 36 个组件中 **0** 个缺 `min:`）；粗筛命中不等于合规（`min:` 可能来自别处），最终以人工读该组件的 `xAxis` / `yAxis` 为准。
    2. `animation: false`：粗筛 `grep -L "animation: false" components/wiki/*-explorer.tsx` 应为空（B6 实测 **0** 个缺失）。
    3. `useECharts` 收到 Option 对象：人工读组件源码，判定 = `useECharts(x)` 的实参是 `useMemo` 产出的 `EChartsOption` 对象，**不是** `(chart) => { chart.setOption(...) }` 这类 callback。
    4. 默认参数复现正文手算例：与柯验的附录 A.1 交叉——A.1 查数值本身对不对，本项查「默认 props 恰好是正文手算例那一组参数」有没有被实际勾过（见《数值三方对账》§7 末条）。需要一个能独立复算读数的**镜像脚本**。
  - fix-log：002、003、005（子项 1）；003（子项 2）；014、016、018（子项 4）。**子项 3 无编号**——`intelligent/fuzzy-controller-design` 那次 hydration crash（`Cannot read properties of undefined (reading 'get')`）只记在项目记忆与计划 §3.3，**B8 应补登**。
- [ ] notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用
  - 执行方式：**只查本课**，E3 起用 `node scripts/nb-cells.mjs verify <chapter>/<lesson>` 的 **S2** 判定（无 `FAIL S2` 即过）。S2 判的是 `setupCode` 与每个 cell **求值后**的代码，正则 `ipywidgets|FloatSlider|IntSlider|widgets\.|interact\(`，比裸 grep 多认一个 `widgets.`。裸 grep `content/<chapter>/<lesson>.mdx` 仍可当粗筛，但它会把正文里**讲解 ipywidgets 的散文**一起算进来，S2 只看代码。**不要按全仓判定**——E3 实测全仓 **44** 处命中、涉及 **21** 门课（`discrete-sampled/sampling-period-selection` 6、`modern/lqr-controller` 4、`classic/frequency-domain-analysis` 3、`classic/frequency-response-design` 3、`mpc/nonlinear-mpc` 3，其余 16 门各 1–2 处），那是 A6 已登记的存量债务，全仓查会永远红。
  - **S6 会把这条从「静态嫌疑」升级成「实测故障」**：内核实跑时这些 cell 直接抛 `ModuleNotFoundError: No module named 'ipywidgets'`——轻量内核压根没装这个包，不是配置问题，只能按 C1 改成 React 交互组件。
  - fix-log：004、006

**§2 未通过即不得签发**

清单任一项未通过 → 郑核**不得签发**，`delivery-tracker.md` **不得打勾**。

- 秦构**没有打回权**（见 personas.md 其「否决权」条目），但他不粘贴实际输出、或任一项标 ❌，签发就不成立。
- 附录 B 必须**逐项粘贴实际命令与实际输出**，不接受「已检查」「应该没问题」。九项全过才能写 `[郑核-签发]`。
- 存量债务**不豁免本课**（如 §1 第 9 项那 21 个文件）：门槛口径是「本课新写 / 新改的部分必须干净」，全仓红既不是本课的挡箭牌、也不是本课的罪状——按课查、按课判。

**§3 元规则**（照 §3.7 M3 逐字）

> **元规则**：本清单每新增一项，必须同时新增一个能自动执行它的脚本或命令（归入 E1 的 `verify-lesson.mjs`）；无法自动化的项必须写明人工检查步骤与判定标准。

自动化状况（B6 首次实测，E1 / E2 / E3 陆续收敛；下表为 **E3 之后**的现状）：

| 项 | 现状 | 缺口 |
|----|------|------|
| 1 build | 命令即门槛，退出码可判 | 跑之前必须停 dev server |
| 2 / 3 / 4 curl 三连 | **已自动化**（E1）：`npm run verify -- <chapter>/<lesson>` 第 6 项，在渲染后 HTML 上数 `<h1>` / `<h2>` / `katex-error` 并核 HTTP 200 | 无（该项需 dev server，否则 SKIPPED） |
| 5 cell 全等 | **已自动化**（E3）：`npm run nb:verify` —— extract 取**求值后**的 cell、逐个真跑内核、assemble 反向校验逐字全等 | 无 |
| 6 组件登记 | **已自动化**（E2 单一来源）：`npm run check` 第 5 节 + `npm run verify` 第 4 项，都是 FAIL 级 | 无 |
| 7 显式引用 | 只有 WARN，**不能阻断** | 需按课 `grep -c` |
| 8 组件四要件 | 子项 1 / 2 可粗筛 grep；3 / 4 人工 | 子项 4 的镜像脚本 **无工具** |
| 9 ipywidgets | **已自动化**（E3）：`npm run nb:verify` 的 S2，判求值后代码；裸 grep 只作粗筛 | 只按课判定，勿按全仓（存量 21 门课 / 44 处是 A6 债务） |

**§4 Windows 环境注意事项**

1. **Tailwind 工具类可能不生效**：组件一律用 inline style + CSS 变量，不用 Tailwind 工具类（`v1.3-refactor/SKILL.md` 的组件模板已是 inline style 形态，照抄即可）。
2. **`.next` 缓存可能损坏**：症状是同一页面交替出现 200 与 500。处理顺序 = 先 `git stash` 归因（确认不是自己的改动），再 `rm -rf .next` 重启。`npm run build` 之后必须 `rm -rf .next` 再起 dev，否则 prod 产物与 dev 混用会复现该症状；build 与 dev 共用 `.next`，跑 §1 第 1 项前必须先停 dev server。
3. **dev server 在 8080，不是默认 3000**：`npm run dev` = `node scripts/serve.mjs dev`，绑 `127.0.0.1:8080`；§1 第 2 / 3 / 4 项的 curl 都用这个端口。
4. **Jupyter kernel 在 8891，绕代理的办法取决于用哪门语言**：`scripts/jupyter_server.py` 的 `PORT = int(os.environ.get("JUPYTER_PORT", "8891"))`；`execute` 的返回体形如 `{"outputs": [...]}`，要判的是里面有没有 `type == "error"` 的元素。系统代理会让 POST 返回 **502**，但三套客户端的解法完全不同：Python 的 `urllib` 默认读环境代理，需 `new ProxyHandler({})` 装个空 opener 才直连；**Node 的 `http.request` 压根不读代理环境变量**，既不需要也没有 `ProxyHandler` 这个东西（本条旧文把 `new ProxyHandler({})` 标成「Node」，是错的，E3 更正）；`curl` 要 `--noproxy '*'`。E3 的 `scripts/nb-cells.mjs` 走 Node `http.request`，因此开箱即用。§1 第 5 项要求 cell **真实执行过**再比对——只有跑过才知道拼接有没有把 cell 改坏，这一步现在由 `npm run nb:verify` 的 S6 完成。
5. **服务端只在 `setup_code` 键缺失时才用 DEFAULT_SETUP**：`setup = body.get("setup_code", DEFAULT_SETUP)`，键存在但为空串时 numpy / matplotlib / rcParams **一行都不跑**，第一个 cell 立刻 `NameError`。浏览器组件是无条件带这个键的，所以校验工具必须照抄这个行为才叫保真（`nb-cells.mjs` 显式带上 `setup_code`，注释里记了这个陷阱）；MDX 侧 `setupCode` 缺失**或为空串**都由 S0 报 FAIL——空串最阴，属性在、看着像有意为之，后果却和没写一样。

**§5 秦构人设里另外四条（不属九项，但同样是硬门槛）**

personas.md 秦构的检查清单有 **11 项**（其中 1 项是「执行九项硬门槛」的元条目，实质 10 项）。实质 10 项里有 **4 项不在上面九项之内**，且都来自「命令行与构建全绿、只有真正跑起来才暴露」的同一类根因，**不得因为不在九项里就跳过**：

- **每页 kernel id 全局唯一**（fix-011）：`useRef` 计数器是每实例的，同页多 notebook 都拿到 `nb-<时间戳>-0`，共用一个内核命名空间、变量互相覆盖，报出与本页代码无关的 `ValueError`。执行方式：E3 起 `npm run nb:verify` 的 **S8** 直接查**结构前提**（组件里有模块级 `let nbSeq = 0`、有 `newNotebookId()`、没有 `useRef` 计数器，服务端有重复 id 的 WARNING/关停兜底），缺任一条即 FAIL/WARN，报告末尾还会打印**现读组件源码**得到的 id 生成方式；这是全仓事实，批量模式只报一次。判定 = S8 无 FAIL。**S8 查的是前提不是行为**：id 是组件在浏览器里现生成的，MDX 里从来没有「id 前缀」这种东西，所以无法从 MDX 静态判「同页两个 notebook 会不会撞」。同页 ≥ 2 个 `JupyterNotebook` 时点一次「▶ 全部运行」看有没有跨 cell 的 `ValueError` 仍然值得做，但它已从**唯一手段**降级为 S8 之外的加分项。
- **cell 首行不得以 `%` 开头；拼接占位符不得含 `%`**（fix-017，**E3 已根治**）：`%%NB1%%` 经一层 `%` 格式化折叠成 `%NB1%`，`#` 注释变 `%#`，IPython 当 line magic 报 `UsageError`。`nb-cells.mjs assemble` 一律用 `<<NB1>>`，不含 `%`，任何格式化层都不解释它。执行方式：`npm run nb:verify` 的 **S1**（求值后首行以 `%` 开头即 FAIL）+ **S4**（残留 `%%NBn%%` / `%NBn%` / `<<NBn>>` 即 FAIL）+ **S6**（真跑一遍，`UsageError` 直接现形）；不再需要人工看拼接脚本的占位符。判定 = 三条都无 FAIL。**§1 第 5 项的全等比对抓不到它**（两边被同一个脚本污染时仍然全等）。**S1 的判据 E3 收紧过一次**：旧写法 `/^%[^\w]/` 要求 `%` 后面是非单词字符，而 `%matplotlib inline` 的 `m` 是单词字符，于是**最常见的那个 line magic 一直漏网**——一条永远不红的判据和一条压根没在测量的判据长得一样。Python 语句永远不可能以 `%` 开头，所以现在就是 `/^%/`；E3 实测新旧两种写法在全仓 529 个代码块上命中数都是 0（存量已清），差别只在 `.qoder/e3-fixture` 里看得出来。
- **多行 display math 的 `$$` 独占开 / 闭行**（fix-012）：`$$\begin{aligned}` 写在同一行会被 remark-math 吞首行 / 不闭合，其后全文被当成一个数学块以 `katex-error` 原文渲染，**而 HTTP 仍是 200**。执行方式：人工检查点 = 多行公式的开 `$$` 与闭 `$$` 各自独占一行，`\begin{aligned}` / `\end{aligned}` 不得与 `$$` 同行（单行 `$$...$$` 合法，这正是它能藏住的原因）；渲染侧由 §1 第 3、4 项兜住。
- **MDX 中 JSX 属性之间无逗号**（fix-013）：``setupCode={`...`},`` 的收尾逗号在 JSX 里非法（属性间只能用空白分隔）→ next-mdx-remote 编译抛错 → 页面 **404 而非 500**。执行方式：`npm run nb:verify` 的 **S3**，判定 = 无 `FAIL S3`。S3 按 **JSX 属性上下文**判（在标签扫描器里数属性之间的逗号），不是数某个字符串。**旧文那条 ``grep -c '`},'`` 判据是坏的**：合法的 cell 元素分隔符（`{ code: … }` 后跟逗号）与被禁的属性间逗号字面同形，能区分开全靠「反引号后面有没有那个空格」这一排版习惯。E3 实测全仓 56 篇里恰好只有 `mpc/distributed-mpc.mdx:290` 写成无空格的形式——于是那条 grep 在**一个完全合法的文件上报警**，同时换个排版就会漏掉真缺陷，正是「判据依赖被检对象的字面形状」的典型（E2 新发现 ②）。§1 第 1、2 项也能抓到，但抓到时要认得出是这个原因。

反向也有一条缺口：**§1 第 8 项子项 4「默认参数复现正文手算例」在秦构原清单里完全没有**（B1 写人设时漏了），B6 已补入 personas.md。

**§6 两份副本的同步核对**

改完任一份后，把九项清单抽出来比对。**E3 起口径改了**：两份 SKILL.md 必须逐字一致，与计划之间只允许一处**已登记的偏离**。

```
# A. 计划 §3.7 M3 的九项（awk 取 M3 标题到「清单任一项未通过」之间，不依赖行号）
awk '/^#### M3 /{f=1;next} /^清单任一项未通过/{f=0} f' \
  .qoder/semester-02-plan.md | grep '^- \[ \] ' > /tmp/g0.txt
# B. wiki-discussion 的九项
grep '^- \[ \] ' .qoder/skills/wiki-discussion/SKILL.md > /tmp/g1.txt
# C. v1.3-refactor 的九项
grep '^- \[ \] ' .qoder/skills/v1.3-refactor/SKILL.md > /tmp/g2.txt

diff /tmp/g1.txt /tmp/g2.txt && echo "TWIN-IDENTICAL"   # ① 必须过
diff /tmp/g0.txt /tmp/g1.txt                            # ② 只允许第 6 项那一条
```

判定 = ① 打印 `TWIN-IDENTICAL`（两份 SKILL.md 的九项逐字一致，含顺序）；② 与计划的 diff **只有第 6 项一条**，且内容就是下面这处已登记偏离。

- **已登记偏离（E2 造成，E3 实测仍在）**：计划 §3.7 M3 第 6 项写的是「新增组件已在 mdx-components.tsx 与 lib/content.ts 两处注册（E2 后为单一来源）」，E2 落地后两份 SKILL.md 都改成了「新增组件已在 `lib/wiki-components.ts` 登记…」。计划自 Q13 起**冻结**（只许动阶段复选框与批注），不能改回来对齐；因此旧文那句「不一致时**以计划 §3.7 M3 为准**，两份 SKILL.md 同时改回」**已失效**——照它执行会把 E2 的根治成果抹掉。**以两份 SKILL.md 为准**，计划那一行按历史文本读。
- **旧判定串自 E2 起就打不出来了**：`THREE-WAY SAME` 需要三份全等，而第 6 项已经不等；两个 SKILL.md 里却一直写着「判定 = 打印 `THREE-WAY SAME`」。一条**执行不了**的判定和一条**没在执行**的判定，从报告上看不出区别（E2 新发现 ②：绿 ≠ 在测量）。E3 实测 `diff /tmp/g0.txt /tmp/g1.txt` 恰好输出一条 `6c6`，`diff /tmp/g1.txt /tmp/g2.txt` 无输出。
- **B6 实测**：`scripts/` 下当时只有 `check-catalog.mjs` 与 `serve.mjs`，**没有**现成的门槛核对脚本；上面几条命令本身就是可运行的工具，不需要额外脚本。E1 的 `verify-lesson.mjs` 与 E3 的 `nb-cells.mjs` 落地后，九项的**内容**已分别自动化（见 §3 表），但「两份副本是否同步」这件事至今仍然只有上面这几条 diff 在管。
- 两个 SKILL.md 都**不含其它 `^- [ ] ` 行**（B6 实测：插入前各 0 条），所以 `grep` 抽出来的就是九项本身；将来若在这两个文件里新增了别的顶层复选框，`grep` 必须改成按节范围抽取。
- **孪生范围是整段 §1–§6，不只九项**：`v1.3-refactor/SKILL.md` 自「**§1 九项清单**」起、到 §6 末尾止（**不含**其后 v1.3 专属的《单独执行时的口径》收尾段），与 `wiki-discussion/SKILL.md`《前端交付硬门槛（B6 起）》的对应段**逐字全等**。改任一处都要同步另一处；最稳的做法是改完一份后把整段抽出来覆盖另一份，再跑一次上面的 ①。

> **v1.3-refactor 单独执行时的口径**：不走完整讨论流程时没有郑核签发环节，此时 §2 只保留后半句——九项任一项未过，`delivery-tracker.md` **不得打勾**，且 Step 4 的重构报告里必须逐项写明未过原因。§5 那四条同样适用：重构最常碰的正是 `JupyterNotebook` 与交互组件，`%#`、kernel id、`$$` 独占行、JSX 逗号四类坑全在这条路径上。**本文件是九项清单两份权威副本之一**（另一份在 `.qoder/skills/wiki-discussion/SKILL.md`《前端交付硬门槛（B6 起）》），同步核对按 §6 执行。

### Step 3: 更新交付记录

1. 在 `.qoder/delivery-tracker.md` 中将本次重构的 3 个课程打勾：`[ ]` → `[x]`
   - **前置条件（B6 起）**：该课 Step 2e 的九项硬门槛**全部通过**。任一项未过 → 该课**不得打勾**，只能在报告里写明未过项与原因（见 Step 2e §2）。
   - 打勾还要求 catalog 里该课 `status: "v1.3"`，否则 `npm run check` 会 FAIL（既有约束，非 B6 新增）。
2. 记录重构摘要

### Step 4: 输出报告

```
## v1.3 重构报告

### 本次重构课程
1. <chapter>/<lesson-1>
2. <chapter>/<lesson-2>
3. <chapter>/<lesson-3>

### 重构内容

#### <lesson-1>
- 代码块总数：X
- 保持 JupyterNotebook：Y 个
- 改为交互组件：Z 个
- 新增组件：<XxxExplorer>
- ipywidgets 修复：是/否
- 九项硬门槛：9/9 通过（未过则写「N/9，未过项 = 第 X 项，原因 = …」）
- §5 四条：kernel id 唯一（S8）/ cell 首行无 `%`（S1）/ $$ 独占开闭行（人工）/ JSX 属性间无逗号（S3）—— 逐条结果
- notebook 判据：粘贴 `node scripts/nb-cells.mjs verify <chapter>/<lesson>` 的**实际输出**（S0–S8 各几条 + 退出码），不接受「已检查」「应该没问题」

#### <lesson-2>
...

#### <lesson-3>
...

### 硬门槛实际输出
<逐课粘贴九项的实际命令与实际输出，形态同讨论日志附录 B。
 不接受「已检查」「应该没问题」；未过项必须原样贴出失败输出>

### 下次重构目标
根据 delivery-tracker.md，下一批为：
1. ...
2. ...
3. ...
```

## React 交互组件模板

```tsx
"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

// 物理常量
const PARAM_DEFAULT = 1.0;

export function XxxExplorer() {
  const [param, setParam] = useState(PARAM_DEFAULT);

  // 计算曲线数据
  const curveData = useMemo(() => {
    // ... 纯 TypeScript 计算
    return [] as [number, number][];
  }, [param]);

  // ECharts 配置
  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: { left: 60, right: 30, top: 40, bottom: 50 },
    xAxis: { type: "value", name: "...", min: 0, max: 10 },
    yAxis: { type: "value", name: "..." },
    series: [{
      type: "line",
      data: curveData,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, color: "#3b82f6" },
    }],
  }), [curveData]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />
      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>参数名</label>
          <input
            type="range"
            min={0.1} max={5.0} step={0.1}
            value={param}
            onChange={(e) => setParam(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{param.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrapper: { border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, margin: "20px 0", background: "#fafafa" },
  chart: { width: "100%", height: 320 },
  controls: { marginTop: 16, padding: 16, background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb" },
  sliderRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 500, color: "#374151", minWidth: 80 },
  slider: { flex: 1, height: 6, cursor: "pointer" },
  value: { fontSize: 14, fontWeight: 600, color: "#2563eb", minWidth: 50, textAlign: "right", fontFamily: "monospace" },
};
```

## 注意事项

- **不要删除原有 JupyterNotebook 中不适合交互化的代码块**
- **Python → TypeScript 转换**：交互组件需要用 TS 重写计算逻辑，确保数学公式正确
- **固定坐标轴**：避免拖动时坐标轴缩放导致视觉混乱
- **禁用动画**：`animation: false`，保证拖动时即时响应
- **组件命名**：`<Topic>Explorer`，如 `StateSpaceExplorer`、`LQRExplorer`
- **登记一处**：**E2 起组件注册只有单一来源 `lib/wiki-components.ts`**（一行 import + 一行键名），`mdx-components.tsx` 与 `lib/content.ts` 都从它导入并展开，不要再动它们；连组件本体一共**两处**改动（`components/wiki/xxx-explorer.tsx` + `lib/wiki-components.ts`）。漏登记 / 单一来源误带 `"use client"` / 消费方退回内联，`npm run check` 第 5 节与 `verify-lesson.mjs` 第 4 项 + 附录都报 **FAIL**
- **构建验证**：每次重构后必须 `npm run build` 确认通过——但它只是 Step 2e 九项硬门槛的**第 1 项**，构建通过**不等于**交付通过（fix-012 那一类问题构建全绿、HTTP 还是 200，页面却整篇渲染成 `katex-error`）
- **九项硬门槛（B6 起）**：Step 2e 是全仓两份权威副本之一（另一份在 `.qoder/skills/wiki-discussion/SKILL.md`《前端交付硬门槛（B6 起）》），改一处必须同步另一处并按 §6 做同步核对（**E3 起判定串是 `TWIN-IDENTICAL`——只比这两份，与 plan §3.7 M3 之间允许且只允许第 6 项那一处已登记偏离；旧的三方全等 `THREE-WAY SAME` 自 E2 起就打不出来了**）；任一项未过 → `delivery-tracker.md` **不得打勾**
- **Windows 环境**：Step 2e §4 的四条（Tailwind 工具类兜底 / `.next` 缓存损坏 / dev server 在 8080 / Jupyter kernel 在 8891 且 POST 需绕过系统代理）在重构时同样适用
