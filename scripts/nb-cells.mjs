#!/usr/bin/env node
/**
 * nb-cells.mjs —— JupyterNotebook cell 的抽取 / 校验 / 拼接（semester-02 E3，fix-017 根治）
 *
 * 三个能力：
 *   extract  <目标>… [--out f.json]     把 MDX 里每个 JupyterNotebook 的 setupCode 与 cells 抽成 JSON
 *   verify   <目标>…|--all|--delivered  静态检查（S1–S7）+ 可选地把每个 cell 真跑一遍内核
 *   assemble <json> [--out f] [--skeleton]  从 JSON 生成 JSX 片段，并对结果做反向校验
 *
 * 为什么需要它（三条历史事故的共同根因）：
 *   fix-017 拼接脚本用 %%NBn%% 作占位符，经一层 % 格式化被折叠成 %NBn%，9 个 cell 的首行
 *           从 `# 注释` 变成 `%# 注释`，IPython 当成 line magic 报 UsageError。页面 200、H2 数、
 *           katex、命令行 harness 全查不出来——只有真跑才暴露。
 *   fix-013 `setupCode={`…`},` 属性间多一个逗号 → MDX 编译失败 → getLesson throw → 页面 404。
 *   fix-011 同页多个 notebook 共用 kernel id → 变量互相覆盖，报错出现在「受害者」notebook 里。
 *
 * 本工具的核心口径：**比对与执行都用「求值后」的字符串**。
 * cell 代码写在反引号里，浏览器先按 JS 模板字面量求值，再把结果 POST 给内核。所以
 * MDX 字面 ≠ 内核收到的代码：`\n` 会变真换行、`\lambda` 会掉反斜杠、`\\n` 才是字面的 \n。
 * E3 实测：529 个代码块里 80 个（15.1%）存在这种差异，其中 robust/h-infinity-basics.mdx:444
 * 的 `print("\n结论…")` 会因此变成跨行字符串字面量 → SyntaxError。只看 MDX 原文永远发现不了。
 *
 * 只用 Node 内置能力，不引入新依赖。
 */
import { existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { request as httpRequest } from "node:http";
import {
  walk, read, readIfExists, extractNotebooks, NOTEBOOK_ATTRS,
  RE_WIDGETS, RE_MAGIC_FIRST, RE_PLACEHOLDER,
} from "./lib-mdx.mjs";
import { parseCatalog } from "./lib-catalog.mjs";

// ---------------------------------------------------------------- 参数与路径
const argv = process.argv.slice(2);
const CMD = argv.find((a) => !a.startsWith("-")) || "";
const posArgs = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (i === 0 && !a.startsWith("-")) continue;          // 命令名
  if (a === "--root" || a === "--out" || a === "--port") { i++; continue; }
  if (a.startsWith("--")) continue;
  posArgs.push(a);
}
const flag = (name) => argv.includes(name);
const optVal = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };

const ALL = flag("--all");
const DELIVERED = flag("--delivered");
const NO_KERNEL = flag("--no-kernel");
const REQUIRE_KERNEL = flag("--require-kernel");
const QUIET = flag("--quiet");
const SKELETON = flag("--skeleton");
const rootArg = optVal("--root");
const ROOT = (rootArg || join(dirname(fileURLToPath(import.meta.url)), ".."))
  .replace(/\\/g, "/").replace(/\/+$/, "");

const P_CATALOG = join(ROOT, "content/catalog.ts");
const P_CONTENT = join(ROOT, "content");
const P_COMPONENT = join(ROOT, "components/wiki/jupyter-notebook.tsx");
const P_SERVER = join(ROOT, "scripts/jupyter_server.py");
const KERNEL_HOST = "127.0.0.1";
const KERNEL_PORT = Number(optVal("--port") || process.env.JUPYTER_PORT || 8891);
const KERNEL_TIMEOUT = Number(process.env.NB_KERNEL_TIMEOUT || 120000);
const OUT = optVal("--out");

const rel = (p) => p.slice(ROOT.length + 1).replace(/\\/g, "/");
const say = (...a) => console.log(...a);
const info = (...a) => { if (!QUIET) console.log(...a); };

// ---------------------------------------------------------------- 课程定位（与 verify-lesson.mjs 同口径）
let catalog = [];
if (existsSync(P_CATALOG)) {
  try { catalog = parseCatalog(read(P_CATALOG)); }
  catch (e) { say("FAIL  catalog.ts 解析失败：" + e.message); process.exit(1); }
}
const catLessons = [];
catalog.forEach((ch) => ch.lessons.forEach((l) => catLessons.push({ chapter: ch.slug, ...l })));
const mdxByKey = new Map();
for (const f of walk(P_CONTENT, (p) => p.endsWith(".mdx"))) {
  const parts = f.slice(P_CONTENT.length + 1).replace(/\\/g, "/").split("/");
  if (parts.length === 2) mdxByKey.set(parts[0] + "/" + parts[1].replace(/\.mdx$/, ""), f);
}

