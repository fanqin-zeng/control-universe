"""Sign only after the numeric, kernel, UI, CSS and build evidence passes."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[3];e=Path(__file__).resolve().parent
read=lambda p:json.loads((e/p).read_text(encoding='utf-8'))
v=read('validation.json');assert v['pass'];run=read('reconciliation.json');ref=read('reference.json')
log=root/'docs/discuss-log/semester-03/07-implementation/05-embedded-implementation.md'
s=log.read_text(encoding='utf-8');assert '## Phase 3' not in s
s+='''
## Phase 3：内容审校

### 教授团队（学术准确性）

[周联] 查模型单位、精确保持、采样编号和P控制平衡关系。端点ADC重建步长100/(2^N−1)与旧中点量化器不同，正文已显式区分；不过载误差界不覆盖105°C裁剪。理想接口保留限幅，P静差和量化轨迹差分别解释。默认和110°C的有限末温均未声称等于平衡点。

### 工程团队（实践可行性）

[何仿] 实验共27配置，三目标/三位数/三时隙，100次精确更新，包含初始与终端点。过期和重复事件输出0，拒绝时不推进已接受序号；500μs预算与控制周期不同。时间和序号回绕均依赖半范围假设。赵工复核：PWM抽象命令不照抄寄存器；一致快照、DMA/缓存和实际保护需平台验证，C片段不冒称驱动或目标编译器实测。

### 验证团队（独立把关）

[柯验] 实际调用lib/embedded-control.ts，对Decimal55位独立参考核27配置、19308数值，最大绝对差8.526512829121202e−14；三Notebook原始setup/6cell真内核执行无错，再在原生页面、Pyodide审计及Pages页面全量执行。整数、端点、PWM半格、重复/旧/过期及回绕边界均核验。页面/正文表格/UI输出463项另核，完整数据见A.2。

[秦构] 两构建exit0，实际配置postcss.config.mjs完整。构建前精确字节闸门发现Git LF与工作区CRLF差别，确认归一化文本相等后复制工作区配置，保留字节闸门；未引入语义更改。原生/Pages H1=1、H2=9、katex-error=0、重复ID=0、失效锚点=0；最终静态console error=0，SVG带basePath，浏览器三实验各两cell、三图均实际输出。DOM与预期渲染管线的标题/ID顺序一致。

[何疑] 同对象/初值/增益/限幅的理想接口仅是去量化的机制对照，不声称最优控制器或硬件排名；20°C持平，110°C不能达到目标。三目标完整保留，更多位数不被说成总精度或所有指标的保证。放行范围见C。

### 体验与脉络（读者、历史与安全）

[郑核代陆阅] 开篇具体到恒温箱20°C、程序51、37%命令，问题与后文接口转换一一对应。学生反馈落实到端点/中点差别、500μs预算、PWM寄存器与快照。SVG以箭头连接信号，不用等宽文本冒充图。最终375px文档宽与滚动宽均360，canvas299、表容器328、表496.85，宽表内滚动；桌面正文656.67px。四份档案齐备。

### 教学支持（教学质量）

[孙助] 四题分别检验编码/过载、首拍/PWM、P静差/不可达/持平、时间/序号/一致快照；答案都有推导与Notebook输出支撑。

[郑核] 术语/符号对照表已查：y为输出、ŷ重建输出、Ts采样周期、Kp比例增益；N只作本课ADC位数，M只作PWM时隙数，L_adc和q_adc加下标避免与一般长度/权重/量化器名称混淆；温度与占空比的单位分别说明。无需修改全局符号表。glossary检查exit0，三条既有WARN保留日志。

### 学生审校（可读性）

[林码] 能按51→20°C→40°C误差→1.2未限幅→100命令复述首拍；码值255不代表可区别所有过载温度。序号去重和年龄检查都在完整快照之后。

[赵工] 知道理想接口到不了60°C来自P静差，110°C又超加热能力；二者不能靠提高ADC位数解决。知道本课证据只到主机与浏览器，目标程序/板上/HIL仍需自己按表实测。

## Phase 4：内容定稿

[郑核] Phase2学生反馈4项P0均已落实：端点约定、消费预算、PWM抽象端点、拒绝策略与一致快照；实现反馈1项P0（Notebook模板格式）已修并真实重跑；编辑反馈1项P1（重复变形式）已简化且哈希证据重建。无P0阻断项。九项与附加四条均有实际输出，A.1全部一致，C限定观察放行。

[待定] 无影响本课正确性或可运行性的未决项。QA02旧课样式复核由既有任务跟踪，不由本课冒认完成；不扩展到IMPL-06。

[郑核-签发] 本课新写签发；先修/讲解/习题/原始执行/实际组件/构建/样式均有证据。catalog与旧tracker可同步v1.3，进入master一列等待真实交付提交，不能预填hash。

交付清单：content/implementation/embedded-implementation.mdx，9个H2、3个Notebook共6cell、1个Explorer、1幅SVG、4题及答案；注册唯一来源lib/wiki-components.ts；数值复核scripts/verify-embedded-control.mjs；进度与验收同本课提交。未执行板上/HIL，未发布gh-pages。

## 附录 A：数值验证（全部实测数据的唯一留存副本）

### A.1 三方对账表

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
'''
n=0
def add(claim,nb,component,note):
    global s,n
    n+=1;s+=f'| {n} | {claim} | {nb} | {component} | ✅ | {note} |\n'
budget=run['values'][0]['budget']
for key,label in [('step8','8位步长°C'),('bound8','8位半步界°C'),('step12','12位步长°C'),('bound12','12位半步界°C'),('pwmHalf100','PWM半格占空比'),('code20','20°C码值'),('code50','50°C码值'),('pwm37','0.37→PWM'),('pwmHalf','0.375→PWM'),('pwmFull','1→PWM')]:
    add(label,str(budget[key]),str(budget[key]) if key=='code20' else '不适用：独立转换向量，不在面板单列','NB1 cell1；输入由原始cell声明；整数精确/浮点1e−10')
for x in [20,50,105]:
    c=next(c for c in ref['conversions'] if c['bits']==8 and c['input']==x)
    add(f'8位输入{x}°C→码/重建°C',f"{c['code']} / {c['read']:.12g}",'51 / 20' if x==20 else '不适用：转换/过载向量','NB1 cell1；105°C重建误差−5°C，非不过载界')
for key,label in [('firstPWM','首拍PWM'),('firstY','下一拍温度°C'),('finalY','10s量化末温°C'),('finalIdeal','10s理想接口末温°C'),('maxGap','窗口最大轨迹差°C'),('saturated','命令越限拍数')]:
    value=ref['default'][key];add(label,f'{value:.12g}',f'{value:.6f}' if isinstance(value,float) else str(value),'NB2 cell1；默认8位/M100/r60；UI容差5.1e−7，原始1e−10')
for c in [c for c in ref['cases'] if c['slots']==100]:
    for key,label in [('finalY','量化末温'),('finalIdeal','理想末温'),('maxGap','最大轨迹差'),('saturated','越限拍数')]:
        value=c[key];add(f"表格r={c['target']} / N={c['bits']}：{label}",f'{value:.12g}',f'{value:.6f}（切换相应参数）','NB2 cell1；k=0..100，末点t10s；表8位小数5.1e−9')
for key,label in [('equilibrium','理想未饱和平衡温度°C'),('offset','默认P控制静差°C')]:add(label,str(run['values'][1][key]),'不适用：解析平衡点不冒充面板有限末值','NB2 cell1，解析164/3.4及60减该值，1e−10')
for i,row in enumerate(run['values'][2]['events']):add(f'事件{i+1}：年龄/结果/输出',f"{row['age']}μs / {row['reason']} / {row['pwm']}",'不适用：独立事件实验','NB3 cell1；输入序号/时戳/now均在原始cell，整数与实际TS完全相等')
for i,row in enumerate(run['values'][2]['boundaries']):add(f'边界{i+1}：年龄/接受/最后序号',f"{row['age']}μs / {row['accepted']} / {row['lastSeq']}",'不适用：独立事件实验','NB3 cell2；500/501μs、旧序号、最大序号回绕；整数完全相等')
s+='''
参数与单位声明（Ts0.1s、100更新、y0/环境20°C、满功率平衡100°C、Kp0.03/°C、三参考20/60/110、32位计数与半范围）是实验合同，不冒称实测硬件性能。首拍误差40/未限幅1.2由NB1码值和NB2默认模型直接复算，理想平衡方程由NB2同参数独立解析核验。正文与答案重复引用按同一行追溯；图中整数时轴端点由101行轨迹核对。

### A.2 实测数据总表

| 来源 | 量 | 实测值 |
|---|---|---|
| reference.py / reference.json | 独立Decimal55位参数网格及全轨迹 | 27配置，每组101端点，含有限窗口末值 |
| scripts/verify-embedded-control.mjs / actual-ts.json | 实际TS对独立参考 | 19308数值，最大绝对差8.526512829121202e−14 |
| reconciliation.json | 页面原始setup/cell、输出、渲染标题与数值 | 总19490个数值核验；全部原始流与图像输出保留 |
| notebooks.json / notebooks.log | S0–S8、真实网关执行 | PASS1/WARN0/FAIL0；6cell/error0；未跳过S6 |
| native-notebook-ui.json / pages-notebook-ui.json | 两实际页面输出 | 各4条JSON流、3幅实验图，busy=[] |
| pyodide.json | 浏览器Python原始执行 | 3/3Notebook passed，6/6cell passed；源码哈希匹配 |
| native-interactions.json / validation.json | 默认/边界/恢复、正文表、两UI全量输出 | 463项比较通过 |
| build-origin.json / build-results.json | 隔离快照来源、PostCSS、普通/Pages构建 | 两次exit0；实际配置哈希与工作区一致 |
| css-verification.json / pages-dom.json | 最终CSS/DOM | 编译后.prose存在，桌面正文656.67px，console error0 |
| narrow-layout.json / pages-narrow-layout.json / narrow.png | 375px夹具 | 文档360/360、canvas299、表容器328、表496.85px |

## 附录 B：前端交付硬门槛实际输出（秦构）

'''
skill=(root/'.agent/skills/wiki-discussion/SKILL.md').read_text(encoding='utf-8');part=skill.split('## 前端交付硬门槛（B6 起）')[1].split('**§2')[0]
gates=re.findall(r'^- \[ \] (.+)$',part,re.M);assert len(gates)==9
evidence=[
'`npm run build` / `npm run build:pages`：exit0、无MDX编译失败；build.log/build-pages.log，配置完整性见build-origin.json。先停本课8191服务器，独立.next/out。',
'`WIKI_VERIFY_PORT=8191 npm run verify -- implementation/embedded-implementation`：exit0，HTTP200；native-verify.log。最终Pages实际DOM见pages-dom.json。',
'同命令HTML项通过；原生与Pages实际article H1=1/H2=9；catalog9个subsections，validation.mjs还逐ID/标题顺序核验；死锚点/重复ID均0。',
'同命令与两浏览器实际DOM：katex-error=0；math:check exit0，违规files0/tokens0。',
'`node scripts/nb-cells.mjs verify implementation/embedded-implementation --require-kernel --port8991 --out .../notebooks.json`：exit0，3Notebook/6cell，S0–S8无FAIL/WARN；S6实际6cell/error0。',
'原始catalog CLI及单课verify均exit0；EmbeddedControlExplorer实际import来自embedded-control-explorer.tsx并唯一注册于lib/wiki-components.ts，无use-client注册表。',
'`rg -c "<EmbeddedControlExplorer" content/implementation/embedded-implementation.mdx`=1；两实际页面canvas=1，非孤儿。',
'源码xAxis min0/max10、yAxis min15/max120，animation:false；useMemo<EChartsOption>对象传入useECharts；actual-ts.json与Decimal独立参考通过，默认/上下界/恢复实测见native-interactions.json。',
'同严格nb-cells命令S2无FAIL；实际内核与原生/Pages UI均完成全部6cell，无widget依赖。']
for i,(gate,ev) in enumerate(zip(gates,evidence),1):s+=f'{i}. ✅ {gate}\n\n   {ev}\n\n'
s+='''附加四条：①S8结构前提通过，同页三实验实际全跑无变量串扰；②S1/S4/S6无magic首行、无残留占位符、无执行错误；③显示公式围栏独占行，math:check=0且两页数学错误0；④S3无JSX属性间逗号，实际MDX编译及两构建通过。原始输出均为本目录版本化文件，不以临时日志作唯一依据。

共享基线实际命令：npm run check退出1（PASS19/WARN2/FAIL6），包括并行autonomous-driving打勾/状态暂不同步及统计漂移；全局semester命令退出1，记录当时RL-02列数临时不完整。未修他课。隔离HEAD+本课的原始catalog CLI最终PASS21/WARN2/FAIL0、exit0，作用域学期校验errors=[]；提交前再以最新HEAD复验。现存两WARN为跨章motion-planning重名及旧正文缺日志，非本课新增。

## 附录 C：定量对比红队放行记录（何疑）

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | embedded-implementation.mdx“量化进入反馈以后”：理想接口/ADC-PWM轨迹差与完整表格 | 限定机制观察；同对象、初值、Ts、P增益与限幅，仅去输入/输出量化；不是最优控制器比较，无胜出排名 | 3目标×3位数×3时隙；正文M100完整9行；20°C持平，110°C不可达 | 无噪声/延迟/器件误差，有限10s窗口；P静差与量化分开，未声称位数对所有指标单调改善 | 放行 |
| 2 | 同页“样本交接与时间戳”：新/重复/过期/回绕事件输出图 | 确定性同一接受策略；非调度方法比较；budget500μs固定 | 4事件与4边界，含500接受/501拒绝、旧序号、回绕 | 从一致快照开始，不验证同步原语或芯片性能；拒绝输出关闭是教学约定，实际需危害分析 | 放行 |

## 附录 D：保留与范围审计

旧采样课的量化节/实验/答案均未删、迁移或改写；tracker历史“待接收”通过新课独立接口扩展结清，材料留在原URL。先修控制器部署与数字PID已交付；实时调度留下一课。根工作区并行草稿与默认Git索引不入本课提交；最终交付快照基线和构建基线分别留存，不把后来其它课程算成本课构建实测。所有角色是审查视角，本课未调用外部专家或独立Agent。
'''
log.write_text(s,encoding='utf-8')
p=e/'acceptance.md';a=p.read_text(encoding='utf-8').replace('当前Phase1完成，尚未签发。','Phase1–4完成并签发，真实master提交回执待登记。')
a+=f'''
正文LF SHA256：`{v['sourceHash']}`。9个H2、3Notebook/6cell、1Explorer、1SVG、4题及答案。独立Decimal55位与实际TS27配置/19308数值，最大绝对差{v['tsError']:.16g}；含原始内核总19490数值、正文表/实际UI463项核验；A.1共{n}行。

命令/退出码：npm run build=0；npm run build:pages=0；WIKI_VERIFY_PORT=8191 npm run verify -- implementation/embedded-implementation=0；node scripts/nb-cells.mjs verify implementation/embedded-implementation --require-kernel --port8991=0（6cell/error0）；node scripts/verify-embedded-control.mjs=0；node .agent/semester-03/impl-05/validate.mjs=0；npm run math:check=0；npm run glossary:check=0；check-python-support=0。原始日志均在本目录。

实际原生UI、Pyodide审计与Pages UI分别执行完整3实验6cell；各UI有三幅真实图输出。H1=1/H2=9、katex/重复ID/死锚点/静态console错误均0。PostCSS实际配置含于快照，LF/CRLF等价已核、构建时字节一致；编译CSS与DOM证据见css-verification.json。桌面正文656.67px，375px夹具文档360/360、图299、表容器328/表496.85。

共享基线有并行草稿造成catalog FAIL6及semester RL-02暂时列数错误，原始输出保留；最终使用最新HEAD+本课合成元数据运行原始校验，不改或签发他课。构建基线见build-origin.json，交付基线以snapshot.json为准；两者差异仅归于并行其它课程，不冒称本课已重建后来版本。

预览：http://127.0.0.1:9194/control-universe/implementation/embedded-implementation/ 。保留9194本地静态预览，8191/8991及私有目录检查进程在任务后释放；不发布gh-pages。主机接口模型可复算；目标编译器、芯片驱动、板上时序与HIL均未执行。
'''
p.write_text(a,encoding='utf-8');(e/'phase.txt').write_text('5\n');print('SIGNED A.1 rows',n)
