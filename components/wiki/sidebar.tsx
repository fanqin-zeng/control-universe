import { catalog } from "@/content/catalog";
import Link from "next/link";

export function Sidebar() {
  return (
    <nav className="space-y-6">
      <Link href="/" className="block font-bold text-lg">
        控制宇宙
      </Link>
      {catalog.map((ch) => (
        <div key={ch.slug}>
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
            {ch.title}
          </h3>
          <ul className="space-y-1">
            {ch.lessons.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/${ch.slug}/${l.slug}`}
                  className="block text-sm hover:text-primary"
                  title={l.title}
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
