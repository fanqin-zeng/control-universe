#!/usr/bin/env node
/**
 * check-catalog.mjs —— 交付统计的唯一权威来源（semester-02 A7 / A8）
 *
 * 交叉核对五处：content/catalog.ts、content/<chapter>/<lesson>.mdx、
 * .agent/delivery-tracker.md、docs/discuss-log/course-*\/、components/wiki/*.tsx
 * A8 起再基于 prereq 字段校验依赖图（环 / 悬空边 / 章序违反 / 孤儿课 / 拓扑层级）。
 *
 * 默认只读。写入需显式加 --fix-outline / --fix-tracker-stats。--topo 打印每课拓扑层级。
 * 退出码：任何 FAIL → 1；仅 WARN 或全绿 → 0。
 * 仅用 Node 20+ 内置能力（fs / path），不引入新依赖。
 */
import { writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// E3：解析原语与 catalog 解析已抽成单一来源（原先本文件与 verify-lesson.mjs 各存一份）
import { read, readIfExists, linesOf, walk, mdxH2Titles } from "./lib-mdx.mjs";
import { parseCatalog, slugify, makeSlugger } from "./lib-catalog.mjs";

// ---------------------------------------------------------------- 参数与路径
const argv = process.argv.slice(2);
const FIX_OUTLINE = argv.includes("--fix-outline");
const FIX_TRACKER = argv.includes("--fix-tracker-stats");
const QUIET = argv.includes("--quiet");
const SHOW_TOPO = argv.includes("--topo");
const rootArg = argv.indexOf("--root");
const ROOT = (rootArg >= 0 ? argv[rootArg + 1] : join(dirname(fileURLToPath(import.meta.url)), ".."))
  .replace(/\\/g, "/")
  .replace(/\/+$/, "");

const P_CATALOG = join(ROOT, "content/catalog.ts");
const P_CONTENT = join(ROOT, "content");
const P_TRACKER = join(ROOT, ".agent/delivery-tracker.md");
const P_OUTLINE = join(ROOT, "OUTLINE.md");
const P_DISCUSS = join(ROOT, "docs/discuss-log");
const P_COMPONENTS = join(ROOT, "components/wiki");
const P_MDX_COMPONENTS = join(ROOT, "mdx-components.tsx");
const P_LIB_CONTENT = join(ROOT, "lib/content.ts");
const P_WIKI_COMPONENTS = join(ROOT, "lib/wiki-components.ts");

let fails = 0;
let warns = 0;
const passes = [];
function FAIL(msg) { fails++; console.log("  FAIL  " + msg); }
function WARN(msg) { warns++; console.log("  WARN  " + msg); }
function PASS(msg) { passes.push(msg); if (!QUIET) console.log("  PASS  " + msg); }
function INFO(msg) { if (!QUIET) console.log("        " + msg); }
function SECTION(n, title) { console.log("\n[" + n + "] " + title); }

function eolOf(text) { return text.includes("\r\n") ? "\r\n" : "\n"; }

// ================================================================ 载入五处数据
console.log("check-catalog.mjs · 根目录：" + ROOT);
if (!existsSync(P_CATALOG)) { console.log("FAIL  找不到 " + P_CATALOG); process.exit(1); }
const catalogRaw = read(P_CATALOG);
let catalog;
try { catalog = parseCatalog(catalogRaw); }
catch (e) { console.log("FAIL  catalog.ts 解析失败：" + e.message); process.exit(1); }

const catLessons = [];   // { chapter, chapterTitle, slug, title, subsections, prereq, level, type, status, index }
catalog.forEach((ch, ci) => ch.lessons.forEach((l, li) => catLessons.push({
  chapter: ch.slug, chapterTitle: ch.title, chapterIndex: ci, ...l, index: li,
})));
const catKey = (l) => l.chapter + "/" + l.slug;
const catByKey = new Map(catLessons.map((l) => [catKey(l), l]));

const mdxFiles = walk(P_CONTENT, (p) => p.endsWith(".mdx"));
const mdxByKey = new Map();
for (const f of mdxFiles) {
  const rel = f.slice(P_CONTENT.length + 1).replace(/\\/g, "/");
  const parts = rel.split("/");
  if (parts.length !== 2) continue;
  mdxByKey.set(parts[0] + "/" + parts[1].replace(/\.mdx$/, ""), f);
}

const trackerRaw = readIfExists(P_TRACKER);
const outlineRaw = readIfExists(P_OUTLINE);

// ============================================================ 1. catalog 自身统计
SECTION(1, "catalog.ts 规模与分布");
const totalLessons = catLessons.length;
const byStatus = {}, byLevel = {}, byType = {};
for (const l of catLessons) {
  const s = l.status || "(无)"; byStatus[s] = (byStatus[s] || 0) + 1;
  const lv = l.level || "(无)"; byLevel[lv] = (byLevel[lv] || 0) + 1;
  const t = l.type || "(无)"; byType[t] = (byType[t] || 0) + 1;
}
const subCount = catLessons.reduce((a, l) => a + (l.subsections ? l.subsections.length : 0), 0);
console.log("  章数 " + catalog.length + " · 课程数 " + totalLessons + " · 小节数 " + subCount);
console.log("  各章课程数：" + catalog.map((c) => c.slug + " " + c.lessons.length).join(" / "));
console.log("  status：" + Object.entries(byStatus).map(([k, v]) => k + "=" + v).join("  "));
console.log("  level ：" + Object.entries(byLevel).map(([k, v]) => k + "=" + v).join("  "));
console.log("  type  ：" + Object.entries(byType).map(([k, v]) => k + "=" + v).join("  "));
// order 字段与数组下标一致性（A5 起 order 只是元数据，无消费方，但两者不应矛盾）
const orderBad = catalog.filter((c, i) => c.order !== undefined && c.order !== i);
if (orderBad.length) FAIL("order 与数组下标不符：" + orderBad.map((c) => c.slug + "(order=" + c.order + ")").join(", "));
else PASS(catalog.length + " 章 order 字段与数组下标一致（0.." + (catalog.length - 1) + "）");

// ============================================================ 2. catalog ↔ 文件系统
SECTION(2, "catalog ↔ MDX 文件系统交叉核对");
const missingMdx = [], orphanMdx = [], statusLies = [];
for (const l of catLessons) {
  const has = mdxByKey.has(catKey(l));
  if (!has && l.status !== "empty") missingMdx.push(catKey(l) + "（status=" + (l.status || "无") + "）");
  if (has && l.status === "empty") statusLies.push(catKey(l) + "：status=empty 但 MDX 存在");
}
for (const [k] of mdxByKey) if (!catByKey.has(k)) orphanMdx.push(k);
if (missingMdx.length) { for (const m of missingMdx) FAIL("catalog 有条目但 MDX 缺失且 status≠empty → 页面会 404：" + m); }
else PASS("无「catalog 有条目但 MDX 缺失且 status≠empty」");
if (orphanMdx.length) { for (const m of orphanMdx) FAIL("MDX 存在但 catalog 无条目 → 正文不可达：" + m); }
else PASS("无孤儿 MDX（" + mdxByKey.size + " 个 MDX 全部有 catalog 条目）");
if (statusLies.length) { for (const m of statusLies) WARN(m + "（应改为 draft/v1.3，否则渲染占位页而非正文）"); }
else PASS("status=empty 的课确实都没有 MDX");
// 跨章重复 slug：A6 迁移期 by design 允许（kalman-filter / safe-rl / multi-agent-rl 两侧并存）
const slugSeen = new Map();
for (const l of catLessons) {
  if (!slugSeen.has(l.slug)) slugSeen.set(l.slug, []);
  slugSeen.get(l.slug).push(l.chapter);
}
const dupSlug = [...slugSeen].filter(([, v]) => v.length > 1);
if (dupSlug.length) { for (const [s, v] of dupSlug) WARN("slug 跨章重复：" + s + " → " + v.join(", ") + "（路由按 (chapter,lesson) 组合键取文件，不冲突；A6 迁移期属预期）"); }
else PASS("无跨章重复 slug");
const emptyNoMdx = catLessons.filter((l) => l.status === "empty").length;
INFO("MDX 文件 " + mdxByKey.size + " 个 · catalog 骨架课(status=empty) " + emptyNoMdx + " 门 · 有正文 " + (totalLessons - emptyNoMdx) + " 门");

// ============================================================ 3. tracker 交叉核对
SECTION(3, "delivery-tracker.md ↔ catalog 交叉核对");
let trackerChecked = 0, trackerRows = 0, trackerStats = null;
if (!trackerRaw) {
  WARN("找不到 .agent/delivery-tracker.md，跳过本节");
} else {
  const rowRe = /^\| \[( |x)\] (.+?) \(([a-z0-9-]+)\) \|/gm;
  const secRe = /^### (.+?) \(([a-z0-9-]+)\)$/gm;
  const secs = [...trackerRaw.matchAll(secRe)].map((m) => ({ title: m[1], slug: m[2], at: m.index }));
  const rows = [...trackerRaw.matchAll(rowRe)].map((m) => ({ checked: m[1] === "x", title: m[2], slug: m[3], at: m.index }));
  trackerRows = rows.length; trackerChecked = rows.filter((r) => r.checked).length;
  for (const r of rows) {
    const sec = [...secs].reverse().find((s) => s.at < r.at);
    r.chapter = sec ? sec.slug : "(未知章)";
  }
  // 3.1 章序 = catalog 数组序
  const secOrder = secs.map((s) => s.slug);
  const catOrder = catalog.map((c) => c.slug);
  if (JSON.stringify(secOrder) !== JSON.stringify(catOrder))
    FAIL("tracker 章节顺序 ≠ catalog 数组顺序\n        tracker: " + secOrder.join(",") + "\n        catalog: " + catOrder.join(","));
  else PASS("tracker " + secOrder.length + " 章顺序 == catalog 数组顺序");
  // 3.2 逐行 slug+title 与 catalog 逐课对应
  let pos = 0, rowMismatch = 0;
  for (const l of catLessons) {
    const r = rows[pos++];
    if (!r || r.slug !== l.slug || r.chapter !== l.chapter) {
      FAIL("行错位 @" + pos + "：期望 " + catKey(l) + "，实际 " + (r ? r.chapter + "/" + r.slug : "(无)")); rowMismatch++;
    } else if (r.title !== l.title) {
      FAIL("标题不符 " + catKey(l) + "：tracker「" + r.title + "」 vs catalog「" + l.title + "」"); rowMismatch++;
    }
  }
  if (rows.length !== totalLessons) { FAIL("行数 " + rows.length + " ≠ catalog 课程数 " + totalLessons); rowMismatch++; }
  if (!rowMismatch) PASS("tracker " + rows.length + " 行与 catalog 逐课 slug+标题一致");
  // 3.3 [x] ↔ status == "v1.3"
  const tickMismatch = [];
  for (const r of rows) {
    const l = catByKey.get(r.chapter + "/" + r.slug);
    if (!l) continue;
    if (r.checked && l.status !== "v1.3") tickMismatch.push(r.chapter + "/" + r.slug + "：tracker 已打勾但 status=" + (l.status || "无"));
    if (!r.checked && l.status === "v1.3") tickMismatch.push(r.chapter + "/" + r.slug + "：status=v1.3 但 tracker 未打勾");
  }
  if (tickMismatch.length) { for (const m of tickMismatch) FAIL("打勾与 status 不一致 → " + m); }
  else PASS("tracker 打勾行（" + trackerChecked + "）与 catalog status=\"v1.3\" 完全对应");
  // 3.4 底部统计行。这行历史上改过格式（旧：「（33个交互组件已交付）」），所以只强约束
  //     「N / M 课程已完成」主干；尾部数字出现即核对，未出现记为 null（不算 FAIL，但会提示）。
  const statRe = /\*\*统计\*\*：\s*(\d+)\s*\/\s*(\d+)\s*课程已完成(.*)$/m;
  const sm = trackerRaw.match(statRe);
  if (!sm) FAIL("tracker 底部统计行缺失或主干无法识别（期望「**统计**：N / M 课程已完成…」）");
  else {
    const tail = sm[3];
    const pick = (re) => { const m = tail.match(re); return m ? +m[1] : null; };
    trackerStats = {
      done: +sm[1], total: +sm[2],
      chapters: pick(/(\d+)\s*章/),
      comps: pick(/(\d+)\s*个交互组件/),
      usedComps: pick(/其中\s*(\d+)\s*个被课程正文引用/),
      raw: sm[0],
    };
    INFO("识别到统计行：" + sm[0].trim());
  }
}

// ============================================================ 4. 讨论日志覆盖
SECTION(4, "讨论日志覆盖（0.2 节负债的自动化检测）");
const logFiles = walk(P_DISCUSS, (p) => p.endsWith(".md"));
const logKeys = new Set();
for (const f of logFiles) {
  const rel = f.slice(P_DISCUSS.length + 1).replace(/\\/g, "/").split("/");
  if (rel.length < 3) continue;                     // course-XX/<NN-chapter>/<NN-slug>.md
  const chM = /^\d+-(.+)$/.exec(rel[1]);
  const slM = /^\d+-(.+)\.md$/.exec(rel[2]);
  if (chM && slM) logKeys.add(chM[1] + "/" + slM[1]);
}
console.log("  讨论日志 " + logFiles.length + " 篇，可映射到课程 " + logKeys.size + " 门");
const unknownLog = [...logKeys].filter((k) => !catByKey.has(k));
if (unknownLog.length) WARN("日志文件名无法对应 catalog 课程：" + unknownLog.join(", "));
const withMdx = catLessons.filter((l) => mdxByKey.has(catKey(l)));
const noLog = withMdx.filter((l) => !logKeys.has(catKey(l)));
if (noLog.length) {
  WARN("已有 MDX 但无讨论日志：**" + noLog.length + " 门**（占有正文课程的 " + Math.round(noLog.length * 100 / withMdx.length) + "%）");
  INFO(noLog.map((l) => catKey(l)).join(", "));
} else PASS("所有有 MDX 的课程都有讨论日志");

// ============================================================ 5. 交互组件交叉核对
SECTION(5, "components/wiki 组件 ↔ MDX 引用 ↔ 单一来源注册表（E2 起，fix-015 已根治）");
const compFiles = walk(P_COMPONENTS, (p) => p.endsWith(".tsx"));
const explorerFiles = compFiles.filter((p) => /-explorer\.tsx$/.test(p));
const implName = new Map();   // 组件名 → 文件
for (const f of compFiles) {
  const src = read(f);
  const m = /export\s+(?:default\s+)?(?:function|const)\s+([A-Z][A-Za-z0-9_]*)/.exec(src);
  if (m) implName.set(m[1], f.slice(ROOT.length + 1).replace(/\\/g, "/"));
}
const usedNames = new Map();  // 组件名 → 引用它的 MDX 数
for (const [, f] of mdxByKey) {
  const src = read(f);
  for (const m of src.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)) {
    usedNames.set(m[1], (usedNames.get(m[1]) || 0) + 1);
  }
}
/**
 * E2 起组件注册表只有一个来源：lib/wiki-components.ts 导出的 wikiComponents，
 * mdx-components.tsx 与 lib/content.ts 都从它导入并展开（fix-015 根治）。
 * 本节因此改为核「单一来源是否覆盖了 MDX 引用的组件」+「两个消费方是否还从它导入」。
 * 注意：改这里必须同步改 scripts/verify-lesson.mjs 的第 4 项（两份解析逻辑，E3 应抽公共模块）。
 */
