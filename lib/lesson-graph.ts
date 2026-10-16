import { catalog } from "@/content/catalog";
import type { Chapter, LessonMeta } from "@/content/catalog";

/**
 * catalog 的派生视图：把 prereq 字段展开成课程页与首页要用的「前置 / 接下来学 / 学习路径」。
 * 纯函数、无 IO、模块级只算一次；口径与 scripts/check-catalog.mjs 第 9 节一致
 * （rank = 最长前置链长度，同 rank 内按 catalog 数组序，即章内拓扑序）。
 */

export type StatusTone = "done" | "draft" | "skeleton";

export interface StatusLabel {
  /** 交付记录用的三档口径：已交付 / 已写待重构 / 未编写 */
  text: string;
  tone: StatusTone;
}

export interface LessonNode {
  key: string;
  href: string;
  chapter: string;
  chapterTitle: string;
  chapterIndex: number;
  slug: string;
  title: string;
  /** 章内序号，1 起，用于「第 N 课」标注 */
  position: number;
  level?: string;
  type?: string;
  status: StatusLabel;
  /** true = status==="empty"，渲染占位页；与 page.tsx 的判定同源 */
  skeleton: boolean;
  prereq: string[];
  rank: number;
}

export function statusLabelOf(l: LessonMeta): StatusLabel {
  if (l.status === "v1.3") return { text: "已交付", tone: "done" };
  if (l.status === "draft") return { text: "已写待重构", tone: "draft" };
  return { text: "未编写", tone: "skeleton" };
}

const nodes: LessonNode[] = [];
const byKey = new Map<string, LessonNode>();

catalog.forEach((ch, ci) => {
  ch.lessons.forEach((l, li) => {
    const node: LessonNode = {
      key: `${ch.slug}/${l.slug}`,
      href: `/${ch.slug}/${l.slug}`,
      chapter: ch.slug,
      chapterTitle: ch.title,
      chapterIndex: ci,
      slug: l.slug,
      title: l.title,
      position: li + 1,
      level: l.level,
      type: l.type,
      status: statusLabelOf(l),
      skeleton: l.status === "empty",
      prereq: l.prereq ?? [],
      rank: 0,
    };
    nodes.push(node);
    byKey.set(node.key, node);
  });
});

const rankCache = new Map<string, number>();
function rankOf(key: string, guard: Set<string>): number {
  const hit = rankCache.get(key);
  if (hit !== undefined) return hit;
  if (guard.has(key)) return 0; // check-catalog 第 9.2 节已保证无环，这里只是不让脏数据卡死渲染
  guard.add(key);
  const pres = (byKey.get(key)?.prereq ?? []).filter((p) => byKey.has(p));
  const r = pres.length ? 1 + Math.max(...pres.map((p) => rankOf(p, guard))) : 0;
  guard.delete(key);
  rankCache.set(key, r);
  return r;
}
for (const n of nodes) n.rank = rankOf(n.key, new Set());

const chapterOrderCache = new Map<string, LessonNode[]>();

/** 章内拓扑序：按 rank 升序，rank 相同处保持 catalog 数组序（Array#sort 稳定）。 */
export function chapterTopoOrder(chapter: string): LessonNode[] {
  let list = chapterOrderCache.get(chapter);
  if (!list) {
    list = nodes.filter((n) => n.chapter === chapter).sort((a, b) => a.rank - b.rank);
    chapterOrderCache.set(chapter, list);
  }
  return list;
}

export function findLesson(chapter: string, slug: string): LessonNode | undefined {
  return byKey.get(`${chapter}/${slug}`);
}

export interface PrereqItem {
  key: string;
  href: string;
  title: string;
  /** 跨章前置显示来源章，同章前置为 null */
  fromChapterTitle: string | null;
  status: StatusLabel;
  /** prereq 指向 catalog 里不存在的课（check-catalog 第 9.1 节会 FAIL，正常应为 false） */
  missing: boolean;
}

export function prereqItems(node: LessonNode): PrereqItem[] {
  return node.prereq.map((key) => {
    const target = byKey.get(key);
    return {
      key,
      href: `/${key}`,
      title: target ? target.title : key,
      fromChapterTitle: target && target.chapter !== node.chapter ? target.chapterTitle : null,
      status: target ? target.status : { text: "目录中不存在", tone: "skeleton" },
      missing: !target,
    };
  });
}

/** 章的建议起点：第一门有正文的课；整章都是骨架时退回第 1 课。 */
export function suggestedStart(chapter: string): LessonNode | undefined {
  const list = nodes.filter((n) => n.chapter === chapter);
  return list.find((n) => !n.skeleton) ?? list[0];
}

export interface NextUp {
  /** 拓扑序中紧随其后的同章课程 */
  sameChapter: LessonNode[];
  /** 本课已是本章最后一门时，给下一章的建议起点 */
  nextChapter: { chapterTitle: string; lesson: LessonNode } | null;
}

export function nextUp(node: LessonNode, count = 3): NextUp {
  const order = chapterTopoOrder(node.chapter);
  const pos = order.findIndex((n) => n.key === node.key);
  const sameChapter = order.slice(pos + 1, pos + 1 + count);
  let nextChapter: NextUp["nextChapter"] = null;
  if (sameChapter.length === 0) {
    const ch = catalog[node.chapterIndex + 1];
    const start = ch ? suggestedStart(ch.slug) : undefined;
    if (ch && start) nextChapter = { chapterTitle: ch.title, lesson: start };
  }
  return { sameChapter, nextChapter };
}

export interface ChapterPath {
  slug: string;
  title: string;
  total: number;
  delivered: number;
  written: number;
  start: LessonNode | undefined;
  startIsSkeleton: boolean;
}

export function chapterPaths(): ChapterPath[] {
  return catalog.map((ch: Chapter) => {
    const list = nodes.filter((n) => n.chapter === ch.slug);
    const start = suggestedStart(ch.slug);
    return {
      slug: ch.slug,
      title: ch.title,
      total: list.length,
      delivered: list.filter((n) => n.status.tone === "done").length,
      written: list.filter((n) => !n.skeleton).length,
      start,
      startIsSkeleton: start ? start.skeleton : false,
    };
  });
}
