# MATH-08 拉普拉斯变换验收

2026-10-18。本对话只交付本课，按wiki-lesson-new与学期3共同规则执行Phase1–4，完整讨论在docs/discuss-log/semester-03/02-math/08-laplace-transform.md。正文319行、15个H2、7Notebook/7cell、6题步骤答案、1个权重与有限积分Explorer。

## 教学与范围

从前课e^-t染料浓度深化到曲线积分，明确不是染料总量；用有限面积/尾项/无限积分建立直觉，再讲复数s、ROC、导数初值项、分式逆变换、延迟、卷积、零初值传递函数与初终值条件。单边普通函数统一0+，不混入冲激/0-约定。保留sin/e^t终值失败例；指数移位不冒充时间延迟。不生产MATH-09；W06/W07旧开篇批阅仍待处理，未改其它课程正文。

## 实测命令与证据

以下命令均退出0，原始输出位于本目录：

| 命令 | 结果 | 证据 |
|---|---|---|
| python .agent/semester-03/math-08/minimal.py | 写作前最小例通过 | minimal.log |
| node scripts/verify-math08.mjs | 实际TS162组/26082采样点与独立数值积分一致；12复参数积分；七原始实验精确契约通过 | reconciliation.log/json、reference.py |
| node scripts/nb-cells.mjs verify math/laplace-transform --require-kernel --quiet --out .agent/semester-03/math-08/notebooks.json | 7实验/7cell/error0、无SKIPPED | notebooks.log/json |
| nb-cells extract/assemble | 7实验14代码块逐字往返一致 | extract.log、assemble.log、notebook-source.json |
| npm run verify -- math/laplace-transform | PASS8/WARN1/FAIL0/SKIPPED0，200、H1=1/H2=15、KaTeX错误0 | page-verify.log |
| npm run build（draft门槛） | 完整构建通过，无MDX编译失败 | build.log |
| npx tsc --noEmit | 通过 | types.log |
| npm run glossary:check | PASS3/WARN1/FAIL0，旧7处min/max提示不变 | glossary.log |
| npm run math:check | 28个围栏独占行配平 | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14通过 | regression.log |
| node scripts/check-fix-logs.mjs | 历史索引一致 | fix-index.log |
| node .agent/semester-03/math-08/check-scope.mjs | 原58课结果及策略、30待处理、其它已跟踪正文不变 | scope-check.json |

A.1共37条逐量对账；相同断言在习题/答案重复时指向相应原始cell，不拿省略充当不适用。实际TS从AST提取调用，参考quad直接积分；近r0用60位mpmath积分，不复制组件闭式自证。有限面积最大差3.552713678800501e-15，曲线8.881784197001252e-16；复积分最大差1.6474430569458545e-14。有限面积/曲线绝对容差1e-10；近边界巨大总量/尾项相对1e-12，均事先约定。

## 审校修正

分段连续就地解释；明确阴影是有限窗口、无限积分来自解析式；延迟代码保留ROC，不使用conds='none'隐藏条件；传递函数漏项具体写为3e^-t；时间系数单位按导数阶数配平。独立复积分初次只设epsabs、默认epsrel偏松而断言失败，quadrature-first-failure.log保留原始失败；补严格epsrel=1e-12后通过，没有放宽断言。近根测试组选在域内a=.25/σ≈−.25，越界输入另核拒绝。

实页默认/收敛边界/发散/积分到零/上端滑块/恢复全部实测；15个H2真实ID、无重复，14块公式居中，390px屏正文client343=scroll343，长公式自身滚动。opening.png、experiment.png、narrow.png与browser-results.json对应。七个最终原始实验已在Pyodide通过，browser-python.json留原始报告；仅新增本课，旧课未重跑。白名单59课/218实验/391cell，188可运行、30仅展示，Worker不变，未扩大Slycot支持。

全仓两WARN沿用基线；本课页面唯一WARN为下一课傅里叶分析仍为空页。自动修复统计/OUTLINE的首次退出非0保留，不拿修复命令当独立check成功。

## 最终登记与合并

最终登记后验收全部退出0：npm run check为PASS21/WARN2/FAIL0（check.log）；npm run build完整通过（build-final.log）；npm run build:pages通过205课/9旧入口/306252669字节（pages-build.log）；npx tsc --noEmit通过（types-final.log）；8080根页/课程均200，verify仍PASS8/WARN1/FAIL0/SKIPPED0（page-verify-delivery.log）。

生产导出页7个Notebook均为浏览器模式，KaTeX错误0；边界与发散提示正确，默认恢复一致。第七个答案实验实际点击全部运行后完成，六题输出与独立参考一致；console无error/warn，生产窄屏client343=scroll343，browser-results.json最终pass=true。开发服务的后台启动组合命令曾被自动审批拒绝，未请求额外权限；改为独立类型检查及受工具管理的直接Next dev进程后完成恢复与验证。全局checklist本课前五项完成，合并栏等待实际hash。

合并记录：待实际合并后填写。

用户proofreading两原文件未编辑、未暂存；不推送远端、不发布gh-pages。下一课需新对话执行。
