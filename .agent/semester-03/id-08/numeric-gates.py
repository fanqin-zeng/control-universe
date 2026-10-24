from pathlib import Path
import subprocess,json,os
f=Path('.agent/semester-03/id-08');runtime=Path('D:/Workspace/control-universe-rank3-id08');ports=json.loads((f/'ports.json').read_text())
commands=[(['node','scripts/nb-cells.mjs','extract','identification/nonlinear-data-driven-id','--out',str((f/'extracted.json').resolve())],'extract.log',runtime),(['node',str(f/'actual-ts.cjs')],'actual-ts.log',Path.cwd()),(['python',str(f/'reference.py')],'reconciliation.log',Path.cwd()),(['node','scripts/nb-cells.mjs','verify','identification/nonlinear-data-driven-id','--require-kernel','--port',str(ports['kernel']),'--out',str((f/'notebooks.json').resolve())],'notebooks.log',runtime)]
records=[]
for command,log,cwd in commands:
 with (f/log).open('wb') as out:r=subprocess.run(command,cwd=cwd,env={**os.environ,'PYTHONIOENCODING':'utf-8'},stdout=out,stderr=subprocess.STDOUT)
 records.append({'command':command,'cwd':str(cwd),'exitCode':r.returncode,'log':log});print(log,r.returncode,flush=True)
 if r.returncode:break
(f/'numeric-commands.json').write_text(json.dumps(records,indent=2));assert all(r['exitCode']==0 for r in records)
