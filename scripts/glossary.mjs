/**
 * glossary.mjs —— 术语与数学符号的全仓抽取 / 冲突排查 / 登记表核对（semester-02 E4）
 *
 * 为什么存在：郑核的「风格一致性：术语是否全课程统一？符号约定是否前后一致？」
 * （personas.md 审查清单第 2 条）此前只能靠人读。56 门课 56546 行、20109 处行内数学、
 * 2295 处块级数学（2026-09-26 实测），人读不可能穷尽，于是「统一」这条判据实际上从未被完整执行过。
 * 本脚本把它变成两步：scan 出证据 → check 对着 docs/semester-02/03-glossary.md 与
 * 04-notation.md 的登记表核，未登记即 FAIL。
 *
 * 口径（三条，都是从实测里来的，不是审美选择）：
 *  1. **只扫正文**。围栏代码块、行内代码段、JSX 标签（含 JupyterNotebook 的
 *     setupCode / cells 模板字面量）全部掩掉——掩码用 lib-mdx.mjs 的 scanMdx().skips，
 *     不另写一份识别逻辑（E3 抽 lib-mdx 就是为了不再长副本）。实测不掩码会抽出
 *     `相频特性（L={L}s）`、`性能（Ts={Ts}s）` 这类**模板字面量碎片**当术语，
 *     也会把 Python 字符串里的 `$` 当成数学。
 *  2. **符号按「基字母」登记**，下标/上标变体只作证据。理由：符号冲突的裁决单位是
 *     「$T$ 到底表示什么」，而不是「$T_s$ 和 $T_d$ 谁对」；按基字母登记，集合是封闭的
 *     （26+26+约 30 个希腊字母），check 才可能收敛成一道能过的门槛。
 *  3. **术语别名冲突按「归一化后相同」判定**：英文归一化 = 小写 + 去掉非字母数字，
 *     于是 anti-windup / Anti-windup / antiwindup 视为同一条目的**大小写与连字符变体**
 *     （单独报，不算多译名）；只有归一化后仍不同才算「一概念多译名」。
 *
 * 只用 Node 内置能力；不用 execSync；零新增 npm 依赖。
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { scanMdx, walk, linesOf, lineAt, makeRel, readIfExists } from "./lib-mdx.mjs";

const ARGV = process.argv.slice(2);
function flag(name) { return ARGV.includes(name); }
function opt(name) {
  const i = ARGV.indexOf(name);
  return i >= 0 && ARGV[i + 1] ? ARGV[i + 1] : null;
}
// 位置参数要跳过带值开关的**值**，否则 `scan --all --out f.json` 会把 f.json 当成课程名
// （实测踩过：报「在 content 下找不到匹配 …/e4-scan.json 的 .mdx」）。
const VALUED_OPTS = ["--out", "--root"];
const POSITIONAL = ARGV.filter((a, i) => !a.startsWith("-") && !VALUED_OPTS.includes(ARGV[i - 1]));
const CMD = POSITIONAL[0] || "";
const ROOT = resolve(opt("--root") || ".");
const rel = makeRel(ROOT);
const OUT = opt("--out");
const QUIET = flag("--quiet");
const say = (s = "") => console.log(s);

const P_CONTENT = join(ROOT, "content");
const P_GLOSS = join(ROOT, "docs", "semester-02", "03-glossary.md");
const P_NOTATION = join(ROOT, "docs", "semester-02", "04-notation.md");

/** 登记表在两份 docs 里的机器可校验区间（HTML 注释哨兵，避免靠标题文字定位） */
const REG_START = "<!-- REGISTER-START -->";
const REG_END = "<!-- REGISTER-END -->";
const NOISE_START = "<!-- NOISE-START -->";
const NOISE_END = "<!-- NOISE-END -->";
const ABBREV_START = "<!-- ABBREV-START -->";
const ABBREV_END = "<!-- ABBREV-END -->";

// ---------------------------------------------------------------- 正文掩码

/**
 * 把「不是正文」的区间替换成等量空格（换行保留），返回与原文等长的串。
 * 等长 + 保留换行 ⇒ 掩码串上的偏移可以直接拿去原文取上下文，行号也不会漂。
 */
export function maskNonProse(src) {
  const { skips } = scanMdx(src);
  const buf = src.split("");
  const blank = (from, to) => {
    for (let k = from; k < to && k < buf.length; k++) if (buf[k] !== "\n" && buf[k] !== "\r") buf[k] = " ";
  };
  // frontmatter：正文之前那块 --- 包起来的 YAML 是元数据，不进术语表
  if (/^---\r?\n/.test(src)) {
    const m = /\r?\n---\r?\n/.exec(src.slice(4));
    if (m) blank(0, 4 + m.index + m[0].length);
  }
  for (const s of skips) blank(s.start, s.end);
  return buf.join("");
}

// ---------------------------------------------------------------- 数学环境

/** 数学跨度：先找 $$…$$（可跨行），再找单行 $…$。在掩码后的串上跑，偏移对原文有效。 */
export function mathSpans(masked) {
  const out = [];
  let i = 0;
  while (i < masked.length) {
    if (masked[i] !== "$") { i++; continue; }
    if (masked[i + 1] === "$") {
      let j = i + 2;
      while (j < masked.length && !(masked[j] === "$" && masked[j + 1] === "$")) j++;
      if (j < masked.length) {
        out.push({ kind: "block", start: i, end: j + 2, text: masked.slice(i + 2, j) });
        i = j + 2; continue;
      }
      i += 2; continue;
    }
    let j = i + 1;
    while (j < masked.length && masked[j] !== "\n" && masked[j] !== "$") j++;
    // j>i+1：`$ $` 这种空数学不算；行尾找不到配对 $ 也不算（那是货币符号或写坏的公式）
    if (j < masked.length && masked[j] === "$" && j > i + 1) {
      out.push({ kind: "inline", start: i, end: j + 1, text: masked.slice(i + 1, j) });
      i = j + 1; continue;
    }
    i++;
  }
  return out;
}

const GREEK = new Set([
  "alpha", "beta", "gamma", "delta", "epsilon", "varepsilon", "zeta", "eta", "theta",
  "vartheta", "iota", "kappa", "lambda", "mu", "nu", "xi", "pi", "varpi", "rho",
  "varrho", "sigma", "varsigma", "tau", "upsilon", "phi", "varphi", "chi", "psi", "omega",
  "Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Upsilon", "Phi", "Psi", "Omega",
]);
/** 算子/宏/函数名——出现在数学里但**不是**被赋含义的符号，不进符号表 */
const TEX_SKIP = new Set([
  "frac", "dfrac", "tfrac", "sqrt", "left", "right", "begin", "end", "cdot", "cdots",
  "ldots", "dots", "times", "div", "pm", "mp", "le", "leq", "ge", "geq", "neq", "ne",
  "approx", "equiv", "sim", "propto", "to", "rightarrow", "leftarrow", "Rightarrow",
  "Leftrightarrow", "mapsto", "in", "notin", "subset", "subseteq", "cup", "cap",
  "forall", "exists", "quad", "qquad", ",", ";", "!", ":", " ",
  "sin", "cos", "tan", "cot", "sec", "csc", "arcsin", "arccos", "arctan", "sinh",
  "cosh", "tanh", "exp", "log", "ln", "lg", "det", "dim", "ker", "deg", "max", "min",
  "sup", "inf", "lim", "limsup", "liminf", "arg", "tr", "rank", "gcd",
  "dot", "ddot", "hat", "bar", "tilde", "vec", "overline", "underline", "widehat",
  "widetilde", "overrightarrow", "boldsymbol", "bf", "it", "rm", "displaystyle",
  "textstyle", "scriptstyle", "hspace", "vspace", "quad", "cases", "matrix", "bmatrix",
  "pmatrix", "vmatrix", "array", "aligned", "align", "gathered", "stackrel", "underset",
  "overset", "underbrace", "overbrace", "boxed", "color", "label", "tag", "nonumber",
]);
/** 有独立含义、但不是字母的 TeX 符号 */
const TEX_SYMBOLIC = new Set(["partial", "nabla", "infty", "ell", "hbar", "Re", "Im", "aleph", "emptyset", "varnothing"]);
/** 数学里出现的多字母小写连写，多半是漏了反斜杠的函数名（真缺陷，单独报） */
const BARE_FUNC = new Set(["sin", "cos", "tan", "exp", "log", "ln", "det", "max", "min", "sup", "inf", "lim", "arg", "rank", "tr", "dim", "abs", "atan", "atan2", "sqrt", "mod"]);

/**
 * 全大写连写里**确实是缩写、不是矩阵连乘**的那些。它们自成符号基，不拆成单字母。
 *
 * 这张表是从 04-notation.md 的 `<!-- ABBREV-START --> … <!-- ABBREV-END -->` 块读的，**不是写死在代码里**。
 * 三个理由：① 它本来就是一条符号裁决（「PM 是相位裕度，不是 P·M」），裁决归 docs，不归脚本；
 * ② C/D 还要加约 85 门课，新缩写（MTBF、TMR…）应该由写课的人登记进表，而不是改脚本；
 * ③ 只有 ROOT 可配，C5 才能被 `.agent/e4-fixture` 负向测试（写死的常量测不了）。
 *
 * 表的内容是实测出来的：`abbrs` 子命令把全仓数学环境里所有 ≥2 字母的全大写连写
 * 连同一处原文列出来（56 门课实测 **67 种 / 1131 处**），逐个看上下文后只有 PM、GM 两种是缩写
 * （相位裕度 265 处/13 门、增益裕度 78 处/7 门）；其余 65 种全是矩阵连乘或恒等式那类乘积
 * （BK 161、LC 73、PA 62、AB 48、PC 41、CA 36、KS 31、GK 29、DP 25、GC 25、CP 23、PBR 19、
 * RC 15、DMD 12、TAT 9 相似变换；HU 是 $HU^*+f=0$、XM+YN 是 $XM+YN=I$、KN 是 $KN(A)$）。
 *
 * 判错的代价可测：把 PM 当连乘会给 P 和 M 各灌 265 次假命中、GM 各灌 78 次，
 * P 的总数会从 1245 虚高到含 265 次根本不是「P 这个符号」的计数，04-notation.md 的频次列就成了假数。
 * 反过来，把矩阵连乘当缩写则会让 A+BK 里的 A、B、K 三个符号凭空少掉 161 次命中。
 * 所以 `abbrs` 是永久命令：这张表的每一行都要能在它的输出里找到对应证据行。
 */
const CAPS_ABBREV = loadAbbrevSet();

