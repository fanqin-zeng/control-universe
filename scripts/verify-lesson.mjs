#!/usr/bin/env node
import { renderedHeadings } from './rendered-headings.mjs';
import { assertHeadingTargets } from '../lib/mdx-headings.mjs';
import { resolveHistoricalLesson } from '../lib/lesson-compat.mjs';
/**
 * verify-lesson.mjs —— 单课交付硬门槛自动验收（semester-02 E1）
 *
 * 把 M3 的九项前端交付硬门槛（.agent/skills/v1.3-refactor/SKILL.md Step 2e，
 * 与 .agent/skills/wiki-discussion/SKILL.md《前端交付硬门槛（B6 起）》逐字同源）
 * 从人工执行变成一条命令。
 *
 * 用法：
 *   node scripts/verify-lesson.mjs <chapter>/<lesson>     验单课
 *   node scripts/verify-lesson.mjs --all                  验全部有 MDX 的课
 *   node scripts/verify-lesson.mjs --delivered            只验 status="v1.3" 的课
 *   --root <dir>    换根目录（缺陷注入 fixture 用）
 *   --no-http       跳过第 6 项（不探 dev server）
 *   --quiet         只打印 WARN/FAIL 与汇总
 *
 * 负向测试（E1 验收的第二半：「对一门故意注入错误的课能报 FAIL」）：
 *   node scripts/verify-lesson.mjs fx/bad-lesson fx/good-lesson \
 *     --root .agent/e1-fixture --no-http
 *   bad-lesson 注入了 8 处缺陷 → 第 1/2/3/4/5/7/9 项 FAIL、第 8 项 WARN、第 6 项 SKIPPED、退出码 1；
 *   good-lesson 是对照组 → 0 FAIL、退出码 0（它那条 WARN 是故意的：链向 status=empty 的骨架课）。
 *   fixture 是仓库产物、不是临时文件（B6 定的规矩：验证脚本与其测试数据都不得放 %TEMP% 后删），
 *   实测 npm run check 与 tsc --noEmit 都不受它影响（check-catalog.mjs 按根相对路径只取
 *   content/ 与 components/wiki/；tsc 则是压根没编译它——TypeScript 的 include 通配默认跳过
 *   以点开头的目录，E2 用 .agent/tsc-probe.ts + 仓库根对照探针实测，详见 plan 的 E2 批注 ⑨-i）。
 *
 * 退出码：任何 FAIL → 1；仅 WARN / SKIPPED / 全 PASS → 0。
 * 只用 Node 20+ 内置能力（fs / path / http / url），不引入新依赖，不用 execSync。
 *
 * 与 check-catalog.mjs 的分工：那个脚本按「全仓五处交叉核对」出统计，本脚本按「课」出门槛判定。
 * 第 6 项是唯一需要 dev server 的项，其余八项纯静态，因此本脚本可在 CI 里无服务运行。
 */
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { request as httpRequest } from "node:http";
// E3：解析原语与 catalog 解析已抽成单一来源（原先本文件与 check-catalog.mjs 各存一份）
import {
  read, readIfExists, linesOf, noLineComments, walk, lineAt, makeRel,
  scanMdx, mdxH2Titles, extractNotebookCode,
  RE_WIDGETS, RE_MAGIC_FIRST, RE_PLACEHOLDER,
} from "./lib-mdx.mjs";
import { parseCatalog } from "./lib-catalog.mjs";

// ---------------------------------------------------------------- 参数与路径
const argv = process.argv.slice(2);
const ALL = argv.includes("--all");
const DELIVERED = argv.includes("--delivered");
const NO_HTTP = argv.includes("--no-http");
const QUIET = argv.includes("--quiet");
const rootArg = argv.indexOf("--root");
const ROOT = (rootArg >= 0 ? argv[rootArg + 1] : join(dirname(fileURLToPath(import.meta.url)), ".."))
  .replace(/\\/g, "/")
  .replace(/\/+$/, "");

const P_CATALOG = join(ROOT, "content/catalog.ts");
const P_CONTENT = join(ROOT, "content");
const P_COMPONENTS = join(ROOT, "components/wiki");
const P_MDX_COMPONENTS = join(ROOT, "mdx-components.tsx");
const P_LIB_CONTENT = join(ROOT, "lib/content.ts");
const P_WIKI_COMPONENTS = join(ROOT, "lib/wiki-components.ts");
const P_DISCUSS = join(ROOT, "docs/discuss-log");
const P_PUBLIC = join(ROOT, "public");
const DEV_HOST = "127.0.0.1";
const DEV_PORT = 8080;

const rel = makeRel(ROOT);

// ---------------------------------------------------------------- 报告助手
const R = { pass: 0, warn: 0, fail: 0, skip: 0 };
const STATS = { emojiLines: 0, refLines: 0, q5: 0 };
const ITEM_NAMES = [
  "MDX 语法预检",
  "结构一致性",
  "Notebook cell 完整性",
  "组件注册",
  "组件规范",
  "渲染与数学（需 dev server）",
  "交叉引用完整性",
  "交付完整性",
  "习题 / 答案配对",
];

function makeLessonReport(key) {
  // 初值 SKIPPED 而非 PASS：没跑过的项不能算通过（第 6 项在无 dev server 时正是要显示 SKIPPED）
  const items = ITEM_NAMES.map((name, idx) => ({ n: idx + 1, name, level: "SKIPPED", notes: [], debt: [] }));
  return { key, items, counts: { PASS: 0, WARN: 0, FAIL: 0, SKIPPED: 0 } };
}
function mark(item, level, msg, isDebt = false) {
  const rank = { SKIPPED: -1, PASS: 0, WARN: 1, FAIL: 2 };
  if (rank[level] > rank[item.level]) item.level = level;
  if (msg) (isDebt ? item.debt : item.notes).push((isDebt ? "[存量债务] " : "") + msg);
}
function pad(s, n) { let w = 0; for (const ch of s) w += ch.charCodeAt(0) > 0x2e80 ? 2 : 1; return s + " ".repeat(Math.max(0, n - w)); }

// ---------------------------------------------------------------- 全局数据
console.log("verify-lesson.mjs · 根目录：" + ROOT);
if (!existsSync(P_CATALOG)) { console.log("FAIL  找不到 " + P_CATALOG); process.exit(1); }
let catalog;
try { catalog = parseCatalog(read(P_CATALOG)); }
catch (e) { console.log("FAIL  catalog.ts 解析失败：" + e.message); process.exit(1); }

