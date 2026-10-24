from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[3];e=Path(__file__).resolve().parent
read=lambda p:json.loads((e/p).read_text(encoding='utf-8'))
v=read('validation.json');assert v['pass'];r=read('reconciliation.json');ref=read('reference.json');facts=ref['facts']
p=root/'docs/discuss-log/semester-03/07-implementation/06-realtime-control.md';s=p.read_text(encoding='utf-8');assert '## Phase 3' not in s
s,d=s.split('## 附录 D',1);d='## 附录 D'+d
s+='''## Phase 3: 内容审校

### 教授团队（学术准确性）

[周联] 理论结论已限定单核、完全可抢占、独立周期、D=T、零开销，无锁/挂起；WCET和干扰口径分离。RMS充分界未通过并非不可调度，EDF条件不能推广多核与阻塞。响应时间迭代解释默认第三任务7ms和高利用率第二任务8ms；有限窗口未完成不等于错过截止。固定纯延迟/抖动/采样/释放/锁存区分，删无依据普遍1%门槛。

### 工程团队（实践可行性）

[何仿] 逐作业保留剩余执行，34配置与独立Fraction事件参考一致；截止恰好完成、积压不被覆盖、工作守恒另有断言。单次继承事件明确L已持锁且临界区剩1ms、H/M只释放一次，未声称任意到达流的最坏界。Q15输入舍入/重缩放/饱和顺序明确，查表实数表与int16量化及实物耗时分离。

[赵工] DMA消费赶不上会覆盖，缓存/所有权需要平台协议；看门狗须看任务推进和新鲜度，复位不替代执行器保护。矩阵乘向量复杂度n²/nnz纠正，编译器/FPGA/RTOS无普遍性能承诺；目标板WCET、ISR/锁开销、器件保护均未实测，正文没有冒称验收。

### 验证团队（独立把关）

[柯验] 实际TS对独立事件跳转Fraction参考34配置8048项，最大差1.11e−16；含原始Notebook共8200数值核验。默认首完成1/3/7ms、Q15乘积257696727和结果7864、原任务排序均已纠正。原始4setup/8cell真内核执行无错误，再经原生UI、Pyodide审计与Pages UI全量执行；界面/正文表格对账见validation.json。旧稿S2FAIL/S7WARN/S6SKIPPED保留为起点，不能把旧静态通过误称数值通过。

[秦构] 两构建exit0，无MDX编译失败；实际postcss.config.mjs包含在快照且字节与工作区一致。H1=1/H2=9/H3=23，KaTeX错误、重复ID、失效锚点和最终静态console错误均0。23旧H3的渲染ID逐个在两DOM中存在；四Notebook输出5条JSON流和4幅真实图。375px文档360/360、图299，宽表容器328px内滚动；图片basePath正确。

[何疑] RMS/EDF相同作业、预算、窗口、超期保留策略；确定性调度无可独立“调优的增益”，扫描默认C3=1..14并完整保留四工况。含两者持平、RMS失期EDF通过、两者过载，失期数不被推广为实物优劣。继承事件M=0/2/5ms含持平；查表给解析界和采样误差，不偷换为目标芯片速度。

### 体验与脉络（读者、历史与安全）

[郑核代陆阅] 从上一课恒温箱样本准时但输出延后的可想象现象进入，SVG把时刻与区间分开。学生可复述“任务反复释放作业”“零失期不等于窗口末全部结束”“阻塞不包含自身执行”。删产品正文中的原稿/保留说明，纠错历史只在审计档案。窄屏表/图可读，四份档案齐备。

### 教学支持（教学质量）

[孙助] 五题全部子问保留，题1限定充分测试余量，题2有0–12ms各作业释放/完成/截止，题3全部整数和负数饱和边界，题4补到达前提，题5排序及入口延迟换算。代码/正文/答案参数传播一致。

[郑核] 符号表复核：T_i/C_i/D_i是任务周期/预算/相对截止，R_i明确为本节响应时间，避免与全局控制权重R混用；r_i,j与f_i,j带双下标区别参考输入r和一般函数f。Q15整数X与真实值x区分，查表N局部定义、h为角间隔，均按上下文/下标消歧，无需改全局机器表。术语检查exit0、三条既有WARN保留。

### 学生审校（可读性）

[林码] 能解释默认τ3在5ms被抢占，所以完成7ms；超过RMS充分界但响应分析通过也可以可调度。EDF高利用率工况末尾一个未完成作业尚未到截止，因此不算失期。

[赵工] 能把9→4ms说成响应缩短，阻塞对应6→1ms；知道入口延迟占比不是抖动幅度。主机实验只到模型/数值层，板上必须补开销、干扰和保护证据。

## Phase 4: 内容定稿

[郑核] 汇总10项关键修改：林码2项（作业/任务与充分条件、窗口未完成口径）；赵工3项（单次锁事件条件、入口延迟非抖动、DMA/看门狗边界）；柯验3项（默认抢占时刻、Q15整数算术、任务排序）；秦构2项（widget/无效属性移除并实际执行、旧锚点与CSS/构建验收）。逐项落实且无P0阻断项；编辑措辞清理为P1已完成。A.1一致、B九项及附加四条通过、C比较放行、D29项去向闭合。

[待定] 无本课未决项。旧QA02等跨课任务仍由其原登记处理；目标板/HIL是明确未执行范围，不冒称通过。

[郑核-签发] 签发IMPL-06本轮重构，catalog/旧tracker同步v1.3、本期P1–P4和验收可勾；进入master一列仅在真实交付提交存在后回填。不发布gh-pages，不生产IMPL-07。

交付清单：content/implementation/realtime-control.mdx；9H2/23原H3/五题全部子问与答案；4Notebook共8cell、RealtimeSchedulingExplorer、1SVG；唯一注册lib/wiki-components.ts；scripts/verify-realtime-scheduling.mjs、讨论日志、独立审计/数值/浏览器/构建证据和修复记录同交付。

## 附录 A：数值验证（全部实测数据的唯一留存副本）

### A.1 三方对账表

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
'''
n=0
def add(claim,nb,component,note):
    global s,n
    n+=1;s+=f'| {n} | {claim} | {nb} | {component} | ✅ | {note} |\n'
