"""Prepare an isolated preview tree over current HEAD; never stage user files."""
from pathlib import Path
import json,subprocess,shutil
root=Path('D:/Workspace/control-universe-rank3-id03')
folder=Path('.agent/semester-03/id-03')
base=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip()
(folder/'scope-base.txt').write_text(base+'\n',encoding='utf8')
subprocess.run(['git','archive',base,'--format=tar','-o',str(root/'scope.tar')],check=True)
subprocess.run(['tar','-xf',str(root/'scope.tar'),'-C',str(root)],check=True)
(root/'scope.tar').unlink()
def head(p):return subprocess.check_output(['git','show',base+':'+p]).decode('utf8').replace('\r\n','\n')
def write(p,s):(root/p).write_text(s,encoding='utf8')
for p in ['content/catalog.ts','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/delivery-tracker.md']:
 s=Path(p).read_text(encoding='utf8');b=head(p)
 if p=='content/catalog.ts':
  i=s.index('"slug": "least-squares-rls"');j=s.index('\n      },',i);x=b.index('"slug": "least-squares-rls"');y=b.index('\n      },',x);b=b[:x]+s[i:j]+b[y:]
 elif p.endswith('semester-03-plan.md'):
  row=next(l for l in s.splitlines() if l.startswith('| ID-03 | DISCRETE-01;'))
  if row not in b:b=b.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->')
 elif p.endswith('semester-03-checklist.md'):
  row=next(l for l in s.splitlines() if l.startswith('| ID-03 |'));b='\n'.join(row if l.startswith('| ID-03 |') else l for l in b.split('\n'))
 else:
  row=next(l for l in s.splitlines() if '(least-squares-rls)' in l);b='\n'.join(row if '(least-squares-rls)' in l else l for l in b.split('\n'))
 write(p,b)
p='lib/wiki-components.ts';b=head(p)
if 'import { RlsIdentificationExplorer }' not in b:b='import { RlsIdentificationExplorer } from "@/components/wiki/rls-identification-explorer";\n'+b
if '  RlsIdentificationExplorer,' not in b:
 import re
 b,n=re.subn(r'(export const wikiComponents[^=]*=\s*\{)',r'\1\n  RlsIdentificationExplorer,',b,count=1);assert n==1
write(p,b)
p='content/nonlinear/adaptive-control-basics.mdx';b=head(p);note=Path(p).read_text(encoding='utf8').split('### RLS怎样逐次利用数据',1)[1].split('\n\n',2)[1];assert '/identification/least-squares-rls' in note
if '/identification/least-squares-rls' not in b:b=b.replace('### RLS怎样逐次利用数据','### RLS怎样逐次利用数据\n\n'+note,1)
write(p,b)
p='docs/semester-02/03-glossary.md';b=head(p);rows=[l for l in Path(p).read_text(encoding='utf8').splitlines() if '| ID-03 |' in l];assert len(rows)==4
for row in rows:
 if row not in b:b=b.replace('<!-- REGISTER-END -->',row+'\n<!-- REGISTER-END -->')
write(p,b)
report=json.loads((folder/'pyodide-combined.json').read_text(encoding='utf8'))
assert report['complete'] and len(report['lessons'])==2
for p in ['lib/python-support.json','docs/deployment/python-expansion-local.json']:
 b=json.loads(head(p))
 assert b['workerHash']==report['workerHash'],'Worker changed: re-audit required'
 if p.startswith('lib/'):
  for lesson in report['lessons']:b['lessons'][lesson['key']]={'sourceHash':lesson['sourceHash'],'notebooks':[{'id':n['id'],'title':n['title'],'status':'enabled','reason':'','cells':n['cellCount']} for n in lesson['notebooks']]}
 else:
  records={x['key']:x for x in b['lessons']};records.update({x['key']:x for x in report['lessons']});b['lessons']=list(records.values())
  b['provenance']=b.get('provenance',[])+[{'testedAt':report['testedAt'],'url':report['url'],'inputPath':'.agent/semester-03/id-03/pyodide-combined.json'}]
  b['totals']={'lessons':len(b['lessons']),'notebooks':sum(len(x['notebooks']) for x in b['lessons']),'enabled':sum(x['status']=='passed' for l in b['lessons'] for x in l['notebooks']),'codeOnly':sum(x['status']=='code' for l in b['lessons'] for x in l['notebooks'])};b['releaseTotals']=dict(b['totals'])
 write(p,json.dumps(b,ensure_ascii=False,indent=2)+'\n')
for p in ['content/identification/least-squares-rls.mdx','lib/rls-identification.ts','components/wiki/rls-identification-explorer.tsx','public/diagrams/identification/least-squares-data.svg']:
 dest=root/p;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dest)
for p in ['.agent/semester-03/id-03','docs/discuss-log/semester-03/09-identification']:shutil.copytree(p,root/p,dirs_exist_ok=True)
p=root/'components/wiki/jupyter-notebook.tsx';s=p.read_text(encoding='utf8');import re;s=re.sub(r'http://127.0.0.1:(8891|8981)','http://127.0.0.1:8993',s);p.write_text(s,encoding='utf8')
print('Prepared only ID-03 changes over '+base[:7])
