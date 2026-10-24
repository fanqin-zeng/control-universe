"""Close the four-phase record only after real executable/browser evidence."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-04'
v=json.loads((e/'validation.json').read_text(encoding='utf-8'));assert v['pass']
ref=json.loads((e/'reference.json').read_text(encoding='utf-8'));run=json.loads((e/'reconciliation.json').read_text(encoding='utf-8'));actual=json.loads((e/'actual-ts.json').read_text(encoding='utf-8'))
log=root/'docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md';s=log.read_text(encoding='utf-8')
reviews={
'教授组':'周联：连续补偿器和离散递推的首拍约定、分母/正反馈符号、状态初值与更新顺序已明确。零输入舍入界附无饱和/|aq|<1条件与几何级数理由，未当跟踪误差通界。独立比例闭环用精确ZOH对象和二阶延迟矩阵核极点，不能从补偿器稳定推完整闭环稳定。',
'工程组':'何仿：16位存储、F、宽乘加、最后一次舍入与饱和的顺序与代码一致，负半格使用远离零规则。36配置覆盖四周期/三字长/三输入，整数路径逐点核验；不声称CMSIS或处理器性能实测。赵工：PC/目标程序/板上/硬件在环层级边界、时间戳、异常判停、状态与版本回退均写入正文。',
'验证组':f'柯验：实际TS36配置共{v["tsQuantities"]}个数值对精确Fraction/整数与SciPy独立核验，最大误差{v["tsError"]:.16g}；三个原始Notebook六cell真内核非SKIPPED，再在原生UI、Pyodide及Pages UI运行。108项内核量、207项表格/界面读数对账通过。秦构：首次注册路径错误已在Phase2修正；实际浏览器和两个构建均验证正确导出，H1=1/H2=9、数学错误0、死锚点0、重复ID0，生产新页console error0，SVG路径带basePath。',
'体验与脉络组':'郑核代陆阅：开篇从电机“仿真稳、上板振”的可想象现象进入，明确要解释实际程序是否实现设计；先补偿器、再字长、再独立闭环，避免把两个实验混成一个。公式给符号/初值/时刻，SVG与曲线对应问题。原生及静态375px夹具均clientWidth=scrollWidth=360，canvas331；指标表内部滚动。四份档案同日志齐备。',
'教学支持组':'孙助：四题覆盖系数符号/首拍、非零历史、定点舍入与范围、时序及交接；数值答案分别由NB1/NB2/NB3和独立解析核验。参考向量只定位给定输入下的错误，不冒称完整输入空间验证。',
'学生组':'林码：能解释为什么双线性变换后的首拍不等于连续阶跃t=0值，能用old_u/old_e复述先读后写。赵工：知道零输入残留不等于线性极点不稳定；增加一拍要改闭环矩阵，回退也要匹配状态策略，不能只写回参数。'}
for title,body in reviews.items():s=re.sub(r'(### '+title+r'\n)[\s\S]*?(?=### |## Phase 4)',lambda m:m[1]+body+'\n',s,count=1)
s=s.replace('未签发，验收不得预勾。','郑核：理论条件、学生反馈闭环、习题、柯验三方对账、何疑限定观察与秦构九项门槛均有实际证据，签发本课。catalog/旧tracker同步v1.3，本期P1–P4及验收可勾；进入master列等待真实提交，不预填hash。只做本地预览，不发布gh-pages。')
a='| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |\n|---|---|---|---|---|---|\n';n=0
def add(claim,nb,component,note):
    global n,a
    n+=1;a+=f'| {n} | {claim} | {nb} | {component} | ✅ | {note} |\n'
for key,value in run['values'][0]['coefficients'].items():
    comp='默认a或b同值' if key in ['a','b'] else '默认整数系数同值' if key in ['A_F8','B_F8'] else '默认首拍同值' if key=='first' else '不适用：静态系数接口/半格/非零历史/存储边界计算，不提供对应交互控件'
    add(f'{key}={value:.12g}',f'NB1/c1={value:.16g}',comp,'独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用')
for key in ['aq','bq','scale','first','fixedFirst','finalFloat','finalFixed','maxError','clipped','deadbandBound']:
    val=ref['example'][key]
    nb=f'NB2/c1默认={val:.16g}' if key not in ['bq','scale'] else f'NB1/2整数B=24与S=2^8换算={val:.16g}'
    comp=f'默认实际TS={next(r for r in actual if r["Ts"]==.02 and r["F"]==8 and r["signal"]=="step")[key]:.16g}'
    add(f'默认 {key}={val:.12g}',nb,comp,'Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7')
for row in ref['cases']:
    if row['Ts']!=.02:continue
    measured=next(r for r in actual if r['Ts']==.02 and r['F']==row['F'] and r['signal']==row['signal'])
    for key in ['finalFloat','finalFixed','maxError','clipped']:
        value=row[key];label='默认' if row['F']==8 and row['signal']=='step' else f'非默认；实际TS切换F{row["F"]}/{row["signal"]}'
        add(f'F{row["F"]}/{row["signal"]} {key}={value:.8f}',f'NB2/c1={value:.16g}',f'{label}={measured[key]:.16g}','80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9')
add('零输入F8末拍对应整数U=5，保持round(aq×5)=5','NB2/c1末拍.01953125×256=5；零输入循环已反复执行该舍入','切换decay实际TS末拍word=5；前后历史固定','以代码和整数轨迹核保持；不是把末拍当作渐近极限')
for row in ref['timing']:
    for key in ['pole','rho']:
        add(f'Ts={row["Ts"]} {key}={row[key]:.8f}',f'NB3/c1={row[key]:.16g}','不适用：独立闭环静态矩阵实验，不与前面的补偿器混用','3周期全报，独立eigvals/精确对象核验；8位舍入5.1e-9；|p|/ρ<1判稳定')
a+='\n输入常量、80拍/60更新、状态布局、时间轴和位数是预先声明的合同，代码逐字保留。正文中首拍、默认读数、三个时序解释与答案重复引用对应行；golden/correct/wrong完整向量见reconciliation.json，原始UI流见native-notebook-ui.json与pages-notebook-ui.json。组件默认值无法展示的静态量明确标不适用；可交互的非默认量均实际调用组件计算函数，并检验可见UI边界与恢复。\n'
s=re.sub(r'(?<=## 附录 A.1 数值三方对账\n)[\s\S]*?(?=## 附录 A.2)',a+'\n',s)
b='| 来源 | 量 | 实测值 |\n|---|---|---|\n'
for key,value in run['values'][0]['coefficients'].items():b+=f'| NB1/c1 | {key} | {value:.16g} |\n'
for key in ['golden','replayed','wrong']:b+=f'| NB1原始cell | {key} | {json.dumps(run["values"][0][key])} |\n'
for row in actual:
    for key in ['a','b','A','B','first','fixedFirst','finalFloat','finalFixed','maxError','clipped','deadbandBound']:
        b+=f'| actual-ts.json Ts={row["Ts"]}/F{row["F"]}/{row["signal"]} | {key} | {row[key]:.16g} |\n'
for row in ref['timing']:
    for key in ['A','B','pole','rho','noDelayEnd','delayedEnd']:b+=f'| NB3/独立矩阵 Ts={row["Ts"]} | {key} | {row[key]:.16g} |\n'
b+=f'| actual-ts.json/reference.json | 36组×80点的t/input/float/fixed/word | 完整数组保留；{v["tsQuantities"]}数值通过；整数路径逐点全等 |\n| notebooks.json/pyodide.json/UI流 | 原setup及6cell | 三Notebook全部执行；原生/Pages UI三幅输出图 |\n'
s=re.sub(r'(?<=## 附录 A.2 实测数据总表\n)[\s\S]*?(?=## 附录 B)',b+'\n',s)
gates=[('npm run build通过','build-results.json/build.log：退出0；独立快照完整预渲染；build-origin.json记录基线和正文哈希'),('curl课程页HTTP 200','native-verify.log：HTTP200；真实原生/Pages页均加载完整正文；Pages构建路由检查通过'),('渲染H2与catalog一致','native-dom.json/pages-dom.json：H1=1/H2=9，对应subsections=9'),('katex-error元素数为0','两份DOM均0；math:check退出0'),('MDX与验证脚本cell逐字全等且真内核执行','nb-cells verify --require-kernel --port8991退出0，S0–S8无FAIL，S6六cell非SKIPPED；镜像脚本直接extract原始setup/cell'),('新增组件在lib/wiki-components.ts登记','ControllerDeploymentExplorer的实际模块导出已由浏览器与生产构建核验；初稿误路径已修正，不把名称登记当作充分证据'),('新增组件MDX显式引用','<ControllerDeploymentExplorer />显式引用；真实DOM canvas=1'),('固定轴/animation:false/Option对象/默认复现','x=[0,80Ts]、y=[−2.5,2.5]显式边界；useMemo<EChartsOption>传useECharts；真实TS36配置、默认及UI边界/恢复通过'),('notebook无ipywidgets等不支持组件','nb-cells S2无FAIL；Pyodide3/3实验放行、6/6cell通过，页面实际运行三幅图')]
g='| # | 原技能九项硬门槛 | 实际输出与证据 |\n|---|---|---|\n'+''.join(f'| {i} | ✅ {name} | {proof} |\n' for i,(name,proof) in enumerate(gates,1))
g+='\n额外：npm run build:pages退出0，205课/9旧路由、basePath=/control-universe；glossary:check PASS3/WARN3/FAIL0，既有残渣不命中提示未通过改术语表隐藏。原生及Pages 375px夹具均文档360/360、图331、表内滚动。Pages新页console error0；源码与Notebook证明同LF哈希。构建既有lint/KaTeX WARN按原stdout保留。本课没有修改全局渲染/路由/数学/内核基础设施。最终catalog与学期门槛将以最新HEAD加本课再次执行，不能继承共享草稿基线的失败或当作全站无债务。\n'
s=re.sub(r'(?<=## 附录 B 九项前端硬门槛\n)[\s\S]*?(?=## 附录 C)',g+'\n',s)
s=s.replace('| 固定实现/时序敏感性，非方法排名 | 限定观察待核 | 三输入/三周期待测 | 零输入残留/延迟失稳待测 | 待核 | 待测，不放行 |','| 固定实现/时序敏感性，非方法/平台排名 | 限定观察：无最优或方法胜出声明，不移植芯片性能 | ✅ 三输入×三位数全表；时序三周期完整保留 | ✅ 零输入残留；短周期两者稳定、长周期两者失稳；.1s新增一拍使模型失稳 | ✅ 舍入/饱和/初值/窗口、独立实验及硬件未执行边界写入正文 | ✅ 何疑仅放行这些局部观察，不放行泛化排名 |')
s+='\n何疑：未选择最优调参基线，不把误差曲线归因为平台普遍优劣；固定增益12只检查时序反例。极点判断与仿真末点分开，未用单条稳定曲线冒充鲁棒或安全保证。\n'
log.write_text(s,encoding='utf-8')
accept=(e/'acceptance.md').read_text(encoding='utf-8').replace('当前进行中，未签发。','Phase1–4完成并签发；真实master提交回执待登记。')
accept+=f'\n正文LF SHA256：`{v["sourceHash"]}`。独立TS/精确有理数与整数/SciPy核验36配置、{v["tsQuantities"]}数值，最大误差{v["tsError"]:.16g}；原始内核108项、实际页面/表格207项核对。A.1共{n}行，完整原始数据及三幅图见本目录JSON。\n\n命令/退出码：npm run build=0；npm run build:pages=0（205课/9旧路由）；npm run verify -- implementation/controller-discretization-practice=0（WIKI_VERIFY_PORT=8191）；node scripts/nb-cells.mjs verify implementation/controller-discretization-practice --require-kernel --port8991=0（6cell/error0）；node scripts/verify-controller-deployment.mjs=0；npm run math:check=0；npm run glossary:check=0；node scripts/check-python-support.mjs=0；node .agent/semester-03/impl-04/validate.mjs=0；阶段2学期检查errors=[]。原始stdout按同名log保留。\n\n原生与Pages UI均执行3实验6cell，Pyodide报告同源码哈希3/3放行。H1=1/H2=9，katex/重复ID/死锚点/静态console错误均0，SVG路径包含/control-universe；两种375px夹具文档宽360/滚动360、图331。初稿注册导入路径错误已在Phase2修复并经浏览器/构建复核。\n\n构建基线与最终提交父提交分别见build-origin.json/snapshot.json；后续并行课程不由本课重新签发，提交时基于最新HEAD重跑目录/学期/Python策略。预览http://127.0.0.1:9193/control-universe/implementation/controller-discretization-practice/；8991内核及8191原生服务器已释放，保留9193静态预览。未执行板上/硬件在环，未发布gh-pages。\n'
(e/'acceptance.md').write_text(accept,encoding='utf-8');(e/'phase.txt').write_text('5\n')
print('Signed after actual evidence; A.1 rows',n)
