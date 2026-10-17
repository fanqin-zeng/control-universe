# CLASSIC-01 系统建模验收

唯一交付classic/system-modeling；起点master38467ef，工作分支wp/classic-01-system-modeling。重构专用讨论SKILL及共同流程；日志docs/discuss-log/semester-03/03-classic/01-system-modeling.md按实际Phase1–4持续记录。十名既有角色为结构化审查视角，不是真实外部专家或独立Agent；theory角色池+秦构，何仿/陆阅沉默由郑核代核合同/开篇与档案，柯验独立复算。

## 原稿与保留

旧761行/13H2、0Notebook，旧SHA813aec568336d8044ebe4fe7d9cffd23236e8929664a01a8320cede04b4e279d，标题ID共36；SuspensionExplorer实际归一化外力阶跃却被当作路面输入，无本课独立旧讨论日志。附录D逐项覆盖所有原部分：受力/双质量/旋转/RLC/类比/电机/验证/热/液压/辐射/生态/传播/CSTR/库存价格/线性化/原三题，保留正确内容，纠正错误公式、无条件推论与无支撑现实外推，没有未迁片段或其它课交付。

新课13H2短名、6题步骤答案、7原始Notebook各1cell、双图SuspensionExplorer（保留接口，唯一调用课），三幅SVG。原RLC PNG继续引用，退役悬挂/电机PNG保留文件与旧URL；新增双质量图替代长期占位。36旧标题ID用7保留canonical+29别名全部覆盖，原课程URL/prereq不变。

## 数值与纠错

- 停车车身向下压5cm松手：r=F0、相对静平衡、m250kg/k16000N/m、默认zeta.3/c1200、初速度0。E0=20J；t1位移.2392108723cm、速度−.0371018569m/s、能量.2178459463J。位移cm/速度m/s/能量J/耗散W明确，真实时间0…3s/301节点；不等路面阶跃、整车舒适性或稳态。
- scripts/verify-classic01.mjs AST提取实际TS分段解析实现，对reference.py独立scipy.linalg.expm的41阻尼全301点与四游标0/.37/1/3；最大差1.3681500377060729e−11<1e−8，8非法输入拒绝，能量非增/轴域/末样核。UI四位5e−5，正文七位5e−8，符号精确。
- 七原始setup/cell干净8891kernel，额外核能量与双质量受力恒等/RLC坐标、电机三L、液压消元与辐射、LV/SIS、摆完整初值、答案。严格nb-cells EXECUTED/7cell/FAIL0/SKIPPED0；extract/assemble7Notebook14block反向全等，临时roundtrip删除。
- 电机R1/J.01/B.1/Ke=Kt.1，1V、i0=w0=0、0…1s，601相同输出点，三L.001/.01/.1完整保留。首轮附加检查只核最后一个L，进一步检查发现小L状态差约2.2e−7；不是允许放宽容差。独立二阶解析式与15个80位矩阵指数点一致，确认数值积分输出误差；统一加max_step.001s，原始cell逐L断言<1e−8后全七组重跑。DOP853 rtol1e−10/atol1e−12、最大步长/输出网格分开，不把容差当全局保证。初次失败motor-first-failure.log保留。
- 电机补RJ s动态/反电势，约化初始电流1A对全阶0A；液压阻尼b+Ap²/Kc、Kc>0前提、三/二阶分开；辐射同平衡Te254.5823428K/tau.8467752年，旧288K只得导数尺度.5848918年；eps降1%增温.6404638K。LV无显式时滞、首次积分非极限环，SIS正平衡9500且I=N导数−1000；倒摆保留两模态完整初值。fix-034详情/索引及陈控清单同步，团队未改。
- 原始标签/提取/kernel/Pyodide/DOM分别计七，不借W08扫描缺口假绿。最终源SHA20763b08bdc6840cfe870dddcadb4c7884ec23adbadc97e2ccb6f21877ad471b与reconciliation/browser-python一致。
- Pyodide0.27.7七原始实验全部通过；兼容清单70课/292Notebook/465cell、262启用/30代码展示。此前69课记录/政策及30待办逐字段不变，Worker未改，不扩大Slycot兼容性；scope-check有证据。

## 页面与门槛

生产导出真实13H2顺序/ID、全部目录锚点、旧36ID与29别名、无重复ID，16display居中auto、KaTeX错误0、7Notebook、4图成功。无阻尼/临界/过阻尼、两滑块Home-End、默认恢复通过，最终页面答案在Pyodide实际完成，控制台warn/error空。390px配置文档375=scroll375、正文343=scroll343、两canvas313×280/313×230，四图片宽342.67px；初次一处下标造成2px溢出，通过改该段换行修正，不加全站遮挡样式。opening/narrow/force-diagram/motor-diagram人工视觉复核；SVG复核发现合并子路径只有最后一条有箭头，已拆成单路径，修后再导出查看。