/** 把命令行目标解析成 { key, file }；支持 <chapter>/<lesson> 与直接给 .mdx 路径 */
function resolveTargets() {
  if (ALL) return [...mdxByKey.keys()].sort().map((k) => ({ key: k, file: mdxByKey.get(k) }));
  if (DELIVERED) {
    return catLessons.filter((l) => l.status === "v1.3")
      .map((l) => l.chapter + "/" + l.slug)
      .filter((k) => mdxByKey.has(k)).sort()
      .map((k) => ({ key: k, file: mdxByKey.get(k) }));
  }
  const out = [];
  for (const a of posArgs) {
    if (mdxByKey.has(a)) { out.push({ key: a, file: mdxByKey.get(a) }); continue; }
    const p = join(ROOT, a);
    if (existsSync(p) && p.endsWith(".mdx")) { out.push({ key: rel(p), file: p }); continue; }
    if (existsSync(a) && a.endsWith(".mdx")) { out.push({ key: rel(a), file: a }); continue; }
    say("FAIL  找不到课程或 MDX 文件：" + a);
    process.exit(1);
  }
  return out;
}

// ---------------------------------------------------------------- 模板字面量转义（assemble 用）
/**
 * 把 Python 源码转成可以安全放进反引号里的形式。
 * 只需三处：反斜杠、反引号、${。其余字符（含真换行、中文、LaTeX 的 $…$）原样保留，
 * 这样生成的 MDX 是**可读的多行代码**，而不是 \n 连成一行的转义串。
 */
