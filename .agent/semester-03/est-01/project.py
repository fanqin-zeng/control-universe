"""Overlay only EST-01 on current committed HEAD in the rank4 runtime copy."""
from pathlib import Path
import subprocess,shutil,re,os
root=Path(__file__).resolve().parents[3]
dest=Path('D:/Workspace/control-universe-rank4-est01')
assert dest.resolve()==Path('D:/Workspace/control-universe-rank4-est01').resolve()
files=['content/estimation/estimation-problem.mdx','components/wiki/estimation-framework-explorer.tsx','lib/estimation-framework.ts','public/diagrams/estimation/predict-correct.svg','docs/discuss-log/semester-03/10-estimation/01-estimation-problem.md']
for name in files:
    target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,target)
shutil.copytree(root/'.agent/semester-03/est-01',dest/'.agent/semester-03/est-01',dirs_exist_ok=True)
baseline=os.environ.get('EST01_BASELINE') or subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
def head(name):return subprocess.check_output(['git','show',baseline+':'+name],cwd=root).decode('utf8')
for name in ['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03/zh-lang-edit/PLAN.md','lib/python-support.json','docs/deployment/python-expansion-local.json']:
    base=head(name);current=(root/name).read_text(encoding='utf8')
    if name=='content/catalog.ts':
        def lesson(s):
            start=s.index('"slug": "estimation-problem"');end=s.index('\n      },',start)
            return start,end,s[start:end]
        start,end,_=lesson(base);base=base[:start]+lesson(current)[2]+base[end:]
    elif name=='lib/wiki-components.ts':
        base='import { EstimationFrameworkExplorer } from "@/components/wiki/estimation-framework-explorer";\n'+base
        base=base.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  EstimationFrameworkExplorer,')
    elif name=='.agent/delivery-tracker.md':
        base=re.sub(r'^\| \[ \] 状态估计框架 .*$',next(l for l in current.splitlines() if '状态估计框架 (estimation-problem)' in l),base,flags=re.M)
    elif name=='.agent/semester-03-plan.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-01 | IMPL-'))
        base=base.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->')
    elif name=='.agent/semester-03-checklist.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-01 |'))
        base=re.sub(r'^\| EST-01 \|.*$',row,base,flags=re.M)
    elif name=='.agent/semester-03/zh-lang-edit/PLAN.md':
        row=next(l for l in current.splitlines() if '| EST-01 |' in l)
        base=re.sub(r'^\| 89 \| EST-01 \|.*$',row,base,flags=re.M)
        count=sum('| 已完成 |' in line for line in base.splitlines())
        base=re.sub(r'当前\d+课完成学期3生产',f'当前{count}课完成学期3生产',base)
    (dest/name).write_text(base,encoding='utf8')
print('Projection baseline',baseline)
(dest/'.agent/semester-03/est-01/projection-parent.txt').write_text(baseline+'\n',encoding='utf8')
if (dest/'.agent/semester-03/est-01/pyodide.json').exists():
    subprocess.run(['node','scripts/finalize-python-support.mjs','.agent/semester-03/est-01/pyodide.json','--merge'],cwd=dest,check=True)