开发IAB原生Notebook出现Failed to fetch连接提示，不冒充浏览器本地网关连接成功；8891严格原始内核直接实跑全部通过。生产静态页七Pyodide实验与页面答案另实跑成功；本课没有改原生网关、没有扩大浏览器权限或把S6标SKIPPED。这一环境连接边界保留在记录中，课程数值门槛以实际严格kernel与浏览器原始代码两条证据独立核。

| 实际命令 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-classic01.mjs | 41阻尼×301点/四游标+7原始实验合同/8非法输入，退出0 | reconciliation.log/json |
| python .agent/semester-03/classic-01/motor-reference.py | 15个80位参考点，退出0 | motor-reference.log |
| node scripts/nb-cells.mjs verify classic/system-modeling --require-kernel --out … | EXECUTED/7cell/FAIL0/SKIPPED0，退出0 | notebooks.log/json |
| npm run verify -- classic/system-modeling | PASS9/WARN0/FAIL0/SKIPPED0，退出0 | page-delivery.log |
| npm run glossary:check | PASS3/WARN1/FAIL0，退出0，旧函数名WARN | glossary.log |
| npm run math:check | 同行围栏违规0，退出0；本课32独占围栏/16display | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14通过/0失败，退出0 | regression.log |
| node scripts/check-fix-logs.mjs | 索引详情一致，退出0 | fix-index.log |
| npm run build / npx tsc --noEmit | 最终代码退出0；初轮游标markPoint缺name类型失败已修 | build-delivery.log/types-delivery.log |

全局check、最终Pages产物字节数、签发与真实合并回执后附。两份用户批阅不编辑不暂存，W06/W07/W08继续待办，本次不推送远端、不发布gh-pages。


## 最终交付状态

Phase1–4完整签发，48行六列A.1、原九项+四条B、四条C与完整D已过check-log；global checklist前五列、旧tracker及plan同步，catalog原v1.3保留但本期以新证据计。最终npm run check退出0，PASS21/WARN2/FAIL0（check-delivery.log）；两WARN仍为motion-planning跨章slug及33门存量正文缺日志。check-semester03通过，W06/W07/W08未关闭、W09另列环境连接复核。

npm run build与npx tsc --noEmit均退出0（build-delivery/types-delivery）；SVG箭头分路径修正后最后npm run build:pages退出0，205课/9旧路由/317985650字节（pages-delivery-final.log）。此前317985513只是旧产物，不冒充最终字节数。开发服务恢复后首次冷编译HTTP检查timeout而SKIPPED，预热确认HTTP200后重跑最终npm run verify -- classic/system-modeling为9PASS/0WARN/0FAIL/0SKIPPED（page-final.log）；不把第一次8PASS/1SKIPPED算通过。

browser-results.json finalDelivery=true；13H2与全目录目标、36旧ID/29别名、无重复ID，16公式居中auto、KaTeX错误0、7Notebook、4图片成功。默认/无阻尼/临界/过阻尼、两slider端点及恢复通过，生产页原始答案Pyodide实际完成，控制台warn/error空。390配置正文343=scroll343、文档375=scroll375，双图313×280/313×230，4图均在正文范围。opening/narrow及三张diagram截图已人工查看，新增受力、两质量、机电耦合箭头与单位清楚。两份user proofreading保留，未编辑未暂存。

source-consistency.json最终SHA20763b08bdc6840cfe870dddcadb4c7884ec23adbadc97e2ccb6f21877ad471b对独立数值/浏览器报告一致，7原始标签/提取/kernel/Pyodide、13H2/32独占围栏/16display核对。scope-check.json证明此前69课兼容记录/政策与30待办逐字段不变、其它课程正文未改、SuspensionExplorer仅本课调用。最终纯源码diff无空白错误，raw命令日志按原输出保留。

本对话只交付CLASSIC-01，下一课CLASSIC-02「传递函数」另起对话；未推送远端、未发布gh-pages。本课合并列等实际commit后回填，回执后附。


合并回执：课程提交`bca1ad4`已通过`--no-ff`合入master，课程合并提交`c8fb52614a20e35331d666f2ab0d5c68e80e7508`。全局checklist六列全部完成，本期课程合并19节（18数学+本课）；W06/W07/W08/W09保持待办。只交付CLASSIC-01，未推送远端、未发布gh-pages。
