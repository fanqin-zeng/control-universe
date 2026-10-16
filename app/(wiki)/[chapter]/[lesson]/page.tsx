import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { getLesson } from "@/lib/content";
import { TableOfContents } from "@/components/wiki/table-of-contents";
import { NextUpCard, PrereqCard } from "@/components/wiki/lesson-nav";
import { findLesson, nextUp, prereqItems, suggestedStart } from "@/lib/lesson-graph";
import type { LessonNode } from "@/lib/lesson-graph";
import { catalog } from "@/content/catalog";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return catalog.flatMap((ch) =>
    ch.lessons.map((l) => ({ chapter: ch.slug, lesson: l.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { chapter: string; lesson: string };
}): Promise<Metadata> {
  const node = findLesson(params.chapter, params.lesson);
  if (node && !node.skeleton) {
    try {
      const { meta } = await getLesson(params.chapter, params.lesson);
      return { title: `${meta.title} | 控制宇宙` };
    } catch {
      return { title: "未找到 | 控制宇宙" };
    }
  }
  return { title: node ? `${node.title} | 控制宇宙` : "未找到 | 控制宇宙" };
}

type H1Props = { children?: ReactNode; id?: string; className?: string };

/**
 * 把卡片挂在 MDX 正文的第一个 h1 之后 —— 即课程标题下方。
 * 56 个 MDX 实测：首个 `# ` 行都在第 6 行以前（frontmatter 之后紧跟标题），
 * 所以"第一个 h1"恒等于课程标题；后续 h1（少数课程正文里有）原样渲染。
 */
function h1WithCard(card: ReactNode) {
  let injected = false;
  return function H1({ children, id, className }: H1Props) {
    if (injected) {
      return (
        <h1 id={id} className={className}>
          {children}
        </h1>
      );
    }
    injected = true;
    return (
      <>
        <h1 id={id} className={className}>
          {children}
        </h1>
        {card}
      </>
    );
  };
}

function LessonPlaceholder({ node }: { node: LessonNode }) {
  const up = nextUp(node);
  return (
    <div style={{ maxWidth: "42rem" }}>
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
          marginBottom: "0.5rem",
        }}
      >
        {node.chapterTitle}
      </p>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          lineHeight: 1.25,
          color: "var(--foreground)",
          marginBottom: "1.25rem",
        }}
      >
        {node.title}
      </h1>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          background: "var(--card)",
          padding: "1.5rem",
        }}
      >
        <p style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>
          本课尚未编写
        </p>
        <p style={{ color: "var(--muted-foreground)", lineHeight: 1.75, margin: 0 }}>
          这门课已登记在目录中，正文、交互仿真与讨论记录仍在编写计划内。
        </p>
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <PrereqCard
          items={prereqItems(node)}
          chapterTitle={node.chapterTitle}
          selfKey={node.key}
          start={suggestedStart(node.chapter)}
        />
      </div>
      <NextUpCard
        sameChapter={up.sameChapter}
        nextChapter={up.nextChapter}
        chapterTitle={node.chapterTitle}
      />
      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--foreground)", textDecoration: "underline" }}>
          返回课程目录
        </Link>
      </p>
    </div>
  );
}

export default async function LessonPage({
  params,
}: {
  params: { chapter: string; lesson: string };
}) {
  const node = findLesson(params.chapter, params.lesson);
  // 只有目录明确标记 status="empty" 的课走占位页；已登记为 draft 却读不到 MDX、
  // 或 MDX 编译失败的课仍然 404，避免真实故障被"尚未编写"掩盖。
  if (node?.skeleton) {
    return <LessonPlaceholder node={node} />;
  }

  const card = node ? (
    <PrereqCard
      items={prereqItems(node)}
      chapterTitle={node.chapterTitle}
      selfKey={node.key}
      start={suggestedStart(node.chapter)}
    />
  ) : null;

  let data;
  try {
    data = await getLesson(params.chapter, params.lesson, card ? { h1: h1WithCard(card) } : undefined);
  } catch {
    notFound();
  }

  const up = node ? nextUp(node) : null;

  return (
    <div className="flex gap-8">
      <div style={{ flex: "1 1 0%", minWidth: 0 }}>
        <article className="prose prose-slate dark:prose-invert max-w-none">{data.content}</article>
        {node && up && (
          <NextUpCard
            sameChapter={up.sameChapter}
            nextChapter={up.nextChapter}
            chapterTitle={node.chapterTitle}
          />
        )}
      </div>
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-8">
          <TableOfContents />
        </div>
      </aside>
    </div>
  );
}
