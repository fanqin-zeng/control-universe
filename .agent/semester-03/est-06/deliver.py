"""Commit only EST-06 with a private index and compare-and-swap; preserve shared staging."""
from pathlib import Path
import subprocess,os,zipfile,shutil,json,hashlib
root=Path(__file__).resolve().parents[3];dest=Path('D:/Workspace/control-universe-rank4-est06');folder=root/'.agent/semester-03/est-06'
paths=['.agent/semester-03/est-06','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03/zh-lang-edit/PLAN.md','.agent/delivery-tracker.md','OUTLINE.md','content/catalog.ts','content/estimation/particle-filter.mdx','components/wiki/particle-filter-explorer.tsx','lib/particle-filter.ts','lib/wiki-components.ts','lib/python-support.json','docs/deployment/python-expansion-local.json','docs/discuss-log/semester-03/10-estimation/06-particle-filter.md','public/diagrams/estimation/particle-resampling.svg']
own=['.agent/semester-03/est-06','content/estimation/particle-filter.mdx','components/wiki/particle-filter-explorer.tsx','lib/particle-filter.ts','docs/discuss-log/semester-03/10-estimation/06-particle-filter.md','public/diagrams/estimation/particle-resampling.svg']
def run(args,cwd=root,env=None):return subprocess.check_output(args,cwd=cwd,env=env,text=True,encoding='utf8',stderr=subprocess.STDOUT).strip()
assert run(['git','branch','--show-current'])=='master'
for attempt in range(1,9):
    parent=run(['git','rev-parse','HEAD']);print('ATTEMPT',attempt,'parent',parent,flush=True)
    archive=root/'logs/est06-snapshot.zip';subprocess.run(['git','archive',parent,'--format=zip','--output='+str(archive)],cwd=root,check=True)
    with zipfile.ZipFile(archive) as z:
        for name in z.namelist():
            target=(dest/name).resolve()
            assert target==dest.resolve() or dest.resolve() in target.parents,('Archive path escapes runtime copy',name)
        z.extractall(dest)
    env=os.environ.copy();env['EST06_BASELINE']=parent;env['PYTHONIOENCODING']='utf-8'
    project=run(['python',str(folder/'project.py')],env=env);print(project,flush=True)
    checks=[]
    for name,args,allowed in [
        ('projection-refresh.log',['node','scripts/check-catalog.mjs','--fix-outline','--fix-tracker-stats'],[0,1]),
        ('projection-check.log',['npm.cmd','run','check'],[0]),
        ('projection-python-policy.log',['node','scripts/check-python-support.mjs'],[0]),
        ('projection-semester.log',['node','scripts/check-semester03.mjs'],[0]),
        ('projection-glossary.log',['npm.cmd','run','glossary:check'],[0]),
        ('projection-math.log',['npm.cmd','run','math:check'],[0]),
    ]:
        gate_env=env.copy();gate_env['GIT_DIR']=str(root/'.git');gate_env['GIT_WORK_TREE']=str(dest)
        result=subprocess.run(args,cwd=dest,env=gate_env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
        (folder/name).write_bytes(result.stdout);checks.append({'command':args,'exitCode':result.returncode})
        assert result.returncode in allowed,(name,result.returncode)
    if run(['git','rev-parse','HEAD'])!=parent:
        print('HEAD advanced; rebuild only the scoped commit snapshot',flush=True);continue
    for name,expected in json.loads((folder/'source-fingerprints.json').read_text(encoding='utf8')).items():
        for base in [root,dest]:
            actual=hashlib.sha256((base/name).read_bytes().replace(b'\r\n',b'\n')).hexdigest()
            assert actual==expected,('Tested source changed before commit',str(base/name))
    for name,expected in json.loads((folder/'dependency-fingerprints.json').read_text(encoding='utf8')).items():
        raw=subprocess.check_output(['git','show',parent+':'+name],cwd=root).replace(b'\r\n',b'\n')
        assert hashlib.sha256(raw).hexdigest()==expected,('Tested dependency changed',name)
    (folder/'commit-gates.json').write_text(json.dumps({'parent':parent,'attempt':attempt,'checks':checks,'sharedIndex':'preserved; private index used'},indent=2)+'\n',encoding='utf8')
    shutil.copy2(dest/'.agent/semester-03/est-06/projection-parent.txt',folder/'projection-parent.txt')
    for f in folder.glob('*.log'):
        s=f.read_text(encoding='utf8');f.write_text('\n'.join(l.rstrip() for l in s.splitlines()).rstrip()+'\n',encoding='utf8')
    shutil.copytree(folder,dest/'.agent/semester-03/est-06',dirs_exist_ok=True)
    index_env=env.copy();index_env.update(GIT_INDEX_FILE=str(root/'logs/est06-index'),GIT_DIR=str(root/'.git'),GIT_WORK_TREE=str(dest))
    def git(*a):return run(['git',*a],cwd=dest,env=index_env)
    git('read-tree',parent);git('add','--',*paths);git('diff','--cached','--check')
    changed=git('diff','--cached','--name-only').splitlines()
    assert all(any(f==p or f.startswith(p+'/') for p in paths) for f in changed),changed
    tree=git('write-tree');commit=git('commit-tree',tree,'-p',parent,'-m','feat: deliver EST-06 particle filtering with verified resampling and support limits')
    update=subprocess.run(['git','update-ref','-m','commit: deliver EST-06 particle filtering','refs/heads/master',commit,parent],cwd=root,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    if update.returncode:
        print('HEAD changed at commit; retry without overwriting it',flush=True);continue
    # Never reset shared metadata: another chat owns its current staged contents.
    (root/'logs/est06-delivery-hash.txt').write_text(commit+'\n',encoding='utf8')
    print('COMMITTED',commit,flush=True);break
else:raise RuntimeError('Repeated concurrent HEAD updates; task evidence retained, no unsafe ref overwrite')
