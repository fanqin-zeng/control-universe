from pathlib import Path
import subprocess,os,json
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-07';dest=Path('D:/Workspace/control-universe-rank4-est07')
env=os.environ.copy();env.update(GIT_DIR=str(root/'.git'),GIT_WORK_TREE=str(dest),PYTHONIOENCODING='utf-8')
records=[]
for label,args,allowed in [('refresh',['node','scripts/check-catalog.mjs','--fix-outline','--fix-tracker-stats'],[0,1]),('check',['node','scripts/check-catalog.mjs'],[0]),('semester-check',['node','scripts/check-semester03.mjs'],[0]),('python-policy',['node','scripts/check-python-support.mjs'],[0])]:
 with (folder/(label+'.log')).open('wb') as log:p=subprocess.run(args,cwd=dest,env=env,stdout=log,stderr=subprocess.STDOUT)
 records.append(dict(label=label,command=args,exitCode=p.returncode));(folder/'scope-commands.json').write_text(json.dumps(records,indent=2),encoding='utf8')
 assert p.returncode in allowed,(label,p.returncode)
 print(label,p.returncode,flush=True)
