"""Overlay only EST-06 onto a fixed committed snapshot; preserve concurrent course drafts."""
from pathlib import Path
import subprocess,shutil,re,os
root=Path(__file__).resolve().parents[3];dest=Path('D:/Workspace/control-universe-rank4-est06')
assert dest.resolve()==Path('D:/Workspace/control-universe-rank4-est06').resolve()
baseline=os.environ.get('EST06_BASELINE') or (root/'.agent/semester-03/est-06/baseline-commit.txt').read_text().strip()
def head(name):return subprocess.check_output(['git','show',baseline+':'+name],cwd=root).decode('utf8')
files=['content/estimation/particle-filter.mdx','components/wiki/particle-filter-explorer.tsx','lib/particle-filter.ts','public/diagrams/estimation/particle-resampling.svg','docs/discuss-log/semester-03/10-estimation/06-particle-filter.md']
for name in files:
    target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,target)
target=dest/'.agent/semester-03/est-06'
assert target.resolve()==dest.resolve()/'.agent/semester-03/est-06' and not target.is_symlink()
if target.exists():shutil.rmtree(target)
shutil.copytree(root/'.agent/semester-03/est-06',target)
for name in ['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03/zh-lang-edit/PLAN.md','lib/python-support.json','docs/deployment/python-expansion-local.json']:
    base=head(name);current=(root/name).read_text(encoding='utf8')
    if name=='content/catalog.ts':
        def part(s):
            start=s.index('"slug": "particle-filter"');end=s.index('\n      },',start);return start,end,s[start:end]
        start,end,_=part(base);base=base[:start]+part(current)[2]+base[end:]
    elif name=='lib/wiki-components.ts':
        if 'ParticleFilterExplorer' not in base:base='import { ParticleFilterExplorer } from "@/components/wiki/particle-filter-explorer";\n'+base.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  ParticleFilterExplorer,')
    elif name=='.agent/delivery-tracker.md':
        row=next(l for l in current.splitlines() if '粒子滤波 (particle-filter)' in l)
        base=re.sub(r'^\| \[[ x]\] 粒子滤波 \(particle-filter\).*$',lambda m:row,base,flags=re.M)
    elif name=='.agent/semester-03-plan.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-06 | IMPL-'))
        if row not in base:base=base.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->')
        block=re.search(r'<!-- EST-06-RECEIPT-BEGIN -->[\s\S]*?<!-- EST-06-RECEIPT-END -->',current)
        if block:base=base.rstrip()+'\n\n'+block[0]+'\n' if '<!-- EST-06-RECEIPT-BEGIN -->' not in base else re.sub(r'<!-- EST-06-RECEIPT-BEGIN -->[\s\S]*?<!-- EST-06-RECEIPT-END -->',lambda m:block[0],base)
    elif name=='.agent/semester-03-checklist.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-06 |'))
        base=re.sub(r'^\| EST-06 \|.*$',lambda m:row,base,flags=re.M)
    elif name=='.agent/semester-03/zh-lang-edit/PLAN.md':
        row=next(l for l in current.splitlines() if '| EST-06 |' in l)
        base=re.sub(r'^\| \d+ \| EST-06 \|.*$',lambda m:row,base,flags=re.M)
        count=sum('| 已完成 |' in line for line in base.splitlines());base=re.sub(r'当前\d+课完成学期3生产',f'当前{count}课完成学期3生产',base)
    (dest/name).write_text(base,encoding='utf8')
(dest/'.agent/semester-03/est-06/projection-parent.txt').write_text(baseline+'\n',encoding='utf8')
if (dest/'.agent/semester-03/est-06/pyodide.json').exists():subprocess.run(['node','scripts/finalize-python-support.mjs','.agent/semester-03/est-06/pyodide.json','--merge'],cwd=dest,check=True)
config=dest/'next.config.mjs';config.write_text(config.read_text(encoding='utf8').replace('  experimental: { cpus: 2 },\n','').replace('const nextConfig = {','const nextConfig = {\n  experimental: { cpus: 2 },'),encoding='utf8')
print('Projection baseline',baseline)
