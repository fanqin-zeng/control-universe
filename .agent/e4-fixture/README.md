# `.agent/e4-fixture` —— `scripts/glossary.mjs` 的负向测试数据

这个目录**不是课程**，也不参与站点构建。它是 E4 交付物 `scripts/glossary.mjs`
（术语与符号抽取 + 登记表核对门槛 C1–C5）的测试夹具。

存在的理由（A7 立的规矩）：**只对着干净的当前仓库跑等于没测**。
E4 的门槛天生就有一条「永远绿」的路：`docs/semester-02/03-glossary.md` 与 `04-notation.md`
一旦建好并且登记齐全，C1/C2 就再也不红了 —— 此后无论是抽取口径悄悄变窄（少扫一种符号形态），
还是登记表里留了死条目（课程改过、那条变体已不存在），报告上都一样是全绿
（E2 新发现 ②：**绿 ≠ 在测量**）。所以：

- `ok/` 证明门槛**能全绿**（否则它对真仓库也永远红，报告就会被整张无视）；
- `bad/` 证明每条判据**真的会红**，并且红的理由正是它该抓的那件事；
- `unit-probe.mjs` 把 86 条纯函数断言钉住，让「口径变窄」在到达门槛之前就先炸。

夹具是**仓库产物**，不是临时文件（B6 定的规矩：验证脚本与其测试数据都不得放 `%TEMP%` 后删）。

---

## 一条总命令

```bash
node .agent/e4-fixture/unit-probe.mjs                                    # 退出码 0
node scripts/glossary.mjs check --root .agent/e4-fixture/ok               # 退出码 0
node scripts/glossary.mjs check --root .agent/e4-fixture/bad              # 退出码 1
```

| 命令 | 预期判定 | 退出码 |
|---|---|---|
| `node .agent/e4-fixture/unit-probe.mjs` | `PASS 86 · FAIL 0` | **0** |
| `node scripts/glossary.mjs check --root .agent/e4-fixture/ok` | `PASS 4 · WARN 0 · FAIL 0` | **0** |
| `node scripts/glossary.mjs check --root .agent/e4-fixture/bad` | `PASS 0 · WARN 4 · FAIL 2` | **1** |
| `node scripts/glossary.mjs check`（真仓库，建表前） | `PASS 0 · WARN 2 · FAIL 2`（C1/C2 读不到登记表，C4 裸函数名 7 处，C5 无 ABBREV 表而语料有 67 种连写） | **1** |
| `node scripts/glossary.mjs check`（真仓库，两份 docs 建好后） | **实测**（2026-09-26，E4 交付时点）：`PASS 3 · WARN 1 · FAIL 0`——C1/C2/C5 PASS，C4 WARN（裸函数名 2 种 7 处：`max` 5 / `min` 2，内容缺陷归 C1/A6），C3 只打 INFO 行不计入判定 | **0** |

退出码只由 **FAIL** 决定（`WARN` 不影响）：C1b/C2b/C4/C5 是给人看的活性探针，
不是能挡住交付的硬门槛 —— 把「有 2 种裸函数名」这种**内容缺陷**设成硬门槛，
会让 E4 之后每一门课的交付都被别人的旧账卡住。C4 在真仓库上就是常红的（实测 7 处），
修复归 C1/A6。

> C1b/C2b/C5 在**没问题时不打印任何行**（只有 C1/C2/C4/C5 的 PASS 行会出现），
> 所以 `ok` 根只有 4 行 PASS 而不是 7 行 —— 这不是漏跑，判据跑了并且没话可说。

---

## 1. 纯函数断言 · `unit-probe.mjs`

```bash
node .agent/e4-fixture/unit-probe.mjs
```

86 条断言分 6 组，每条都在名字里写明它钉的是哪个口径：

