from pathlib import Path
import subprocess,json,os
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-03';dest=Path('D:/Workspace/control-universe-rank4-est03')
records=json.loads((folder/'runtime-commands.json').read_text(encoding='utf8'))[:5]
assert all(r['exitCode']==0 for r in records)
for label,args,cwd in [('validation',['node',str(folder/'validate-final.mjs')],root),('math',['npm.cmd','run','math:check'],dest),('glossary',['npm.cmd','run','glossary:check'],dest)]:
 with (folder/(label+'.log')).open('wb') as log:p=subprocess.run(args,cwd=cwd,stdout=log,stderr=subprocess.STDOUT)
 records.append(dict(label=label,command=args,exitCode=p.returncode));(folder/'runtime-commands.json').write_text(json.dumps(records,indent=2),encoding='utf8')
 assert p.returncode==0,(label,p.returncode)
 print(label,'PASS',flush=True)
