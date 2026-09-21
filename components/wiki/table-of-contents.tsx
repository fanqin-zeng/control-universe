"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll("article h2, article h3")
    );
    const mapped = elements.map((el) => ({
      id: el.id || (el.textContent ?? "").replace(/\s+/g, "-").toLowerCase(),
      text: el.textContent ?? "",
      level: Number(el.tagName[1]),
    }));
    elements.forEach((el) => {
      if (!el.id)
        el.id = (el.textContent ?? "").replace(/\s+/g, "-").toLowerCase();
    });
    setHeadings(mapped);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target.id);
        if (visible.length) setActiveId(visible[0]);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <p className="font-semibold mb-3 text-sm">目录</p>
      <ul className="space-y-1 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={cn(h.level === 3 && "pl-4")}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block py-1 px-2 -mx-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-muted transition-colors",
                activeId === h.id && "text-foreground font-medium bg-muted"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
