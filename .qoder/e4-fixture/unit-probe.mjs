/**
 * e4-fixture / unit-probe.mjs —— scripts/glossary.mjs 纯函数的单元断言
 *
 * 为什么必须是仓库里的文件、不能是 `node -e "…"`：
 * 本仓的 shell（Git Bash on Windows）会把双引号里的反斜杠吃掉一层，
 * `node -e "…\\\\text…"` 到 JS 里变成 TAB + "ext"，正则直接写坏。
 * E4 实测踩过两次：一次让断言静默通过（测了个不存在的东西），
 * 一次报出 SyntaxError 才发现。**凡是含 `\` 的断言一律写进文件。**
 *
 * 跑法（必须在仓库根目录）：
 *   node .qoder/e4-fixture/unit-probe.mjs        → 全绿退出码 0，任一断言失败退出码 1
 *
 * 断言分六组，对应 glossary.mjs 里六个「口径来自实测、不来自审美」的地方：
 *   A maskNonProse  正文掩码（围栏 / 行内代码 / JSX / frontmatter）
 *   B symbolsOf     符号抽取（删宏必须删参数、全大写连写、花体保宏名、转置单算）
 *   C cleanZhTerm   中文术语裁剪（LEAD_STOP / LEAD_KEEP / TAIL_STOP / TAIL_KEEP / 长度上限）
 *   D enKey         「全称, 缩写」归一（isInitialism 判据）
 *   E termsOf       中英对照抽取（只认括号内纯拉丁）
 *   F sentinelSlice / tableRows  登记表解析（哨兵必须独占一行；单元格按裸 `|` 切）
 */

// CAPS_ABBREV 在模块加载时从 <root>/docs/semester-02/04-notation.md 的 ABBREV 块读，
// 所以必须先把 --root 指到夹具，否则断言结果会随真表的有无而变（PM 时而是一个基、时而拆成 P·M）。
process.argv = [process.argv[0], process.argv[1], "--root", ".qoder/e4-fixture/ok"];

const { maskNonProse, mathSpans, symbolsOf, cleanZhTerm, enKey, termsOf, sentinelSlice, tableRows } =
  await import("../../scripts/glossary.mjs");

let pass = 0;
const fails = [];
function eq(label, got, want) {
  const a = JSON.stringify(got), b = JSON.stringify(want);
  if (a === b) { pass++; return; }
  fails.push(`${label}\n      期望 ${b}\n      实得 ${a}`);
}
function ok(label, cond, detail = "") {
  if (cond) { pass++; return; }
  fails.push(`${label}${detail ? `\n      ${detail}` : ""}`);
}

const bases = (tex) => symbolsOf(tex).syms.map((s) => s.base);
const basesSet = (tex) => new Set(bases(tex));

// ---------------------------------------------------------------- A 正文掩码
{
  const src = [
    "---",
    "title: $\\Alpha$ 元数据里的数学不算",
    "---",
    "",
    "正文 $T_s$ 算。",
    "",
    "```python",
    "x = 1  # $\\Beta$ 围栏里不算",
    "```",
    "",
    "行内代码 `$\\Gamma$` 不算。",
    "",
    "<JupyterNotebook setupCode={`# $\\Delta$`} cells={[{ code: `# $\\Epsilon$` }]} />",
    "",
  ].join("\n");
  const m = maskNonProse(src);
  eq("A1 掩码等长", m.length, src.length);
  eq("A2 掩码保换行数", m.split("\n").length, src.split("\n").length);
  ok("A3 frontmatter 被掩", !m.includes("Alpha"), m.slice(0, 60));
  ok("A4 围栏被掩", !m.includes("Beta"));
  ok("A5 行内代码被掩", !m.includes("Gamma"));
  ok("A6 JSX 属性（含模板字面量）被掩", !m.includes("Delta") && !m.includes("Epsilon"));
  ok("A7 正文数学保留", m.includes("$T_s$"));
  // 等长 + 保换行 ⇒ 掩码串上的偏移可以直接拿去原文取上下文，行号不漂
  const at = m.indexOf("$T_s$");
  eq("A8 偏移对原文有效", src.slice(at, at + 5), "$T_s$");
  eq("A9 行号不漂", m.slice(0, at).split("\n").length, src.slice(0, at).split("\n").length);

  // 未闭合围栏：从开栏一路掩到文件尾，否则围栏里的代码会被当正文抽术语
  const bad = "正文 $K$\n\n```python\ny = 2  # $\n";
  ok("A10 未闭合围栏掩到 EOF", !maskNonProse(bad).includes("python"));
}

