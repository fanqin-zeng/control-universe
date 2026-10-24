"""Create a committed-HEAD + ML-07 projection without staging other sessions' work."""
from pathlib import Path
import subprocess, shutil, re, json, sys
repo=Path(__file__).resolve().parents[3]
dest=Path(sys.argv[1]);dest.mkdir(exist_ok=True)
def git(*args):return subprocess.check_output(['git','-C',str(repo),*args]).decode('utf-8').replace('\r\n','\n')
base=git('rev-parse','HEAD').strip()
archive=dest/'baseline.tar'
subprocess.run(['git','-C',str(repo),'archive','-o',str(archive),base],check=True)
subprocess.run(['tar','-xf',str(archive),'-C',str(dest)],check=True)
def read(root,path):return (root/path).read_text(encoding='utf-8').replace('\r\n','\n')
def write(path,s):
 p=dest/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s,encoding='utf-8')
def block(s):
 i=s.index('"slug": "representation-learning"');a=s.rfind('{',0,i);depth=0;quoted=False;escape=False
 for j in range(a,len(s)):
  ch=s[j]
  if quoted:
   if escape:escape=False
   elif ch=='\\':escape=True
   elif ch=='"':quoted=False
  elif ch=='"':quoted=True
  elif ch=='{':depth+=1
  elif ch=='}':
   depth-=1
   if depth==0:return a,j+1
 raise ValueError('unclosed catalog object')
path='content/catalog.ts';s=read(dest,path);source=read(repo,path);a,b=block(s);c,d=block(source);write(path,s[:a]+source[c:d]+s[b:])
path='lib/wiki-components.ts';s=read(dest,path)
if 'RepresentationBasicsExplorer' not in s:
 s="import { RepresentationBasicsExplorer } from '@/components/wiki/representation-basics-explorer';\n"+s
 s=re.sub(r'(export const wikiComponents[^=]*= \{)',r'\1\n  RepresentationBasicsExplorer,',s)
write(path,s)
path='.agent/semester-03-plan.md';s=read(dest,path);row=next(l for l in read(repo,path).splitlines() if l.startswith('| ML-07 |') and 'rank2' in l)
if row not in s:s=s.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->')
marker='### ML-07 本轮执行记录（2026-10-24）'
ownplan=read(repo,path)
if marker in ownplan and marker not in s:s+='\n\n'+ownplan[ownplan.index(marker):].split('\n### ',1)[0]
write(path,s)
path='.agent/semester-03-checklist.md';s=read(dest,path);row=next(l for l in read(repo,path).splitlines() if l.startswith('| ML-07 |'));s=re.sub(r'^\| ML-07 \|.*$',lambda m:row,s,flags=re.M);write(path,s)
path='.agent/delivery-tracker.md';s=read(dest,path);s=re.sub(r'^\| \[ \] 表征学习 \(representation-learning\).*$', '| [x] 表征学习 (representation-learning) | 学期3 ML-07；Phase1–4与数值/真实页面证据见 .agent/semester-03/ml-07/acceptance.md |',s,flags=re.M);write(path,s)
for path in ['content/machine-learning/representation-learning.mdx','lib/representation-basics.ts','components/wiki/representation-basics-explorer.tsx','docs/discuss-log/semester-03/08-machine-learning/07-representation-learning.md']:
 write(path,read(repo,path))
shutil.copytree(repo/'.agent/semester-03/ml-07',dest/'.agent/semester-03/ml-07',dirs_exist_ok=True)
proof=repo/'.agent/semester-03/ml-07/pyodide.json'
if proof.exists():
 data=json.loads(proof.read_text(encoding="utf-8"));lesson=next(l for l in data['lessons'] if l['key']=='machine-learning/representation-learning')
 path='lib/python-support.json';policy=json.loads(read(dest,path));policy['lessons'][lesson['key']]={'sourceHash':lesson['sourceHash'],'notebooks':[{'id':n['id'],'title':n['title'],'status':'enabled','reason':'','cells':n['cellCount']} for n in lesson['notebooks']]};write(path,json.dumps(policy,ensure_ascii=False,indent=2)+'\n')
 path='docs/deployment/python-expansion-local.json';r=json.loads(read(dest,path));r['lessons']=[l for l in r['lessons'] if l['key']!=lesson['key']]+[lesson];r['provenance']=r.get('provenance',[])+[{'testedAt':data['testedAt'],'url':data['url'],'inputPath':'.agent/semester-03/ml-07/pyodide.json'}]
 r['totals']={'lessons':len(r['lessons']),'notebooks':sum(len(l['notebooks']) for l in r['lessons']),'enabled':sum(n['status']=='passed' for l in r['lessons'] for n in l['notebooks']),'codeOnly':sum(n['status']=='code' for l in r['lessons'] for n in l['notebooks'])}
 r['releaseTotals']={'lessons':len(policy['lessons']),'notebooks':sum(len(l['notebooks']) for l in policy['lessons'].values()),'enabled':sum(n['status']=='enabled' for l in policy['lessons'].values() for n in l['notebooks']),'codeOnly':sum(n['status']=='code' for l in policy['lessons'].values() for n in l['notebooks'])};write(path,json.dumps(r,ensure_ascii=False,indent=2)+'\n')
(dest/'projection-base.txt').write_text(base)
print(json.dumps({'base':base,'root':str(dest),'ownLesson':'ML-07'}))
