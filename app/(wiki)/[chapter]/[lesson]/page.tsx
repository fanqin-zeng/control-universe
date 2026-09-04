import { notFound } from "next/navigation";
import { getLesson } from "@/lib/content";
import { TableOfContents } from "@/components/wiki/table-of-contents";
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
  try {
    const { meta } = await getLesson(params.chapter, params.lesson);
    return { title: `${meta.title} | 控制宇宙` };
  } catch {
    return { title: "未找到 | 控制宇宙" };
  }
}

export default async function LessonPage({
  params,
}: {
  params: { chapter: string; lesson: string };
}) {
  let data;
  try {
    data = await getLesson(params.chapter, params.lesson);
  } catch {
    notFound();
  }

  return (
    <div className="flex gap-8">
      <article className="prose prose-slate dark:prose-invert max-w-none flex-1">
        {data.content}
      </article>
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-8">
          <TableOfContents />
        </div>
      </aside>
    </div>
  );
}
