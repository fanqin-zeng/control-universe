"""Sign source-bound EST-06 evidence only after actual native, Pyodide and page execution."""
from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-06'
read=lambda n:json.loads((folder/n).read_text(encoding='utf8'))
commands=read('runtime-commands.json');assert len(commands)==8 and all(r['exitCode']==0 for r in commands)
source=(root/'content/estimation/particle-filter.mdx').read_text(encoding='utf8');sha=hashlib.sha256(source.encode()).hexdigest()
validation=json.loads((folder/'validation.log').read_text(encoding='utf8').strip().splitlines()[-1]);assert validation['pass'] and validation['sourceHash']==sha
assert read('pyodide.json')['lessons'][0]['sourceHash']==sha
assert read('browser-native.json')['pass'] and read('browser-pages.json')['pass']
assert len(read('monte-carlo.json'))==90 and len(read('sequential.json')['runs'])==30
assert read('independent-sequential.json')['maxDifference']<1e-6
for name in ['build.log','pages-build.log']:
    text=(folder/name).read_text(encoding='utf8');assert 'Failed to compile' not in text and 'MDX 编译失败' not in text and '(SSG)' in text
line=lambda phrase:next(i for i,l in enumerate(source.splitlines(),1) if phrase in l)
logpath=root/'docs/discuss-log/semester-03/10-estimation/06-particle-filter.md'
prefix,audit=logpath.read_text(encoding='utf8').split('## 附录 D：',1)
prefix=prefix.replace('原始严格内核、Pyodide、两实页和构建仍待执行，不签发。','最终源码的严格内核、Pyodide、普通/静态实页与两构建均实跑通过，详见A/B；签发前无数值阻塞。').replace('最终证据齐后填C。','最终114组合及120随机运行证据齐，限定比较按附录C放行。').replace('两页114组合、精确锚点/图片/375px等九项待验。','两页114组合、精确锚点/图片/375px等九项已实测通过，详见B。').replace('数值待最终内核验证后填A/B','全部数值已在最终原始cell/独立数学与TS核验，A/B已填').replace('四份档案仍待最终签发。','四份档案已齐备，Phase4按证据签发。')
final=r'''## Phase 4: 内容定稿

[郑核-签发] 从空占位按新写流程完成四目标、十H2、四题全部子问、3Notebook6cell、ParticleFilterExplorer与纵向SVG。六组审校已落地，柯验全部对账、何疑限定比较与秦构九项及四条补充门槛通过。最终源码hash绑定严格内核、Pyodide、独立概率/矩阵计算、114控件与普通/Pages实页；不以旧v1.3或旧缓存代替本期验收。四点手算与高斯先验严格分开，ESS提升/祖先丢失/随机失峰的边界写明。

只签发EST-06，不生产EST-07。rank4独立副本与端口，私有Git索引与CAS保留共享暂存和并行课程。真实提交后补master回执；不发布gh-pages。独立中文润色待其它模型，不在此冒充完成。

## 附录 A：数值证据（全部实测数据的唯一留存副本）

### A.1 三方对账表（柯验）

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | 离散四点[-2,-1,1,2]等先验、z4/R1，外残差0/内3，a=e^-4.5 | NB1c1 particles及likelihood_ratio .011108996538242306 | 默认mode discrete/4粒子 | ✅ | x单位m，z为m²、R为m⁴；真实离散有限支持，非Gaussian四点样本 |
| 2 | 权重[.494506529,.005493471,.005493471,.494506529] | four_particles_weights完整值 | 实际TS weights同值，控件默认统计基于这些权重 | ✅ | NB1c1/normalize实际TS；对SciPy logsumexp，权重1e-12 |
| 3 | 均值0/负分支.5/方差(4+a)/(1+a)=3.967039172 | four_particle_mean_variance_ESS mean0/negative.5/variance3.9670391721082203 | 0.000000/3.967039/负.500000，参考同值 | ✅ | NB1c1；精确离散Bayes加权有限和；m/m² |
| 4 | 默认ESS2(1+a)^2/(1+a²)=2.044430503 | ess2.0444305029932996 | 2.044431 | ✅ | NB1c1/c2；默认代数1e-12，N1024全范围ESS容差1e-9 |
| 5 | 四个阈值CDF [.494506529,.5,.505493471,1] | NB1c1 four_particle_CDF_at_minus2_minus1_plus1_plus2 | 实际TS weightedCurve/CDF核同值 | ✅ | 无量纲，右连续累计质量；独立按条件求和复核 |
| 6 | ESS>N/2=2，默认不自动触发 | NB1c2 adaptive_condition False | 页面“是否触发：否” | ✅ | 手动演示一次与逐拍阈值规则分开；不是无条件重采样算法 |
| 7 | 固定u0.125，查询[.125,.375,.625,.875]→祖先[0,0,3,3] | systematic_offset_targets_ancestors | 真实TS offset/ancestors一致 | ✅ | NB1c2；祖先编号从0起，半开区间；numpy searchsorted独立实现 |
| 8 | 重采样[-2,-2,2,2]，各.25，均值0/方差4/ESS4/祖先2 | resampled_positions_stats_unique全值 | 0.000000/4.000000/4.000000/不同祖先2 | ✅ | NB1c2；等权不表示四独立状态或额外信息 |
| 9 | 对称连续先验mu0/P1/R.25/z4→参考均值0/方差3.841876/负.5 | NB2c1 Gaussian_reference 0/3.841876221594493/.5000000000000002 | 非默认，Gaussian对应控件实测同值 | ✅ | TS±12 Simpson矩对无穷quad，1e-9；不是离散先验真值 |
| 10 | 三MC工况及N64/256/1024，种子0..9，共90次 | NB2c1 三Gaussian_reference与multi_seed_count90/seed全表 | 组件用xorshift，仅三个种子；不冒充相同PCG64样本 | ✅ | 纯Notebook随机协议，全部同模型；无训练/择种子 |
| 11 | 工况1误差三行min/median/max：.021826/.713366/1.895246；.166392/.391190/.876593；.028196/.179973/.535519 | NB2c2 MC_summary三行全部原始值，mc_rows/monte-carlo.json保留90行 | 不适用，组件单次xorshift，不声称重现PCG64分布表 | ✅ | m，绝对均值误差；6位舍入；另外两工况/负分支误差全保留 |
| 12 | 同10种子、三种N，共30条20拍bootstrap运行 | NB3c1/c2 steps20，seq_rows/sequential.json保存30个history各20行 | 不适用，组件只做一拍观测实验 | ✅ | 原始cell中的Q.04/R.25、dt1s、观测5值×4为给定合同；未触发保留w |
| 13 | [-8,8]1001/2001网格细化差<1e-6 | NB3c1 maxDifference7.958078640513129e-15 | 不适用 | ✅ | FFT卷积参考；另801点直接高斯转移矩阵全部20拍最大差8.242295734817138e-15，小于1e-6 |
| 14 | 对称参考末拍均值0/方差4.629100/负.5 | NB3c1 last [6.8212102633e-15,4.629100471168366,.49999999999999833] | 不适用 | ✅ | 对称性给均值/分支概率解析检查；方差独立矩阵核，1e-6 |
| 15 | N64末拍负分支0..1、中位.700495、曾全同号4/10 | NB3c2 N64 [0,.7004945776451519,1] lost4 | 不适用 | ✅ | 同号按每拍传播/可选重采样后位置检测；限定10种子，不称不可恢复 |
| 16 | N256与1024本组各10次未出现全同号 | NB3c2 两组lost0，各自min/median/max完整留存 | 不适用 | ✅ | 仍有分支概率误差，未称普适可靠或单种子单调改进 |
| 17 | exp[-1000,-1001]直接[0,0]，log归一化约[.731059,.268941] | NB1c2 log_underflow_example | 不适用，后台normalizeLogWeights实际TS也核 | ✅ | SciPy logsumexp对max-shift，差约1e-14；1e-12 |
| 18 | 四个+2粒子→均值2/方差0/ESS4/负分支0 | NB1c2 missing_negative_branch_ESS_mass完整值 | 不适用，作为失败反例，不伪装默认 | ✅ | 目标对称Gaussian负分支.5；高ESS不等于准确 |
| 19 | 所有无效log权重应报错，不回退等权 | NB1c2 invalid_likelihood_rejected | 实际TS8个无效/空权重/NaN/偏移/seed/count输入均拒绝 | ✅ | 另测零权重区间[0,1]和CDF相等边界，实际祖先正确 |
| 20 | 全114组合；连续参考108×241=26028点，±12/4800段积分；图x±6/y0..1 | 不适用：原始NB用无穷自适应积分，不伪装相同积分预算 | 实际TS108Gaussian+6离散，CDF单调且在0..1内 | — | 计算合同与源码/实际模块核；所有标量最大差8.065034751147948e-12<1e-9、CDF最大差8.899779690985099e-9<1e-6 |

### A.2 实测数据总表（每行注明产出路径）

何仿未上场，林矩提供小实验/随机合同，柯验以不同概率计算与转移矩阵仲裁。

| 来源 | 量 | 实测值 |
|---|---|---|
| minimal-experiment.json、minimal-notebook-output.json | 写正文前的小实验 | 默认四点与90单拍/30逐拍先实跑；不替代最终hash验收 |
| actual-ts.json、reconcile.mjs、reference.py/json、reference-controls.json | 实际TS全范围与独立权重/祖先/积分/CDF | 114组合，标量最大差8.065034751147948e-12；CDF8.899779690985099e-9，8个非法输入/零权/边界均过 |
| notebook-contract.json、extracted.json、original-python.json/log | 原始求值后的setup/cell | 3Notebook6cell；contract与源码按LF规范化相同；原始源码提取串逐字核对；干净命名空间完整执行 |
| monte-carlo.json、sequential.json、original-python输出 | 多种子数据与逐拍参考 | 全90单拍、全30×20拍，无择种子/删失败；种子0..9，PCG64与TS随机源明确分开 |
| independent-sequential.py/json | 独立直接矩阵参考 | 801点直接转移矩阵对2001点FFT，20拍最大差8.242295734817138e-15 |
| notebooks.json/log | 严格内核 | EXECUTED，6cell/error0/SKIPPED0 |
| pyodide.json/log、validation.log | 浏览器原始执行与最终hash | 三Notebook全部passed/6cell，sourceHash匹配 |
| browser-native/pages.json及PNG | 两种真实页面 | 各10H2、114真实控件/恢复/重绘、6原始cell全部运行，375px/图片/精确锚点，console/pageerror0 |
| source-fingerprints.json、runtime-commands.json | 四课程资产与构建副本指纹 | 相同；最终八个运行命令均exit0 |

## 附录 B：前端交付硬门槛实际输出（秦构）

| 九项原清单 | 执行命令 / 实际输出 / 判定 |
|---|---|
| 1 npm run build 通过 | npm run build和官方npm run build:pages各exit0，SSG完成，无MDX编译失败；build.log/pages-build.log；✅ |
| 2 curl 课程页 → HTTP 200 | verify-lesson exit0/HTTP200，普通19646与Pages19746真实响应200；verify.log/browser JSON；✅ |
| 3 页面 H2 数 == catalog.ts 该课 subsections 数 | 实际DOM10=metadata10，H1=1，H2文本及全级ID逐项对renderedHeadings、所有侧栏目标存在、重复ID0；✅ |
| 4 katex-error 元素数 == 0 | verify与两实页均0；✅ |
| 5 MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | nb-cells verify estimation/particle-filter --require-kernel --port19846 exit0、EXECUTED6cell/error0/SKIPPED0；validate-final逐字核求值setup/cell及contract；Pyodide三Notebook passed；✅ |
| 6 新增组件已在 lib/wiki-components.ts 登记 | check单一来源注册PASS，仅新增ParticleFilterExplorer；✅ |
| 7 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | MDX显式<ParticleFilterExplorer />，两实页canvas1；✅ |
| 8 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅ | x[-6,6]/y[0,1]固定、animation:false/useMemo<EChartsOption>/useECharts(option)；默认方差3.967039/ESS2.044431→4/4、祖先2；114组合真实选择、离散模式禁用Gaussian专属控件、恢复/重绘均通过；✅ |
| 9 notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用 | 严格S2无FAIL，纯计算/静态输出；✅ |

四条补充：①三个nativeKernelIds实测不同，结构S8通过；②cell首行无%#，无拼接占位符；③所有display围栏独占行，math:check exit0；④JSX属性无逗号分隔，构建通过。两页均实际点击三次“全部运行”，直到各自末尾独立token出现；不是只看HTTP200。375px根scrollWidth375，纵向SVG及CDF/控件截图人工复核可读，console/pageerror0。原生测试请求8891/8981路由到隔离19846，未改共享Jupyter组件/API/端口。完整Pages构建及静态实页仅在本机，不代表发布。

开工共享check受其它课程草稿/统计行影响而FAIL、semester因RL-02列格式FAIL，原样留opening日志，不代修其它课程。初次局部check把数学中的小于N识别为N组件，改用等价LaTeX反斜杠lt；保留首次检查，最终源码hash的相关验收重跑。首次静态页完整截图在展开大量原始输出后超时；改为页面摘要、变量保留全量，并由执行原始cell的脚本写入版本化全量JSON；最终源码全部相关检查重跑，截图失败日志保留。最终新增的合同副本核对因Windows CRLF与JSON内LF不同而失败，仅合同副本改按LF规范化比较，原始源码/提取串逐字要求不变；保留validation-before-review.log并重跑最终验证。第一次TS模块执行发现负号与幂的语法冲突，加括号后重跑全部114组合。规范执行阶段发现的问题已在本轮拦截，不虚构“用户发现已上线故障”的fix记录。

## 附录 C：红队放行记录（何疑）

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | “重采样改变了本次有限样本统计量，也删掉了内侧位置” source:HAND | 同一四点离散先验/似然，有限Bayes求和为唯一真值，无整定；重采样u0.125固定作演示，未按结果挑偏移 | 6个离散控件组合及108Gaussian组均保存；默认加权恰好精确，重采样后方差3.967039→4而不同祖先减少；ESS等权上升不代表获胜 | 固定偏移不冒充随机无偏结果；离散与Gaussian模型分开，不排名PF/UKF/EKF；重采样没有新增观测 | 放行 |
| 2 | “中位数随预算增加而下降，但最小值并不单调” source:MC | 同工况下p/q相同，N64/256/1024，每组PCG64种子0..9，不择优；三个工况各自用同模型无穷quad为参考，无参数整定自由度 | 3工况×3预算×10种子=90次，全原始结果；工况1最小误差N256比N64更大，限定表保留；未宣称每个种子改善或系统重采样普适占优 | 同一维单拍限定观察，只报误差分布，不推任意系统收敛率/置信保证；Notebook与TS使用不同随机源，未伪称同一随机轨迹 | 放行 |
| 3 | “64粒子的末拍负分支概率范围为0到1…4次运行曾出现全体粒子同号” source:SEQ | 同随机游走Q.04/R.25/20给定观测/先验、相同0..9种子，ESS<N/2规则固定；1001/2001FFT参考再对801直接矩阵，未虚构隐藏真值 | 30完整运行/600拍，64粒子4次曾全同号；另两预算0次但分支仍有误差；对称参考.5与失峰反例保留 | 只对这批教学读数和10种子观察，不称更大N绝对可靠、不把grid细化差作严格截断界；保存history的预算写明 | 放行 |

'''
for token,phrase in [('HAND','重采样改变了本次有限样本统计量'),('MC','中位数随预算增加而下降'),('SEQ','相同十个种子下，64粒子')]:
    final=final.replace('source:'+token,'content/estimation/particle-filter.mdx:'+str(line(phrase)))
