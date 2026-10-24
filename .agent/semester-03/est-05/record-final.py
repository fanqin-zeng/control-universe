"""Sign EST-05 only after final source-bound checks; never prefill a commit hash."""
from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-05'
read=lambda n:json.loads((folder/n).read_text(encoding='utf8'))
commands=read('runtime-commands.json');assert len(commands)==8 and all(r['exitCode']==0 for r in commands)
source=(root/'content/estimation/unscented-kalman-filter.mdx').read_text(encoding='utf8');sha=hashlib.sha256(source.encode()).hexdigest()
validation=json.loads((folder/'validation.log').read_text(encoding='utf8').strip().splitlines()[-1]);assert validation['pass'] and validation['sourceHash']==sha
assert read('pyodide.json')['lessons'][0]['sourceHash']==sha
assert read('browser-native.json')['pass'] and read('browser-pages.json')['pass']
for name in ['build.log','pages-build.log']:
    text=(folder/name).read_text(encoding='utf8');assert 'Failed to compile' not in text and 'MDX 编译失败' not in text and '(SSG)' in text
line=lambda phrase:next(i for i,l in enumerate(source.splitlines(),1) if phrase in l)
logpath=root/'docs/discuss-log/semester-03/10-estimation/05-unscented-kalman-filter.md'
prefix,audit=logpath.read_text(encoding='utf8').split('## 附录 D：',1)
prefix=prefix.replace('真实TS与独立解析矩/自适应积分、全控件与严格内核尚待执行。当前不得签发。','实际TS72组合17352密度节点、独立解析矩/积分、严格内核与Pyodide全部通过；最终源码hash一致，详见附录A。').replace('待全72组合证据后填写C。','72组合均核验，限定比较按附录C放行。').replace('构建、两种实页与原始cell均须实跑，当前九项未全部完成。','普通与完整build:pages、两种实际页面与全部原始cell均实跑通过，九项及四条补充门槛见附录B。').replace('档案附录A/B/C待最终实测填充。','档案附录A/B/C已用最终实测填充。')
final=r'''## Phase 4: 内容定稿

[郑核-签发] 从空占位按新写流程完成四目标、十H2、四题全部子问、两Notebook四cell、UKF Explorer及SVG。教授/工程/验证/体验/支持/学生六组意见已落地；柯验对账、何疑限定比较、秦构九项与四条补充门槛均通过。最终正文hash绑定严格内核、Pyodide、真实TS/独立数学、普通/静态实页与构建副本，不以旧课成绩代替本期验收。独立中文润色仍待后续模型。

只签发EST-05，不生产EST-06。rank4独立副本与端口；私有Git索引提交，保留其它会话草稿和暂存。真实提交后补master回执；不发布gh-pages。

## 附录 A：数值证据（全部实测数据的唯一留存副本）

### A.1 三方对账表（柯验）

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | mu2/P.25→平方均值4.25，直接平方4 | NB1c1 square_values [4,6.25,2.25] /mean4.25 | 预测读数4.250000 | ✅ | m/m²/m⁴单位在正文；高斯解析式独立复核，1e-12 |
| 2 | 三节点[2,2.5,1.5]；Wm[0,.5,.5]，Wc[2,.5,.5] | sigma_points_weights；input_mean_variance2/.25 | 真实TS transformed节点/权重同值 | ✅ | NB1c1，TS实际函数；非随机粒子，1e-12 |
| 3 | 平方P_hh4.125/C1，中心贡献.125 | square_values_mean_variance_cross；central_variance_contribution | C/S通过实际TS核，页面预测读数4.25 | ✅ | NB1c1及NB2c2解析高斯矩；状态m，观测m² |
| 4 | 默认S5.125/K8/41/创新.75 | NB2c1 case_update zh_S_C_K_innovation | K0.195122；实际API完整S/创新同值 | ✅ | mu2/P.25/R1/z5；代数1e-12，显示6位 |
| 5 | 默认88/41≈2.146341，9/164≈.054878 | UKF2.1463414634146343/.0548780487804878 | UKF2.146341/.054878 | ✅ | NB2c1；m/m²，精确分数来自同一更新 |
| 6 | R4→S8.125/K8/65、136/65/33/260 | UKF2.0923076923076924/.12692307692307692 | 默认不适用；R4真实选择同值 | ✅ | NB2c1、全控件reference-controls，1e-12 |
| 7 | f=x+.1x²/Q.04→预测2.425/.53125 | NB1c2 prediction_UT_GH 两种方法同值 | 不适用，一拍观测组件；实际TS UT预测另核 | ✅ | Gaussian中心矩/GH24点独立积分；1e-12 |
| 8 | 加Q→Pm.29/S1.29/C.29/K与P+29/129；漏Q得.2 | Q_included_predicted_S_C_K_P .29/1.29/.29/.22480620155038758/.22480620155038758 wrong_gain.2 | 不适用，非递推组件 | ✅ | NB1c2；线性KF精确退化；1e-12 |
| 9 | 默认EKF2.2/.05，参考2.169615/.045869 | NB2c1同模型case_update | EKF2.200000/.050000；参考2.169615/.045869 | ✅ | TS复用已交付EKF/参考模块，对独立quad再核1e-9 |
| 10 | 均值绝对误差UKF.023274/EKF.030385；方差.009009/.004131 | absolute_errors .023273731278577348/.030384805306788554/.009008609715170646/.0041305609346828365 | 当前默认均值/方差给同一误差计算 | ✅ | NB2c1；UKF在方差指标落败，非全面优胜 |
| 11 | 负mu分支镜像 | mu-2→UKF-2.1463414634、EKF-2.2、参考-2.1696151947，各方差同正侧 | 默认不适用，mu-2实际控件通过 | ✅ | NB2c1；同一P/R/z，1e-9 |
| 12 | 线性均值2.6/方差.2持平 | linear2 case三种同值 | 线性模式2.600000/.200000/参考同值 | ✅ | NB2c1，解析Gaussian conditioning；1e-12 |
| 13 | mu0/P1/R.25/z4→预测1/S2.25/C0/K0/后验0、1 | NB2c1 零点case | 对应实际控件0/1 | ✅ | 本课默认非零；全72真实控件含本例；1e-12 |
| 14 | 零点参考均值0、方差3.841876 | reference0/3.841876221594493 | 同工况0.000000/3.841876，双峰密度实图 | ✅ | NB2c1；积分1e-9，不把均值持平当分布相同 |
| 15 | 三次变换UT均值0/方差1，EKF0，真实15 | NB1c1 cube_UT_EKF_true_variance1/0/15；NB2c2 GH15.000000000000005 | 不适用，组件仅线性/平方 | ✅ | GH24点独立六阶矩；1e-12；无量纲 |
| 16 | alpha.001→Wm[-999999,500000,500000]；Wc0-999996.000001 | small_alpha_weights全量同值 | 不适用，组件固定alpha1 | ✅ | NB1c1/实际TS小alpha；权重绝非概率 |
| 17 | 二维P[[1,.6],[.6,1]]、L[[1,0],[.6,.8]]；误用行得[[1.36,.48],[.48,.64]] | lower_L/correct_columns/wrong_rows | 不适用，组件是标量 | ✅ | NB1c2矩阵乘法校验1e-12 |
| 18 | 二维乘积轴向点输出0/UT方差0，真实1 | NB2c2 2D_product_sigma_outputs_UT_true_variance | 不适用 | ✅ | 独立标准高斯二阶矩乘积=1；不是任意二次函数协方差精确 |
| 19 | 全72配置/241显示点、积分±12/4800段、固定图x±6/y0..8 | 不适用：原始Notebook用无穷自适应quad，不伪装同预算 | 真实TS72/17352节点，最大密度3.528759251274051 | — | 计算合同/源码/实际TS核；三条密度对独立积分/解析式最大差1.5631940186722204e-13，小于1e-9 |

### A.2 实测数据总表（每行注明产出路径）

何仿未上场，林矩提交确定性实验，柯验用不同数学方法独立仲裁。

| 来源 | 量 | 实测值 |
|---|---|---|
| minimal-experiment.json | 写正文前最小变换/更新 | 主例/R4/正负/零点先实跑；非最终hash验收替代物 |
| actual-ts.json、reconcile.mjs、reference.py/json、reference-controls.json | 新UKF实际导出函数与旧EKF/积分依赖，对独立Gaussian矩/precision/quad/GH | 72组合17352节点；最大差1.5631940186722204e-13；6类无效输入拒绝 |
| extracted.json、original-python.json、execute-original.py | 页面原始setup/cell | 2Notebook4cell，每个原始打印值完整留存 |
| notebooks.json/log | 严格原生内核 | EXECUTED，4cell/error0/SKIPPED0 |
| pyodide.json/log、validation.log | 最终源码浏览器执行 | 2Notebook4cell全部passed，sourceHash与正文相同 |
| browser-native/pages.json及PNG | 两种真实页面 | 各10H2、72控件、恢复/重绘、原始4cell全部运行、375px无横溢出；console/pageerror0 |
| source-fingerprints.json、runtime-commands.json | 最终四资产与构建副本指纹、8个实际命令 | 指纹相同，八命令全部exit0 |

## 附录 B：前端交付硬门槛实际输出（秦构）

| 九项原清单 | 执行命令 / 实际输出 / 判定 |
|---|---|
| 1 npm run build 通过 | npm run build与官方npm run build:pages各exit0，SSG完成且无MDX编译失败，build.log/pages-build.log；✅ |
| 2 curl 课程页 → HTTP 200 | verify-lesson exit0/HTTP200，普通18584与Pages18684实页response200；verify.log及browser JSON；✅ |
| 3 页面 H2 数 == catalog.ts 该课 subsections 数 | 实际DOM10=metadata10、H1=1，H2文本/全级ID与renderedHeadings逐项全等、侧栏目标存在、重复ID0；✅ |
| 4 katex-error 元素数 == 0 | verify及两实页均0；✅ |
| 5 MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | nb-cells verify estimation/unscented-kalman-filter --require-kernel --port19384 exit0、EXECUTED4cell/error0/SKIPPED0；validate-final逐字核原始求值setup/cell，Pyodide全部passed；✅ |
| 6 新增组件已在 lib/wiki-components.ts 登记 | check单一注册来源PASS，仅新增UnscentedKalmanExplorer；✅ |
| 7 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | MDX显式<UnscentedKalmanExplorer />，两实页canvas1；✅ |
| 8 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅ | x[-6,6]/y[0,8]固定，animation:false/useMemo<EChartsOption>/useECharts(option)，真实TS72组合对独立参考；默认UKF2.146341/.054878，72真实选择/恢复/重绘均通过；✅ |
| 9 notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用 | 严格S2无FAIL，纯计算/静态输出；✅ |

四条补充：①两个nativeKernelIds不同，结构S8通过；②cell首行无%#、无拼接占位；③所有display围栏独占行、math:check exit0；④JSX属性无逗号分隔、构建通过。正常/静态两页均实际点击两次“全部运行”直到四cell末尾独立token；并非仅HTTP200。375px根scrollWidth375、SVG加载/曲线控件截图人工检查，pageerror/console0。原生请求测试路由8891/8981到隔离19384，未改共享Jupyter组件/API/端口。Pages为本机完整build:pages与本机静态实页，不代表发布。

开工共享check因其他课程草稿FAIL、semester因RL-02列格式FAIL，原样留opening日志，不改其它课；固定已提交基线叠加本课后check/semester/python策略全部exit0。Notebook初版JSON属性未被旧解析器识别，Phase2改既有模板字面量再抽取/执行，不以空cell为通过。首次全站术语检查发现本课新符号chi未登记，已仅在04-notation登记本课sigma点行，保留glossary-before-review.log；顺序例外漏列ML/ID前课，补登记后再验，保留semester-check-before-review.log。窄屏人工审图发现横向SVG文字过小，改纵向排列；图表轴标题移出图例后两构建/实页全重跑。Windows脚本一次默认GBK读UTF-8失败，显式UTF-8后完成metadata/审计脚本更新，不影响最终源码实测。

## 附录 C：红队放行记录（何疑）

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | “UKF的均值绝对误差较小，方差绝对误差却较大” source:COMPARE | 相同先验/测量/噪声，固定alpha1/beta2/kappa0；EKF一阶模型无待整定自由度；Bayes模型唯一，无挑选参考。全72组合/17352点均对解析矩与无穷quad，容差1e-9 | 默认及负分支、零点、线性；UKF默认方差落败，线性完全持平，零点共同失败。两误差指标都报告，非只选获胜指标 | 一维确定性教学观察，无普适排名；参考积分是额外教学预算，不能归入UKF/EKF性能；Gaussian近似丢多峰 | 放行 |
| 2 | “UT均值0、方差1，而真实方差…15” source:CUBE | 相同标准Gaussian输入，不变换真值、无调参。真实六阶矩由GH24点复核，EKF零点导数解析0 | 一维平方矩精确/三次方差漏失/二维乘积方差0对1；这是明示限定反例，不把样本例子外推算法普适顺序 | 均值阶数与协方差阶数区分，2n+1函数调用+矩阵分解代价、负权与约束均写明 | 放行 |
| 3 | “UT预测给均值2.425、方差0.53125，此处与真实高斯输入矩一致” source:PRED | 同一f/先验/Q，Gaussian解析矩与24点GH为唯一参考，无控制器整定 | 单组限定恒等式，不作时间序列胜负或统计显著性；校正另保留落败与失败 | 只证明该预测的两矩，不宣称重新高斯化后的完整后验精确 | 放行 |

'''
for token,phrase in [('COMPARE','这组参数下，UKF'),('CUBE','有限节点不保证高阶矩'),('PRED','例如$f(x)=x+0.1x^2$')]:
    final=final.replace('source:'+token,'content/estimation/unscented-kalman-filter.mdx:'+str(line(phrase)))
