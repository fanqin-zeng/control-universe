# MODERN-02 可控性与可观性验收

2026-10-18，起点master e807c56。使用wiki-lesson-refactor，完整讨论日志见docs/discuss-log/semester-03/04-modern/02-controllability-observability.md。本对话仅本课，普通提交进入master并推送；无本轮Pages发布授权。

保留九H2、七例、十题、原三Notebook教学用途，扩六Notebook六cell；课程路径/全部33旧标题ID/catalog状态不变。开篇从已交付状态概念进入具体两车，SVG替ASCII，初值与输入两通路使用一致模型。纠正对偶输入/输出、PBH左右向量与Jordan解释、反馈符号/坐标、Q8共同根证明、Q1/Q6/Q9矩阵及SISO/MIMO分界；补有限时间Gramian、尺度/噪声/力限边界和Hankel平方根。

## 数值与执行

六原始setup/cell严格Jupyter全部执行，无error/SKIPPED；最终浏览器Pyodide六份全部通过并匹配sourceHash。原Notebook实际两车数组对独立刚度模态解析，三工况×301节点×四状态×强迫/自由两路线，最大差9.2815e−14；有限/无限Gramian对逐元素解析积分，容差1e−10。完整数值输出、参数与图片证据见reconciliation.json、reference.py、pyodide.json。

首次Q8结构相等断言失败、第二次Q9审计断言错误分别保留initial-notebooks.log/json及second-notebooks.log。Q9原逐列计算与det+1正确，错在组装R；不改正确结论为负号。所有最后成功证据单独保存。

Python兼容账本为73课/331实验/504cell，304启用、27保留代码；只重跑本课六份，不宣称全站331实验重新执行。原27项待办ID/原因/处置保留，不因生成报告重排历史ID。

## 实际验收命令与证据

| 命令/检查 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-modern02.mjs | 退出0；六原始实验、33旧ID、3×301全节点及Gramian通过 | reconciliation.log/json、headings.json |
| node scripts/nb-cells.mjs verify modern/controllability-observability --require-kernel --out .agent/semester-03/modern-02/notebooks.json | 退出0；六cell，error0，SKIPPED0 | notebooks.log/json |
| 六实验浏览器Pyodide | 6/6通过，最终源指纹 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0；304启用/27代码 | python-policy.log |
| npm run math:check | 退出0 | math-check.log |
| npm run glossary:check | 退出0；PASS3/WARN2/FAIL0 | glossary.log |
| npm run build | 退出0；无MDX编译失败 | build.log |
| npm run build:pages | 退出0；205课程/9旧入口 | pages-build.log |
| npm run verify -- modern/controllability-observability | 退出0；200、9H2、KaTeX0 | verify.log |
| npm run check | 退出0；PASS21/WARN2/FAIL0 | check.log |
| node scripts/check-semester03.mjs | 进度逐阶段更新，提交后再记真实hash | checklist.log |
| 生产页面/SVG/33旧ID/375px实际截图与课程内运行 | 通过；41目录目标、整页375=scroll375、图像加载、桌面/手机运行完成；无warn/error | browser.json、desktop.png、narrow.png |

44项六列对账、六组审校、九项门槛与三条限定观察在讨论日志。W08/W09/W10与27Python待办不关闭；不交付MODERN-03，不同步gh-pages。用户三份proofreading修改未加入提交。

最终整体验收：node scripts/verify-modern02-delivery.mjs退出0，读取真实截图尺寸375px，而非把请求的390px冒充实测；六实验/33旧ID/41目标/源指纹全部通过，详见delivery-validation.json。普通及Pages构建均对最终上下双图版本重新执行。
