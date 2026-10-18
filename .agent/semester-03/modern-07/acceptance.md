# MODERN-07 LQR控制验收

2026-10-18，起点master c535161，wiki-lesson-refactor完整Phase1–4。日志docs/discuss-log/semester-03/04-modern/07-lqr-controller.md；仅本课，不发布gh-pages，不纳入用户三份proofreading。

保留10主题/三例十题/原一Notebook四cell用途，扩五实验八cell；小车权衡引入/SVG，有限DRE对TPBVP/代价加终项，S0边界KT0；DARE正确Kd/离散尾项；共同缩放/单位变换、标量b0和软约束/采样边界。原两模式组件实际纯函数调用，785组各601点轴界/四独立时刻对账，真实TS最大差1.3098e−11；默认原601点完整expm复算另保留，没有夸大全参数全点独立比对。

| 命令/检查 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-modern07.mjs | 退出0，实际原cell/真实TS对独立数值，30旧ID | reconciliation.log/json、reference.py、cases.json |
| node scripts/nb-cells.mjs verify modern/lqr-controller --require-kernel --out .agent/semester-03/modern-07/notebooks.json | 最终5份8cell EXECUTED，FAIL0/SKIPPED0 | notebooks.log/json |
| 最终浏览器Pyodide | 5/5实验8cell passed，最终源指纹一致 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0，320启用/27保留代码 | python-policy.log |
| npm run verify -- modern/lqr-controller | 最终页面/标题/十题与组件检查 | verify.log |
| npm run math:check / npm run glossary:check | 退出0，保留两项既有术语WARN | math-check.log、glossary.log |
| npm run build / npm run build:pages | 最终构建和静态导出 | build.log、pages-build.log |
| npm run check / node scripts/check-semester03.mjs | 目录与本期台账门槛 | check.log、checklist.log |
| 最终页面/手机 | 两模式/全部滑块边界与复位、四图/旧ID、页面原始Python实跑与PNG | browser.json、desktop.png、narrow.png |

失败initial-*记录MDX裸比较符/未数学围栏坐标表达式引发解析或运行错误、首标题大小写slug不符，均实际修复后重验，不改编译器或降门槛。29行六列对账、六组审校、九项门槛与四条补充见本期日志。

兼容聚合73课/347实验/522cell，本轮仅实际重跑本课；27Python待办原ID/原因/处置及W08/W09/W10保留。最终验收后才Phase4签发，真实master hash随后回执。

最终验收：Phase4已依实际结果签发，B九项及四补充通过；check PASS21/WARN2/FAIL0，verify PASS9/WARN0/FAIL0/SKIPPED0，glossary PASS3/WARN2/FAIL0。最终build与build:pages均退出0，205课/9旧入口静态导出；页面五份实验逐一点击全部运行均完成，手机375/360px无整页横向溢出、SVG与生成PNG加载成功、console空。四滑块共八端点和两模式恢复实际通过；截图desktop.png/narrow.png。verify-modern07-delivery.mjs退出0，最终MDX/Python策略/内核/Pyodide指纹一致。

手机首轮提示框保留桌面位置导致375px页面scroll508，修复confine/四位数值/容器裁剪及极点横轴重叠后重做生产构建和页面验收；中途误带其它目录标题已撤回，最终catalog diff只本课。全部更改完成后再签发，不保留过期通过状态。