| 组 | 条数 | 钉住的事 |
|---|---|---|
| A 正文掩码 | A1–A10 | `maskNonProse` 等长、等换行数、偏移对原文仍有效、行号不漂移；围栏 / 行内代码 / JSX 属性 / frontmatter 被掩掉，正文数学留着；未闭合围栏一路掩到文件尾 |
| B 符号抽取 | B1–B21 | 基字母登记（`T_s`→`T`）；全大写连写默认拆（`BK`→B,K）而 ABBREV 表里的不拆（`PM` 自成基）；`\begin{bmatrix}` 连参数一起删；`\text{MTBF}_{single}` 不产出 s·i·n·g·l·e 而 `\mathrm{ad}_fg` 必须产出 f、g；花体/黑板体保宏名（`\mathcal{H}` ≠ `\mathbb{H}`）；`^T` 转置单独计数 |
| C 中文术语裁剪 | C1–C18（**23 条**：C17 分 a–c、C18 分 a–d） | `抗积分饱和`/`作用`/`方向`/`存在` 这类「尾字恰好是停用字」的真词不被裁尾（C1–C5）；`采用抗饱和`→`抗饱和`（C6–C8）；超 10 字与纯虚词返回 null（C10–C11）；**`被控变量`/`经济MPC`/`经典控制`/`到达阶段` 这类「首字恰好是停用字」的真词不被剥首**（C13–C16），同族词 `等倾线`/`对角化`/`对数坐标` 一并钉住（C17）；C18 是反向守卫 —— `对增广系统`→`增广系统`、`从而说明`→`说明` 等 51 处**该剥的仍要剥**，防止把 LEAD_KEEP 写宽之后整条 L1 判据静默失效（同 E2「绿 ≠ 在测量」） |
| D 英文归一键 | D1–D7 | `MPC`/`ADMM`/`RTI` 的「全称, 缩写」折叠成一个键；**`Receding Horizon, MPC` 不折叠**（它不是首字母缩略式），从而保住 `ES` vs `Natural Evolution Strategies, NES` 这条真冲突 |
| E 中英对照抽取 | E1–E15 | 三种括号写法都收；`（I 型系统）`、`（Ts={Ts}s）` 不收；**`（dB）` 会收**（这条断言钉的是「单位会漏进来」这个事实本身，残渣交给 NOISE 表签字）；一行两个术语。**E9–E15 按粗体星号的四个实测位置逐条钉**：括外前侧 895 处（`**多输入多输出**（MIMO）`，本语料最主流的定义写法，放行前这 149 处术语一个都抽不到）、括内两侧 14+29 处（今日全是 `（**稳定性**）` 这种中文强调，放行为 C/D 的 85 门课留口）、括外后侧 446 处（`**反算（back-calculation）**`，**不需要** EMPH，E15 钉住以防有人把星号槽挪错位置）；E12 反向守卫 `_斜体_` 不放行（会与数学下标 `_` 打架）；E13 反向守卫括内是中文就不算对照；**E14 钉住「RE_ZH_PAREN 英文侧必须首字母大写」是量过的口径而非疏忽**（放宽成 `[A-Za-z]` 会多出 15 处、其中 14 处是 `kHz\|快速`、`atm\|安全阀`、`dec\|高频`、`active\|推力不够用` 这类单位与英文词注解，93% 假阳） |
| F 表格与哨兵解析 | F1–F6（**10 条**：F6 分 a–e） | **这两组钉的都是真仓库上实际炸过的缺陷，不是预防性断言**。**F1–F5 钉 `sentinelSlice()`**：正文里写全字面的哨兵不劫持切片（04 开头那段「哨兵必须独占一行」的警告文字自己就含全字面哨兵，早期三处切片都用 `indexOf` 取第一次出现，被它劫持**两次**且输出看起来完全正常）、切出的正是哨兵之间的表格、缺 END 与 END 在 START 前都返回 null、带缩进的哨兵也认（判据是「整行 trim 后等于哨兵」）。**F6a–e 钉 `tableRows()` 按裸 `|` 切分、不反转义**：04 的 $\sigma$ 行与 $\gamma$ 行原先在单元格里写了 `$|\mathrm{Re}(s)|$` 与 `$\|T_{zw}\|_\infty$`，两行的第 3 列都被挤走 → `rows notation --diff` 报「[缺行] \gamma / [缺行] \sigma」退出码 1；修法是登记格里一律写 `\lvert…\rvert` / `\lVert…\rVert`，**不是给 loader 加解转义**（加了解转义就会与 markdown 表格自身的 `\|` 语义打架） |

