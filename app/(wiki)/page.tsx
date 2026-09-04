import { catalog } from "@/content/catalog";
import Link from "next/link";

export default function WikiHome() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">控制宇宙 Wiki</h1>
      <p className="text-muted-foreground mb-8">
        一个交互式控制理论学习平台，支持富文本、公式、代码与实时仿真。
      </p>
      {catalog.map((ch) => (
        <section key={ch.slug} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{ch.title}</h2>
          {ch.lessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">内容筹备中</p>
          ) : (
            <ul className="space-y-2">
              {ch.lessons.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/${ch.slug}/${l.slug}`}
                    className="text-primary hover:underline"
                    title={l.title}
                  >
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
