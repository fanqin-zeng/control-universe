import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ChapterPath, LessonNode, PrereqItem, StatusLabel, StatusTone } from "@/lib/lesson-graph";

/**
 * 学习路径卡片（A8）。全部 inline style：Windows 环境下 Tailwind 工具类可能不生效，
 * 这是项目已记录的环境陷阱，semester-02 A8 也把它写成硬要求。
 *
 * 卡片内一律不用 h1/h2/h3——TableOfContents 扫的是 `article h2, article h3`，
 * 而前置卡片就渲染在 article 里，用标题标签会污染右侧目录。
 */

const CARD: CSSProperties = {
  margin: "0 0 1.75rem",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  background: "var(--card)",
  padding: "0.875rem 1rem",
};

const EYEBROW: CSSProperties = {
  margin: "0 0 0.625rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "var(--muted-foreground)",
};

const NOTE: CSSProperties = {
  margin: 0,
  fontSize: "0.875rem",
  lineHeight: 1.7,
  color: "var(--muted-foreground)",
};

const CHIP_ROW: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  margin: 0,
  padding: 0,
};

const CHIP: CSSProperties = {
  display: "inline-flex",
  alignItems: "baseline",
  gap: "0.375rem",
  borderRadius: "0.375rem",
  padding: "0.3rem 0.6rem",
  fontSize: "0.8125rem",
  fontWeight: 500,
  lineHeight: 1.5,
  textDecoration: "none",
};

// 「未编写」用虚线边框 + 灰字表达禁用感，但仍然是可点的链接：85 门骨架课都有占位页，
// 点进去能看到它自己的前置链，读者可以一路往上追溯；做成不可点的死文本反而断了这条路。
const TONE: Record<StatusTone, CSSProperties> = {
  done: { border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)" },
  draft: { border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" },
  skeleton: { border: "1px dashed var(--border)", background: "transparent", color: "var(--muted-foreground)" },
};

const TAG: CSSProperties = {
  fontSize: "0.6875rem",
  fontWeight: 400,
  color: "var(--muted-foreground)",
  whiteSpace: "nowrap",
};

function StatusTag({ label }: { label: StatusLabel }) {
  return label.tone === "skeleton" ? <span style={TAG}>尚未编写</span> : null;
}

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} style={{ color: "var(--foreground)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
      {children}
    </Link>
  );
}

export function PrereqCard({
  items,
}: {
  items: PrereqItem[];
  chapterTitle: string;
  selfKey: string;
  start?: LessonNode;
}) {
  if (items.length === 0) return null;
  return (
    <div style={CARD} data-lesson-nav="prereq">
      <p style={EYEBROW}>前置课程</p>
      <div style={CHIP_ROW} data-prereq="list">
        {items.map(item => item.missing ? (
          <span key={item.key} style={{...CHIP,...TONE.skeleton}}>{item.title}</span>
        ) : (
          <Link key={item.key} href={item.href} style={{...CHIP,...TONE[item.status.tone]}}>
            {item.fromChapterTitle ? `${item.fromChapterTitle} · ` : ""}{item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

const ROW: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "0.5rem",
  padding: "0.3rem 0",
  margin: 0,
  fontSize: "0.9375rem",
  lineHeight: 1.6,
};

const POSITION: CSSProperties = {
  flex: "0 0 auto",
  fontSize: "0.75rem",
  color: "var(--muted-foreground)",
  fontVariantNumeric: "tabular-nums",
};

export function NextUpCard({
  sameChapter,
  nextChapter,
  chapterTitle,
}: {
  sameChapter: LessonNode[];
  nextChapter: { chapterTitle: string; lesson: LessonNode } | null;
  chapterTitle: string;
}) {
  if (sameChapter.length === 0 && !nextChapter) return null;
  return (
    <div
      style={{ marginTop: "2.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}
      data-lesson-nav="next"
    >
      <p style={EYEBROW}>接下来学</p>
      {sameChapter.length === 0 ? (
        <p style={NOTE}>「{chapterTitle}」到此结束。</p>
      ) : (
        <div>
          {sameChapter.map((n) => (
            <p key={n.key} style={ROW}>
              <span style={POSITION}>第 {n.position} 课</span>
              <InlineLink href={n.href}>{n.title}</InlineLink>
              <StatusTag label={n.status} />
            </p>
          ))}
        </div>
      )}
      {nextChapter && (
        <p style={{ ...ROW, marginTop: sameChapter.length === 0 ? "0.5rem" : "0.75rem" }}>
          <span style={POSITION}>下一章</span>
          <span style={{ color: "var(--muted-foreground)" }}>{nextChapter.chapterTitle} · </span>
          <InlineLink href={nextChapter.lesson.href}>{nextChapter.lesson.title}</InlineLink>
          <StatusTag label={nextChapter.lesson.status} />
        </p>
      )}
    </div>
  );
}

export function ChapterPathLine({ path }: { path: ChapterPath }) {
  return (
    <p
      style={{ margin: "-0.25rem 0 0.75rem", fontSize: "0.8125rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}
      data-chapter-path={path.slug}
    >
      共 {path.total} 课 · 建议起点：
      {path.start ? (
        <>
          <InlineLink href={path.start.href}>{path.start.title}</InlineLink>
          {path.startIsSkeleton ? "（尚未编写，点进去是占位页）" : ""}
        </>
      ) : (
        <>内容筹备中</>
      )}
    </p>
  );
}
