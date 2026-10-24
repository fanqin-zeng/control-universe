"""Sign EST-07 only after the final original source passes actual runtime gates."""
from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-07';read=lambda n:json.loads((folder/n).read_text(encoding='utf8'))
commands=read('runtime-commands.json');assert len(commands)==8 and all(r['exitCode']==0 for r in commands)
source=(root/'content/estimation/sensor-fusion.mdx').read_text(encoding='utf8');sha=hashlib.sha256(source.encode()).hexdigest();validation=json.loads((folder/'validation.log').read_text(encoding='utf8').strip().splitlines()[-1]);assert validation['pass'] and validation['sourceHash']==sha
assert read('pyodide.json')['lessons'][0]['sourceHash']==sha
for name in ['build.log','pages-build.log']:
 text=(folder/name).read_text(encoding='utf8');assert 'Failed to compile' not in text and 'MDX 编译失败' not in text and '(SSG)' in text
logpath=root/'docs/discuss-log/semester-03/10-estimation/07-sensor-fusion.md';prefix,audit=logpath.read_text(encoding='utf8').split('## 附录 D：',1)
for a,b in [('原始严格内核、Pyodide、两实页和构建仍待执行，不签发。','最终严格内核、Pyodide、两实页与两构建已通过，详见附录A/B。'),('数值待最终内核验证后填A/B','最终原始内核/浏览器与独立对账完成，详见A/B'),('最终证据齐后填C。','最终证据齐备，限定比较按C放行。'),('两页64组合、精确锚点/图片/375px等九项待验。','两页64组合、精确锚点/图片/375px等九项均通过。'),('四份档案仍待最终签发。','四份档案齐备，可按最终证据签发。')]:prefix=prefix.replace(a,b)
final='''## Phase 4: 内容定稿

[郑核] 汇总6项修改：李稳1项(P1，开头区分原始噪声与局部后验误差独立)、钱锐1项(P0，错误模型曲线/MSE与单次残差分开)、林矩1项(P0，冻结仿射模型与重新线性化边界)、苏绘1项(P1，固定同轴与纵向SVG)、秦构2项(P0，WASM奇异矩阵显式正定检查、catalog小节对象)。全部落地并按最终源码重测，无P0阻断项。
[待定] 无。本课声明之外的多目标关联、一般矩阵CI优化和工程安全保证不纳入完成范围。
[郑核-签发] 新写Phase1—4、十H2、四题全部子问、3Notebook6cell、SensorFusionExplorer及纵向SVG完成。三道门A.1/B/C均通过，四份档案齐备；只有本课签发，不生产EST-08。rank4独立副本/端口，私有Git索引与CAS保留并行工作。真实提交后补master回执；独立中文润色仍待其它模型。

交付清单：正文/数值核/Explorer/SVG/单一注册；讨论日志A—D；catalog/台账/计划/checklist/中文润色生产状态；原始内核、Pyodide、独立矩阵对账、普通与Pages本地构建及实页、证据归档。

## 附录 A：数值证据（全部实测数据的唯一留存副本）

### A.1 三方对账表（柯验）

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | 默认先验0/P4，r1=1/r2=4、z1=2/z2=3、rho0 | NB1c1 pair实际参数及same_model行 | 控件4/4/0/2/3 | ✅ | 输入合同；m/m²，先验独立于完整噪声向量 |
| 2 | 独立信息式P=2/3、m=11/6 | NB1c1 rho0 1.8333333333333335/.6666666666666666 | 1.833333/.666667，MSE.666667 | ✅ | Python矩阵solve/Joseph对TS精度闭式，1e-12；不是实际读数误差排行 |
| 3 | 单路1为1.6/.8，单路2为1.5/2 | NB1c1 single_sensor1/2 | 单路1 1.600000/.800000；单路2不展示 | ✅ | 静态单路2在原始cell；1e-12，答案1同值 |
| 4 | rho.5→c1，白化H0/reading1/noise3 | NB1c2 rho_half_conditional_H_reading_noise 0 1 3 | 非默认rho.5，真实TS secondH/reading/noise同值 | ✅ | 正定条件式逐项复核；1e-12 |
| 5 | rho.5正确1.6/.8，无新增状态信息 | NB1c1 rho.5及NB1c2白化 | rho.5控件完整模型1.600000/.800000 | ✅ | 非默认读数64组合实页包含；1e-12 |
| 6 | rho.5错误独立仍11/6、2/3，实际MSE8/9 | NB1c1 rho.5 actual_naive .888888888888889 | 1.833333/.666667/.888889 | ✅ | 解析先验总体MSE；1e-12；不把单次残差当MSE |
| 7 | 64组联合/白化正逆序差约2.887e-15 | NB1c2 count64/max2.886579864025407e-15 | 实际TS64组合最大差同数量级；两页顺逆读数一致 | ✅ | P0[1,4]r2[1,4]rho[-.5,0,.5,.9]z1[0,2]z2[2,3]；阈值1e-12 |
| 8 | rho绝对值1使二阶噪声奇异，本课拒绝 | NB1c2 singular_R_rejected，显式主子式检查 | 真实TS rho±1/奇异R拒绝；UI不提供端点 | ✅ | 不把WASM分解是否抛错作为正定证明；秩约简另论 |
| 9 | rho-.5错误模型实际MSE4/9 | NB1c1 .4444444444444444 | 非默认-.5读数.444444 | ✅ | 相同输入/真实R，1e-12；自报方差不变 |
| 10 | rho.9正确P约.477987、第二权重−.503145 | NB1c1 .4779874213836478，K2−.5031446540880498 | 非默认.9读数同6位 | ✅ | 已知完整相关噪声可差分降噪，非单调趋势；1e-12 |
| 11 | 错误模型rho.5权重1/6、2/3、1/6与MSE四项合8/9 | NB1c1 naive K与actual，prior weight=1−sumK | TS priorWeight错误模型按Pn/P0，正文算式一致 | ✅ | 答案2展开4/36+4/9+4/36+2/9，代数核1e-12 |
| 12 | 两局部后验1.6/.8、1.5/2共享cross .4 | NB2c1 shared_prior_local_cross .4 | 不适用，主Explorer为原始观测模型 | ✅ | 共同prior4，cross=(.8/4)(2/4)4；1e-12 |
| 13 | 后验错误相加11/7、4/7，实际36/49 | NB2c1 1.5714285714285714/.5714285714285714/.7346938775510203 | 不适用 | ✅ | NB2纯计算；1e-12，答案3全子问 |
| 14 | 已知共享prior扣重恢复11/6、2/3 | NB2c1 subtract_known_prior 1.8333333333333333/.6666666666666666 | 不适用 | ✅ | 仅精确共享prior、条件独立似然、无其它重叠；1e-12 |
| 15 | 重复同一1.6/.8，错误报.4，实际仍.8 | NB2c1 duplicate_same_estimate 1.6 .4 .8 | 不适用 | ✅ | 完全相同信息，非两份独立样本；1e-12 |
| 16 | CI omega.5为11/7、8/7 | NB2c2 CI .5→1.5714285714285714/1.1428571428571428 | 实际TS CI同值，主Explorer不展示 | ✅ | 输入协方差有效上界/无偏；1e-12 |
| 17 | CI5权重×21合法cross共105上界通过 | NB2c2 CI_bound_cases 105 max_violation0 | 实际TS105组合maxViolation0 | ✅ | 含误差相关±1端点，解析Cauchy界独立复核1e-12 |
| 18 | 标量CI最优omega1回到1.6/.8，重复CI任意权重不变 | NB2c2 scalar_variance_objective_best_P_omega(.8,1)，5重复检查 | 实际TS端点与5重复输入同值 | ✅ | 101点扫描并有单调精度解析；不保证协方差改善，1e-12 |
| 19 | 坐标offset10/local−8→world2 | NB3c1 coordinate_offset_local_world 10 −8 2 | 不适用 | ✅ | 已知确定平移；单位m，1e-12 |
| 20 | 错坐标−8/3、正确16/9，均P4/9 | NB3c1 frame_wrong_correct −2.666666666666666/1.7777777777777777，各.4444444444444445 | 不适用 | ✅ | 另设同prior0/4与两路R1，不沿用r2=4；1e-12 |
| 21 | 延迟.5s、速度2m/s，旧1→当前2 | NB3c1 time_delay_velocity_old_aligned .5 2 1 2 | 不适用 | ✅ | 确定补偿，未伪造运动不确定性；1e-12 |
| 22 | 未对时4/3、对时16/9，均P4/9 | NB3c1 time_wrong_correct 1.3333333333333333/1.7777777777777777，各.4444444444444445 | 不适用 | ✅ | 给定读数例，无隐藏真值，无准确率排名；1e-12 |
| 23 | 非线性prior2/.25，z3/5，h=x/x²，Rdiag1，冻结预测2/4与H1/4 | NB3c2原始输入与condition调用 | 不适用 | ✅ | 第一维m/m²，第二维m²/m⁴；不是同精度，合同独立 |
| 24 | 冻结EKF47/21、1/21 | NB3c2 nonlinear_same_point_batch 2.238095238095238/.04761904761904761 | 不适用 | ✅ | 固定仿射模型，与精确非线性Bayes不同；1e-12 |
| 25 | 先更新2.2/.2，重新线性化h4.84/H4.4，最终2.228900/.041051 | NB3c2 first_linear2.2/.20000000000000004，relinearized2.2288998357963874/.04105090311986864 | 不适用 | ✅ | 同原始cell中h/H计算；答案4；1e-12/页面6位 |
| 26 | 固定图x[−4,6]、y[0,2]，尾部不归一 | NB无此预算断言；独立NumPy241节点密度核对 | 实际TS64×241×3密度最大差1.4433e-15，真实canvas固定轴 | — | 呈现合同，不冒充Notebook后验尾部积分；坐标源和reconciliation可查 |

### A.2 实测数据总表（每行注明产出路径）

| 来源 | 量 | 实测值 |
|---|---|---|
| minimal-notebooks.log/minimal-notebook-output.json | 写前小实验及本课修正后输出 | 三本六cell全值留存 |
| actual-ts.json/reconciliation.json/log/reference.py/reference-controls.json/reference-density.json | 实际TS对独立Kalman矩阵/Joseph/NumPy密度 | 64组合，矩最大差2.88658e-15，密度1.44329e-15，CI105合法cross，8非法输入 |
| notebook-contract.json/extracted.json/original-python.json/log | 原始求值后的setup/cells | 3本6cell逐字检查，合同副本仅规范化CRLF；原始源码/提取串未放宽 |
| notebooks.json/log | 严格内核实际执行 | EXECUTED，6cell，FAIL0/SKIPPED0 |
| pyodide.json | 浏览器原始代码与源码hash | 全三本passed/6cell，最终sourceHash绑定 |
| browser-native/pages.json及PNG | 普通/静态实页 | 各64控件、恢复默认/重绘/三本全部运行、10精确H2及锚点、375px、错误0 |
| runtime-commands.json/source-fingerprints.json/dependency-fingerprints.json | 8条实际命令及源/共享依赖指纹 | 最终8条exit0，四份资产与独立副本相同 |

## 附录 B：前端交付硬门槛实际输出（秦构）

| 九项原清单 | 执行命令 / 实际输出 / 判定 |
|---|---|
| 1 npm run build 通过 | npm run build与官方npm run build:pages均exit0；SSG完成，无MDX编译失败；build.log/pages-build.log；✅ |
| 2 curl 课程页 → HTTP 200 | node scripts/verify-lesson.mjs estimation/sensor-fusion，WIKI_VERIFY_PORT19674，exit0/200；普通19674与Pages19774实页200；✅ |
| 3 页面 H2 数 == catalog.ts 该课 subsections 数 | 实际DOM10=metadata10，H1=1；标题/ID逐项对renderedHeadings，重复ID0/所有hash目标存在；✅ |
| 4 katex-error 元素数 == 0 | verify及两实页katexErrors0；✅ |
| 5 MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | node scripts/nb-cells.mjs verify estimation/sensor-fusion --require-kernel --port19874 exit0/EXECUTED/6cell/FAIL0/SKIPPED0；validate-final核原始setup/cell逐字与全输出1e-12；Pyodide3本passed；✅ |
| 6 新增组件已在 lib/wiki-components.ts 登记 | scoped npm run check与verify单一来源PASS，仅新增SensorFusionExplorer两行；✅ |
| 7 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | 显式<SensorFusionExplorer />；两实页canvas1；✅ |
| 8 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅ | x[−4,6]/y[0,2]固定，animation:false，useMemo<EChartsOption>/useECharts(option)；默认1.833333/.666667；64真实组合/恢复/重绘通过；✅ |
| 9 notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用 | 严格S2无FAIL；全为纯计算输出；✅ |

四条补充：三本nativeKernelIds实际不同且S8过；代码首行无%#/无占位符；display围栏独占行且math:check exit0；JSX属性无逗号且构建通过。两实页点击三次全部运行直到各末尾token，全数值输出与原始Python比较1e-12；375px根无溢出，SVG及组件截图人工复核；console/pageerror0。原生API请求路由8891/8981至独立19874，仅测试代理，无共享组件变更。普通与完整Pages构建均本地验收，不代表发布。

首次Pyodide奇异R负例失败保留pyodide-before-pd-guard.json；显式二阶主子式检查后全部重跑。首次catalog小节类型构建失败保留build-before-catalog-fix.log；按SubsectionMeta修正后两构建与实页重跑。开发期发现并拦截，未将失败版本签发，不虚构线上事故。共享开工check/semester受其它草稿影响失败，opening日志原样保留；只在固定提交基线叠加本课的独立副本验收，不代修其它课程。

## 附录 C：红队放行记录（何疑）

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | “独立融合的后验方差小于这两个单传感器结果” source:INDEP | 同prior0/4和z2/3，r1=1/r2=4/rho0；精确Gaussian联合、单路同先验，无调参 | 全64控制组合；默认P2/3优于.8/2，但无真值，不比较单次实际误差 | 仅条件独立模型；方差改善不保证每次读数更准确 | 放行 |
| 2 | “它只提供噪声信息，没有新增状态信息” source:CORR | 同输入仅rho.5；完整R vs错误独立R；analyticMSE使用相同真实联合噪声和先验 | 64组含rho0持平、rho.5第二路无收益；错误MSE8/9大于报告2/3；rho-.5保守、rho.9有负权重的反例均保留 | 已知相关才有完整Gaussian后验；相关性非单调损害，未知偏置不保证 | 放行 |
| 3 | “错误公式报告方差0.4，实际误差方差仍是0.8” source:DUP | 同一局部估计复制，完全共享信息；shared-prior错误合并/精确扣重仅用对应合同 | 重复估计失败；shared-prior错误4/7对实际36/49；无额外观测、不择优 | 精确扣重要求已知重叠与独立似然；不处理一般历史重叠 | 放行 |
| 4 | “CI不保证比单路协方差更小” source:CI | 相同1.6/.8、1.5/2，CI权重5点、局部cross21点合法全范围，另101点标量目标扫描 | 105全边界通过，omega.5报8/7高于最佳单路.8；最优omega1退回单路，重复CI不改善 | 无偏+有效上界是前提，保守代价明确，不优于已知相关最优融合/不修未知偏置 | 放行 |
| 5 | “两者不同，因为后者改变了近似模型” source:EKF | 同prior2/.25、h=x/x²、z3/5、Rdiag1；共同点冻结与先线性更新后重线性化 | NB3两方案输出全留；坐标/时间错对均同样报告P4/9失败反例 | 不用精确非线性后验作基准，不排名准确性；不确定补偿不套确定R | 放行 |

'''
for token,phrase in [('INDEP','独立融合的后验方差小于这两个单传感器结果'),('CORR','它只提供噪声信息，没有新增状态信息'),('DUP','错误公式报告方差0.4'),('CI','CI不保证比单路协方差更小'),('EKF','两者不同，因为后者改变了近似模型')]:final=final.replace('source:'+token,'content/estimation/sensor-fusion.mdx:'+str(next(i for i,l in enumerate(source.splitlines(),1) if phrase in l)))
logpath.write_text(prefix+final+'## 附录 D：'+audit.replace('当前不签发。','最终Phase1—4验收后签发，实际master回执提交后登记。'),encoding='utf8')
p=root/'content/catalog.ts';s=p.read_text(encoding='utf8');a=s.index('"slug": "sensor-fusion"');b=s.index('\n      },',a);p.write_text(s[:a]+s[a:b].replace('"status": "draft"','"status": "v1.3"')+s[b:],encoding='utf8')
p=root/'.agent/delivery-tracker.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| \[ \] 多传感器融合 \(sensor-fusion\).*$', '| [x] 多传感器融合 (sensor-fusion) | EST-07学期3新写；10H2/3Notebook6cell/64配置/CI105边界；docs/discuss-log/semester-03/10-estimation/07-sensor-fusion.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-checklist.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| EST-07 \|.*$', '| EST-07 | [x] | [x] | [x] | [x] | [x] | [ ] | docs/discuss-log/semester-03/10-estimation/07-sensor-fusion.md;.agent/semester-03/est-07/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03/zh-lang-edit/PLAN.md';s=p.read_text(encoding='utf8');s=re.sub(r'^(\| \d+ \| EST-07 \|[^\n]+?)\| 待完成 \| 待生产 \| — \|$',lambda m:m[1]+'| 已完成 | 待润色 | .agent/semester-03/est-07/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-plan.md';s=p.read_text(encoding='utf8');block='''<!-- EST-07-RECEIPT-BEGIN -->
### EST-07 学期3交付（2026-10-24）

多传感器融合从空占位按Phase1—4新写完成：10H2、四题及全部子问、3Notebook6cell、SensorFusionExplorer与纵向SVG。独立信息相加、相关噪声白化、共享先验/重复数据、未知相关CI与时间/坐标/非线性线性化边界；64配置对独立矩阵/Joseph与密度，CI105边界保留失败与持平。严格内核、Pyodide、两构建/实页/375px均通过。rank4独立副本/端口/私有索引保留并行修改，证据.agent/semester-03/est-07/acceptance.md；实际master回执见checklist。未发布Pages，不生产EST-08。
<!-- EST-07-RECEIPT-END -->''';assert '<!-- EST-07-RECEIPT-BEGIN -->' not in s;p.write_text(s.rstrip()+'\n\n'+block+'\n',encoding='utf8')
text=f'''# EST-07 多传感器融合：验收完成，待master回执

用户指定EST-07，rank4；空占位新写，Phase1—4已签发，仅本课。正文{len(source.splitlines())}行/10H2/4题及全部子问/3Notebook6cell/Explorer/SVG。LF sourceHash={sha}，四资产和共享依赖指纹见source-fingerprints.json/dependency-fingerprints.json。

| 实际命令/操作 | 退出码与结果 | 原始证据 |
|---|---|---|
| node reconcile.mjs：实际TS对独立Kalman solve/Joseph/NumPy密度 | 0；64配置，矩2.887e-15、密度1.444e-15，小于1e-12；CI105边界/8非法输入通过 | reconciliation.json/log、actual-ts/reference-controls/reference-density.json |
| 原始setup/cell逐字及Python执行 | 0；3本6cell；共同prior/白化/CI/时间坐标/EKF | notebook-contract/extracted/original-python.json/log |
| nb-cells verify estimation/sensor-fusion --require-kernel --port19874 | 0；EXECUTED/6cell/error0/SKIPPED0 | notebooks.json/log |
| 原始Pyodide浏览器运行 | 0；全3本passed/6cell，hash绑定 | pyodide.json |
| npm run build；npm run build:pages | 各0；完整SSG，Pages兼容路径/nojekyll元数据生成 | build.log/pages-build.log/runtime-commands.json |
| 普通19674与静态19774实页 | 各0；64控件/恢复/重绘/6cell/10精确H2/锚点/375px/错误0 | browser-native/pages.json及PNG |
| verify-lesson estimation/sensor-fusion | 0；200/H1=1/H2=10/KaTeX0/注册通过 | verify.log |
| validate-final.mjs | 0；原始逐字/三环境全输出/最终hash/四资产与共享依赖一致 | validation.log/source-fingerprints.json |
| npm run math:check；npm run glossary:check | 各0；无阻断 | math.log/glossary.log |
| 最终提交快照npm run check/semester/python-policy/glossary/math | 提交前实际执行并记录，退出0为硬闸门 | commit-gates.json/projection-*.log |

固定基线见baseline-commit.txt。独立目录D:/Workspace/control-universe-rank4-est07，端口19674/19774/19874/19974；只关闭本课拥有资源，不碰其它会话服务。开工共享检查失败原样留opening日志；受其它草稿/统计影响，未代修。最终按最新已提交HEAD叠加本课片段，私有索引/CAS提交，默认共享索引保持原样。

首次Pyodide奇异R检查的后端舍入差异已显式正定guard修复；首次catalog小节类型错误已修复。失败报告分别pyodide-before-pd-guard.json/build-before-catalog-fix.log，最终源码全部相关验收重跑通过。已登记存量WARN见projection-check.log/glossary日志；其它课程债务不计为本课故障。

真实master提交与推送结果待提交后追加。独立中文润色待其它模型；Pages仅本地验收，未发布。
'''
(folder/'acceptance.md').write_text(text,encoding='utf8');print('Signed final source',sha)