const catLessons = [];
catalog.forEach((ch, ci) => ch.lessons.forEach((l, li) => catLessons.push({
  chapter: ch.slug, chapterTitle: ch.title, chapterIndex: ci, lessonIndex: li, ...l,
})));
const catByKey = new Map(catLessons.map((l) => [l.chapter + "/" + l.slug, l]));
const chapterSlugs = new Set(catalog.map((c) => c.slug));

const mdxByKey = new Map();
for (const f of walk(P_CONTENT, (p) => p.endsWith(".mdx"))) {
  const r = f.slice(P_CONTENT.length + 1).replace(/\\/g, "/");
  const parts = r.split("/");
  if (parts.length === 2) mdxByKey.set(parts[0] + "/" + parts[1].replace(/\.mdx$/, ""), f);
}

// 组件实现名 → 文件（相对 ROOT）
const compFiles = walk(P_COMPONENTS, (p) => p.endsWith(".tsx"));
const explorerFiles = compFiles.filter((p) => /-explorer\.tsx$/.test(p));
const implName = new Map();
for (const f of compFiles) {
  const m = /export\s+(?:default\s+)?(?:function|const)\s+([A-Z][A-Za-z0-9_]*)/.exec(read(f));
  if (m) implName.set(m[1], rel(f));
}
// 全仓 MDX 引用的组件名（用于孤儿判定）
const globalUsed = new Set();
for (const [, f] of mdxByKey) for (const m of read(f).matchAll(/<([A-Z][A-Za-z0-9_]*)[\s/>]/g)) globalUsed.add(m[1]);

/**
 * E2 起组件注册表只有一个来源：lib/wiki-components.ts 导出的 wikiComponents。
 * mdx-components.tsx 与 lib/content.ts 都从它导入并展开，不再各自内联（fix-015 根治）。
 * 所以第 4 项按课只核一件事：本课引用的组件是否都登记在单一来源里。
 * 「单一来源与两个消费方的结构是否还成立」是全仓事实、不按课变，放汇总里报一次。
 */
