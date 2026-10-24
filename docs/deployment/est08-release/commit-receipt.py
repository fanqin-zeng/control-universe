"""Commit the verified publication receipt on master with an isolated index and CAS."""
from pathlib import Path
import subprocess,os,zipfile,json,re,shutil
root=Path(__file__).resolve().parents[3];d=root/'docs/deployment/est08-release';merge=json.loads((d/'merge.json').read_text(encoding='utf8'));release=merge['release']
assert json.loads((d/'actions.json').read_text(encoding='utf8'))['run']['conclusion']=='success'
http=json.loads((d/'public-http.json').read_text(encoding='utf8'));courses=json.loads((d/'public-courses.json').read_text(encoding='utf8'));assert http['pass'] and courses['pass'] and courses['notebooks']==20 and courses['cells']==40
assert http['release']['sourceCommit']==release and http['release']['sourceDirty'] is False
row='| DEP15 | EST-01—08与bd2b41c快照授权发布及公网验收 | [x] | docs/deployment/est08-release/README.md;docs/deployment/est08-release/public-http.json;docs/deployment/est08-release/public-courses.json;发布commit:'+release+' |'
footer='''<!-- EST08-PAGES-RECEIPT-BEGIN -->

2026-10-24用户要求将已完成内容推送Pages：固定master `'''+merge['approvedMaster']+'''`，正常no-ff合入gh-pages `'''+release+'''`，内容树完全一致。GitHub Actions成功，规范公网域名已为https://fanqin-zeng.github.io/control-universe/ 。全站205课/9旧入口与资源、未知页404、EST-01—08共20本40cell页内实跑/精确锚点/375px通过；EST-08离群门限控件与恢复通过。只发布获准快照，后续并行master更新未自动发布。证据[本次发布记录](est08-release/README.md)。
<!-- EST08-PAGES-RECEIPT-END -->'''
p=root/'.agent/semester-03-checklist.md';s=p.read_text(encoding='utf8');assert '| DEP15 |' in s;p.write_text(re.sub(r'^\| DEP15 \|.*$',lambda m:row,s,flags=re.M),encoding='utf8')
p=root/'docs/deployment/github-pages.md';s=p.read_text(encoding='utf8').replace('公网地址：https://fanqing-zeng.github.io/control-universe/','公网地址：https://fanqin-zeng.github.io/control-universe/',1)
if '<!-- EST08-PAGES-RECEIPT-BEGIN -->' not in s:s=s.rstrip()+'\n'+footer+'\n'
p.write_text(s,encoding='utf8')
paths=['docs/deployment/est08-release','docs/deployment/github-pages.md','.agent/semester-03-checklist.md'];work=root.parent/'control-universe-rank4-pages-est08-receipt-v2';work.mkdir(exist_ok=False)
for attempt in range(1,9):
 parent=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip();dest=work/str(attempt);dest.mkdir();archive=root/'logs/est08-pages-receipt.zip'
 subprocess.run(['git','archive',parent,'--format=zip','--output='+str(archive)],cwd=root,check=True)
 with zipfile.ZipFile(archive) as z:
  assert all((dest/n).resolve()==dest.resolve() or dest.resolve() in (dest/n).resolve().parents for n in z.namelist());z.extractall(dest)
 subprocess.run(['powershell','-NoProfile','-Command',f'New-Item -ItemType Junction -Path "{dest}/node_modules" -Target "{root}/node_modules" | Out-Null'],check=True)
 def head(n):return subprocess.check_output(['git','show',parent+':'+n],cwd=root).decode('utf8')
 s=head('.agent/semester-03-checklist.md')
 if '| DEP15 |' in s:
  prior=next(l for l in s.splitlines() if l.startswith('| DEP15 |'));assert 'est08-release' in prior,'DEP15 used concurrently; inspect unique task ID';s=re.sub(r'^\| DEP15 \|.*$',lambda m:row,s,flags=re.M)
 else:s=s.replace('<!-- S3-TASKS-END -->',row+'\n<!-- S3-TASKS-END -->')
 (dest/'.agent/semester-03-checklist.md').write_text(s,encoding='utf8')
 s=head('docs/deployment/github-pages.md').replace('公网地址：https://fanqing-zeng.github.io/control-universe/','公网地址：https://fanqin-zeng.github.io/control-universe/',1);assert '<!-- EST08-PAGES-RECEIPT-BEGIN -->' not in s;(dest/'docs/deployment/github-pages.md').write_text(s.rstrip()+'\n'+footer+'\n',encoding='utf8')
 checks=[];env=os.environ.copy();env.update(GIT_DIR=str(root/'.git'),GIT_WORK_TREE=str(dest),GIT_INDEX_FILE=str(root/'logs/est08-pages-receipt-index'),PYTHONIOENCODING='utf-8')
 subprocess.run(['git','read-tree',parent],cwd=dest,env=env,check=True)
 for label,args in [('receipt-check',['npm.cmd','run','check']),('receipt-semester',['node','scripts/check-semester03.mjs'])]:
  # Copy evidence before each gate so linked paths exist in the exact snapshot.
  shutil.copytree(d,dest/'docs/deployment/est08-release',dirs_exist_ok=True)
  with (d/(label+'.log')).open('wb') as out:p=subprocess.run(args,cwd=dest,env=env,stdout=out,stderr=subprocess.STDOUT)
  checks.append(dict(command=args,exitCode=p.returncode));assert p.returncode==0,label
 if subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()!=parent:continue
 (d/'receipt-gates.json').write_text(json.dumps(dict(parent=parent,attempt=attempt,checks=checks,sharedIndex='untouched'),indent=2),encoding='utf8')
 for f in d.glob('*.log'):f.write_text('\n'.join(l.rstrip() for l in f.read_text(encoding='utf8').splitlines())+'\n',encoding='utf8')
 shutil.copytree(d,dest/'docs/deployment/est08-release',dirs_exist_ok=True)
 def git(*args):return subprocess.check_output(['git',*args],cwd=dest,env=env,text=True).strip()
 git('add','--',*paths);git('diff','--cached','--check');changed=git('diff','--cached','--name-only').splitlines();assert all(any(n==p or n.startswith(p+'/') for p in paths) for n in changed)
 tree=git('write-tree');commit=git('commit-tree',tree,'-p',parent,'-m','docs: record authorized EST-01 through EST-08 Pages release and public acceptance')
 p=subprocess.run(['git','update-ref','refs/heads/master',commit,parent],cwd=root,capture_output=True)
 if p.returncode:continue
 (root/'logs/est08-pages-receipt-hash.txt').write_text(commit+'\n');print('Master receipt',commit,flush=True);break
else:raise RuntimeError('Concurrent master kept advancing; evidence retained, no overwrite')
with (root/'logs/est08-pages-receipt-push.log').open('wb') as out:p=subprocess.run(['git','push','origin','master'],cwd=root,stdout=out,stderr=subprocess.STDOUT)
assert p.returncode==0,'Inspect remote divergence; never force push'
print('Master receipt pushed',commit,flush=True)
