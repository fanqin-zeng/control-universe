"""Isolate exact HEAD + only IMPL-08; no shared cache/index mutations."""
from pathlib import Path
import subprocess,zipfile,io,shutil,json,re,os
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-08';target=root.parent/'control-universe-rank1-impl08-validation'
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
own=['content/implementation/industrial-bus-protocols.mdx','lib/industrial-serial.ts','components/wiki/industrial-serial-explorer.tsx','public/diagrams/implementation/industrial-serial-workflow.svg']
for rel in own:
    (target/rel).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/rel,target/rel)
if not (target/'node_modules').exists():
    subprocess.run(['cmd','/c','mklink','/J',str(target/'node_modules'),str(root/'node_modules')],check=True)
if not (target/'public/pyodide').exists():shutil.copytree(root/'public/pyodide',target/'public/pyodide')
phase=int((e/'phase.txt').read_text().strip()) if (e/'phase.txt').exists() else 1
headings=re.findall(r'^## (.+)$',(root/own[0]).read_text(encoding='utf-8'),re.M)
def catalog(s):
    start=s.index('"slug": "industrial-bus-protocols"');end=s.index('"slug": "hil-rapid-prototyping"',start)
    chunk=s[start:end]
    subs=json.dumps([{'slug':v.lower(),'title':v} for v in headings],ensure_ascii=False,indent=2).replace('\n','\n        ')
    if '"subsections"' not in chunk:chunk=chunk.replace('"title": "工业通信",','"title": "工业通信",\n        "subsections": '+subs+',')
    else:chunk=re.sub(r'"subsections": \[[\s\S]*?\],','"subsections": '+subs+',',chunk,count=1)
    chunk=re.sub(r'"status": "(?:empty|draft|v1.3)"','"status": "'+('v1.3' if phase>=4 else 'draft')+'"',chunk)
    return s[:start]+chunk+s[end:]
def registry(s):
    s=s.replace('import { IndustrialSerialExplorer } from "@/components/wiki/pid-tuning-explorer";', 'import { IndustrialSerialExplorer } from "@/components/wiki/industrial-serial-explorer";')
    if 'import { IndustrialSerialExplorer }' not in s:s='import { IndustrialSerialExplorer } from "@/components/wiki/industrial-serial-explorer";\n'+s
    if not re.search(r'^  IndustrialSerialExplorer,',s,re.M):s=re.sub(r'(export const wikiComponents[^=]*= \{)',r'\1\n  IndustrialSerialExplorer,',s)
    return s
row='| IMPL-08 | '+' | '.join('[x]' if n<=phase else '[ ]' for n in range(1,7))+' | docs/discuss-log/semester-03/07-implementation/08-industrial-bus-protocols.md;.agent/semester-03/impl-08/acceptance.md |'
def checklist(s):return re.sub(r'^\| IMPL-08 \|.*$',row,s,flags=re.M)
def tracker(s):
    return re.sub(r'^\| \[[ x]\] 工业通信 \(industrial-bus-protocols\).*$',('| [x] 工业通信 (industrial-bus-protocols) | IMPL-08学期3新写；三Notebook六cell、工业串行Explorer、RTU轮询预算与错误拒收；见.agent/semester-03/impl-08/acceptance.md |' if phase>=4 else '| [ ] 工业通信 (industrial-bus-protocols) | IMPL-08新写进行中；见讨论日志 |'),s,flags=re.M)
shared=['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-checklist.md','.agent/semester-03-plan.md','OUTLINE.md','lib/python-support.json','docs/deployment/python-expansion-local.json','docs/deployment/python-expansion-pending.json']
funcs={'content/catalog.ts':catalog,'lib/wiki-components.ts':registry,'.agent/delivery-tracker.md':tracker,'.agent/semester-03-checklist.md':checklist}
for rel,func in funcs.items():
    p=target/rel;p.write_text(func(p.read_text(encoding='utf-8')),encoding='utf-8')
    # Apply narrowly to current working text too, preserving concurrent edits.
    p=root/rel;p.write_text(func(p.read_text(encoding='utf-8')),encoding='utf-8')
if phase>=4:
    p=target/'.agent/semester-03-plan.md'
    snippet='### IMPL-08 工业通信本轮交付\n\n新写单课；协议分层、CRC解码与轮询预算。讨论和真实验收见 `.agent/semester-03/impl-08/acceptance.md`；rank1使用独立目录与索引，未发布Pages。\n'
    for p in [p,root/'.agent/semester-03-plan.md']:
        s=p.read_text(encoding='utf-8')
        if '### IMPL-08 工业通信本轮交付' not in s:p.write_text(s.rstrip()+'\n\n'+snippet,encoding='utf-8')
p=target/'components/wiki/jupyter-notebook.tsx';p.write_text(p.read_text(encoding='utf-8').replace('8891','8991').replace('8981','8991'),encoding='utf-8')
log='docs/discuss-log/semester-03/07-implementation/08-industrial-bus-protocols.md';(target/log).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/log,target/log)
(e/'snapshot.json').write_text(json.dumps({'base':base,'root':str(target),'shared':shared,'own':own,'phase':phase},indent=2)+'\n',encoding='utf-8')
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()==base,'HEAD advanced; rerun snapshot'
print(json.dumps({'base':base,'phase':phase,'snapshot':str(target)}))