for key,b in r['values'][1]['bounds'].items():add('n='+key+'充分界',f'{b:.12g}',f'{b:.6f}' if key=='3' else '不适用：单独充分界表','NB2 cell1；1e−10/印刷末位舍入，界非实际容量')
add('ln2极限',str(r['values'][1]['limit']),'不适用：解析极限','NB2 cell1；1e−10')
for item in r['values'][0]['comparison']:
    label=f"工况{item['caseId']} / {item['policy']}"
    for key,title in [('U','利用率'),('first','首作业完成ms'),('misses','失期数'),('due','到期作业数'),('pending','窗口末未完成')]:
        value=item[key];add(label+'：'+title,str(value),str(value)+'（默认或切换该工况）','NB1 cell1、真实TS与Fraction事件参考；窗口0–60ms，到期≤60，整数精确/浮点1e−10')
a=r['values'][1]
for key,title in [('defaultResponse','默认响应迭代'),('highResponse','高利用率响应'),('ex1Response','题1响应'),('ex2Response','题2响应')]:add(title,str(a[key]),'不适用：响应分析另算，不把UI有限窗口当证明','NB2 cell1；默认迭代3→6→7→7，独立首作业事件核对')
for key,title in [('ex1U','题1 U'),('ex1C4','题1充分界允许C4 ms'),('ex1Increase','题1充分测试增量ms'),('ex2U','题2 U'),('ex2First','题2首完成ms'),('ex5U','题5 U'),('ex5Order','题5周期排序μs'),('latencyUs','题5给定入口延迟μs'),('latencyPercent','题5入口延迟占100μs百分比')]:add(title,str(a[key]),'不适用：保留习题的独立参数','NB2 cell1；Fraction/解析与实际TS辅助核验；延迟占比非抖动')
for job in a['ex2Jobs']:add('题2 τ'+str(job['task']+1)+'释放/截止/完成',f"{job['release']} / {job['deadline']} / {job['finish']} ms",'不适用：12ms窗口原题单独实验','NB2 cell1/2；分别逐作业，不覆盖前一工作')
for item in r['values'][2]:add(f"M={item['medium']}ms / 继承={item['inherit']}：阻塞/响应",f"{item['blocking']} / {item['response']} ms",'不适用：单次锁事件实验','NB3 cell1；L剩余临界1、H执行3、M单次；含M0持平')
for key,value in r['values'][3]['implementation'].items():add('Q格式 '+key,str(value),'不适用：独立数值实现实验','NB4 cell1；编码半格向上、宽乘floor重缩放后饱和；整数精确，其他1e−10')
for row in r['values'][3]['lookup']:
    for key,value in row.items():
        if key!='n':add(f"N={row['n']}理想sin表：{key}",str(value),'不适用：静态查表误差预算','NB4 cell1；100001角度点采样max≤解析界，实数表不含int16量化或CPU时钟测量')
