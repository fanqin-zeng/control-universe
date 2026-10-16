#!/usr/bin/env node
/**
 * make-crlf.mjs —— 生成 E3 的 CRLF 回归测试数据 content/fx/nb-crlf.mdx
 *
 * 为什么需要一个生成器而不是直接提交 .mdx：
 * 这个测试的**全部内容**就是「文件用 CRLF 换行」。用编辑器另存、git 的
 * core.autocrlf、或者任何一次格式化都可能把它悄悄改回 LF，测试就静默失效了
 * （E2 新发现 ②：绿 ≠ 在测量）。写成生成器，换行符由代码保证，跑一次就复原。
 *
 * 用法：node .agent/e3-fixture/make-crlf.mjs   （幂等）
 *
 * 它复现的是 lib-mdx.mjs 里 scanMdx 的围栏判定 bug：
 * 原来用 /^\s*(`{3,}|~{3,})/ 判行首围栏。CRLF 文件里空行的行尾是 "\r\n"，
 * 扫描指针会停在那个 \r 上，\s* 跨过 \r\n 匹配到**下一行**的围栏，
 * 于是「空行 + 围栏行」被误判成一次开栏，真正的开栏反被当成闭栏，开闭配对整体错位。
 * 错位方向取决于文件里有几处「空行 + 围栏」：现网 modern/modern-case-study 表现为
 * 5 个 JupyterNotebook 全部隐身、classic/transfer-function 少扫 1 个；
 * 而本 fixture 表现为**反向**——围栏内的假示例被扫成真组件（报 S1/S4），
 * 围栏外那个真组件反倒隐身。修法是空白类只认 [ \t]。
 *
 * 变异测试已做过：把 lib-mdx.mjs 里的 [ \t] 改回 \s，本 fixture 立刻从
 * 「[PASS] 1 个 notebook」变成「[FAIL]，且认出的是围栏里那个假的」；
 * 同一变异对 LF 的 nb-good.mdx 毫无影响 —— 说明它抓的是 CRLF 专有的 bug。
 *
 * 触发条件是「**空行**紧跟围栏行」，所以 BODY 里那处空行与围栏的相对位置不能动。
 */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "content/fx/nb-crlf.mdx");

// 先按 LF 写，最后统一换成 CRLF，这样本文件自身的换行风格不影响生成结果
const BODY = `---
title: "E3 负向测试 · CRLF 围栏回归"
description: "复现 scanMdx 在 CRLF 文件里把空行+围栏误判成开栏的 bug"
category: "fx"
difficulty: "beginner"
status: "draft"
---

# E3 负向测试 · CRLF 围栏回归

本文件由 make-crlf.mjs 生成，**整篇 CRLF 换行**，不要手工编辑。

预期：只认出 **1 个** notebook（下面那个真的），围栏里的示例不算。
报 0 个就说明 scanMdx 的 CRLF 围栏 bug 复发了。

## 关键：下面这一行是空行，紧跟围栏

\`\`\`mdx
<JupyterNotebook
  setupCode={\`围栏内的假 setupCode\`}
  cells={[
    { code: \`%%NB9%% 围栏内的假占位符，不该被 S4 报\` }
  ]}
/>
\`\`\`

## 围栏之后还有真组件，必须被扫到

<JupyterNotebook
  setupCode={\`import numpy as np
msg = "安全的双写 \\\\n 与 \\\\lambda"\`}
  cells={[
    { code: \`print(msg, np.arange(3))\` }
  ]}
/>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, BODY.replace(/\r?\n/g, "\r\n"), "utf8");

const back = readFileSync(OUT, "utf8");
const nBare = (back.replace(/\r\n/g, "").match(/\n/g) || []).length;
console.log("已生成 " + OUT);
// 别把 back.length 叫「字节数」：那是 UTF-16 码元数（≈字符数），中文一个字算 1，
// 而 wc -c 数的是 UTF-8 字节，中文一个字算 3。本文件 632 字符 / 922 字节，
// 两个数差 45%，标错名字会让人以为文件被谁改过了（B5：叙述必须服从测量）。
console.log("  字符数 back.length          :", back.length);
console.log("  字节数（= wc -c）           :", Buffer.byteLength(back, "utf8"));
console.log("  CRLF 行数                   :", back.split("\r\n").length - 1);
console.log("  裸 LF 残留（必须是 0）       :", nBare);
console.log("  <JupyterNotebook 字面次数    :", (back.match(/<JupyterNotebook/g) || []).length, "（2：1 真 + 1 围栏内）");
if (nBare !== 0) { console.log("FAIL  生成结果里混进了裸 LF，测试前提不成立"); process.exit(1); }
