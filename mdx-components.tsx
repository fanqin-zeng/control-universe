import type { MDXComponents } from "mdx/types";
// 组件映射的唯一来源是 lib/wiki-components.ts（E2 · fix-015 根治）。
// 本文件是 @next/mdx 的约定入口，只对「被当模块编译的 .mdx」生效；仓库里目前没有这类文件，
// 所以它对课程页实际不起作用——课程页走 lib/content.ts 的 compileMDX({components})，
// 而 next-mdx-remote/rsc 会把 providerImportSource 置空（dist/rsc.js），useMDXComponents 永不被调用。
// 保留本文件是因为一旦有人新增 .mdx 页面，@next/mdx 就会启用它；那时两处仍共享同一来源。
// 校验：node scripts/verify-lesson.mjs 第 4 项 + 末尾「组件注册结构」附录 / npm run check 第 5 节。
import { wikiComponents } from "@/lib/wiki-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...wikiComponents,
    ...components,
  };
}
