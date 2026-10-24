"""Overlay only EST-05 onto a fixed committed snapshot; preserve concurrent course drafts."""
from pathlib import Path
import subprocess,shutil,re,os
root=Path(__file__).resolve().parents[3];dest=Path('D:/Workspace/control-universe-rank4-est05')
assert dest.resolve()==Path('D:/Workspace/control-universe-rank4-est05').resolve()
baseline=os.environ.get('EST05_BASELINE') or (root/'.agent/semester-03/est-05/baseline-commit.txt').read_text().strip()
def head(name):return subprocess.check_output(['git','show',baseline+':'+name],cwd=root).decode('utf8')
files=['content/estimation/unscented-kalman-filter.mdx','components/wiki/unscented-kalman-explorer.tsx','lib/unscented-kalman.ts','public/diagrams/estimation/ukf-sigma-points.svg','docs/discuss-log/semester-03/10-estimation/05-unscented-kalman-filter.md']
for name in files:
    target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,target)
target=dest/'.agent/semester-03/est-05'
assert target.resolve()==dest.resolve()/'.agent/semester-03/est-05' and not target.is_symlink()
if target.exists():shutil.rmtree(target)
shutil.copytree(root/'.agent/semester-03/est-05',target)
for name in ['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03/zh-lang-edit/PLAN.md','lib/python-support.json','docs/deployment/python-expansion-local.json','docs/semester-02/04-notation.md']:
    base=head(name);current=(root/name).read_text(encoding='utf8')
    if name=='content/catalog.ts':
        def part(s):
            start=s.index('"slug": "unscented-kalman-filter"');end=s.index('\n      },',start);return start,end,s[start:end]
        start,end,_=part(base);base=base[:start]+part(current)[2]+base[end:]
    elif name=='lib/wiki-components.ts':
        if 'UnscentedKalmanExplorer' not in base:base='import { UnscentedKalmanExplorer } from "@/components/wiki/unscented-kalman-explorer";\n'+base.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  UnscentedKalmanExplorer,')
    elif name=='.agent/delivery-tracker.md':
        row=next(l for l in current.splitlines() if '无迹卡尔曼滤波 (unscented-kalman-filter)' in l)
        base=re.sub(r'^\| \[[ x]\] 无迹卡尔曼滤波 \(unscented-kalman-filter\).*$',lambda m:row,base,flags=re.M)
    elif name=='.agent/semester-03-plan.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-05 | IMPL-'))
        if row not in base:base=base.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->')
        block=re.search(r'<!-- EST-05-RECEIPT-BEGIN -->[\s\S]*?<!-- EST-05-RECEIPT-END -->',current)
        if block:base=base.rstrip()+'\n\n'+block[0]+'\n' if '<!-- EST-05-RECEIPT-BEGIN -->' not in base else re.sub(r'<!-- EST-05-RECEIPT-BEGIN -->[\s\S]*?<!-- EST-05-RECEIPT-END -->',lambda m:block[0],base)
    elif name=='.agent/semester-03-checklist.md':
        row=next(l for l in current.splitlines() if l.startswith('| EST-05 |'))
        base=re.sub(r'^\| EST-05 \|.*$',lambda m:row,base,flags=re.M)
    elif name=='.agent/semester-03/zh-lang-edit/PLAN.md':
        row=next(l for l in current.splitlines() if '| EST-05 |' in l)
        base=re.sub(r'^\| \d+ \| EST-05 \|.*$',lambda m:row,base,flags=re.M)
        count=sum('| 已完成 |' in line for line in base.splitlines());base=re.sub(r'当前\d+课完成学期3生产',f'当前{count}课完成学期3生产',base)
    elif name=='docs/semester-02/04-notation.md':
        row=next(l for l in current.splitlines() if l.startswith(r'| $\chi$ |'))
        if r'| $\chi$ |' not in base:base=re.sub(r'^<!-- REGISTER-END -->$',lambda m:row+'\n<!-- REGISTER-END -->',base,flags=re.M)
    (dest/name).write_text(base,encoding='utf8')
(dest/'.agent/semester-03/est-05/projection-parent.txt').write_text(baseline+'\n',encoding='utf8')
if (dest/'.agent/semester-03/est-05/pyodide.json').exists():subprocess.run(['node','scripts/finalize-python-support.mjs','.agent/semester-03/est-05/pyodide.json','--merge'],cwd=dest,check=True)
config=dest/'next.config.mjs';config.write_text(config.read_text(encoding='utf8').replace('  experimental: { cpus: 2 },\n','').replace('const nextConfig = {','const nextConfig = {\n  experimental: { cpus: 2 },'),encoding='utf8')
print('Projection baseline',baseline)
