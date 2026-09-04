import { compileMDX } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";
import path from "path";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";

import { Callout } from "@/components/wiki/callout";
import { StepResponseSlider } from "@/components/wiki/step-response-slider";

const contentDir = path.join(process.cwd(), "content");

export interface LessonMeta {
  title: string;
  description: string;
}

export async function getLesson(chapter: string, lesson: string) {
  const filePath = path.join(contentDir, chapter, `${lesson}.mdx`);
  const source = await readFile(filePath, "utf8");
  return compileLessonSource(source, lesson);
}

async function compileLessonSource(source: string, fallbackTitle: string) {

  const { content, frontmatter } = await compileMDX<LessonMeta>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        remarkPlugins: [remarkGfm, remarkMath] as any,
        rehypePlugins: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rehypeKatex as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [rehypePrettyCode, { theme: "github-light" }] as any,
        ],
      },
    },
    components: { Callout, StepResponseSlider },
  });

  return {
    content,
    meta: {
      title: frontmatter.title ?? fallbackTitle,
      description: frontmatter.description ?? "",
    },
  };
}
