# `.qoder/e3-fixture` —— `scripts/nb-cells.mjs` 的负向测试数据

这个目录**不是课程**，也不参与站点构建。它是 E3 交付物 `scripts/nb-cells.mjs`
（以及它依赖的 `scripts/lib-mdx.mjs`）的测试夹具。

存在的理由（A7 立的规矩）：**只对着干净的当前仓库跑等于没测**。
现网 `content/` 下 182 个 notebook 里 S0/S1/S3/S4 命中数都是 0 —— 一条从没红过的判据，
和一条压根没在测量的判据，在报告上长得一模一样（E2 新发现 ②：绿 ≠ 在测量）。
所以每一条判据都要有一份**故意写坏**的数据，证明它真的会红。

夹具是**仓库产物**，不是临时文件（B6 定的规矩：验证脚本与其测试数据都不得放 `%TEMP%` 后删）。

---

## 一条总命令

```bash
node scripts/nb-cells.mjs verify --all --root .qoder/e3-fixture --no-kernel
```

预期**退出码 1**，输出里应当出现：

| 课程 | 级别 | 预期内容 |
|---|---|---|
| `fx/nb-bad` | FAIL | 8 个 notebook · 7 个 cell；`S0×4 S1×1 S2×2 S3×1 S4×1 S5×5 S7×1` |
| `fx/nb-crlf` | PASS | 1 个 notebook · 1 个 cell（围栏里那个假的不算） |
| `fx/nb-good` | PASS | 1 个 notebook · 2 个 cell |
| `fx/nb-kernel` | PASS | 1 个 notebook · 4 个 cell（`--no-kernel` 下 S6 不跑） |
| 附 · S8 | FAIL×3 + WARN×1 | 全仓事实，读的是本目录里那两份**故意改坏**的组件与服务端副本 |

汇总行应为 `课程级 PASS 3 · WARN 1 · FAIL 4`、`按判据：S0×4 S1×1 S2×2 S3×1 S4×1 S5×5 S7×1 S8×4`。

---

## 逐条命令与预期

下面每条都在仓库根目录（`D:\Workspace\control-universe`）执行。

### 1. 静态判据全集 · `content/fx/nb-bad.mdx`

```bash
node scripts/nb-cells.mjs verify fx/nb-bad --root .qoder/e3-fixture --no-kernel
```

预期退出码 **1**。七个 notebook 各自注入的缺陷写在文件里对应小节的标题上（NB1…NB5），
包括：S7 未知属性 `language="python"`、S1 首行 `%matplotlib inline`、S2 ipywidgets 家族、
S4 残留 `%%NB1%%`、S3 JSX 属性间逗号、S5 四种转义失真（掉反斜杠 / `${` 插值 /
非法转义序列 / 反斜杠接换行）、S0 四条（缺 setupCode、缺 cells、`code` 不是字面量、
**setupCode 是空串**）。

