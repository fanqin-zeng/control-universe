# DISCRETE-09 离散最优控制验收

仅本课新写wiki-lesson-new Phase1–4，起点master15c4136。Phase1–4、证据与命令已完成，郑核据实签发，真实master hash待提交后登记。不发布gh-pages；01未交付草稿隔离、用户批阅及四个本地端口文件排除提交。

独立参考通过Fraction消去状态后解完整N变量二次优化，各后缀独立求价值和首输入；实际TS调用15个配置，最大偏差2.22e−16。原始Notebook70个量对独立参考最大偏差2.22e−16，阈值1e−9。原生、Pyodide两Notebook四cell均通过，最终文本hash见reconciliation.json。

初稿catalog误用id被构建拒绝，保存build-draft-rejected.log；改slug后build.log退出0。其它既有警告不关闭。Python待办17项task/category/next完整保留，新增两实验实际运行后支持。


| 实际命令/操作 | 退出码/结果 | 版本化证据 |
|---|---|---|
| npm run check（基线） | 0；PASS21/WARN2/FAIL0 | check-before.log |
| JUPYTER_PORT=8981 node scripts/verify-discrete09.mjs | 0；15真实TS配置/70Notebook变量，误差2.22e−16 | reconciliation.log/json、actual-ts.json、reference.py |
| node scripts/nb-cells.mjs verify discrete-sampled/discrete-optimal-control --require-kernel --port 8981 --out .agent/semester-03/discrete-09/notebooks.json | 0；2Notebook/4cell，FAIL0/SKIPPED0 | notebooks.log/json |
| npm run build | 0；无MDX编译/渲染失败 | build.log |
| WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/discrete-optimal-control | 0；HTTP200/H1=1/H2=8/KaTeX错误0，九项PASS | verify.log |
| 浏览器Pyodide逐课全部运行 | 两实验四cell passed，最终源hash一致 | pyodide.json |
| 普通课页全部运行、三预设/四滑块边界/恢复 | 输出一致，图例/曲线/读数复核 | browser-native.json、native.png |
| npm run build:pages | 0；205课/9旧路由、basePath正确 | pages-build.log |
| 实际Pages格式页全部运行 | 四cell输出一致，SVG基路径正常 | browser-pages.json、desktop.png |
| Chrome375px | width375/scrollWidth360，控件图例可读 | browser-mobile.json、mobile.png |
| node .agent/semester-03/discrete-09/validate.mjs | 0；hash、输出、两真实DOM/目录锚点/图片/重复ID/控制台/手机核 | validation.log/json |
| node scripts/check-python-support.mjs | 0；81课/386实验，369可运行/17保留代码 | python-policy.log |
| npm run math:check | 0；同行违规0 | math.log |
| npm run glossary:check | 0；PASS3/WARN2/FAIL0，既有全站提示 | glossary.log |
| node --test scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs | 0；32/32，09例外不放行10 | tests.log |
| npm run check -- --fix-outline --fix-tracker-stats | 1；旧统计5FAIL，随后自动刷新，未把此轮当通过 | refresh.log |
| npm run check（刷新后独立复验） | 0；PASS21/WARN2/FAIL0 | check.log |
| node scripts/check-semester03.mjs | 0；58生产完成，合入列提交后再记 | semester-check.log |

最终源hash bc853f14cd517ede9a056fddff1e8996e887b5a17996f86f37b997ca1b9500d4；两实际页面/原生/Pyodide输出按1e−9容差一致。catalog全站61/205交付、74Explorer，学期3完成58课（口径不同）。保留既有WARN/W任务，不新建历史fix；本地Pages验收不等于发布，gh-pages保持不动。01草稿与本地端口/批阅不提交，交付末恢复草稿并核验。
