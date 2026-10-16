import type { MDXComponents } from "mdx/types";
// 注入 4b：E2 之后消费方应该只从单一来源导入。这里保留了 HalfExplorer 的内联 import，
// 用来验证「残留内联 import components/wiki/*」这条结构检查真的会响（A7：只对着干净仓库跑等于没测）。
import { wikiComponents } from "@/lib/wiki-components";
import { HalfExplorer } from "@/components/wiki/half-explorer";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...wikiComponents,
    HalfExplorer,
    ...components,
  };
}