/**
 * 花体/黑板体字母：`\mathbb{R}`、`\mathcal{O}`、`\mathfrak{g}`。
 * **必须保留宏名**——早期版本把三者一律归一成 `\mathbb{X}`，于是 `\mathcal{O}`（大 O 阶）
 * 被报成 `\mathbb{O}`、`\mathcal{H}`（哈密顿量 / 希尔伯特空间）被报成 `\mathbb{H}`，
 * 两个都是查无此物的假符号，而 H 的那一义恰好是 Prompt 点名要排查的高风险冲突之一。
 */
const RE_BB = /\\(mathbb|mathcal|mathfrak)\s*\{([A-Za-z])\}/g;
/**
 * 文字类宏必须删掉；紧跟其后的**多字母花括号下标**也要一起删，但**单字母下标不能删**。
 *
 * 为什么不能一律删（e4-fixture/unit-probe.mjs 的 B8/B9 抓到的）：
 * `\mathrm{ad}_f g` 里那个 `_f` 是**真符号**——向量场 f，李括号 ad_f g = [f,g]。
 * 一律删会让 f 在 feedback-linearization 一课凭空少掉 22 次真命中（9 处 `\mathrm{ad}_f` + 13 处 `\mathrm{ad}_fg`），
 * g 少掉 13 次。而 `\text{MTBF}_{single}` 里的 `_{single}` 是文字标签，不删就会被 RE_RUN 拆成
 * s、i、n、g、l、e 六个假符号。两者的区别只有一个：**花括号里有几个字母**。
 * 单字母下标 = 符号（RE_RUN 本来就能正确处理），≥2 字母下标 = 文字标签（必须删）。
 *
 * 上标一律不删（本正则根本不碰 `^`）：实测全仓文字类宏后的上标只有 `^2`、`^3`、`^4`、`^{-1}`，
 * 都不含字母；`\mathrm{ad}_f^{n-1}` 里的 n 会被紧随的 RE_RUN 当上标吸收进基 f，本来也不单独成基。
 * 即「不删上标」对现有语料是零差别，留着这条只是为了不去扩大丢失面（unit-probe 的 B10 钉住这个行为）。
 *
 * 实测（56 门课，2026-09-26）：文字类宏共 1271 处，带字母下标的 27 处，其中
 * **删** 5 处花括号下标——`\text{MTBF}_{single}`（computer-control-architecture:498，2 处）、
 * `_{parallel}`、`_{TMR}`（同课:506）、`\text{tr}_{min}`（robust-performance:700）；
 * **留** 22 处单字母下标——`\mathrm{ad}_f`(9) 与 `\mathrm{ad}_fg`(13)（feedback-linearization）。
 * 附带效应逐项可验证（与「只删宏不删下标」的旧判据**逐基对账**，两边都在 04-notation.md 尚不存在、
 * CAPS_ABBREV 为空的前提下跑：总命中 57146 → 57463，差值全部落在 PM/GM 的基切换（+343，
 * 建表后会回落）与下面这 26 次假字母命中上，无一例外，也不存在「顺带改了别的基」）：
 *   · 净减 26 次假字母命中：l −5、e −3、i −3、n −3、a −2、s −2、g −2、T/M/R/p/m/r 各 −1
 *     （`_{single}` 拆出 s·i·n·g·l·e，`_{parallel}` 拆出 p·a·r·a·l·l·e·l，`_{TMR}` 拆出 T·M·R）；
 *   · `abbrs` 的全大写连写从 68 种/1132 处降到 67 种/1131 处，消失的正是 TMR；
 *   · `\text{tr}_{min}` 不再被误报成漏反斜杠的 min 函数（C4 从 8 处降到 7 处）；
 *   · f 的 609 次命中**一字不差**（unit-probe B8/B9 钉住，见下段那次回归）。
 * 这和 RE_ENV 必须连 `{bmatrix}` 一起删是同一个坑：**删宏不删参数，参数就变成假符号**。
 *
 * 曾经多写了一条 `|\s*_[A-Za-z]{2,}`（无花括号的多字母下标），实测**净伤**，已删：
 * LaTeX 里 `_fg` 是「下标 f，后跟 g」，两个都是真符号，整条吞掉会让
 * `\mathrm{ad}_fg` 里的 f、g 各丢一次命中（全仓实测 f −13、g −15）。
 * 而它想挡的 `_{single}` 那类**全部**带花括号——27 处一个例外都没有
 * （`_{parallel}`、`_{single}`、`_{TMR}`、`_{min}`、`_f`）。
 * 教训同 E2 那条：**判据不能依赖被检对象的字面形状**，反过来也一样——
 * 为了兜住一种「看起来可能存在」的写法而放宽匹配，代价是把真符号一起吃掉。
 */
const RE_TEXTLIKE = /\\(?:text|mathrm|textrm|textbf|operatorname|textit|mathit)\s*\{[^{}]*\}(?:\s*_\{(?=[^{}]*[A-Za-z][^{}]*[A-Za-z])[^{}]*\})*/g;
/**
 * 环境宏必须**连同花括号参数一起**删掉。只删 `\begin` 会把 `{bmatrix}` 留下，
 * 于是 bmatrix 被当成 7 个字母连写、逐个记成符号——实测全仓 2406 处 bmatrix
 * 给 a/b/i/m/r/t/x 各灌进 2406 次假命中，x 的总数被抬到 6593。
 * 同类还有 array(92)、cases(68)、vmatrix(10)、pmatrix(8)。
 */
const RE_ENV = /\\(?:begin|end)\s*\{[^{}]*\}/g;
const RE_CMD = /\\([A-Za-z]+)/g;
const RE_RUN = /[A-Za-z]+(?:_\{[^{}]*\}|_[A-Za-z0-9])?(?:\^\{[^{}]*\}|\^[-A-Za-z0-9]+)?/g;
/** 转置记号 ^T / ^{T}：它被 RE_RUN 当成上标吸收掉了，单独计数（T 的一义） */
const RE_TRANSPOSE = /\^\{?T\}?/g;

/**
 * 从一个数学跨度里抽符号。
 * 返回 { syms:[{sym, base, full}], bareFunc:[string] }
 *   sym  = 登记单位（基字母，或 `\gamma`、`\mathbb{R}` 这种整体）
 *   full = 带下标/上标的原样（`K_p`、`T_{s}`），只作证据
 */
export function symbolsOf(text) {
  const syms = [];
  const bareFunc = [];
  const caps = [];
  let t = text;
  for (const m of t.matchAll(RE_BB)) syms.push({ sym: `\\${m[1]}{${m[2]}}`, base: `\\${m[1]}{${m[2]}}`, full: m[0] });
  t = t.replace(RE_BB, " ");
  t = t.replace(RE_TEXTLIKE, " ");
  t = t.replace(RE_ENV, " ");
  t = t.replace(RE_CMD, (m0, name) => {
    if (GREEK.has(name) || TEX_SYMBOLIC.has(name)) syms.push({ sym: `\\${name}`, base: `\\${name}`, full: m0 });
    return " ";
  });
  for (const m of t.matchAll(RE_RUN)) {
    const run = m[0];
    const letters = /^[A-Za-z]+/.exec(run)[0];
    if (letters.length === 1) {
      syms.push({ sym: letters, base: letters, full: run });
      continue;
    }
    if (/^[a-z]+$/.test(letters) && BARE_FUNC.has(letters)) bareFunc.push(letters);
    // 全大写多字母连写有歧义：$BK$、$LC$、$AB$ 是矩阵连乘（该逐字母记），
    // 而 $PM$、$GM$ 是「相位裕度 / 增益裕度」的缩写（记成 P·M 就是给 P、M 各灌几百次假命中）。
    // 光看字面分不开，所以先原样收集起来交给 `abbrs` 子命令列证据，再据实决定哪些进 CAPS_ABBREV。
    if (/^[A-Z]{2,}$/.test(letters)) caps.push({ run: letters, full: run });
    if (!CAPS_ABBREV.has(letters)) {
      // 其余多字母连写（ml^2、dt、bk_1）是变量连乘，逐个记字母才是对的
      for (const ch of letters) syms.push({ sym: ch, base: ch, full: run });
    } else {
      syms.push({ sym: letters, base: letters, full: run });
    }
  }
  return { syms, bareFunc, caps };
}

// ---------------------------------------------------------------- 术语

const CJK = "\\u4e00-\\u9fff";
/**
 * markdown 粗体的星号。实测（掩码后正文，56 门课 15246 处短括注，其中 1236 处与 `*` 相邻）
 * 星号可能落在**四个**位置，各自的处置都不一样：
 *
 *  | 位置 | 处数 | 例子 | 处置 |
 *  |---|---|---|---|
 *  | 括外前侧 | 895 | `**多输入多输出**（MIMO）` | **必须放行**，见下 |
 *  | 括外后侧 | 446 | `**反算（back-calculation）**` | 与匹配无关，正则从括注内部起匹配即可 |
 *  | 括内开头 | 14 | `（**稳定性**）` | 放行（形状合法，今日 0 条真术语，为 C/D 的 85 门课留） |
 *  | 括内结尾 | 29 | `（**稳定性**）` 的后半 | 放行（同上） |
 *
 * 括外前侧为什么必须放行：`**术语**（English）` 是本语料**最主流的定义写法**，实测 149 处
 * （`grep -roE "[一-龥]{2,12}\*\*[（(][A-Za-z][^）)]{1,40}[)）]" content` ）。
 * 原判据要求中文紧邻 `（`，于是这 149 处**一个都抽不到**——被漏掉的恰好是
 * `**多输入多输出**（MIMO）`、`**增益调度**（Gain Scheduling）`、`**无扰动切换**（bumpless transfer）`、
 * `**反饱和**（back-calculation）` 这类**最正式的术语首次定义**，留下来的反而是表格单元格与
 * 小节标题里的同位语注解。这不是「少抽一点」，是**抽样有偏**：03-glossary.md 会建立在
 * 偏向残渣的样本上（同 E2：判据依赖被检对象的字面形状 ⇒ 静默少测）。
 * 真仓库实测：加之前 205 条术语 / 38 条冲突，加之后 305 条 / 52 条（unit-probe E9–E11 钉住）。
 *
 * 上限 3 个星号是为了 `***粗斜体***`；`_斜体_` 本语料 0 处，不收
 * （收了会与数学下标 `_` 打架，unit-probe E12 钉住）。
 */