// ---------------------------------------------------------------- B 符号抽取
{
  // B1 基字母登记：下标变体归到基，但 fulls 里留证据
  eq("B1 T_s + e_{ss} 的基", bases("T_s + e_{ss}"), ["T", "e"]);

  // B2 全大写连写默认拆成单字母（矩阵连乘）
  eq("B2 A + BK 拆成 A/B/K", bases("A + BK"), ["A", "B", "K"]);

  // B3 缩写判定表里的连写不拆（ok 根的 ABBREV 块登记了 PM、GM）
  eq("B3 PM 自成基不拆", bases("PM"), ["PM"]);
  eq("B4 GM 自成基不拆", bases("GM"), ["GM"]);
  ok("B5 未在 ABBREV 表里的 LC 仍拆", basesSet("LC").has("L") && basesSet("LC").has("C"));

  // B6 删宏必须删参数：环境名不能被当成字母连写
  eq("B6 bmatrix 不产出符号", bases("\\begin{bmatrix} x \\\\ \\end{bmatrix}"), ["x"]);

  // B7 文字类宏连同紧随的**花括号多字母下标**一起删（E4 实测 5 处 / 净减 26 次假字母命中）
  eq("B7 \\text{MTBF}_{single} 不产出符号", bases("\\text{MTBF}_{single}"), []);
  eq("B8 \\mathrm{ad}_f g 只产出 f、g", bases("\\mathrm{ad}_f g"), ["f", "g"]);
  // B9 是回归守卫：曾经多写一条 `_[A-Za-z]{2,}`（无花括号的多字母下标），
  // LaTeX 里 `_fg` 是「下标 f，后跟 g」，整条吞掉会让 f、g 各丢一次真命中（实测 f −13、g −15）。
  // 带空格的 B8 抓不到它（` g` 前面的空格让 `_[A-Za-z]{2,}` 匹配不上），所以必须单列无空格写法。
  eq("B9 \\mathrm{ad}_fg（无空格）仍产出 f、g", bases("\\mathrm{ad}_fg"), ["f", "g"]);
  eq("B10 \\mathrm{ad}_f^{n-1} g 不产出 n", bases("\\mathrm{ad}_f^{n-1} g"), ["f", "g"]);
  eq("B11 \\text{tr}_{min} 不产出 m/i/n", bases("\\text{tr}_{min}"), []);

  // B12 花体/黑板体必须保留宏名，否则 \mathcal{H} 会被报成查无此物的 \mathbb{H}
  eq("B12 黑板体保宏名", bases("\\mathbb{R}"), ["\\mathbb{R}"]);
  eq("B13 花体保宏名且不与黑板体混", bases("\\mathcal{H}"), ["\\mathcal{H}"]);
  ok("B14 \\mathcal{H} 不等于 \\mathbb{H}", !basesSet("\\mathcal{H}").has("\\mathbb{H}"));

  // B15 希腊字母与 \partial / \infty 这类符号宏各成一个基
  eq("B15 希腊字母", bases("\\gamma \\omega \\zeta"), ["\\gamma", "\\omega", "\\zeta"]);
  eq("B16 符号宏", bases("\\partial \\infty"), ["\\partial", "\\infty"]);

  // B17 转置 ^T 被 RE_RUN 当上标吸收，必须单独计数，否则 T 的频次里混进 734 次转置
  const r = symbolsOf("A^T P + P A");
  eq("B17 A^T 的基是 A", r.syms.map((s) => s.base), ["A", "P", "P", "A"]);
  eq("B18 转置单独计 1 次", r.syms.filter((s) => s.full === "A^T").length, 1);

  // B19 漏反斜杠的函数名单独报，不混进符号
  const rf = symbolsOf("sin(x) + \\max(a,b)");
  ok("B19 裸 sin 进 bareFunc", rf.bareFunc.includes("sin"));
  ok("B20 \\max 不进 bareFunc", !rf.bareFunc.includes("max"));

  // B21 上标里的数字不产出符号
  eq("B21 s^2 / z^{-1} 只产出 s、z", bases("s^2 + z^{-1}"), ["s", "z"]);
}

