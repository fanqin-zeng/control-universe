/**
 * fixture 版的组件注册单一来源（对应真仓的 lib/wiki-components.ts）。
 * 注入 4：漏登记 BadExplorer 与 HalfExplorer，而 bad-lesson.mdx 引用了它们
 * → 第 4 项应 FAIL「已实现且被引用，却没登记进单一来源」（fix-015 的 E2 形态）。
 * good-lesson 只用 Callout / JupyterNotebook / GoodExplorer，三个都在 → 对照组第 4 项仍 PASS。
 */
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/wiki/callout";
import { JupyterNotebook } from "@/components/wiki/jupyter-notebook";
import { GoodExplorer } from "@/components/wiki/good-explorer";

export const wikiComponents: MDXComponents = {
  Callout,
  JupyterNotebook,
  GoodExplorer,
};