const EMPH = "(?:\\*{1,3})?";
/** 括号里必须是**纯拉丁**内容才算「中英对照」；含 CJK、含 = 或 { 的一律不是（模板碎片） */
const RE_EN_PAREN = new RegExp(`([${CJK}][${CJK}A-Za-z0-9·\\-]{1,24})${EMPH}\\s*[（(]\\s*${EMPH}\\s*([A-Za-z][A-Za-z0-9 ,'’\\-.&/+()]*?)${EMPH}\\s*[)）]`, "g");
/**
 * `English（中文）` 这一支的英文侧**要求首字母大写**，是量过的口径，不是疏忽。
 * 把 `[A-Z]` 放宽成 `[A-Za-z]` 后真仓库从 71 处涨到 86 处，多出的 15 处里只有 `dB|分贝`
 * 1 条是真术语，其余 14 条全是单位与英文词的顺手注解：
 *   `kHz|快速`、`kHz|中速`、`atm|安全阀`、`dec|高频`（来自 `-20 dB/dec（高频）`）、
 *   `active|推力不够用`、`inactive|推力充裕`、`set|控制不变集`、`start|每步从零开始`、
 *   `starting|上一课讨论的`、`anti-windup|事后修补`、`nullcline|两条零斜率曲线`、
 *   `dither|抖振激励`、`dB|所有频率`（块级数学里的碎片）。
 * 93% 假阳，还会凭空造出 kHz / dB / start 三条假「一英多中」冲突，把真冲突埋掉。
 * 依据：本语料里 `English（中文）` 专用于**缩写词首次定义**（ZOH、MPC、LQR…），缩写按惯例
 * 首字母大写；小写起头的拉丁串在中文括注前几乎总是单位或英文词解释。
 * 漏掉的 `dB（分贝）` 没有真丢——dB 已由 `增益（dB）`（RE_EN_PAREN）进表并被 NOISE 签字。
 * unit-probe E14 钉住这条。
 */
const RE_ZH_PAREN = new RegExp(`([A-Z][A-Za-z0-9\\-]{1,24})${EMPH}\\s*[（(]\\s*${EMPH}\\s*([${CJK}]{2,24})${EMPH}\\s*[)）]`, "g");
/**
 * `中文/English`。实测**精度 0%**：全仓 205→305 条里只有 7 条是这一支独家贡献的，
 * 7 条全是假阳——`/` 在这里表示「或」而不是译名对照：`自适应/tuning function`、
 * `用相平面/Poincaré`、`圆判据/Lyapunov`、`最后才考虑变量梯度/Krasovskii`、
 * `换成四元数/MRP`、`必须用滑模/Filippov`、`边界层/tanh`。它还制造了 `滞后|PID`
 * （来自 `（超前/滞后/PID）`）与 `边界层|STA`（来自 `用边界层/STA 或换方法`）两条假冲突。
 * **仍然保留**：C/D 阶段还要写约 85 门课，`零阶保持器/ZOH` 这种写法迟早会出现，
 * 删了就是留一个静默盲区；代价是这 7 条要逐条在 03-glossary.md 的 NOISE 表签字。
 * unit-probe E3 钉住正向能力。
 */
const RE_SLASH = new RegExp(`([${CJK}]{2,16})/([A-Za-z][A-Za-z \\-]{1,30})`, "g");

/**
 * 中文侧的裁剪与判废。
 *
 * 为什么需要：`X（ABBR）` 在中文技术写作里**绝大多数是同位语注解，不是译名对照**。
 * 实测不裁剪时「一英多中」36 条里前 13 条全是这种噪声——
 *   LQR → 控制 | 最优控制 | 线性二次型 | 对增广系统 | 无限时域
 *   PID → 滞后 | 直接优化 | 经典控制 | 不抵消非线性 | 含积分
 *   Hz  → 滤波器通带内 | 快速 | 中速 | 慢速 | 频率
 * 这些「中文」是括号**前面那句话的尾巴**，不是 LQR 的译名。真噪声会把 03-glossary.md
 * 的「别名」列变成垃圾场，而一张有一半假条目的表比没有表更糟（郑核会开始无视它，
 * 同 E2「假 FAIL 会让人无视整张报告」）。
 *
 * 三条判据，都按实测调过：
 *   L1 先剥掉句首的动词/连词/指代（`采用抗饱和（anti-windup）` → `抗饱和`），
 *      剥到剩下 ≥2 字为止；剥不动就整体判废。
 *   L2 剥掉句尾的虚词（`…的（X）`、`…是（X）`）。
 *   L3 裁剪后长度必须在 2–10 字：`控制器在饱和时必须加抗饱和`（13 字）、
 *      `假设控制输入经过零阶保持器`（13 字）这类整句一律判废。
 */
const LEAD_STOP = ["采用", "使用", "利用", "通过", "基于", "引入", "称为", "叫做", "所谓", "一种",
  "这个", "那个", "我们", "本节", "本文", "本课", "需要", "可以", "必须", "应该", "考虑", "假设",
  "例如", "比如", "其中", "以及", "并且", "如果", "由于", "为了", "下面", "上面", "通常", "一般",
  // 下面 8 个是 E4 实测补的：56 门课里 `Chinese（English）` 抓到的从句残渣，实测样例写在括号里
  "根据", "按照", "依据", "应用", "转化为", "化为", "位于", "对应",   // （根据基尔霍夫电压定律（KVL））
  "处的", "时的",                                                   // （滤波器通带内 20dB 处的增益（dB））
  "这", "那", "它", "其", "即", "用", "选", "取", "把", "将", "对", "从", "在", "是", "和", "与",
  "或", "等", "而", "但", "就", "都", "也", "又", "的", "了", "被", "使", "让", "按", "经", "至", "到"];
/**
 * LEAD_STOP 里的单字**也可能是词的前半**，此时不能剥。与 TAIL_KEEP 对称。
 *
 * E4 实测（56 门课，被剥过首字的候选共 50 种 / 56 处，其中 **4 种 / 5 处是真错**）：
 *   `被控变量（CV）`        → 控变量   ← 错（mpc-case-study，2 处）
 *   `经济MPC（Economic MPC）` → 济MPC   ← 错（receding-horizon，1 处）
 *   `经典控制（PID）`       → 典控制   ← 错（state-observer，1 处）
 *   `到达阶段（reaching phase）` → 达阶段 ← 错（sliding-mode-control，1 处）
 * 其余 51 处剥对了（`的/和/用/在/通过/从而/考虑/需要/转化为/时的/处的/对/是/根据/或/必须用/就用…`），
 * 所以不能简单把这几个单字从 LEAD_STOP 删掉——删了那 51 处就全变成残渣。
 *
 * 危害与 TAIL_KEEP 那条一样，不是显示难看：`典控制` 会写进 03-glossary.md 的「中文标准译名」列，
 * C2 门槛随即把它当成已登记的正确译名**永久固化**下来。
 *
 * 表里其余条目按同族词补（对角/对数/对偶/对称、等效/等倾线/等价、经验/经过、被动/到底），
 * 当前语料 0 命中，但 C/D 还要加约 85 门课——
 * `等倾线（isocline）`、`对角化（diagonalization）`、`对数坐标（log scale）` 都是相平面/频域课的必用词。
 */
const LEAD_KEEP = new Set([
  "被控", "被动", "被测",
  "到达", "到底", "到位",
  "经典", "经济", "经验", "经过",
  "对角", "对数", "对偶", "对称", "对象", "对比",
  "等效", "等倾", "等价", "等距", "等式", "等值", "等幅",
  "选取", "取样", "取反", "使能",
]);
const TAIL_STOP = "的了是在和与或等而就都也又而但即之其此该所以于给向把被将対从到使让按经用";
/**
 * TAIL_STOP 里的字**也可能是词的后半**，此时不能裁。
 *
 * E4 实测（56 门课，只 5 处被裁尾，其中 2 处是真错）：
 *   `抗积分饱和（anti-windup）` → 抗积分饱   ← 错，饱和是一个词（compensator-design.mdx）
 *   `抗饱和（anti-windup）`     → 抗饱       ← 错（nonlinear-characteristics.mdx）
 *   `这就是积分饱和`            → 积分饱     ← 错（同上）
 *   `猛推一把`                  → 猛推一     ← 本就是残渣，裁不裁都该由 NOISE 表签字
 *   `这也解释了`                → 解释       ← 侥幸裁对了
 * 危害不是显示难看：03-glossary.md 的「中文标准译名」列会写进 `抗积分饱`，
 * C2 门槛随即把它当成已登记的正确译名**永久固化**下来。
 *
 * 表里其余条目是按同族词补的（作用/应用、方向/正向、属于/等于、因此、从而、存在、目的、神经、达到…），
 * 当前语料 0 命中，但 C/D 还要加约 85 门课——这些字结尾的术语几乎必然出现。
 */
const TAIL_KEEP = new Set([
  "饱和", "调和", "缓和", "平和", "温和", "中和",
  "作用", "效用", "功用", "应用", "引用", "采用", "使用", "利用", "共用", "通用", "专用", "复用", "适用", "动用",
  "方向", "正向", "逆向", "反向", "同向", "双向", "单向", "定向", "取向",
  "属于", "等于", "由于", "对于", "关于", "位于", "至于", "介于", "趋于", "优于",
  "可以", "所以", "得以", "足以", "因此", "由此", "至此",
  "之后", "之前", "反之", "总之", "随之",
  "从而", "进而", "继而", "存在", "现在", "所在", "目的", "相等", "不等", "均等", "对等",
  "神经", "已经", "即使", "促使", "迫使", "驱使", "达到", "服从", "参与", "立即", "但是", "只是",
  "场所", "处所", "极其", "避让", "转让", "供给", "配给", "成就", "首都", "不但",
]);

/** 返回裁剪后的中文术语；判废则返回 null */
export function cleanZhTerm(raw) {
  let s = raw.trim();
  for (let guard = 0; guard < 8; guard++) {
    if (LEAD_KEEP.has(s.slice(0, 2))) break;   // 首字是词的前半（被控 / 经典 / 到达…），不剥
    const hit = LEAD_STOP.find((w) => s.startsWith(w));
    if (!hit) break;
    const rest = s.slice(hit.length);
    if (rest.length < 2) return null;
    s = rest;
  }
  for (let guard = 0; guard < 6 && s.length > 2; guard++) {
    if (!TAIL_STOP.includes(s[s.length - 1])) break;
    if (TAIL_KEEP.has(s.slice(-2))) break;   // 尾字是词的后半（饱和 / 作用 / 方向…），不裁
    s = s.slice(0, -1);
  }
  if (s.length < 2 || s.length > 10) return null;
  return s;
}

const normEn = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const normZh = (s) => s.replace(/[\s·]/g, "");
/** 统一归一键：含汉字走 normZh，纯拉丁走 normEn(enKey)。登记表与扫描结果都过它，才能直接比。 */
const nk = (s) => /[\u4e00-\u9fff]/.test(s) ? normZh(s) : normEn(enKey(s));

