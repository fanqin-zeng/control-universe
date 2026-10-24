"""Prepare an exact HEAD-plus-APP-01 tree without using the shared Git index.
No commit, reset, cleanup, or ref update is performed by this script.
"""
from pathlib import Path
import subprocess, json, zipfile, shutil, re
root=Path.cwd()
head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
scope=Path('D:/Workspace/control-universe-rank15-app01-commit-'+head[:8])
scope.mkdir(exist_ok=True)
ev=root/'.agent/semester-03/app-01'
archive=ev/'scope-tmp.zip'
subprocess.run(['git','archive','--format=zip','--output',str(archive),head],check=True)
with zipfile.ZipFile(archive) as z:z.extractall(scope)
archive.unlink()
shared=['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md',
        '.agent/semester-03-plan.md','.agent/semester-03-checklist.md',
        '.agent/semester-03/zh-lang-edit/PLAN.md','docs/semester-02/03-glossary.md',
        'lib/python-support.json','docs/deployment/python-expansion-local.json']
def overlay(path,s):
    current=(root/path).read_text(encoding='utf-8')
    if path=='content/catalog.ts':
        def span(t):
            a=t.index('"slug": "power-electronics"');b=t.index('\n      },',a);return a,b
        a,b=span(s);c,d=span(current);return s[:a]+current[c:d]+s[b:]
    if path=='lib/wiki-components.ts':
        s=re.sub(r'^import BuckConverterExplorer[^\n]*\n','',s,flags=re.M)
        s=s.replace('  BuckConverterExplorer,\n','')
        return 'import BuckConverterExplorer from "@/components/wiki/buck-converter-explorer";\n'+s.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  BuckConverterExplorer,')
    if path=='.agent/delivery-tracker.md':pattern=r'^\| \[[ x]\] 电力电子控制 \(power-electronics\) \|.*$'
    elif path=='.agent/semester-03-checklist.md':pattern=r'^\| APP-01 \|.*$'
    elif path.endswith('zh-lang-edit/PLAN.md'):pattern=r'^\| 197 \| APP-01 \|.*$'
    elif path=='.agent/semester-03-plan.md':
        row=re.search(r'^\| APP-01 \|.*$',current,re.M)[0]
        a=s.index('<!-- S3-ORDER-EXCEPTIONS-BEGIN -->');b=s.index('<!-- S3-ORDER-EXCEPTIONS-END -->')
        block=re.sub(r'^\| APP-01 \|.*\n','',s[a:b],flags=re.M)
        return s[:a]+block+row+'\n'+s[b:]
    elif path.endswith('03-glossary.md'):
        rows=[r for r in current.splitlines() if '| APP-01 |' in r]
        s='\n'.join(r for r in s.splitlines() if '| APP-01 |' not in r)+'\n'
        return s.replace('<!-- REGISTER-END -->','\n'.join(rows)+'\n<!-- REGISTER-END -->')
    elif path=='lib/python-support.json':
        value=json.loads(s);value['lessons']['applications/power-electronics']=json.loads(current)['lessons']['applications/power-electronics']
        return json.dumps(value,ensure_ascii=False,indent=2)+'\n'
    elif path=='docs/deployment/python-expansion-local.json':
        value=json.loads(s);entry=next(l for l in json.loads(current)['lessons'] if l['key']=='applications/power-electronics')
        value['lessons']=[l for l in value['lessons'] if l['key']!=entry['key']]+[entry]
        return json.dumps(value,ensure_ascii=False,indent=2)+'\n'
    else:raise ValueError(path)
    row=re.search(pattern,current,re.M)[0]
    return re.sub(pattern,lambda m:row,s,flags=re.M)

for rel in shared:
    p=scope/rel;p.write_text(overlay(rel,p.read_text(encoding='utf-8')),encoding='utf-8')
owned=['content/applications/power-electronics.mdx','lib/buck-converter.ts',
       'components/wiki/buck-converter-explorer.tsx','public/diagrams/applications/buck-feedback.svg',
       'docs/discuss-log/semester-03/21-applications/01-power-electronics.md']
record={'base':head,'scope':str(scope),'shared':shared,'owned':owned}
(ev/'staging-base.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
for rel in owned:
    dest=scope/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/rel,dest)
shutil.copytree(ev,scope/'.agent/semester-03/app-01',dirs_exist_ok=True)
if not (scope/'node_modules').exists():
    subprocess.run(['cmd','/c','mklink','/J',str(scope/'node_modules'),str(root/'node_modules')],check=True,capture_output=True)
print(json.dumps(record,indent=2))
