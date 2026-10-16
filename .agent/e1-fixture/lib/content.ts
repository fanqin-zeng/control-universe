import { compileMDX } from "next-mdx-remote/rsc";
import { wikiComponents } from "@/lib/wiki-components";

// E2 之后的干净消费方形态：不再内联注册，只展开单一来源。
// 注入 4 已移到 lib/wiki-components.ts —— 那里故意漏登记 BadExplorer / HalfExplorer，
// 而 bad-lesson.mdx 引用了它们 → 第 4 项应 FAIL「已实现且被引用，却没登记进单一来源」。
export async function getLesson(slug: string) {
  return compileMDX({
    source: "",
    components: {
      ...wikiComponents,
    },
  });
}