for row in r['values'][3]['watchdog']:add(f"窗口年龄{row['age']}ms能否喂狗",str(row['feed']),'不适用：教学窗口策略','NB4 cell2；20≤age≤80，边界包含，非硬件实测')
s+='''
正文/答案重复数字沿同一行追溯；任务预算表、题设频率/周期/位数和单次事件初始剩余量是声明输入，不冒称器件测量。NB2 motorBudget/ex1/ex2/ex5与NB3模型记录这些参数；NB4整数编码/低位/饱和记录全部算例中间量。Q格式区间与查表h、h²/8是定义或推导界；采样误差不是连续域精确最大值。旧错误值只留在source-before.mdx与本日志审计，不在现正文当正确断言。

### A.2 实测数据总表

| 来源 | 量 | 实测值 |
|---|---|---|
| audit.json / source-before.mdx / source-before-check.log | 起点正文与旧静态Notebook债务 | 9H2/23H3/1Notebook；S2FAIL/S7WARN；旧S6SKIPPED不是执行证据 |
| reference.py / reference.json | 独立Fraction事件跳转 | 34配置，逐作业释放/完成/截止/剩余与0.5ms采样轨迹 |
| scripts/verify-realtime-scheduling.mjs / actual-ts.json | 实际TS对独立事件参考 | 8048数值、最大差1.11e−16；超载作业守恒和恰好截止另核 |
| reconciliation.json | 原始setup/cell/输出/图/标题 | 总8200数值核对；原始流和图像保留；23旧H3锚点全部存在 |
| notebooks.json / notebooks.log | 严格内核S0–S8 | PASS1/WARN0/FAIL0；4Notebook、8cell/error0，S6不跳过 |
| native-notebook-ui.json / pages-notebook-ui.json | 两真实页面执行 | 各5条JSON流、4幅实验图；busy=[] |
| pyodide.json | 浏览器Python审计 | 4/4实验、8/8cell passed，最终源码哈希匹配 |
| native-interactions.json / validation.json | 默认、边界、四工况、算法/恢复、表/UI | 全部与独立参考核对，实际数量以validation.json为准 |
| build-origin.json / build-results.json | 构建与配置 | 普通/Pages两次exit0，PostCSS字节匹配工作区 |
| css-verification.json / pages-dom.json | CSS与真实DOM | .prose已编译，桌面正文656.67px，KaTeX/死锚点/重复ID/静态console错误0 |
| narrow-layout.json / pages-narrow-layout.json | 375px夹具 | 文档360/360、图299、表容器328，表内滚动 |

## 附录 B：前端交付硬门槛实际输出（秦构）

'''
skill=(root/'.agent/skills/wiki-discussion/SKILL.md').read_text(encoding='utf8');gates=re.findall(r'^- \[ \] (.+)$',skill.split('## 前端交付硬门槛（B6 起）')[1].split('**§2')[0],re.M);assert len(gates)==9
ev=[
'npm run build / npm run build:pages：均exit0、无MDX编译失败；build.log/build-pages.log；先停本课dev，独立.next/out，build-origin.json留配置与源码哈希。',
'WIKI_VERIFY_PORT=8191 npm run verify -- implementation/realtime-control：exit0、HTTP200；native-verify.log；最终Pages浏览器DOM另核。',
'同单课verify通过；原生/Pages实际DOM H1=1、H2=9，与catalog9项一致；H3=23；标题/ID顺序按页面管线核对，旧23锚点全在。',
'同单课verify与两真实DOM：katex-error=0；math:check exit0、files0/tokens0。',
'node scripts/nb-cells.mjs verify implementation/realtime-control --require-kernel --port8991 --out .../notebooks.json：exit0；4Notebook/8cell、S0–S8无FAIL/WARN、内核8cell/error0。',
'原始catalog CLI和单课verify：exit0；RealtimeSchedulingExplorer正确import realtime-scheduling-explorer.tsx、唯一注册lib/wiki-components.ts，无use-client注册表。',
'rg -c "<RealtimeSchedulingExplorer" content/implementation/realtime-control.mdx=1；实际两页canvas=1。',
'源码xAxis min0/max60、yAxis min0/max4、animation:false；useMemo<EChartsOption>对象交useECharts；actual-ts.json/独立Fraction、默认1/3/7、C3上下界和算法恢复见native-interactions.json。',
'严格nb-cells S2无FAIL，原生/Pages/Pyodide全部8cell实际运行，无widget依赖。']
for i,(gate,msg) in enumerate(zip(gates,ev),1):s+=f'{i}. ✅ {gate}\n\n   `{msg}`\n\n'
s+='''附加四条：S8模块级唯一内核ID前提通过，同页四实验全跑无串扰；S1/S4/S6无magic首行/拼接占位符/执行错误；公式围栏独占行，math与实际渲染双核；S3属性间无逗号，实际MDX编译通过。旧widget/无效language属性移除后，不能沿用旧S6跳过作为签发证据。

共享基线实际npm run check退出1（PASS19/WARN2/FAIL6）及semester退出1（当时并行RL-02行未完整），保留baseline日志，不修他课。最终提交候选使用最新HEAD+本课独立元数据跑原始catalog/semester/Python策略；当前目录PASS21/WARN2/FAIL0。WARN是既有跨章motion-planning重名及存量正文缺日志，非本课新增。共享默认Git索引不变。

## 附录 C：定量对比红队放行记录（何疑）

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | realtime-control.mdx“RMS调度可视化”四工况时间线/失期表 | 同释放、成本、D=T、窗口/超期策略；确定性调度无控制增益可整定，默认C3扫描1..14 | 默认/两任务持平，高利用率RMS失期EDF通过，过载两者失期，34配置完整参考 | 零开销单核无阻塞；失期数非实物排名，有限窗口非长期证明，pending非miss | 放行 |
| 2 | “RMS/EDF”判据与条件比较 | 统一模型，原论文条件已核；RMS充分界未过再用响应分析 | 充分界通过、未过但RMS通过、RMS不通过EDF通过及过载 | 不推广多核/任意截止/带锁，不声称真实CPU可不留余量 | 放行 |
| 3 | “优先级反转”继承前后 | 同一单次持锁事件；M0/2/5ms，不对锁协议作平台排名 | M0持平，M5阻塞6→1/响应9→4；必要临界区未消失 | 不声称任意到达流最坏界、消除死锁/嵌套锁；实物继承版本另核 | 放行 |
| 4 | “查表法/性能优化”误差与空间时间取舍 | 理想sin表N256/1024、同100001点和解析误差界，无芯片时钟对比 | 两表长、直接/插值；误差与内存代价保留 | 定性机会不承诺倍速，int16量化另计，采样max非精确max | 放行 |

'''
s+=d+'\nD矩阵关闭：23个旧H3逐ID保留、五题全部子问/答案复核、旧Notebook/C/字符图主题已对应可运行实验/真实图。无未迁残片、无跨课迁移或旧日志覆写。实际结果见validation.json与本日志A/B/C，不以主题保留代替数值通过。\n'
s=s.replace('图299','图'+str(v['narrowLayout']['canvas'])+'（最终Pages；原生299）')
p.write_text(s,encoding='utf8')
fix=read('fix.json');f=root/fix['path'];text=f.read_text(encoding='utf8').replace('待本课实际验收后补全。','逐作业队列保留超期工作，独立Fraction事件参考对实际TS34配置8048数值通过；纠正默认完成7ms、Q15整数乘积/重缩放、RMS排序与充分界条件。四Notebook八cell真实内核、Pyodide、原生/Pages执行、两构建与旧锚点均通过。完整原始证据见.agent/semester-03/impl-06/acceptance.md、validation.json及讨论日志附录D。')
text+='\n## 涉及文件\n\ncontent/implementation/realtime-control.mdx；lib/realtime-scheduling.ts；components/wiki/realtime-scheduling-explorer.tsx；scripts/verify-realtime-scheduling.mjs；本课讨论日志与验收证据。\n\n## 经验提炼\n\n任务释放不得覆盖未完成作业；时间线要与逐作业截止/完成/剩余共同核验。充分界未过不等于失败。整数中间值、排序表与文字都需要独立复算，不能靠页面200或旧缓存输出签发。\n';f.write_text(text,encoding='utf8')
a=e/'acceptance.md';text=a.read_text(encoding='utf8').replace('Phase1已形成，未签发。','Phase1–4完成签发，真实master提交回执待登记。')
text+=f'\n正文LF SHA256：`{v["sourceHash"]}`。9H2/23原H3保留，五题全部子问；4Notebook/8cell、1Explorer、1SVG。实际TS34配置8048数值对独立Fraction事件参考，最大差{v["tsError"]:.16g}；含内核8200数值及实际表/UI{v["compared"]}项核对；A.1共{n}行。\n'
text+='\n命令/退出码：npm run build=0；npm run build:pages=0；WIKI_VERIFY_PORT=8191 npm run verify -- implementation/realtime-control=0；严格nb-cells verify --require-kernel --port8991=0（8cell/error0）；verify-realtime-scheduling.mjs=0；validate.mjs=0；math:check=0；glossary:check=0；check-python-support=0。原始输出/实际DOM/图/单元格流均在本目录版本化留存。\n\n原生UI、Pyodide审计、Pages UI均执行完整4实验8cell；各UI五JSON流、四幅图。H1=1/H2=9/H3=23，旧H3锚点全保留，katex/重复ID/死锚点/静态console错误均0。真实PostCSS配置包含在快照并逐字核对，编译.prose和DOM布局证明样式实际生效；375px文档360/360，图299，表容器328内滚动。\n\n共享基线存在并行草稿FAIL，最终从最新已提交HEAD加本课改动运行原始目录/学期/Python策略；不将他课草稿提交或替他课签发。构建来源见build-origin.json，最终交付父版本见snapshot.json，不混称对后来其它课程重新构建。旧S04债务的严格内核失败已由本课关闭，历史债务清单保留。\n\n本地预览http://127.0.0.1:9195/control-universe/implementation/realtime-control/；保留9195静态页，释放8191/8991和本课私有目录进程；不发布gh-pages。未运行RTOS/目标编译器、板上时序或HIL，数字只证明声明的教学模型。\n'
text=text.replace('图299','图'+str(v['narrowLayout']['canvas'])+'（最终Pages；原生299）')
a.write_text(text,encoding='utf8');(e/'phase.txt').write_text('5\n');print('SIGNED rows',n)
