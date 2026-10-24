"""Commit the verified APP-01 scope with an alternate index and a CAS ref update.
Other staged entries are preserved; shared entries receive only APP-01 changes.
Run only after inspecting the prepared scope and successful gate evidence.
"""
from pathlib import Path
import os, subprocess, json, tempfile, ast, re
root=Path.cwd();ev=root/'.agent/semester-03/app-01'
def git(args,**kw):
    try:return subprocess.check_output(['git',*args],cwd=root,**kw)
    except subprocess.CalledProcessError as error:
        print(error.output.decode('utf-8',errors='replace') if isinstance(error.output,bytes) else error.output,flush=True)
        raise
record=json.loads((ev/'staging-base.json').read_text(encoding='utf-8'))
base=record['base'];scope=Path(record['scope'])
assert git(['branch','--show-current'],text=True).strip()=='master'
assert git(['rev-parse','HEAD'],text=True).strip()==base,'HEAD advanced: prepare and verify a new scope'
assert '退出码 0' in (ev/'scoped-check.log').read_text(encoding='utf-8')
assert json.loads((ev/'scoped-semester-check.json').read_text(encoding='utf-8'))['errors']==[]
assert json.loads((ev/'scoped-python-policy.log').read_text(encoding='utf-8'))['pass']
assert json.loads((ev/'validation.json').read_text(encoding='utf-8'))['pass']
paths=record['shared']+['OUTLINE.md']+record['owned']
evidence=[p for p in ev.iterdir() if p.is_file() and p.suffix in ['.md','.json','.mjs','.py','.log','.png']]
for p in evidence:
    rel=p.relative_to(root).as_posix();dest=scope/rel;dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_bytes(p.read_bytes());paths.append(rel)
paths=sorted(set(paths))
fd,index=tempfile.mkstemp(prefix='rank15-app01-',suffix='.index');os.close(fd);os.unlink(index)
env={**os.environ,'GIT_INDEX_FILE':index}
def run(args,**kw):return git(args,env=env,**kw)
try:
    run(['read-tree',base])
    for rel in paths:
        blob=run(['hash-object','-w','--path='+rel,'--stdin'],input=(scope/rel).read_bytes()).decode().strip()
        run(['update-index','--add','--cacheinfo','100644',blob,rel])
    # Empty final Markdown lines are valid content; still reject trailing spaces.
    run(['-c','core.whitespace=-blank-at-eof','diff','--cached','--check','--',*record['shared'],*record['owned'],'OUTLINE.md'])
    tree=run(['write-tree']).decode().strip()
    changed=set(run(['diff-tree','--no-commit-id','--name-only','-r',base,tree]).decode().splitlines())
    assert changed<=set(paths)
    commit=run(['commit-tree',tree,'-p',base,'-m','feat: deliver APP-01 power electronics with verified Buck models']).decode().strip()
    git(['update-ref','-m','commit: deliver APP-01','refs/heads/master',commit,base])
    # Merge our changes into the actual index without changing other staged work.
    module=ast.parse((ev/'prepare_scope.py').read_text(encoding='utf-8'))
    overlay_ast=ast.Module(body=[n for n in module.body if isinstance(n,ast.FunctionDef) and n.name=='overlay'],type_ignores=[])
    namespace={'root':root,'json':json,'re':re};exec(compile(overlay_ast,'APP01-overlay','exec'),namespace)
    for rel in paths:
        if rel in record['shared']:
            staged=git(['show',':'+rel]).decode('utf-8').replace('\r\n','\n')
            data=namespace['overlay'](rel,staged).encode('utf-8')
        elif rel=='OUTLINE.md':
            staged=git(['show',':'+rel]).decode('utf-8')
            # Use the official generator's exact APP-01 line; retain other staged rows.
            generated=(scope/rel).read_text(encoding='utf-8')
            replacement=next(l for l in generated.splitlines() if 'applications/power-electronics' in l)
            data='\n'.join(replacement if 'applications/power-electronics' in l else l for l in staged.splitlines()).encode()+b'\n'
        else:data=(scope/rel).read_bytes()
        blob=git(['hash-object','-w','--path='+rel,'--stdin'],input=data).decode().strip()
        git(['update-index','--add','--cacheinfo','100644',blob,rel])
    print(json.dumps({'commit':commit,'parent':base,'paths':sorted(changed)},ensure_ascii=False,indent=2))
finally:
    if os.path.exists(index):os.unlink(index)
