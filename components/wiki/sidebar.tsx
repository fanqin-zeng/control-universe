"use client";

import { catalog } from "@/content/catalog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { lessonPath } from "@/lib/deployment";

export function Sidebar() {
  const pathname = lessonPath(usePathname());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    for (const ch of catalog) {
      for (const l of ch.lessons) {
        if (pathname === `/${ch.slug}/${l.slug}`) {
          setExpandedChapters(new Set([ch.slug]));
          setExpandedLessons(new Set([`${ch.slug}/${l.slug}`]));
          return;
        }
      }
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

  const toggleLesson = (key: string) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
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
        const isChapterExpanded = expandedChapters.has(ch.slug);
        return (
          <div key={ch.slug}>
            <button
              onClick={() => toggleChapter(ch.slug)}
              className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 hover:text-foreground transition-colors"
            >
              <span>{ch.title}</span>
              <svg
                className={`w-3 h-3 transition-transform ${isChapterExpanded ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {isChapterExpanded && (
              <ul className="space-y-0.5">
                {ch.lessons.map((l) => {
                  const lessonKey = `${ch.slug}/${l.slug}`;
                  const isLessonActive = pathname === `/${lessonKey}`;
                  const isLessonExpanded = expandedLessons.has(lessonKey);
                  const hasSubsections = l.subsections && l.subsections.length > 0;

                  return (
                    <li key={l.slug}>
                      <div className="flex items-center">
                        {hasSubsections && (
                          <button
                            onClick={() => toggleLesson(lessonKey)}
                            className="shrink-0 p-0.5 mr-0.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <svg
                              className={`w-3 h-3 transition-transform ${isLessonExpanded ? "rotate-90" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                        <Link
                          href={`/${lessonKey}`}
                          className={`block text-sm py-1.5 px-2 -mx-2 rounded-md transition-colors flex-1 ${
                            isLessonActive
                              ? "bg-accent text-foreground font-medium"
                              : "text-foreground/80 hover:text-foreground hover:bg-muted"
                          }`}
                          title={l.title}
                        >
                          {l.title}
                        </Link>
                      </div>
                      {hasSubsections && isLessonExpanded && (
                        <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2">
                          {l.subsections!.map((sub) => (
                            <li key={sub.slug}>
                              <Link
                                href={`/${lessonKey}#${sub.slug}`}
                                className="block text-xs py-1 px-2 -mx-2 rounded-md text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
                                title={sub.title}
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
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
