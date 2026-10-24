from pathlib import Path
import subprocess,json,os,sys
f=Path('.agent/semester-03/id-03');r=Path('D:/Workspace/control-universe-rank3-id03')
commit=(f/'delivery-commit.txt').read_text().strip();base=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip()
row=f'| ID-03 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/09-identification/03-least-squares-rls.md;.agent/semester-03/id-03/acceptance.md;commit:{commit} |'
path='.agent/semester-03-checklist.md'
def replace(s):return '\n'.join(row if l.startswith('| ID-03 |') else l for l in s.split('\n'))
for p in [Path(path),r/path]:p.write_text(replace(p.read_text(encoding='utf8')),encoding='utf8')
p=f/'acceptance.md';s=p.read_text(encoding='utf8').replace('96课策略hash一致，411enabled/14codeOnly','98课策略hash一致，416enabled/14codeOnly')
if '真实交付提交：' not in s:s+=f'\n真实交付提交：`{commit}`，已进入master。共享Git索引未改；通过专用索引和master旧值比较后原子更新。最终门槛针对0deee62加本课，check PASS21/WARN2/FAIL0、Python98课/416enabled/14codeOnly；构建df72d0a加本课的源与交互不变，后续APP-01/EST-02保留各自已验证提交。\n'
p.write_text(s,encoding='utf8')
env={**os.environ,'GIT_DIR':str(Path('.git').resolve())}
if not (f/'receipt-semester.log').exists():
 res=subprocess.run(['node','scripts/check-semester03.mjs'],cwd=r,env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True);(f/'receipt-semester.log').write_bytes(res.stdout)
# Keep each changed lesson policy in the shared working file without copying other preview rows.
for name in ['lib/python-support.json','docs/deployment/python-expansion-local.json']:
 p=Path(name);a=json.loads(p.read_text(encoding='utf8'));b=json.loads((r/name).read_text(encoding='utf8'));keys=['identification/least-squares-rls','nonlinear/adaptive-control-basics']
 if name.startswith('lib/'):
  for k in keys:a['lessons'][k]=b['lessons'][k]
 else:
  records={l['key']:l for l in a['lessons']}
  for l in b['lessons']:
   if l['key'] in keys:records[l['key']]=l
  a['lessons']=list(records.values());a['totals']={'lessons':len(records),'notebooks':sum(len(l['notebooks']) for l in records.values()),'enabled':sum(n['status']=='passed' for l in records.values() for n in l['notebooks']),'codeOnly':sum(n['status']=='code' for l in records.values() for n in l['notebooks'])};a['releaseTotals']=dict(a['totals'])
 p.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
env={**os.environ,'GIT_INDEX_FILE':str(Path('.git/id03-receipt.index').resolve())}
base=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip()
def git(*args,data=None):return subprocess.check_output(['git',*args],env=env,input=data)
git('read-tree',base)
files=[p for p in f.rglob('*') if p.is_file() and p.name not in ['tree.txt','scope-diff.log','receipt-commit.txt']]
for p in files:
 data=p.read_bytes()
 if p.suffix!='.png':data=data.replace(b'\r\n',b'\n')
 blob=git('hash-object','-w','--stdin',data=data).decode().strip();git('update-index','--add','--cacheinfo','100644',blob,p.as_posix())
s=replace(git('show',base+':'+path).decode());blob=git('hash-object','-w','--stdin',data=s.encode()).decode().strip();git('update-index','--cacheinfo','100644',blob,path)
subprocess.run(['git','diff','--cached','--check','--','.',':(exclude)*.log'],env=env,check=True)
tree=git('write-tree').decode().strip();result=git('commit-tree',tree,'-p',base,'-m','docs: record ID-03 master delivery and final acceptance').decode().strip();git('update-ref','refs/heads/master',result,base);print(result)