function braceBody(src, fromIdx) {
  const open = src.indexOf("{", fromIdx);
  if (open < 0) return null;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") { depth--; if (depth === 0) return src.slice(open + 1, i); }
  }
  return null;
}
function parseSingleSource(p) {
  const src = readIfExists(p);
  if (src === null) return null;
  const at = src.search(/export\s+const\s+wikiComponents\b[^={]*=\s*\{/);
  const keys = new Set();
  if (at >= 0) {
    const body = braceBody(src, at);
    if (body) for (const line of body.split(/\r?\n/)) {
      const m = /^\s*([A-Z][A-Za-z0-9_]*)\s*,?\s*$/.exec(line);
      if (m) keys.add(m[1]);
    }
  }
  return { keys, exported: at >= 0, useClient: /^\s*["']use client["']/m.test(src), path: p };
}
function parseConsumer(label, p) {
  const src = readIfExists(p);
  if (src === null) return { label, missing: true, importsSource: false, spreads: false, inline: 0 };
  const importsSource = /import\s*\{[^}]*\bwikiComponents\b[^}]*\}\s*from\s*["'][^"']*lib\/wiki-components["']/.test(src);
  const spreads = /\.\.\.\s*wikiComponents\b/.test(src);
  // 残留的内联注册：直接 import components/wiki/*（E2 之后两个消费方都不该再有）
  const inline = [...src.matchAll(/import\s+[^;]*?from\s+["'][^"']*components\/wiki\/[^"']+["']/g)].length;
  return { label, missing: false, importsSource, spreads, inline };
}
const singleSource = parseSingleSource(P_WIKI_COMPONENTS);
const consumers = [
  parseConsumer("mdx-components.tsx", P_MDX_COMPONENTS),
  parseConsumer("lib/content.ts", P_LIB_CONTENT),
];

// 讨论日志：semester-XX/<NN-chapter>/<NN-slug>.md → 课程键 → 实际相对路径
const logKeys = new Map();
for (const f of walk(P_DISCUSS, (p) => p.endsWith(".md"))) {
  const r = f.slice(P_DISCUSS.length + 1).replace(/\\/g, "/");
  const parts = r.split("/");
  if (parts.length < 3) continue;
  const chM = /^\d+-(.+)$/.exec(parts[1]);
  const slM = /^\d+-(.+)\.md$/.exec(parts[2]);
  if (chM && slM) logKeys.set(resolveHistoricalLesson(chM[1] + "/" + slM[1]), "docs/discuss-log/" + r);
}

// ---------------------------------------------------------------- dev server 探测
let devAlive = null;   // null=未探测, true/false
function httpGet(pathname, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const req = httpRequest({ host: DEV_HOST, port: DEV_PORT, path: pathname, method: "GET", timeout: timeoutMs }, (res) => {
      const chunks = [];
      res.on("data", (d) => chunks.push(d));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
    });
    req.on("timeout", () => { req.destroy(); resolve({ status: 0, body: "", error: "timeout" }); });
    req.on("error", (e) => resolve({ status: 0, body: "", error: e.code || e.message }));
    req.end();
  });
}
async function probeDev() {
  if (NO_HTTP) return { alive: false, reason: "指定了 --no-http" };
  if (devAlive !== null) return devAlive ? { alive: true } : { alive: false, reason: devAlive };
  const probe = await httpGet("/", 2500);
  if (probe.status === 0) { devAlive = false; return { alive: false, reason: probe.error }; }
  devAlive = true;
  return { alive: true };
}

// ---------------------------------------------------------------- 九项检查
function check1Syntax(rep, src, item) {
  const { tags } = scanMdx(src);
  // 1a JSX 属性之间的逗号（fix-013：会让 next-mdx-remote 编译抛错 → 页面 404 而非 500）
  const commaTags = tags.filter((t) => t.badCommas.length);
  if (commaTags.length) {
    for (const t of commaTags)
      mark(item, "FAIL", "<" + t.name + "> 的 JSX 属性之间出现逗号 " + t.badCommas.length + " 处（行 " + t.badCommas.map((c) => c.line).join(",") + "）→ fix-013：MDX 编译失败，页面返回 404");
  }
  // 1b display math 的 $$ 位置（fix-012）。判据由 micromark 实测 + 7 门课真实渲染结果反推，
  //    不照抄 SKILL.md 的字面表述「$$ 必须独占开/闭行」——实测该表述对「开行」过严：
  //    · 单行 $$…$$（n≥2 且首尾皆 $$）合法，内含 \begin{}/\end{} 也合法（实测 A/H/I：h2 不缺、不吞后文）
  //    · 开 $$ 行带内容 + 闭 $$ 独占行 → 合法（实测 B/E 不吞后文；仓库 4 处真形渲染 katex-error=0、无裸 LaTeX 泄漏）
  //    · 闭 $$ 前有内容（如 \end{aligned}}$$）→ 闭合符不被识别，math 块永不关闭，其后全文被吞
  //      （实测 C/F/G：h2 从 2 掉到 1）。真实事故 mpc/mpc-principle：源码 8 个 H2 只渲染 1 个 + katex-error=2。
  //    故「开行带内容」= WARN（风格债，且是硬违规的前置形态），「闭行带内容」= FAIL（硬门槛）。
  let fence = null, parity = 0, inMath = false;
  const closerBad = [], openerSoft = [];
  linesOf(src).forEach((raw, idx) => {
    const fm = /^(\s*)(`{3,}|~{3,})/.exec(raw);
    if (fm) { if (!fence) fence = fm[2][0]; else if (fence === fm[2][0]) fence = null; return; }
    if (fence) return;
    // 反引号内的 $$ 是行内代码（正文里写「闭合 `$$`」这种），不是数学定界符，先剔除同行的成对反引号段。
    // 只剔成对的：多行模板字符串（setupCode={`…`}）的开/闭行反引号不成对，不受影响。
    // fixture 实测过这个假阳性：不剔就会多算一个 $$，把后面的闭合行误判成开启行。
    const line = raw.replace(/`[^`]*`/g, "").trim();
    const n = (line.match(/\$\$/g) || []).length;
    if (!n) return;
    parity += n;
    const no = idx + 1;
    const s = line.replace(/^(?:>\s?)+/, "").trim();          // 引用块前缀不影响 math-flow
    if (n % 2 === 0) return;                                    // 本行内 $$ 自身配平（含单行 $$…$$）
    if (s !== "$$") {                                           // 裸 $$ 独占行是合法开/闭符，只有带内容才判
      if (inMath) closerBad.push(no + "「" + (s.length > 46 ? s.slice(0, 46) + "…" : s) + "」");
      else openerSoft.push(no);
    }
    inMath = !inMath;
  });
  if (parity % 2 !== 0) mark(item, "FAIL", "$$ 总数为奇数（" + parity + " 个），display math 未闭合" + (inMath ? "（文件结束时仍在 math 块内）" : ""));
  if (closerBad.length) mark(item, "FAIL", "fix-012 硬违规 " + closerBad.length + " 处：闭合 $$ 与内容同行 → 行 " + closerBad.join("、") + " → micromark 不认它是闭合符，math 块永不关闭，其后全文被吞");
  if (openerSoft.length) mark(item, "WARN", "开 $$ 行带内容 " + openerSoft.length + " 处：行 " + openerSoft.slice(0, 8).join("、") + (openerSoft.length > 8 ? " …" : "") + " → 实测可正常渲染，但它是上面那类硬违规的前置形态，建议把公式挪到下一行");
  // 1c 组件显式引用：孤儿组件的全仓清单在汇总里报一次；本项只管「正文提到了组件名却没写标签」
  const orphans = explorerFiles
    .map((f) => [...implName].find(([, v]) => v === rel(f))?.[0])
    .filter((n) => n && !globalUsed.has(n));
  for (const name of orphans) {
    if (src.includes(name))
      mark(item, "FAIL", "组件 " + name + " 在本课正文里以文字出现，却没有 <" + name + " /> 标签 → 页面不出图（intelligent/neural-network-control 的同型事故）");
  }
  if (!commaTags.length && !closerBad.length && parity % 2 === 0)
    mark(item, "PASS", (tags.length ? tags.length + " 个 JSX 标签无属性间逗号" : "本课无 JSX 标签") +
      " · $$ 共 " + parity + " 个且配平" + (openerSoft.length ? "" : " · 无 $$ 同行违规"));
}

async function check2Structure(rep, src, item, lesson) {
  const titles = mdxH2Titles(src);
  const actual = (await renderedHeadings(src, lesson.chapter+"/"+lesson.slug)).h2.map(h=>h.id);
  if (!lesson.subsections || !lesson.subsections.length) {
    mark(item, "WARN", "catalog 里本课没有 subsections（侧栏无本课小节导航），无法核对；MDX 实有 " + actual.length + " 个 H2");
    return;
  }
  const want = lesson.subsections.map((s) => s.slug);
  if (actual.length !== want.length) {
    mark(item, "FAIL", "MDX 源码 H2 数 " + actual.length + " ≠ catalog subsections " + want.length);
    mark(item, "FAIL", "MDX    ：" + actual.join(" | "));
    mark(item, "FAIL", "catalog：" + want.join(" | "));
    return;
  }
  const bad = want.map((s, i) => (s === actual[i] ? null : "第 " + (i + 1) + " 条「" + s + "」应为「" + actual[i] + "」")).filter(Boolean);
  if (bad.length) {
    STATS.q5 += bad.length;
    mark(item, "WARN", bad.length + " 个 subsection slug 与真实渲染ID不符 → 侧栏死锚点（已登记为 Q5）");
    for (const b of bad.slice(0, 4)) mark(item, "WARN", "  " + b);
    if (bad.length > 4) mark(item, "WARN", "  …共 " + bad.length + " 处");
  } else {
    mark(item, "PASS", "H2 " + actual.length + " 个与 catalog subsections 逐条 slug 相等");
  }
}

function check3Notebook(rep, src, item) {
  const codes = extractNotebookCode(src);
  const nSetup = codes.filter((c) => c.kind === "setup").length;
  const nCell = codes.filter((c) => c.kind === "cell").length;
  if (!nSetup && !nCell) { mark(item, "PASS", "本课没有 JupyterNotebook，无需检查"); return; }
  let bad = 0;
  // 3a ipywidgets 家族（fix-004 / fix-006：轻量 Jupyter 服务器不支持 widget）
  const widgetHits = new Map();
  for (const c of codes) for (const m of c.code.matchAll(RE_WIDGETS)) {
    widgetHits.set(m[0], (widgetHits.get(m[0]) || 0) + 1);
    bad++;
  }
  if (widgetHits.size) {
    mark(item, "FAIL", "notebook 代码里出现 ipywidgets 家族 " + bad + " 处（" + [...widgetHits].map(([k, v]) => k + "×" + v).join(", ") + "）→ 轻量内核不支持 widget，应改 React 交互组件（C1 重构目标，A6 已登记存量债务）", true);
  }
  // 3b cell 首行不得是 magic（fix-017：拼接脚本把 `# 注释` 变成 `%# 注释`，IPython 报 UsageError）
  let magic = 0;
  for (const c of codes) {
    const first = c.code.split(/\r?\n/)[0] ?? "";
    if (RE_MAGIC_FIRST.test(first)) {
      magic++;
      mark(item, "FAIL", "第 " + c.line + " 行的 " + c.kind + " 首行是「" + first.slice(0, 40) + "」→ IPython 当 line magic，运行报 UsageError（fix-017）");
    }
  }
  // 3c 拼接残留占位符（fix-017 的同一个根因：%%NB1%% 经一层 % 格式化折叠成 %NB1%）
  const leftover = [];
  for (const c of codes) {
    if (RE_PLACEHOLDER.test(c.code)) leftover.push(c.line);
  }
  if (leftover.length) mark(item, "FAIL", "cell 里残留拼接占位符（行 " + leftover.join(",") + "）→ 拼接脚本没跑完或占位符写错");
  if (!bad && !magic && !leftover.length)
    mark(item, "PASS", nSetup + " 个 setupCode + " + nCell + " 个 cell：无 ipywidgets、首行无 magic、无占位符残留");
}

const INFRA = new Set(["JupyterNotebook", "Callout"]);

function check4Registry(rep, src, item) {
  const { tags } = scanMdx(src);
  const names = [...new Set(tags.map((t) => t.name))];
  const custom = names.filter((n) => implName.has(n) || INFRA.has(n));
  const unknown = names.filter((n) => !implName.has(n) && !INFRA.has(n));
  if (unknown.length) mark(item, "FAIL", "MDX 引用了未实现的组件：" + unknown.join(", ") + " → 页面 500「Expected component to be defined」");
  if (!singleSource || !singleSource.exported) {
    mark(item, "FAIL", "找不到 lib/wiki-components.ts 导出的 wikiComponents → E2 的单一来源被删或改名，两处注册表会重新各自内联（fix-015 复发）");
    return;
  }
  const missing = custom.filter((n) => !singleSource.keys.has(n));
  if (missing.length)
    mark(item, "FAIL", "fix-015：组件已实现且被本课引用，却没登记进单一来源 lib/wiki-components.ts → " + missing.join(", ") +
      "；课程页走 compileMDX({components})，缺登记会抛「Expected component to be defined」，页面 500");
  else
    mark(item, "PASS", custom.length + " 个自定义组件（" + (custom.join(", ") || "无") + "）全部登记在单一来源 lib/wiki-components.ts");
}

/**
 * 取 `xAxis` / `yAxis` 后面的对象字面量（支持 `xAxis: [{…}, {…}]` 数组形式），返回 [{block, line}]
 */
function axisBlocks(src, axis) {
  const out = [];
  for (const m of src.matchAll(new RegExp("\\b" + axis + "\\s*:", "g"))) {
    let i = m.index + m[0].length;
    while (i < src.length) {
      while (i < src.length && /[\s,]/.test(src[i])) i++;
      if (src[i] === "[") { i++; continue; }
      if (src[i] !== "{") break;
      let depth = 0, end = -1;
      for (let j = i; j < src.length; j++) {
        if (src[j] === "{") depth++;
        else if (src[j] === "}") { depth--; if (depth === 0) { end = j; break; } }
      }
      if (end < 0) break;
      out.push({ block: src.slice(i, end + 1), line: lineAt(src, i) });
      i = end + 1;
      if (src[i] === "]") break;
    }
  }
  return out;
}

/**
 * 审一个交互组件，返回问题字符串数组（空 = 合规）。
 * 第 5 项按课调用（只审本课引用的组件），汇总里再对全仓做一次（覆盖孤儿组件）。
 */
function auditComponent(name, file) {
  const p = join(ROOT, file);
  if (!existsSync(p)) return ["实现文件 " + file + " 不存在"];
  const s = read(p);
  const problems = [];
  // 5.1 useECharts 必须 import 且被调用
  if (!/import\s*\{[^}]*\buseECharts\b[^}]*\}\s*from|import\s+useECharts\s+from/.test(s)) problems.push("未 import useECharts");
  const calls = useEChartsArgs(s);
  if (!calls.length) problems.push("未调用 useECharts");
  // 5.2 传参必须是 useMemo 产出的 Option 对象，不能是 callback（fuzzy-controller-design 的 hydration crash 模式）
  const argNames = [];
  for (const c of calls) {
    if (c.isCallback) { problems.push("useECharts 收到 callback 而非 Option 对象 → hydration crash 模式"); continue; }
    for (const a of c.raw) {
      if (!/^[A-Za-z0-9_$]+$/.test(a)) { problems.push("useECharts 的实参不是标识符：" + a.slice(0, 40)); continue; }
      argNames.push(a);
      // 实测：19 处写成 `const option: EChartsOption = useMemo(…)`，正则必须容忍 TS 类型标注
      if (!new RegExp("const\\s+" + a + "\\s*(?::[^=]{0,80})?=\\s*useMemo\\b").test(s))
        problems.push("useECharts 的实参 " + a + " 不是 useMemo 产出的 EChartsOption 对象");
    }
  }
  // 5.3 animation: false（fix-003：标注线动画导致闪烁）。
  // 剔除整行 // 注释后再判：只在注释里写 animation:false 不算设置过（fixture 实测到这个假阴性）。
  if (!/animation:\s*false/.test(noLineComments(s))) problems.push("缺 animation: false");
  /**
   * 5.4 固定坐标轴（fix-002 / fix-005：拖动参数时坐标轴动态缩放）。
   * 判据按轴的 type 分：value / log 轴必须有显式 min 与 max；category 轴的域由 data 数组决定，
   * min/max 在 ECharts 里对 category 轴不适用，故只要求 data 存在。
   * E1 时点实测全仓 124 个轴块：category 4（全有 data）、log 16、value 103（其中 1 个缺 min/max）。
   * 缺省 type 按 ECharts 默认：xAxis → category，yAxis → value。
   */
  for (const axis of ["xAxis", "yAxis"]) {
    const blocks = axisBlocks(s, axis);
    if (!blocks.length) { problems.push(axis + " 未设置对象字面量"); continue; }
    blocks.forEach((b, bi) => {
      const tag = axis + (blocks.length > 1 ? "[" + bi + "]" : "") + "（行 " + b.line + "）";
      const tm = /type:\s*["']([a-z]+)["']/.exec(b.block);
      const type = tm ? tm[1] : (axis === "xAxis" ? "category" : "value");
      if (type === "category") {
        if (!/\bdata\s*:/.test(b.block)) problems.push(tag + " 是 category 轴但没有 data → 类目域不固定");
        return;
      }
      const hasMin = /\bmin\s*:/.test(b.block), hasMax = /\bmax\s*:/.test(b.block);
      if (!hasMin || !hasMax)
        problems.push(tag + " 是 " + type + " 轴但缺 " + (!hasMin && !hasMax ? "min 与 max" : hasMin ? "max" : "min") + " → 坐标轴会随数据动态缩放");
    });
  }
  return problems;
}

function check5Component(rep, src, item, compTargets) {
  if (!compTargets.length) { mark(item, "PASS", "本课未引用交互组件"); return; }
  for (const name of compTargets) {
    const file = implName.get(name);
    if (!file) continue;
    const problems = auditComponent(name, file);
    if (problems.length) for (const pr of problems) mark(item, "FAIL", name + "（" + file + "）：" + pr);
    else mark(item, "PASS", name + "：" + file + " → useECharts ✓ animation:false ✓ 轴固定 ✓ useMemo ✓");
  }
}

/** 取每个 useECharts(…) 调用的实参列表（按顶层逗号切分，忽略括号/字符串内的逗号） */
function useEChartsArgs(src) {
  const out = [];
  for (const m of src.matchAll(/\buseECharts\s*\(/g)) {
    let depth = 1, i = m.index + m[0].length, start = i, args = [], bt = false, q = null, esc = false;
    for (; i < src.length && depth > 0; i++) {
      const c = src[i];
      if (esc) { esc = false; continue; }
      if (c === "\\") { esc = true; continue; }
      if (bt) { if (c === "`") bt = false; continue; }
      if (q) { if (c === q) q = null; continue; }
      if (c === "`") { bt = true; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === "(" || c === "[" || c === "{") depth++;
      else if (c === ")" || c === "]" || c === "}") { depth--; if (depth === 0) { args.push(src.slice(start, i)); break; } }
      else if (c === "," && depth === 1) { args.push(src.slice(start, i)); start = i + 1; }
    }
    out.push({ raw: args.map((a) => a.trim()).filter(Boolean), isCallback: /^\s*(?:\(|function|async)/.test(args[0] || "") });
  }
  return out;
}

async function check6Render(rep, item, lesson) {
  const dev = await probeDev();
  if (!dev.alive) {
    mark(item, "SKIPPED", "dev server 未启动（" + dev.reason + " @" + DEV_HOST + ":" + DEV_PORT + "）→ 跑 node scripts/serve.mjs dev 后重试；本项是唯一需要渲染结果的门槛");
    return;
  }
  const res = await httpGet("/" + lesson.chapter + "/" + lesson.slug, 20000);
  if (res.status !== 200) {
    mark(item, "FAIL", "GET /" + lesson.chapter + "/" + lesson.slug + " → HTTP " + res.status + "（dev 下 MDX 编译失败表现为 404 而非 500；先查 logs/app.log 的「MDX 编译失败」）");
    return;
  }
  const body = res.body;
  const nH1 = (body.match(/<h1[ >]/g) || []).length;
  const nH2 = (body.match(/<h2[ >]/g) || []).length;
  const nKatex = (body.match(/katex-error/g) || []).length;
  const want = lesson.subsections ? lesson.subsections.length : null;
  const renderedH2=[...body.matchAll(/<h2\b[^>]*\bid="([^"]+)"/g)].map(m=>({id:m[1]}));
  const renderedIds=[...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  const anchorErrors=lesson.subsections?assertHeadingTargets(lesson.subsections,renderedH2,renderedIds):[];
  if(new Set(renderedIds).size!==renderedIds.length)anchorErrors.push('DOM存在重复ID');
  for(const error of anchorErrors)mark(item,'FAIL','真实渲染锚点：'+error);
  if (nH1 !== 1) mark(item, "FAIL", "渲染后 <h1> 数 " + nH1 + " ≠ 1");
  if (want === null) mark(item, "WARN", "catalog 无 subsections，无法核对渲染后 H2 数（实得 " + nH2 + "）");
  else if (nH2 !== want) mark(item, "FAIL", "渲染后 <h2> 数 " + nH2 + " ≠ catalog subsections " + want + " → fix-012 的典型症状（源码 H2 数对，DOM 只渲染出一部分）");
  if (nKatex !== 0) mark(item, "FAIL", "HTML 里有 " + nKatex + " 处 katex-error → 数学公式渲染失败（rehype-katex 在编译期运行，错误直接落在 SSR HTML）");
  if (nH1 === 1 && nKatex === 0 && !anchorErrors.length && (want === null || nH2 === want))
    mark(item, "PASS", "HTTP 200 · <h1>=" + nH1 + " · <h2>=" + nH2 + (want === null ? "" : "/" + want) + " · katex-error=" + nKatex);
}

async function check7Links(rep, src, item) {
  const linkRe = /(!?)\[[^\]]*\]\((\/[^)\s]*)\)/g;
  let nCourse = 0, nAsset = 0;
  const dead = [], skeleton = [], anchorBad = [], assetMissing = [];
  const h2Cache = new Map();
  for (const m of src.matchAll(linkRe)) {
    const isImage = m[1] === "!";
    const full = m[2];
    const hashAt = full.indexOf("#");
    const pathPart = hashAt >= 0 ? full.slice(0, hashAt) : full;
    const frag = hashAt >= 0 ? full.slice(hashAt + 1) : null;
    const parts = pathPart.split("/").filter(Boolean);
    if (isImage || !chapterSlugs.has(parts[0])) {
      nAsset++;
      if (!existsSync(join(P_PUBLIC, pathPart))) assetMissing.push(full);
      continue;
    }
    nCourse++;
    const key = resolveHistoricalLesson(parts.join("/"));
    const lesson = catByKey.get(key);
    if (!lesson) { dead.push(full); continue; }
    if (!mdxByKey.has(key)) skeleton.push(full);
    if (frag) {
      const f = mdxByKey.get(key);
      if (!f) { anchorBad.push(full + "（目标课无 MDX）"); continue; }
      if (!h2Cache.has(key)) {
        h2Cache.set(key, new Set((await renderedHeadings(read(f),key)).ids));
      }
      if (!h2Cache.get(key).has(decodeURIComponent(frag))) anchorBad.push(full);
    }
  }
  if (dead.length) for (const d of [...new Set(dead)]) mark(item, "FAIL", "悬空站内链接 " + d + " → catalog 里没有这门课，点击 404");
  if (assetMissing.length) for (const a of [...new Set(assetMissing)]) mark(item, "FAIL", "资源链接 " + a + " 在 public/ 下不存在");
  if (skeleton.length) mark(item, "WARN", [...new Set(skeleton)].length + " 条链接指向 status=empty 的骨架课（" + [...new Set(skeleton)].join(", ") + "）→ 渲染占位页而非正文");
  if (anchorBad.length) for (const a of [...new Set(anchorBad)]) mark(item, "WARN", "锚点 " + a + " 在目标课的 H2 slug 集合里找不到（侧栏/正文死锚点，Q5 同族）");
  // 📐 引用行（A4 的数学依赖引用行；A4 step 4 只出清单未插入正文，故当前全仓为 0）
  const mathLines = linesOf(src).filter((l) => l.includes("\u{1F4D0}"));
  const refLines = mathLines.filter((l) => l.includes("本文用到了"));
  STATS.emojiLines += mathLines.length;
  STATS.refLines += refLines.length;
  if (refLines.length) mark(item, "PASS", "「📐 本文用到了」引用行 " + refLines.length + " 条（另有其它 📐 行 " + (mathLines.length - refLines.length) + " 条），其链接已由本项一并核对");
  if (!dead.length && !assetMissing.length)
    mark(item, "PASS", "站内课程链接 " + nCourse + " 条全部命中 catalog · 资源链接 " + nAsset + " 条全部存在");
}

// 「有 MDX 但没有讨论日志」的门数：必须按 mdxByKey ∩ ¬logKeys 现算，不能写死数字。
// 原稿曾硬编码「全仓 45 门」，那是 A6 时点的实测值，内容一增长就变成假话（B5/B6 已两次栽在这类硬编码上）。
const NO_LOG_TOTAL = [...mdxByKey.keys()].filter((k) => !logKeys.has(k)).length;

function check8Delivery(rep, item, lesson) {
  const logPath = logKeys.get(lesson.chapter + "/" + lesson.slug);
  if (logPath) {
    mark(item, "PASS", "存在讨论日志：" + logPath);
  } else {
    mark(item, "WARN", "没有讨论日志 → wiki-discussion 流程未留痕（全仓 " + NO_LOG_TOTAL + " 门有 MDX 但无日志，0.2 节负债；不阻断签发但要列出）");
  }
}

const EX_RULES = [
  /^\*\*(?:习题|答案)?\s*(\d+)/,
  /^#{3,4}\s*(?:习题|答案)?\s*(\d+)/,
  /^(\d+)[.．、]\s/,
];
function ordinals(lines) {
  const set = new Set();
  let fence = null;
  for (const raw of lines) {
    const fm = /^(\s*)(`{3,}|~{3,})/.exec(raw);
    if (fm) { if (!fence) fence = fm[2][0]; else if (fence === fm[2][0]) fence = null; continue; }
    if (fence) continue;
    const t = raw.trim();
    if (!t) continue;
    for (const re of EX_RULES) { const m = re.exec(t); if (m) { set.add(+m[1]); break; } }
  }
  return set;
}
function check9Exercises(rep, src, item) {
  const titles = mdxH2Titles(src);
  const hasEx = titles.includes("习题"), hasAns = titles.includes("答案");
  // 不在这里写「全仓仅某某课如此」这类跨课断言：它会随内容增长变成假话，
  // 而跨课统计本来就在末尾的「按项统计 FAIL」里由脚本动态算出。
  if (!hasEx && !hasAns) {
    mark(item, "FAIL", "MDX 既无「习题」也无「答案」H2 → 交付硬缺口（本课 " + titles.length + " 个 H2：" +
      titles.slice(0, 6).join(" / ") + (titles.length > 6 ? " …" : "") + "）");
    return;
  }
  if (!hasEx) { mark(item, "FAIL", "缺「习题」H2"); return; }
  if (!hasAns) { mark(item, "FAIL", "有「习题」但缺「答案」H2"); return; }
  const lines = linesOf(src);
  function section(name) {
    const out = []; let cur = false, fence = null;
    for (const raw of lines) {
      const fm = /^(\s*)(`{3,}|~{3,})/.exec(raw);
      if (fm) { if (!fence) fence = fm[2][0]; else if (fence === fm[2][0]) fence = null; if (cur) out.push(raw); continue; }
      if (!fence && /^## /.test(raw)) { cur = raw.slice(3).trim() === name; continue; }
      if (cur) out.push(raw);
    }
    return out;
  }
  const exNums = ordinals(section("习题"));
  const ansNums = ordinals(section("答案"));
  if (!exNums.size) { mark(item, "WARN", "「习题」段里识别不出任何条目标记（实测形态：**n.** / **习题 n（…）** / ### 习题 n / n. ），需人工确认条目数"); return; }
  const missing = [...exNums].filter((n) => !ansNums.has(n)).sort((a, b) => a - b);
  if (!ansNums.size) { mark(item, "FAIL", "「答案」段里识别不出任何条目标记，习题有 " + exNums.size + " 条"); return; }
  if (ansNums.size < exNums.size || missing.length) {
    mark(item, "FAIL", "习题 " + exNums.size + " 条（编号 " + [...exNums].sort((a, b) => a - b).join(",") + "）但答案只覆盖 " + (exNums.size - missing.length) + " 条；答案缺编号：" + (missing.join(",") || "无"));
  } else {
    mark(item, "PASS", "习题 " + exNums.size + " 条，答案覆盖编号 " + [...ansNums].sort((a, b) => a - b).join(",") + " ⊇ 习题编号");
  }
}

// ---------------------------------------------------------------- 单课流程
async function verifyLesson(key) {
  const lesson = catByKey.get(key);
  const rep = makeLessonReport(key);
  if (!lesson) {
    mark(rep.items[1], "FAIL", "catalog 里没有 " + key + " 这门课");
    return rep;
  }
  const file = mdxByKey.get(key);
  if (!file) {
    mark(rep.items[1], "FAIL", "content/" + key + ".mdx 不存在（catalog status=" + (lesson.status || "无") + "）");
    return rep;
  }
  const src = read(file);
  const { tags } = scanMdx(src);
  const compTargets = [...new Set(tags.map((t) => t.name))].filter((n) => /-explorer\.tsx$/.test(implName.get(n) || ""));

  check1Syntax(rep, src, rep.items[0]);
  await check2Structure(rep, src, rep.items[1], lesson);
  check3Notebook(rep, src, rep.items[2]);
  check4Registry(rep, src, rep.items[3]);
  check5Component(rep, src, rep.items[4], compTargets);
  await check6Render(rep, rep.items[5], lesson);
  await check7Links(rep, src, rep.items[6]);
  check8Delivery(rep, rep.items[7], lesson);
  check9Exercises(rep, src, rep.items[8]);

  for (const it of rep.items) {
    rep.counts[it.level === "PASS" ? "PASS" : it.level === "WARN" ? "WARN" : it.level === "FAIL" ? "FAIL" : "SKIPPED"]++;
    R[it.level === "PASS" ? "pass" : it.level === "WARN" ? "warn" : it.level === "FAIL" ? "fail" : "skip"]++;
  }
  return rep;
}

function printReport(rep, lesson) {
  const head = rep.key + (lesson ? "  (status=" + (lesson.status || "无") + ", level=" + (lesson.level || "无") + ", type=" + (lesson.type || "无") + ")" : "");
  console.log("\n" + "─".repeat(78));
  console.log(head);
  console.log("─".repeat(78));
  for (const it of rep.items) {
    const shown = it.level === "PASS" && QUIET && !it.notes.length;
    if (shown) continue;
    console.log("  " + pad(it.n + " " + it.name, 34) + pad(it.level, 9) + (it.notes.length || it.debt.length ? "" : "—"));
    for (const n of it.notes) console.log("      " + n);
    for (const d of it.debt) console.log("      " + d);
  }
  const c = rep.counts;
  console.log("  " + pad("小计", 34) + "PASS " + c.PASS + " · WARN " + c.WARN + " · FAIL " + c.FAIL + " · SKIPPED " + c.SKIPPED);
}

// ---------------------------------------------------------------- 主流程
function targets() {
  if (ALL) return [...mdxByKey.keys()].sort();
  if (DELIVERED) return catLessons.filter((l) => l.status === "v1.3").map((l) => l.chapter + "/" + l.slug);
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root") { i++; continue; }
    if (a.startsWith("--")) continue;
    pos.push(a);
  }
  if (!pos.length) {
    console.log("\n用法：node scripts/verify-lesson.mjs <chapter>/<lesson> | --all | --delivered [--root DIR] [--no-http] [--quiet]");
    process.exit(2);
  }
  return pos;
}

const list = targets();
console.log("待验课程 " + list.length + " 门 · 交互组件 " + explorerFiles.length + " 个 · 讨论日志 " + logKeys.size + " 门 · dev server " + (NO_HTTP ? "跳过" : DEV_HOST + ":" + DEV_PORT));
console.log("口径：第 2 项使用与页面共享的真实编译标题ID，第 6 项在 HTML 上复核数量与目标（fix-012 曾出现源码 12 个、DOM 只 2 个）。");
console.log("      第 8 项按 E1 推荐 Prompt 只查讨论日志「是否存在」；B4 的 16 条日志结构口径未纳入，登记为 E1 缺口。");

const reports = [];
for (const key of list) {
  const rep = await verifyLesson(key);
  reports.push(rep);
  if (!QUIET || rep.counts.FAIL || rep.counts.WARN) printReport(rep, catByKey.get(key));
}

// ---------------------------------------------------------------- 汇总与健康度分级
const clean = [], warnOnly = [];
for (const rep of reports) {
  if (rep.items.some((i) => i.level === "FAIL")) continue;
  (rep.items.some((i) => i.level === "WARN") ? warnOnly : clean).push(rep.key);
}
// 纯债务：所有 FAIL 项都只有 [存量债务] 文案（当前仅第 3 项的 ipywidgets），没有非债务 FAIL
function isDebtOnly(rep) {
  const failItems = rep.items.filter((i) => i.level === "FAIL");
  if (!failItems.length) return false;
  return failItems.every((i) => i.debt.length > 0 && i.notes.length === 0);
}
const debtOnly = reports.filter((r) => isDebtOnly(r)).map((r) => r.key);
const hardFail = reports.filter((r) => r.items.some((i) => i.level === "FAIL") && !isDebtOnly(r)).map((r) => r.key);

console.log("\n" + "=".repeat(78));
console.log("汇总");
console.log("=".repeat(78));
console.log("课程 " + reports.length + " 门 · 检查项 " + (reports.length * 9) + " 个");
console.log("  PASS " + R.pass + " · WARN " + R.warn + " · FAIL " + R.fail + " · SKIPPED " + R.skip);
console.log("  「📐 本文用到了」引用行合计 " + STATS.refLines + " 条（另有其它 📐 装饰行 " + (STATS.emojiLines - STATS.refLines) + " 条）");
console.log("  Q5 侧栏死锚点合计 " + STATS.q5 + " 处（本次所验课程范围内，第 2 项 WARN）");
// 孤儿 = 已实现但全仓无 MDX 引用。是否在单一来源里登记要分开报：
// 实测 bode-margins-explorer.tsx 两处都不满足（无引用 + 从未登记进任何注册表），
// 所以它一旦被人引用，先撞上的是 fix-015 的 500，不是轴漂移。
const orphanComps = explorerFiles
  .map((f) => ({ name: [...implName].find(([, v]) => v === rel(f))?.[0], file: rel(f) }))
  .filter((o) => o.name && !globalUsed.has(o.name));
console.log("  孤儿交互组件（已实现、全仓无 MDX 引用，Q3）：" + orphanComps.length + " 个" +
  (orphanComps.length ? " → " + orphanComps.map((o) =>
    o.name + "(" + o.file + (singleSource && singleSource.keys.has(o.name) ? "" : "，且未登记进单一来源") + ")").join(", ") : ""));

/**
 * 附：全仓组件规范扫描。
 * E1 推荐 Prompt 第 5 项写的是「扫描 components/wiki/*-explorer.tsx」——按目录扫，不是按课扫。
 * 按课的口径放在第 5 项里（只审本课引用的组件），这里补一遍全仓，好覆盖孤儿组件：
 * 实测 bode-margins-explorer.tsx 的 yAxis 是 value 轴却没写 min/max，而它不被任何课引用，
 * 所以任何按课的门槛都永远扫不到它（Q3 孤儿 + fix-002 违规叠在一起）。
 * 退出码口径：--all / --delivered 这类全仓运行把本节的违规计为 FAIL；
 * 单课运行只作提示（否则验 A 课会因为无关的 B 组件而失败，门槛就不可用了）。
 */
const compViolations = [];
for (const f of explorerFiles) {
  const name = [...implName].find(([, v]) => v === rel(f))?.[0];
  if (!name) continue;
  const problems = auditComponent(name, rel(f));
  if (problems.length) compViolations.push({ name, file: rel(f), problems });
}
const repoWide = ALL || DELIVERED;
console.log("\n按项统计 FAIL：");
for (let n = 0; n < 9; n++) {
  const hits = reports.filter((r) => r.items[n].level === "FAIL");
  console.log("  " + pad((n + 1) + " " + ITEM_NAMES[n], 34) + (hits.length ? "FAIL " + hits.length + " 门 → " + hits.map((r) => r.key).slice(0, 10).join(", ") + (hits.length > 10 ? " …" : "") : "0"));
}
console.log("\n健康度分级：");
console.log("  A 级 · 全绿（0 FAIL 0 WARN，可直接进 C1 重构）：" + clean.length + " 门");
if (clean.length) console.log("      " + clean.join(", "));
const skippedLessons = reports.filter((r) => r.items.some((i) => i.level === "SKIPPED")).map((r) => r.key);
if (skippedLessons.length)
  console.log("      （注：其中 " + skippedLessons.length + " 门含 SKIPPED 项 → 第 6 项渲染层未经验证，" +
    "起 dev server 后重跑才算真全绿）");
console.log("  B 级 · 仅 WARN（可进 C1，WARN 需登记）：" + warnOnly.length + " 门");
if (warnOnly.length) console.log("      " + warnOnly.join(", "));
console.log("  C 级 · 只有 ipywidgets 存量债务 FAIL（正是 C1 的重构目标，A6 已登记）：" + debtOnly.length + " 门");
if (debtOnly.length) console.log("      " + debtOnly.join(", "));
console.log("  D 级 · 有非债务 FAIL（必须先修再进 C1）：" + hardFail.length + " 门");
for (const k of hardFail) {
  const rep = reports.find((r) => r.key === k);
  const why = rep.items.filter((i) => i.level === "FAIL" && i.notes.length).map((i) => "第" + i.n + "项");
  console.log("      " + pad(k, 46) + (why.join("、") || "（见明细）"));
}

console.log("\n附 · 全仓组件规范扫描（" + explorerFiles.length + " 个 *-explorer.tsx，含未被任何课引用的孤儿）：");
if (!compViolations.length) console.log("  全部合规：useECharts ✓ animation:false ✓ 轴固定 ✓ useMemo ✓");
else for (const v of compViolations) {
  console.log("  " + v.name + "（" + v.file + "）" + (globalUsed.has(v.name) ? "" : "  ← 孤儿组件，无课程引用"));
  for (const p of v.problems) console.log("      " + p);
}
if (compViolations.length && !repoWide)
  console.log("  （单课运行：以上违规只作提示，不计入本次退出码；跑 --all 才计入）");

/**
 * 附：组件注册结构核对（E2 起）。这一节核的是全仓结构事实、不随课程变，所以只报一次。
 * 退出码口径与上面的组件规范扫描相同：--all / --delivered 计入 FAIL，单课运行只作提示。
 */
const regProblems = [];
if (!singleSource) regProblems.push("lib/wiki-components.ts 不存在 → E2 的单一来源被删或改名，两处注册表会重新各自内联（fix-015 复发）");
else {
  if (!singleSource.exported) regProblems.push("lib/wiki-components.ts 里没有 export const wikiComponents → 两个消费方无从导入");
  if (singleSource.useClient) regProblems.push('lib/wiki-components.ts 带 "use client" → 导出对象会变成一个 client reference，服务端 lib/content.ts 里 {...wikiComponents} 展开后拿不到组件（页面 500）');
}
for (const c of consumers) {
  if (c.missing) { regProblems.push(c.label + " 不存在 → @next/mdx 约定入口或课程页编译入口丢失"); continue; }
  if (!c.importsSource) regProblems.push(c.label + " 没有从 lib/wiki-components.ts 导入 wikiComponents → 注册表又分叉了（fix-015）");
  else if (!c.spreads) regProblems.push(c.label + " 导入了 wikiComponents 却没展开（...wikiComponents）→ 映射为空，引用任何自定义组件的页面都会 500");
  if (c.inline) regProblems.push(c.label + " 还残留 " + c.inline + " 条直接 import components/wiki/* → 内联注册未清干净，会与单一来源分叉");
}
console.log("\n附 · 组件注册结构（E2 起单一来源 lib/wiki-components.ts，登记 " + (singleSource ? singleSource.keys.size : 0) + " 个组件）：");
if (!regProblems.length)
  console.log('  单一来源 ✓ 无 "use client" ✓ mdx-components.tsx 与 lib/content.ts 均导入并展开 ✓ 无内联残留 ✓');
else for (const p of regProblems) console.log("  " + p);
if (regProblems.length && !repoWide)
  console.log("  （单课运行：以上违规只作提示，不计入本次退出码；跑 --all 才计入）");

const extraComp = repoWide ? compViolations.length : 0;
const extraReg = repoWide ? regProblems.length : 0;
const extraFail = extraComp + extraReg;
const totalFail = R.fail + extraFail;
console.log("\n判定：退出码 " + (totalFail ? "1（有 FAIL）" : "0（无 FAIL）") +
  " · 课程项 FAIL " + R.fail +
  (extraComp ? " + 全仓组件规范违规 " + extraComp : "") +
  (extraReg ? " + 全仓注册结构违规 " + extraReg : ""));
process.exit(totalFail ? 1 : 0);
