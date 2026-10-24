"""Validate exact candidate and advance master using a private index and CAS."""
from pathlib import Path
import subprocess,os,json,re,sys
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-10';snap=root.parent/'control-universe-rank1-impl10-validation'
def git(*a,**kw):return subprocess.check_output(['git',*a],cwd=root,**kw)
def run(a,cwd=root,log=None,allowed=(0,)):
    if log:
        with (e/log).open('w',encoding='utf-8') as f:r=subprocess.run(a,cwd=cwd,stdout=f,stderr=subprocess.STDOUT)
    else:r=subprocess.run(a,cwd=cwd)
    assert r.returncode in allowed,(a,r.returncode,log)
assert git('symbolic-ref','--short','HEAD',text=True).strip()=='master'
assert json.loads((e/'validation.json').read_text(encoding='utf-8'))['pass']
for attempt in range(15):
    try:run(['python',str(e/'snapshot.py')])
    except AssertionError:continue
    meta=json.loads((e/'snapshot.json').read_text(encoding='utf-8'));base=meta['base']
    run(['node','scripts/finalize-python-support.mjs',str(e/'pyodide.json'),'--merge'],snap,'python-finalize.log')
    # The generator omits editorial task/category/next metadata. Preserve all
    # other pending entries from the exact parent instead of rewriting them.
    pending='docs/deployment/python-expansion-pending.json'
    prior=json.loads(git('show',base+':'+pending))
    generated=json.loads((snap/pending).read_text(encoding='utf-8'))
    old_other=[r for r in prior if r['lesson']!='implementation/implementation-case-study']
    new_other=[r for r in generated if r['lesson']!='implementation/implementation-case-study']
    assert [{k:v for k,v in r.items() if k not in ['task','category','next']} for r in old_other]==new_other
    own_pending=[r for r in generated if r['lesson']=='implementation/implementation-case-study']
    (snap/pending).write_text(json.dumps(old_other+own_pending,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    run(['node','scripts/check-python-support.mjs'],snap,'python-policy.log')
    run(['python',str(e/'run-catalog.py'),'--fix'],allowed=(0,1))
    run(['python',str(e/'run-catalog.py')])
    run(['node',str(e/'check-scope.mjs')],root,'scoped-semester.log')
    if git('rev-parse','HEAD',text=True).strip()!=base:continue
    # New lesson is allowed in inventories; all other records remain semantic equals.
    for rel in ['lib/python-support.json','docs/deployment/python-expansion-local.json']:
        old=json.loads(git('show',base+':'+rel));new=json.loads((snap/rel).read_text(encoding='utf-8'))
        def rows(doc):return doc['lessons'] if isinstance(doc['lessons'],dict) else {r['key']:r for r in doc['lessons']}
        a,b=rows(old),rows(new);assert set(b)==set(a)|{'implementation/implementation-case-study'}
        assert all(a[k]==b[k] for k in a if k!='implementation/implementation-case-study'),rel
    own=meta['own']+['scripts/verify-implementation-case.mjs','docs/discuss-log/semester-03/07-implementation/10-implementation-case-study.md']
    own += [p.relative_to(root).as_posix() for p in e.rglob('*') if p.is_file() and '__pycache__' not in p.parts]
    env=os.environ.copy();env['GIT_INDEX_FILE']=str(snap/'rank1-impl10.index')
    indexed=lambda *a,**kw:git(*a,env=env,**kw)
    indexed('read-tree',base)
    subprocess.run(['git','add','--',*own],cwd=root,env=env,check=True)
    for rel in meta['shared']:
        oid=git('hash-object','-w','--path='+rel,'--stdin',input=(snap/rel).read_bytes()).decode().strip()
        subprocess.run(['git','update-index','--add','--cacheinfo','100644,'+oid+','+rel],cwd=root,env=env,check=True)
    changed=indexed('diff','--cached','--name-only',text=True,encoding='utf-8').splitlines()
    assert set(changed)<=set(own+meta['shared'])
    subprocess.run(['git','diff','--cached','--check','--','.',':(glob,exclude)**/*.log'],cwd=root,env=env,check=True)
    if git('rev-parse','HEAD',text=True).strip()!=base:continue
    tree=indexed('write-tree',text=True).strip()
    commit=git('commit-tree',tree,'-p',base,input=b'feat: deliver IMPL-10 integrated thermal control case with integer PI and acceptance gates\n').decode().strip()
    r=subprocess.run(['git','update-ref','-m','deliver IMPL-10','refs/heads/master',commit,base],cwd=root)
    if r.returncode:continue
    (e/'delivery.json').write_text(json.dumps({'base':base,'commit':commit,'tree':tree,'sharedIndexModified':False,'method':'private index, commit-tree, compare-and-swap update-ref'},indent=2)+'\n',encoding='utf-8')
    print('DELIVERED',commit,flush=True);break
else:raise RuntimeError('HEAD kept changing; evidence preserved')
