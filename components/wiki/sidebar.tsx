"use client";

import { catalog } from "@/content/catalog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentChapter = catalog.find((ch) =>
      ch.lessons.some((l) => pathname === `/${ch.slug}/${l.slug}`)
    );
    if (currentChapter) {
      setExpandedChapters(new Set([currentChapter.slug]));
    }
  }, [pathname]);

  const toggleChapter = (slug: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <nav className="space-y-5">
      <Link
        href="/"
        className="block text-lg font-bold tracking-tight hover:text-foreground/70 transition-colors"
      >
        控制宇宙
      </Link>
      {catalog.map((ch) => {
        const isExpanded = expandedChapters.has(ch.slug);
        return (
          <div key={ch.slug}>
            <button
              onClick={() => toggleChapter(ch.slug)}
              className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 hover:text-foreground transition-colors"
            >
              <span>{ch.title}</span>
              <svg
                className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {isExpanded && (
              <ul className="space-y-0.5">
                {ch.lessons.map((l) => {
                  const isActive = pathname === `/${ch.slug}/${l.slug}`;
                  return (
                    <li key={l.slug}>
                      <Link
                        href={`/${ch.slug}/${l.slug}`}
                        className={`block text-sm py-1.5 px-2 -mx-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-accent text-foreground font-medium"
                            : "text-foreground/80 hover:text-foreground hover:bg-muted"
                        }`}
                        title={l.title}
                      >
                        {l.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
