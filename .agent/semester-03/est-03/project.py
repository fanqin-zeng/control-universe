"""Overlay exactly EST-03 onto a specified committed runtime snapshot."""
from pathlib import Path
import subprocess,shutil,re,os
root=Path(__file__).resolve().parents[3];dest=Path('D:/Workspace/control-universe-rank4-est03')
assert dest.resolve()==Path('D:/Workspace/control-universe-rank4-est03').resolve()
baseline=os.environ.get('EST03_BASELINE') or (root/'.agent/semester-03/est-03/baseline-commit.txt').read_text().strip()
def head(name):return subprocess.check_output(['git','show',baseline+':'+name],cwd=root).decode('utf8')
files=['content/estimation/kalman-filter.mdx','components/wiki/kalman-noise-explorer.tsx','lib/kalman-noise.ts','public/diagrams/estimation/kalman-cycle.svg','docs/discuss-log/semester-03/10-estimation/03-kalman-filter.md']
files.append('.agent/fix-logs/2026-10-24-079.md')
for name in files:
    target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,target)
evidence_target=dest/'.agent/semester-03/est-03'
assert evidence_target.resolve()==dest.resolve()/'.agent/semester-03/est-03' and not evidence_target.is_symlink()
if evidence_target.exists():shutil.rmtree(evidence_target)
shutil.copytree(root/'.agent/semester-03/est-03',evidence_target)
for name in ['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03/zh-lang-edit/PLAN.md','lib/python-support.json','docs/deployment/python-expansion-local.json','.agent/fix-logs/INDEX.md']:
    base=head(name);current=(root/name).read_text(encoding='utf8')
    if name=='content/catalog.ts':
        def part(s):
            start=s.index('"slug": "kalman-filter"');end=s.index('\n      },',start);return start,end,s[start:end]
        start,end,_=part(base);base=base[:start]+part(current)[2]+base[end:]
    elif name=='lib/wiki-components.ts':
        base=base if 'KalmanNoiseExplorer' in base else 'import { KalmanNoiseExplorer } from "@/components/wiki/kalman-noise-explorer";\n'+base
        base=base if '\n  KalmanNoiseExplorer,' in base else base.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  KalmanNoiseExplorer,')
    elif name=='.agent/delivery-tracker.md':
        row=next(l for l in current.splitlines() if '卡尔曼滤波 (kalman-filter)' in l)
        base=re.sub(r'^\| \[[ x]\] 卡尔曼滤波 \(kalman-filter\).*$',row,base,flags=re.M)
    elif name=='.agent/semester-03-plan.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-03 | IMPL-'))
        base=base if row in base else base.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->')
        block=re.search(r'<!-- EST-03-RECEIPT-BEGIN -->[\s\S]*?<!-- EST-03-RECEIPT-END -->',current)
        if block:
            base=re.sub(r'<!-- EST-03-RECEIPT-BEGIN -->[\s\S]*?<!-- EST-03-RECEIPT-END -->',lambda m:block[0],base) if '<!-- EST-03-RECEIPT-BEGIN -->' in base else base.rstrip()+'\n\n'+block[0]+'\n'
    elif name=='.agent/semester-03-checklist.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-03 |'))
        base=re.sub(r'^\| EST-03 \|.*$',row,base,flags=re.M)
    elif name=='.agent/fix-logs/INDEX.md':
        row=next(l for l in current.splitlines() if l.startswith('| [079]'))
        if row not in base:
            lines=base.splitlines();positions=[i for i,l in enumerate(lines) if re.match(r'^\| \[(\d{3})\]',l) and int(re.match(r'^\| \[(\d{3})\]',l)[1])<79]
            lines.insert(max(positions)+1,row);base='\n'.join(lines)+'\n'
    elif name=='.agent/semester-03/zh-lang-edit/PLAN.md':
        row=next(l for l in current.splitlines() if '| EST-03 |' in l)
        base=re.sub(r'^\| \d+ \| EST-03 \|.*$',row,base,flags=re.M)
        count=sum('| 已完成 |' in line for line in base.splitlines())
        base=re.sub(r'当前\d+课完成学期3生产',f'当前{count}课完成学期3生产',base)
    (dest/name).write_text(base,encoding='utf8')
(dest/'.agent/semester-03/est-03/projection-parent.txt').write_text(baseline+'\n',encoding='utf8')
if (dest/'.agent/semester-03/est-03/pyodide.json').exists():
    subprocess.run(['node','scripts/finalize-python-support.mjs','.agent/semester-03/est-03/pyodide.json','--merge'],cwd=dest,check=True)
config=dest/'next.config.mjs';config.write_text(config.read_text(encoding='utf8').replace('  experimental: { cpus: 2 },\n','').replace('const nextConfig = {','const nextConfig = {\n  experimental: { cpus: 2 },'),encoding='utf8')
print('Projection baseline',baseline)