// 「全称, 缩写」括号里那一段是**一个**术语的两种写法，不是两个英文名。
const INITIALISM_SKIP = new Set(["of", "the", "and", "for", "in", "to", "a", "an", "on", "with"]);
function isInitialism(full, abbr) {
  const letters = abbr.replace(/[^A-Z0-9]/g, "");
  if (!letters) return false;
  const initials = full.split(/[\s\-]+/).filter((w) => w && !INITIALISM_SKIP.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase()).join("");
  return initials === letters;
}

/**
 * 术语的英文**归一键**：若括号内是「全称, 缩写」且缩写确实是全称的首字母缩略，则用缩写当键。
 *
 * E4 实测动机：56 门课里「一中多英」12 条中有 6 条是这种写法差异
 * （模型预测控制 → `MPC` | `Model Predictive Control, MPC`；实时迭代 → `RTI` | `Real-Time Iteration, RTI`；
 * 交替方向乘子法 → `ADMM` | `Alternating Direction Method of Multipliers, ADMM`；序列二次规划、广义最小方差控制同理）。
 * 它们不是「同一概念有多种叫法」，登记进 03-glossary.md 只会把真冲突埋掉。
 * 但**不能**简单按逗号取最后一段：`Natural Evolution Strategies, NES` 与 `Evolution Strategies`
 * 是两个不同算法却都译作「进化策略」，那是一条真冲突，必须留下——所以加了 isInitialism 判据。
 */
export function enKey(raw) {
  const s = raw.trim();
  const parts = s.split(",").map((x) => x.trim()).filter(Boolean);
  if (parts.length < 2) return s;
  const last = parts[parts.length - 1];
  const head = parts.slice(0, -1).join(" ");
  return /^[A-Z0-9][A-Z0-9\-]{1,7}$/.test(last) && isInitialism(head, last) ? last : s;
}

/**
 * 抽中英对照术语。三种写法都收：
 *   中文（English）· English（中文）· 中文/English
 * 括号内必须是**纯拉丁**内容：含 CJK 的 `（I 型系统）`、含 = 或 {} 的 `（Ts={Ts}s）`
 * （后者是 JSX 模板字面量碎片，掩码失效时才会出现）都不收。
 *
 * **但 ≥2 字母这条挡不住单位**：`（dB）` 会被当成术语抽出来，实测全仓 4 处
 * （`增益（dB）`、`幅值（dB）`），于是 `db` 成了一条「一英多中」冲突。
 * 这不是要修的 bug——dB 确实是同一写法对应两种中文语境，它属于**该由人签字的残渣**，
 * 走 03-glossary.md 的 NOISE 表。想把单位挡在抽取阶段就得列一张单位表，
 * 而那张表会和 NOISE 表重复，还要随课程增长维护两处。
 */
export function termsOf(masked) {
  const out = [];
  for (const m of masked.matchAll(RE_EN_PAREN)) {
    const en = m[2].trim();
    if (en.replace(/[^A-Za-z]/g, "").length < 2) continue;
    const zh = cleanZhTerm(m[1]);
    if (!zh) continue;
    out.push({ zh, en, form: "zh(en)" });
  }
  for (const m of masked.matchAll(RE_ZH_PAREN)) {
    const zh = cleanZhTerm(m[2]);
    if (!zh) continue;
    out.push({ zh, en: m[1].trim(), form: "en(zh)" });
  }
  for (const m of masked.matchAll(RE_SLASH)) {
    const en = m[2].trim();
    if (en.replace(/[^A-Za-z]/g, "").length < 2) continue;
    const zh = cleanZhTerm(m[1]);
    if (!zh) continue;
    out.push({ zh, en, form: "zh/en" });
  }
  return out;
}

/** 定义线索：符号后面紧跟「为 / 是 / 表示 / 即」时，取到下一个标点为止作为该符号的释义 */
const RE_GLOSS_TAIL = /^\s*(?:为|是|表示|即|代表|指)\s*([^，。；、\n）)]{2,40})/;
const RE_DEF_CUE = /其中|式中|这里|表示|定义为|称为|记为|记作|：/;

// ---------------------------------------------------------------- 扫描

function lessonList(target) {
  const all = walk(P_CONTENT, (p) => p.endsWith(".mdx")).map(rel).sort();
  if (!target || target === "--all") return all;
  const t = target.replace(/\\/g, "/").replace(/\.mdx$/, "");
  const hit = all.filter((f) => f === `content/${t}.mdx` || f.endsWith(`/${t}.mdx`));
  return hit;
}

function scanOne(file) {
  const src = readFileSync(join(ROOT, file), "utf8");
  const masked = maskNonProse(src);
  const lines = linesOf(src);
  const rec = {
    lesson: file.replace(/^content\//, "").replace(/\.mdx$/, ""),
    file, lines: lines.length,
    math: { inline: 0, block: 0 },
    symbols: {},      // sym -> { count, fulls:{}, glosses:{}, contexts:[] }
    bareFunc: {},     // 漏反斜杠的函数名 -> count
    caps: {},         // 全大写多字母连写 -> { count, ctx }（缩写 vs 矩阵连乘的证据，见 CAPS_ABBREV）
    transpose: 0,     // ^T / ^{T} 的次数（T 的一义：转置）
    terms: {},        // normEn -> { zh:{}, en:{}, count, forms:{} }
    zhIndex: {},      // normZh -> { en:{}, count }
  };
  const spans = mathSpans(masked);
  for (const sp of spans) {
    rec.math[sp.kind === "block" ? "block" : "inline"]++;
    const line = lineAt(src, sp.start);
    const lineText = (lines[line - 1] || "").trim();
    const { syms, bareFunc, caps } = symbolsOf(sp.text);
    for (const f of bareFunc) rec.bareFunc[f] = (rec.bareFunc[f] || 0) + 1;
    for (const c of caps) {
      const e = (rec.caps[c.run] ||= { count: 0, courses: 0, ctx: null });
      e.count++;
      if (!e.ctx) e.ctx = { line, text: lineText.slice(0, 150) };
    }
    rec.transpose += (sp.text.match(RE_TRANSPOSE) || []).length;
    // 释义归属：**只有当这个跨度里恰好一个符号基**时才把「为/是/表示…」后面的话记给它。
    // 否则 `$[B, AB, \ldots, A^{n-1}B]$ 为可控性矩阵` 会把「可控性矩阵」同时记给
    // A、B、n 三个符号——实测这条噪声让 a/b/x/t/r/m 的释义候选全都混进了同一句话。
    const bases = new Set(syms.map((s) => s.base));
    const tail = bases.size === 1 ? RE_GLOSS_TAIL.exec(masked.slice(sp.end, sp.end + 60)) : null;
    const gloss = tail ? tail[1].trim() : null;
    const seen = new Set();
    for (const s of syms) {
      const key = s.sym;
      const e = (rec.symbols[key] ||= { count: 0, fulls: {}, glosses: {}, contexts: [], firstLine: line });
      e.count++;
      if (s.full !== s.sym) e.fulls[s.full] = (e.fulls[s.full] || 0) + 1;
      if (!seen.has(key) && e.contexts.length < 4 && RE_DEF_CUE.test(lineText)) {
        e.contexts.push({ line, text: lineText.slice(0, 160) });
        seen.add(key);
      }
      if (gloss && bases.size === 1) e.glosses[gloss] = (e.glosses[gloss] || 0) + 1;
    }
  }
  for (const t of termsOf(masked)) {
    const ne = normEn(enKey(t.en));   // 「全称, 缩写」按缩写归键，见 enKey 注释
    if (!ne) continue;
    const e = (rec.terms[ne] ||= { zh: {}, en: {}, count: 0, forms: {} });
    e.count++;
    e.zh[t.zh] = (e.zh[t.zh] || 0) + 1;
    e.en[t.en] = (e.en[t.en] || 0) + 1;
    e.forms[t.form] = (e.forms[t.form] || 0) + 1;
    const nz = normZh(t.zh);
    const z = (rec.zhIndex[nz] ||= { en: {}, count: 0, raw: t.zh });
    z.count++;
    z.en[t.en] = (z.en[t.en] || 0) + 1;
  }
  return rec;
}

function scanAll(target) {
  const files = lessonList(target);
  if (!files.length) { say(`FAIL  在 ${rel(P_CONTENT)} 下找不到匹配 ${target || "--all"} 的 .mdx`); process.exit(2); }
  return files.map(scanOne);
}

// ---------------------------------------------------------------- 汇总与冲突

function topKeys(obj, n) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n);
}

function summarize(recs) {
  const sym = {};      // base -> { total, courses:Set, glosses:{}, fulls:{}, contexts:[] }
  const term = {};     // normEn -> { zh:Set, en:Set, courses:Set, total, forms:{} }
  const zhIx = {};     // normZh -> { en:Set, courses:Set, total }
  const bare = {};
  const caps = {};     // 全大写连写 -> { total, courses:Set, ctx }
  let transpose = 0;
  const transposeByCourse = {};
  for (const r of recs) {
    transpose += r.transpose;
    if (r.transpose) transposeByCourse[r.lesson] = r.transpose;
    for (const [k, e] of Object.entries(r.symbols)) {
      const s = (sym[k] ||= { total: 0, courses: new Set(), glosses: {}, fulls: {}, contexts: [] });
      s.total += e.count;
      s.courses.add(r.lesson);
      for (const [g, n] of Object.entries(e.glosses)) s.glosses[g] = (s.glosses[g] || 0) + n;
      for (const [f, n] of Object.entries(e.fulls)) s.fulls[f] = (s.fulls[f] || 0) + n;
      for (const c of e.contexts) if (s.contexts.length < 8) s.contexts.push({ lesson: r.lesson, ...c });
    }
    for (const [k, e] of Object.entries(r.terms)) {
      const t = (term[k] ||= { zh: {}, en: {}, courses: new Set(), total: 0, forms: {} });
      t.total += e.count;
      t.courses.add(r.lesson);
      for (const [z, n] of Object.entries(e.zh)) {
        const v = (t.zh[z] ||= { total: 0, courses: new Set() });
        v.total += n; v.courses.add(r.lesson);
      }
      for (const [x, n] of Object.entries(e.en)) {
        const v = (t.en[x] ||= { total: 0, courses: new Set() });
        v.total += n; v.courses.add(r.lesson);
      }
      for (const [f, n] of Object.entries(e.forms)) t.forms[f] = (t.forms[f] || 0) + n;
    }
    for (const [k, e] of Object.entries(r.zhIndex)) {
      const z = (zhIx[k] ||= { en: {}, courses: new Set(), total: 0, raw: e.raw });
      z.total += e.count;
      z.courses.add(r.lesson);
      for (const [x, n] of Object.entries(e.en)) {
        const v = (z.en[x] ||= { total: 0, courses: new Set() });
        v.total += n; v.courses.add(r.lesson);
      }
    }
    for (const [k, n] of Object.entries(r.bareFunc)) bare[k] = (bare[k] || 0) + n;
    for (const [k, e] of Object.entries(r.caps)) {
      const c = (caps[k] ||= { total: 0, courses: new Set(), ctx: null });
      c.total += e.count;
      c.courses.add(r.lesson);
      if (!c.ctx && e.ctx) c.ctx = { lesson: r.lesson, ...e.ctx };
    }
  }
  return { sym, term, zhIx, bare, caps, transpose, transposeByCourse };
}

