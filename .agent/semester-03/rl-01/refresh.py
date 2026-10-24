"""Apply only RL-01's metadata to the selected tree; never copy shared files wholesale."""
import pathlib,re,json,sys
root=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else '.')
def read(p): return (root/p).read_text(encoding='utf-8')
def write(p,s): (root/p).write_text(s,encoding='utf-8',newline='\n')
source=read('content/rl-control/rl-basics.mdx')
heads=re.findall(r'^## (.+)$',source,re.M)
path='content/catalog.ts';s=read(path)
start=s.index('        "slug": "rl-basics",');end=s.index('\n      },',start)
block=s[start:end]
block=re.sub(r'"status": "[^"]+"','"status": "draft"',block)
if '"subsections"' not in block:
    subs=[{'slug':h.lower(),'title':h} for h in heads]
    # Rendered headings correct mixed Latin casing in canonical IDs.
    block+=',\n        "subsections": '+json.dumps(subs,ensure_ascii=False,indent=2).replace('\n','\n        ')
block=block.replace('"id":','"slug":')
block=block.replace('"参考答案"','"答案"')
s=s[:start]+block+s[end:];write(path,s)
path='lib/wiki-components.ts';s=read(path)
if 'import { RlProblemExplorer }' not in s:
    s='import { RlProblemExplorer } from "@/components/wiki/rl-problem-explorer";\n'+s
if '\n  RlProblemExplorer,' not in s:
    s=s.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  RlProblemExplorer,')
write(path,s)
path='.agent/semester-03-plan.md';s=read(path)
checklist=read('.agent/semester-03-checklist.md')
rows=re.findall(r'^\| ([A-Z]+-\d+) \| (\[[ x]\] \| ){0}',checklist,re.M)
previous=[]
for line in checklist.splitlines():
    parts=[p.strip() for p in line.split('|')[1:-1]]
    if len(parts)==8 and re.fullmatch(r'[A-Z]+-\d+',parts[0]):
        if parts[0]=='RL-01': break
        if parts[6]!='[x]': previous.append(parts[0])
if '| RL-01 |' not in s.split('<!-- S3-ORDER-EXCEPTIONS-END -->')[0]:
    row='| RL-01 | '+';'.join(previous)+' | 2026-10-24用户指定继续RL-01，rank8；其它会话并行，暂缓未完成前课；仅依赖三门已交付先修 | .agent/semester-03/rl-01/acceptance.md |\n'
    s=s.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'<!-- S3-ORDER-EXCEPTIONS-END -->')
write(path,s)
path='.agent/semester-03-checklist.md';s=read(path)
s=re.sub(r'^\| RL-01 \|.*$', '| RL-01 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/14-rl-control/01-rl-basics.md;.agent/semester-03/rl-01/acceptance.md;rank8独立副本进行中 |',s,flags=re.M)
write(path,s)
print('RL-01 metadata applied',len(heads),'H2;',len(previous),'unfinished predecessors preserved')
