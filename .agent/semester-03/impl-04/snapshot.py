"""Isolate exact HEAD + only IMPL-04; no shared cache/index mutations."""
from pathlib import Path
import subprocess,zipfile,io,shutil,json,re,os
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-04';target=root.parent/'control-universe-rank1-impl04-validation'
target.mkdir(exist_ok=True)
base=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
paths=['app','components','content','lib','public','scripts','docs','package.json','package-lock.json','tsconfig.json','next.config.mjs','postcss.config.mjs','mdx-components.tsx','.eslintrc.json','.agent/delivery-tracker.md','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03-baseline.json','.agent/fix-logs','.agent/skills/wiki-discussion/personas.md','OUTLINE.md']
known=set(subprocess.check_output(['git','ls-tree','-r','--name-only',base],cwd=root,text=True,encoding='utf-8').splitlines())
paths=[p for p in paths if p in known or any(k.startswith(p+'/') for k in known)]
raw=subprocess.check_output(['git','archive','--format=zip',base,*paths],cwd=root)
zipfile.ZipFile(io.BytesIO(raw)).extractall(target)
own=['content/implementation/controller-discretization-practice.mdx','lib/controller-deployment.ts','components/wiki/controller-deployment-explorer.tsx','public/diagrams/implementation/controller-deployment-workflow.svg']
for rel in own:
    (target/rel).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/rel,target/rel)
if not (target/'node_modules').exists():
    subprocess.run(['cmd','/c','mklink','/J',str(target/'node_modules'),str(root/'node_modules')],check=True)
if not (target/'public/pyodide').exists():shutil.copytree(root/'public/pyodide',target/'public/pyodide')
phase=int((e/'phase.txt').read_text().strip()) if (e/'phase.txt').exists() else 1
headings=re.findall(r'^## (.+)$',(root/own[0]).read_text(encoding='utf-8'),re.M)
def catalog(s):
    start=s.index('"slug": "controller-discretization-practice"');end=s.index('"slug": "embedded-implementation"',start)
    chunk=s[start:end]
    subs=json.dumps([{'slug':v.lower(),'title':v} for v in headings],ensure_ascii=False,indent=2).replace('\n','\n        ')
    if '"subsections"' not in chunk:chunk=chunk.replace('"title": "控制器部署",','"title": "控制器部署",\n        "subsections": '+subs+',')
    else:chunk=re.sub(r'"subsections": \[[\s\S]*?\],','"subsections": '+subs+',',chunk,count=1)
    chunk=re.sub(r'"status": "(?:empty|draft|v1.3)"','"status": "'+('v1.3' if phase>=4 else 'draft')+'"',chunk)
    return s[:start]+chunk+s[end:]
def registry(s):
    s=s.replace('import { ControllerDeploymentExplorer } from "@/components/wiki/pid-tuning-explorer";', 'import { ControllerDeploymentExplorer } from "@/components/wiki/controller-deployment-explorer";')
    if 'import { ControllerDeploymentExplorer }' not in s:s='import { ControllerDeploymentExplorer } from "@/components/wiki/controller-deployment-explorer";\n'+s
    if not re.search(r'^  ControllerDeploymentExplorer,',s,re.M):s=re.sub(r'(export const wikiComponents[^=]*= \{)',r'\1\n  ControllerDeploymentExplorer,',s)
    return s
row='| IMPL-04 | '+' | '.join('[x]' if n<=phase else '[ ]' for n in range(1,7))+' | docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md;.agent/semester-03/impl-04/acceptance.md |'
def checklist(s):return re.sub(r'^\| IMPL-04 \|.*$',row,s,flags=re.M)
def tracker(s):
    return re.sub(r'^\| \[[ x]\] 控制器部署 \(controller-discretization-practice\).*$',('| [x] 控制器部署 (controller-discretization-practice) | IMPL-04学期3新写；三Notebook六cell、有限字长Explorer、逐拍重放与延迟反例；见.agent/semester-03/impl-04/acceptance.md |' if phase>=4 else '| [ ] 控制器部署 (controller-discretization-practice) | IMPL-04新写进行中；见讨论日志 |'),s,flags=re.M)
shared=['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-checklist.md','.agent/semester-03-plan.md','OUTLINE.md','lib/python-support.json','docs/deployment/python-expansion-local.json','docs/deployment/python-expansion-pending.json']
funcs={'content/catalog.ts':catalog,'lib/wiki-components.ts':registry,'.agent/delivery-tracker.md':tracker,'.agent/semester-03-checklist.md':checklist}
for rel,func in funcs.items():
    p=target/rel;p.write_text(func(p.read_text(encoding='utf-8')),encoding='utf-8')
    # Apply narrowly to current working text too, preserving concurrent edits.
    p=root/rel;p.write_text(func(p.read_text(encoding='utf-8')),encoding='utf-8')
if phase>=4:
    p=target/'.agent/semester-03-plan.md'
    snippet='### IMPL-04 控制器部署本轮交付\n\n新写单课；离散系数与状态、有限字长、真实时序与部署验收。讨论和真实验收见 `.agent/semester-03/impl-04/acceptance.md`；rank1使用独立目录与索引，未发布Pages。\n'
    for p in [p,root/'.agent/semester-03-plan.md']:
        s=p.read_text(encoding='utf-8')
        if '### IMPL-04 控制器部署本轮交付' not in s:p.write_text(s.rstrip()+'\n\n'+snippet,encoding='utf-8')
p=target/'components/wiki/jupyter-notebook.tsx';p.write_text(p.read_text(encoding='utf-8').replace('8891','8991').replace('8981','8991'),encoding='utf-8')
log='docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md';(target/log).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/log,target/log)
(e/'snapshot.json').write_text(json.dumps({'base':base,'root':str(target),'shared':shared,'own':own,'phase':phase},indent=2)+'\n',encoding='utf-8')
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()==base,'HEAD advanced; rerun snapshot'
print(json.dumps({'base':base,'phase':phase,'snapshot':str(target)}))
