"""Append a scoped notation-sentinel correction without rewriting delivery history."""
from pathlib import Path
import subprocess,os,re,json,shutil
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-05';dest=Path('D:/Workspace/control-universe-rank4-est05')
own=['.agent/semester-03/est-05/project.py','.agent/semester-03/est-05/fix-notation.py','.agent/semester-03/est-05/acceptance.md','.agent/semester-03/est-05/commit-scope-audit.json']
evidence=['.agent/semester-03/est-05/notation-fix-glossary.log','.agent/semester-03/est-05/notation-fix-gates.json']
paths=own+evidence+['docs/semester-02/04-notation.md']
def run(a,cwd=root,env=None):return subprocess.check_output(a,cwd=cwd,env=env,text=True,encoding='utf8',stderr=subprocess.STDOUT).strip()
for attempt in range(1,9):
    parent=run(['git','rev-parse','HEAD'])
    s=subprocess.check_output(['git','show',parent+':docs/semester-02/04-notation.md'],cwd=root).decode('utf8')
    marker='\n<!-- REGISTER-START -->\n';i=s.index(marker)
    before=re.sub(r'^\| \$\\chi\$ \|[^\n]+\n','',s[:i],flags=re.M);s=before+s[i:]
    assert sum(l.startswith(r'| $\chi$ |') for l in s.splitlines())==1
    (dest/'docs/semester-02/04-notation.md').write_text(s,encoding='utf8')
    for name in own:shutil.copy2(root/name,dest/name)
    with (folder/'notation-fix-glossary.log').open('wb') as log:p=subprocess.run(['npm.cmd','run','glossary:check'],cwd=dest,stdout=log,stderr=subprocess.STDOUT)
    assert p.returncode==0
    (folder/'notation-fix-gates.json').write_text(json.dumps(dict(parent=parent,attempt=attempt,command=['npm.cmd','run','glossary:check'],exitCode=0,notationRows=1,scope='remove only EST-05 duplicate in introductory prose, exact-line sentinel in projection helper'),indent=2),encoding='utf8')
    p=folder/'notation-fix-glossary.log';p.write_text('\n'.join(l.rstrip() for l in p.read_text(encoding='utf8').splitlines())+'\n',encoding='utf8')
    for name in evidence:shutil.copy2(root/name,dest/name)
    if run(['git','rev-parse','HEAD'])!=parent:continue
    env=os.environ.copy();env.update(GIT_DIR=str(root/'.git'),GIT_WORK_TREE=str(dest),GIT_INDEX_FILE=str(root/'logs/est05-notation-index'))
    def git(*a):return run(['git',*a],cwd=dest,env=env)
    git('read-tree',parent);git('add','--',*paths);git('diff','--cached','--check')
    assert set(git('diff','--cached','--name-only').splitlines()).issubset(paths)
    tree=git('write-tree');commit=git('commit-tree',tree,'-p',parent,'-m','fix: confine EST-05 notation registration to data table')
    p=subprocess.run(['git','update-ref','refs/heads/master',commit,parent],cwd=root,capture_output=True)
    if p.returncode:continue
    (root/'logs/est05-notation-fix-hash.txt').write_text(commit+'\n',encoding='utf8');print('Notation fix committed',commit,flush=True);break
else:raise RuntimeError('Concurrent HEAD kept advancing')