/** 变体是否「站得住」：≥2 次，或跨 ≥2 门课。
 *  **只作显示标记，不参与冲突判定**（E4 实测教训见下）。 */
const solid = (v) => v.total >= 2 || v.courses.size >= 2;
const fmtVariant = (map) => Object.entries(map)
  .sort((a, b) => b[1].total - a[1].total)
  .map(([k, v]) => `${k}(${v.total}/${v.courses.size}门)`);

/** JSON 出口用的结构化变体（--out 的下游是生成两份 docs，不能只给格式化字符串） */
const jsonVariant = (map) => Object.entries(map)
  .sort((a, b) => b[1].total - a[1].total)
  .map(([k, v]) => ({ raw: k, total: v.total, courses: [...v.courses].sort() }));

/**
 * 同一英文对应多个中文译名（真·多译名），或同一中文对应多个英文。
 * 返回的 zh / en 是变体 map（{ raw: {total, courses:Set} }），fmtVariant / jsonVariant 直接吃。
 *
 * **为什么不按频次过滤变体**（E4 实测，2026-09-26）：
 * 曾加过一道 `solid()` 门槛——只留「≥2 次或跨 ≥2 门」的变体，本意是甩掉同位语残渣。
 * 实测结果是 56 门课 **一英多中 31 → 0 条、一中多英 12 → 0 条**：每一条冲突都恰好有
 * 一个变体只出现一次，滤掉后只剩一个变体，于是「冲突」凭空消失——
 * 而消失的里面包括 `ZOH → 零阶保持器 | 采样保持器`、`Loop Shaping → 环路整形 | 回路整形法 | 频率整形`、
 * `RMS → 速率单调调度 | 均方根` 这些**真冲突**（低频恰恰是「只有一门课这么叫」的正常形态）。
 * 这是 E2「判据依赖被检对象的字面形状 → 门槛静默变成永远 PASS」的镜像版：
 * 门槛报 0 冲突看起来最绿，实际什么都没测。
 * 所以判据回到「变体数 > 1 即报」，噪声交给 cleanZhTerm 的裁剪规则和 03-glossary.md 的人工裁决，
 * 而不是交给一个会让整张表变空的阈值。solid() 保留下来只做显示标记（terms/conflicts 里打 *）。
 */
function aliasConflicts(sum) {
  const enToZh = [];
  for (const [k, t] of Object.entries(sum.term)) {
    if (new Set(Object.keys(t.zh).map(normZh)).size > 1) {
      enToZh.push({ key: k, en: t.en, zh: t.zh, courses: [...t.courses], total: t.total });
    }
  }
  const zhToEn = [];
  for (const [k, z] of Object.entries(sum.zhIx)) {
    if (new Set(Object.keys(z.en).map((x) => normEn(enKey(x)))).size > 1) {
      zhToEn.push({ key: k, zh: z.raw, en: z.en, courses: [...z.courses], total: z.total });
    }
  }
  enToZh.sort((a, b) => b.total - a.total);
  zhToEn.sort((a, b) => b.total - a.total);
  return { enToZh, zhToEn };
}

// ---------------------------------------------------------------- 登记表解析

/**
 * 取两个哨兵之间的正文。**哨兵必须独占一行**（trim 后整行相等），不能用 `text.indexOf`。
 *
 * 这是实测出来的坑，不是假想：04-notation.md 的头部说明里为了警告别人「别在正文写全哨兵」，
 * 自己把 `<!--` + `ABBREV-START` + `-->` 完整写了一遍；`indexOf` 取第一次出现，
 * 于是切片从那句警告开始、到真哨兵结束，把 §0/§1/§2/§3 的全部表格都当成了 ABBREV 块。
 * 当轮**恰好**只有 PM、GM 两行的第 1 列匹配 `^[A-Z0-9]{2,}$`，所以结果与正确切片一致——
 * 判据静默失效却输出正确数字，是最难发现的那类坏（同 E2「绿 ≠ 在测量」）。
 * 后来 §5-1 又一次写字面，同一个坑踩了第二遍。
 *
 * 改成「独占一行」后，正文里怎么引用哨兵都无所谓（散文里的哨兵永远不独占一行），
 * 文档也就可以直接用真字符串把这个坑讲清楚，不必再靠「只写名字不写注释语法」的纪律。
 */
export function sentinelSlice(text, start, end) {
  const lines = linesOf(text);
  let a = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (a < 0) { if (t === start) a = i; continue; }
    if (t === end) return lines.slice(a + 1, i).join("\n");
  }
  return null;
}

function registerBlock(text) {
  return sentinelSlice(text, REG_START, REG_END);
}

/**
 * 把一个 markdown 表格切成行数组（每行是 trim 过的单元格数组），**丢掉分隔行与它上面的表头行**。
 *
 * 表头必须丢：e4-fixture 实测，NOISE 表的表头 `| 变体 | 判定 | 依据 |` 会被当成一条残渣签字，
 * C2b 于是报「NOISE 表里有 1 条本轮 0 命中：变体」；REGISTER 表的表头同理，
 * 五个列名会往 known 里灌 4 个假键（实测「登记表 15 键」里就有这 4 个）。
 * 假键通常无害，但它让「登记表 N 键」这个数变成假的；而且哪天某个列名恰好等于一个真变体，
 * C2 就会假 PASS（E2：判据不能依赖字面形状的巧合）。
 *
 * 判据用「分隔行的上一行」而不是「块内第一行」：一个哨兵块里可以有多个表格，每张都有自己的表头。
 *
 * **按裸 `|` 切，不认 markdown 的 `\|` 转义**：单元格里出现竖线就会整行错列。E4 实测两处真错——
 * 04-notation.md 的 $\sigma$ 行写了 `$\sigma=|\mathrm{Re}(s)|$`（裸竖线）、$\gamma$ 行写了
 * `$\|T_{zw}\|_\infty$`（转义竖线），两行的第 3 列都被挤到后面，`rows notation --diff` 于是报
 * 「[缺行] \gamma / [缺行] \sigma」而退出码 1。所以登记表单元格里的绝对值/范数一律写
 * `\lvert…\rvert` / `\lVert…\rVert`。**不在这里加解转义**：`--diff` 已经能抓住后果，
 * 再加一层转义处理只会让「第 N 列」的定义变得依赖上下文（同 E2 的字面形状教训）。
 */
export function tableRows(block) {
  const raw = linesOf(block)
    .filter((l) => /^\s*\|/.test(l))
    .map((l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim()));
  const isSep = (cells) => /^[-: ]*$/.test(cells.join(""));
  const drop = new Set();
  raw.forEach((cells, i) => { if (isSep(cells)) { drop.add(i); if (i > 0) drop.add(i - 1); } });
  return raw.filter((cells, i) => !drop.has(i) && cells.length >= 2);
}

/**
 * 从 04-notation.md 的 ABBREV 块读「全大写连写 = 缩写」的判定表（见 CAPS_ABBREV 注释）。
 * 缺文件 / 缺哨兵 → 空集：此时所有全大写连写都按矩阵连乘拆成单字母，
 * check 的 C5 会把这件事连同 caps 连写的规模一起 WARN 出来，不会静默。
 */
function loadAbbrevSet() {
  const text = readIfExists(P_NOTATION);
  if (text == null) return new Set();
  const block = sentinelSlice(text, ABBREV_START, ABBREV_END);
  if (block == null) return new Set();
  const set = new Set();
  for (const cells of tableRows(block)) {
    const v = cells[0].trim().replace(/\*\*/g, "").replace(/^`|`$/g, "").replace(/^\$|\$$/g, "").trim();
    if (/^[A-Z0-9]{2,}$/.test(v)) set.add(v);
  }
  return set;
}

/**
 * 登记表第 1 列里的一个符号写法。三种形态都要认：
 *   `$T$` → T · `$\gamma$` → \gamma · `$\mathbb{R}$` → \mathbb{R} · `$PM$` → PM（缩写，见 ABBREV 块）
 * 花体那条是实测出来的坑：原判据只写 `\\[A-Za-z]+`，于是 `$\mathbb{R}$` 被解析成 `\mathbb`，
 * 而 symbolsOf 产出的基是 `\mathbb{R}`——两边对不上，C1 会对全仓 10 门的 `\mathbb{R}`、
 * 5 门的 `\mathcal{C}` 之类永久 FAIL，且 FAIL 信息里那个符号在登记表里明明看得见
 * （这种「表里写着却报未登记」最容易被当成脚本抽风而整个忽略掉，同 E2 的假 FAIL）。
 */
const RE_SYM_CELL = /\$?\s*(\\(?:mathbb|mathcal|mathfrak)\s*\{\s*[A-Za-z]\s*\}|\\[A-Za-z]+|[A-Za-z]{1,3})\s*\$?/;

/** 从 04-notation.md 的登记表里取出已登记的符号基集合 */
function loadNotationRegister() {
  const text = readIfExists(P_NOTATION);
  if (text == null) return null;
  const block = registerBlock(text);
  if (block == null) return null;
  const set = new Set();
  for (const cells of tableRows(block)) {
    // 第 1 列形如 `$T$` 或 `$\gamma$`；容忍一格写多个（、 或 , 或 / 分隔）
    for (const part of cells[0].split(/[、,\/]/)) {
      const m = RE_SYM_CELL.exec(part.trim());
      if (m) set.add(m[1].replace(/\s+/g, ""));
    }
  }
  return set;
}

/**
 * 从 03-glossary.md 里取两张表：
 *   REGISTER 块 = 术语登记表（第 1 列中文标准译名、第 2 列英文、第 3 列已裁决保留的别名）
 *   NOISE 块    = **人工判定为抽取残渣**的变体（从句片段、notebook 标号之类）
 *
 * 为什么要单独一张 NOISE 表：E4 曾想用「变体出现 <2 次就不算一种叫法」的阈值把残渣滤掉，
 * 实测发现它连同 `ZOH → 零阶保持器|采样保持器` 这类真冲突一起滤成了 0 条（详见 aliasConflicts 注释）。
 * 阈值做不到「只滤残渣」，所以改成：**残渣照报，但必须有人签字**。
 * 一条变体要么进登记表（承认为一种叫法），要么进 NOISE 表（承认是残渣），二者皆无 → C2 FAIL。
 * 这样判据不再依赖变体的字面形状，且每一次「这是噪声」的判断都留下了可追溯的记录。
 *
 * 返回值里的键都过 nk()，所以 known / noise 可以直接和扫描结果比。
 */
