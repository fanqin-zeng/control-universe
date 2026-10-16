/**
 * lib-mdx.mjs —— MDX 解析原语（semester-02 E3 抽出）
 *
 * 为什么存在：E1 把 scanMdx / extractNotebookCode 写在 verify-lesson.mjs 里，
 * E3 的 nb-cells.mjs 要解析同一批 JupyterNotebook。照 E2 的教训（同一功能四份副本），
 * 这里抽成单一来源，两个脚本都 import，不再各存一份。
 *
 * 移动纪律：scanMdx / extractNotebookCode / mdxH2Titles / walk / linesOf / lineAt /
 * noLineComments 是从 verify-lesson.mjs **逐字搬来**的，搬完用
 * 「npm run check + npm run verify:all 的输出与搬动前逐字节相同」证明没改行为。
 *
 * 新增的两个能力（E3）：
 *   unescapeTemplate —— 把模板字面量的**原始文本**求值成浏览器真正发给内核的字符串。
 *                       E1 的 extractNotebookCode 返回的是原始文本；直接把它 POST 给
 *                       kernel 等于验了一份和线上不同的代码（反斜杠转义会被 JS 吃掉）。
 *   extractNotebooks —— 按 notebook 分组抽出 title / setupCode / cells，带行号与转义问题。
 *
 * 只用 Node 内置能力，转义语义手工实现：一来本仓 hook 把动态求值列为高危，
 * 二来只有自己做扫描才能把「哪个转义在哪一行被吃掉了」逐条报出来。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export function read(p) { return readFileSync(p, "utf8"); }
export function readIfExists(p) { return existsSync(p) ? readFileSync(p, "utf8") : null; }
export function linesOf(text) { return text.split(/\r?\n/); }
/** 剔除「整行 // 注释」，只给组件规范扫描用（避免注释里提一嘴就当作设置过） */
export function noLineComments(text) {
  return linesOf(text).filter((l) => !/^\s*\/\//.test(l)).join("\n");
}
export function walk(dir, filter, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}
export function lineAt(src, index) { return src.slice(0, index).split(/\r?\n/).length; }
/** rel() 依赖运行时的 ROOT，所以做成工厂而不是常量 */
export function makeRel(ROOT) {
  return (p) => p.slice(ROOT.length + 1).replace(/\\/g, "/");
}

/**
 * 单遍字符扫描，同时识别：markdown 围栏、模板字符串、字符串、大写开头的 JSX 标签。
 * 返回 { tags: [{name, start, end, bodyStart, selfClosing, badCommas:[{at,line}]}],
 *        skips: [{kind:'fence'|'code'|'jsx', start, end}] }
 *
 * skips 是 E4 加的**附加返回值**（既有 `{tags}` 解构不受影响）：把「不是正文」的区间
 * 按字符偏移报出来，好让 glossary.mjs 直接在偏移上做掩码，而不是再写一份围栏/行内代码/
 * JSX 识别逻辑（那会是本仓第 6 份 MDX 解析副本，正是 E3 抽 lib-mdx 要消灭的东西）。
 * end 是**开区间**（不含）。
 *
 * 为什么要真 tokenizer 而不是 grep「`}, 后跟逗号」：
 * cells={[{ code: `…` }, { code: `…` }]} 里的 `},` 是数组元素分隔符，完全合法
 * （实测 content/mpc/distributed-mpc.mdx:290 就是这样，粗 grep 会误报）。
 * fix-013 的非法逗号只出现在 JSX 属性之间，即花括号/方括号深度都为 0 的位置。
 */
export function scanMdx(src) {
  const tags = [];
  const skips = [];
  let i = 0;
  let fence = null;          // 当前围栏字符（` 或 ~），null = 不在围栏内
  let fenceStart = -1;       // 开栏处偏移，配 skips 用
  let atLineStart = true;    // 用于围栏判定
  while (i < src.length) {
    const c = src[i];
    if (c === "\n") { atLineStart = true; i++; continue; }
    // 围栏判定：只在行首（允许前导空白）看。
    // 空白类必须是 [ \t] 而不是 \s：CRLF 文件里空行的行尾是 "\r\n"，i 会停在那个 \r 上，
    // \s* 会跨过 \r\n 匹配到**下一行**的围栏——于是「空行 + 围栏行」被误判成一次开栏，
    // 真正的开栏反被当成闭栏，此后开栏/闭栏的配对整体错位。
    // 错位的方向取决于文件里有几处「空行 + 围栏」，两个方向都实测到过：
    //   · 现网 modern/modern-case-study：5 个 JupyterNotebook 全部隐身
    //     （第 1 项当时还 PASS，报告写着「本课无 JSX 标签」），classic/transfer-function 少扫 1 个；
    //   · .agent/e3-fixture/content/fx/nb-crlf.mdx：**反过来**——围栏内的示例被当成真组件
    //     扫出来（于是报 S1「首行是 %%NB9%%」与 S4 占位符残留），围栏外那个真组件反倒隐身。
    // 变异测试：把 [ \t] 改回 \s，上面这个 fixture 立刻从 [PASS] 1 个 notebook 变成
    // [FAIL] 且认出的是围栏里那个假的；同一变异对 LF 文件（nb-good.mdx）毫无影响——
    // 证明这条 fixture 抓的确实是 CRLF 专有的 bug，而不是碰巧一起变了。
    if (atLineStart) {
      const fm = /^[ \t]*(`{3,}|~{3,})/.exec(src.slice(i, i + 8));
      if (fm) {
        const marker = fm[1][0];
        if (!fence) { fence = marker; fenceStart = i; }
        else if (fence === marker) {
          fence = null;
          let e = i;
          while (e < src.length && src[e] !== "\n") e++;
          skips.push({ kind: "fence", start: fenceStart, end: e });
        }
        while (i < src.length && src[i] !== "\n") i++;
        continue;
      }
      if (/\S/.test(c)) atLineStart = false;
      else { i++; continue; }
    }
    if (fence) { i++; continue; }
    // 行内代码段（单反引号）里的 <Foo> 是**文档示例**，不是真组件。
    // 不跳过的话，一句「本仓的 `<JupyterNotebook>` 组件……」就会被扫出一个幻影标签，
    // 进而报「没有 setupCode / 没有 cells」这类假 FAIL。假 FAIL 会让人开始无视整张报告
    // （E2 新发现 ②：绿 ≠ 在测量；反过来，红 ≠ 真有问题）。
    // E3 实测：现网 content/ 56 篇 MDX、326 个标签里落在行内代码段的是 0 个，
    // 所以这次修补对现有输出是零回归；但 .agent/e3-fixture 一写就撞上了，说明它一步之遥。
    // 只在同一行内找配对反引号：CommonMark 允许行内代码段跨行，但那种写法本仓没有，
    // 找不到配对就按普通字符继续，行为退回修补前，不会更糟。
    if (c === "`") {
      let j = i + 1;
      while (j < src.length && src[j] !== "\n" && src[j] !== "`") j++;
      if (j < src.length && src[j] === "`") { skips.push({ kind: "code", start: i, end: j + 1 }); i = j + 1; continue; }
      i++; continue;
    }
    if (c === "<" && /[A-Z]/.test(src[i + 1] || "")) {
      const nameM = /^<([A-Z][A-Za-z0-9_]*)/.exec(src.slice(i, i + 64));
      if (nameM) {
        const tag = { name: nameM[1], start: i, end: -1, badCommas: [], selfClosing: false };
        let brace = 0, brack = 0, bt = false, esc = false, q = null;
        for (let j = i + nameM[0].length; j < src.length; j++) {
          const d = src[j];
          if (esc) { esc = false; continue; }
          if (d === "\\") { esc = true; continue; }
          if (bt) { if (d === "`") bt = false; continue; }
          if (q) { if (d === q) q = null; continue; }
          if (d === "`") { bt = true; continue; }
          if (d === '"' || d === "'") { q = d; continue; }
          if (d === "{") brace++;
          else if (d === "}") brace--;
          else if (d === "[") brack++;
          else if (d === "]") brack--;
          else if (d === "," && brace === 0 && brack === 0) tag.badCommas.push({ at: j, line: lineAt(src, j) });
          else if (d === ">" && brace === 0 && brack === 0) {
            tag.selfClosing = src[j - 1] === "/";
            tag.end = j;
            break;
          }
        }
        if (tag.end > 0) {
          tags.push(tag);
          skips.push({ kind: "jsx", start: i, end: tag.end + 1 });
          i = tag.end + 1; atLineStart = false; continue;
        }
        i++; continue;
      }
    }
    i++;
  }
  // 未闭合的围栏（写坏的 MDX）：从开栏处一路掩到文件尾，否则围栏里的代码会被当正文抽出术语。
  if (fence && fenceStart >= 0) skips.push({ kind: "fence", start: fenceStart, end: src.length });
  return { tags, skips };
}

// 跳过 ``` / ~~~ 围栏内的伪标题；不解析 JSX 模板字符串
// （历史各阶段已用渲染后 HTML 交叉验证过该口径：模板字符串里的 "# xxx" 不会被当成 H2）
export function mdxH2Titles(text) {
  const out = [];
  let fence = null;
  for (const line of linesOf(text)) {
    const m = /^(\s*)(`{3,}|~{3,})/.exec(line);
    if (m) {
      if (!fence) fence = m[2][0];
      else if (fence === m[2][0]) fence = null;
      continue;
    }
    if (fence) continue;
    if (/^## /.test(line)) out.push(line.slice(3).trim());
  }
  return out;
}

/**
 * 抽出 JupyterNotebook 的 setupCode 与每个 cell 的模板字符串内容（**原始文本**，未求值）。
 * E1 时点实测：全仓 182 个 JupyterNotebook 全部是 setupCode={`…`} + cells={[{ code: `…` }, …]} 且自闭合。
 * （下面是解析器的依据，不是当前统计——数量以脚本运行时实扫为准。）
 *
 * 注意它按整篇源码 matchAll，不看围栏、也不按 notebook 分组；要分组请用 extractNotebooks。
 * verify-lesson.mjs 第 3 项继续用它（口径不变），nb-cells.mjs 用 extractNotebooks。
 */
export function extractNotebookCode(src) {
  const out = [];
  const openers = [
    { re: /setupCode=\{`/g, kind: "setup" },
    { re: /\{\s*code:\s*`/g, kind: "cell" },
  ];
  for (const { re, kind } of openers) {
    for (const m of src.matchAll(re)) {
      const start = m.index + m[0].length;
      let j = start, esc = false;
      for (; j < src.length; j++) {
        const c = src[j];
        if (esc) { esc = false; continue; }
        if (c === "\\") { esc = true; continue; }
        if (c === "`") break;
      }
      out.push({ kind, code: src.slice(start, j), line: lineAt(src, m.index) });
    }
  }
  return out.sort((a, b) => a.line - b.line);
}

// ---------------------------------------------------------------- 静态检查判据（单一来源）
// verify-lesson.mjs 第 3 项与 nb-cells.mjs 的静态检查共用这三条正则。
// 判据只在这里改一次，两个工具不会各说各话（E2 的「同一功能四份副本」教训）。

/** ipywidgets 家族：轻量内核（scripts/jupyter_server.py）不支持 widget（fix-004 / fix-006） */
export const RE_WIDGETS = /ipywidgets|FloatSlider|IntSlider|widgets\.|interact\(/g;
/**
 * cell / setupCode 求值后首行以 % 开头（fix-017）。
 *
 * E3 把原判据 /^%[^\w]/ 收紧成 /^%/，理由是实测而非审美：
 *   · /^%[^\w]/ 要求 % 后面是**非**单词字符，于是 %time、%%bash 能命中，
 *     而 %matplotlib inline、%config、%pip 全部漏网——恰恰 %matplotlib inline
 *     是最常见的那一个，在裸内核上必然 UsageError。
 *   · 判据的口径本来就写在这行注释上方（「行首 % 在 IPython 里永远是 line magic」），
 *     正则却比注释窄。E2 的教训正是这种「判据依赖被检对象的字面形状」的门槛会静默变成永远 PASS。
 *   · Python 里 % 只是取模运算符，**不可能**作为一条语句的开头，所以 /^%/ 不会误伤任何合法代码。
 * 收紧前实测 content/ 全仓 529 个代码块（value 与 raw 各判一次）：/^%/ 命中 0，
 * 旧判据也命中 0 —— 即这次收紧对现有 141 门课是零回归，只关掉了将来的漏洞。
 *
 * 原 RE_MAGIC_HASH（/^%#/，fix-017 的实际形态是 `# 注释` 被拼接脚本改成 `%# 注释`）
 * 已删除：它是 /^%/ 的严格子集，留着只会让人以为存在两种独立情形。
 */
export const RE_MAGIC_FIRST = /^%/;
/** 拼接占位符残留。<<NBn>> 是 E3 规定的占位符形式（不含 %，因此不会被 % 格式化折叠） */
export const RE_PLACEHOLDER = /%%NB\d|%NB\d%|<<NB\d>>/;

// ---------------------------------------------------------------- 模板字面量求值（E3 新增）

const SIMPLE_ESCAPES = { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f", v: "\v", "0": "\0" };
const HEX = /[0-9a-fA-F]/;

/**
 * 把一个模板字面量里两个反引号之间的**原始文本**求值成 JS 实际得到的字符串，
 * 并顺手记下每一处「MDX 里看到的」与「内核收到的」不一致的地方。
 *
 * 为什么这件事是 E3 的核心：cell 代码在 MDX 里写在反引号内，浏览器先按 JS 模板字面量
 * 求值，再把结果 POST 给 kernel。所以 fix-017 那类「拼接过程改了字面」的事故，
 * 静态比对 MDX 原文是抓不到的——必须比对**求值后**的字符串。
 *
 * 返回 { value, issues: [{ at, seq, kind, got }] }，kind 取：
 *   transformed        \n \t \r \b \f \v \0 \xNN \uNNNN \u{…} → 变成控制字符，
 *                      Python 收到的不是 MDX 里写的那两个字符（print("a\nb") 会变成
 *                      字符串里真有一个换行 → SyntaxError）
 *   dropped-backslash  \X（X 不是合法转义）→ 反斜杠被静默丢掉，
 *                      LaTeX 的 \lambda 到 Python 就成了 lambda
 *   line-continuation  反斜杠紧跟换行 → 那个换行被删掉，两行 Python 粘成一行
 *   interpolation      ${…} → 会被当成 JS 表达式求值（MDX 里写它几乎总是意外）
 *   bad-escape         \u / \x 后面十六进制位数不够，或 \1–\9（模板字面量里非法）
 *   unterminated       原始文本以孤立反斜杠结尾
 * \\ 与 \` 与 \$ 是**正确**写法，不报。
 */
export function unescapeTemplate(raw) {
  let value = "";
  const issues = [];
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c !== "\\") {
      if (c === "$" && raw[i + 1] === "{") {
        issues.push({ at: i, seq: "${", kind: "interpolation", got: "${" });
      }
      value += c;
      continue;
    }
    const n = raw[i + 1];
    if (n === undefined) {
      issues.push({ at: i, seq: "\\", kind: "unterminated", got: "\\" });
      value += "\\";
      break;
    }
    if (n === "\\") { value += "\\"; i += 1; continue; }
    if (n === "`") { value += "`"; i += 1; continue; }
    if (n === "$") { value += "$"; i += 1; continue; }
    if (n === "\n") {
      issues.push({ at: i, seq: "\\\n", kind: "line-continuation", got: "" });
      i += 1; continue;
    }
    if (n === "\r") {
      issues.push({ at: i, seq: "\\\r", kind: "line-continuation", got: "" });
      i += raw[i + 2] === "\n" ? 2 : 1; continue;
    }
    if (Object.prototype.hasOwnProperty.call(SIMPLE_ESCAPES, n)) {
      const got = SIMPLE_ESCAPES[n];
      issues.push({ at: i, seq: "\\" + n, kind: "transformed", got });
      value += got; i += 1; continue;
    }
    if (n === "x") {
      const h = raw.slice(i + 2, i + 4);
      if (h.length === 2 && HEX.test(h[0]) && HEX.test(h[1])) {
        const got = String.fromCharCode(parseInt(h, 16));
        issues.push({ at: i, seq: "\\x" + h, kind: "transformed", got });
        value += got; i += 3; continue;
      }
      issues.push({ at: i, seq: "\\x" + h, kind: "bad-escape", got: "x" });
      value += "x"; i += 1; continue;
    }
    if (n === "u") {
      if (raw[i + 2] === "{") {
        const close = raw.indexOf("}", i + 3);
        const h = close > 0 ? raw.slice(i + 3, close) : "";
        if (close > 0 && h.length && /^[0-9a-fA-F]+$/.test(h)) {
          const cp = parseInt(h, 16);
          const got = String.fromCodePoint(cp);
          issues.push({ at: i, seq: "\\u{" + h + "}", kind: "transformed", got });
          value += got; i = close; continue;
        }
        issues.push({ at: i, seq: "\\u{" + h, kind: "bad-escape", got: "u" });
        value += "u"; i += 1; continue;
      }
      const h = raw.slice(i + 2, i + 6);
      if (h.length === 4 && [...h].every((ch) => HEX.test(ch))) {
        const got = String.fromCharCode(parseInt(h, 16));
        issues.push({ at: i, seq: "\\u" + h, kind: "transformed", got });
        value += got; i += 5; continue;
      }
      issues.push({ at: i, seq: "\\u" + h, kind: "bad-escape", got: "u" });
      value += "u"; i += 1; continue;
    }
    if (n >= "1" && n <= "9") {
      issues.push({ at: i, seq: "\\" + n, kind: "bad-escape", got: n });
      value += n; i += 1; continue;
    }
    // 其余一律是 NonEscapeCharacter：反斜杠被丢掉，只留下后面那个字符
    issues.push({ at: i, seq: "\\" + n, kind: "dropped-backslash", got: n });
    value += n; i += 1;
  }
  return { value, issues };
}

// ---------------------------------------------------------------- JSX 属性与 notebook 抽取（E3 新增）

/** 从 s[i]（必须是 "`"）扫到未转义的闭合反引号，返回 { raw, close }；扫不到则 close = -1 */
function templateAt(s, i) {
  if (s[i] !== "`") return null;
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === "\\") { j++; continue; }
    if (s[j] === "`") return { raw: s.slice(i + 1, j), close: j };
  }
  return { raw: s.slice(i + 1), close: -1 };
}

