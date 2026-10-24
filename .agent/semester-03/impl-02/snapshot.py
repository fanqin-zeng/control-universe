"""Construct a task-only build snapshot; never alter shared .next or staging."""
from pathlib import Path
import subprocess,io,zipfile,shutil,json
root=Path(__file__).resolve().parents[3]
target=root.parent/'control-universe-rank1-impl02-validation'
target.mkdir(exist_ok=True)
base=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
paths=['app','components','content','lib','public','scripts','docs','package.json','package-lock.json','tsconfig.json','next.config.mjs','postcss.config.js','mdx-components.tsx','.eslintrc.json','.agent/delivery-tracker.md','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03-baseline.json','.agent/fix-logs','OUTLINE.md']
known=set(subprocess.check_output(['git','ls-tree','-r','--name-only',base],cwd=root,text=True,encoding='utf-8').splitlines())
paths=[p for p in paths if p in known or any(k.startswith(p+'/') for k in known)]
raw=subprocess.check_output(['git','archive','--format=zip',base,*paths],cwd=root)
zipfile.ZipFile(io.BytesIO(raw)).extractall(target)
own=['content/implementation/digital-pid.mdx','lib/digital-pid.ts','components/wiki/digital-pid-explorer.tsx','public/diagrams/implementation/pid-cascade.svg']
for p in own:
    (target/p).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/p,target/p)
if not (target/'public/pyodide').exists(): shutil.copytree(root/'public/pyodide',target/'public/pyodide')
registry=target/'lib/wiki-components.ts'
s=registry.read_text(encoding='utf-8');s='import { DigitalPidExplorer } from "@/components/wiki/digital-pid-explorer";\n'+s
s=s.replace('  ControlArchitectureExplorer,','  ControlArchitectureExplorer,\n  DigitalPidExplorer,')
registry.write_text(s,encoding='utf-8')
# Test-only isolated kernel URL; shared user component is untouched.
p=target/'components/wiki/jupyter-notebook.tsx';s=p.read_text(encoding='utf-8').replace('8891','8991').replace('8981','8991');p.write_text(s,encoding='utf-8')
if not (root/'.agent/semester-03/impl-02/build-base.json').exists():
    (root/'.agent/semester-03/impl-02/build-base.json').write_text(json.dumps({'base':base,'snapshot':str(target),'overlays':own},indent=2),encoding='utf-8')
print(target)
(root/'.agent/semester-03/impl-02/refresh-base.json').write_text(json.dumps({'base':base},indent=2),encoding='utf-8')
