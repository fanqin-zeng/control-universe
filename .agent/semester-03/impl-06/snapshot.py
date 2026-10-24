"""Isolate exact HEAD + only IMPL-06; no shared cache/index mutations."""
from pathlib import Path
import subprocess,zipfile,io,shutil,json,re,os
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-06';target=root.parent/'control-universe-rank1-impl06-validation'
target.mkdir(exist_ok=True)
base=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
paths=['app','components','content','lib','public','scripts','docs','package.json','package-lock.json','tsconfig.json','next.config.mjs','postcss.config.mjs','mdx-components.tsx','.eslintrc.json','.agent/delivery-tracker.md','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03-baseline.json','.agent/fix-logs','.agent/skills/wiki-discussion/personas.md','OUTLINE.md']
known=set(subprocess.check_output(['git','ls-tree','-r','--name-only',base],cwd=root,text=True,encoding='utf-8').splitlines())
paths=[p for p in paths if p in known or any(k.startswith(p+'/') for k in known)]
raw=subprocess.check_output(['git','archive','--format=zip',base,*paths],cwd=root)
zipfile.ZipFile(io.BytesIO(raw)).extractall(target)
# Git archive preserves repository LF; preserve the workspace's equivalent CRLF
# bytes too, so the build guard can require exact config identity without
# importing an uncommitted semantic configuration change.
cfg='postcss.config.mjs'
assert (target/cfg).read_text(encoding='utf-8')==(root/cfg).read_text(encoding='utf-8'),'Uncommitted PostCSS semantics need review'
shutil.copy2(root/cfg,target/cfg)
own=['content/implementation/realtime-control.mdx','lib/realtime-scheduling.ts','components/wiki/realtime-scheduling-explorer.tsx','public/diagrams/implementation/realtime-timing-workflow.svg']
fix=json.loads((e/'fix.json').read_text(encoding='utf-8'));own.append(fix['path'])
for rel in own:
    (target/rel).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/rel,target/rel)
if not (target/'node_modules').exists():
    subprocess.run(['cmd','/c','mklink','/J',str(target/'node_modules'),str(root/'node_modules')],check=True)
if not (target/'public/pyodide').exists():shutil.copytree(root/'public/pyodide',target/'public/pyodide')
phase=int((e/'phase.txt').read_text().strip()) if (e/'phase.txt').exists() else 1
headings=re.findall(r'^## (.+)$',(root/own[0]).read_text(encoding='utf-8'),re.M)
def catalog(s):
    start=s.index('"slug": "realtime-control"');end=s.index('"slug": "networked-control"',start)
    chunk=s[start:end]
    subs=json.dumps([{'slug':v.lower(),'title':v} for v in headings],ensure_ascii=False,indent=2).replace('\n','\n        ')
    if '"subsections"' not in chunk:chunk=chunk.replace('"title": "实时控制",','"title": "实时控制",\n        "subsections": '+subs+',')
    else:chunk=re.sub(r'"subsections": \[[\s\S]*?\],','"subsections": '+subs+',',chunk,count=1)
    chunk=re.sub(r'"status": "(?:empty|draft|v1.3)"','"status": "'+('v1.3' if phase>=4 else 'draft')+'"',chunk)
    return s[:start]+chunk+s[end:]
def registry(s):
    s=s.replace('import { RealtimeSchedulingExplorer } from "@/components/wiki/pid-tuning-explorer";', 'import { RealtimeSchedulingExplorer } from "@/components/wiki/realtime-scheduling-explorer";')
    if 'import { RealtimeSchedulingExplorer }' not in s:s='import { RealtimeSchedulingExplorer } from "@/components/wiki/realtime-scheduling-explorer";\n'+s
    if not re.search(r'^  RealtimeSchedulingExplorer,',s,re.M):s=re.sub(r'(export const wikiComponents[^=]*= \{)',r'\1\n  RealtimeSchedulingExplorer,',s)
    return s
row='| IMPL-06 | '+' | '.join('[x]' if n<=phase else '[ ]' for n in range(1,7))+' | docs/discuss-log/semester-03/07-implementation/06-realtime-control.md;.agent/semester-03/impl-06/acceptance.md |'
def checklist(s):return re.sub(r'^\| IMPL-06 \|.*$',row,s,flags=re.M)
def tracker(s):
    return re.sub(r'^\| \[[ x]\] 实时控制 \(realtime-control\).*$',('| [x] 实时控制 (realtime-control) | IMPL-06学期3重构；四Notebook八cell、RMS/EDF作业调度与响应时间核验；见.agent/semester-03/impl-06/acceptance.md |' if phase>=4 else '| [ ] 实时控制 (realtime-control) | IMPL-06重构进行中；见讨论日志 |'),s,flags=re.M)
shared=['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-checklist.md','.agent/semester-03-plan.md','OUTLINE.md','lib/python-support.json','docs/deployment/python-expansion-local.json','docs/deployment/python-expansion-pending.json']
shared.append('.agent/fix-logs/INDEX.md')
def fixindex(s):
    if re.search(r'^\| '+fix['id']+r' \|',s,re.M):return s
    row='| '+fix['id']+' | 2026-10-24 | [实时控制逐作业调度纠错]('+Path(fix['path']).name+') | implementation/realtime-control | BOTH | 柯验（清单缺项）+何仿 | 修复覆盖积压作业、充分界解释、Q15乘积和时序/优先级答案；独立事件参考及真实页面验收 |'
    lines=s.splitlines();indices=[(i,int(m[1])) for i,line in enumerate(lines) if (m:=re.match(r'^\| (\d{3}) \|',line))]
    at=next((i for i,n in indices if n>int(fix['id'])),indices[-1][0]+1 if indices else len(lines));lines.insert(at,row)
    return '\n'.join(lines)+'\n'
funcs={'content/catalog.ts':catalog,'lib/wiki-components.ts':registry,'.agent/delivery-tracker.md':tracker,'.agent/semester-03-checklist.md':checklist}
funcs['.agent/fix-logs/INDEX.md']=fixindex
for rel,func in funcs.items():
    p=target/rel;p.write_text(func(p.read_text(encoding='utf-8')),encoding='utf-8')
    # Apply narrowly to current working text too, preserving concurrent edits.
    p=root/rel;p.write_text(func(p.read_text(encoding='utf-8')),encoding='utf-8')
if phase>=4:
    p=target/'.agent/semester-03-plan.md'
    snippet='### IMPL-06 实时控制本轮交付\n\n重构单课；保留九H2/五题，修正调度判据、时序与实现边界。讨论和真实验收见 `.agent/semester-03/impl-06/acceptance.md`；rank1使用独立目录与索引，未发布Pages。\n'
    for p in [p,root/'.agent/semester-03-plan.md']:
        s=p.read_text(encoding='utf-8')
        if '### IMPL-06 实时控制本轮交付' not in s:p.write_text(s.rstrip()+'\n\n'+snippet,encoding='utf-8')
p=target/'components/wiki/jupyter-notebook.tsx';p.write_text(p.read_text(encoding='utf-8').replace('8891','8991').replace('8981','8991'),encoding='utf-8')
log='docs/discuss-log/semester-03/07-implementation/06-realtime-control.md';(target/log).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/log,target/log)
(e/'snapshot.json').write_text(json.dumps({'base':base,'root':str(target),'shared':shared,'own':own,'phase':phase},indent=2)+'\n',encoding='utf-8')
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()==base,'HEAD advanced; rerun snapshot'
print(json.dumps({'base':base,'phase':phase,'snapshot':str(target)}))