logpath.write_text(prefix+final+'## 附录 D：'+audit.replace('当前未签发。','最终hash的Phase1—4与验收已完成，实际master回执提交后登记。'),encoding='utf8')
p=root/'content/catalog.ts';s=p.read_text(encoding='utf8');a=s.index('"slug": "particle-filter"');b=s.index('\n      },',a);s=s[:a]+s[a:b].replace('"status": "draft"','"status": "v1.3"')+s[b:];p.write_text(s,encoding='utf8')
p=root/'.agent/delivery-tracker.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| \[ \] 粒子滤波 \(particle-filter\).*$', '| [x] 粒子滤波 (particle-filter) | EST-06学期3新写；10H2/3Notebook6cell/114配置/120随机运行；docs/discuss-log/semester-03/10-estimation/06-particle-filter.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-checklist.md';s=p.read_text(encoding='utf8');s=re.sub(r'^\| EST-06 \|.*$', '| EST-06 | [x] | [x] | [x] | [x] | [x] | [ ] | docs/discuss-log/semester-03/10-estimation/06-particle-filter.md;.agent/semester-03/est-06/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03/zh-lang-edit/PLAN.md';s=p.read_text(encoding='utf8');s=re.sub(r'^(\| \d+ \| EST-06 \|[^\n]+?)\| 待完成 \| 待生产 \| — \|$',lambda m:m[1]+'| 已完成 | 待润色 | .agent/semester-03/est-06/acceptance.md |',s,flags=re.M);p.write_text(s,encoding='utf8')
p=root/'.agent/semester-03-plan.md';s=p.read_text(encoding='utf8');block='''<!-- EST-06-RECEIPT-BEGIN -->
### EST-06 学期3交付（2026-10-24）

粒子滤波从空占位按新写Phase1—4完成：10H2/四题全部子问、3Notebook6cell、ParticleFilterExplorer与纵向SVG。一般重要性权重、bootstrap逐拍更新、按需系统重采样、ESS与祖先丢失、log权重和支持覆盖完整；四点离散先验与Gaussian采样严格分开。114真实TS组合对独立SciPy/quad/CDF，90单拍与30×20拍多种子保留失败，FFT参考另对直接转移矩阵核；严格内核、Pyodide、两构建/实页/375px通过。rank4独立副本/端口/私有索引保留并行修改，证据.agent/semester-03/est-06/acceptance.md；真实master回执见checklist。不发布Pages，不生产EST-07。
<!-- EST-06-RECEIPT-END -->''';assert '<!-- EST-06-RECEIPT-BEGIN -->' not in s;p.write_text(s.rstrip()+'\n\n'+block+'\n',encoding='utf8')
baseline=(folder/'baseline-commit.txt').read_text().strip()
initial=(folder/'acceptance.md').read_text(encoding='utf8').replace('进行中','验收完成，待master回执',1).replace('设计Phase1，未签发。','Phase1—4已完成并签发。').replace('计划10H2','完成10H2')
table=f'''

最终正文{len(source.splitlines())}行；LF sourceHash={sha}。四个课程资产指纹与构建副本一致，见source-fingerprints.json。

| 实际命令/操作 | 退出码与结果 | 原始证据 |
|---|---|---|
| reconcile.mjs，实际TS对独立SciPy权重/祖先/quad | 0；114配置，标量最大差8.065034751147948e-12<1e-9，CDF最大差8.899779690985099e-9<1e-6 | reconciliation.json/log、reference.py/json、actual-ts.json |
| 三Notebook原始代码与独立逐拍参考 | 0；90单拍/30逐拍×20，801点矩阵对2001点FFT最大差8.242295734817138e-15 | original-python.json/log、monte-carlo.json、sequential.json、independent-sequential.json |
| nb-cells verify --require-kernel --port19846 | 0；EXECUTED/3Notebook6cell/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 原始setup/cell Pyodide完整执行 | 0；3Notebook均passed/6cell，最终sourceHash一致 | pyodide.json/log |
| npm run build与官方npm run build:pages | 各0；SSG完成，无MDX编译失败 | build.log/pages-build.log/runtime-commands.json |
| verify-lesson estimation/particle-filter | 0；HTTP200/H1=1/H2=10/KaTeX0 | verify.log |
| 普通/静态真实页面原始cell与交互 | 各0；6cell/114控件+恢复+重绘/375px/精确标题与ID/侧栏目标/图片/console及pageerror0 | browser-native/pages.json及PNG |
| validate-final.mjs | 0；源码/原始cell/contract/随机数据/两实页与构建副本指纹交叉相同 | validation.log/source-fingerprints.json |
| math:check/glossary:check | 各0，WARN原样保留 | math.log/glossary.log |
| 限定投影catalog/semester/Python策略 | 各0；首次刷新生成允许exit1，随后只读check必须0 | scope-commands.json、check/semester-check/python-policy.log |

完整构建基线为已提交{baseline}叠加本课，最终提交前另按最新master重新生成限定快照，再跑权威npm run check/semester/Python/术语/数学门槛。共享开工检查失败留opening日志，不修改其它课程草稿或共享索引，不把全站WARN说成本课独占成果。首次小于N的数学写法被目录扫描误识别，已改LaTeX反斜杠lt并让最终hash相关验收重跑；before-review仅留历史失败，不作最终通过。

真实master提交与推送结果待提交后追加；不发布gh-pages。
'''
(folder/'acceptance.md').write_text(initial+table,encoding='utf8');print('Signed final source',sha,'; master receipt unchecked')
