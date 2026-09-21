import { compileMDX } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";
import path from "path";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";

import { Callout } from "@/components/wiki/callout";
import { StepResponseSlider } from "@/components/wiki/step-response-slider";
import { logger } from "@/lib/logger";

const contentDir = path.join(process.cwd(), "content");

export interface LessonMeta {
  title: string;
  description: string;
}

export async function getLesson(chapter: string, lesson: string) {
  const filePath = path.join(contentDir, chapter, `${lesson}.mdx`);
  logger.debug("加载课程", { chapter, lesson });

  let source: string;
  try {
    source = await readFile(filePath, "utf8");
  } catch (err) {
    logger.error("MDX 文件读取失败", {
      file: `${chapter}/${lesson}.mdx`,
      err: err instanceof Error ? err : new Error(String(err)),
    });
    throw err;
  }

  const result = await compileLessonSource(source, lesson);
  logger.info("课程加载完成", { chapter, lesson, title: result.meta.title });
  return result;
}

async function compileLessonSource(source: string, fallbackTitle: string) {
  try {
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
  } catch (err) {
    logger.error("MDX 编译失败", {
      lesson: fallbackTitle,
      err: err instanceof Error ? err : new Error(String(err)),
    });
    throw err;
  }
}
