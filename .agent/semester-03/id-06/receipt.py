from pathlib import Path
import subprocess,os,json
f=Path('.agent/semester-03/id-06');runtime=Path('D:/Workspace/control-universe-rank3-id06');commit=(f/'delivery-commit.txt').read_text().strip()
row='| ID-06 | '+' | '.join(['[x]']*6)+f' | docs/discuss-log/semester-03/09-identification/06-frequency-domain-id.md;.agent/semester-03/id-06/acceptance.md;commit:{commit} |'
def replace(s):return '\n'.join(row if l.startswith('| ID-06 |') else l for l in s.split('\n'))
p=Path('.agent/semester-03-checklist.md');p.write_text(replace(p.read_text(encoding='utf8')),encoding='utf8');p=runtime/p;p.write_text(replace(p.read_text(encoding='utf8')),encoding='utf8')
p=f/'acceptance.md';s=p.read_text(encoding='utf8')
if '真实交付提交：' not in s:s+=f'\n真实交付提交：`{commit}`，已进入master。共享Git索引保留，本课使用私有索引与master旧值比较后原子更新；回执补充最终检查输出。\n'
p.write_text(s,encoding='utf8')
env={**os.environ,'GIT_DIR':str(Path('.git').resolve())}
with (f/'receipt-semester.log').open('wb') as out:subprocess.run(['node','scripts/check-semester03.mjs'],cwd=runtime,env=env,stdout=out,stderr=subprocess.STDOUT,check=True)
# Update only this lesson's working policy record, preserving uncommitted records from other chats.
keys=['identification/frequency-domain-id']
for name in ['lib/python-support.json','docs/deployment/python-expansion-local.json']:
 p=Path(name);a=json.loads(p.read_text(encoding='utf8'));b=json.loads((runtime/name).read_text(encoding='utf8'))
 if name.startswith('lib/'):
  for key in keys:a['lessons'][key]=b['lessons'][key]
 else:
  records={l['key']:l for l in a['lessons']}
  for key in keys:records[key]=next(l for l in b['lessons'] if l['key']==key)
  a['lessons']=list(records.values());a['totals']={'lessons':len(records),'notebooks':sum(len(l['notebooks']) for l in records.values()),'enabled':sum(n['status']=='passed' for l in records.values() for n in l['notebooks']),'codeOnly':sum(n['status']=='code' for l in records.values() for n in l['notebooks'])};a['releaseTotals']=dict(a['totals'])
 p.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
env={**os.environ,'GIT_INDEX_FILE':str(Path('.git/id06-receipt.index').resolve())}
def git(*args,data=None):return subprocess.check_output(['git',*args],env=env,input=data)
base=git('rev-parse','HEAD').decode().strip();git('read-tree',base)
files=[p.as_posix() for p in f.rglob('*') if p.is_file() and p.name not in ['scope-diff.log','tree.txt']];git('add','-f','--',*files)
p='.agent/semester-03-checklist.md';s=replace(git('show',base+':'+p).decode());blob=git('hash-object','-w','--stdin',data=s.encode()).decode().strip();git('update-index','--cacheinfo','100644',blob,p)
subprocess.run(['git','diff','--cached','--check','--','.',':(exclude)*.log'],env=env,check=True);tree=git('write-tree').decode().strip();result=git('commit-tree',tree,'-p',base,'-m','docs: record ID-06 master delivery and final acceptance').decode().strip();git('update-ref','refs/heads/master',result,base);print(result)