/** 从 s[i]（必须是开括号字符）扫到配平的闭括号，模板/字符串感知；返回闭括号下标或 -1 */
function matchBracket(s, i) {
  const open = s[i];
  const close = open === "{" ? "}" : open === "[" ? "]" : open === "(" ? ")" : null;
  if (!close) return -1;
  let depth = 0, bt = false, esc = false, q = null;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (esc) { esc = false; continue; }
    if (c === "\\") { esc = true; continue; }
    if (bt) { if (c === "`") bt = false; continue; }
    if (q) { if (c === q) q = null; continue; }
    if (c === "`") { bt = true; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return j; }
  }
  return -1;
}

/** 解析一个 JSX 开标签的属性表，返回 [{ name, value, isExpr, line, at }]
 *  value 不含外层花括号/引号；at 指向值的首字符（表达式容器就是那个 "{"），line 是该字符所在行 */
function parseAttrs(src, tag) {
  const text = src.slice(tag.start, tag.end + 1);
  const head = /^<([A-Z][A-Za-z0-9_]*)/.exec(text);
  const attrs = [];
  let i = head ? head[0].length : 1;
  while (i < text.length) {
    const c = text[i];
    if (c === "/" || c === ">") break;
    const nm = /^([A-Za-z_][A-Za-z0-9_-]*)\s*=/.exec(text.slice(i));
    if (nm) {
      const name = nm[1];
      let j = i + nm[0].length;
      let value, isExpr = false;
      if (text[j] === "{") {
        const close = matchBracket(text, j);
        value = close > 0 ? text.slice(j + 1, close) : text.slice(j + 1);
        isExpr = true;
        i = (close > 0 ? close : text.length) + 1;
      } else if (text[j] === '"' || text[j] === "'") {
        const q = text[j];
        let k = j + 1;
        while (k < text.length && text[k] !== q) k++;
        value = text.slice(j + 1, k);
        i = k + 1;
      } else {
        value = null;
        i = j;
      }
      attrs.push({ name, value, isExpr, line: lineAt(src, tag.start + j), at: tag.start + j });
      continue;
    }
    i++;
  }
  return attrs;
}

