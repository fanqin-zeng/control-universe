"""Retry preparation only if another session advances master during the gates."""
from pathlib import Path
import subprocess,json,sys
root=Path.cwd();ev=root/'.agent/semester-03/app-01'
def run(args,cwd,log):
    with (ev/log).open('w',encoding='utf-8') as output:
        return subprocess.run(args,cwd=cwd,stdout=output,stderr=subprocess.STDOUT).returncode
check_code="""import {readFileSync,writeFileSync} from 'node:fs';import {validateSemester03} from './scripts/check-semester03.mjs';const r=validateSemester03({root:'D:/Workspace/control-universe',plan:readFileSync('.agent/semester-03-plan.md','utf8'),checklist:readFileSync('.agent/semester-03-checklist.md','utf8'),baseline:JSON.parse(readFileSync('.agent/semester-03-baseline.json','utf8'))});writeFileSync('D:/Workspace/control-universe/.agent/semester-03/app-01/scoped-semester-check.json',JSON.stringify(r,null,2));console.log(JSON.stringify(r));if(r.errors.length)process.exitCode=1;"""
for attempt in range(1,6):
    assert run([sys.executable,str(ev/'prepare_scope.py')],root,'scope.log')==0
    r=json.loads((ev/'staging-base.json').read_text());scope=Path(r['scope'])
    print('APP-01 attempt',attempt,'base',r['base'],flush=True)
    run(['node','scripts/check-catalog.mjs','--fix-outline','--fix-tracker-stats'],scope,'scoped-refresh.log')
    assert run(['node','scripts/check-catalog.mjs'],scope,'scoped-check.log')==0,'scoped catalog failed'
    assert run(['node','scripts/check-python-support.mjs'],scope,'scoped-python-policy.log')==0,'scoped Python failed'
    assert run(['node','--input-type=module','-e',check_code],scope,'scoped-semester-check.log')==0,'scoped plan failed'
    head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
    if head!=r['base']:
        print('master advanced to',head,'; preserving that delivery and retrying',flush=True);continue
    log=f'commit-attempt-{attempt}.log'
    status=run([sys.executable,str(ev/'commit_scope.py')],root,log)
    if status==0:
        print((ev/log).read_text(encoding='utf-8'),flush=True);break
    current=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
    if current!=r['base']:
        subject=subprocess.check_output(['git','log','-1','--format=%s'],text=True).strip()
        if subject.startswith('feat: deliver APP-01'):
            print('APP-01 committed; inspect index normalization output:',log,flush=True);break
        print('CAS protected concurrent commit; retrying',flush=True);continue
    raise RuntimeError((ev/log).read_text(encoding='utf-8'))
else:raise RuntimeError('master advanced during five runs; no ref was overwritten')