function loadGlossaryRegister() {
  const text = readIfExists(P_GLOSS);
  if (text == null) return null;
  const block = registerBlock(text);
  if (block == null) return null;
  const known = new Set();
  const cell = (v) => v.trim().replace(/\*\*/g, "").replace(/^`|`$/g, "");
  const addAll = (s) => { for (const part of (s || "").split(/[、,;；\/]/)) { const v = cell(part); if (v && v !== "—" && v !== "-") known.add(nk(v)); } };
  for (const cells of tableRows(block)) {
    addAll(cells[0]);            // 中文标准译名
    addAll(cells[1]);            // 英文（含「全称, 缩写」写法）
    addAll(cells[2]);            // 已裁决保留的别名
  }
  const noise = new Set();
  const nblock = sentinelSlice(text, NOISE_START, NOISE_END);
  if (nblock != null) {
    // 只读第 1 列：NOISE 表的第 2、3 列是「判定理由 / 依据出处」，
    // 全列都收会把理由文字也当成变体键，于是 C2 可能因为一句理由碰巧等于某个变体而假 PASS。
    for (const cells of tableRows(nblock)) {
      const v = cell(cells[0]);
      if (v && v !== "—" && v !== "-") noise.add(nk(v));
    }
  }
  return { known, noise };
}

// ---------------------------------------------------------------- 命令

function fmtCourses(set, max = 6) {
  const a = [...set].sort();
  return a.length > max ? `${a.slice(0, max).join(", ")} 等 ${a.length} 门` : a.join(", ");
}

function cmdScan() {
  const target = POSITIONAL[1] || "--all";
  const recs = scanAll(target);
  const sum = summarize(recs);
  const conf = aliasConflicts(sum);
  if (OUT) {
    const json = JSON.stringify({
      root: rel(ROOT), courses: recs.length,
      math: recs.reduce((a, r) => ({ inline: a.inline + r.math.inline, block: a.block + r.math.block }), { inline: 0, block: 0 }),
      transpose: { total: sum.transpose, byCourse: sum.transposeByCourse },
      symbols: Object.entries(sum.sym).map(([k, v]) => ({ sym: k, total: v.total, courses: [...v.courses].sort(), glosses: topKeys(v.glosses, 8), fulls: topKeys(v.fulls, 12), contexts: v.contexts })).sort((a, b) => b.total - a.total),
      terms: Object.entries(sum.term).map(([k, v]) => ({ key: k, en: jsonVariant(v.en), zh: jsonVariant(v.zh), total: v.total, courses: [...v.courses].sort(), forms: v.forms })).sort((a, b) => b.total - a.total),
      zhIndex: Object.entries(sum.zhIx).map(([k, v]) => ({ key: k, zh: v.raw, en: jsonVariant(v.en), total: v.total, courses: [...v.courses].sort() })).sort((a, b) => b.total - a.total),
      conflicts: { enToZh: conf.enToZh.map((c) => ({ key: c.key, en: jsonVariant(c.en), zh: jsonVariant(c.zh), total: c.total, courses: c.courses.sort() })), zhToEn: conf.zhToEn.map((c) => ({ key: c.key, zh: c.zh, en: jsonVariant(c.en), total: c.total, courses: c.courses.sort() })) },
      bareFunc: sum.bare,
      capsRuns: Object.entries(sum.caps).map(([k, v]) => ({ run: k, total: v.total, abbrev: CAPS_ABBREV.has(k), courses: [...v.courses].sort(), ctx: v.ctx })).sort((a, b) => b.total - a.total),
      perCourse: recs.map((r) => ({ lesson: r.lesson, lines: r.lines, ...r.math, transpose: r.transpose, symbols: Object.keys(r.symbols).length, terms: Object.keys(r.terms).length })),
    }, null, 2);
    writeFileSync(OUT, json, "utf8");
    say(`已写出 ${resolve(OUT).split("\\").join("/")}（${json.length} 字节）`);   // 打绝对路径：--out 常在仓库外，rel() 会给出没意义的 ../.. 串
  }
  say(`课程 ${recs.length} 门 · 行内数学 ${recs.reduce((a, r) => a + r.math.inline, 0)} · 块级数学 ${recs.reduce((a, r) => a + r.math.block, 0)}`);
  say(`符号基 ${Object.keys(sum.sym).length} 个 · 术语条目（按英文归一化）${Object.keys(sum.term).length} 条 · 中文条目 ${Object.keys(sum.zhIx).length} 条`);
  say(`一英多中 ${conf.enToZh.length} 条 · 一中多英 ${conf.zhToEn.length} 条 · 漏反斜杠函数名 ${Object.keys(sum.bare).length} 种 · 转置记号 ^T ${sum.transpose} 次`);
  if (!QUIET) {
    say("\n符号出现频次前 30：");
    for (const [k, v] of topKeys(Object.fromEntries(Object.entries(sum.sym).map(([a, b]) => [a, b.total])), 30)) {
      const s = sum.sym[k];
      say(`  ${k.padEnd(10)} ${String(s.total).padStart(5)} 次 / ${String(s.courses.size).padStart(2)} 门   释义候选：${topKeys(s.glosses, 3).map(([g, n]) => `${g}(${n})`).join("；") || "—"}`);
    }
    const lim = 25;   // 全量看 conflicts 子命令
    say(`\n一英多中（同一英文对应多个中文译名）前 ${lim === 1e9 ? "全部" : lim}：`);
    for (const c of conf.enToZh.slice(0, lim)) say(`  ${fmtVariant(c.en).join("/")} → ${fmtVariant(c.zh).join(" | ")}   ${c.total} 次 / ${c.courses.length} 门`);
    say(`\n一中多英（同一中文对应多个英文）前 ${lim === 1e9 ? "全部" : lim}：`);
    for (const c of conf.zhToEn.slice(0, lim)) say(`  ${c.zh} → ${fmtVariant(c.en).join(" | ")}   ${c.total} 次 / ${c.courses.length} 门`);
    if (Object.keys(sum.bare).length) {
      say("\n数学环境里漏反斜杠的函数名（KaTeX 会渲染成变量连乘）：");
      for (const [k, n] of topKeys(sum.bare, 20)) say(`  ${k}  ${n} 次`);
    }
  }
}

