"""Commit only EST-02 with a private index and compare-and-swap; preserve shared staging."""
from pathlib import Path
import subprocess,os,zipfile,shutil,json
root=Path(__file__).resolve().parents[3];dest=Path('D:/Workspace/control-universe-rank4-est02');folder=root/'.agent/semester-03/est-02'
paths=['.agent/semester-03/est-02','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/semester-03/zh-lang-edit/PLAN.md','.agent/delivery-tracker.md','OUTLINE.md','content/catalog.ts','content/estimation/least-squares-ml.mdx','components/wiki/statistical-estimation-explorer.tsx','lib/statistical-estimation.ts','lib/wiki-components.ts','lib/python-support.json','docs/deployment/python-expansion-local.json','docs/discuss-log/semester-03/10-estimation/02-least-squares-ml.md','public/diagrams/estimation/statistical-estimation.svg']
own=['.agent/semester-03/est-02','content/estimation/least-squares-ml.mdx','components/wiki/statistical-estimation-explorer.tsx','lib/statistical-estimation.ts','docs/discuss-log/semester-03/10-estimation/02-least-squares-ml.md','public/diagrams/estimation/statistical-estimation.svg']
def run(args,cwd=root,env=None):return subprocess.check_output(args,cwd=cwd,env=env,text=True,encoding='utf8',stderr=subprocess.STDOUT).strip()
assert run(['git','branch','--show-current'])=='master'
for attempt in range(1,9):
    parent=run(['git','rev-parse','HEAD']);print('ATTEMPT',attempt,'parent',parent,flush=True)
    archive=root/'logs/est02-snapshot.zip';subprocess.run(['git','archive',parent,'--format=zip','--output='+str(archive)],cwd=root,check=True)
    with zipfile.ZipFile(archive) as z:
        for name in z.namelist():
            target=(dest/name).resolve()
            assert target==dest.resolve() or dest.resolve() in target.parents,('Archive path escapes runtime copy',name)
        z.extractall(dest)
    env=os.environ.copy();env['EST02_BASELINE']=parent;env['PYTHONIOENCODING']='utf-8'
    project=run(['python',str(folder/'project.py')],env=env);print(project,flush=True)
    checks=[]
    for name,args,allowed in [
        ('projection-refresh.log',['node','scripts/check-catalog.mjs','--fix-outline','--fix-tracker-stats'],[0,1]),
        ('projection-check.log',['node','scripts/check-catalog.mjs'],[0]),
        ('projection-python-policy.log',['node','scripts/check-python-support.mjs'],[0]),
        ('projection-semester.log',['node','scripts/check-semester03.mjs'],[0]),
    ]:
        gate_env=env.copy();gate_env['GIT_DIR']=str(root/'.git');gate_env['GIT_WORK_TREE']=str(dest)
        result=subprocess.run(args,cwd=dest,env=gate_env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
        (folder/name).write_bytes(result.stdout);checks.append({'command':args,'exitCode':result.returncode})
        assert result.returncode in allowed,(name,result.returncode)
    if run(['git','rev-parse','HEAD'])!=parent:
        print('HEAD advanced; rebuild only the scoped commit snapshot',flush=True);continue
    (folder/'commit-gates.json').write_text(json.dumps({'parent':parent,'attempt':attempt,'checks':checks,'sharedIndex':'preserved; private index used'},indent=2)+'\n',encoding='utf8')
    shutil.copy2(dest/'.agent/semester-03/est-02/projection-parent.txt',folder/'projection-parent.txt')
    for f in folder.glob('*.log'):
        s=f.read_text(encoding='utf8');f.write_text('\n'.join(l.rstrip() for l in s.splitlines()).rstrip()+'\n',encoding='utf8')
    shutil.copytree(folder,dest/'.agent/semester-03/est-02',dirs_exist_ok=True)
    index_env=env.copy();index_env.update(GIT_INDEX_FILE=str(root/'logs/est02-index'),GIT_DIR=str(root/'.git'),GIT_WORK_TREE=str(dest))
    def git(*a):return run(['git',*a],cwd=dest,env=index_env)
    git('read-tree',parent);git('add','--',*paths);git('diff','--cached','--check')
    changed=git('diff','--cached','--name-only').splitlines()
    assert all(any(f==p or f.startswith(p+'/') for p in paths) for f in changed),changed
    tree=git('write-tree');commit=git('commit-tree',tree,'-p',parent,'-m','feat: deliver EST-02 statistical estimation with verified models and risks')
    update=subprocess.run(['git','update-ref','-m','commit: deliver EST-02 statistical estimation','refs/heads/master',commit,parent],cwd=root,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    if update.returncode:
        print('HEAD changed at commit; retry without overwriting it',flush=True);continue
    # Never reset shared metadata: another chat owns its current staged contents.
    subprocess.run(['git','reset','-q','HEAD','--',*own],cwd=root,check=True)
    (root/'logs/est02-delivery-hash.txt').write_text(commit+'\n',encoding='utf8')
    print('COMMITTED',commit,flush=True);break
else:raise RuntimeError('Repeated concurrent HEAD updates; task evidence retained, no unsafe ref overwrite')
