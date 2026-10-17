# MATH-14 变分法与动态规划验收

仅交付math/variational-dp；起点master7731967，工作分支wp/math-14-variational-dp。按新写专用SKILL完整四阶段，日志docs/discuss-log/semester-03/02-math/14-variational-dp.md。角色为审查视角，不冒充外部专家或独立Agent。

## 内容与边界

16H2、6题含步骤答案、6Notebook各1cell、FiniteHorizonExplorer双图。直轨小车两步回家引入，离散积分器/半平方和默认x0=2,N2,q=r=s1；u是归一化每步位移，不是力。先讲泛函、一阶变分、固定/自由端点、Euler–Lagrange必要与充分边界，再讲Bellman/二次倒推/前向策略，连接协态/Hamilton/连续HJB。连续另设积分目标与xdot=u，不能把成本2与离散3.2作性能比较。软终端与硬终点分别求解，q=s0不含回家要求。无随机、输入限幅、状态约束、真实硬件或一般PMP/随机HJB结论。补真实已交付凸优化先修，其它正文不改。

## 数值独立性与证据

- 最小例minimal.py先独立符号整段QP，再填正文：u=(-6/5,-2/5)、x=(2,4/5,2/5)、J16/5；泛函1/2+pi²epsilon²/4。
- 实际TS AST导出calculateFiniteHorizon，与reference.py通过累积状态矩阵S、H=rI+S^TWS的整段正定系统直接解全部动作对账。每个子时域重解获得P/K，不复制组件Riccati递推。960组核全部P/K/x/u/阶段/终端/成本/值与Bellman残差；最大差5.329070518200751e-15，低于预约绝对1e-9、四位UI5e-5。版本及输出见reconciliation.json。
- 六原始setup/cell各独立kernel，精确合同断言覆盖泛函/动作/成本/硬终点/Hessian/协态/连续积分；不拿随机采样替代数学证明。连续solve_ivp/quad与解析指数/tanh交叉；不使用未实现的801点显示方案。
- 首轮S6抓到SymPy动作positive假设排除负解、solve空列表IndexError，失败日志notebooks-first-failure.log留存。修成u/x real，q/r/P positive后全部重跑。最终strict kernel6cell/error0/SKIPPED0，extract/assemble6Notebook12block逐字全等，临时roundtrip文件已删。
- Pyodide0.27.7六原始实验6/6成功；raw/提取/kernel/浏览器独立数6，源哈希三方一致见source-consistency.json。兼容清单65课/257实验/430cell，227启用/30代码展示；scope-check核原64课与30待办逐字段不变，Worker不变，不扩大Slycot支持。
- browser-dev.json核默认/零初态/只罚动作/重终端/全部滑块端点/恢复，16H2与真实锚点、无重ID、13display居中auto、KaTeX错误0；390px正文343=scroll343、canvas313，控制台warn/error空。

## 命令与实际输出

| 命令 | 结果 | 证据 |
|---|---|---|
| npm run verify -- math/variational-dp | PASS9/WARN0/FAIL0/SKIPPED0，退出0 | page-verify.log |
| node scripts/nb-cells.mjs verify math/variational-dp --require-kernel | 六cell EXECUTED、error0，退出0 | notebooks.log/json |
| node scripts/verify-math14.mjs | 960组、六原始实验合同通过，退出0 | reconciliation.log/json |
| npm run glossary:check | PASS3/WARN1/FAIL0，旧函数名警告不变 | glossary.log |
| npm run math:check | 26围栏独占行配平 | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14通过，退出0 | regression.log |
| node scripts/check-fix-logs.mjs | PASS，退出0 | fix-index.log |

最终build/Pages导出、tsc、check、签发与合并回执在后附。W06/W07/W08不关闭，两个用户proofreading文件不编辑不暂存。本次不推送远端，不发布gh-pages。

正文实测行数：295；16H2/26个独占行美元围栏/13display/6Notebook。

## 最终交付状态复验

签发后catalog=v1.3、tracker与全局checklist同步。npm run check退出0：PASS21/WARN2/FAIL0，两WARN沿登记基线；check-semester03退出0。npm run build / build:pages / npx tsc --noEmit最终交付态均退出0，无MDX编译失败。Pages本地导出205课/9旧路由/314526646字节（pages-delivery.log）；此前draft314526632只作历史证据。最终npm run verify -- math/variational-dp为PASS9/WARN0/FAIL0/SKIPPED0，退出0。

生产页browser-results.json pass=true：h1=1、16H2、6浏览器实验、13display居中/auto、KaTeX错误0；默认/零初态/只罚动作/恢复正确，答案原始cell在Pyodide运行完成；控制台warn/error为空；390px正文343=scroll343、双canvas313。opening.png人工查看正文清晰，narrow.png/experiment.png存档。六原始实验源哈希、kernel与Pyodide一致。36行三方对账、原九项+四条与四份档案齐备。未推送远端、未发布gh-pages；W06/W07/W08保持待办，两用户批阅文件未改未暂存。

合并回执：课程提交 `fce6da9` 已用 `--no-ff` 合入 master；课程合并提交 `c8774d79e26a1207d005c3fc4a679f4482720d1b`。全局checklist六项全部完成，本对话仅交付MATH-14。未推送远端、未发布gh-pages。
