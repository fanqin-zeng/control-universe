# MATH-01 微积分入门验收

2026-10-17；工作分支wp/s3-math-calculus-basics，起点master 7d5583c。仅交付MATH-01，目标范围和生产顺序未变；MATH-02及其余课程不签发。

## 成果与范围

新写content/math/calculus-basics.mdx，11个H2、8道带完整答案的习题、5个独立setup的真实内核Notebook。CalculusExplorer分别承载差商/导数与右端矩形和/积分；默认h=.5、N=4复现正文4.5/4、5/4。实际TS导出与独立Python有理数/SymPy复算；边界h=0、±1、N=1…16与非法输入受检。讨论日志为docs/discuss-log/semester-03/02-math/01-calculus-basics.md，完整Phase 1–4、34组对账及九项门槛。

依赖为空，本课补全函数/斜率/极限/求和符号的局部定义；未借未交付课程略过推导。目录由catalog提供，OUTLINE与tracker统计由工具生成。12个新术语及数学章符号局部定义登记在现有机器表，不另建双源。

必要的范围扩展仅有app/(wiki)/layout.tsx的flex内容列minWidth:0，修复本课390像素下实际约910像素宽的溢出；全站构建复验。浅色排版颜色问题由本课MDX/组件局部foreground兜底，没有重写全站主题。未来逐课按同样门槛检查，R01全站验收不提前关闭。

## 实际验收

| 命令/方法 | 退出码 | 证据与结果 |
|---|---|---|
| npm run build | 0 | build.log；生产构建成功，无Failed to compile / MDX编译失败；有旧组件lint提示，不冒充全站无提示 |
| npm run check | 0 | check.log；PASS21/WARN2/FAIL0；21章205课、57正文/148空课、30个v1.3；46个Explorer文件且全部引用 |
| npm run verify -- math/calculus-basics | 0 | page-verify.log；本课A级，9类检查全绿；HTTP200，H1=1/H2=11，标题顺序/ID/侧栏目标匹配，无重复ID，katex-error=0 |
| node scripts/nb-cells.mjs verify math/calculus-basics --require-kernel --quiet --out .agent/semester-03/math-01/notebook-results.json | 0 | notebook-verify.log / notebook-results.json；5 notebook、5cell实际执行，0error，无SKIPPED；模块级唯一kernel id前提通过 |
| node scripts/verify-calculus-basics.mjs | 0 | reconciliation.log / reconciliation.json；直接调用实际TS导出，对比独立Fraction/SymPy；页面原始求值代码独立内核执行；源哈希、环境、完整输出留档 |
| node scripts/nb-cells.mjs extract math/calculus-basics --out .agent/semester-03/math-01/notebook-source.json | 0 | extract.log / notebook-source.json；5个notebook |
| node scripts/nb-cells.mjs assemble .agent/semester-03/math-01/notebook-source.json --out .agent/semester-03/math-01/notebook-roundtrip.jsx | 0 | assemble.log；10个代码块重新extract后逐字全等；临时jsx已删除 |
| npm run glossary:check | 0 | glossary-check.log；PASS3/WARN1/FAIL0；WARN为其它旧课的7处min/max函数排版，未由本课新增 |
| 浏览器生产页实测 | 通过 | browser-results.json / browser-integral.png；默认、边界、重置、390像素及正常视口；console error/warn为空；页面NB1按钮运行后实际输出与独立执行相同 |

全局check两项WARN在warnings.json重新审计：跨章motion-planning按完整路由消歧；35门无日志旧课的成员逐字不变，随着有日志正文新增，比例63%→61%。原I03/S04历史快照保持不变；S04历史比对命令的原文差异不是新问题关闭证据。旧课日志债务继续归各自目标课程，不用本课日志顶替。

前期check-draft/check-stats/generated-files日志保留了统计未同步或自动生成前的失败，最终判定以check.log为准。metadata替换一次误匹配接口声明，build报catalog.ts语法错误；已从HEAD原始catalog重建仅本课变更，用匹配断言约束，最终check与build重新通过。未提交损坏状态。最小实验漏乘速度系数和页面颜色/窄屏缺陷均在签发前拦截，详见讨论附录D，不隐去失败过程。

## 合入回执

课程提交97dfa94；已按--no-ff合入master，真实课程合并提交0e7e5db670c69677abdb8aff629cc8340125462b。合并之后才更新全局checklist合并列；随后以同一工作包分支提交回执并合回master。用户已有proofreading/proofreading-2026-10-16.txt修改未改动、未暂存。没有自动push。