`unit-probe.mjs` 必须在**仓库文件**里而不是 `node -e`：Git Bash 会吃掉一层反斜杠，
`/\(?:text…/` 到 Node 就成了 `Unmatched ')'`。这条在本阶段撞了五次 ——
最后一次是想用 `node -e` 直接验 `RE_ZH_PAREN` 为什么不匹配 `dB（分贝）`，
反斜杠被吃掉后 `Nothing to repeat`，只能另写一个 `.mjs` 探针文件跑。
（探针里**不含**反斜杠时 `node -e` 才安全，例如直接调 `termsOf` 看返回值。
**探针文件本身也受 B6 那条规矩约束**——开发期写在 `$TEMP` 里的那几版跑完就没了，
上面 F 组这 10 条之所以还在，正是因为最后落进了本文件同目录的 `unit-probe.mjs`。）

它还在 import 之前就把 `process.argv` 设成 `--root .agent/e4-fixture/ok`，
因为 `CAPS_ABBREV` 是**模块加载时**从 `<root>/docs/semester-02/04-notation.md` 的 ABBREV 块读的 ——
不先设 argv，B3/B4（`PM` 自成基）的结果会随真表有无而变。

---

## 2. 全绿对照组 · `ok/`

```bash
node scripts/glossary.mjs check --root .agent/e4-fixture/ok
```

`ok/content/fx/gloss-ok.mdx` 四节，每节都是一类「本该被正确处理」的写法：

- **符号正例**：`$\dot{x} = A x + B u$`、下标（`$T_s$`、`$K_p$`、`$e_{ss}$`）、转置 `$A^T$`、
  矩阵连乘 `$A + BK$`、块级数学里的 `\begin{bmatrix}` 与 `x \in \mathbb{R}^n`、
  希腊字母 `$\zeta$ $\omega_n$ $\gamma$ $\mu$`、缩写 `$PM \geq 50$` / `$GM \geq 10$`、
  文字类宏带标签下标 `$\text{MTBF}_{single} = 10$`。
- **术语正例 + 一条已裁决的冲突**：每个术语都写在**行首**（`RE_EN_PAREN` 会贪婪往前吃最多 25 个汉字，
  写在句子中间会把整句当成译名 —— 这是夹具里那段引用块专门说明的）。
