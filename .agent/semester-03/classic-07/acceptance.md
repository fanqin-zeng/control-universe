# CLASSIC-07「PID控制」验收

唯一课程classic/pid-controller，起点master fbbecdc，分支wp/classic-07-pid-controller。使用wiki-lesson-refactor与学期3共同Phase1–4，十名既有角色为结构化审查视角；三轮、六组、87行六列三方对账、原九项门槛、四红队放行、D资产矩阵均在docs/discuss-log/semester-03/03-classic/07-pid-controller.md。仅合master，不推送或发布gh-pages。两份用户proofreading文件未改或暂存。

## 内容与保留

原13H2、52全级ID、5Notebook用途与9题均保留。H1对齐PID控制，四长H2短名，加5别名；URL/status/prereq不变。两原Explorer仍由原注册引用，真实完整二阶含零点/理想D直通响应代替错误全极点近似，默认左Kp1/Ki2/Kd0，右Kp2/Ki1/Kd.2，新增读数/默认恢复；滤波公式保留且实际调参。滚动图例自动取series名，修原Ki=2.0与Ki=2不匹配，窄屏图标题缩短、表格单独滚动。

修正P零型/稳定条件、I可达有界平衡条件、PD与纯D相位，删除“PID唯一/增量天然抗饱和/结构固定排名”。FOPDT用精确延迟阶跃替错误抵消动态，Cohen-Coon按NI官方标准形式统一符号。电机按原物理参数重算G=4/(s²+12s+20.08)，全候选传播；原PI/理想PID/滤波PID三者均未满足原目标，撤销0.04s/3%虚假达标。题8四阶Routh改14.5/18.620689655；题6未舍入Ti20/3；题7PI反例零误差/零超调但较慢；题9仅未限幅同初态等价，实际输出与积分/滤波状态明确跟踪。

六原始Notebook/六cell：临界整定、精确纯延迟、三工况抗饱和/积分分离、保留旧失败参数的数字实验、电机候选、九题与默认复算。无ipywidgets；有噪声/电压/负载等实机限制说明，不冒充实机达标。不生产CLASSIC-08。

## 实际验收

| 命令/证据 | 退出码与结果 |
|---|---|
| node scripts/verify-classic07.mjs；reconciliation-final.log/json/reference.py | 0；真实TS对独立SciPy115组×501点，含Ki0/Kd0及2/重复根；最大误差1.6209256159527285e-14；603滤波点；原6实验新内核执行；52旧ID |
| nb-cells verify classic/pid-controller --require-kernel --out …；notebooks-final.log/json | 0；EXECUTED6Notebook/6cell，FAIL0/WARN0/SKIPPED0 |
| nb-cells extract/assemble；extract.log/assemble.log/extracted.json | 0；12代码块求值后反向逐字全等，roundtrip临时文件删除 |
| Pyodide逐课原setup/cell；browser-python.json | 6passed/0code，最终源码hash87aec36f6b7c0da88220e2518c04f091ca21e4d6962f5588107715a078f3d1fd |
| finalize --merge/write-report/preserve-debts/check-python-support | python-*.log；70课/310Notebook/483cell，283enabled/27code，458成功cell；69其它课及27原待办完整对象/编号不变 |
| npm run build；npm run build:pages；npx tsc --noEmit | 均0；build-final.log/pages-final.log/types-final.log，无MDX编译失败；205课程/9旧路由/317137033bytes |
| npm run verify -- classic/pid-controller | 0；page-final.log，9PASS/WARN0/FAIL0，HTTP200/H1=1/H2=13/KaTeX0，本课两组件合规 |
| node check-browser.mjs | 0；browser-check.log/browser-results.json；最终13H2/侧栏href、52旧ID+5别名/无重复；40居中公式/各表列数；4canvas、6Notebook/textarea，边界和恢复，真实课程按钮Pyodide完成、console=[] |
| 390px生产页 | narrow-final.png；文章343=scroll343，文档375=scroll375，6Notebook均341=scroll341；四图各343×350；opening.png普通1280视口，interactive.png示滚动图例 |
| node check-scope-source.mjs | 0；scope-source.log/json，最终hash/原内核/浏览器/政策一致；69其它课、27待办、其它catalog/status/prereq不变；W06–W09开放 |
| npm run math:check；npm run glossary:check | 0；math.log/glossary.log，80独占公式围栏，3PASS/2WARN/0FAIL：NOISE“工业最常”因删除无据断言而零命中，既有漏函数斜杠7处不属本课，未降低词表门槛 |
| node --test pages.test/lesson-route.test/browser-python.test/python-release-decision.test | 0；regression.log，14测试通过，无SKIPPED |
| check-fix-logs | 0；fix-index.log，fix040索引/详情与陈控清单同步 |
| npm run check -- --fix-outline --fix-tracker-stats；npm run check；check-semester03 | check-generated.log/check-final.log/semester-check.log，21PASS/2已登记WARN/0FAIL；课程合并后再复验登记 |

## 失败记录与边界

outputs.json/notebooks.log保留初稿前导零分子警告；trim_zeros后严格内核/Pyodide重跑无此警告。reconciliation.log保留工具把内核创建响应误当execute输出的问题，改成空创建后实执行setup；final为准。独立reference.py全零分子边界可能打印SciPy标准化警告，有意检查G=0，不在生产代码吞警告。narrow.png为初次表格溢出；局部包装后最终无页面溢出，图例名称与布局另复审重建。构建后递归清缓存操作被自动审批拒绝，未执行；使用正常dev启动并以真实HTTP200/页面脚本验收，无缓存故障，未绕过审批删除文件。

W06/W07/W08/W09与27Python待办仍开放，不把浏览器Pyodide通过当作原生IAB网关缺陷已修。报告生成器重编号由preserve-debts恢复原完整记录；不改全局生成器。源码临时编辑脚本/roundtrip已移除，独立参考与可复验脚本保留。

## 合并

正文/讨论日志/台账/清单/验收同提交；实际no-ff后回填课程提交与合并hash，再勾全局合并格。本轮不发布gh-pages。

实际课程提交：11473277bb77fc1955f9fbdfdde82ab890edb16e。master no-ff合并：b6d6322da07120330c796585a4864d95cf0bbd2f。全局checklist据实勾合并格；合并后npm run check与node scripts/check-semester03.mjs输出见check-merged.log/semester-merged.log（均退出码0）。未推送或发布gh-pages。
