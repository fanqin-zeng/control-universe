"""Push tested main delivery, then record its real hash with a separate scoped CAS commit."""
from pathlib import Path
import subprocess,os,json,re,zipfile,shutil,hashlib
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-06';dest=Path('D:/Workspace/control-universe-rank4-est06')
def run(args,cwd=root,env=None):return subprocess.check_output(args,cwd=cwd,env=env,text=True,encoding='utf8',stderr=subprocess.STDOUT).strip()
main=(root/'logs/est06-delivery-hash.txt').read_text().strip()
assert run(['git','branch','--show-current'])=='master'
subprocess.run(['git','merge-base','--is-ancestor',main,'HEAD'],cwd=root,check=True)
for name,expected in json.loads((folder/'source-fingerprints.json').read_text(encoding='utf8')).items():
    raw=subprocess.check_output(['git','show',main+':'+name],cwd=root).replace(b'\r\n',b'\n')
    assert hashlib.sha256(raw).hexdigest()==expected,('Committed source differs from tested source',name)
with (folder/'push-main.log').open('wb') as log:push=subprocess.run(['git','push','origin','master'],cwd=root,stdout=log,stderr=subprocess.STDOUT)
(folder/'push-main.json').write_text(json.dumps(dict(command=['git','push','origin','master'],exitCode=push.returncode,delivery=main),indent=2),encoding='utf8')
assert push.returncode==0,'Read remote divergence before retrying; no force push'
print('Main pushed',main,flush=True)
row=f'| EST-06 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/10-estimation/06-particle-filter.md;.agent/semester-03/est-06/acceptance.md;commit:{main} |'
p=root/'.agent/semester-03-checklist.md';p.write_text(re.sub(r'^\| EST-06 \|.*$',lambda m:row,p.read_text(encoding='utf8'),flags=re.M),encoding='utf8')
p=folder/'acceptance.md';s=p.read_text(encoding='utf8').replace('验收完成，待master回执','验收完成，已进入master').replace('真实master提交与推送结果待提交后追加','真实master交付提交commit:'+main+'，git push origin master退出0，详见push-main.json/log');p.write_text(s,encoding='utf8')
logpath=root/'docs/discuss-log/semester-03/10-estimation/06-particle-filter.md';s=logpath.read_text(encoding='utf8').replace('真实提交后补master回执；','实际master交付commit:'+main+'，首次push退出0，回执见acceptance.md；');logpath.write_text(s,encoding='utf8')
own=['.agent/semester-03/est-06/receipt.py','.agent/semester-03/est-06/acceptance.md','.agent/semester-03/est-06/push-main.log','.agent/semester-03/est-06/push-main.json',str(logpath.relative_to(root)).replace('\\','/')]
paths=own+['.agent/semester-03-checklist.md','.agent/semester-03/est-06/receipt-semester.log','.agent/semester-03/est-06/receipt-gates.json']
for attempt in range(1,9):
 parent=run(['git','rev-parse','HEAD']);archive=root/'logs/est06-receipt-snapshot.zip'
 subprocess.run(['git','archive',parent,'--format=zip','--output='+str(archive)],cwd=root,check=True)
 with zipfile.ZipFile(archive) as z:
  assert all((dest/name).resolve()==dest.resolve() or dest.resolve() in (dest/name).resolve().parents for name in z.namelist())
  z.extractall(dest)
 for name in own:
  target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,target)
 s=run(['git','show',parent+':.agent/semester-03-checklist.md'])
 (dest/'.agent/semester-03-checklist.md').write_text(re.sub(r'^\| EST-06 \|.*$',lambda m:row,s,flags=re.M)+'\n',encoding='utf8')
 env=os.environ.copy();env.update(GIT_DIR=str(root/'.git'),GIT_WORK_TREE=str(dest),PYTHONIOENCODING='utf-8')
 with (folder/'receipt-semester.log').open('wb') as log:p=subprocess.run(['node','scripts/check-semester03.mjs'],cwd=dest,env=env,stdout=log,stderr=subprocess.STDOUT)
 assert p.returncode==0,'Receipt validation failed; retain evidence and inspect'
 (folder/'receipt-gates.json').write_text(json.dumps(dict(parent=parent,delivery=main,attempt=attempt,command=['node','scripts/check-semester03.mjs'],exitCode=p.returncode,sharedIndex='untouched'),indent=2),encoding='utf8')
 for name in ['receipt-semester.log','push-main.log']:
  f=folder/name;f.write_text('\n'.join(l.rstrip() for l in f.read_text(encoding='utf8').splitlines())+'\n',encoding='utf8')
 for name in ['receipt-semester.log','receipt-gates.json','push-main.log']:shutil.copy2(folder/name,dest/'.agent/semester-03/est-06'/name)
 if run(['git','rev-parse','HEAD'])!=parent:continue
 env['GIT_INDEX_FILE']=str(root/'logs/est06-receipt-index')
 def git(*a):return run(['git',*a],cwd=dest,env=env)
 git('read-tree',parent);git('add','--',*paths);git('diff','--cached','--check')
 assert set(git('diff','--cached','--name-only').splitlines()).issubset(paths)
 tree=git('write-tree');receipt=git('commit-tree',tree,'-p',parent,'-m','docs: record EST-06 master delivery and verified acceptance')
 p=subprocess.run(['git','update-ref','-m','commit: record EST-06 receipt','refs/heads/master',receipt,parent],cwd=root,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 if p.returncode:continue
 (root/'logs/est06-receipt-hash.txt').write_text(receipt+'\n',encoding='utf8');print('Receipt committed',receipt,flush=True);break
else:raise RuntimeError('Concurrent HEAD kept advancing; no unsafe overwrite')
with (root/'logs/est06-push-receipt.log').open('wb') as log:p=subprocess.run(['git','push','origin','master'],cwd=root,stdout=log,stderr=subprocess.STDOUT)
assert p.returncode==0,'Receipt push failed; inspect remote, do not force'
print('Receipt pushed',receipt,flush=True)