/** 组件 JupyterNotebookProps 的全部合法属性（components/wiki/jupyter-notebook.tsx） */
export const NOTEBOOK_ATTRS = new Set(["cells", "setupCode", "title"]);

/**
 * 按 notebook 分组抽取 JupyterNotebook 的全部内容。
 *
 * 与 extractNotebookCode 的三点差别（都是 E3 需要的）：
 *   1 走 scanMdx，所以**围栏内的 JSX 示例不会被当成真组件**；
 *   2 按 notebook 分组，cell 归属明确（extract 的 JSON、assemble 的反向校验都要这个）；
 *   3 每段代码同时给出 raw（MDX 字面）与 value（浏览器求值后、真正发给内核的字符串），
 *     并附 unescapeTemplate 的 issues。
 *
 * 返回 [{ index, line, endLine, selfClosing, badCommas, title, unknownAttrs,
 *         setup: {raw, value, issues, line} | null,
 *         cells: [{ index, line, raw, value, issues, delim }] }]
 */
export function extractNotebooks(src) {
  const { tags } = scanMdx(src);
  const out = [];
  for (const tag of tags) {
    if (tag.name !== "JupyterNotebook") continue;
    const nb = {
      index: out.length,
      line: lineAt(src, tag.start),
      endLine: lineAt(src, tag.end),
      selfClosing: tag.selfClosing,
      badCommas: tag.badCommas.map((c) => ({ at: c.at, line: c.line })),
      title: null,
      unknownAttrs: [],
      setup: null,
      cells: [],
      parseErrors: [],
    };
    for (const a of parseAttrs(src, tag)) {
      if (!NOTEBOOK_ATTRS.has(a.name)) {
        // 组件 props 里没有这个属性，React 只会静默忽略。E3 实测全仓 37 处 language="python"。
        // 记下来就够了，不要再往下走表达式解析——那会把它误报成「不是 {…} 表达式容器」。
        nb.unknownAttrs.push({ name: a.name, line: a.line, value: a.value });
        continue;
      }
      if (a.name === "title") { nb.title = a.value; continue; }
      if (!a.isExpr || a.value == null) {
        nb.parseErrors.push({ attr: a.name, line: a.line, msg: "不是 {…} 表达式容器，解析器不认" });
        continue;
      }
      const exprStart = a.at;                       // 指向 "{"；a.value 从它下一个字符开始
      if (a.name === "setupCode") {
        const trimmed = a.value.replace(/^\s+/, "");
        const pad = a.value.length - trimmed.length;
        if (trimmed[0] !== "`") {
          nb.parseErrors.push({ attr: "setupCode", line: a.line, msg: "不是模板字面量（不是以反引号开头）" });
          continue;
        }
        const t2 = templateAt(trimmed, 0);
        const { value, issues } = unescapeTemplate(t2.raw);
        nb.setup = {
          raw: t2.raw, value, issues,
          line: lineAt(src, exprStart + pad + 1),
          unterminated: t2.close < 0,
        };
        continue;
      }
      if (a.name === "cells") {
        // 在 cells 表达式里逐个找 code: <字面量>
        const expr = a.value;
        const re = /\bcode\s*:\s*/g;
        let m;
        while ((m = re.exec(expr))) {
          const p = m.index + m[0].length;
          const ch = expr[p];
          const cellLine = lineAt(src, exprStart + 1 + p);   // a.value 不含那个 "{"
          if (ch === "`") {
            const t = templateAt(expr, p);
            const { value, issues } = unescapeTemplate(t.raw);
            nb.cells.push({
              index: nb.cells.length, line: cellLine, delim: "`",
              raw: t.raw, value, issues, unterminated: t.close < 0,
            });
            if (t.close > 0) re.lastIndex = t.close + 1;
          } else if (ch === '"' || ch === "'") {
            // 单/双引号字符串：转义规则与模板字面量不同（\n 同样是换行，但换行不能裸写）
            let k = p + 1, raw = "";
            for (; k < expr.length; k++) {
              if (expr[k] === "\\") { raw += expr[k] + (expr[k + 1] ?? ""); k++; continue; }
              if (expr[k] === ch) break;
              raw += expr[k];
            }
            const { value, issues } = unescapeTemplate(raw);
            nb.cells.push({
              index: nb.cells.length, line: cellLine, delim: ch,
              raw, value, issues, unterminated: k >= expr.length,
            });
            re.lastIndex = k + 1;
          } else {
            nb.parseErrors.push({ attr: "cells", line: cellLine, msg: "code 的值不是字符串字面量（首字符 " + JSON.stringify(ch ?? "") + "），可能是拼接结果或变量引用" });
          }
        }
      }
    }
    out.push(nb);
  }
  return out;
}
