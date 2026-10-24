"""Update only RL-01 after all its acceptance evidence has passed."""
import pathlib,re,sys
root=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else '.')
def read(p):return (root/p).read_text(encoding='utf-8')
def write(p,s):(root/p).write_text(s,encoding='utf-8',newline='\n')
p='content/catalog.ts';s=read(p);a=s.index('        "slug": "rl-basics",');b=s.index('\n      },',a)
s=s[:a]+re.sub(r'"status": "[^"]+"','"status": "v1.3"',s[a:b])+s[b:];write(p,s)
p='.agent/delivery-tracker.md';s=read(p);s=s.replace('| [ ] 强化学习问题 (rl-basics) | |','| [x] 强化学习问题 (rl-basics) | semester-03 RL-01：九H2、两Notebook三cell、回报Explorer、四题四答；证据 .agent/semester-03/rl-01/acceptance.md |');write(p,s)
p='.agent/semester-03-checklist.md';s=read(p)
s=re.sub(r'^\| RL-01 \|.*$', '| RL-01 | [x] | [x] | [x] | [x] | [x] | [ ] | docs/discuss-log/semester-03/14-rl-control/01-rl-basics.md;.agent/semester-03/rl-01/acceptance.md;rank8独立验收完成，待真实master回执 |',s,flags=re.M);write(p,s)
p='.agent/semester-03-plan.md';s=read(p)
if '### RL-01执行回执' not in s:
 s+='\n### RL-01执行回执（2026-10-24）\n\n强化学习问题从空占位按新写Phase1–4完成，送餐机器人贯穿状态/动作/联合核/回报/策略与评估，九H2、两Notebook三cell、双图Explorer/SVG、四题四答。真实TS61206配置对独立Fraction概率树，严格原生内核与最终Pyodide、Pages基路径页面实跑和375px验收见.agent/semester-03/rl-01/acceptance.md。以rank8隔离副本避开共享.next及他课端口，提交只含本课。已知模型精确计算不冒充训练；错误奖励循环另设模型，含充电落败及持平工况。顺序例外单独登记，仅本课；W09原生UI连接债务、用户批阅与其它课程保持；不发布Pages、不生产RL-02。真实master hash在全局checklist登记。\n'
write(p,s)
p='.agent/semester-03/zh-lang-edit/PLAN.md';s=read(p)
lines=s.splitlines()
for i,line in enumerate(lines):
 if '| RL-01 |' in line:
  lines[i]=line.replace('| 待完成 | 待生产 | — |','| 已完成 | 待润色 | .agent/semester-03/rl-01/acceptance.md |')
s='\n'.join(lines)+'\n'
count=sum('| 已完成 |' in line for line in lines)
s=re.sub(r'当前\d+课完成学期3生产',f'当前{count}课完成学期3生产',s);write(p,s)
print('RL-01 final metadata written; no fabricated commit receipt')
