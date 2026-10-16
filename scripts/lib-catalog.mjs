/**
 * lib-catalog.mjs —— content/catalog.ts 的解析与 slug 规则（semester-02 E3 抽出）
 *
 * 为什么存在：parseCatalog / slugify / makeSlugger / SLUG_STRIP 在 check-catalog.mjs
 * 与 verify-lesson.mjs 里各存一份且**逐字相同**（E3 抽出前实测 chk/vfy=SAME）。
 * verify-lesson.mjs 原注释已经写了「两处不同步即为规范漂移，E3 接 CI 时应抽成
 * scripts/lib-catalog.mjs 单一来源」——这就是那一刀。E2 的教训（同一份注册表四份副本）
 * 说明这种副本一定会漂移，所以趁它们还相同时合并。
 *
 * 移动纪律：四个成员是从 verify-lesson.mjs **逐字搬来**的，搬完用
 * 「npm run check + npm run verify:all 的输出与搬动前逐字节相同」证明没改行为。
 *
 * 本模块无外部依赖（纯文本进、对象出），因此不 import 任何东西。
 */

/**
 * 把 catalog.ts 里的 `export const catalog = [...]` 数组解析成 JS 对象。
 * 用括号配平 + JSON.parse，不做动态求值：catalog.ts 是 TS 源码，直接 import 会拉起
 * 整条 Next.js/TS 工具链，而脚本只需要那一个数组字面量。
 *
 * 两个已知坑（原 check-catalog.mjs 注释，随函数一起搬来）：
 *   ① 必须先 indexOf("=", start) 再找 "["，否则 `Chapter[]` 类型标注里的方括号会被当数组起点；
 *   ② catalog.ts 自 A5 起含 // 注释，JSON.parse 前要整行剔除。
 * 另外还要给裸键名加引号、去掉尾随逗号。
 */
export function parseCatalog(src) {
  const start = src.indexOf("export const catalog");
  if (start < 0) throw new Error("catalog.ts 中找不到 export const catalog");
  const open = src.indexOf("[", src.indexOf("=", start));
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) throw new Error("catalog 数组未闭合");
  let body = src.slice(open, end + 1);
  body = body.split(/\r?\n/).filter((l) => !l.trim().startsWith("//")).join("\n");
  body = body.replace(/\b(slug|title|subsections|lessons|order|prereq|level|type|status)\s*:/g, '"$1":');
  body = body.replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(body);
}

/**
 * GitHub 风格 slug：小写、去掉非「字母/数字/记号/_/-/空白」、空白转 -（保留中文）。
 *
 * 不 import github-slugger：它在 package.json 里只是 rehype-slug 的传递依赖，
 * 直接引会让脚本随 npm 提升策略漂移。等价性已实测（A7 时点）：全仓 56 个 MDX 的
 * 615 条 H2 标题与 catalog 的 615 条 subsection 标题逐条比对，与真库输出 0 处不一致。
 */
export const SLUG_STRIP = /[^\p{L}\p{N}\p{M}_\-\s]/gu;

export function slugify(value) {
  if (typeof value !== "string") return "";
  return value.toLowerCase().replace(SLUG_STRIP, "").replace(/\s/g, "-");
}

/** 同名标题去重：第 2 次出现起加 -1、-2……（与 remark-gfm 的锚点生成规则一致） */
export function makeSlugger() {
  const seen = new Map();
  return (title) => {
    const base = slugify(title);
    const n = seen.get(base) || 0;
    seen.set(base, n + 1);
    return n === 0 ? base : base + "-" + n;
  };
}
