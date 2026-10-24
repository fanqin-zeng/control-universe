"""Write acceptance only after final source/runtime evidence exists."""
from pathlib import Path
import json,re,hashlib,shutil
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-03';runtime=Path('D:/Workspace/control-universe-rank4-est03')
read=lambda name:json.loads((folder/name).read_text(encoding='utf8'))
commands=read('runtime-commands.json');assert len(commands)==8 and all(r['exitCode']==0 for r in commands),commands
assert read('browser-native.json')['pass'] and read('browser-pages.json')['pass']
source=(root/'content/estimation/kalman-filter.mdx').read_text(encoding='utf8');sha=hashlib.sha256(source.encode()).hexdigest()
assert read('pyodide.json')['lessons'][0]['sourceHash']==sha
for f in ['build.log','pages-build.log']:
 text=(folder/f).read_text(encoding='utf8');assert 'Failed to compile' not in text and 'MDX 编译失败' not in text and '(SSG)' in text
logpath=root/'docs/discuss-log/semester-03/10-estimation/03-kalman-filter.md';log=logpath.read_text(encoding='utf8');prefix,audit=log.split('## 附录 D：',1)
prefix=prefix.replace('[秦构] 构建/真实DOM/Pages尚在验收，九项实际结果后填，当前不签发。','[秦构] 最终生产与Pages构建、真实DOM、原始六cell、十五控件及375px全部通过，结果已记附录B。')
final=r'''## Phase 4: 内容定稿

[郑核-签发] 数学条件、十题所有子问与原12H2去向已核；柯验独立对账全部通过，何疑两类比较均有匹配持平工况，秦构九项及四条补充门槛均有实际证据。正文、Notebook、组件与最终sourceHash绑定，未继承旧v1.3作为本轮完成。仅本课签发，中文独立润色待后续模型，下一课EST-04不自动生产。

交付清单：12H2正文、3Notebook/6cell、KalmanNoiseExplorer、SVG、单一注册表、catalog/tracker/自动OUTLINE、来源/纠错矩阵、数值/原始内核/Pyodide/真实页面/构建证据、fix-079与本期checklist。真实提交后补master回执；不发布gh-pages。

## 附录 A：数值证据（全部实测数据的唯一留存副本）

### A.1 三方对账表（柯验）

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | 20/23°C、先验4/测量1→K=.8/22.4/.8 | one_update_K_mean_variance .8 22.4 .8 | 不适用，组件演示连续模型 | 是 | NB3c1，°C/°C²，1e-12 |
| 2 | 连续默认a=-1/q=r=1，p=k=sqrt2-1 | .414213562373095 | .414214/.414214/.414214 | 是 | NB1c1/NB3c1，组件6位舍入 |
| 3 | 默认误差极点-sqrt2 | -1.414213562373095 | -1.414214 | 是 | NB1c1；1e-10，显示舍入 |
| 4 | 双积分器P=[[sqrt3,1],[1,sqrt3]] | [[1.732050808,1],[1,1.732050808]] | 不适用，组件标量 | 是 | NB1c1，ARE残差3.69e-15 |
| 5 | 双积分器K=[sqrt3,1]与极点 | [1.732050808,1]，-.866025404±.5j | 不适用，组件标量 | 是 | NB1c1，ζ=sqrt3/2、ωn=1由极点模得到 |
| 6 | 单位权重LQR K=[1,sqrt3]，四极点重复 | unit_LQG_K_poles | 不适用 | 是 | NB1c1，块三角矩阵 |
| 7 | 假设q=.01/1/100,r=1真实方差 | .4975309713/.4142135624/4.1244415296 | 全15控件实际点击；默认.414214 | 是 | NB3c1，fixed真q=r=1；reference-controls/browser JSON |
| 8 | p(t)解析均方曲线101点×15配置 | scalar稳态由NB核，瞬态由独立ODE核 | 1515真实TS点最大差5.35e-13 | 是 | reference.py DOP853 rtol1e-13/max_step.01；t0..5 |
| 9 | q→0，a=-1时k→0、a=1时k→2 | scalar_limit_stable_unstable 0 2 | 不适用，组件q>0 | 是 | NB3c1；临界a=0为0极点单独说明 |
| 10 | 模拟dt=.005/T=10/2001点 | simulation_grid 2001 0 10 .005 | 不适用，组件解析均方 | 是 | NB2c1，0..4五种子，无排名推断 |
| 11 | 题1 p=.645751、极点-2.645751 | scalar -2/3/1行，.645751311/-2.645751311 | 不适用 | 是 | NB1c1，1e-10；正文6位舍入 |
| 12 | 题2 P=.671963/- .274233/.336955 | .671963340/- .274232635/.336954500 | 不适用 | 是 | NB1c2，quartic独立核，1e-9 |
| 13 | 题2极点-1.835982±.608957j | -1.835981670±.608957054j | 不适用 | 是 | NB1c2/独立多项式；原舍入可接受 |
| 14 | 题2 L=[8,4]→-5,-6 | placed [-6,-5] | 不适用 | 是 | NB1c2，特征多项式s²+11s+30 |
| 15 | 题2两种方差迹1.008918/5.469697 | 1.0089178405/5.4696969697 | 不适用 | 是 | NB1c2/Kronecker独立核，同Q=I/R=1 |
| 16 | 题2附加工况0.1I与持平噪声 | .1406021725/5.2378787879；18/18 | 不适用 | 是 | NB1c2；Q_tie=[[56,50],[50,92]]，P=[[8,4],[4,10]] |
| 17 | 题4半正定解及零极点 | q=r=1时diag(1,0)，[-1,0]，ARE残差0 | 不适用 | 是 | NB1c2；一般q/r符号推导逐项审校 |
| 18 | 题6 P对角sqrt2-1/sqrt6-2、极点 | .414213562/.449489743；-1.414213562/-2.449489743 | 不适用 | 是 | NB1c1，非对角初始P条件已说明 |
| 19 | 题7 R=1/900，Qd=[[1/16,1/8],[1/8,1/4]] | exercise7_Qd_Rd | 不适用 | 是 | NB3c2；dt1s、σa=.5、零均值随机精度 |
| 20 | 题7先验/后验/增益与单位圆极点 | Pi[[.096931852,.156559065],[.156559065,.279784797]]；K[.988667100,1.596841421]；极点[-.020041670,-.565466851] | 不适用 | 是 | NB3c2；reference迭代28步，Joseph/DARE残差<1e-10，后验见原始完整输出 |
| 21 | 题10 K=[3.162278,2.706392]与四极点 | [-1.353195784±1.153749899j,-.866025404±.5j] | 不适用 | 是 | NB1c2；np.poly块矩阵对两多项式乘积，1e-10 |

### A.2 实测数据总表（何仿出数，每行注明产出路径）

何仿沉默，由林矩准备实验，柯验独立仲裁；原始文件是证据唯一副本，此处只索引，不另抄输出伪装独立证明。

| 实测 | 产出路径 |
|---|---|
| 原始setup/六cell及真实内核完整输出 | .agent/semester-03/est-03/extracted.json、notebooks.json/log、original-python.json/log |
| 独立TS与参考求解器/消元/迭代 | actual-ts.json、reference.py/json、reference-controls.json、reconcile.mjs、reconciliation.json/log |
| 原始Pyodide源hash/3Notebook/6cell | pyodide.json/log、browser-audit.cjs |
| 正常与Pages实页全部输出与15控制读数 | browser-native.json、browser-pages.json、audit-page.cjs、各视口截图 |
| 最终命令及退出码 | runtime-commands.json、各log，最终投影见commit-gates.json |

## 附录 B：前端交付硬门槛实际输出（秦构）

以下最终命令均exit0，runtime-commands.json记录实际调用。生产与Pages用独立副本固定bae122d叠加本课；最终提交前再以最新master重投影核全局门槛，不把共享进行中草稿算作通过。

| 原九项（原编号） | 命令 / 实际输出 / 判定 |
|---|---|
| 1 npm run build 通过 | 正常build.log及Pages pages-build.log exit0，SSG全部生成，无Failed to compile/MDX编译失败；✅ |
| 2 curl 课程页 → HTTP 200 | verify.log HTTP200；native18544/Pages18644真实响应200，旧URL原生308、静态兼容200；✅ |
| 3 页面 H2 数 == catalog.ts 该课 subsections 数 | DOM12=metadata12，H1=1；逐标题/ID与renderedHeadings完全一致，锚点存在、重复ID0；✅ |
| 4 katex-error 元素数 == 0 | verify与两种真实DOM均0；✅ |
| 5 MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | nb-cells verify estimation/kalman-filter --require-kernel --port19214：3Notebook/6cell，EXECUTED/error0/SKIPPED0；validate-final逐字比原始setup/cell；✅ |
| 6 新增组件已在 lib/wiki-components.ts 登记 | check/verify单一来源结构PASS；只注册KalmanNoiseExplorer；✅ |
| 7 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | MDX显式<KalmanNoiseExplorer />，实际canvas1；✅ |
| 8 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅ | x0..5/y0..10固定、animation:false、useMemo<EChartsOption>、useECharts(option)，默认.414214三读数；真实TS15配置/1515点，15控件+恢复+截图曲线重绘；最终图例top0、gridtop60；✅ |
| 9 notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用 | 严格S2无FAIL；三个旧实验目的保留、调参迁React；✅ |

补充四条：①同页三个nativeKernelIds实际各不相同，nb S8通过；②六cell首行无%#、无拼接占位符；③npm run math:check exit0，display围栏独占行；④构建成功且JSX属性无逗号分隔。375px根scrollWidth=375，SVG加载与字可读、canvas控件可操作，两页console/pageerror均0。正常页面请求通过浏览器路由把8891/8981转到独立19214，不改共享API或网关服务；该隔离路由已记录，不冒称直接连默认网关。

首次问题保留：first-port-conflict.log显示18214占用，保留原进程改18544；browser-first-policy.log记录脚本未等三内核ready就数按钮的失败，已改为显式等待。构建策略在最终hash/Pyodide记录合入后重建。第一次ODE步长误差保留reconciliation-first-ivp.log，未放宽阈值。开工共享check有其它课未登记导致FAIL，不用它冒充本课全局通过。

## 附录 C：红队放行记录（何疑）

| 正文对比断言 | 基线是否独立整定 | 工况数及落败/持平 | 适用边界与代价 | 放行? | 证据 |
|---|---|---|---|---|---|
| 连续标量匹配与假设失配风险 | 真实q=r=1/a=-1固定，最优常增益由解析求导得到，不用测试风险选参 | q假设.01/1/100，1为完全持平；完整15配置均检验 | 只限指定模型及稳定常增益；未知真实噪声需辨识，标称方差不能代替实际 | 是 | NB3c1、reference/actual-ts、15控件、曲线解析/ODE |
| 题2Kalman与指定极点观测器 | 基线L=[8,4]由-5,-6唯一求解，无额外预算；每组双方同Q/R，Kalman解同组ARE | .1I/I/[[56,50],[50,92]]三组；末组L一致、trace18持平，明确为代数构造 | 固定系统和稳态二阶误差，未宣称任意工程系统的速度/鲁棒性排名；五seed仅演示 | 是 | NB1c2、quartic/Kronecker独立对账、原始内核/页面输出 |

'''
logpath.write_text(prefix+final+'## 附录 D：'+audit,encoding='utf8')
p=root/'.agent/semester-03-checklist.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| EST-03 \|.*$', '| EST-03 | [x] | [x] | [x] | [x] | [x] | [ ] | docs/discuss-log/semester-03/10-estimation/03-kalman-filter.md;.agent/semester-03/est-03/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03/zh-lang-edit/PLAN.md';s=p.read_text(encoding='utf8');s=re.sub(r'^(\| \d+ \| EST-03 \|[^\n]+?)\| 待完成 \| 待生产 \| — \|$',lambda m:m[1]+'| 已完成 | 待润色 | .agent/semester-03/est-03/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
accept=(folder/'acceptance.md').read_text(encoding='utf8');accept=accept.replace('# EST-03 卡尔曼滤波：进行中','# EST-03 卡尔曼滤波：验收完成，待master回执').replace('拟用Next18544','Next18544').replace('Phase1已形成，尚未签发','Phase1—4已完成并签发')
accept=accept.replace('测试、三方数值、浏览器与真实提交回执待后续实际执行补记。',f'''最终正文{len(source.splitlines())}行、12H2、3Notebook6cell、1Explorer、1SVG、原10题全部子问。sourceHash（LF）={sha}。

| 命令/操作 | 实测退出码及结果 | 证据 |
|---|---|---|
| reconcile.mjs真实TS对独立数值 | 0；15配置1515点，最大差5.346834086594754e-13，容差1e-10 | reconciliation.json/log、reference.py/json |
| nb-cells verify --require-kernel --port19214 | 0；EXECUTED/6cell/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| Pyodide原始实验 | 0；3Notebook6cell、最终sourceHash一致 | pyodide.json/log |
| 正常与Pages npm run build | 各0；无MDX编译失败 | build.log/pages-build.log/runtime-commands.json |
| verify-lesson estimation/kalman-filter | 0；HTTP200/12H2/KaTeX0，PASS9/WARN0/FAIL0 | verify.log |
| native18544与Pages18644真实页面 | 各0；六cell/15控件+恢复/重绘/375px/旧URL/图片/锚点/浏览器错误0 | browser-native/pages.json及截图 |
| validate-final.mjs | 0；最终源hash/原始cell/严格内核/数值/两页面交叉一致 | validation.log |
| math:check/glossary:check | 各0；中文与符号WARN按日志记录 | math.log/glossary.log |

最终普通与静态构建为bae122d38cad76d02da19513aa3aace7a9908710叠加本课，仅私有副本运行。最新master提交前另以CAS父提交重建元数据投影、跑catalog/semester/python门槛，记录commit-gates.json。共享check开工FAIL属于并行草稿，不作已通过证据。端口18214冲突保留原进程改18544，脚本初始化等待与第一次ODE失败均留日志。fix079归因既有规则执行不足；2/10原极点舍入复算可接受，未虚报错误。

真实master提交与推送结果待提交后追加；不发布gh-pages。''')
(folder/'acceptance.md').write_text(accept,encoding='utf8')
print('Final evidence validated and Phase4 signed; master receipt remains unchecked')
