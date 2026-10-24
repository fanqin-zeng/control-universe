"""Sign only the final, source-bound native/Pyodide/Pages evidence."""
from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-04'
read=lambda name:json.loads((folder/name).read_text(encoding='utf8'))
commands=read('runtime-commands.json');assert len(commands)==8 and all(r['exitCode']==0 for r in commands)
source=(root/'content/estimation/extended-kalman-filter.mdx').read_text(encoding='utf8');sha=hashlib.sha256(source.encode()).hexdigest()
validation=json.loads((folder/'validation.log').read_text(encoding='utf8').strip().splitlines()[-1]);assert validation['pass'] and validation['sourceHash']==sha
assert read('pyodide.json')['lessons'][0]['sourceHash']==sha
assert read('browser-native.json')['pass'] and read('browser-pages.json')['pass']
for name in ['build.log','pages-build.log']:
 text=(folder/name).read_text(encoding='utf8');assert 'Failed to compile' not in text and 'MDX 编译失败' not in text and '(SSG)' in text
line=lambda phrase:next(i for i,l in enumerate(source.splitlines(),1) if phrase in l)
logpath=root/'docs/discuss-log/semester-03/10-estimation/04-extended-kalman-filter.md';log=logpath.read_text(encoding='utf8');prefix,audit=log.split('## 附录 D：',1)
prefix=prefix.replace('Pages完整build:pages与最终交叉校验进行中，当前不签发。','最终sourceHash的完整build:pages、静态实页与交叉校验全部exit0，附录B记录九项及四条补充门槛。')
final=r'''## Phase 4: 内容定稿

[郑核-签发] 从空占位按新写流程完成本课。四目标、十H2、四题所有子问、两条实验路线与默认交互读数已逐项核；最终源码经严格内核、Pyodide、独立TS/积分、普通/Pages实页及构建绑定，误差小于约定容差。何疑放行附录C的限定比较，秦构九项与四条补充门槛齐全；未决事项不影响本课。中文独立润色待后续模型，不在此冒充完成。仅本课签发，EST-05不自动生产。

交付清单：10H2正文、2Notebook/4cell、ExtendedKalmanExplorer、SVG、单一组件注册、catalog/tracker/自动OUTLINE、来源与实验合同、附录A数值证据、附录B九项、附录C红队、全局checklist/计划。本轮问题在生产流程内拦截，无伪造“用户发现线上故障”的fix条目。实际master交付hash提交后另记；不发布gh-pages。

## 附录 A：数值证据（全部实测数据的唯一留存副本）

### A.1 三方对账表（柯验）

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | 位置2/3m对应平方读数4/9m² | square_readings_at_2_3 4 9 | μ2时h=4，函数实际TS核 | ✅ | NB1c1；整数计算，单位m/m² |
| 2 | h(2)=4、H=4，Hμ=8错误 | wrong_H_mu_vs_correct_h_mu 8 4 | H4.000000 | ✅ | NB1c1；解析切线4x-4；1e-12 |
| 3 | 默认创新1、S5、K.2 | default_update_R 1.0…(4,4,1,5,.2,2.2,.05) | K.200000，实际API同时核S/ν | ✅ | NB1c1/真实TS；gain单位m⁻¹，1e-12 |
| 4 | 默认EKF均值2.2、方差.05 | 同上 | 2.200000/.050000 | ✅ | NB1c1；状态m、方差m² |
| 5 | R4→S8/K.125/2.125/.125 | default_update_R 4.0…(4,4,1,8,.125,2.125,.125) | 默认R1不适用；切R4实际控件同值 | ✅ | NB1c1、72控件；1e-12 |
| 6 | 过程f=x+.1x²，F1.4 | prediction_F_EKF_mean_variance 1.4… | 不适用，组件为一拍观测 | ✅ | NB1c2；真实TS nonlinearPrediction也核，1e-12 |
| 7 | EKF预测2.4/.53 | 2.4/.5299999999999999 | 不适用，非预测组件 | ✅ | NB1c2，Q=.04/P=.25，1e-12 |
| 8 | 真实预测矩2.425/.53125 | exact2.425/.5312499999999999；GH2.4250000000000003/.5312500000000001 | 不适用 | ✅ | NB1c2；24点GH/中心矩独立核，1e-12 |
| 9 | 舍弃均值.025、方差.00125 | discarded_mean_variance .025/.0012500000000000002 | 不适用 | ✅ | NB1c2；α=.1，1e-12 |
| 10 | 默认参考后验2.169615/.045869 | square 2…2.1696151946932116/.04586943906531715 | 2.169615/.045869 | ✅ | NB2c1；TS积分/quad差<1e-9、显示6位舍入 |
| 11 | 负分支主要移向负侧 | square -2→EKF-2.2、参考-2.1696151947，方差同默认 | 默认正侧；μ-2实际控件核同值 | ✅ | NB2c1/完整controls；相同P/R/z，1e-9 |
| 12 | μ0/P1/R.25/z4→H0/K0/均值0/P1 | square 0…EKF0/1 | 默认不适用；该组合实际0/1 | ✅ | NB2c1；1e-12；不是无信息证明 |
| 13 | 零点后验均值0、方差3.841876 | 0/3.841876221594493 | 同组合0.000000/3.841876 | ✅ | NB2c1；双峰密度实图，1e-9 |
| 14 | 线性观测退化为KF，分布持平 | linear 2→2.6/.2，两种算法一致 | 线性模式2.600000/.200000 | ✅ | NB2c1；模型单位独立，1e-12 |
| 15 | 雷达(3,4)距离5，角.927295218 | radar_measurement_Jacobian [5,.927295218] | 不适用，组件为标量 | ✅ | NB2c2；TS实际radarJacobian、解析/中心差分；1e-9 |
| 16 | H=[[.6,.8],[-.16,.12]] | 同上；有限差分最大9.376888154832841e-11 | 不适用 | ✅ | NB2c2；差分步1e-6m，阈值1e-9 |
| 17 | 原点雷达雅可比未定义 | radar(0,0) is None断言通过 | 不适用 | ✅ | NB2c2；TS返回null，不把除零填0 |
| 18 | -358°≈-6.248279rad，主值2°≈.034907rad | -6.2482787221397/.034906585039886445/-358/1.9999999999999918 | 不适用 | ✅ | NB2c2；atan2对模运算、π端点方向等价，1e-12 |
| 19 | 72配置、积分±12/4800段、显示±6/241点、y0..8 | 不适用：静态Notebook用无穷区间自适应积分 | 实际TS72组/17352节点，最大密度3.528759251274051 | — | 计算预算由源码与真实TS验证；reference.py为独立口径，不能伪装Notebook也跑Simpson |

### A.2 实测数据总表（何仿出数，每行注明产出路径）

何仿未上场，由林矩提供实验，柯验独立仲裁；原始输出位于下列版本化文件，不从旧缓存拼接。

| 来源 | 量 | 实测值 |
|---|---|---|
| reconcile.mjs/actual-ts.json/reference.py/json | 全配置矩/密度、辅助预测/雷达/角度 | 72配置/17352点，最大差1.5631940186722204e-13；72全量参考controls保留 |
| NB1c1/c2，extracted.json/notebooks.json/original-python.json | 一拍更新、R变化、非线性预测与GH矩 | 完整输出原样保留；题1/2所有数值见A.1 |
| NB2c1/c2，同上 | 线性/正/负/零点后验、雷达及角度 | 四个工况全保留；题3/4数值见A.1 |
| notebooks.json/log | 严格内核执行 | EXECUTED，2Notebook/4cell，error0/SKIPPED0 |
| pyodide.json/log | 页面原始setup/cell与sourceHash | 2Notebook4cell全部passed，最终hash在validation.log |
| browser-native.json/browser-pages.json及截图 | 真实页面、72控件、运行输出 | 两页各10H2/4cell/72控件+恢复+重绘，375px与console/pageerror0 |
| source-fingerprints.json、runtime-commands.json、scope-commands.json | 最终源指纹与命令退出码 | 四个课程资产与构建副本相同；最终8运行命令均0 |

## 附录 B：前端交付硬门槛实际输出（秦构）

运行命令实际退出码在runtime-commands.json；原始内核/数值命令另见各log。正常与静态构建固定baseline-commit.txt叠加本课，提交前再按最新master生成限定投影核全局门槛。

| 九项原清单 | 执行命令 / 实际输出 / 判定 |
|---|---|
| 1 npm run build 通过 | 正常npm run build与完整npm run build:pages各exit0，SSG完成，无Failed to compile/MDX编译失败；build.log/pages-build.log；✅ |
| 2 curl 课程页 → HTTP 200 | verify-lesson HTTP200，native18564/Pages18664实际响应200；verify.log/browser JSON；✅ |
| 3 页面 H2 数 == catalog.ts 该课 subsections 数 | 实际DOM10=metadata10/H1=1，标题文本与全级ID逐项对renderedHeadings、侧栏目标均存在、重复ID0；✅ |
| 4 katex-error 元素数 == 0 | verify及两种实际DOM均0；✅ |
| 5 MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | nb-cells verify estimation/extended-kalman-filter --require-kernel --port19364 exit0，EXECUTED/4cell/error0/SKIPPED0；validate-final对原始求值后setup/cell逐字比对，2Notebook均passed；✅ |
| 6 新增组件已在 lib/wiki-components.ts 登记 | npm run check/verify单一来源注册结构PASS；仅新增ExtendedKalmanExplorer；✅ |
| 7 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | MDX显式<ExtendedKalmanExplorer />，实页canvas1；✅ |
| 8 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅ | x[-6,6]/y[0,8]固定，animation:false/useMemo<EChartsOption>/useECharts(option)，真实TS72配置/17352点；默认2.2/.05及参考2.169615/.045869；72组合真实选择、恢复默认、图像重绘通过；✅ |
| 9 notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用 | 严格S2无FAIL，Notebook只做纯计算/静态图；✅ |

四条补充硬门槛：①两个nativeKernelIds实测不同，S8结构通过；②所有cell首行无%#、无拼接占位符；③math:check exit0、所有display围栏独占行；④JSX属性无逗号分隔、构建语法通过。实际页面四cell均点击“全部运行”，不是只看HTTP200。375px根scrollWidth=375，SVG和曲线/控件截图人工可读，两页pageerror与console error均0。原生浏览器请求路由8891/8981到独立19364，记录在browser JSON，未改共享Jupyter组件/API/服务。Pages使用完整官方build:pages，既有9兼容入口由既有脚本生成，未发布。

首次±8积分误差2.34e-8未过1e-9，扩大区间后通过，不放宽阈值；首次内核刚启动时严格失败并保留notebooks-first-startup.log，后续必须EXECUTED且无SKIPPED。稳定性条件信息集符号在最终审校简化为无条件期望递推，原始四cell补打印开篇4/9，最终hash全部重跑；旧证据只保留为before-review，不冒充最终通过。开工共享check/semester受其它课草稿与RL-02行格式影响，失败如实留opening日志；不改其它课程，用限定投影另验。

## 附录 C：红队放行记录（何疑）

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | “它们接近但不相同”“均值相同不等于分布相同” source:POSTERIOR_LINE | 同一先验/观测/噪声，Bayes后验由概率模型唯一确定，无控制器整定；TS积分±12/4800段对无穷自适应quad，按1e-9约定核精度，不按优胜挑参 | 72配置全保存，平方μ2与μ-2、μ0三个工况；再加线性完全持平2.6/.2。零点均值0持平，EKF报告方差1而参考3.841876；默认近似2.2/.05对参考2.169615/.045869 | 同一维教学后验，未排名EKF/UKF，积分计算代价和维度限制已写；缺方向信息不能靠小R突破 | 放行 |
| 2 | “同组参数的真实均值为2.425…方差为0.53125” source:MOMENT_LINE | 高斯中心矩恒等式给精确矩，24点GH独立积分校验；无超参整定或性能选择 | 本组限定算例与符号恒等式；没有用一个样例宣称普适算法优胜，按限定观察放行 | f(E X)非E f(X)，本模型曲率项误差明确，不外推到任意噪声或系统；Q独立且固定 | 放行 |

'''
final=final.replace('source:POSTERIOR_LINE','content/estimation/extended-kalman-filter.mdx:'+str(line('默认平方测量下，参考后验'))).replace('source:MOMENT_LINE','content/estimation/extended-kalman-filter.mdx:'+str(line('同组参数的真实均值为')))
logpath.write_text(prefix+final+'## 附录 D：'+audit,encoding='utf8')
p=root/'content/catalog.ts';s=p.read_text(encoding='utf8');start=s.index('"slug": "extended-kalman-filter"');end=s.index('\n      },',start);s=s[:start]+s[start:end].replace('"status": "draft"','"status": "v1.3"')+s[end:];p.write_text(s,encoding='utf8')
p=root/'.agent/delivery-tracker.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| \[ \] 扩展卡尔曼滤波 \(extended-kalman-filter\).*$', '| [x] 扩展卡尔曼滤波 (extended-kalman-filter) | EST-04学期3新写；10H2/2Notebook4cell/72配置；docs/discuss-log/semester-03/10-estimation/04-extended-kalman-filter.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-checklist.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| EST-04 \|.*$', '| EST-04 | [x] | [x] | [x] | [x] | [x] | [ ] | docs/discuss-log/semester-03/10-estimation/04-extended-kalman-filter.md;.agent/semester-03/est-04/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03/zh-lang-edit/PLAN.md';s=p.read_text(encoding='utf8');s=re.sub(r'^(\| \d+ \| EST-04 \|[^\n]+?)\| 待完成 \| 待生产 \| — \|$',lambda m:m[1]+'| 已完成 | 待润色 | .agent/semester-03/est-04/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-plan.md';s=p.read_text(encoding='utf8');block='''<!-- EST-04-RECEIPT-BEGIN -->
### EST-04 学期3交付（2026-10-24）

扩展卡尔曼滤波从空占位按新写Phase1—4完成，十H2、四题所有子问、2Notebook4cell、后验Explorer及SVG。非线性函数与误差Jacobian分工、Joseph近似含义、平方测量零点/正负歧义、雷达角度与稳定性条件清楚；72组真实TS/17352曲线点对无穷自适应积分，含线性持平与双峰失败例。严格内核、Pyodide、普通与完整build:pages实页/375px均通过，最终源码指纹绑定。rank4独立副本/端口/私有索引保留其它课程与暂存，证据.agent/semester-03/est-04/acceptance.md；真实master回执见全局checklist，不发布Pages、不生产EST-05。
<!-- EST-04-RECEIPT-END -->''';assert '<!-- EST-04-RECEIPT-BEGIN -->' not in s;p.write_text(s.rstrip()+'\n\n'+block+'\n',encoding='utf8')
initial=(folder/'acceptance.md').read_text(encoding='utf8');initial=initial.replace('进行中','验收完成，待master回执',1).replace('计划10H2','完成10H2').replace('当前只完成Phase1，数字先待最小算例实跑','Phase1—4已完成并签发，数字以最终原始实验为准').replace('拟用Next18564','Next18564')
table=f'''

最终正文{len(source.splitlines())}行；LF规范化sourceHash={sha}。四个课程资产指纹与实际构建副本相同，见source-fingerprints.json。

| 实际命令/操作 | 退出码及结果 | 证据 |
|---|---|---|
| reconcile.mjs真实TS对独立积分/精度形式/几何/模运算 | 0；72配置17352点，最大差1.5631940186722204e-13，容差1e-9 | reconciliation.json/log、reference.py/json、actual-ts.json |
| nb-cells verify --require-kernel --port19364 | 0；2Notebook4cell，EXECUTED/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 原始Pyodide完整执行 | 0；2Notebook4cell全部passed，最终sourceHash一致 | pyodide.json/log |
| 正常npm run build与完整npm run build:pages | 各0；无MDX编译失败 | build.log/pages-build.log/runtime-commands.json |
| verify-lesson estimation/extended-kalman-filter | 0；HTTP200/H1=1/H2=10/KaTeX0，九项PASS无FAIL | verify.log |
| 正常/静态真实页面 | 各0；4cell、72控件+恢复+重绘、375px、图片和精确锚点、console/pageerror0 | browser-native/pages.json及截图 |
| validate-final.mjs | 0；最终源码/原始cell/独立数值/两页/构建副本指纹交叉一致 | validation.log/source-fingerprints.json |
| math:check/glossary:check | 各0；适用术语/符号门槛通过，WARN另留日志 | math.log/glossary.log |
| catalog/semester/Python限定快照 | 各0（初次生成刷新可exit1，后续只读check必须0） | scope-commands.json、check/semester-check/python-policy.log |

普通和静态完整构建基线为6ebdfe534e647b416e230f9182803d5e895e2074叠加本课，最终提交前另按最新master重建限定快照再跑权威check/semester/python。共享工作区开工检查受其它课草稿/行格式影响而失败，保留opening日志，不冒充已通过；不改其它课程。首次积分尾部与启动时机失败留原始日志；最终审校把稳定性示例改为期望递推并补打印4/9，最终hash相关验收全部重跑，before-review只作历史记录。

真实master提交与推送结果待提交后追加；不发布gh-pages。
'''
(folder/'acceptance.md').write_text(initial+table,encoding='utf8');print('Signed final source',sha,'; master receipt remains unchecked')
