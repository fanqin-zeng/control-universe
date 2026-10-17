# MATH-13 凸优化验收

本次唯一交付math/convex-optimization。起点master 61b0822，工作分支wp/math-13-convex-optimization。新写专用讨论SKILL，四阶段日志在docs/discuss-log/semester-03/02-math/13-convex-optimization.md；角色是审查视角，未借用外部专家或独立Agent身份。

## 内容与教学

两间房电暖器功率请求超过回路上限的静态分配问题，16H2、6题含步骤答案、6原始Notebook各1cell、1个双图PowerAllocationExplorer。覆盖凸集/凸函数/存在唯一边界/一阶及Hessian/投影精确解/弱强对偶/KKT/Slater/投影梯度与停止/控制QP。功率kW、目标kW²、迭代不是秒；不承诺温度控制、安全保护或一般非凸最优。W06/W07/W08继续待办，不修改其它课程及用户proofreading文件。

## 实测与独立性

- minimal.py/log：先独立SLSQP跑通再填正文；默认(1.5,.5)、目标.25。
- scripts/verify-math13.mjs：从真实TS AST提取并执行计算导出，对reference.py独立活跃集枚举与KKT线性方程投影；750组参数，每组19节点，全部路径/目标/最优解/末点/距离/残差/违规核查；最大绝对差1.734723475976807e-18 < 预约1e-9，UI四位5e-5。
- TS另核乘子非负、驻点、互补与强对偶，不以同一分段公式复制自证。静态SLSQP与符号数学由6原始Notebook复算，精确合同与完整输出在reconciliation.json。
- nb-cells --require-kernel：6Notebook/6cell EXECUTED、error0、SKIPPED0；extract/assemble反向相等6Notebook/12block（临时roundtrip.mdx已删除）。raw标签/提取/真实内核/浏览器独立数6；source-consistency.json源哈希一致。
- Pyodide0.27.7逐课实跑6/6，无新依赖；支持清单64课/251实验/424cell，221启用/30代码展示；原63课逐字段不变、Worker不变，scope-check.json核。依赖Slycot的旧待办不扩展支持。
- browser-dev.json：默认/关机/单台/步长边界/滑块端点/恢复全部实测；16H2顺序与ID、h1=1、ID无重、9公式居中且auto、KaTeX-error0；390px正文343=scroll343、canvas313；控制台warn/error为空。

## 命令与证据

| 命令 | 结果 | 文件 |
|---|---|---|
| npm run verify -- math/convex-optimization | PASS9/WARN0/FAIL0/SKIPPED0，退出0 | page-verify.log |
| node scripts/nb-cells.mjs verify math/convex-optimization --require-kernel | 退出0，6原始cell真实运行无错 | notebooks.log/json |
| node scripts/verify-math13.mjs | 退出0，750组/6原始实验 | reconciliation.log/json |
| npm run glossary:check | PASS3/WARN1/FAIL0；旧函数名警告 | glossary.log |
| npm run math:check | 18围栏独占行配平 | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14通过 | regression.log |
| node scripts/check-fix-logs.mjs | 退出0 | fix-index.log |
| npm run build / npx tsc --noEmit | 首轮退出0；最终正文与Pages导出回执另附 | build.log/types.log |

首次verify暴露catalog小节字符串误写，修复后真实ID逐项全等。首次glossary暴露中文前缀被抓成QP别名，改正文为标准译名句式并移除重复登记后重验通过；不是放宽扫描门槛。check的自动修正首轮仍按修正前快照非0，原输出check-fix.log保留，交付只认独立最终check。声明范围仅本课及所需注册/元数据/机器表/日志/台账/验证，公共扫描器不修改。

最终签发、生产构建、check及合并的实际回执见后附；未完成项不预勾。不推送远端，不发布gh-pages。

## 最终交付状态复验

签发后catalog=v1.3、tracker与全局checklist同步；npm run check退出0，PASS21/WARN2/FAIL0，两WARN沿登记基线。node scripts/check-semester03.mjs退出0，合并前merged12。npm run build、build:pages、npx tsc --noEmit最终交付态均退出0，无MDX编译失败；Pages本地导出205课/9旧路由/312958116字节（pages-delivery.log），此前draft导出312958194仅留历史。最终npm run verify -- math/convex-optimization退出0，PASS9/WARN0/FAIL0/SKIPPED0。

生产页browser-results.json pass=true：16H2、6浏览器实验、9块display居中/auto、无KaTeX错误；默认/关机/步长边界/恢复正确，答案原始cell在Pyodide运行完成；控制台warn/error为空；390px正文343=scroll343、canvas313。opening.png人工查看标题/正文清晰，narrow.png及experiment.png存档。六原始实验严格kernel及浏览器源哈希一致见source-consistency.json；38行三方对账和九项+四条已过。W06/W07/W08不关闭，两个用户批阅文件不编辑不暂存。未推送远端，未发布gh-pages。