- **残渣签字**：`实验结果（NB1）` / `实验结果（NB3）` 两个变体，靠 `03-glossary.md` 的 NOISE 表签字放行。
- **掩码探针**：```python 围栏里的 `$\Psi$`、行内代码里的 `` `$\Omega$` ``、
  `<JupyterNotebook setupCode={…$\Xi$…} cells={[{ code: `# $\Theta$` }]} />` 里的两处 ——
  这四个符号**一个都不该被扫到**。它们是 A 组断言的端到端版本。

`ok/docs/` 那两份是**玩具登记表**（22 个符号基 / 5 条术语 / 3 条残渣 / 2 条缩写），
刚好覆盖上面这些写法。

---

## 3. 缺陷注入组 · `bad/`

```bash
node scripts/glossary.mjs check --root .agent/e4-fixture/bad
```

预期退出码 **1**，六个信号一个不少：

| 判据 | 级别 | 预期内容 | 注入方式 |
|---|---|---|---|
| C1 | **FAIL** | `1 个符号基未登记…\Psi  1 次 / 1 门（fx/gloss-bad）` | 正文写 `$\Psi$`，登记表里故意没有 |
| C1b | WARN | `登记表里有 1 个符号本轮 0 命中：\Xi` | 登记表写 `$\Xi$`，而 `\Xi` 只出现在**行内代码**里（扫不到） |
| C2 | **FAIL** | `一英多中  Loop Shaping(2/1门) → 环路整形(1/1门) \| 回路整形法(1/1门)` | 同一英文对应两个中文译名，登记表只登记了其中一个 |
| C2b | WARN | `NOISE 表里有 1 条本轮 0 命中：量子混沌` | NOISE 表签字了一个只在**正文散文**里出现的词（不是括号术语，扫不到） |
| C4 | WARN | `1 种漏反斜杠的函数名（共 1 处）：sin  1 次` | 数学环境里写 `$sin(x)$` 而不是 `$\sin(x)$` |
| C5 | WARN | `ABBREV 判定表里有 1 条本轮 0 命中：TMR` | ABBREV 块登记 `TMR`，而 `TMR` 只出现在**行内代码**里 |

C2 的两个变体各只出现 **1 次**，这是刻意的：任何按频次过滤别名冲突的门槛
（「至少出现 2 次才算冲突」）都会让这条**恰好**变绿。真仓库上这个陷阱已经实测过一遍：
加阈值后 56 门课的冲突表从 `一英多中 31 条 + 一中多英 12 条` 直接变成 **0 + 0**，
被滤掉的全是真冲突（`ZOH → 零阶保持器 | 采样保持器`、
`Loop Shaping → 环路整形 | 回路整形法 | 频率整形`、`RMS → 速率单调调度 | 均方根`）——
低频恰恰是「只有一门课这么叫」的正常形态。详见 `glossary.mjs` 里 `aliasConflicts` 上方的注释。

---

## 4. 变异测试（本夹具最有价值的部分）

每条都**做过并还原**，还原后用 `md5sum scripts/glossary.mjs` 核对
（注意 `[ "$A" = "$B" ]` 在两个变量都为空时也成立，比较前先确认非空）。

> **基线口径说明（E4 收尾时补）**：下表 ④⑤⑥ 三行里的 `PASS 76 · FAIL 0` 是**做变异当时的基线**。
> 之后为 F 组（`sentinelSlice` + `tableRows` 裸竖线）又加了 10 条断言，基线变成 **`PASS 86 · FAIL 0`**。
> 三个变异动的分别是 `RE_TEXTLIKE` / `LEAD_KEEP` / `EMPH`，**与 F 组钉的 `sentinelSlice` / `tableRows` 无交集**，
> 所以红的条数不变、只是绿的条数各加 10：④ 应为 `PASS 85 · FAIL 1`、⑤ 应为 `PASS 79 · FAIL 7`、⑥ 应为 `PASS 83 · FAIL 3`
> （**这三个新值是算术推导，没有重跑变异**——重跑要改 `scripts/glossary.mjs` 再按 md5 还原，E4 收尾时没做）。
> 原文按当时实测保留不改（B5：叙述服从测量，但**历史测量不追溯重写**）。
> **通用提醒：往夹具里加断言会移动所有以 PASS 总数写的预期值**——本表就是被自己新增的 F 组弄过期的。

| # | 注入的变异 | 预期后果（实测） |
|---|---|---|
| ① | `tableRows` 不再丢掉分隔行**上面那一行**（表头行） | `ok` 根从 `WARN 0` 变成 `[WARN] C2b NOISE 表里有 1 条本轮 0 命中：变体`，且 C2 的「登记表 12 键 + NOISE 表 3 条」虚高成「15 键 + 4 条」—— 五个列名往登记表里灌了假键。假键本身无害，但它让「登记表 N 键」这个数变成假的；哪天某个列名恰好等于一个真变体，C2 就会**假 PASS** |
| ② | 清空 `ok/docs/…/04-notation.md` 的 ABBREV 块 | `ok` 根立刻 `FAIL C1 2 个符号基未登记：G 1 次 / M 2 次` + `WARN C1b …\GM \PM` + `WARN C5 没有判定表，但语料里有 4 种全大写连写`，退出码 1。这正是真仓库在建表前的样子（67 种连写、P 与 M 各虚增 265/342 次假命中） |
| ③ | `RE_SYM_CELL` 去掉花体分支，只留 `\\[A-Za-z]+\|[A-Za-z]{1,3}` | `ok` 根 `FAIL C1 …\mathbb{R} 1 次 / \mathcal{C} 1 次` 同时 `WARN C1b …\mathbb \mathcal` —— 登记表里**明明写着** `$\mathbb{R}$` 却报未登记。这种假 FAIL 最危险：人会开始认定脚本在抽风，然后整张报告都不看了 |
| ④ | `RE_TEXTLIKE` 补回 `\|\s*_[A-Za-z]{2,}`（无花括号的多字母下标） | `unit-probe` 从 `PASS 76 · FAIL 0` 变成 `PASS 75 · FAIL 1`，**只有 B9 红**（`\mathrm{ad}_fg` 无空格写法），B8（有空格的 `\mathrm{ad}_f g`）照旧绿 —— 证明抓的正是「`_fg` 被当成一个两字母文字标签整条吞掉」这一件事。真仓库上实测 f 609→596、g 572→559，各 13 次真命中凭空消失，而门槛一声不响 |
| ⑤ | `cleanZhTerm` 里 `LEAD_KEEP.has(...)` 那行改成 `if (false && …)` | `unit-probe` 从 `PASS 76 · FAIL 0` 变成 `PASS 69 · FAIL 7`，红的**恰好是 C13–C17c 七条**（被控变量 / 经济MPC / 经典控制 / 到达阶段 / 等倾线 / 对角化 / 对数坐标），而反向守卫 C18a–C18d 全绿 —— 两组钉的是相反方向：C13–C17 防「剥多了」，C18 防「不剥了」。真仓库上实测被裁候选从 46 种 / 51 处涨回 50 种 / 56 处，多出来的 5 处全是把词首字当虚词剥掉的真错，而 `典控制` 会顺着 03-glossary.md 的「中文标准译名」列被 C2 **永久固化**成 PID 的标准译名 |
| ⑥ | `const EMPH = "(?:\*{1,3})?"` 改成 `const EMPH = ""`（三个星号槽一起拆） | `unit-probe` 从 `PASS 76 · FAIL 0` 变成 `PASS 73 · FAIL 3`，红的**恰好是 E9 / E10 / E11**，而 **E15（括外后侧）照旧绿** —— 证明 E15 钉的是「这 446 处不靠 EMPH 也能抽到」，与 E9/E10 钉的方向互补，不会一起假绿。真仓库上术语条目 **305 → 205**、中文条目 348 → 247、冲突 52 → 38：整整 100 条**最正式的术语首次定义**（`**多输入多输出**（MIMO）`、`**增益调度**（Gain Scheduling）`、`**无扰动切换**（bumpless transfer）`、`**反饱和**（back-calculation）`）凭空消失，而 C1–C5 五个门槛**一声不响**（它们核的是「抽到的是否都登记了」，抽不到就无从核起）。两个夹具根的判定完全不变（`ok` 仍 4 PASS、`bad` 仍 WARN 4 · FAIL 2）—— 这正是 E2「绿 ≠ 在测量」的教科书案例：召回塌掉一半，报告全绿 |

---

## 与真仓库的关系

- `--root` 一换，`glossary.mjs` 就只看夹具里的 `content/` 与 `docs/semester-02/`；
  不带 `--root` 时读的是真仓库那两份（E4 交付物）。
- `npm run check` 与 `npx tsc --noEmit` 都不受本目录影响：`check-catalog.mjs` 按根相对路径
  只取 `content/` 与 `components/wiki/`；tsc 的 include 通配默认跳过以点开头的目录
  （E2 用 `.agent/tsc-probe.ts` + 仓库根对照探针实测过，详见 plan 的 E2 批注 ⑨-i）。
- 同类夹具：`.agent/e1-fixture/`（`verify-lesson.mjs` 的九项门槛）、
  `.agent/e3-fixture/`（`nb-cells.mjs` 的 S0–S8）。

## 不要做的事

- **不要修 `bad/content/fx/gloss-bad.mdx`** —— 修好就等于删掉测试（E3 同一条规矩）。
- **不要把 `ok/docs/` 或 `bad/docs/` 那两份玩具登记表复制到 `docs/semester-02/`** ——
  它们是 22 个符号基 / 5 条术语的最小覆盖集，覆盖过去会让真登记表缩水，
  而 C1/C2 只会因此变绿（登记的少了，未登记的自然也少了）。
- 不要在 `ok/content/fx/gloss-ok.mdx` 里把术语写进句子中间：`RE_EN_PAREN` 会往前贪婪吃
  最多 25 个汉字，届时「中文标准译名」列会变成半句话，C2 的裁决键也随之失真。
