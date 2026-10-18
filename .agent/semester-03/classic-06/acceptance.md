# CLASSIC-06「根轨迹」验收

唯一课程classic/root-locus，起点master b403c1a，分支wp/classic-06-root-locus。采用重构专用SKILL和共同Phase1–4；十既有角色为结构化审查视角，无外部专家/独立Agent冒充。日志docs/discuss-log/semester-03/03-classic/06-root-locus.md含三轮、六组、92行六列对账、原九门槛/四补充、C三项限定观察及D保留矩阵。两份用户批阅文件未改动或暂存。仅合master，不发布gh-pages。

## 本课改动与保留

原48全级ID/12H2、四Notebook五cell及源码hash811a471832bb49173cc8f5450f2469131accfe8972bc2d92e074adc3988dc8b9见baseline-source.json。旧out实际打开核H1根轨迹法、12H2、5cell/默认K10。保留七规则、全部三阶手算、ζ=.5推导、PD/PI与广义/正反馈、原七题主题；原四实验目的分别保留于六新实验七cell，不迁出片段、不生产下一课。H1对齐根轨迹、三长H2缩短，以4别名保留旧48ID，URL/prereq不变。

原交互没有实际求根，以K区间拼接假二阶/线性增长响应。现用D+KN真实三次根、完整三阶RK4双图，默认K224/27：根−14/3与−2/3±j2√3/3，y(10)=1.0004126256。根平面等比例、固定窗口；K0零通道/零根、分离重根、K48不渐近/BIBO稳定、K60两个RHP分别说明；有限末样不当极限。

修atan象限、K0约分特征根、虚轴重数与分离候选条件。主导五倍仅候选，4/sigma不签发2%指标；题4完整模态阻尼上界43.776，题5保留近似代数但改“候选+四工况验收”：K448/27/20/25/880/27真实ts3.996414/2.908469/3.058924/2.987951s，不声称全域可行域。添零点z1/6/10重心−2.5/0/+2，z10只稳0<K<12；同K图为限定观察，给变慢/失稳与噪声滤波代价。PI须稳定且按输入类型，原P对象阶跃误差本已为零。

## 最终验收命令与证据

以下最终命令均退出0，输出在本目录：

| 命令/动作 | 结果/文件 |
|---|---|
| python minimal.py；node scripts/verify-classic06.mjs | minimal.log（初审采样指标明确标sample）；reconciliation-final.log/json；真TS对独立np.roots/scipy状态空间step：127×501响应点、601组三根，含近重根/0/48两侧/60；根误差1.3463293258020315e-8、响应误差7.240505417449583e-11、残差3.481659405224491e-13 |
| nb-cells verify classic/root-locus --require-kernel --out … | notebooks-final.log/notebooks.json；EXECUTED6Notebook/7cell，FAIL0/SKIPPED0 |
| nb-cells extract / assemble | extract-final.log/assemble-final.log；13block反向逐字全等，临时roundtrip删除 |
| 浏览器逐课全运行；finalize --merge；preserve-debts；check-python-support | browser-python.json/python-finalize.log/python-policy.log；6passed/0code；最终源hash094e2e8f0314526e5b7f4ad2ee593d6204fc17cf3ad518cdc487809bc39ea29a；全量70课/309Notebook/482cell，282可运行/27代码展示、457成功cell |
| npm run build；npm run build:pages；npx tsc --noEmit | build-final.log/pages-final.log/types-final.log；无MDX编译失败；205课/9旧路由，字节数见pages-final.log末行；仅本地构建 |
| npm run verify -- classic/root-locus | page-final.log；9项PASS、WARN0/FAIL0；HTTP200/H1=1/H2=12/KaTeX错误0，原组件规范通过 |
| node check-browser.mjs | browser-check.log/browser-results.json；12H2顺序/ID/目录，48旧ID/4别名，70公式居中auto、表列数；实际默认/恢复/重根/K0/48/60，2canvas，生产答案原始Pyodide完成，console无warn/error |
| node check-source.mjs / check-scope.mjs / check-log.mjs | source-check.log/scope-check.log/log-check.log；最终源/数值/浏览器/政策一致；69其它课记录/政策、27待办原字段/编号不变；92行原六列/三轮六组/原九项/唯一签发 |
| npm run math:check；npm run glossary:check | math-fences.log/glossary.log；140围栏无坏项，术语PASS3/WARN1/FAIL0（既有函数名WARN） |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | regression.log；14测试通过，无SKIPPED |
| node scripts/check-fix-logs.mjs | fix-index.log；fix039索引/详情、陈控检查项同步 |
| npm run check -- --fix-outline --fix-tracker-stats；npm run check；node scripts/check-semester03.mjs | check-final.log/check-delivery.log/semester-check.log；PASS21/WARN2/FAIL0，已知WARN有登记；学期清单通过 |

Q5数值函数对简单稳定根构造独立留数误差，连续求极值/误差带穿越，减半网格复核事件覆盖；尾部T处Σabs(r)exp(Re(p)T)<.005，之后单调包络不再出带。重复根不套简单留数，临界/不稳定不算调节时间。这是四个明确工况的连续指标验收，不把K粗扫当全域证明。

390px生产实测：article343=scroll343、document375=scroll375、7section无溢出，根图317×317等比例、响应317×300。opening.png/narrow.png/boundary-response.png实际查看；红当前根/灰有限轨迹、临界振荡由零初值开始，不画虚假的稳态线。默认图与读数来自同一计算，不以DOM宽度替代视觉审校。

保留失败记录：reconciliation.log初次提取4而原始6，数学0<K被轻量扫描当JSX；局部LaTeX lt/gt后六实验实跑。草稿两绝对值display曾被表格包装误包，已移除且最终真渲染70公式验收；W08未宣称修复。check-generated.log把Python ts<T误报组件T，改等价T>ts后原始新内核/Pyodide/构建全部重跑，以final日志和最终hash为准。初次browser-check在hydration前抓到空href，后等canvas实际加载/操作后重取DOM验证旧ID/目录，不弱化断言。

W06/W07/W08/W09与27全局Python待办仍开放；直接内核与Pyodide不代表原生IAB网关已修。支持报告生成器会重排PY编号，本课preserve-debts.mjs恢复原27完整对象/编号与上课解决回执，未改全局生成器。

## 合并

正文/讨论日志/台账/验收同提交；实际no-ff后回填hash和全局checklist合并格。仅合master，不推送或发布gh-pages。

实际课程提交：5b166001b3190d3cc1fc7153d9d29bc179b1543a。master 的 no-ff 合并：605c2827164fcbd5c0d9cbed0a6055a79108a9db。全局 checklist 合并格已据实勾选；合并后 npm run check 与学期清单复验输出见 check-merged.log / semester-merged.log（均退出码 0）。未推送或发布 gh-pages。