logpath.write_text(prefix+final+'## 附录 D：'+audit.replace('当前仅Phase1，不签发。','Phase1—4与最终源码验收均完成；真实master回执提交后登记。'),encoding='utf8')
p=root/'content/catalog.ts';s=p.read_text(encoding='utf8');a=s.index('"slug": "unscented-kalman-filter"');b=s.index('\n      },',a);s=s[:a]+s[a:b].replace('"status": "draft"','"status": "v1.3"')+s[b:];p.write_text(s,encoding='utf8')
p=root/'.agent/delivery-tracker.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| \[ \] 无迹卡尔曼滤波 \(unscented-kalman-filter\).*$', '| [x] 无迹卡尔曼滤波 (unscented-kalman-filter) | EST-05学期3新写；10H2/2Notebook4cell/72配置；docs/discuss-log/semester-03/10-estimation/05-unscented-kalman-filter.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-checklist.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| EST-05 \|.*$', '| EST-05 | [x] | [x] | [x] | [x] | [x] | [ ] | docs/discuss-log/semester-03/10-estimation/05-unscented-kalman-filter.md;.agent/semester-03/est-05/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03/zh-lang-edit/PLAN.md';s=p.read_text(encoding='utf8');s=re.sub(r'^(\| \d+ \| EST-05 \|[^\n]+?)\| 待完成 \| 待生产 \| — \|$',lambda m:m[1]+'| 已完成 | 待润色 | .agent/semester-03/est-05/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-plan.md';s=p.read_text(encoding='utf8');block='''<!-- EST-05-RECEIPT-BEGIN -->
### EST-05 学期3交付（2026-10-24）

无迹卡尔曼滤波从空占位按新写Phase1—4完成：10H2/四题全部子问、2Notebook4cell、UnscentedKalmanExplorer、sigma点SVG。两套权重、Cholesky列方向、预测后重取点含Q、交叉协方差与Gaussian近似边界清楚；保留默认方差落败、线性持平、零点双峰失败、三次/二维乘积反例。72组真实TS/17352点对独立解析矩与无穷quad最大差1.563194e-13；严格内核、Pyodide、普通/完整build:pages两实页及375px通过。rank4独立副本/端口/私有索引保留并行修改，证据.agent/semester-03/est-05/acceptance.md；真实master回执见checklist。不发布Pages、不生产EST-06。
<!-- EST-05-RECEIPT-END -->''';assert '<!-- EST-05-RECEIPT-BEGIN -->' not in s;p.write_text(s.rstrip()+'\n\n'+block+'\n',encoding='utf8')
baseline=(folder/'baseline-commit.txt').read_text().strip()
initial=(folder/'acceptance.md').read_text(encoding='utf8').replace('进行中','验收完成，待master回执',1).replace('计划10H2','完成10H2').replace('当前Phase1，未签发。','Phase1—4已签发，所有数值以最终原始输出为准。')
table=f'''

最终正文{len(source.splitlines())}行；LF sourceHash={sha}。四个课程资产指纹与构建副本一致，见source-fingerprints.json。

| 实际命令/操作 | 退出码与结果 | 原始证据 |
|---|---|---|
| reconcile.mjs，实际导出TS/独立Gaussian矩、precision、quad、GH | 0；72配置17352点，最大差1.5631940186722204e-13，阈值1e-9 | reconciliation.json/log、reference.py/json、actual-ts.json |
| nb-cells verify --require-kernel --port19384 | 0；EXECUTED/2Notebook4cell/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 原始setup/cell Pyodide完整执行 | 0；两Notebook均passed/4cell，最终sourceHash一致 | pyodide.json/log |
| npm run build与官方npm run build:pages | 各0，SSG完成，无MDX编译失败 | build.log/pages-build.log/runtime-commands.json |
| verify-lesson estimation/unscented-kalman-filter | 0；HTTP200/H1=1/H2=10/KaTeX0 | verify.log |
| 普通/静态真实页面原始cell与交互 | 各0；4cell/72控件+恢复+重绘/375px/精确标题锚点/图片/console及pageerror0 | browser-native/pages.json及截图 |
| validate-final.mjs | 0；最终源码/原始cell/数值/两页与构建副本指纹交叉相同 | validation.log/source-fingerprints.json |
| math:check/glossary:check | 各0，WARN原样保留 | math.log/glossary.log |
| 限定投影catalog/semester/Python策略 | 各0；首次生成刷新允许exit1，后续只读check必须0 | scope-commands.json、check/semester-check/python-policy.log |

完整构建使用已提交基线{baseline}叠加本课，提交前另按最新master重新生成限定快照，跑权威npm run check/semester/python策略。共享开工check/semester失败保留opening日志，不改其它课草稿，不把全站旧课WARN说成本课独占成果。原始数据全部版本化，未用本机临时logs替代唯一交付证据。

真实master提交与推送结果待提交后追加；不发布gh-pages。
'''
(folder/'acceptance.md').write_text(initial+table,encoding='utf8');print('Signed final source',sha,'; master receipt unchecked')