function singleSourceKeys(p) {
  const src = readIfExists(p);
  if (src === null) return null;
  const at = src.search(/export\s+const\s+wikiComponents\b[^={]*=\s*\{/);
  if (at < 0) return new Set();
  const open = src.indexOf("{", at);
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  const keys = new Set();
  if (end > 0) for (const line of src.slice(open + 1, end).split(/\r?\n/)) {
    const m = /^\s*([A-Z][A-Za-z0-9_]*)\s*,?\s*$/.exec(line);
    if (m) keys.add(m[1]);
  }
  return keys;
}
const registered = singleSourceKeys(P_WIKI_COMPONENTS);
console.log("  组件文件 " + compFiles.length + " 个（其中 *-explorer.tsx " + explorerFiles.length + " 个）· MDX 引用的组件名 " + usedNames.size + " 个");
const notImpl = [...usedNames].filter(([n]) => !implName.has(n) && n !== "JupyterNotebook" && n !== "Callout");
if (notImpl.length) { for (const [n] of notImpl) FAIL("MDX 引用但未实现/未导出：" + n + "（页面会 500: Expected component to be defined）"); }
else PASS("MDX 引用的组件全部有实现");
const unused = [...implName].filter(([n, f]) => /-explorer\.tsx$/.test(f) && !usedNames.has(n));
if (unused.length) {
  for (const [n, f] of unused)
    WARN("已实现但无任何 MDX 引用（孤儿组件，Q3 类）：" + n + " → " + f +
      (registered && !registered.has(n) ? "（且未登记进 lib/wiki-components.ts，一旦被引用会先撞 fix-015 的 500）" : ""));
}
else PASS("无孤儿交互组件");
if (registered === null) {
  FAIL("找不到 lib/wiki-components.ts → E2 的组件注册单一来源被删或改名（fix-015 会复发）");
} else {
  // 只算「已实现却没登记」的那部分；「压根没实现」的由上面 notImpl 报，避免同一根因报两遍
  const notReg = [...usedNames].filter(([n]) =>
    (implName.has(n) || n === "JupyterNotebook" || n === "Callout") && !registered.has(n));
  if (notReg.length) { for (const [n] of notReg) FAIL("fix-015：MDX 引用了 " + n + "，但它没登记进 lib/wiki-components.ts → 课程页 500"); }
  // 与 verify-lesson.mjs 附录同口径：单一来源一旦带上 "use client"，导出对象整体变成一个 client
  // reference，服务端 {...wikiComponents} 展开后一个组件都拿不到，比漏登记更致命。
  const wsBad = /^\s*["']use client["']/m.test(readIfExists(P_WIKI_COMPONENTS) ?? "");
  if (wsBad) FAIL('lib/wiki-components.ts 带 "use client" → 导出对象会变成一个 client reference，服务端 lib/content.ts 里 {...wikiComponents} 展开后拿不到组件（页面 500）');
  const badConsumers = [];
  for (const [p, label] of [[P_MDX_COMPONENTS, "mdx-components.tsx"], [P_LIB_CONTENT, "lib/content.ts"]]) {
    const src = readIfExists(p);
    if (src === null) { badConsumers.push(label + " 文件不存在"); continue; }
    const importsSource = /import\s*\{[^}]*\bwikiComponents\b[^}]*\}\s*from\s*["'][^"']*lib\/wiki-components["']/.test(src);
    const spreads = /\.\.\.\s*wikiComponents\b/.test(src);
    const inline = [...src.matchAll(/import\s+[^;]*?from\s+["'][^"']*components\/wiki\/[^"']+["']/g)].length;
    if (!importsSource || !spreads || inline)
      badConsumers.push(label + "（导入 wikiComponents=" + importsSource + "、展开=" + spreads +
        "、残留内联 import components/wiki/* " + inline + " 条）");
  }
  if (badConsumers.length) { for (const b of badConsumers) FAIL("没有正确消费单一来源 lib/wiki-components.ts → 注册表分叉，fix-015 复发：" + b); }
  if (!notReg.length && !wsBad && !badConsumers.length)
    PASS("单一来源 lib/wiki-components.ts 登记 " + registered.size + " 个组件、覆盖 MDX 引用的全部 " +
      usedNames.size + " 个；无 \"use client\"；mdx-components.tsx 与 lib/content.ts 均从它导入并展开、无内联残留（fix-015 已根治）");
}
const usedExplorers = explorerFiles.filter((f) => {
  const n = [...implName].find(([, v]) => v === f.slice(ROOT.length + 1).replace(/\\/g, "/"));
  return n && usedNames.has(n[0]);
}).length;

// ============================================================ 6. subsections ↔ MDX H2
SECTION(6, "catalog subsections ↔ MDX 的 H2 序列");
let subCountMismatch = 0, subSlugMismatch = 0, subChecked = 0;
for (const l of catLessons) {
  const f = mdxByKey.get(catKey(l));
  if (!f) continue;
  if (!l.subsections) { WARN(catKey(l) + "：有 MDX 但 catalog 无 subsections（侧栏无本课小节导航）"); continue; }
  subChecked++;
  const titles = mdxH2Titles(read(f));
  const slug = makeSlugger();
  const actual = titles.map((t) => slug(t));
  const want = l.subsections.map((s) => s.slug);
  if (actual.length !== want.length) {
    subCountMismatch++;
    FAIL(catKey(l) + "：H2 数 " + actual.length + " ≠ catalog subsections " + want.length +
      "\n        MDX    : " + actual.join(" | ") + "\n        catalog: " + want.join(" | "));
    continue;
  }
  const bad = want.map((s, i) => (s === actual[i] ? null : "「" + s + "」应为「" + actual[i] + "」")).filter(Boolean);
  if (bad.length) {
    subSlugMismatch++;
    WARN(catKey(l) + "：" + bad.length + " 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决）\n        " + bad.join("\n        "));
  }
}
if (!subCountMismatch) PASS(subChecked + " 门有 MDX 且有 subsections 的课程，H2 数与 catalog 全部相等");
INFO("小节数不符 " + subCountMismatch + " 门（FAIL）· slug 不符 " + subSlugMismatch + " 门（WARN/Q5）· 已核 " + subChecked + " 门");

// ============================================================ 7. OUTLINE.md 一致性
SECTION(7, "OUTLINE.md ↔ 实际");
if (!outlineRaw) {
  WARN("找不到 OUTLINE.md（--fix-outline 可生成）");
} else {
  // done/todo 兼容旧标签（「已完成」「待编写」），这样旧文件仍能拿到数值对比而不只是格式告警
  const oStats = {
    chapters: /\*\*总章节数\*\*:\s*(\d+)/.exec(outlineRaw)?.[1],
    lessons: /\*\*总模块数\*\*:\s*(\d+)/.exec(outlineRaw)?.[1],
    done: (/\*\*(?:已交付 v1\.3|已完成)\*\*:\s*(\d+)/.exec(outlineRaw) || [])[1],
    todo: (/\*\*(?:未完成 v1\.3|待编写)\*\*:\s*(\d+)/.exec(outlineRaw) || [])[1],
  };
  const canonical = /\*\*已交付 v1\.3\*\*:/.test(outlineRaw) && /\*\*未完成 v1\.3\*\*:/.test(outlineRaw);
  if (oStats.chapters === undefined || oStats.lessons === undefined) FAIL("OUTLINE.md 统计块缺失或格式无法识别（跑 --fix-outline 重新生成）");
  else {
    if (+oStats.chapters !== catalog.length) FAIL("OUTLINE.md 总章节数 " + oStats.chapters + " ≠ 实际 " + catalog.length);
    if (+oStats.lessons !== totalLessons) FAIL("OUTLINE.md 总模块数 " + oStats.lessons + " ≠ 实际 " + totalLessons);
    const realDone = catLessons.filter((l) => l.status === "v1.3").length;
    if (oStats.done === undefined) FAIL("OUTLINE.md 统计块无「已完成/已交付 v1.3」键");
    else if (+oStats.done !== realDone) FAIL("OUTLINE.md 已交付 v1.3 " + oStats.done + " ≠ status=v1.3 实数 " + realDone);
    if (oStats.todo === undefined) FAIL("OUTLINE.md 统计块无「待编写/未完成 v1.3」键");
    else if (+oStats.todo !== totalLessons - realDone) FAIL("OUTLINE.md 未完成 v1.3 " + oStats.todo + " ≠ 实数 " + (totalLessons - realDone));
    if (!canonical) FAIL("OUTLINE.md 用的是手工遗留的旧统计标签（跑 --fix-outline 重新生成）");
  }
  // OUTLINE 表格里的 slug 集合 vs catalog
  const oSlugs = new Set([...outlineRaw.matchAll(/^\|\s*\d+\.\d+\s*\|[^|]*\|\s*([a-z0-9-]+)\s*\|/gm)].map((m) => m[1]));
  const catSlugs = new Set(catLessons.map((l) => l.slug));
  const gone = [...oSlugs].filter((s) => !catSlugs.has(s));
  const miss = [...catSlugs].filter((s) => !oSlugs.has(s));
  if (gone.length) FAIL("OUTLINE.md 列出但 catalog 已无的 slug（" + gone.length + "）：" + gone.slice(0, 12).join(", ") + (gone.length > 12 ? " …" : ""));
  if (miss.length) FAIL("catalog 有但 OUTLINE.md 未列的 slug（" + miss.length + "）：" + miss.slice(0, 12).join(", ") + (miss.length > 12 ? " …" : ""));
  if (!gone.length && !miss.length) PASS("OUTLINE.md slug 集合与 catalog 一致");
}

// ============================================================ 8. tracker 统计行 vs 实数
SECTION(8, "tracker 底部统计行 vs 实测（0.1 节口径告警的自动化）");
if (!trackerStats) {
  INFO("（tracker 统计行未识别，见第 3 节）");
} else {
  const checks = [
    ["已完成数", trackerStats.done, trackerChecked],
    ["课程总数", trackerStats.total, totalLessons],
    ["章数", trackerStats.chapters, catalog.length],
    ["交互组件文件数", trackerStats.comps, explorerFiles.length],
    ["被正文引用组件数", trackerStats.usedComps, usedExplorers],
  ];
  let bad = 0;
  const undeclared = [];
  for (const [name, declared, real] of checks) {
    if (declared === null) { undeclared.push(name); continue; }
    if (declared !== real) { FAIL("tracker 统计行「" + name + "」声明 " + declared + "，实测 " + real + " ← 0.1 节口径矛盾"); bad++; }
  }
  if (undeclared.length) INFO("统计行未声明：" + undeclared.join(" / ") + "（--fix-tracker-stats 会补成规范格式）");
  if (!bad) PASS("tracker 统计行 " + (checks.length - undeclared.length) + " 个已声明数字全部与实测一致：" +
    checks.filter((c) => c[1] !== null).map((c) => c[0] + "=" + c[2]).join(" / "));
}

// ============================================================ 9. prereq 依赖图（A8）
// P3 的自动化守卫：章序不得违反依赖方向。P6 补的 prereq 字段在此建边。
//
// 前向边（prereq 所在章排在自身章之后）分两类处理：
//   ① introduction 章整章豁免——§2.1 与 catalog.ts:33 的注释都写明导论章按设计
//      前向引用主干课（controller-selection-guide 要指向 5 个方法族），Q15 又把
//      introduction 冻结在章序第 0 位，所以这里的"违反"是设计而非缺陷。豁免不等于
//      隐藏：每条都打成 INFO，数量变化时肉眼可见。
//   ② 其余章的前向边必须逐条登记在 FORWARD_ALLOWLIST 里并写明理由；未登记 → FAIL。
//      登记条目若在 catalog 中消失（改序或删边）→ 同样 FAIL，防止名单腐化成死数据。
const FORWARD_ALLOWLIST = [
  { own: "estimation/extended-kalman-filter", pre: "nonlinear/lyapunov-stability",
    why: "EKF 的收敛性证明要 Lyapunov 工具；§2.0 把 estimation 排在 nonlinear 之前（Kalman 是 modern 的自然延伸）" },
  { own: "estimation/h-infinity-filter", pre: "robust/h-infinity-basics",
    why: "H∞ 滤波以 H∞ 范数与博弈不等式为前提；§2.0 把 robust 排在 estimation 之后（H∞ 需频域+状态空间+凸优化齐备）" },
  { own: "estimation/mhe-fusion", pre: "mpc/receding-horizon",
    why: "MHE 本质是把滚动时域优化用在估计上，与 MPC 同源；§2.0 把 mpc 排在 estimation 之后" },
  { own: "identification/nonlinear-data-driven-id", pre: "intelligent/neural-network-control",
    why: "神经网络辨识要先懂网络结构与训练；§2.0 把 identification 排在 intelligent 之前（回答「MPC 的模型从哪来」）" },
];

SECTION(9, "prereq 依赖图（P3/P6 守卫）");
const chOrderOf = new Map(catalog.map((c, i) => [c.slug, c.order !== undefined ? c.order : i]));
const edges = [];          // { own, pre }
const malformed = [];
const dangling = [];
const dupPre = [];
const selfLoop = [];
for (const l of catLessons) {
  const own = catKey(l);
  const seen = new Set();
  for (const p of l.prereq || []) {
    if (typeof p !== "string" || p.split("/").length !== 2 || p.split("/").some((s) => !s)) { malformed.push(own + " → " + JSON.stringify(p)); continue; }
    if (seen.has(p)) dupPre.push(own + " 重复声明 " + p);
    seen.add(p);
    if (p === own) { selfLoop.push(own); continue; }
    if (!catByKey.has(p)) {
      const [pch, pslug] = p.split("/");
      const hint = !catalog.some((c) => c.slug === pch) ? "章不存在"
        : catLessons.some((x) => x.slug === pslug) ? "slug 存在但在别的章（改名/迁移后未同步？）"
        : "课程不存在";
      dangling.push(own + " → " + p + "（" + hint + "）");
      continue;
    }
    edges.push({ own, pre: p });
  }
}
const prereqOf = new Map(catLessons.map((l) => [catKey(l), edges.filter((e) => e.own === catKey(l)).map((e) => e.pre)]));
console.log("  节点 " + catLessons.length + " · 有效边 " + edges.length + " · 无 prereq 的课 " +
  catLessons.filter((l) => !(l.prereq || []).length).length + " 门");
for (const m of malformed) FAIL("prereq 格式非法（应为 \"chapter/slug\"）：" + m);
for (const m of selfLoop) FAIL("prereq 自环：" + m);
for (const m of dupPre) FAIL("prereq 重复声明：" + m);
if (!malformed.length && !selfLoop.length && !dupPre.length) PASS(edges.length + " 条 prereq 全部为合法 \"chapter/slug\"，无自环无重复");

// 9.1 悬空边
if (dangling.length) { for (const d of dangling) FAIL("悬空 prereq 边：" + d); }
else PASS("无悬空 prereq 边（" + edges.length + " 条全部命中 catalog 条目）");

// 9.2 环检测（DFS 三色，报出完整环路径）
const color = new Map();     // 0/undefined=白 1=灰 2=黑
const cycles = [];
(function () {
  const stack = [];
  const dfs = (u) => {
    color.set(u, 1); stack.push(u);
    for (const v of prereqOf.get(u) || []) {
      const c = color.get(v) || 0;
      if (c === 1) cycles.push(stack.slice(stack.indexOf(v)).concat(v));
      else if (c === 0) dfs(v);
    }
    stack.pop(); color.set(u, 2);
  };
  for (const l of catLessons) if (!(color.get(catKey(l)) || 0)) dfs(catKey(l));
})();
if (cycles.length) { for (const c of cycles) FAIL("依赖图有环（A → B 表示 A 的 prereq 是 B）：" + c.join(" → ")); }
else PASS("依赖图无环，拓扑序存在");

// 9.3 章序违反（P3）
const forward = [];
for (const e of edges) {
  const own = catByKey.get(e.own), pre = catByKey.get(e.pre);
  if (chOrderOf.get(pre.chapter) > chOrderOf.get(own.chapter)) forward.push({ ...e, ownOrder: chOrderOf.get(own.chapter), preOrder: chOrderOf.get(pre.chapter) });
}
const introForward = forward.filter((f) => catByKey.get(f.own).chapter === "introduction");
const otherForward = forward.filter((f) => catByKey.get(f.own).chapter !== "introduction");
const allowedKeys = new Set(FORWARD_ALLOWLIST.map((a) => a.own + " -> " + a.pre));
const unlisted = otherForward.filter((f) => !allowedKeys.has(f.own + " -> " + f.pre));
const liveKeys = new Set(otherForward.map((f) => f.own + " -> " + f.pre));
const stale = FORWARD_ALLOWLIST.filter((a) => !liveKeys.has(a.own + " -> " + a.pre));
if (introForward.length) {
  INFO("introduction 章前向边 " + introForward.length + " 条（§2.1 设计，整章豁免，逐条列出以便复核）：");
  for (const f of introForward) INFO("  " + f.own + " ←prereq← " + f.pre + "（章序 " + f.ownOrder + " → " + f.preOrder + "）");
}
if (unlisted.length) {
  for (const f of unlisted) FAIL("章序违反且未登记白名单：" + f.own + "（第 " + f.ownOrder + " 章）的 prereq " +
    f.pre + " 在第 " + f.preOrder + " 章 ← P3 类问题，请改章序、改边，或把理由写进 FORWARD_ALLOWLIST");
} else if (otherForward.length) {
  PASS("章序违反 " + forward.length + " 条全部有据：" + introForward.length + " 条属 introduction 设计豁免，" +
    otherForward.length + " 条已登记 FORWARD_ALLOWLIST");
  for (const f of otherForward) INFO("  " + f.own + " ←prereq← " + f.pre + "（第 " + f.ownOrder + " → " + f.preOrder + " 章）· " +
    FORWARD_ALLOWLIST.find((a) => a.own === f.own && a.pre === f.pre).why);
} else PASS("无章序违反");
if (stale.length) { for (const a of stale) FAIL("FORWARD_ALLOWLIST 有陈旧条目（catalog 中已不存在该前向边，请删除）：" + a.own + " -> " + a.pre); }

// 9.4 章内顺序倒置（P4 同族。A6 只覆盖 classic/modern/robust/mpc/nonlinear/intelligent/rl-control/multi-agent
//     八章，其余章的倒置要等对应的 C/D 条目 → WARN 不 FAIL）
const intraInverted = [];
for (const e of edges) {
  const own = catByKey.get(e.own), pre = catByKey.get(e.pre);
  if (own.chapter === pre.chapter && pre.index > own.index)
    intraInverted.push(own.chapter + "：第 " + (own.index + 1) + " 课 " + own.slug + " 的 prereq 是本第 " + (pre.index + 1) + " 课 " + pre.slug);
}
if (intraInverted.length) { for (const m of intraInverted) WARN("章内顺序倒置（A6 只覆盖 8 章；不在其内的章由对应 C/D 条目消解）：" + m); }
else PASS("无章内顺序倒置");

// 9.5 迁移期并存 slug：A6 交接的三课在 catalog 两侧都有条目（同 slug 不同章）。
//     只有指向「迁出侧」的边才该报——A6 删掉旧条目后它会立刻变成悬空边；指向「迁入侧」
//     是正确写法。（用 blunt 的「slug 是否重复」判断会把 6 条正确的 estimation 边一起误报。）
const MIGRATION_OUT = {
  "modern/kalman-filter": "estimation/kalman-filter",          // A6 第 3 章 modern 执行搬移
  "rl-control/safe-rl": "safety-ftc/safe-rl",                  // A6 第 8 章 rl-control
  "rl-control/multi-agent-rl": "multi-agent/multi-agent-rl",   // A6 第 8 章 rl-control
};
const staleMigrated = edges.filter((e) => MIGRATION_OUT[e.pre]);
if (staleMigrated.length) {
  for (const e of staleMigrated) WARN("prereq 指向 A6 迁出侧（旧条目删除后会变悬空边，应改指 " +
    MIGRATION_OUT[e.pre] + "）：" + e.own + " -> " + e.pre);
} else PASS("无 prereq 指向 A6 迁出侧旧条目（" + Object.keys(MIGRATION_OUT).length + " 个迁移期并存 slug 均未被误指）");
// 边指向骨架课不是缺陷（85 门骨架课本来就还没写），但 Part 2 的 UI 必须能降级显示，故只报数
const toSkeleton = edges.filter((e) => catByKey.get(e.pre).status === "empty");
INFO("指向骨架课(status=empty)的 prereq 边 " + toSkeleton.length + " / " + edges.length +
  " 条 -> 课程页前置卡片对这部分须用禁用样式显示名称（A8 Part 2 要求）");

// 9.6 孤儿课：既无 prereq、也不是任何课的 prereq、又不是章首课或案例课
//     案例课的 type 字段在 A2 之前写的课里普遍缺失，所以再按 slug 后缀兜底识别
const referencedAsPrereq = new Set(edges.map((e) => e.pre));
const isCase = (l) => l.type === "case" || /-case(-study)?$/.test(l.slug);
const orphans = catLessons.filter((l) =>
  !(l.prereq || []).length && !referencedAsPrereq.has(catKey(l)) && l.index !== 0 && !isCase(l));
if (orphans.length) {
  WARN("孤儿课 " + orphans.length + " 门（依赖图上完全孤立：无 prereq、无人依赖、非章首课、非案例课）");
  INFO(orphans.map((l) => catKey(l)).join(", "));
} else PASS("无孤儿课");

// 9.7 prereq 覆盖率：零边的章里 rank 与前置卡片都无信息量，必须显式暴露
const edgesByChapter = new Map(catalog.map((c) => [c.slug, 0]));
for (const e of edges) {
  const ch = catByKey.get(e.own).chapter;
  edgesByChapter.set(ch, edgesByChapter.get(ch) + 1);
}
const zeroEdgeChapters = catalog.filter((c) => edgesByChapter.get(c.slug) === 0);
const withPrereq = catLessons.filter((l) => (l.prereq || []).length).length;
console.log("  覆盖率：登记了 prereq 的课 " + withPrereq + " / " + catLessons.length +
  "（" + Math.round(withPrereq * 100 / catLessons.length) + "%）");
console.log("  各章边数：" + catalog.map((c) => c.slug + " " + edgesByChapter.get(c.slug)).join(" / "));
if (zeroEdgeChapters.length) {
  WARN("整章零 prereq 边 " + zeroEdgeChapters.length + " 章：" + zeroEdgeChapters.map((c) => c.slug).join(", ") +
    " -> 这些章的课程页前置卡片只能走降级提示、拓扑 rank 全为 0（A4 依赖图谱 284 行尚未落成 catalog prereq，见 Q20）");
} else PASS("每章都至少有 1 条 prereq 边");

// 9.8 拓扑层级（最长路径深度）：rank=0 表示无前置，可直接开读
const rankOf = new Map();
if (!cycles.length) {
  const rank = (k, guard) => {
    if (rankOf.has(k)) return rankOf.get(k);
    if (guard.has(k)) return 0;                       // 理论上不可达（已确认无环），保守兜底
    guard.add(k);
    const pres = prereqOf.get(k) || [];
    const r = pres.length ? 1 + Math.max(...pres.map((p) => rank(p, guard))) : 0;
    guard.delete(k);
    rankOf.set(k, r);
    return r;
  };
  for (const l of catLessons) rank(catKey(l), new Set());
  const maxRank = Math.max(...rankOf.values());
  console.log("  拓扑层级 0.." + maxRank + "（rank = 最长前置链长度；rank 0 = 无需前置即可开读）");
  for (const ch of catalog) {
    const rs = ch.lessons.map((l) => rankOf.get(ch.slug + "/" + l.slug));
    const zero = rs.filter((r) => r === 0).length;
    const noEdge = edgesByChapter.get(ch.slug) === 0;
    console.log("    第 " + String(chOrderOf.get(ch.slug)).padStart(2) + " 章 " + ch.slug.padEnd(18) +
      " rank " + String(Math.min(...rs)).padStart(2) + "–" + String(Math.max(...rs)).padEnd(2) +
      " · " + String(ch.lessons.length).padStart(2) + " 课 · 可直接开读 " + zero + " 门" +
      (noEdge ? "（本章零 prereq 边，rank 无信息量）" : zero === 0 ? "（本章无自足起点，须先修外章）" : ""));
  }
  if (SHOW_TOPO) {
    console.log("  --topo 每课拓扑层级：");
    for (const l of catLessons) {
      console.log("    rank " + String(rankOf.get(catKey(l))).padStart(2) + "  第" + String(chOrderOf.get(l.chapter)).padStart(2) + "章  " +
        catKey(l).padEnd(46) + " " + (l.status || "无status"));
    }
  } else INFO("加 --topo 可打印全部 " + catLessons.length + " 门的逐课拓扑层级");
} else INFO("存在环，跳过拓扑层级计算");

// ============================================================ 权威统计摘要
const realDone = catLessons.filter((l) => l.status === "v1.3").length;
console.log("\n================ 唯一权威统计（由本脚本从 catalog + 文件系统实测）================");
console.log("  章节数            : " + catalog.length);
console.log("  课程总数          : " + totalLessons);
console.log("  已 v1.3 交付      : " + realDone);
console.log("  有 MDX 正文       : " + mdxByKey.size + "（其中 draft " + (byStatus.draft || 0) + " / v1.3 " + (byStatus["v1.3"] || 0) + " / 无 status " + (byStatus["(无)"] || 0) + "）");
console.log("  骨架课 status=empty: " + (byStatus.empty || 0) + "（渲染占位页）");
console.log("  catalog 小节总数  : " + subCount);
console.log("  讨论日志          : " + logFiles.length + " 篇 / 覆盖 " + logKeys.size + " 门；有 MDX 但无日志 " + noLog.length + " 门");
console.log("  交互组件文件      : " + explorerFiles.length + " 个（被正文引用 " + usedExplorers + "，孤儿 " + unused.length + "）");
console.log("  prereq 边         : " + edges.length + " 条（环 " + cycles.length + " · 悬空 " + dangling.length +
  " · 前向 " + forward.length + " = 导论豁免 " + introForward.length + " + 白名单命中 " + (otherForward.length - unlisted.length) +
  " + 未登记 " + unlisted.length + " · 章内倒置 " + intraInverted.length + "）");
console.log("  prereq 覆盖率     : " + withPrereq + " / " + catLessons.length + " 门登记了前置；孤儿课 " + orphans.length +
  " 门；零 prereq 边的章 " + zeroEdgeChapters.length + " 个");
console.log("  拓扑层级          : 0.." + (rankOf.size ? Math.max(...rankOf.values()) : 0) + "（加 --topo 看逐课）");
console.log("=================================================================================");

// ============================================================ 写入模式
function genOutline() {
  const now = new Date();
  const today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  const statusLabel = (l) => {
    const has = mdxByKey.has(catKey(l));
    if (l.status === "v1.3") return "✅ 已交付 v1.3";
    if (l.status === "draft") return "🟨 有正文待审校";
    if (l.status === "empty") return "⬜ 骨架（占位页）";
    return has ? "🟨 有正文（无 status）" : "⬜ 待编写（无 status）";
  };
  const out = [];
  out.push("# 控制宇宙 - 课程大纲");
  out.push("");
  out.push("> **本文件由 `npm run check -- --fix-outline` 自动生成，请勿手工编辑。**");
  out.push("> 唯一权威数据源：`content/catalog.ts`；核对脚本：`scripts/check-catalog.mjs`。");
  out.push("> 生成日期：" + today);
  out.push("");
  catalog.forEach((ch, ci) => {
    out.push("## " + (ci + 1) + ". " + ch.title + " (" + ch.slug + ")");
    out.push("");
    out.push("| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |");
    out.push("|------|------|------|------|------|------|---------|---------|");
    ch.lessons.forEach((l, li) => {
      const c = catByKey.get(ch.slug + "/" + l.slug);
      const rk = rankOf.get(ch.slug + "/" + l.slug);
      out.push("| " + (ci + 1) + "." + (li + 1) + " | " + l.title + " | " + l.slug + " | " + statusLabel(c) +
        " | " + (l.level || "—") + " | " + (l.type || "—") + " | " + (rk === undefined ? "—" : rk) +
        " | " + ((l.prereq && l.prereq.length) ? l.prereq.join("<br>") : "—") + " |");
    });
    out.push("");
  });
  out.push("---");
  out.push("");
  out.push("## 统计");
  out.push("");
  out.push("- **总章节数**: " + catalog.length);
  out.push("- **总模块数**: " + totalLessons);
  out.push("- **已交付 v1.3**: " + realDone + "（status = v1.3）");
  out.push("- **有正文待审校**: " + (byStatus.draft || 0) + "（status = draft，已完成初稿但未做 v1.3 可视化重构）");
  out.push("- **骨架占位**: " + (byStatus.empty || 0) + "（status = empty，渲染占位页）");
  out.push("- **无 status 字段**: " + (byStatus["(无)"] || 0));
  out.push("- **未完成 v1.3**: " + (totalLessons - realDone) + "（= draft " + (byStatus.draft || 0) + " + empty " + (byStatus.empty || 0) + " + 无 status " + (byStatus["(无)"] || 0) + "）");
  out.push("- **有 MDX 正文**: " + mdxByKey.size);
  out.push("- **catalog 小节总数**: " + subCount);
  out.push("- **讨论日志**: " + logFiles.length + " 篇（覆盖 " + logKeys.size + " 门；有 MDX 无日志 " + noLog.length + " 门）");
  out.push("- **交互组件**: " + explorerFiles.length + " 个文件（被正文引用 " + usedExplorers + "，孤儿 " + unused.length + "）");
  out.push("- **prereq 边**: " + edges.length + " 条（环 " + cycles.length + " · 悬空 " + dangling.length +
    " · 前向 " + forward.length + " = 导论豁免 " + introForward.length + " + 白名单命中 " + (otherForward.length - unlisted.length) +
    " · 章内倒置 " + intraInverted.length + " · 孤儿课 " + orphans.length + "）");
  out.push("- **prereq 覆盖率**: " + withPrereq + " / " + totalLessons + " 门登记了前置；零 prereq 边的章 " +
    zeroEdgeChapters.length + " 个" + (zeroEdgeChapters.length ? "（" + zeroEdgeChapters.map((c) => c.slug).join("、") + "）" : ""));
  out.push("- **拓扑层级**: 0.." + (rankOf.size ? Math.max(...rankOf.values()) : 0) +
    "（表中「拓扑层级」= 最长前置链长度，0 表示无需前置即可开读；逐课层级也可用 `npm run check -- --topo` 打印）");
  out.push("");
  return out.join("\n") + "\n";
}

if (FIX_OUTLINE) {
  console.log("\n[--fix-outline] 重新生成 OUTLINE.md");
  const before = outlineRaw;
  const text = genOutline();
  writeFileSync(P_OUTLINE, text, "utf8");
  console.log("  WROTE " + P_OUTLINE + "（" + linesOf(text).length + " 行" + (before ? "，原 " + linesOf(before).length + " 行" : "") + "）");
}

if (FIX_TRACKER) {
  console.log("\n[--fix-tracker-stats] 更新 delivery-tracker.md 底部统计行");
  if (!trackerRaw) { FAIL("找不到 tracker，无法更新"); }
  else if (!trackerStats) { FAIL("未识别到统计行，拒绝写入（避免误改）"); }
  else {
    const EOL = eolOf(trackerRaw);
    const next = "**统计**：" + trackerChecked + " / " + totalLessons + " 课程已完成（" + catalog.length +
      " 章；" + explorerFiles.length + " 个交互组件文件，其中 " + usedExplorers + " 个被课程正文引用）";
    const lines = linesOf(trackerRaw);
    const idx = lines.findIndex((l) => l.startsWith("**统计**："));
    if (idx < 0) { FAIL("找不到以「**统计**：」开头的行，拒绝写入"); }
    else {
      const old = lines[idx];
      if (old === next) {
        console.log("  统计行已是最新，无需写入：");
        console.log("    " + next);
      } else {
        lines[idx] = next;
        // 守卫：只允许改这一行
        const before = linesOf(trackerRaw);
        let drift = 0;
        before.forEach((l, i) => { if (l !== lines[i]) drift++; });
        if (drift !== 1) { FAIL("统计行替换意外影响 " + drift + " 行，已放弃写入"); }
        else {
          writeFileSync(P_TRACKER, lines.join(EOL), "utf8");
          console.log("  WROTE 第 " + (idx + 1) + " 行（EOL=" + (EOL === "\r\n" ? "CRLF" : "LF") + "）");
          console.log("    旧: " + old);
          console.log("    新: " + next);
        }
      }
    }
  }
}

// ============================================================ 退出码
console.log("\n---------------- 结果 ----------------");
console.log("  PASS " + passes.length + " · WARN " + warns + " · FAIL " + fails);
if (fails > 0) { console.log("  退出码 1（存在 FAIL 级不一致）"); process.exit(1); }
console.log(warns > 0 ? "  退出码 0（仅 WARN，均为已登记的待裁决项）" : "  退出码 0（全绿）");
process.exit(0);
