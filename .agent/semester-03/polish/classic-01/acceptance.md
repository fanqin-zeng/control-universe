# CLASSIC-01初学者润色试点

起点master400d2dfbd53d243814431c625bf98563c3ed1110，2026-10-18。只改CLASSIC-01正文和本次授权的共用教学文案；添加逐课润色计划、文简/沈读与记忆规则。其它39课仅列队，不声称已润色。待用户精读认可后，才从MATH-01按原生产顺序推进。

先问题、后概念/符号/方程与数值；交互放在参数解释之后，双质量块、电机简化与跨领域模型保留选读，六题答案重写为解释。正文采用适当有效位，精确值留原实验；七份setup/cell逐字未改，数学模型与组件计算不变。13H2与全部旧锚点保留。沈读实际顺读页面后才写终稿记忆；角色放行不等于用户通过。

共用界面：前置空卡不渲染，去“已交付”等内部状态；代码框不重复显示验收声明/环境通知，运行时仍反馈运行中、完成与错误，停止按钮说明本页范围。未编写的目标仍有必要提示。

| 验收命令/操作 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-classic01.mjs --out .agent/semester-03/polish/classic-01/reconciliation.json | 0；实际TS41阻尼×301节点/四游标对独立expm，最大差1.36815e−11，七原始cell合同与八非法输入 | reconciliation.log/json |
| node scripts/nb-cells.mjs verify classic/system-modeling --require-kernel --out … | 0；EXECUTED，7Notebook/7cell，无FAIL/SKIPPED | notebooks.log/json |
| 最终源Pyodide逐课验收 | 7/7通过；源码指纹更新，25项待办ID/原因/处置不变 | pyodide.json、pending-before.json、python-policy.log |
| npm run verify -- classic/system-modeling | 0；HTTP200、13H2、KaTeX错误0、单一注册/组件规范通过 | verify.log |
| npm run math:check / npm run glossary:check | 0；术语已有WARN保留，FAIL0 | math-check.log、glossary.log |
| npm run build / npm run build:pages | 0；首轮清理提示后未用变量被拦截，修后未禁用lint重新构建 | build-first-failure.log、build.log、pages-build.log |
| node --test scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs scripts/pages.test.mjs | 0；23/23 | tests.log |
| 最终静态页面/完整顺读/实际运行 | 通过；两框实际运行完成，360px视口无页面横向溢出，四图加载、KaTeX错误0 | browser.json、read-through.txt、desktop.png、narrow.png |
| node .agent/semester-03/polish/classic-01/validate.mjs | 0；最终源/原代码/队列/记忆/DOM/运行不变式全部通过 | validation.json |
| npm run check / node scripts/check-semester03.mjs | 0；已知WARN保留，FAIL0 | check.log、checklist.log |

原生产日志和CLASSIC-01旧验收不回写；本轮新日志polish/01-system-modeling.md有Phase1–4、48项参考量/A.2本轮输出、B九门槛与四补充、C比较、D去向/E沈读记录。学期3原生产40课完成状态不重置；润色另列40行，仅CLASSIC-01动工、用户确认均留空。LP03包含用户反馈，故不先勾完。

日常master提交推送，Pages不发布。用户三份proofreading文件不纳入。技术及语言试稿已签发；用户尚未精读，LP03及用户确认仍未勾选。最终源码SHA256：559686c98496608e6d78ac6f83e3a6d473cd4b834dce8bc8a458a506cd38d13d。