NB5 是文件内的**正确写法对照组**：同一个 notebook 里放 `\\n`、`\\lambda`、`` \` ``、`\${`
这些安全的双写形式，raw ≠ value 但 0 个 issue。如果 S5 对它报了 WARN 或 FAIL，
说明判据把安全写法也当成了缺陷 —— 这是「假红」，和「假绿」一样有害。

### 2. 真内核执行 · `content/fx/nb-kernel.mdx`

需要 `scripts/jupyter_server.py` 在 8891 上跑着（`npm run dev` 会一并拉起）。

```bash
node scripts/nb-cells.mjs verify fx/nb-kernel --root .qoder/e3-fixture
```

预期退出码 **1**，且 S6 恰好三条：

- `FAIL S6 … cell 2 执行报错 ZeroDivisionError: division by zero`（带 traceback）
- `WARN S6 … cell 4 有 stderr：E3 fixture: 这是一条非良性 stderr，必须单独报 WARN`
- `WARN S6 良性 stderr 2 行：matplotlib 字体缺字形（负号 U+2212，不影响出图）`

第三条验的是**折叠**：cell 3 写了两行 matplotlib 缺字形告警，属良性噪声，
应折成一条 WARN 并把原文留给 `--out` 导出的 JSON，而不是刷屏。
第二条验的是**不吞**：一个 cell 既有 error 又有独立 stderr 时，stderr 不能被 error 分支吃掉
（这是实测出来的真 bug：`SyntaxWarning: invalid escape sequence '\o'` 曾被 `if/else if` 吞掉）。

### 3. 内核不可达 → S6 SKIPPED（不是 PASS）

```bash
node scripts/nb-cells.mjs verify fx/nb-kernel --root .qoder/e3-fixture --port 1 --quiet
```

预期输出含 `内核 127.0.0.1:1 不可达` 与
`S6 内核实跑 SKIPPED —— 启动方法：npm run dev（会同时拉起 next dev 与 scripts/jupyter_server.py）`。
SKIPPED 必须**说出来**并给启动方法，不能静默算过。

### 4. 内核被回收后的重建 + 重放 · `mock-kernel.mjs`

真服务端只在空闲 1800 秒后回收内核，正常验一遍等不到，所以用 mock 确定性触发。

```bash
node .qoder/e3-fixture/mock-kernel.mjs --port 8999 --fail-at 3 &
node scripts/nb-cells.mjs verify fx/nb-kernel --root .qoder/e3-fixture --port 8999 --quiet
curl -s --noproxy '*' http://127.0.0.1:8999/__log
```

预期 mock 侧记录 `creates = 2`、`executes = 7`，序列为：
建内核 A → 在 A 上跑 cell 1/2/3（第 3 次返 404）→ 建内核 B（**id 必须不同**）→
在 B 上重放 cell 1/2 → 重试 cell 3 → 跑 cell 4 → DELETE。

重放这一步是必须的：新内核是空命名空间，前面 cell 定义的变量都不在了，
不重放就会用一个跟浏览器行为不一致的方式跑完，报告失真。
两次 `create` 的 `setupLen` 相同 —— `setup_code` 在重建时也要重发。

顺带验了 nb-cells 自己的 id 计数器：两个 id 形如 `nbc-<毫秒>-0` / `nbc-<毫秒>-1`，
后缀递增，符合 fix-011 的前提。

`curl` 要带 `--noproxy '*'`：Windows 上系统代理会拦本机回环。
mock 还提供 `GET /health`（与真服务端同形状）与 `GET /__reset`。

### 5. CRLF 围栏回归 · `make-crlf.mjs` → `content/fx/nb-crlf.mdx`

```bash
node .qoder/e3-fixture/make-crlf.mjs          # 幂等，退出码 0
node scripts/nb-cells.mjs verify fx/nb-crlf --root .qoder/e3-fixture --no-kernel
```

预期生成器自检 `裸 LF 残留 = 0`、`<JupyterNotebook 字面次数 = 2`，verify 报
`[PASS] 1 个 notebook · 1 个 cell` —— 只认围栏**外**那个真的。

为什么是生成器而不是直接提交 `.mdx`：这个测试的全部内容就是「文件用 CRLF 换行」，
编辑器另存、git 的 `core.autocrlf`、任何一次格式化都可能把它悄悄改回 LF，测试就静默失效。

**变异测试已做过**（这是本夹具最有价值的一条）：把 `scripts/lib-mdx.mjs` 里围栏判定的
空白类从 `[ \t]` 改回 `\s`（`\s` 会跨过 `\r\n` 匹配到下一行的围栏，开闭配对整体错位）：

```js
const fm = /^\s*(`{3,}|~{3,})/.exec(src.slice(i, i + 8));   // 变异注入
```

`fx/nb-crlf` 立刻从 `[PASS] 1 个 notebook` 变成 `[FAIL]`，而且认出来的是**围栏里那个假的**
（报 S1「首行是 %%NB9%%」与 S4 占位符残留），围栏外那个真组件反倒隐身；
同一变异对 LF 的 `fx/nb-good` 毫无影响 —— 证明它抓的是 CRLF 专有的 bug，不是碰巧一起变了。
改完记得还原，并用 `md5sum` 核对（注意：`[ "$A" = "$B" ]` 在两个变量都为空时也会成立，
比较前先确认非空）。

### 6. `assemble` 反向校验 · `assemble/*.json`

```bash
node scripts/nb-cells.mjs assemble .qoder/e3-fixture/assemble/good-roundtrip.json     # 退出码 0
node scripts/nb-cells.mjs assemble .qoder/e3-fixture/assemble/bad-collide.json        # 退出码 1
node scripts/nb-cells.mjs assemble .qoder/e3-fixture/assemble/missing-notebooks.json  # 退出码 1
```

- `good-roundtrip.json`：2 个 notebook / 5 个代码块，覆盖反斜杠、反引号、`${`、真换行、
  `$`、unicode、有 `title`、`title` 为 null、`setupCode` 为空。
  预期 `PASS 反向校验：骨架 → 填充 → 重新 extract → 与源 JSON 逐字全等`。
- `bad-collide.json`：cell 0 的代码**本身**含有字面量 `<<NB2>>`，与它自己的占位符相撞。
  预期 `FAIL 反向校验不通过（重新 extract 后与源 JSON 不全等）：第 1 个 notebook 里残留了占位符`。
  这条证明反向校验不是摆设 —— 工具宁可拒绝，也不静默产出一份坏 MDX。
- `missing-notebooks.json`：只有 `_comment`/`source`/`count`，没有 `notebooks` 数组。
  预期 `FAIL assemble：JSON 里找不到 notebooks 数组（请用 extract 的输出）`。

### 7. S8 结构前提 · `components/wiki/jupyter-notebook.tsx` + `scripts/jupyter_server.py`

这两份是**故意改坏**的副本，`--root .qoder/e3-fixture` 下 S8 读的就是它们：
组件里换成了 `useRef(0)` 计数器（fix-011 的原始病因）、没有模块级 `let nbSeq = 0`、
没有 `newNotebookId()`；服务端对重复 `notebook_id` 静默覆盖、端口写成 8899，
并且**刻意不含** `already registered` 这个短语（真服务端有 1 处，这份 0 处）。

预期 `FAIL×3 + WARN×1`，且 `kernel id 生成方式（现读组件源码）：(未找到)`。

陷阱记录：这份 `jupyter_server.py` 的文档字符串与行内注释里原本写着
「真服务端在这里会打印 already registered」—— 那句话本身含有被 grep 的短语，
会让 S8 的 WARN 假绿。**自证型注释会废掉它自己要测的东西**，已改写。
（本 README 也出现了那个短语，但 S8 只读 `<root>/scripts/jupyter_server.py`，扫不到这里；
真要哪天改成全目录 grep，这条记录就会变成新的假绿源 —— 到时候连 README 一起改。）

---

## 与真仓库的关系

- 本目录下的 `content/` `components/` `scripts/` 只是**形状**上模仿真仓库的相对路径，
  内容全是假的；`--root` 一换，nb-cells 就只看这里。
- `npm run check` 与 `tsc --noEmit` 都不受本目录影响：`check-catalog.mjs` 按根相对路径
  只取 `content/` 与 `components/wiki/`；tsc 的 include 通配默认跳过以点开头的目录
  （E2 用 `.qoder/tsc-probe.ts` + 仓库根对照探针实测过，详见 plan 的 E2 批注 ⑨-i）。
- 同类的 E1 夹具在 `.qoder/e1-fixture/`，验的是 `scripts/verify-lesson.mjs` 的九项门槛。

## 不要做的事

- **不要修 `nb-bad.mdx`** —— 修好就等于删掉测试。
- 不要手工编辑 `nb-crlf.mdx`，改 `make-crlf.mjs` 里的 `BODY` 再重跑生成器。
- 不要把这两份改坏的 `jupyter-notebook.tsx` / `jupyter_server.py` 复制回真仓库。
