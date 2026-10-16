import { catalog } from "@/content/catalog";
import Link from "next/link";
import { ChapterPathLine } from "@/components/wiki/lesson-nav";
import { chapterPaths } from "@/lib/lesson-graph";

export default function WikiHome() {
  const pathOf = new Map(chapterPaths().map((p) => [p.slug, p]));
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontSize: '2.25rem', fontWeight: 800 }}>控制宇宙</h1>
      <p className="text-muted-foreground mb-10">
        交互式控制理论学习平台，支持富文本、公式、代码与实时仿真。
      </p>
      <div className="space-y-8">
        {catalog.map((ch) => (
          <section key={ch.slug}>
            <h2 className="text-xl font-bold tracking-tight mb-3" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {ch.title}
            </h2>
            {pathOf.get(ch.slug) && <ChapterPathLine path={pathOf.get(ch.slug)!} />}
            {ch.lessons.length === 0 ? (
              <p className="text-sm text-muted-foreground/60">内容筹备中</p>
            ) : (
              <div className="grid gap-2">
                {ch.lessons.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/${ch.slug}/${l.slug}`}
                    className="group block rounded-lg border p-4 hover:border-foreground/20 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-base font-medium text-foreground group-hover:text-foreground transition-colors">
                      {l.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
