"""Overlay exactly EST-02 onto a specified committed runtime snapshot."""
from pathlib import Path
import subprocess,shutil,re,os
root=Path(__file__).resolve().parents[3];dest=Path('D:/Workspace/control-universe-rank4-est02')
assert dest.resolve()==Path('D:/Workspace/control-universe-rank4-est02').resolve()
baseline=os.environ.get('EST02_BASELINE') or (root/'.agent/semester-03/est-02/baseline-commit.txt').read_text().strip()
def head(name):return subprocess.check_output(['git','show',baseline+':'+name],cwd=root).decode('utf8')
files=['content/estimation/least-squares-ml.mdx','components/wiki/statistical-estimation-explorer.tsx','lib/statistical-estimation.ts','public/diagrams/estimation/statistical-estimation.svg','docs/discuss-log/semester-03/10-estimation/02-least-squares-ml.md']
for name in files:
    target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,target)
shutil.copytree(root/'.agent/semester-03/est-02',dest/'.agent/semester-03/est-02',dirs_exist_ok=True)
for name in ['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03/zh-lang-edit/PLAN.md','lib/python-support.json','docs/deployment/python-expansion-local.json']:
    base=head(name);current=(root/name).read_text(encoding='utf8')
    if name=='content/catalog.ts':
        def part(s):
            start=s.index('"slug": "least-squares-ml"');end=s.index('\n      },',start);return start,end,s[start:end]
        start,end,_=part(base);base=base[:start]+part(current)[2]+base[end:]
    elif name=='lib/wiki-components.ts':
        base='import { StatisticalEstimationExplorer } from "@/components/wiki/statistical-estimation-explorer";\n'+base
        base=base.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  StatisticalEstimationExplorer,')
    elif name=='.agent/delivery-tracker.md':
        row=next(l for l in current.splitlines() if '统计估计 (least-squares-ml)' in l)
        base=re.sub(r'^\| \[ \] 统计估计 .*$',row,base,flags=re.M)
    elif name=='.agent/semester-03-plan.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-02 | IMPL-'))
        base=base.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->')
    elif name=='.agent/semester-03-checklist.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-02 |'))
        base=re.sub(r'^\| EST-02 \|.*$',row,base,flags=re.M)
    elif name=='.agent/semester-03/zh-lang-edit/PLAN.md':
        row=next(l for l in current.splitlines() if '| EST-02 |' in l)
        base=re.sub(r'^\| \d+ \| EST-02 \|.*$',row,base,flags=re.M)
        count=sum('| 已完成 |' in line for line in base.splitlines())
        base=re.sub(r'当前\d+课完成学期3生产',f'当前{count}课完成学期3生产',base)
    (dest/name).write_text(base,encoding='utf8')
(dest/'.agent/semester-03/est-02/projection-parent.txt').write_text(baseline+'\n',encoding='utf8')
if (dest/'.agent/semester-03/est-02/pyodide.json').exists():
    subprocess.run(['node','scripts/finalize-python-support.mjs','.agent/semester-03/est-02/pyodide.json','--merge'],cwd=dest,check=True)
print('Projection baseline',baseline)