// ---------------------------------------------------------------- C 中文术语裁剪
{
  // C1 TAIL_KEEP：尾字是词的后半时不裁。E4 实测真错：抗积分饱和 → 抗积分饱
  eq("C1 抗积分饱和 不被裁成 抗积分饱", cleanZhTerm("抗积分饱和"), "抗积分饱和");
  eq("C2 抗饱和 不被裁成 抗饱", cleanZhTerm("抗饱和"), "抗饱和");
  eq("C3 作用 不被裁成 作", cleanZhTerm("作用"), "作用");
  eq("C4 方向 不被裁成 方", cleanZhTerm("方向"), "方向");
  eq("C5 存在 不被裁成 存", cleanZhTerm("存在"), "存在");

  // C6 LEAD_STOP：剥掉句首的动词/连词/指代
  eq("C6 剥掉「采用」", cleanZhTerm("采用抗饱和"), "抗饱和");
  eq("C7 剥掉「这就是」", cleanZhTerm("这就是积分饱和"), "积分饱和");
  eq("C8 剥掉「根据」", cleanZhTerm("根据基尔霍夫电压定律"), "基尔霍夫电压定律");

  // C9 尾虚词仍要裁（TAIL_KEEP 没把它整个关掉）
  eq("C9 尾字「的」被裁", cleanZhTerm("理想回路整形的"), "理想回路整形");

  // C10 长度上限：整句一律判废
  eq("C10 超过 10 字判废", cleanZhTerm("控制器输出经零阶保持器"), null);
  eq("C11 剥完不足 2 字判废", cleanZhTerm("用的"), null);
  eq("C12 前后空白被 trim", cleanZhTerm("  零阶保持器  "), "零阶保持器");

  // C13–C16 LEAD_KEEP：首字是词的前半时不剥。E4 实测 4 种 / 5 处真错，全部在这里钉住。
  // 危害不是显示难看：03-glossary.md 的「中文标准译名」列会把 `典控制` 当成正确译名永久固化。
  eq("C13 被控变量 不被剥成 控变量", cleanZhTerm("被控变量"), "被控变量");
  eq("C14 经济MPC 不被剥成 济MPC", cleanZhTerm("经济MPC"), "经济MPC");
  eq("C15 经典控制 不被剥成 典控制", cleanZhTerm("经典控制"), "经典控制");
  eq("C16 到达阶段 不被剥成 达阶段", cleanZhTerm("到达阶段"), "到达阶段");

  // C17 同族词守卫：当前语料 0 命中，但 C/D 还要加约 85 门课，
  // 等倾线（isocline）/ 对角化（diagonalization）/ 对数坐标（log scale）都是相平面与频域课的必用词。
  eq("C17a 等倾线 不被剥成 倾线", cleanZhTerm("等倾线"), "等倾线");
  eq("C17b 对角化 不被剥成 角化", cleanZhTerm("对角化"), "对角化");
  eq("C17c 对数坐标 不被剥成 数坐标", cleanZhTerm("对数坐标"), "对数坐标");

  // C18 反向守卫：LEAD_KEEP 只挡词首，不能把真残渣也一起放过。
  // 实测 51 处剥对了的裁剪（的/和/用/在/对/从而/通过/考虑/需要/转化为/时的/处的…）必须照旧生效，
  // 否则 LEAD_KEEP 就从「修 5 处真错」变成「关掉整条 L1 判据」。
  eq("C18a 「对增广系统」仍剥成 增广系统", cleanZhTerm("对增广系统"), "增广系统");
  eq("C18b 「从而说明」仍剥成 说明", cleanZhTerm("从而说明"), "说明");
  eq("C18c 「用边界层」仍剥成 边界层", cleanZhTerm("用边界层"), "边界层");
  eq("C18d 「时的增益裕度」仍剥成 增益裕度", cleanZhTerm("时的增益裕度"), "增益裕度");
}