function cmdCheck() {
  const recs = scanAll("--all");
  const sum = summarize(recs);
  const conf = aliasConflicts(sum);
  const notReg = loadNotationRegister();
  const gloReg = loadGlossaryRegister();
  let fail = 0, warn = 0, pass = 0;

  say("═".repeat(80));
  say("E4 · 术语与符号登记表核对");
  say("═".repeat(80));

  // C1 符号基是否全部登记
  if (notReg == null) {
    say(`\n[FAIL] C1  读不到 ${rel(P_NOTATION)} 的登记表（缺文件或缺 ${REG_START} / ${REG_END} 哨兵）`);
    fail++;
  } else {
    const found = Object.keys(sum.sym);
    const missing = found.filter((s) => !notReg.has(s)).sort();
    if (missing.length) {
      say(`\n[FAIL] C1  ${missing.length} 个符号基未登记进 04-notation.md：`);
      for (const m of missing) say(`      ${m.padEnd(10)} ${sum.sym[m].total} 次 / ${sum.sym[m].courses.size} 门（${fmtCourses(sum.sym[m].courses, 3)}）`);
      fail++;
    } else { say(`\n[PASS] C1  扫到的 ${found.length} 个符号基全部已登记`); pass++; }
    const dead = [...notReg].filter((s) => !sum.sym[s]).sort();
    if (dead.length) {
      say(`[WARN] C1b 登记表里有 ${dead.length} 个符号本轮 0 命中：${dead.join(" ")}`);
      say(`      （要么该符号已从课程中消失，要么抽取口径变了——两种都要人看一眼，E2 教训：绿 ≠ 在测量）`);
      warn++;
    }
  }

  // C2 术语别名冲突是否都已裁决登记
  if (gloReg == null) {
    say(`\n[FAIL] C2  读不到 ${rel(P_GLOSS)} 的登记表（缺文件或缺哨兵）`);
    fail++;
  } else {
    // 「已裁决」的操作定义（两条都要满足）：
    //   ① 冲突键**有人表过态**：要么进登记表（承认它是一个术语），要么进 NOISE 表（承认它是残渣）
    //   ② 冲突里的**每一个变体**要么被登记为译名/别名，要么被写进 NOISE 表判为抽取残渣
    // 少任一条都算没裁决——②是关键，否则只登记标准译名就能让 `ZOH → 零阶保持器|采样保持器` 蒙混过关。
    //
    // ① 原本只认 `known`，是 E4 真去填表时才发现的缺陷：31 条一英多中里有 `dB`（单位）、
    // `NB1/NB2/NB3`（notebook 标号）、`PRO`（`FORCES PRO（嵌入式）` 被括号截断）这类
    // **英文侧本身就是残渣**的冲突，7 条一中多英里有 `实验结果`、`嵌入式` 这类中文侧是残渣的。
    // 只认 known 就等于逼着把 `实验结果`、`dB` 写进「单一权威表」的中文标准译名列——
    // 那张表随即对郑核失去意义（同 E2「假 FAIL 会让人无视整张报告」，这里是假权威让人无视整张表）。
    // 放宽成 known ∪ noise 后，安全性靠 ②：变体一个都不能少，每个都要有人签字。
    const adjudicated = (k) => gloReg.known.has(k) || gloReg.noise.has(k);
    const settled = (raw) => adjudicated(nk(raw));
    const openEn = conf.enToZh.filter((c) => !adjudicated(c.key) || !Object.keys(c.zh).every(settled));
    const openZh = conf.zhToEn.filter((c) => !adjudicated(c.key) || !Object.keys(c.en).every(settled));
    if (openEn.length || openZh.length) {
      say(`\n[FAIL] C2  ${openEn.length + openZh.length} 条别名冲突未在 03-glossary.md 登记裁决：`);
      for (const c of openEn.slice(0, 40)) say(`      一英多中  ${fmtVariant(c.en).join("/")} → ${fmtVariant(c.zh).join(" | ")}   ${c.total} 次 / ${c.courses.length} 门`);
      for (const c of openZh.slice(0, 40)) say(`      一中多英  ${c.zh} → ${fmtVariant(c.en).join(" | ")}   ${c.total} 次 / ${c.courses.length} 门`);
      if (openEn.length + openZh.length > 80) say(`      …另有 ${openEn.length + openZh.length - 80} 条，跑 conflicts 看全量与各自出自哪门课`);
      fail++;
    } else { say(`\n[PASS] C2  ${conf.enToZh.length + conf.zhToEn.length} 条别名冲突全部已裁决（登记表 ${gloReg.known.size} 键 + NOISE 表 ${gloReg.noise.size} 条）`); pass++; }
    // C2b NOISE 表里本轮 0 命中的条目：残渣判定了但那条变体已经不再出现（课改了或口径变了）
    const seen = new Set();
    for (const t of Object.values(sum.term)) {
      for (const z of Object.keys(t.zh)) seen.add(nk(z));
      for (const e of Object.keys(t.en)) seen.add(nk(e));
    }
    for (const z of Object.values(sum.zhIx)) for (const e of Object.keys(z.en)) seen.add(nk(e));
    const deadNoise = [...gloReg.noise].filter((k) => !seen.has(k));
    if (deadNoise.length) {
      say(`[WARN] C2b NOISE 表里有 ${deadNoise.length} 条本轮 0 命中：${deadNoise.slice(0, 20).join(" ")}`);
      say(`      （残渣判定可能已过时；同 C1b，绿 ≠ 在测量）`);
      warn++;
    }
  }

  // C3 一符号多义：同一符号基在 3 门以上课程出现且释义候选 ≥2 个不同 → 必须有裁决
  const poly = Object.entries(sum.sym)
    .map(([k, v]) => ({ k, g: Object.keys(v.glosses), courses: v.courses.size, total: v.total }))
    .filter((x) => x.g.length >= 2 && x.courses >= 3)
    .sort((a, b) => b.g.length - a.g.length);
  if (notReg && poly.length) {
    say(`\n[INFO] C3  释义候选 ≥2 且跨 ≥3 门课的符号 ${poly.length} 个（这些是 04-notation.md「冲突情况」列的核查对象）：`);
    for (const x of poly.slice(0, 30)) say(`      ${x.k.padEnd(10)} ${x.g.length} 种释义 / ${x.courses} 门 / ${x.total} 次   ${x.g.slice(0, 4).join("；")}`);
  }

  // C4 漏反斜杠的函数名：真缺陷，但属内容修复（归 C1/A6），这里只 WARN
  const bareKeys = Object.keys(sum.bare);
  if (bareKeys.length) {
    say(`\n[WARN] C4  数学环境里有 ${bareKeys.length} 种漏反斜杠的函数名（共 ${Object.values(sum.bare).reduce((a, b) => a + b, 0)} 处）：`);
    for (const [k, n] of topKeys(sum.bare, 12)) say(`      ${k}  ${n} 次`);
    say(`      KaTeX 会把 sin(x) 渲染成 s·i·n(x) 的斜体连乘——属内容缺陷，修复归 C1/A6，本脚本只报不改`);
    warn++;
  } else { say(`\n[PASS] C4  数学环境里没有漏反斜杠的函数名`); pass++; }

  // C5 缩写判定表（04-notation.md 的 ABBREV 块）的活性与存在性
  // 与 C1b / C2b 同一族——手写的判定表会随语料变化悄悄失效，失效后门槛依旧全绿。
  {
    const capsN = Object.keys(sum.caps).length;
    if (!CAPS_ABBREV.size && capsN) {
      say(`\n[WARN] C5  04-notation.md 里没有 ${ABBREV_START} 判定表，但语料里有 ${capsN} 种全大写连写`);
      say(`      （缺表 ⇒ PM/GM 这类缩写会被拆成单字母，P 与 M 各虚增数百次假命中；跑 abbrs 逐个判定后登记）`);
      warn++;
    } else {
      const deadCaps = [...CAPS_ABBREV].filter((r) => !sum.caps[r]).sort();
      if (deadCaps.length) {
        say(`\n[WARN] C5  ABBREV 判定表里有 ${deadCaps.length} 条本轮 0 命中：${deadCaps.join(" ")}`);
        say(`      （缩写判定可能已过时；跑 abbrs 重新推导这张表，同 C1b，绿 ≠ 在测量）`);
        warn++;
      } else { say(`\n[PASS] C5  ABBREV 判定表的 ${CAPS_ABBREV.size} 条（${[...CAPS_ABBREV].join(" ") || "—"}）本轮均有命中`); pass++; }
    }
  }

  say("\n" + "─".repeat(80));
  say(`判定：PASS ${pass} · WARN ${warn} · FAIL ${fail}` + (fail ? " → 退出码 1" : " → 退出码 0"));
  say("─".repeat(80));
  process.exit(fail ? 1 : 0);
}

function cmdSymbols() {
  const recs = scanAll("--all");
  const sum = summarize(recs);
  const rows = Object.entries(sum.sym).sort((a, b) => b[1].total - a[1].total);
  say(`符号基 ${rows.length} 个（按出现次数降序）\n`);
  for (const [k, v] of rows) {
    say(`### ${k}   ${v.total} 次 / ${v.courses.size} 门`);
    say(`    课程：${fmtCourses(v.courses, 60)}`);
    const g = topKeys(v.glosses, 10);
    if (g.length) say(`    释义候选：${g.map(([x, n]) => `${x}(${n})`).join("；")}`);
    const f = topKeys(v.fulls, 10);
    if (f.length) say(`    带标变体：${f.map(([x, n]) => `${x}(${n})`).join(" ")}`);
    for (const c of v.contexts.slice(0, 3)) say(`    ${c.lesson}:${c.line}  ${c.text}`);
    say("");
  }
}

function cmdTerms() {
  const recs = scanAll("--all");
  const sum = summarize(recs);
  const rows = Object.entries(sum.term).sort((a, b) => b[1].total - a[1].total);
  say(`术语条目 ${rows.length} 条（按出现次数降序）。变体后 * 号 = 未达 solid 门槛（<2 次且不跨课），多半是同位语残渣；\n  * 只是显示标记，**照样参与冲突判定**（理由见 aliasConflicts 的注释：加阈值会把整张冲突表滤成 0 条）\n`);
  for (const [, v] of rows) {
    const zh = Object.entries(v.zh).sort((a, b) => b[1].total - a[1].total).map(([k, x]) => `${k}(${x.total}/${x.courses.size}门${solid(x) ? "" : "*"})`).join("|");
    const en = Object.entries(v.en).sort((a, b) => b[1].total - a[1].total).map(([k, x]) => `${k}(${x.total}/${x.courses.size}门${solid(x) ? "" : "*"})`).join("|");
    say(`${zh}  ⟷  ${en}   ${v.total} 次 / ${v.courses.size} 门`);
    say(`    ${fmtCourses(v.courses, 60)}`);
  }
}

/** 别名冲突的完整证据（03-glossary.md「别名 / 出现课程 / 建议」三列直接照这里写） */
function cmdConflicts() {
  const sum = summarize(scanAll("--all"));
  const conf = aliasConflicts(sum);
  const row = (map) => Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  say(`一英多中 ${conf.enToZh.length} 条\n`);
  for (const c of conf.enToZh) {
    say(`### ${c.key}   ${c.total} 次 / ${c.courses.length} 门`);
    say(`    英文变体：${row(c.en).map(([k, v]) => `${k}(${v.total}/${v.courses.size}门)`).join("  ")}`);
    for (const [k, v] of row(c.zh)) say(`    中文变体：${k}  ${v.total} 次 / ${v.courses.size} 门 → ${fmtCourses(v.courses, 60)}`);
    say(`    全部课程：${fmtCourses(c.courses, 60)}`);
    say("");
  }
  say(`一中多英 ${conf.zhToEn.length} 条\n`);
  for (const c of conf.zhToEn) {
    say(`### ${c.zh}   ${c.total} 次 / ${c.courses.length} 门`);
    for (const [k, v] of row(c.en)) say(`    英文变体：${k}  ${v.total} 次 / ${v.courses.size} 门 → ${fmtCourses(v.courses, 60)}`);
    say("");
  }
}

/**
 * 全大写多字母连写的证据表 —— CAPS_ABBREV 那张表的**依据**。
 * 逐个看上下文才能分清「矩阵连乘」（该拆成单字母）和「缩写」（该自成符号基），
 * 所以这条命令是常驻的：以后语料里冒出新的全大写连写，跑一次就知道该不该加进 CAPS_ABBREV。
 */
function cmdAbbrs() {
  const sum = summarize(scanAll("--all"));
  const rows = Object.entries(sum.caps).sort((a, b) => b[1].total - a[1].total);
  const total = rows.reduce((a, r) => a + r[1].total, 0);
  say(`全大写多字母连写 ${rows.length} 种 / ${total} 处。标 [缩写] 的已进 CAPS_ABBREV（自成符号基，不拆字母）\n`);
  for (const [k, v] of rows) {
    say(`${(CAPS_ABBREV.has(k) ? "[缩写] " : "       ") + k.padEnd(8)} ${String(v.total).padStart(5)} 处 / ${String(v.courses.size).padStart(2)} 门   ${fmtCourses(v.courses, 4)}`);
    if (v.ctx) say(`         ${v.ctx.lesson}:${v.ctx.line}  ${v.ctx.text}`);
  }
}

// ---------------------------------------------------------------- 登记表草稿与核对

/** 从 `48 门 / 4845 次` 这样的单元格里取数；取不到返回 null（那行写的是定性描述，不核） */
function parseCountCell(cell) {
  const m = /(\d+)\s*门\s*\/\s*(\d+)\s*次/.exec(cell || "");
  return m ? { courses: Number(m[1]), total: Number(m[2]) } : null;
}

/**
 * rows —— 打印两份 docs 登记表的**机械列**草稿（markdown 行），供人工裁决后粘进文档。
 *
 * 为什么要有这条命令：03 的登记表 205 行、04 的 107 行，「出现课程 / 频次 / 别名」几列
 * 全是扫描结果。手抄三百多个数字必然出错，而错一个就让裁决依据变成假数（B5：叙述服从测量）——
 * 一条写着「$T_s$ 334 次」的裁决，如果 334 是抄错的，那这条裁决就没有证据支撑。
 * 所以机械列一律由本命令打印，人只写 含义 / 冲突情况 / 裁决建议 三列。
 *
 * 它**只读不写**，这是有意的：一个能直接覆盖文档的生成器，参数写错一次就会静默抹掉几十条人工裁决，
 * 而裁决是这两份文档里唯一不可再生的部分。粘贴这一步笨，但每一步都过人的眼睛。
 * 重跑得到的是**当前**语料的草稿；与文档里已裁决的行 diff 后人工合并，不要整表覆盖。
 *
 * `rows notation --diff`：反过来核对文档里那些数字是否还与本轮扫描一致（只读；不一致 → 退出码 1）。
 * 这条是必需的，因为 04 的每一行都要被人改写过（填含义），改写就可能顺手改坏数字。
 * 03 不做 --diff：它的键是「英文归一化 + 中文标准译名」的组合，人工改判标准译名后就没有稳定的行标识了；
 * 改用文档「维护」一节里那条 shell 比对（把两边的 `N 门 / M 次` 单元格取出来排序后 diff）。
 */
