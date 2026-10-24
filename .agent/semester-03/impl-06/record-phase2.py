from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[3];e=Path(__file__).resolve().parent
p=root/'docs/discuss-log/semester-03/07-implementation/06-realtime-control.md';s=p.read_text(encoding='utf-8');assert '## Phase 2' not in s
s+='''
## Phase 2: 内容生成

### 第一轮 — 概念讲解

[何仿] 先完成独立Fraction事件跳转参考，与实际TS0.5ms循环对34配置核验，包含C3=1..14、RMS/EDF四工况。默认首完成1/3/7；过载时保留积压作业，统计到期/错过/窗口末未完成。所有图使用原始时间轴，空闲段不伪装任务运行。

[周联] 依据旧审计重构九H2、保留23个H3主题与入口。三项理论错误分别改为：充分界非实际容量；零开销假设下不能用上下文开销解释0.693；EDF的U≤1限定D=T独立可抢占单核。加入响应时间迭代帮助解释充分界未过却可行的原题。

[苏绘] 旧字符时序图被真实SVG/可计算甘特图替代。四Notebook八cell静态出图，交互独立由React控制。Notebook保留静态Python复算，删language无效属性及widget依赖。

### 第二轮 — 学生反馈

[林码] 高利用率工况EDF“零失期”同时“末未完成1”，看上去矛盾，需要明确只统计截止≤60ms的作业；任务与作业不能混叫。Q15输入舍入与乘积重缩放采用不同规则，也需要明确位置，不能只说“右移”。

[赵工] 原题4没有周期/到达约束却给“最坏响应”，现在应限定单次释放；500MHz/几周期硬件表不能从型号推实物结论。题5的固定入口延迟占比不等于抖动，DMA消费者被追上和旧喂狗标志也必须写失败边界。

### 第三轮 — 调整完善

[周联] 调度可视化前补“只统计到期作业”与“末未完成不必失期”；题4补t0时L已持锁、临界区剩1ms、H/M单次就绪条件，正文和答案分列阻塞6→1与响应9→4。Q15节明确输入最近舍入/半格向上、乘积floor重缩放后饱和，保留(−1)平方边界。

[柯验] 实际原始4setup/8cell已在干净内核执行；实际TS34配置8048个数值对独立事件参考最大差1.11e−16。旧Q15正确乘积257696727、缩放7864，默认完成7ms；原题1响应0.5/1.5/3.5/7.5ms已核。保留旧稿错误值时明确标旧错，不作现有断言。

[秦构] 起点静态验收S2 FAIL、S7 WARN已保留source-before-check.log，旧S6为SKIPPED，不冒充旧内核运行。新稿以严格内核和真实UI重测；H3旧锚点用同一渲染管线逐个核对，不能只比标题文字。

## 附录 D：起点审计与保留/纠错矩阵

起点commit、旧稿LF哈希、914行原文与标题清单见audit.json/source-before.mdx（实际行数以audit.json为准）。原URL不变，无迁移残片、无旧日志继承；旧课主标题“实时控制实现”按catalog统一为“实时控制”，其余旧H2/H3入口按渲染管线核保留。正文/答案/Notebook/组件的调度参数来自同一合同，独立参考不调用TS实现；硬件无来源倍速和周期数字删去，工程主题保留。

| 原位置/资产 | 审计证据 | 保留/纠错/重写/迁移/拆分/删除 | 目标位置/去向 | 验证方式 |
|---|---|---|---|---|
'''
audit=json.loads((e/'audit.json').read_text(encoding='utf-8'))
notes={
'实时 ≠ 快':'固定执行不等于满足截止；补作业/响应/端到端时刻',
'硬实时、软实时与 Firm 实时':'保留分类；纠正按回路类型一刀切与违约必灾难',
'WCET：最坏情况执行时间':'观测最大值不冒充上界；干扰不得重复计入',
'实时抖动与 ZOH 延迟的关系':'删除通用1%门槛与任意抖动ωΔT/2保证；保留时序预算',
'Rate-Monotonic Scheduling（RMS）':'修充分界解释、假设与谐和任务误说；补响应分析',
'EDF（Earliest Deadline First）':'限定D=T单核；删RTOS普遍排名与过载一概而论',
'调度分析示例':'保留5/10/20与1/2/3；修第三首完成6→7',
'RMS 调度可视化':'替换覆盖积压/重复画错行/短窗口widget；逐作业守恒、React与Notebook',
'优先级反转':'补单次到达与锁前提；分阻塞/响应；继承非消除所有阻塞',
'中断延迟与抖动':'删无来源型号周期表；保留题设168MHz/20周期换算，非抖动保证',
'DMA 与双缓冲':'保留工作交接；纠正永不同时访问保证，补追上/缓存条件',
'定点数运算':'保留Q格式/加乘/扩展；修整数乘积与窄化回绕，明确舍入/饱和',
'查表法':'保留sin/cos/索引/空间时间取舍；删无依据周期/百分比；补解析界与采样误差',
'看门狗定时器':'保留独立/窗口主题，旧永久标志喂狗示意改进展/新鲜度检查',
'算法级优化':'保留四路线；修n²/nnz复杂度，PID状态与电气动态条件',
'硬件级优化':'保留DSP/FPU/FPGA/TCM/多核；删普遍倍速/单周期FOC/唯一方案',
}
for heading in audit['h3']:
    note=notes.get(heading,'保留主题并补条件/证据，删无环境的普适性能保证')
    s+=f'| H3：{heading} | source-before.mdx同标题节 | 保留/纠错：{note} | 原H2内同名H3 | reconciliation.json旧锚点、正文复核、适用Notebook/浏览器 |\n'
for i in range(1,6):s+=f'| 原习题{i}及全部子问/答案 | source-before.mdx习题/答案{i} | 保留并纠错，参数沿用；题4补事件前提 | 习题{i}/答案{i} | NB2（题1/2/5）、NB3（题4）、NB4（题3）及独立参考 |\n'
s+='| 旧Notebook及C/ASCII图 | source-before-check.log：S2FAIL/S7WARN；剩余工作被释放覆盖 | 算例纠错重写，正确主题与数值用途保留；原C危险窄化示例改可执行Python约定 | 四Notebook/Explorer/SVG；原代码仍可由起点快照追溯 | 原始cell真内核+Pyodide+实际TS；图/锚点DOM |\n'
s=s.replace('914行原文与标题清单',str(audit['lines'])+'行原文与标题清单')
p.write_text(s,encoding='utf-8');(e/'phase.txt').write_text('2\n');print('Phase2 recorded; D rows',len(audit['h3'])+6)