// ---------------------------------------------------------------- D 英文归一键
{
  eq("D1 全称+缩写取缩写", enKey("Model Predictive Control, MPC"), "MPC");
  eq("D2 跳过 of/the 等虚词", enKey("Alternating Direction Method of Multipliers, ADMM"), "ADMM");
  eq("D3 带连字符的词也认", enKey("Real-Time Iteration, RTI"), "RTI");
  eq("D4 单个缩写原样返回", enKey("ZOH"), "ZOH");
  eq("D5 无逗号的全称原样返回", enKey("Receding Horizon"), "Receding Horizon");
  // D6 关键反例：逗号后面是缩写、但它**不是**前面那几个词的首字母 → 不能折叠。
  // 真仓里 `Evolution Strategies` 与 `Natural Evolution Strategies, NES` 都译作「进化策略」，
  // 那是一条真冲突（ES ≠ NES），折叠掉就等于把冲突埋了。
  eq("D6 缩写与全称不匹配则不折叠", enKey("Receding Horizon, MPC"), "Receding Horizon, MPC");
  eq("D7 归一化后大小写与连字符等价", enKey("anti-windup"), "anti-windup");
}

// ---------------------------------------------------------------- E 中英对照抽取
{
  const t = (s) => termsOf(s).map((x) => `${x.zh}|${x.en}|${x.form}`);
  eq("E1 中文（English）", t("零阶保持器（ZOH）把采样值保持一个周期。"), ["零阶保持器|ZOH|zh(en)"]);
  eq("E2 English（中文）", t("ZOH（零阶保持器）是标准叫法。"), ["零阶保持器|ZOH|en(zh)"]);
  eq("E3 中文/English", t("零阶保持器/ZOH 的写法也收。"), ["零阶保持器|ZOH|zh/en"]);
  // E4 括号内必须纯拉丁：含 CJK 的不收，含 = 与 {} 的模板碎片不收
  eq("E4 （I 型系统）不算中英对照", t("这是（I 型系统）的例子。"), []);
  // E5 **单位挡不住**：dB 是纯拉丁 2 字母，会被抽出来。实测全仓 4 处，构成一条真冲突，
  //    由 03-glossary.md 的 NOISE 表签字，不在抽取阶段挡（挡它就要另立一张单位表，两处维护）。
  eq("E5 （dB）会被抽出，需 NOISE 表签字", t("增益（dB）为单位。"), ["增益|dB|zh(en)"]);
  // E6 模板字面量碎片：括号里含 = 与 {} 的一律不是术语（不掩码就会抽出一堆这种）
  eq("E6 模板碎片不算术语", t("性能（Ts={Ts}s）如下。"), []);
  // E7 同一行多个术语都要收到
  eq("E7 一行两个术语", t("零阶保持器（ZOH）与抗积分饱和（anti-windup）都要收。").length, 2);
  // E8 中文侧的裁剪在 termsOf 里就生效：尾字属词的一部分时不裁（见 C 组）
  eq("E8 抗积分饱和 经 termsOf 后仍完整", t("抗积分饱和（anti-windup）用于执行器饱和时。"), ["抗积分饱和|anti-windup|zh(en)"]);

  // E9–E15 markdown 粗体星号（EMPH）。实测 56 门课 15246 处短括注里有 1236 处与 `*` 相邻，
  // 分四个位置，每条断言钉一个位置（含两个「不需要放行」的反向守卫）：
  //   括外前侧 895 处 · 括外后侧 446 处 · 括内开头 14 处 · 括内结尾 29 处
  // 括外前侧是本语料**最主流的定义写法**（`**术语**（English）`，实测 149 处）。原正则要求中文
  // 紧邻 `（`，于是这 149 处一个都抽不到，留下来的反而是表格单元格与小节标题里的同位语注解 ——
  // 那不是「少抽一点」，是**抽样有偏**（同 E2「判据依赖被检对象的字面形状 ⇒ 静默少测」）。
  // 真仓库实测：放行前 205 条术语 / 38 条冲突，放行后 305 条 / 52 条。
  eq("E9 括外前侧 **中文**（English）", t("**多输入多输出**（MIMO）系统。"), ["多输入多输出|MIMO|zh(en)"]);
  // E10 括内两侧：今日 14+29 处全是 `（**稳定性**）` 这种中文强调（0 条真术语），
  //     放行是为 C/D 阶段约 85 门课里可能出现的 `术语（**English**）` 留口（同 C17 的理由）。
  eq("E10 括内两侧 中文（**English**）", t("多输入多输出（**MIMO**）系统。"), ["多输入多输出|MIMO|zh(en)"]);
  eq("E11 三星粗斜体也认", t("***增益调度***（Gain Scheduling）用于非线性对象。"), ["增益调度|Gain Scheduling|zh(en)"]);
  // E12 反向守卫：EMPH 只吃 `*`，不吃 `_`。`_斜体_` 本语料 0 处；收了会与数学下标 `_` 打架
  //     （掩码失效时 `$T_s$ … _s_（…）` 会被当成术语），所以宁可漏也不放。
  eq("E12 _下划线斜体_ 不放行", t("_多输入多输出_（MIMO）系统。"), []);
  // E13 反向守卫：括内是中文就不算中英对照（括内开头那 14 处全是这种形状，不能因为放行星号而漏进来）
  eq("E13 括号内是中文则不算中英对照", t("**注意**（这不是术语）与（**稳定性**）都不收。"), []);
  // E14 RE_ZH_PAREN 的英文侧**必须首字母大写**，这不是疏忽而是量过的口径：
  //     把 `[A-Z]` 放宽成 `[A-Za-z]` 后真仓库从 71 处涨到 86 处，多出的 15 处里只有 `dB|分贝`
  //     1 条是真术语，其余 14 条全是单位与英文词注解 —— `kHz|快速`、`kHz|中速`、`atm|安全阀`、
  //     `dec|高频`、`active|推力不够用`、`inactive|推力充裕`、`set|控制不变集`、
  //     `start|每步从零开始`、`starting|上一课讨论的`、`anti-windup|事后修补`、
  //     `nullcline|两条零斜率曲线`、`dither|抖振激励`、`dB|所有频率`（块级数学碎片）。
  //     93% 假阳，还会凭空造出 kHz / dB / start 三条假「一英多中」冲突。
  //     依据：`English（中文）` 在本语料专用于缩写词首次定义（ZOH、MPC、LQR…），缩写按惯例大写。
  //     漏掉的 `dB（分贝）` 没有真丢：dB 已由 E5 的 `增益|dB` 进表并被 NOISE 签字。
  eq("E14 小写起头的 dB（分贝）故意不收", t("纵轴单位 **dB（分贝）**。"), []);
  // E15 括外后侧（446 处）**不需要** EMPH：粗体包住整个括注时，正则从括注内部起匹配即可。
  //     钉这条是防止有人把 EMPH 挪到错的位置后，误以为这 446 处也靠它。
  eq("E15 括外后侧 **中文（English）** 本来就能抽", t("**反算（back-calculation）** 是常用方法。"), ["反算|back-calculation|zh(en)"]);
}

