"""Merge APP-01 into the current index with one atomic Git update; never remove locks."""
from pathlib import Path
import subprocess,ast,json,re,time
root=Path.cwd();ev=root/'.agent/semester-03/app-01'
def git(args,**kw):return subprocess.check_output(['git',*args],cwd=root,**kw)
core=git(['log','master','-1','--format=%H','--grep=^feat: deliver APP-01'],text=True).strip()
paths=git(['diff-tree','--no-commit-id','--name-only','-r',core],text=True).splitlines()
record=json.loads((ev/'staging-base.json').read_text())
module=ast.parse((ev/'prepare_scope.py').read_text(encoding='utf-8'))
ns={'root':root,'json':json,'re':re};exec(compile(ast.Module(body=[n for n in module.body if isinstance(n,ast.FunctionDef) and n.name=='overlay'],type_ignores=[]),'overlay','exec'),ns)
for attempt in range(60):
    if (root/'.git/index.lock').exists():time.sleep(.2);continue
    entries=[]
    for rel in paths:
        if rel in record['shared']:
            staged=git(['show',':'+rel]).decode('utf-8').replace('\r\n','\n')
            data=ns['overlay'](rel,staged).encode()
            blob=git(['hash-object','-w','--path='+rel,'--stdin'],input=data).decode().strip()
        elif rel=='OUTLINE.md':
            staged=git(['show',':'+rel]).decode('utf-8')
            generated=git(['show',core+':'+rel]).decode('utf-8')
            row=next(l for l in generated.splitlines() if 'applications/power-electronics' in l)
            data=('\n'.join(row if 'applications/power-electronics' in l else l for l in staged.splitlines())+'\n').encode()
            blob=git(['hash-object','-w','--path='+rel,'--stdin'],input=data).decode().strip()
        else:blob=git(['rev-parse',core+':'+rel],text=True).strip()
        entries.append('100644 '+blob+'\t'+rel+'\n')
    run=subprocess.run(['git','update-index','--index-info'],input=''.join(entries).encode(),capture_output=True)
    if run.returncode==0:
        print(json.dumps({'pass':True,'paths':len(entries),'delivery':core,'attempt':attempt+1}));break
    if b'index.lock' not in run.stderr:raise RuntimeError(run.stderr.decode())
    time.sleep(.2)
else:raise RuntimeError('Another session still owns index.lock; left it intact')
