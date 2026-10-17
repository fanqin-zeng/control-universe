# I01：MDX构建错误传播修复

日期：2026-10-17。起点：master `0dda3bf`；工作包 `wp/s3-i01-mdx-errors`。本任务是质量基建及MDX语法修复，不是课程重构交付，205课课程行均保持未完成。

## 复现与根因

原始 `npm run build` 退出0，但日志含 `MDX 编译失败`，`classic/stability-analysis` 实际返回404。错误为 `Could not parse expression with acorn: Unexpected content after expression`，原页330行的cell触发解析失败；其真正上游是两个setupCode模板字符串缺少闭合反引号。

检查发现 `lib/content.ts` 对读取与编译错误均记录后 `throw err`，没有吞错。吞错发生在 `app/(wiki)/[chapter]/[lesson]/page.tsx` 两处：generateMetadata的catch返回“未找到”标题，LessonPage的catch对所有异常调用notFound。Next将课程编译故障当作正常404预渲染，因而构建仍为绿色。旧Q26/计划中的lib/content.ts定位在本次被更正。

## 修改与边界

- 课程页面先依据catalog判定：目录外才notFound；empty明确显示占位；目录内已写课程的读取、编译错误直接上抛。
- generateMetadata也不捕获目录内真实故障，不能用“未找到”标题掩盖。
- stability-analysis仅补回两处setupCode闭合反引号；Python计算文本、公式、教学叙述、组件、H2、catalog与交付状态不变。
- 保留永久非法MDX样本和路由回归测试；共同技能改为准确根因与回归命令。历史fix索引冲突标记不在I01处理，仍归I02。

## 验收顺序与实测证据

| 命令/检查 | 退出码/结果 | 关键实际输出 |
|---|---|---|
| 修复前 curl classic/stability-analysis | HTTP404 | 真实编译故障被当404 |
| 原始 npm run build | 0 | 同时存在 `[ERROR] MDX 编译失败` |
| 仅修路由，保留原坏MDX后 npm run build | 1 | `Export encountered errors on following paths:`，`/(wiki)/[chapter]/[lesson]/page: /classic/stability-analysis` |
| node --test scripts/lesson-route.test.mjs | 0 | tests5 / pass5 / fail0 / skipped0 |
| 补两处闭合反引号后 npm run build | 0 | Generating static pages (146/146)；MDX编译/预渲染/导出错误匹配数0 |
| npm run verify -- classic/stability-analysis | 0 | PASS8 / WARN1 / FAIL0 / SKIPPED0；HTTP200，h1=1，h2=14/14，katex-error=0 |
| node scripts/nb-cells.mjs verify classic/stability-analysis | 0 | 内核8891在线；4 notebook/4 cell，S6实跑error0，课程PASS1/WARN0/FAIL0 |
| 生产HTTP回归 | 200/200/404 | /classic/stability-analysis=200；/math/linear-algebra-basics=200；/classic/i01-not-in-catalog=404 |
| npm run check | 0 | PASS17 / WARN36 / FAIL0，与起点一致 |
| node --test scripts/lesson-route.test.mjs scripts/check-semester03.test.mjs | 0 | tests15 / pass15 / fail0 / skipped0 |
| node scripts/check-semester03.mjs | 0 | PASS；治理任务完成6/16，课程合并0/205 |
| git diff --check | 0 | 无空白错误输出 |
| 恢复 npm run dev 后HTTP复核 | HTTP200 | 8080开发服务恢复；classic/stability-analysis可正常访问 |

完整构建输出临时保存至本机 logs/i01-before-build.log、i01-fail-build.log、i01-pass-build.log，用后清理；上述关键结果为版本化留存。路由测试加载实际TSX并用TypeScript转译，真实compileMDX对永久非法样本生成异常；验证页面与metadata都保持同一错误对象上抛，另测登记但缺文件、未知404、empty占位和正常课程。不依赖字符串匹配源代码来假装验证行为。

页面verify唯一WARN是该旧课缺历史讨论日志，属于基线35课日志债务；本次仅语法修复不冒充课程重构签发。源码diff严格只有两处反引号；不重算或变更课程数值结论。所有check中的36项WARN保持原状，明细分类仍归I03。I02索引冲突保持原样，仅追加027新记录。

I01完成依据为：旧行为已复现、真实生产构建负向退出1、修复后完整构建及页面/内核回归通过、永久失败样本与路由行为测试已留存。学期3课程合并数仍为0。