function escapeTemplate(code) {
  return code.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

// ---------------------------------------------------------------- 内核 HTTP 客户端
function httpJson(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : Buffer.from(JSON.stringify(body), "utf8");
    const req = httpRequest({
      host: KERNEL_HOST, port: KERNEL_PORT, path, method,
      headers: data ? { "Content-Type": "application/json", "Content-Length": data.length } : {},
    }, (res) => {
      let buf = "";
      res.setEncoding("utf8");
      res.on("data", (c) => { buf += c; });
      res.on("end", () => {
        let json = null;
        try { json = JSON.parse(buf); } catch { /* 非 JSON 响应，保留原文 */ }
        resolve({ status: res.statusCode, json, text: buf });
      });
    });
    req.setTimeout(KERNEL_TIMEOUT, () => req.destroy(new Error("内核请求超时 " + KERNEL_TIMEOUT + "ms")));
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function kernelAlive() {
  try {
    const r = await httpJson("GET", "/health");
    return r.status === 200 && r.json && r.json.status === "ok";
  } catch { return false; }
}

// 模块级计数器：同一次运行里创建多个内核也不会撞 id（fix-011 的教训）
let kernelSeq = 0;
function newKernelId() { return `nbc-${Date.now()}-${kernelSeq++}`; }

/**
 * 已知良性 stderr。这些课的 setupCode 没设 rcParams['axes.unicode_minus']=False，
 * matplotlib 出图时每遇到一个负刻度就打一行「does not have a glyph for U+2212」。
 * 不折叠的话全仓 347 个 cell 会刷出几百条一模一样的 WARN，把真信号淹掉——
 * WARN 一旦被当噪音无视，这条判据就等于没有（E2 新发现 ②：绿 ≠ 在测量）。
 * 折叠只在终端报告里发生，--out 的 JSON 保留完整 stderr 原文。
 */
const BENIGN_STDERR = [
  { re: /Font '[^']*' does not have a glyph for/, name: "matplotlib 字体缺字形（负号 U+2212，不影响出图）" },
];

/** 把 stderr 拆成「良性行按类计数」与「剩余文本」 */
function splitStderr(text) {
  const benign = new Map();
  const rest = [];
  for (const line of (text || "").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const hit = BENIGN_STDERR.find((b) => b.re.test(line));
    if (hit) benign.set(hit.name, (benign.get(hit.name) || 0) + 1);
    else rest.push(line);
  }
  return { benign, rest: rest.join("\n").trim() };
}

/** 把一个 notebook 的 cell 依次真跑一遍，返回每个 cell 的结果 */
async function runNotebook(nb) {
  const setup = nb.setupCode ?? "";
  let id = newKernelId();
  const results = [];
  const create = async (newId) => {
    // 先显式创建空命名空间，再执行MDX求值后的原始setup；不引入DEFAULT_SETUP。
    // 兼容曾丢弃setup输出的旧网关；验收仍显式检查每次setup与重放结果。
    const r = await httpJson("POST", "/api/notebook", { notebook_id: newId, setup_code: "" });
    if (r.status !== 200) throw new Error("创建内核失败 HTTP " + r.status + " " + (r.json?.error || r.text).slice(0, 120));
    if (setup.trim()) {
      const executed = await httpJson("POST", `/api/notebook/${newId}/execute`, { code: setup });
      const error = executed.json?.outputs?.find((o) => o.type === "error");
      if (executed.status !== 200 || error) {
        throw new Error("setup 执行失败：" + (error ? `${error.ename}: ${error.evalue}` : "HTTP " + executed.status));
      }
    }
    return r;
  };
  try {
    await create(id);
    for (let i = 0; i < nb.cells.length; i++) {
      const code = nb.cells[i].code;
      if (!code.trim()) { results.push({ index: i, status: "EMPTY" }); continue; }
      let r = await httpJson("POST", `/api/notebook/${id}/execute`, { code });
      if (r.status === 404) {
        // 内核被空闲回收了：重建并从第 1 个 cell 重放（新命名空间没有前面 cell 定义的变量）
        id = newKernelId();
        await create(id);
        for (let k = 0; k < i; k++) {
          if (nb.cells[k].code.trim()) {
            const replay = await httpJson("POST", `/api/notebook/${id}/execute`, { code: nb.cells[k].code });
            const error = replay.json?.outputs?.find((o) => o.type === "error");
            if (replay.status !== 200 || error) throw new Error(`重放 cell ${k + 1} 失败：${error?.evalue || "HTTP " + replay.status}`);
          }
        }
        r = await httpJson("POST", `/api/notebook/${id}/execute`, { code });
      }
      if (r.status !== 200) { results.push({ index: i, status: "HTTP" + r.status, error: (r.json?.error || r.text || "").slice(0, 300) }); continue; }
      const outs = r.json?.outputs || [];
      const err = outs.find((o) => o.type === "error");
      const stderr = outs.filter((o) => o.type === "stream" && o.name === "stderr").map((o) => o.text).join("");
      const images = outs.filter((o) => o.type === "image").length;
      if (err) {
        results.push({
          index: i, status: "ERROR", ename: err.ename, evalue: err.evalue,
          traceback: (err.traceback || []).slice(0, 4), stderr, images,
        });
      } else {
        results.push({ index: i, status: "OK", images, stderr, nOut: outs.length });
      }
    }
  } finally {
    await httpJson("DELETE", `/api/notebook/${id}`).catch(() => {});
  }
  return results;
}

// ---------------------------------------------------------------- fix-011 结构前提（全仓事实）
/**
 * E3 推荐 Prompt 的静态检查 ④ 原文是「同一 MDX 内多个 JupyterNotebook 的 id 前缀必须互不相同」。
 * 实测这条**没有对象**：组件 props 只有 cells/setupCode/title，MDX 里根本不写 id；
 * kernel id 由组件的模块级计数器生成。照字面实现就是一条永远 PASS 的空门槛
 * （E2 新发现 ②「绿 ≠ 在测量」）。所以换成对 fix-011 真实前提的三条结构检查。
 */
function checkKernelIdInvariant() {
  const out = [];
  const comp = readIfExists(P_COMPONENT);
  const srv = readIfExists(P_SERVER);
  if (comp === null) { out.push({ level: "FAIL", msg: "找不到 " + rel(P_COMPONENT) }); return { out, scheme: null }; }
  const moduleSeq = /(^|\n)\s*let\s+nbSeq\s*=\s*0\s*;/.test(comp);
  const idFn = /function\s+newNotebookId\s*\(/.test(comp);
  const perInstance = /useRef\(\s*0\s*\)[^\n]*;?\s*\/\/?.*计数|nbCounter\s*=\s*useRef/.test(comp);
  if (!moduleSeq) out.push({ level: "FAIL", msg: "jupyter-notebook.tsx 里找不到模块级 `let nbSeq = 0`——同页多个 notebook 会撞 kernel id（fix-011 复发）" });
  if (!idFn) out.push({ level: "FAIL", msg: "jupyter-notebook.tsx 里找不到 newNotebookId()——id 生成方式已改动，需重新确认 fix-011 前提" });
  if (perInstance) out.push({ level: "FAIL", msg: "jupyter-notebook.tsx 里又出现了 useRef 计数器（fix-011 的原始病因）" });
  if (srv === null) out.push({ level: "WARN", msg: "找不到 " + rel(P_SERVER) + "，无法核对服务端重复 id 兜底" });
  else if (!/already registered/.test(srv)) out.push({ level: "WARN", msg: "jupyter_server.py 里找不到重复 notebook_id 的 WARNING/关停兜底（fix-011 的服务端防线）" });
  // 取整个函数体（到行首的 "}" 为止）：不能用 [^}]*，函数里的模板字面量含 ${…}
  const m = /function\s+newNotebookId\s*\(\s*\)\s*\{[\s\S]*?\n\}/.exec(comp);
  return { out, scheme: m ? m[0].replace(/\s+/g, " ").trim() : null };
}

// ---------------------------------------------------------------- 静态检查
const LEVELS = { PASS: 0, WARN: 1, FAIL: 2 };

/**
 * 对一个 MDX 文件做 S1–S7 静态检查。
 * 返回 { findings: [{ level, code, msg, line }], notebooks: […] }
 * 判据全部作用于**求值后**的 value（内核真正收到的代码），只有 S3/S7 作用于 JSX 结构本身。
 */
function staticCheck(file) {
  const src = read(file);
  const notebooks = extractNotebooks(src);
  const findings = [];
  const add = (level, code, msg, line) => findings.push({ level, code, msg, line });

  if (!notebooks.length) return { findings, notebooks, src };

  for (const nb of notebooks) {
    const where = "Notebook " + (nb.index + 1) + "（:" + nb.line + "）";

    // S3（fix-013）JSX 属性之间不得有逗号——多一个逗号整篇 MDX 编译失败、页面 404
    for (const c of nb.badCommas) add("FAIL", "S3", `${where} 第 ${c.line} 行 JSX 属性之间有逗号 → MDX 编译失败、页面变 404（fix-013）`, c.line);

    // S7 组件 props 之外的属性（React 静默忽略；实测全仓 37 处 language="python"）
    for (const u of nb.unknownAttrs) add("WARN", "S7", `${where} 传了组件没有的属性 ${u.name}=${JSON.stringify(u.value)} → 被静默忽略`, u.line);

    for (const e of nb.parseErrors) add("FAIL", "S0", `${where} 解析失败：${e.attr} ${e.msg}`, e.line);

    const blocks = [];
    if (!nb.setup) add("FAIL", "S0", `${where} 没有 setupCode → 内核不会自动 import numpy/matplotlib（服务端只在键缺失时才用 DEFAULT_SETUP）`, nb.line);
    // 空串和「没写」后果完全一样，但看起来像作者有意为之，所以单独判一条。
    // 服务端是 setup = body.get("setup_code", DEFAULT_SETUP)：默认值只在**键缺失**时生效，
    // 键存在但为空串照样原样发过去 → numpy/matplotlib/rcParams 一行都不跑，第一个 cell 就 NameError。
    // 组件（components/wiki/jupyter-notebook.tsx）也是无条件带上这个键的，所以这不是理论风险。
    // 实测（.agent/e3-setup.mjs，跑完即删）：content/ 182 个 notebook 里空串 0 个、纯空白 0 个、
    // 无 import 行的 0 个 —— 加这条对现网输出零回归，属于预防性收口。
    // unterminated 的情况交给下面 blocks 循环里的「模板字面量没有闭合反引号」，别在这里抢报。
    else if (!nb.setup.unterminated && !nb.setup.value.trim())
      add("FAIL", "S0", `${where} setupCode 是空串 → 服务端 body.get 只在键缺失时才用 DEFAULT_SETUP，空串等于显式要求「什么都别 setup」，numpy/matplotlib 不会被 import`, nb.setup.line);
    else blocks.push({ role: "setupCode", ...nb.setup });
    // 已经因为「code 的值不是字符串字面量」报过 S0 时，不要再叠一条「没有 cells」——
    // cells 属性明明在，只是解析不出元素，叠报会把真正的原因盖掉。
    if (!nb.cells.length && !nb.parseErrors.some((e) => e.attr === "cells"))
      add("FAIL", "S0", `${where} 没有 cells`, nb.line);
    nb.cells.forEach((c) => blocks.push({ role: "cell " + (c.index + 1), ...c }));

    for (const b of blocks) {
      const at = `${where} ${b.role}（:${b.line}）`;
      if (b.unterminated) add("FAIL", "S0", `${at} 模板字面量没有闭合反引号`, b.line);

      // S1（fix-017）求值后首行不得是 IPython line magic
      const first = (b.value ?? "").split(/\r?\n/)[0] ?? "";
      if (RE_MAGIC_FIRST.test(first))
        add("FAIL", "S1", `${at} 首行是「${first.slice(0, 40)}」→ IPython 当 line magic，运行报 UsageError（fix-017）`, b.line);

      // S2 ipywidgets 家族：轻量内核不支持 widget
      const hits = [...(b.value ?? "").matchAll(RE_WIDGETS)].map((m) => m[0]);
      if (hits.length)
        add("FAIL", "S2", `${at} 出现 ipywidgets 家族 ${hits.length} 处（${[...new Set(hits)].join(", ")}）→ 轻量内核不支持 widget，应改 React 交互组件`, b.line);

      // S4 拼接占位符残留（<<NBn>> 是 assemble 的中间形式，绝不能留在提交的 MDX 里）
      if (RE_PLACEHOLDER.test(b.raw) || RE_PLACEHOLDER.test(b.value ?? ""))
        add("FAIL", "S4", `${at} 残留拼接占位符 → assemble 没跑完或占位符写错（fix-017）`, b.line);

      // S5 模板字面量保真度：MDX 字面与内核收到的代码不一致
      for (const is of b.issues) {
        const ctx = JSON.stringify(b.raw.slice(Math.max(0, is.at - 20), is.at + 20));
        if (is.kind === "transformed") {
          // \n / \uXXXX 这类：求值后是控制字符或真字符。多数是「整段代码写成一行 + \n 分隔」
          // 或 JSON 转义粘贴进来的中文，能跑但不可读、且极易被下一次拼接二次破坏。
          // 真出问题的形态（\n 落在 Python 字符串字面量内部 → SyntaxError）由 S6 实跑定论。
          continue;
        }
        const why = {
          "dropped-backslash": "反斜杠被静默丢掉（LaTeX 的 \\lambda 到 Python 就成了 lambda）",
          "line-continuation": "反斜杠紧跟换行 → 那个换行被删掉，两行 Python 粘成一行",
          "interpolation": "${…} 会被当成 JS 表达式求值",
          "bad-escape": "非法转义序列",
          "unterminated": "以孤立反斜杠结尾",
        }[is.kind] || is.kind;
        add("FAIL", "S5", `${at} ${is.seq} → ${why}；上下文 ${ctx}`, b.line);
      }
      const nTrans = b.issues.filter((i) => i.kind === "transformed").length;
      if (nTrans) {
        const seqs = {};
        for (const i of b.issues.filter((x) => x.kind === "transformed")) {
          const k = /^\\u[0-9a-fA-F]{4}$/.test(i.seq) ? "\\uXXXX" : i.seq;
          seqs[k] = (seqs[k] || 0) + 1;
        }
        add("WARN", "S5", `${at} 有 ${nTrans} 处转义会被 JS 求值（${Object.entries(seqs).map(([k, v]) => k + "×" + v).join(", ")}）→ MDX 字面 ≠ 内核收到的代码；建议改成可读的多行写法或用 assemble 重新生成`, b.line);
      }
      // 双写形式（\\n）raw≠value 但 0 issue，是**正确**写法，不报
    }
  }
  return { findings, notebooks, src };
}

// ---------------------------------------------------------------- extract
/** 把 unescapeTemplate 的 issues 落到 JSON：at 是模板内的字符偏移，换算成 cell 内第几行才有人能改 */
function detailIssues(issues, raw) {
  return issues.map((it) => ({
    seq: it.seq, kind: it.kind, got: it.got,
    lineInCell: raw.slice(0, it.at).split("\n").length,
  }));
}

function extractOne(file) {
  const src = read(file);
  const notebooks = extractNotebooks(src);
  return {
    source: rel(file),
    component: rel(P_COMPONENT),
    // 从组件源码里现读，而不是写死一句注释——注释会过时，源码不会
    kernelIdScheme: checkKernelIdInvariant().scheme,
    kernelApi: `http://${KERNEL_HOST}:${KERNEL_PORT}`,
    count: notebooks.length,
    notebooks: notebooks.map((nb) => ({
      index: nb.index,
      line: nb.line,
      title: nb.title,
      unknownAttrs: nb.unknownAttrs.map((u) => u.name),
      setupCode: nb.setup ? nb.setup.value : null,
      setupRawDiffers: nb.setup ? nb.setup.raw !== nb.setup.value : false,
      setupEscapeIssues: nb.setup ? detailIssues(nb.setup.issues, nb.setup.raw) : [],
      cells: nb.cells.map((c) => ({
        index: c.index, line: c.line, delim: c.delim,
        code: c.value, rawDiffers: c.raw !== c.value,
        escapeIssues: detailIssues(c.issues, c.raw),
      })),
    })),
  };
}

function cmdExtract() {
  const targets = resolveTargets();
  if (!targets.length) { say("FAIL  没有指定目标"); process.exit(2); }
  const payload = targets.length === 1 ? extractOne(targets[0].file)
    : { sources: targets.map((t) => extractOne(t.file)) };
  const json = JSON.stringify(payload, null, 2);
  if (OUT) { writeFileSync(OUT, json, "utf8"); say("已写出 " + OUT + "（" + json.length + " 字节）"); }
  else say(json);
}

// ---------------------------------------------------------------- verify
function worst(findings) {
  let w = "PASS";
  for (const f of findings) if (LEVELS[f.level] > LEVELS[w]) w = f.level;
  return w;
}

async function cmdVerify() {
  if (REQUIRE_KERNEL && NO_KERNEL) { say("FAIL --require-kernel 与 --no-kernel 不能同时使用"); process.exit(2); }
  const targets = resolveTargets();
  if (!targets.length) {
    say("\n用法：node scripts/nb-cells.mjs verify <chapter>/<lesson>|--all|--delivered [--require-kernel|--no-kernel] [--out f.json] [--quiet]");
    process.exit(2);
  }
  const live = NO_KERNEL ? false : await kernelAlive();
  say("nb-cells.mjs verify · 根目录：" + ROOT);
  say("目标 " + targets.length + " 门 · 内核 " + (NO_KERNEL ? "跳过（--no-kernel）" : live ? `${KERNEL_HOST}:${KERNEL_PORT} 在线` : `${KERNEL_HOST}:${KERNEL_PORT} 不可达`));
  say("口径：静态检查 S1–S7 判的是**求值后**的 cell 代码（浏览器按 JS 模板字面量求值后才 POST 给内核），不是 MDX 字面。");
  if (!NO_KERNEL && !live) {
    say("S6 内核实跑 SKIPPED —— 启动方法：npm run dev（会同时拉起 next dev 与 scripts/jupyter_server.py）");
    say("                     或单独：python scripts/jupyter_server.py");
  }
  if (REQUIRE_KERNEL && !live) say("FAIL 严格模式要求S6实际执行，内核不可达不得交付");

  const perLesson = [];
  const totals = { PASS: 0, WARN: 0, FAIL: 0, SKIPPED: 0 };
  const codeCount = {};
  let nNotebooks = 0, nCells = 0, nRun = 0, nErr = 0;
  const failLessons = [];

  for (const t of targets) {
    const { findings, notebooks } = staticCheck(t.file);
    if (REQUIRE_KERNEL && !live) findings.push({ level: "FAIL", code: "S6", msg: "严格模式：内核不可达，S6不得SKIPPED", line: null });
    nNotebooks += notebooks.length;
    nCells += notebooks.reduce((s, nb) => s + nb.cells.length, 0);

    // S6 内核实跑
    const cellResults = [];
    const lessonBenign = new Map();
    if (live) {
      for (const nb of notebooks) {
        const flat = { setupCode: nb.setup ? nb.setup.value : "", cells: nb.cells.map((c) => ({ code: c.value })) };
        let res;
        try { res = await runNotebook(flat); }
        catch (e) {
          findings.push({ level: "FAIL", code: "S6", msg: `Notebook ${nb.index + 1}（:${nb.line}）内核执行中断：${e.message}`, line: nb.line });
          continue;
        }
        nRun += res.length;
        for (const r of res) {
          const at = nb.cells[r.index]?.line ?? nb.line;
          const sp = splitStderr(r.stderr);
          for (const [name, n] of sp.benign) lessonBenign.set(name, (lessonBenign.get(name) || 0) + n);
          if (r.status === "ERROR") {
            nErr++;
            findings.push({
              level: "FAIL", code: "S6",
              msg: `Notebook ${nb.index + 1} cell ${r.index + 1}（:${at}）执行报错 ${r.ename}: ${r.evalue}` +
                (r.traceback?.length ? "\n          " + r.traceback.join("\n          ") : ""),
              line: at,
            });
          }
          // 不用 else if：报错的 cell 一样可能带**另一处**独立缺陷的 stderr。
          // 实测 robust/h-infinity-basics 那个 NameError cell 的 stderr 里还有
          // 「SyntaxWarning: invalid escape sequence '\o'」——写成 else if 就把它吞了，
          // 于是「FAIL 已经报了」变成「另一类问题永远看不见」。良性行已被 sp.rest 滤掉，不会刷屏。
          if (sp.rest) {
            findings.push({ level: "WARN", code: "S6", msg: `Notebook ${nb.index + 1} cell ${r.index + 1}（:${at}）有 stderr：${sp.rest.slice(0, 160)}`, line: at });
          }
          cellResults.push({ notebook: nb.index, ...r });
        }
      }
    }
    for (const [name, n] of lessonBenign) {
      findings.push({ level: "WARN", code: "S6", msg: `良性 stderr ${n} 行：${name}（完整原文见 --out 导出的 JSON）`, line: null });
    }

    const level = worst(findings);
    totals[level]++;
    if (level === "FAIL") failLessons.push(t.key);
    for (const f of findings) codeCount[f.code] = (codeCount[f.code] || 0) + 1;
    perLesson.push({ key: t.key, file: rel(t.file), level, notebooks: notebooks.length, cells: cellResults.length ? cellResults : undefined, findings });

    if (!QUIET) {
      say("\n" + "─".repeat(78));
      say(`${t.key}  [${level}]  ${notebooks.length} 个 notebook · ${notebooks.reduce((s, nb) => s + nb.cells.length, 0)} 个 cell`);
      if (!notebooks.length) say("      本课没有 JupyterNotebook，无需检查");
      const shown = findings.filter((f) => f.level !== "PASS");
      if (!shown.length) say("      S1–S7 全绿" + (live ? "，S6 实跑无 error" : ""));
      for (const f of shown.slice(0, 40)) say(`      ${f.level.padEnd(4)} ${f.code}  ${f.msg}`);
      if (shown.length > 40) say(`      …另有 ${shown.length - 40} 条（用 --out 导出 JSON 看全部）`);
    }
  }

  // 全仓事实：fix-011 的结构前提（只在批量模式下报一次，不按课重复）
  const inv = checkKernelIdInvariant();
  for (const f of inv.out) {
    totals[f.level] = (totals[f.level] || 0) + 1;
    codeCount["S8"] = (codeCount["S8"] || 0) + 1;
    perLesson.push({ key: "(全仓)", level: f.level, findings: [{ ...f, code: "S8" }] });
  }

  say("\n" + "═".repeat(78));
  say(`汇总：${targets.length} 门 · ${nNotebooks} 个 notebook · ${nCells} 个 cell`);
  say(`      课程级 PASS ${totals.PASS} · WARN ${totals.WARN || 0} · FAIL ${totals.FAIL || 0}`);
  say(`      内核实跑 ${nRun} 个 cell，其中 error ${nErr} 个` + (live ? "" : "（S6 SKIPPED）"));
  if (Object.keys(codeCount).length) say(`      按判据：` + Object.entries(codeCount).sort().map(([k, v]) => `${k}×${v}`).join("  "));
  if (failLessons.length) say(`      FAIL 课程：` + failLessons.join(", "));
  if (inv.out.length) { say(`\n附 · fix-011 结构前提（全仓事实）：`); for (const f of inv.out) say(`      ${f.level.padEnd(4)} S8  ${f.msg}`); }
  else say(`\n附 · fix-011 结构前提：模块级 nbSeq 计数器 ✓ newNotebookId() ✓ 无 useRef 计数器 ✓ 服务端重复 id 兜底 ✓`);
  say(`    kernel id 生成方式（现读组件源码）：${inv.scheme || "(未找到)"}`);

  if (OUT) {
    writeFileSync(OUT, JSON.stringify({ root: ROOT, kernel: live ? `${KERNEL_HOST}:${KERNEL_PORT}` : null, kernelRequired: REQUIRE_KERNEL, executionStatus: live ? "EXECUTED" : "SKIPPED", totals, codeCount, failLessons, lessons: perLesson }, null, 2), "utf8");
    say("\n已写出 " + OUT);
  }
  process.exit(totals.FAIL || (REQUIRE_KERNEL && !live) ? 1 : 0);
}

// ---------------------------------------------------------------- assemble
/**
 * 从 extract 的 JSON 生成 JSX 片段。
 * 两段式：先出带 <<NBn>> 占位符的骨架，再把代码填回去。
 * 占位符不含 %（fix-017 的根治点：%%NB1%% 经一层 % 格式化会折叠成 %NB1%）；
 * 填充用 split/join 而不是 String.replace —— replace 的字符串替换会把代码里的
 * `$&`/`$'` 当成特殊模式，而 Python 代码里出现 $ 很常见（matplotlib 的 mathtext、LaTeX）。
 *
 * assemble 能治与不能治的边界（别指望它是 fix-017 的自动修复器）：
 *   能治 —— 反向是安全的：源里写成 `\\n`（正确写法）→ 求值成两字符 `\n` → escapeTemplate 再生成 `\\n`，
 *           逐字回到安全形态；顺带把 `\uXXXX`、`\xNN` 之类也统一成显式转义。
 *   不能治 —— 源里写成 `\n`（fix-017 那类）时，求值后已经是一个**真换行**，
 *           「作者本想要 Python 的 \n 还是真换行」这个信息在求值那一刻就丢了，assemble 无从恢复。
 *           它只是把隐藏的反斜杠换成源码里看得见的断行——bug 依旧，但不再隐身（实测
 *           robust/h-infinity-basics:444 生成后 print(" 后面直接断行，肉眼可见）。
 *           真要修得改 MDX 原文，判据是 S5。
 */
function assemble(payload) {
  const notebooks = payload.notebooks || payload.sources?.flatMap((s) => s.notebooks) || (Array.isArray(payload) ? payload : null);
  if (!notebooks) throw new Error("JSON 里找不到 notebooks 数组（请用 extract 的输出）");

  const blocks = [];          // { ph, code }
  const parts = [];
  notebooks.forEach((nb, i) => {
    const lines = [];
    lines.push("<JupyterNotebook");
    if (nb.title != null) lines.push(`  title=${JSON.stringify(nb.title)}`);
    const setupPh = `<<NB${blocks.length + 1}>>`;
    blocks.push({ ph: setupPh, code: nb.setupCode ?? "" });
    lines.push(`  setupCode={\`${setupPh}\`}`);
    lines.push("  cells={[");
    (nb.cells || []).forEach((c) => {
      const ph = `<<NB${blocks.length + 1}>>`;
      blocks.push({ ph, code: c.code });
      lines.push(`    { code: \`${ph}\` },`);
    });
    // 去掉最后一个 cell 的尾随逗号（数组元素间的逗号合法，末元素的尾逗号在 JSX 里也合法；
    // 这里仍然去掉，跟仓库主流写法对齐——实测 content/ 下 347 个 cell 元素里
    // 273 个（79%）写成同一行的 `{ code: `…` },`，69 个写成 `{` 独占一行 + `code:` 缩进，
    // 收尾统一是「反引号 + 一个空格 + }」。slice(0,-1) 只删逗号，别再补空格，否则会变成两个空格。）
    if (lines[lines.length - 1].endsWith("},")) lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
    lines.push("  ]}");
    lines.push("/>");
    parts.push(lines.join("\n"));
  });
  const skeleton = parts.join("\n\n") + "\n";

  for (const b of blocks) {
    if (b.ph.includes("%")) throw new Error("占位符里出现了 % —— 违反 fix-017 的根治约定");
    if (!skeleton.includes(b.ph)) throw new Error("骨架里找不到占位符 " + b.ph);
  }

  let filled = skeleton;
  for (const b of blocks) filled = filled.split(b.ph).join(escapeTemplate(b.code));
  return { skeleton, filled, blocks };
}

/** 反向校验：把生成结果重新 extract 一遍，与源 JSON 逐字比对（fix-017 的硬门槛） */
function reverseCheck(filled, notebooks) {
  const back = extractNotebooks(filled);
  const errs = [];
  if (back.length !== notebooks.length) errs.push(`notebook 数不符：生成 ${back.length} 个，源 ${notebooks.length} 个`);
  const flatSrc = notebooks.map((nb) => [nb.setupCode ?? "", ...(nb.cells || []).map((c) => c.code)]).flat();
  const flatBack = back.map((nb) => [nb.setup ? nb.setup.value : "", ...nb.cells.map((c) => c.value)]).flat();
  if (flatSrc.length !== flatBack.length) errs.push(`代码块数不符：生成 ${flatBack.length} 个，源 ${flatSrc.length} 个`);
  for (let i = 0; i < Math.min(flatSrc.length, flatBack.length); i++) {
    if (flatSrc[i] !== flatBack[i]) {
      let d = 0;
      while (d < flatSrc[i].length && flatSrc[i][d] === flatBack[i][d]) d++;
      errs.push(`第 ${i + 1} 个代码块不全等（首个差异在第 ${d} 字符）：源 ${JSON.stringify(flatSrc[i].slice(d, d + 30))} vs 生成 ${JSON.stringify(flatBack[i].slice(d, d + 30))}`);
    }
  }
  back.forEach((nb, i) => {
    const t = notebooks[i]?.title ?? null;
    if ((nb.title ?? null) !== t) errs.push(`第 ${i + 1} 个 notebook 的 title 不符：${JSON.stringify(nb.title)} vs ${JSON.stringify(t)}`);
    if (nb.badCommas.length) errs.push(`第 ${i + 1} 个 notebook 生成了属性间逗号（fix-013）：行 ${nb.badCommas.map((c) => c.line).join(",")}`);
    for (const u of nb.unknownAttrs) errs.push(`第 ${i + 1} 个 notebook 生成了未知属性 ${u.name}`);
    if (RE_PLACEHOLDER.test(nb.setup ? nb.setup.raw : "") || nb.cells.some((c) => RE_PLACEHOLDER.test(c.raw)))
      errs.push(`第 ${i + 1} 个 notebook 里残留了占位符`);
  });
  return errs;
}

function cmdAssemble() {
  const inFile = posArgs[0];
  if (!inFile) { say("用法：node scripts/nb-cells.mjs assemble <extract.json> [--out f.mdx] [--skeleton]"); process.exit(2); }
  const p = existsSync(inFile) ? inFile : join(ROOT, inFile);
  if (!existsSync(p)) { say("FAIL  找不到 JSON：" + inFile); process.exit(1); }
  let payload;
  try { payload = JSON.parse(read(p)); }
  catch (e) { say("FAIL  JSON 解析失败：" + e.message); process.exit(1); }

  const notebooks = payload.notebooks || payload.sources?.flatMap((s) => s.notebooks) || [];
  let out;
  try { out = assemble(payload); }
  catch (e) { say("FAIL  assemble：" + e.message); process.exit(1); }

  const errs = reverseCheck(out.filled, notebooks);
  say(`assemble · ${notebooks.length} 个 notebook · ${out.blocks.length} 个代码块 · 占位符 <<NB1>>…<<NB${out.blocks.length}>>（不含 %）`);
  if (errs.length) {
    say("FAIL  反向校验不通过（重新 extract 后与源 JSON 不全等）：");
    for (const e of errs) say("      " + e);
    process.exit(1);
  }
  say("PASS  反向校验：骨架 → 填充 → 重新 extract → 与源 JSON 逐字全等");
  const text = SKELETON ? out.skeleton : out.filled;
  if (OUT) { writeFileSync(OUT, text, "utf8"); say("已写出 " + OUT + "（" + text.length + " 字节" + (SKELETON ? "，骨架形式" : "") + "）"); }
  else say("\n" + text);
}

// ---------------------------------------------------------------- 入口
if (!existsSync(P_CONTENT)) { say("FAIL  找不到 " + P_CONTENT); process.exit(1); }
if (CMD === "extract") cmdExtract();
else if (CMD === "verify") await cmdVerify();
else if (CMD === "assemble") cmdAssemble();
else {
  say(`nb-cells.mjs —— JupyterNotebook cell 抽取 / 校验 / 拼接（E3）

用法：
  node scripts/nb-cells.mjs extract  <chapter>/<lesson>|<path.mdx>|--all [--out f.json]
  node scripts/nb-cells.mjs verify   <chapter>/<lesson>|--all|--delivered [--require-kernel|--no-kernel] [--out f.json] [--quiet]
  node scripts/nb-cells.mjs assemble <extract.json> [--out f.mdx] [--skeleton]
  公共开关：--root <dir> 换根目录（fixture 用）· --port <n> 换内核端口 · --quiet 只打 WARN/FAIL
  交付必须用 --require-kernel：S6不可达时退出1；--no-kernel只做静态检查，不是数值验收。

静态检查判据：
  S0 结构（缺 setupCode / setupCode 是空串 / 缺 cells / 模板未闭合 / 解析失败）
  S1 求值后首行不得是 IPython line magic（fix-017）
  S2 不得出现 ipywidgets 家族（轻量内核不支持 widget）
  S3 JSX 属性之间不得有逗号（fix-013，会让页面 404）
  S4 不得残留拼接占位符 %%NBn%% / %NBn% / <<NBn>>
  S5 模板字面量保真度：掉反斜杠 / 行连接 / \${ 插值 → FAIL；\\n \\uXXXX 等求值差异 → WARN
  S6 把每个 cell 真跑一遍内核，error 输出 → FAIL（需 scripts/jupyter_server.py 在 8891）
  S7 组件 props 之外的属性（如 language="python"）→ WARN
  S8 fix-011 结构前提：模块级 nbSeq 计数器 + newNotebookId() + 服务端重复 id 兜底（全仓，批量模式报一次）

负向测试（A7 教训：只对着干净的当前仓库跑等于没测）——fixture 是仓库产物，逐条命令与预期
退出码见 .agent/e3-fixture/README.md，一条总命令：
  node scripts/nb-cells.mjs verify --all --root .agent/e3-fixture --no-kernel
  → fx/nb-bad FAIL（S0×4 S1×1 S2×2 S3×1 S4×1 S5×5 S7×1）+ S8×4（故意改坏的组件与服务端副本），
    fx/nb-good、fx/nb-crlf、fx/nb-kernel 三个对照组 PASS，退出码 1。

退出码：任何 FAIL → 1；否则 0。仅用 Node 内置能力。`);
  process.exit(CMD ? 1 : 2);
}
