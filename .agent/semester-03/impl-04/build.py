"""Run builds only in the rank1 snapshot; capture actual exit codes."""
from pathlib import Path
import subprocess,json,os,sys,hashlib
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-04';snap=root.parent/'control-universe-rank1-impl04-validation'
origin=json.loads((e/'snapshot.json').read_text(encoding='utf-8'))
source=(snap/'content/implementation/controller-discretization-practice.mdx').read_text(encoding='utf-8').replace('\r\n','\n')
(e/'build-origin.json').write_text(json.dumps({'base':origin['base'],'sourceHash':hashlib.sha256(source.encode()).hexdigest(),'snapshot':str(snap),'testOnlyKernelPort':8991},indent=2)+'\n',encoding='utf-8')
results=[]
for script in ['build','build:pages']:
    env=os.environ.copy()
    if script=='build:pages':env.update(GIT_DIR=str(root/'.git'),GIT_WORK_TREE=str(root),GIT_OPTIONAL_LOCKS='0')
    log=e/(script.replace(':','-')+'.log')
    with log.open('w',encoding='utf-8') as out:r=subprocess.run(['npm.cmd','run',script],cwd=snap,env=env,stdout=out,stderr=subprocess.STDOUT)
    results.append({'command':'npm run '+script,'exit':r.returncode,'log':log.name})
    (e/'build-results.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(results[-1]),flush=True)
    if r.returncode:sys.exit(r.returncode)
