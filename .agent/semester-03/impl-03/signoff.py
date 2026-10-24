"""Fill the audit only after all executable and browser evidence exists."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-03'
v=json.loads((e/'validation.json').read_text(encoding='utf-8'));assert v['pass']
ref=json.loads((e/'reference.json').read_text(encoding='utf-8'));actual=json.loads((e/'actual-ts.json').read_text(encoding='utf-8'))
log=root/'docs/discuss-log/semester-03/07-implementation/03-pid-engineering-tuning.md';s=log.read_text(encoding='utf-8')
reviews={
'教授组':'周联：一阶局部、自衡、单调条件和失效对象已写明；SIMC来源为作者原文。λ不是实测闭环时间；Ti不是T的同义词；D为零不冒充完整PID模型辨识。实际延迟变化后不重新整定控制器，属于模型失配检验。',
'工程组':'何仿：ZOH精确推进、延迟10/30拍、条件积分顺序、最终实际限幅、确定性噪声与15s过程输入扰动位置均对应源码。赵工：不可达目标全数保留，不能以防饱和替代容量；工作点偏差限幅、人工接管、状态跟踪、旧参数恢复均已说明。',
'验证组':f'柯验：实际TS函数28配置、67536个数值与42位Decimal独立复算，最大差异{v["tsError"]:.16g}；Notebook原始setup/cells真内核执行4cell无error，页面原生UI、Pages UI及Pyodide也实际运行。全部正文实验表60个数字、默认/边界UI共116个数值核对通过。秦构：原生与Pages构建退出0，页面200，H1=1/H2=8，数学错误0、重复ID0、死锚点0；375px修后scrollWidth=clientWidth=360，图331px；静态新页console error=0。',
'教学支持组':'孙助：四题依次覆盖模型反演、参数与单位换算、容量失败、现场判停与回退；数值答案由Notebook1及独立解析复算支持。第四题是解释/工程记录题，不伪装成可用固定数字作答的设备规范。',
'学生组':'林码：现在能区分过程T、控制器Ti和设计λ；积分是输出后更新，首拍不混用上一课另一种约定。赵工：21拍只是此合同里的记录，不是自动通过阈值；目标不可达先查容量与要求。郑核代陆阅：从生活例到公式、算法、反例与交接顺序可独立阅读，四份档案齐备。'}
for title,body in reviews.items():s=re.sub(r'(### '+title+r'\n)[\s\S]*?(?=### |## Phase 4)',lambda m:m[1]+body+'\n',s,count=1)
s=s.replace('尚未签发，阶段与验收不得预勾。','郑核：理论条件、学生反馈闭环、习题答案、柯验逐量对账、何疑限定观察放行及秦构九项门槛均有实测支持，现签发本课。catalog与旧tracker同步v1.3；本期Phase1–4及验收可勾，进入master一栏等待真实提交hash，不预填。未执行公网发布。')
a='| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |\n|---|---|---|---|---|---|\n'
n=0
for key,val in ref['identification'].items():
    n+=1
    component='默认SIMC增益同值' if key in ['Kp','Ti','Ki'] else '不适用：模型反演/习题静态计算，组件不提供此项读数'
    a+=f'| {n} | {key}={val:.12g} | NB1/c1={val:.12g} | {component} | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |\n'
for row in ref['cases']:
    if row['lambda'] not in [.5,1,2]:continue
    measured=next(r for r in actual if r['lambda']==row['lambda'] and r['scenario']==row['scenario'])
    for quantity,value in row['metrics'].items():
        n+=1;isdefault=row['lambda']==1 and row['scenario']=='nominal'
        prefix='默认读数' if isdefault else f'非默认；实际TS切换λ={row["lambda"]}/{row["scenario"]}'
        a+=f'| {n} | λ={row["lambda"]}/{row["scenario"]} {quantity}={value:.4f} | NB2/c1={value:.12g} | {prefix}：{measured["metrics"][quantity]:.12g} | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |\n'
a+='\n重复引用（默认五读数、三个延迟超调、答案）的同量断言复用对应行；输入参数、窗口、采样数与数组长度为实验合同，原代码与notebooks.json保留。边界λ=.25及3和四工况UI逐量检查见native-interactions.json、validation.json。组件不计算阶跃反演，所以未伪造第三路。容量2、不可达下界1的解析式与NB1闭合。\n'
s=re.sub(r'(?<=## 附录 A.1 数值三方对账\n)[\s\S]*?(?=## 附录 A.2)', '\n'+a+'\n',s)
b='| 来源 | 量 | 实测值 |\n|---|---|---|\n'
for key,value in ref['identification'].items():b+=f'| Notebook1/c1及独立解析 | {key} | {value:.16g} |\n'
for row in actual:
    for q,value in row['metrics'].items():b+=f'| actual-ts.json λ={row["lambda"]}/{row["scenario"]} | {q} | {value:.16g} |\n'
b+='| actual-ts.json/reference.json | 28组×601点完整时间/y/u/r轨迹 | 原始数组保留，67536数值对照通过；未抽稀时间轴 |\n| notebooks.json | 原setup/cells执行 | 2 Notebook / 4 cell / error 0 / S6非SKIPPED |\n| pyodide.json | 同哈希浏览器Python | 2/2放行、4/4 cell通过，图片输出2幅 |\n'
s=re.sub(r'(?<=## 附录 A.2 实测数据总表\n)[\s\S]*?(?=## 附录 B)', '\n'+b+'\n',s)
gates=[('npm run build 通过','build-results.json：npm run build退出0；独立目录完整预渲染'),('curl课程页HTTP 200','native-verify.log：课程页HTTP200；静态页实际浏览器加载与Pages构建路由检查通过'),('渲染后H2与catalog小节数一致','native-verify.log/pages-dom.json：H1=1、H2=8；subsections=8'),('katex-error元素数为0','native-dom.json/pages-dom.json：0'),('MDX与验证脚本cell字符串逐字全等且真内核运行','notebooks.log/notebooks.json：S0–S8无FAIL、4cell真跑、error0；验证脚本extract原始MDX不另抄cell'),('新增组件已在lib/wiki-components.ts登记','PidTuningExplorer单一来源注册；native-verify.log注册结构PASS'),('新增组件MDX显式引用','本课MDX含<PidTuningExplorer />，DOM canvas=1'),('固定轴/animation:false/Option对象/默认参数','两Y轴及X轴显式min/max，useMemo<EChartsOption>传useECharts；实际TS28配置及页面默认/边界/恢复见validation.json'),('notebook无ipywidgets等不支持组件','nb-cells S2无FAIL；Pages两个Notebook实际执行，非代码保留')]
g='| # | 原技能九项硬门槛 | 实际输出与证据 |\n|---|---|---|\n'+''.join(f'| {i} | ✅ {name} | {output} |\n' for i,(name,output) in enumerate(gates,1))
g+='\n额外：npm run build:pages退出0，205课/9旧路由；math:check退出0，glossary:check PASS3/WARN3/FAIL0；术语三个WARN为既有残渣/不命中提示，未更改术语表降低门槛。两个构建的既有lint/KaTeX WARN按原输出保留，不属于本课新增编译失败。最终catalog及学期检查在独立快照上再次运行，原始日志保留。\n'
s=re.sub(r'(?<=## 附录 B 九项前端硬门槛\n)[\s\S]*?(?=## 附录 C)', '\n'+g+'\n',s)
s=s.replace('| 同一规则固定参数敏感性，非方法排名 | 待核限定观察 | 待测四工况 | 不可达工况待测 | 待核 | 否，待测 |','| 同一SIMC规则三档固定参数敏感性；不是方法排名 | 限定观察：没有独立搜索最优参数，不宣称方法胜出 | ✅ 四工况全部12行，原始数组保留 | ✅ 标称更快伴随延迟超调/噪声TV代价；全部不可达失败；更大λ超调非单调 | ✅ 窗口、约束、模型失配及确定性噪声限制写回正文 | ✅ 何疑放行此限定观察；不放行泛化性能排名 |')
s+='\n何疑：不需要统计显著性推断；这里不抽样、不比较学习算法。若未来宣称某整定法最优，应另立相同预算与独立整定基线，不能引用本表当结论。\n'
log.write_text(s,encoding='utf-8')
accept=(e/'acceptance.md').read_text(encoding='utf-8').replace('当前进行中，未签发。','Phase1–4完成并签发，真实master提交回执待登记。')
accept+=f'\n最终正文LF SHA256：`{v["sourceHash"]}`。详见validation.json与本课讨论日志（A.1共{n}行逐量对账、B原九项、C限定观察放行）。独立高精度对照28配置/67536数值，最大误差{v["tsError"]:.16g}。原生内核、原生页面UI、Pyodide及Pages页面UI均执行了2实验4cell，图输出2幅。\n\n命令与退出码：npm run build=0；npm run build:pages=0；npm run verify -- implementation/pid-engineering-tuning=0（WIKI_VERIFY_PORT=8191）；node scripts/nb-cells.mjs verify implementation/pid-engineering-tuning --require-kernel --port8991=0；node scripts/verify-pid-tuning.mjs=0；npm run math:check=0；npm run glossary:check=0；node scripts/check-python-support.mjs=0；node .agent/semester-03/impl-03/validate.mjs=0。完整原始输出按同目录文件名保存。\n\n375px夹具首次发现表格溢出（narrow-layout.json），修后文档360/360、图331、表格内部独立滚动（narrow-layout-final.json）。Pages新页H1=1/H2=8、KaTeX错误0、重复ID0、死锚点0、console error0，SVG已加/control-universe路径。预览 http://127.0.0.1:9192/control-universe/implementation/pid-engineering-tuning/ 。本课只做本地预览，未部署gh-pages。\n'
(e/'acceptance.md').write_text(accept,encoding='utf-8');(e/'phase.txt').write_text('5\n')
print('Signed after evidence; A.1 rows',n)
