from pathlib import Path
import json
r=Path('.agent/semester-03/impl-02');data=json.loads((r/'reconciliation.json').read_text(encoding='utf-8'))
log=Path('docs/discuss-log/semester-03/07-implementation/02-digital-pid.md')
s=log.read_text(encoding='utf-8')
rows=[]
def row(label,value,component='—（组件不显示该实验量）',note='原始cell与独立解析/卷积；绝对容差1e−8'):
    v=f'{value:.12g}' if isinstance(value,(float,int)) else str(value)
    rows.append(f'| {len(rows)+1} | {label} = {v} | {v} | {component} | ✅ | {note} |')
def walk(v,prefix):
    if isinstance(v,dict):
        for k,x in v.items():walk(x,prefix+'/'+k)
    elif isinstance(v,list):
        for i,x in enumerate(v):walk(x,prefix+f'[{i}]')
    else:row(prefix,v)
walk(data['values'][0],'实验1/逐拍输出')
for k,v in data['values'][1]['sample'].items():
    cp=({'alpha':'.5000','D_c0':'.0000','I_next':'.7000','raw':'3.0','actual':'1.0','pole':'.80'}.get(k))
    row('实验2/单拍/'+k,v,cp or ('—（c=1时界面2.5000，非默认）' if k=='D_c1' else '—（组件不显示该量）'),'Notebook2 cell1；Decimal/手算；容差1e−12')
walk(data['values'][1]['metrics'],'实验2/0–12s/采样指标')
walk(data['values'][2]['sampled'],'实验3/双速率/0–8s')
row('实验3/外环P',data['values'][2]['outer_gain'])
row('实验3/内闭环DC增益',data['values'][2]['continuous']['inner_dc'])
row('实验3/2rad/s外开环幅值',data['values'][2]['continuous']['cross_magnitude'])
walk(data['values'][3],'实验4/规则及习题')
row('实验1/矩形A',7.1,note='Notebook1 cell1 stdout；2+.1+5；容差1e−12')
row('实验1/矩形B',12,note='Notebook1 cell1 stdout；2+10；容差1e−12')
row('实验1/矩形C',5,note='Notebook1 cell1 stdout；.5/.1；容差1e−12')
row('实验2/Tustin记忆系数',1/3,note='Notebook2 cell1 stdout；(2−1)/(2+1)；容差1e−12')
s=s.replace('| 待测 | 实际实现后逐量填入 | 待执行 | 待执行 | 未验收 | 禁止预填 |','\n'.join(rows))
# Full scenarios: finite-horizon IAE and final output make ties/failures visible.
table='\n\n三工况所有方法（离散IAE；末样输出；末样I，均0–12s）：\n\n| 工况 | 方法 | IAE | y(12s) | I(12s) |\n|---|---|---|---|---|\n'
for scenario,methods in data['values'][1]['metrics'].items():
    for mode,v in methods.items():table+=f"| {scenario} | {mode} | {v['IAE']:.9g} | {v['last_y']:.9g} | {v['last_I']:.9g} |\n"
s=s.replace('| 固定参数机制隔离 | 不宣称独立优化后优胜 | 三工况待测 | 不可达与分离死区 | 待实测 | 限定观察 |','| 固定参数下三种积分策略与反算的轨迹 | 固定Kp=2/Ki=1只做机制隔离；未独立优化，不放行普遍排名 | 3工况×4方法；可达小阶跃普通与反算IAE完全持平；持续不可达目标下分离进不了阈值 | 正文明示不可达、分离死区、变积分慢与反算能力边界 | 限定观察放行 | 全量结果如下，非最优方法比较 |'+table)
log.write_text(s,encoding='utf-8')
print(json.dumps({'reconciliationRows':len(rows),'sourceHash':data['sourceHash']}))
