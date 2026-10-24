"""Overlay only EST-08 onto a fixed committed snapshot; preserve concurrent course drafts."""
from pathlib import Path
import subprocess,shutil,re,os
root=Path(__file__).resolve().parents[3];dest=Path('D:/Workspace/control-universe-rank4-est08')
assert dest.resolve()==Path('D:/Workspace/control-universe-rank4-est08').resolve()
baseline=os.environ.get('EST08_BASELINE') or (root/'.agent/semester-03/est-08/baseline-commit.txt').read_text().strip()
def head(name):return subprocess.check_output(['git','show',baseline+':'+name],cwd=root).decode('utf8')
files=['content/estimation/estimation-case-study.mdx','components/wiki/estimation-case-study-explorer.tsx','lib/estimation-case-study.ts','lib/estimation-case-data.json','public/diagrams/estimation/estimation-pipeline.svg','docs/discuss-log/semester-03/10-estimation/08-estimation-case-study.md']
for name in files:
    target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,target)
target=dest/'.agent/semester-03/est-08'
assert target.resolve()==dest.resolve()/'.agent/semester-03/est-08' and not target.is_symlink()
if target.exists():shutil.rmtree(target)
shutil.copytree(root/'.agent/semester-03/est-08',target)
for name in ['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03/zh-lang-edit/PLAN.md','lib/python-support.json','docs/deployment/python-expansion-local.json']:
    base=head(name);current=(root/name).read_text(encoding='utf8')
    if name=='content/catalog.ts':
        def part(s):
            start=s.index('"slug": "estimation-case-study"');end=s.index('\n      }',start);return start,end,s[start:end]
        start,end,_=part(base);base=base[:start]+part(current)[2]+base[end:]
    elif name=='lib/wiki-components.ts':
        if 'EstimationCaseExplorer' not in base:base='import { EstimationCaseExplorer } from "@/components/wiki/estimation-case-study-explorer";\n'+base.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  EstimationCaseExplorer,')
    elif name=='.agent/delivery-tracker.md':
        row=next(l for l in current.splitlines() if '状态估计案例 (estimation-case-study)' in l)
        base=re.sub(r'^\| \[[ x]\] 状态估计案例 \(estimation-case-study\).*$',lambda m:row,base,flags=re.M)
    elif name=='.agent/semester-03-plan.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-08 | ') and '.agent/semester-03/est-08/acceptance.md' in l)
        if row not in base:base=base.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->')
        block=re.search(r'<!-- EST-08-RECEIPT-BEGIN -->[\s\S]*?<!-- EST-08-RECEIPT-END -->',current)
        if block:base=base.rstrip()+'\n\n'+block[0]+'\n' if '<!-- EST-08-RECEIPT-BEGIN -->' not in base else re.sub(r'<!-- EST-08-RECEIPT-BEGIN -->[\s\S]*?<!-- EST-08-RECEIPT-END -->',lambda m:block[0],base)
    elif name=='.agent/semester-03-checklist.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-08 |'))
        base=re.sub(r'^\| EST-08 \|.*$',lambda m:row,base,flags=re.M)
    elif name=='.agent/semester-03/zh-lang-edit/PLAN.md':
        row=next(l for l in current.splitlines() if '| EST-08 |' in l)
        base=re.sub(r'^\| \d+ \| EST-08 \|.*$',lambda m:row,base,flags=re.M)
        count=sum('| 已完成 |' in line for line in base.splitlines());base=re.sub(r'当前\d+课完成学期3生产',f'当前{count}课完成学期3生产',base)
    (dest/name).write_text(base,encoding='utf8')
(dest/'.agent/semester-03/est-08/projection-parent.txt').write_text(baseline+'\n',encoding='utf8')
if (dest/'.agent/semester-03/est-08/pyodide.json').exists():subprocess.run(['node','scripts/finalize-python-support.mjs','.agent/semester-03/est-08/pyodide.json','--merge'],cwd=dest,check=True)
config=dest/'next.config.mjs';config.write_text(config.read_text(encoding='utf8').replace('  experimental: { cpus: 2 },\n','').replace('const nextConfig = {','const nextConfig = {\n  experimental: { cpus: 2 },'),encoding='utf8')
print('Projection baseline',baseline)
