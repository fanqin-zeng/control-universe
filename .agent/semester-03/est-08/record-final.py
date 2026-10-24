"""Sign only the final source whose native, browser and numerical gates passed."""
from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[3];d=root/'.agent/semester-03/est-08';read=lambda n:json.loads((d/n).read_text(encoding='utf8'))
commands=read('runtime-commands.json');assert len(commands)==8 and all(r['exitCode']==0 for r in commands)
source=(root/'content/estimation/estimation-case-study.mdx').read_text(encoding='utf8');sha=hashlib.sha256(source.encode()).hexdigest();validation=json.loads((d/'validation.log').read_text(encoding='utf8').strip().splitlines()[-1]);assert validation['pass'] and validation['sourceHash']==sha
assert read('pyodide.json')['lessons'][0]['sourceHash']==sha
assert len(read('multi-seed.json'))==360 and read('reconciliation.json')['configurations']==378
for file in ['build.log','pages-build.log']:
 s=(d/file).read_text(encoding='utf8');assert '(SSG)' in s and 'Failed to compile' not in s and 'MDX 编译失败' not in s
logpath=root/'docs/discuss-log/semester-03/10-estimation/08-estimation-case-study.md';prefix,audit=logpath.read_text(encoding='utf8').split('## 附录 D：',1)
for a,b in [('数字待最终原始严格内核/浏览器输出对账后填A/B。','最终原始严格内核、Pyodide与两实页输出对账完成，详见A/B。'),('最终证据后按C放行。','最终证据齐备，按C限定放行。'),('54配置与逐拍读数、两实页/375px九项待执行。','54配置/648逐拍状态与事件读数、两实页/375px九项均通过。'),('四份档案待最终证据签发','四份档案齐备，可按最终证据签发'),('当前未签发。','最终证据已齐备。')]:prefix=prefix.replace(a,b)
final='''## Phase 4: 内容定稿

[郑核] 汇总5项已落实修改：赵工1项(P0，需求节明确真值不进入估计器)、范安2项(P0，单次门限概率/相关时刻覆盖与安全保证分开；受控反例与20种子观察分开)、何疑1项(P0，保留默认融合落败与所有Q/种子)、苏绘1项(P1，逐拍状态/NIS可查与固定轴裁切说明)。数值和前端按最终源码复核，无P0阻断项。
[待定] 无。异步/持续偏置/相关噪声/多目标/硬件认证是声明之外的扩展，不冒充已完成。
[郑核-签发] 新写Phase1—4、10H2、四题全部子问、3Notebook6cell、EstimationCaseExplorer、版本化随机输入与纵向SVG完成。A.1数值、B九项与四条补充、C公平比较三道门通过；四份档案齐备。仅签发EST-08，不生产其它课。真实提交后补master回执；rank4独立副本/端口，私有索引和CAS保留并行修改。独立中文润色仍待其它模型，不发布Pages。

交付清单：正文/原始Notebook/TS数值核/PCG64输入/Explorer/SVG/唯一注册；讨论日志及A—D；catalog/台账/计划/checklist/中文润色生产状态；严格内核/Pyodide/两构建与实页/数学术语/提交快照门槛和回执。

## 附录 A：数值证据（全部实测数据的唯一留存副本）

### A.1 三方对账表（柯验）

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | prior位置0/速度1、Pdiag1/1、cross0；dt1s、12步，统计1..12 | NB1 setup输入、predicted_first_mean_P；NB2 multi_seed_steps_each12 | 默认clean/Q1/gateoff/seed7/查看1s，全部12时刻可选 | ✅ | 模型输入合同；位置m/速度m/s，cov单位逐元素声明；非实测结论 |
| 2 | 加速度q.04、G[.5,1]→Q[[.01,.02],[.02,.04]]、rank1 | NB3c1 Q_discrete_acceleration同矩阵/rank1 | TS预测同Q，首拍P一致 | ✅ | 每拍独立区间常值加速度，不是连续白噪声谱密度；1e-10 |
| 3 | 连续谱密度另取.04则Qpp=.04/3=.013333 | NB3c1 white_acceleration_spectral_Q_if_density_point04 .013333333333333332 | 不适用，组件只实现区间常值模型 | ✅ | 单位m²/s³与q的m²/s⁴不同；答案1同源；1e-10 |
| 4 | H=[1,0]，[H;HF]=[[1,0],[1,1]] rank2 | NB3c1 observability_matrix_rank矩阵及2 | 不适用，纯模型诊断 | ✅ | dt1；可观测性不保证有限噪声精度；1e-10 |
| 5 | 第一拍预测均值[1,1]，P[[2.01,1.02],[1.02,1.04]] | NB1c1 predicted_first_mean_P | 实际TS以这些预测量得到默认逐拍结果 | ✅ | 共同预测一次，Q倍率1；1e-10 |
| 6 | 默认z1 .381970/z2 .363220，等效r=.8 | NB1c1 default_first_readings [.3819700665724566,.3632203349862857]；r1=1/r2=4在setup复算后验 | UI读数基于同源输入与r1/r2，独立信息形式核对；等效r未单独展示 | ✅ | r_eq=(1+1/4)^-1=.8，解析等效与两次矩阵更新同首拍结果；1e-10 |
| 7 | 第一拍mean[.555239,.774301]，cov[.572242,.290391,.669751] | NB1c1 default_first_mean_covariance完整值 | .555239/.774301/.572242/.290391/.669751 | ✅ | 单位m、m/s、m²、m²/s、m²/s²；默认手算/答案1，1e-10/页面6位 |
| 8 | 三UI种子无门限顺逆序差3.553e-15 | NB1c2 ungated_reverse_max_difference 3.552713678800501e-15 | TS顺序固定1→2，默认/全UI与独立信息参考一致 | ✅ | seeds7/19/43，正态独立线性、未筛选；1e-10，不外推gate开启 |
| 9 | dropout第5..8秒缺sensor1/6..8缺sensor2，纯预测6/7/8 | NB1c2 dropout_prediction_only_steps [6,7,8]；setup可用性 | dropout默认纯预测拍3，各时刻事件为空 | ✅ | 不填零/旧读数；全部54×12实页；1e-10 |
| 10 | dropout第5..9秒Ppp .787697/1.487057/2.571953/4.122385/.708811 | NB1c2 dropout_position_variance_steps5to9完整值 | 非默认dropout、step5..9逐一同6位 | ✅ | seed7/Q1/gateoff，答案2同源；1e-10 |
| 11 | 门限9单次接受概率.997300 | NB3c1 normal_three_sigma_single_test_probability .9973002039367398 | gate on阈值9，未显示概率 | ✅ | er f(3/sqrt2)解析，未筛选正确标量Gaussian模型；1e-10，不是多拍保证 |
| 12 | 正常受控极端读数7、预测1/P2.01，NIS11.960133而拒收 | NB3c1 controlled_clean_extreme_reading_NIS_rejected 7/11.960132890365449/True | 不适用，单独受控例，不篡改21种子输入 | ✅ | r1=1；不是20种子中观察到的假警报，答案3；1e-10 |
| 13 | spike seed7第6秒sensor1 NIS19.265926拒收、sensor2 1.483893接受 | NB3c1 spike_step6_gate_events全值 | spike/Q1/gateon/seed7/step6实际读数同值 | ✅ | 第二NIS为拒收第一路之后的条件创新；1e-10 |
| 14 | seed7 spike门限off RMSE .871062，on .318629/拒1 | NB2c1 seed7_scenario_gate_RMSE_coverage_rejected .8710620976642758/.31862936724803964、reject1 | spike对应两设置实际同6位 | ✅ | 相同输入/先验/Q，有限12拍；1e-10，不宣称普适改善 |
| 15 | 默认clean融合RMSE .476373、单路 .374476，覆盖12/12、peakNIS2.486810 | NB1c1 default_metrics .47637297293164954/12/0/0/2.486810299853489；single .37447643814036735 | .476373/.374476、12/12、拒0/纯预测0/2.486810 | ✅ | seed7/qScale1/off，1..12s；默认融合落败；1e-10 |
| 16 | 默认末拍位置8.452623、速度.398442 | NB1c1 default_final_mean_covariance mean[8.452622667225372,.3984418539956216] | step12位置8.452623/速度.398442 | ✅ | m/m/s，末拍不冒充稳态；1e-10 |
| 17 | UI54组合；全部21种子378配置/4536拍 | NB2c1统计为0..19的360；NB3c2独立360；额外43在原始DATA与Python参考全部核验 | 54控制组合、每组12逐拍/事件，共648实页读数；实际TS378/4536 | ✅ | 模型预算数非统计指标；reference-all/actual-ts全量；1e-10 |
| 18 | 多种子0..19/3场景/3Q/.25,1,4/gate2，共360×12 | NB2c1 multi_seed_runs360 steps_each12 seeds0..19 | 不适用，UI只7/19/43 | ✅ | 原始cell rows全量→multi-seed.json；固定PCG64输入，无择种子/真值调参 |
| 19 | clean Q1 RMSE min/median/max=.334772/.629106/1.070857，门限两组持平 | NB2c2 clean off/on .33477165460679287/.6291058535740839/1.070856935759714 | 不适用，统计由Notebook | ✅ | 20种子12拍每run，1e-10/页面6位，未声称一般性无误拒 |
| 20 | dropout Q1 min/median/max=.441508/.710296/2.253077，两组持平 | NB2c2 dropout .4415078762113283/.7102957009256783/2.2530773518611187 | 不适用 | ✅ | 同20固定种子；1e-10/页面6位 |
| 21 | spike Q1 off .871062/1.300496/2.036375；on .318629/.657378/1.069586 | NB2c2 spike完整6值 | 不适用 | ✅ | 同20固定种子，全部失败/未触发均保留；1e-10/页面6位 |
| 22 | Q1门限off→on无RMSE增大；fusion对single落败clean5/dropout8/spike0 | NB2c2 gate_worse_and_fusion_worse_counts [0,5]/[0,8]/[0,0] | 默认clean就是落败反例 | ✅ | 分场景每20次同种子，不以20次观测作概率为零结论；阈值比较1e-12 |
| 23 | 独立信息形式360run最大差1.777e-14 | NB3c2 independent_information_runs_max_difference 360/1.7763568394002505e-14 | TS Joseph对Python信息378run最大差1.066e-13 | ✅ | 每拍mean/cov全元素，1e-10；仅实现一致，不验证物理模型 |
| 24 | 位置误差图固定x0..12/y±12，±2sigma来自P | Notebook原始12步mean/P/error，TS同源曲线数据 | 固定轴/animationfalse，真实54配置重绘且误差/带数据核验 | ✅ | 呈现合同与逐拍计算，数值不裁剪；sigma定义由原始P复算；1e-10 |

### A.2 实测数据总表（每行注明产出路径）

| 来源 | 量 | 实测值 |
|---|---|---|
| make-notebooks.py/lib/estimation-case-data.json/environment.json | 版本化标准正态输入及环境 | PCG64 seeds0..19/43，2初值+12×3，每case同原始数据 |
| minimal-notebooks.log/minimal-notebook-output.json | 写前最小实验 | 默认落败、缺测、离群门限、360独立信息核等全值 |
| notebook-contract/extracted/original-python.json/log/multi-seed.json | 原始setup/cells、360统计 | 3Notebook6cell，源码提取逐字，合同仅规范化CRLF，全部360结果留存 |
| reference.py/reference-all.json/reference-controls.json/actual-ts.json/reconciliation.json/log | TS独立信息形式参考 | 378配置4536拍/含single，最大差1.0658141036401503e-13，5非法输入拒绝 |
| notebooks.json/log | 严格原始内核 | EXECUTED6cell、FAIL0/SKIPPED0 |
| pyodide.json | 原始浏览器执行/hash | 三本passed/6cell，最终hash绑定 |
| browser-native/pages.json及PNG | 两真实页面 | 各54配置/648逐拍状态及观测事件，恢复/重绘/Notebook全部运行/10精确H2/375px/错误0 |
| runtime-commands.json/source-fingerprints.json/dependency-fingerprints.json | 实际运行与构建副本 | 最终8命令exit0，五资产与共享依赖绑定；提交前再对已提交HEAD核依赖 |

## 附录 B：前端交付硬门槛实际输出（秦构）

| 九项原清单 | 执行命令 / 实际输出 / 判定 |
|---|---|
| 1 npm run build 通过 | npm run build与官方npm run build:pages均exit0，SSG完成，无MDX编译失败；build.log/pages-build.log；✅ |
| 2 curl 课程页 → HTTP 200 | verify-lesson estimation/estimation-case-study，WIKI_VERIFY_PORT19684，exit0/200；普通19684与Pages19784实页200；✅ |
| 3 页面 H2 数 == catalog.ts 该课 subsections 数 | 实际DOM10=metadata10，H1=1，标题/ID逐项对renderedHeadings，重复ID0/hash目标全部存在；✅ |
| 4 katex-error 元素数 == 0 | verify与两实页均0；✅ |
| 5 MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | nb-cells verify estimation/estimation-case-study --require-kernel --port19884 exit0，EXECUTED6cell/error0/SKIPPED0；validate-final核原始setup/cells及三浏览器环境全输出，Pyodide三本passed；✅ |
| 6 新增组件已在 lib/wiki-components.ts 登记 | scoped npm run check与verify单一注册来源PASS，新增EstimationCaseExplorer两行；✅ |
| 7 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | 显式<EstimationCaseExplorer />，两实页canvas1；✅ |
| 8 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅ | x0..12/y−12..12，animationfalse/useMemo<EChartsOption>/useECharts(option)；默认首拍.555239/.774301/Ppp.572242，RMSE .476373；54配置全部648逐拍状态/事件读数、恢复/重绘通过；✅ |
| 9 notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用 | 严格S2无FAIL，全部为纯计算；✅ |

四条补充：三本实际nativeKernelIds不同且S8通过；cell首行无%#/无占位残留；display围栏独占行且math:check exit0；JSX属性无逗号且构建通过。两实页各点击三次全部运行直到独立末尾token，并对全部原始数值输出容差1e-12；375px无根溢出，SVG/Explorer截图人工查看清晰，console/pageerror0。native请求8891/8981仅测试路由到独立19884；不改共享端口/组件。

开工共享check因其它草稿/统计FAIL6，semester因RL-02表列FAIL，原样留opening日志；独立基线叠加本课后检查通过。存量catalog WARN为跨章motion-planning组合路由无冲突、既有6课正文无日志；glossary C1b零命中登记符号与C2b零命中NOISE属既有残留，不为本课改全局表。原型生成时NumPy int64序列化失败改原生计数类型；TS独立调用脚本默认JSON导出包装修正后全378配置重跑，未改变数据/模型，也未将失败原型签发。

## 附录 C：红队放行记录（何疑）

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | “融合这次反而更差” source:DEFAULT | 相同真值、prior/Q、sensor1、gate政策；基线少sensor2信息；默认seed7/Q1/clean/off未择优替换 | UI54/数值378；默认RMSE .476373对.374476，融合落败；Q1/20种子clean5/dropout8次落败 | 更多信息改善模型不确定性，不保证每条有限随机轨迹RMSE获胜；仅教学同步独立模型 | 放行 |
| 2 | “开启后约0.318629m” source:GATE | 同seed7/spike输入，门限9预先固定，无真值调参；估计器Q全部.25/1/4均保存 | 3工况×3Q×2gate×20=360；Q1 clean/dropout全持平；spike本批20次gate未增RMSE；受控正常极端读数误拒反例保留 | 不声称普适改进/故障分类/安全，选择后不套原KF精确后验与校准保证 | 放行 |
| 3 | “第9秒重新收到观测后缩小” source:DROP | 同prior/Q/noise，预定缺测日程；没填零/旧数据，也未更换种子以制造增长 | seed7/dropout第6..8秒纯预测，Ppp从.787697增至4.122385后.708811；20种子/Q全量未删 | 限本例Ppp，不声称任意模型任意矩阵元素严格单调；同步假设与未测时延明确 | 放行 |
| 4 | “正常和中断的20次运行没有门限剔除，结果持平” source:TABLE | 固定seeds0..19，Q倍率1展示，其余两倍率全部留rows，3场景同一随机输入 | 各20次min/median/max全保留；fusion落败计数5/8/0；正常极端NIS11.960133另构不伪装观测 | 20次没误拒不是概率为零；相关时刻覆盖不冒充独立试验置信保证，不泛化实车性能 | 放行 |
| 5 | “这是实现一致性检查” source:INFO | Python矩阵Joseph对独立信息更新，TS手写Joseph对信息参考；同完整输入与每步mean/P | Notebook360run max1.777e-14；TS378run max1.066e-13，单路/门限/缺测全覆盖 | 不证明物理模型、标定或真实传感器噪声假设，也不作性能优越性结论 | 放行 |

'''
for token,phrase in [('DEFAULT','融合这次反而更差'),('GATE','开启后约0.318629m'),('DROP','第9秒重新收到观测后缩小'),('TABLE','正常和中断的20次运行没有门限剔除'),('INFO','这是实现一致性检查')]:final=final.replace('source:'+token,'content/estimation/estimation-case-study.mdx:'+str(next(i for i,l in enumerate(source.splitlines(),1) if phrase in l)))
logpath.write_text(prefix+final+'## 附录 D：'+audit.replace('当前未签发。','最终Phase1—4与验收签发，真实master提交后补回执。'),encoding='utf8')
p=root/'content/catalog.ts';s=p.read_text(encoding='utf8');a=s.index('"slug": "estimation-case-study"');b=s.index('\n      }',a);p.write_text(s[:a]+s[a:b].replace('"status": "draft"','"status": "v1.3"')+s[b:],encoding='utf8')
p=root/'.agent/delivery-tracker.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| \[ \] 状态估计案例 \(estimation-case-study\).*$', '| [x] 状态估计案例 (estimation-case-study) | EST-08学期3新写；10H2/3Notebook6cell/378配置4536拍/360统计；docs/discuss-log/semester-03/10-estimation/08-estimation-case-study.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-checklist.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| EST-08 \|.*$', '| EST-08 | [x] | [x] | [x] | [x] | [x] | [ ] | docs/discuss-log/semester-03/10-estimation/08-estimation-case-study.md;.agent/semester-03/est-08/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03/zh-lang-edit/PLAN.md';s=p.read_text(encoding='utf8');s=re.sub(r'^(\| \d+ \| EST-08 \|[^\n]+?)\| 待完成 \| 待生产 \| — \|$',lambda m:m[1]+'| 已完成 | 待润色 | .agent/semester-03/est-08/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-plan.md';s=p.read_text(encoding='utf8');block='''<!-- EST-08-RECEIPT-BEGIN -->
### EST-08 学期3交付（2026-10-24）

状态估计案例从空占位按Phase1—4新写：10H2/四题全子问、3Notebook6cell、EstimationCaseExplorer/PCG64输入/SVG；二维小车共同预测/双路更新/缺测/创新门限/统计与部署边界。默认融合落败、三工况持平/改善与极端噪声误拒边界保留；378配置4536拍对独立信息形式、360多种子统计、54UI配置×12时刻全实页读数。严格内核/Pyodide/普通与官方Pages构建及实页/375px通过。rank4独立资源与私有索引保留并行修改，证据.agent/semester-03/est-08/acceptance.md；真实master回执见checklist。不发布Pages，不生产其它课。
<!-- EST-08-RECEIPT-END -->''';assert '<!-- EST-08-RECEIPT-BEGIN -->' not in s;p.write_text(s.rstrip()+'\n\n'+block+'\n',encoding='utf8')
(d/'acceptance.md').write_text(f'''# EST-08 状态估计案例：验收完成，待master回执

rank4，仅本课，空占位按Phase1—4新写并签发。10H2/四题全部子问/3Notebook6cell/Explorer/PCG64输入/SVG。LF sourceHash={sha}，五份资产与四份共享依赖的实际构建指纹归档。

| 实际命令/操作 | 退出码与结果 | 原始证据 |
|---|---|---|
| node reconcile.mjs：实际TS对Python独立信息形式 | 0；378配置/4536拍/单路与双路，最大差1.0658141036401503e-13，小于1e-10；5非法输入拒绝 | actual-ts/reference-all/reference-controls.json，reconciliation.json/log |
| 原始Notebook逐字/干净Python执行 | 0；三本六cell，360统计全量、每步Joseph对信息最大差1.7764e-14 | notebook-contract/extracted/original-python.json/log/multi-seed.json |
| nb-cells verify estimation/estimation-case-study --require-kernel --port19884 | 0；EXECUTED6cell/error0/SKIPPED0 | notebooks.json/log |
| 原始Pyodide浏览器 | 0；3本passed/6cell，最终hash绑定 | pyodide.json |
| npm run build；npm run build:pages | 各0，完整SSG，官方Pages兼容路径与元数据生成 | build.log/pages-build.log/runtime-commands.json |
| 普通19684与静态19784实页 | 各0；54配置/648逐拍状态与事件、恢复/重绘/6cell、10精确H2/锚点/375px/错误0 | browser-native/pages.json及PNG |
| verify-lesson estimation/estimation-case-study | 0；200/10H2/KaTeX0/注册通过 | verify.log |
| validate-final.mjs | 0；原始setup/cell逐字、浏览器数值输出1e-12、五资产与依赖绑定 | validation.log/source-fingerprints/dependency-fingerprints.json |
| npm run math:check；npm run glossary:check | 各0；无阻断 | math.log/glossary.log |
| 最新提交快照check/semester/python-policy/glossary/math | 提交前实际执行，退出0为硬门槛 | commit-gates.json/projection-*.log |

固定基线见baseline-commit.txt；D:/Workspace/control-universe-rank4-est08，端口19684/19784/19884/19984启动前bind确认。只关闭自身服务与内核，不碰其它会话。开工共享check/semester原样保留opening日志；其它草稿/RL-02列格式与统计债务未代修。最新HEAD叠加本课片段，私有Git索引/CAS保留默认共享暂存。存量WARN按讨论日志B登记，不冒充全工作区无修改。

默认融合RMSE .476373大于单路.374476；门限效果限给定三工况，极端正常噪声误拒反例与20种子观察分开。报告带/选择后的协方差不冒充安全或校准保证。

真实master提交与推送结果待提交后追加。独立中文润色仍待其它模型；Pages仅本地验收，未发布。
''',encoding='utf8');print('Signed final source',sha)
