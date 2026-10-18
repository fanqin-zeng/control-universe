# CLASSIC-03「时域分析」验收

唯一交付classic/time-domain-analysis，起点master921aefc，分支wp/classic-03-time-domain。按重构专用SKILL与共同Phase1–4；十角色为结构化审查视角，不冒充外部专家/独立Agent。完整日志docs/discuss-log/semester-03/03-classic/03-time-domain-analysis.md，A.1为91行六列对账，C六行限定观察/反例，D逐类原资产去向。两份用户批阅文件未编辑未暂存；只合master，不自动发布。

## 原稿、纠错与保留

旧MDX SHA d90e344f879217142d8d1eac2ec737296c77a2a64cf28b5f5ae253c276d45e37，11H2/43全级ID/两Notebook；五Explorer只本课调用，无独立旧讨论日志。保留信号/积分链、一阶二阶推导、指标、主导极点、路面模型、辨识、零点/时延、全部九题，无拆分或未迁片段。两H2短名以2别名+41canonical兼容旧43ID，URL/prereq不变。

修正路面单自由度模型被当无零点二阶、组件缺零点项系数/临界除零、过阻尼公式与冲激倍数、无阻尼稳态指标、动态坐标截断。反向设计旧ζ.7/wn2.8571429真实ts2.0925773s失败，wn3.2为1.8683726s且超调4.5987910%通过。主导极点p5/10/20在0…8s/.001s网格最大绝对差.3548446/.1980618/.1029011，不承诺倍率误差界。路面ζ.3/.707/1超调45.097545/20.791542/13.533528%，均不满足10%；ζ2为4.776873%，只通过教学位移要求，非舒适性/全域最优。题5限三候选、题6区分上界与最短时间、题8清理草稿并得误差6、题9峰时.2529755s。

## 数值与源一致性

lib/time-domain.ts是五组件实际调用的纯计算模块。33组首轮通过后补滑块最低非零.05，共36组（ζ0/.05/.1/.3/.5/.707/.95/.999/1/1.001/1.5/2 × wn1/8/10），每组1501标准阶跃+601冲激+601路面节点；实际完整TS模块对独立scipy状态空间/矩阵指数/连续根。最大轨迹误差2.2026824808563106e-13、指标误差1.8417267710901797e-11；四一阶T及非法参数另核。最后出带遍历解析极值并核尾界，避免固定网格漏掉窄出带。

七原始Notebook各一cell：信号/一阶、指标/反向设计、主导误差、路面、辨识三组、零点/时延、九题。各自8891新内核setup/cell与附加合同全部通过；Pyodide七组全部实际成功。最终SHA1742be6d4af02088928fcb2cc530e03d409317d44f77c13af59523b24772da49在MDX/reconciliation/browser-python一致；原始标签/提取/严格内核/Pyodide/真实DOM分别计7，70独占围栏/35块公式。extract/assemble七Notebook14代码块反向逐字全等。69其它课程兼容记录/政策与30待处理项逐字段不变；兼容汇总70课/300Notebook/473cell，270启用/30代码展示。

## 最终实际验收

下列命令均退出0，完整日志在本目录：

| 命令/动作 | 输出与证据 |
|---|---|
| node scripts/verify-classic03.mjs | reconciliation.log/json；36组真实TS对独立参考，七原始实验与合同 |
| nb-cells verify classic/time-domain-analysis --require-kernel --out … | notebooks.log/json；EXECUTED7/7，FAIL0/SKIPPED0 |
| nb-cells extract / assemble | extract.log/assemble.log；7Notebook/14block反向全等；临时roundtrip已删 |
| 浏览器逐课全部运行 | browser-python.json；7通过/0保留，最终源hash |
| npm run build | build-acceptance.log；无MDX编译失败 |
| npm run build:pages | pages-acceptance.log；205课/9旧路由/317618427字节 |
| npx tsc --noEmit | types-acceptance.log；退出0 |
| npm run verify -- classic/time-domain-analysis | page-delivery.log；PASS9/WARN0/FAIL0/SKIPPED0，HTTP200/H1=1/H2=11/KaTeX错误0 |
| node check-browser.mjs（本目录） | browser-check.log/browser-results.json；生产DOM/43旧ID/2别名/35居中auto公式/5canvas/7实验；六滑块端点、默认恢复、无阻尼/临界/过阻尼通过；页面九题答案实际Pyodide完成；warn/error为空 |
| node check-source.mjs / check-scope.mjs / check-log.mjs（本目录） | source-check.log/scope-check.log/log-check.log；源hash/独立计数/69课与30待办不变/固定日志91行与六组审校 |
| npm run math:check；npm run glossary:check | math-fences.log/glossary.log；0坏围栏；术语PASS3/WARN1/FAIL0（既有函数名WARN） |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | regression.log；14测试通过 |
| fix索引审计 | fix-index.log；34详情/34索引+2预留一致，fix036归因与既有角色清单更新 |
| npm run check -- --fix-outline --fix-tracker-stats；npm run check | check-generated.log/check-delivery.log；PASS21/WARN2/FAIL0，既有WARN已登记 |

生产页窄屏首验发现两张表撑宽；只给这两表各加overflowX:auto，重跑最终源实验及构建。最终390px视口：正文343=scroll343、文档375=scroll375、12section无溢出，五canvas均313×310。narrow.png可见路面峰点、2%误差带、滑块和恢复；opening.png显示从已交付车身案例引入的可读开篇。截图已经实际查看。

保留初次失败证据：早期正文变更后Pages源hash闸门拒绝旧浏览器记录（pages-build.log），随后实跑最终正文并更新支持记录，未手填hash绕过。旧build-final/delivery等为中间检查点，最终以acceptance后缀三构建日志及page-delivery/browser记录为准。五组件本轮新增useMemo依赖告警已消除；其余全站旧警告不在本课借机改动。W06/W07/W08/W09仍待办，严格直接内核/Pyodide不代表原生IAB网关UI已修。

## 合并

Phase1–4、验收及台账同提交；真实no-ff合并完成后回填全局checklist合并列与本回执。不推送或发布gh-pages。本对话到CLASSIC-03结束。

实际交付提交206dbb1，课程no-ff合并54e282c063f164ae4d6c21cfa6ab7af57be6b0c0。全局checklist六格已按真实合并回填；回执随同分支再次no-ff合master后删除工作分支。构建原始日志保留终端格式尾空格，源码diff检查无尾空格。