// ---------------------------------------------------------------- F 登记表解析
{
  // F1–F5 哨兵必须「独占一行」。这是真事故的回归守卫：04-notation.md 的头部为了警告
  //     "别在正文写全哨兵"，自己写了一遍完整的 `<!-- ABBREV-START -->`，而旧 loader 用
  //     `indexOf` 取第一次出现 → 切片从警告开始。第一次得到空集（PM/GM 被拆回 P·M/G·M），
  //     第二次切到真 END、把 §0–§3 全表当成 ABBREV 块，而结果**恰好**仍是 {PM, GM} —— 
  //     判据静默失效却输出正确数字。详见真表 §5-1。
  const S = "<!-- X-START -->";
  const E = "<!-- X-END -->";
  const doc = [
    "> 正文里写全 `<!-- X-START -->` 是安全的（本行以 > 开头，不独占一行）。",
    "",
    S,
    "| a | b |",
    "|---|---|",
    "| 1 | 2 |",
    E,
    "",
    "尾巴里再写一次 <!-- X-START --> 也不影响。",
  ].join("\n");
  const got = sentinelSlice(doc, S, E);
  ok("F1 正文里的字面哨兵不劫持切片", got != null && got.includes("| 1 | 2 |") && !got.includes("安全的"), JSON.stringify(got));
  eq("F2 切出的正是哨兵之间的表格", (got || "").split("\n").filter((l) => l.startsWith("|")).length, 3);
  eq("F3 缺 END → null", sentinelSlice(`${S}\n| a |`, S, E), null);
  eq("F4 END 在 START 前 → null", sentinelSlice(`${E}\n${S}\n| a |`, S, E), null);
  ok("F5 带缩进的哨兵也认", (sentinelSlice(`  ${S}\n| a |\n  ${E}`, S, E) || "").includes("| a |"));

  // F6 tableRows 按**裸** `|` 切，不认 markdown 的 `\|` 转义。04-notation.md 的 $\sigma$ 行写了
  //    `$\sigma=|\mathrm{Re}(s)|$`、$\gamma$ 行写了 `$\|T_{zw}\|_\infty$`，两行的第 3 列都被挤走，
  //    `rows notation --diff` 于是报「[缺行] \gamma / [缺行] \sigma」→ 退出码 1。
  //    修法是登记格里一律写 `\lvert…\rvert` / `\lVert…\rVert`，不是给 loader 加解转义。
  const head = "| 符号 | 含义 | 出现课程 |\n|---|---|---|\n";
  const bad = tableRows(head + "| $\\sigma$ | $|x|$ | 22 门 |\n| $\\gamma$ | $\\|y\\|$ | 13 门 |");
  eq("F6a 裸竖线把行切成 5 段", bad[0].length, 5);
  eq("F6b 转义竖线同样错列", bad[1].length, 5);
  ok("F6c 错列后第 3 列不再是次数", bad[0][2] !== "22 门" && bad[1][2] !== "13 门", `${bad[0][2]} / ${bad[1][2]}`);
  const good = tableRows(head + "| $\\sigma$ | $\\lvert x\\rvert$ | 22 门 |");
  eq("F6d 改用 \\lvert 就是 3 列", good[0].length, 3);
  eq("F6e 第 3 列仍是次数", good[0][2], "22 门");
}

// ---------------------------------------------------------------- 汇总
console.log("═".repeat(76));
console.log("e4-fixture / unit-probe —— glossary.mjs 纯函数单元断言");
console.log("═".repeat(76));
console.log(`PASS ${pass} · FAIL ${fails.length}`);
for (const f of fails) console.log(`\n[FAIL] ${f}`);
console.log("─".repeat(76));
console.log(fails.length ? "→ 退出码 1" : "→ 退出码 0");
process.exit(fails.length ? 1 : 0);
