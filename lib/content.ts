import { compileMDX } from "next-mdx-remote/rsc";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import { headingRemarkPlugins, headingRehypePlugins } from "./mdx-headings.mjs";

// 组件映射的唯一来源是 lib/wiki-components.ts（E2 · fix-015 根治）；mdx-components.tsx 也从它导入。
// 校验：node scripts/verify-lesson.mjs 第 4 项 + 末尾「组件注册结构」附录 / npm run check 第 5 节。
import { wikiComponents } from "@/lib/wiki-components";
import { logger } from "@/lib/logger";
import { rehypeBasePath } from "./mdx-base-path.mjs";
import {rehypePythonPolicy} from './mdx-python-policy.mjs';
import pythonSupport from './python-support.json';

const contentDir = path.join(process.cwd(), "content");

export interface LessonMeta {
  title: string;
  description: string;
}

/** compileMDX 的组件表类型，供页面注入 h1 覆盖（A8 的前置课程卡片靠它挂在标题下方）。 */
type MdxComponents = NonNullable<MDXRemoteProps["components"]>;

export async function getLesson(
  chapter: string,
  lesson: string,
  extraComponents?: MdxComponents
) {
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

  const result = await compileLessonSource(source, lesson, extraComponents, `${chapter}/${lesson}`);
  logger.info("课程加载完成", { chapter, lesson, title: result.meta.title });
  return result;
}

async function compileLessonSource(
  source: string,
  fallbackTitle: string,
  extraComponents?: MdxComponents,
  lessonKey?: string
) {
  try {
    const { content, frontmatter } = await compileMDX<LessonMeta>({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          remarkPlugins: headingRemarkPlugins as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rehypePlugins: [...headingRehypePlugins(lessonKey), [rehypePrettyCode, { theme: "github-light" }], [rehypeBasePath, {basePath: process.env.NEXT_PUBLIC_BASE_PATH || ""}], [rehypePythonPolicy, {lessonKey, policy: pythonSupport}]] as any,
        },
      },
      components: {
        ...wikiComponents,
        ...extraComponents,
      },
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