function cmdRows() {
  const target = POSITIONAL[1] || "";
  if (target !== "glossary" && target !== "notation") {
    say(`用法：node scripts/glossary.mjs rows <glossary|notation> [--diff]`);
    process.exit(2);
  }
  const sum = summarize(scanAll("--all"));
  if (flag("--diff")) {
    if (target !== "notation") { say(`--diff 只支持 notation（理由见 cmdRows 的注释）；glossary 请用文档「维护」一节那条 shell 比对`); process.exit(2); }
    rowsDiffNotation(sum);
    return;
  }
  if (target === "notation") {
    const rows = Object.entries(sum.sym).sort((a, b) => b[1].total - a[1].total);
    say(`<!-- 草稿 ${rows.length} 行：含义 / 冲突情况 / 裁决建议 三列由人填，出现课程列照抄不要改 -->`);
    say(`| 符号 | 含义 | 出现课程 | 冲突情况 | 裁决建议 |`);
    say(`|---|---|---|---|---|`);
    for (const [k, v] of rows) say(`| $${k}$ | ？ | ${v.courses.size} 门 / ${v.total} 次 | ？ | — |`);
    if (!CAPS_ABBREV.size && Object.keys(sum.caps).length) {
      const n = Object.keys(sum.caps).length;
      say(``);
      say(`<!-- 提醒：04-notation.md 还没有 ABBREV 判定表，所以语料里 ${n} 种全大写连写全被拆成了单字母，`);
      say(`     PM、GM 这类缩写**不在上面这份草稿里**。先跑 abbrs 逐个判定、把缩写登记进 ABBREV 块，`);
      say(`     再重跑本命令——那时它们才会作为独立的符号基出现（实测会从 105 行变成 107 行）。 -->`);
    }
    return;
  }
  const conf = aliasConflicts(sum);
  const confEn = new Set(conf.enToZh.map((c) => c.key));
  const confZh = new Set(conf.zhToEn.map((c) => c.key));
  const rows = Object.entries(sum.term).sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]));
  say(`<!-- 草稿 ${rows.length} 行。中文标准译名取的是**出现次数最多**的变体，只是个占位：`);
  say(`     标了「见 §2」的 ${confEn.size} 行必须人工改判（频次最高的那个常常是同位语残渣，不是译名）。 -->`);
  say(`| 中文标准译名 | 英文 | 别名（已裁决保留） | 出现课程 | 建议 |`);
  say(`|---|---|---|---|---|`);
  for (const [k, v] of rows) {
    const zh = Object.entries(v.zh).sort((a, b) => b[1].total - a[1].total).map(([z]) => z);
    const en = Object.entries(v.en).sort((a, b) => b[1].total - a[1].total).map(([x]) => x);
    // 一中多英的键是中文，落在某一行的「标准译名或别名」上，所以按中文变体反查
    const inZhConf = zh.some((z) => confZh.has(normZh(z)));
    const isConf = confEn.has(k) || inZhConf;
    say(`| ${zh[0] || "—"} | ${en.join("、") || "—"} | ${zh.slice(1).join("、") || "—"} | ${v.courses.size} 门 / ${v.total} 次 | ${isConf ? "见 §2" : "—"} |`);
  }
}

/** 把 04-notation.md 登记表里的 `N 门 / M 次` 与本轮扫描逐个对账（rows notation --diff） */
function rowsDiffNotation(sum) {
  const text = readIfExists(P_NOTATION);
  if (text == null) { say(`FAIL  读不到 ${rel(P_NOTATION)}`); process.exit(1); }
  const block = registerBlock(text);
  if (block == null) { say(`FAIL  ${rel(P_NOTATION)} 里没有 ${REG_START} / ${REG_END} 哨兵`); process.exit(1); }
  const seen = new Set();
  const bad = [];
  let checked = 0, skipped = 0;
  for (const cells of tableRows(block)) {
    const bases = [];
    for (const part of cells[0].split(/[、,\/]/)) {
      const m = RE_SYM_CELL.exec(part.trim());
      if (m) bases.push(m[1].replace(/\s+/g, ""));
    }
    const got = parseCountCell(cells[2]);
    if (!bases.length || !got) { skipped++; continue; }
    for (const b of bases) {
      seen.add(b);
      const s = sum.sym[b];
      checked++;
      if (!s) { bad.push(`${b}：登记表写着 ${got.courses} 门 / ${got.total} 次，本轮扫描 0 命中`); continue; }
      if (s.courses.size !== got.courses || s.total !== got.total) {
        bad.push(`${b}：登记表 ${got.courses} 门 / ${got.total} 次，本轮扫描 ${s.courses.size} 门 / ${s.total} 次`);
      }
    }
  }
  const missing = Object.keys(sum.sym).filter((b) => !seen.has(b)).sort();
  say(`对账 ${checked} 个符号基（跳过 ${skipped} 行：第 1 列不是符号或第 3 列没写「N 门 / M 次」）`);
  for (const b of bad) say(`  [不符] ${b}`);
  for (const m of missing) say(`  [缺行] ${m}  本轮 ${sum.sym[m].courses.size} 门 / ${sum.sym[m].total} 次`);
  if (bad.length || missing.length) { say(`\nFAIL  ${bad.length} 行数字不符 + ${missing.length} 个符号缺行 → 退出码 1`); process.exit(1); }
  say(`\nPASS  登记表的数字与本轮扫描逐行一致 → 退出码 0`);
}

// ---------------------------------------------------------------- 入口
// 被 import 时不跑 CLI：symbolsOf / termsOf / maskNonProse / cleanZhTerm / enKey 需要能单独断言
// （.agent/e4-fixture 的单元检查直接 import 本模块，见其 README）。
const IS_MAIN = !!process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (!IS_MAIN) {
  // 只导出函数，不执行任何命令
} else if (!existsSync(P_CONTENT)) { say(`FAIL  找不到 ${rel(P_CONTENT)}`); process.exit(1); }
else if (CMD === "scan") cmdScan();
else if (CMD === "check") cmdCheck();
else if (CMD === "symbols") cmdSymbols();
else if (CMD === "terms") cmdTerms();
else if (CMD === "conflicts") cmdConflicts();
else if (CMD === "abbrs") cmdAbbrs();
else if (CMD === "rows") cmdRows();
else {
  say(`glossary.mjs —— 术语与数学符号抽取 / 冲突排查 / 登记表核对（E4）

用法：
  node scripts/glossary.mjs scan   [<chapter>/<lesson>|--all] [--out f.json] [--quiet]
  node scripts/glossary.mjs symbols                       # 逐符号的证据（课程 / 释义候选 / 带标变体 / 原文行）
  node scripts/glossary.mjs terms                         # 逐术语的证据（中英变体 / 课程）
  node scripts/glossary.mjs conflicts                     # 逐条别名冲突的证据（变体频次 + 各自出现在哪些课）
  node scripts/glossary.mjs abbrs                         # 全大写连写的证据（判 PM 是缩写还是 P·M 连乘，靠这张表）
  node scripts/glossary.mjs rows <glossary|notation>       # 打印登记表**机械列**的 markdown 草稿（只读，人工裁决后粘进 docs）
  node scripts/glossary.mjs rows notation --diff           # 核对 04-notation.md 里的「N 门 / M 次」是否还与本轮扫描一致
  node scripts/glossary.mjs check                         # 门槛：未登记的符号基与未裁决的别名冲突 → 退出码 1
  公共开关：--root <dir> 换根目录（fixture 用）· --quiet 只打汇总

check 的判据（编号与 verify-lesson.mjs 的九项、nb-cells.mjs 的 S0–S8 互不相干，不要混引）：
  C1  扫到的符号基是否全部登记进 04-notation.md      → 未登记 FAIL
  C1b 登记表里本轮 0 命中的符号基                     → WARN（绿 ≠ 在测量）
  C2  别名冲突是否全部裁决（每个变体都要么登记、要么进 NOISE 表签字） → 未裁决 FAIL
  C2b NOISE 表里本轮 0 命中的条目                     → WARN
  C3  释义候选 ≥2 且跨 ≥3 门课的符号                  → INFO（04-notation.md「冲突情况」列的核查对象）
  C4  数学环境里漏反斜杠的函数名（sin(x) 等）         → WARN（属内容缺陷，修复归 C1/A6）
  C5  04-notation.md 的 ABBREV 缩写判定表：缺表 / 表内条目本轮 0 命中 → WARN

抽取口径：
  · 只扫正文——围栏代码块、行内代码段、JSX 标签（含 notebook 的模板字面量）由
    lib-mdx.mjs 的 scanMdx().skips 掩掉，掩码等长保换行，偏移对原文有效
  · 符号按**基字母**登记（T、\\gamma、\\mathbb{R}），下标变体（T_s）只作证据
  · 术语只认「括号内纯拉丁」，故 （I 型系统）、（Ts={Ts}s）不会混进来；
    但单位会——（dB）实测 4 处，由 03-glossary.md 的 NOISE 表签字，不在抽取阶段挡
  · check 读 docs/semester-02/03-glossary.md 与 04-notation.md 里
    ${REG_START} … ${REG_END} 之间的表格作为登记表；03 另有 ${NOISE_START} 残渣签字表，
    04 另有 ${ABBREV_START} 全大写缩写判定表（**影响符号抽取本身**，不只是核对用）

负向测试（A7 教训：只对着干净的当前仓库跑等于没测）——fixture 是仓库产物：
  node .agent/e4-fixture/unit-probe.mjs                              # 58 条纯函数断言 → 0
  node scripts/glossary.mjs check --root .agent/e4-fixture/ok        # 全绿对照组 → 0
  node scripts/glossary.mjs check --root .agent/e4-fixture/bad       # 六个注入缺陷 → 1
  → 逐条命令、预期输出与四条变异测试见 .agent/e4-fixture/README.md

退出码：check 有 FAIL → 1；其余命令恒 0（找不到语料 → 1/2）。仅用 Node 内置能力。`);
  process.exit(CMD ? 1 : 2);
}
