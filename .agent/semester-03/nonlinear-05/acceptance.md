# NONLINEAR-05 反馈线性化验收

2026-10-18，起点6382b170fa677e1f363c0250d121ac2dcd6c41fb，master直接交付。仅本课，不操作中文润色分支，不发布gh-pages，不提交用户proofreading文件。

保留15主题、原四实验十二cell和五题，纠正对合条件、跟踪符号、机械臂相对阶/失配、球梁高阶余项与局部稳定、习题导数及速度因子；新增真实SVG、三带宽测试和模型缩放/答案核验，共六Notebook十五cell、六题。零动态组件统一初值、显示解析真实末值及控制量，区分a=0改用r=2与原公式不能除零。42旧ID兼容。

| 命令/操作 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-nonlinear05.mjs | 退出0；真实TS40工况20040点，expm最大归一化差7.05947e-12；9符号恒等；摆误差坐标DOP853最大状态差4.63947e-9，球梁z坐标DOP853差2.27644e-9 | reconciliation.json/log、reference.py |
| node scripts/nb-cells.mjs verify nonlinear/feedback-linearization --require-kernel --out .agent/semester-03/nonlinear-05/notebooks.json | 退出0；EXECUTED，6Notebook/15cell，FAIL0/SKIPPED0 | notebooks.json/log |
| 本地Pyodide最终原始代码 | 6/6全部放行，15cell无异常，最终源指纹一致 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0；73课354实验，329启用25保留 | python-policy.log |
| npm run math:check；npm run glossary:check | 退出0/0；术语PASS3/WARN2/FAIL0，既有C2b/C4 | math-check.log、glossary.log |
| node --test scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs scripts/pages.test.mjs | 退出0；17/17 | tests.log |

最终MDX SHA256：5e3547bcc35cdc00d8a50f6e91bcf1868f9d36d4b6f37592ace1fd1f006e4180。原始输出、三方对账、比较边界、纠错与资产去向见本期讨论日志A/B/C/D。原四实验用途及每份三cell全部保留，NB3新增第四cell；原题全部保留纠错。25项Python待办逐字保留，W08/W09/W10不提前关闭。

| 最终命令/操作 | 结果 | 证据 |
|---|---|---|
| npm run build；npm run build:pages | 退出0/0；205课9旧入口 | build.log、pages-build.log |
| npm run verify -- nonlinear/feedback-linearization | 退出0；PASS9/WARN0/FAIL0/SKIPPED0；HTTP200，H2 15/15，KaTeX错误0 | verify.log |
| 实际静态页面 | 默认/±2/a0/近零−.1/恢复、三工具栏同时运行完成、SVG及PNG加载、console0、375px无整页溢出 | browser.json、desktop.png、narrow.png |
| node .agent/semester-03/nonlinear-05/validate.mjs | 退出0；最终指纹、实验完整性、42旧ID、25待办不变式 | delivery-validation.json |
| npm run check；node scripts/check-semester03.mjs | 退出0/0；PASS21/WARN2/FAIL0，提交前merged42 | check.log、checklist.log |

Phase4已签发，实际master提交回执待写。
