"""Apply only RL-02 to a chosen tree, preserving other lesson records."""
import pathlib,re,json,sys
root=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else '.')
final='--final' in sys.argv
def read(p):return (root/p).read_text(encoding='utf-8')
def write(p,s):(root/p).write_text(s,encoding='utf-8',newline='\n')
heads=re.findall(r'^## (.+)$',read('content/rl-control/dynamic-programming.mdx'),re.M)
p='content/catalog.ts';s=read(p);a=s.index('        "slug": "dynamic-programming",');b=s.index('\n      },',a)
block=re.sub(r'"status": "[^"]+"','"status": "'+('v1.3' if final else 'draft')+'"',s[a:b])
block=re.sub(r',\s*"subsections":.*','',block,flags=re.S)
block+=',\n        "subsections": '+json.dumps([{'slug':h.lower(),'title':h} for h in heads],ensure_ascii=False,indent=2).replace('\n','\n        ')
write(p,s[:a]+block+s[b:])
p='lib/wiki-components.ts';s=read(p)
if 'import { BellmanValuesExplorer }' not in s:s='import { BellmanValuesExplorer } from "@/components/wiki/bellman-values-explorer";\n'+s
if '\n  BellmanValuesExplorer,' not in s:s=s.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  BellmanValuesExplorer,')
write(p,s)
checklist=read('.agent/semester-03-checklist.md');skipped=[]
for line in checklist.splitlines():
    row=[x.strip() for x in line.split('|')[1:-1]]
    if len(row)==8 and re.fullmatch(r'[A-Z]+-\d+',row[0]):
        if row[0]=='RL-02':break
        if row[6]!='[x]':skipped.append(row[0])
p='.agent/semester-03-plan.md';s=read(p)
if not re.search(r'^\| RL-02 \|',s.split('<!-- S3-ORDER-EXCEPTIONS-END -->')[0],re.M):
    s=s.replace('<!-- S3-ORDER-EXCEPTIONS-END -->','| RL-02 | '+';'.join(skipped)+' | 2026-10-24用户明确指定继续RL-02，rank8；保留并行前课，先修RL-01与变分法/动态规划已交付 | .agent/semester-03/rl-02/acceptance.md |\n<!-- S3-ORDER-EXCEPTIONS-END -->')
if final and '### RL-02执行回执' not in s:s+='\n### RL-02执行回执（2026-10-24）\n\n价值函数与贝尔曼方程从空占位按新写Phase1–4完成；沿用一次送餐解释V/Q，另设循环模型，十H2、双图Explorer与SVG、两Notebook四cell、四题四答。线性系统/矩阵幂/有限时域LP独立核真实TS，严格内核与最终Pyodide及Pages/375px验收见.agent/semester-03/rl-02/acceptance.md。残差按返回向量重算，收缩条件与gamma=1边界清楚；已知模型规划不冒充训练，不比较不同任务回报大小。rank8隔离副本/独立暂存保留并行修改；顺序例外单独登记，仅本课，不发布Pages、不生产RL-03，真实hash见全局checklist。\n'
write(p,s)
p='.agent/semester-03-checklist.md';s=read(p)
states=' | '.join(['[x]']*(5 if final else 1)+['[ ]']*(1 if final else 5))
s=re.sub(r'^\| RL-02 \|.*$',f'| RL-02 | {states} | docs/discuss-log/semester-03/14-rl-control/02-dynamic-programming.md;.agent/semester-03/rl-02/acceptance.md;rank8独立副本'+('验收完成待真实提交' if final else '进行中')+' |',s,flags=re.M);write(p,s)
if final:
    p='.agent/delivery-tracker.md';s=read(p);s=re.sub(r'^\| \[ \] 价值函数与贝尔曼方程 \(dynamic-programming\) \|.*$', '| [x] 价值函数与贝尔曼方程 (dynamic-programming) | semester-03 RL-02；证据 .agent/semester-03/rl-02/acceptance.md |',s,flags=re.M);write(p,s)
    p='.agent/semester-03/zh-lang-edit/PLAN.md';s=read(p);lines=s.splitlines()
    for i,line in enumerate(lines):
        if '| RL-02 |' in line:lines[i]=line.replace('| 待完成 | 待生产 | — |','| 已完成 | 待润色 | .agent/semester-03/rl-02/acceptance.md |')
    s='\n'.join(lines)+'\n';s=re.sub(r'当前\d+课完成学期3生产',f'当前{sum("| 已完成 |" in l for l in lines)}课完成学期3生产',s);write(p,s)
print('RL-02 metadata',len(heads),'H2', 'final' if final else 'draft')
