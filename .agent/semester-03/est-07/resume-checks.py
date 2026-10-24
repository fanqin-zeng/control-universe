from pathlib import Path
import subprocess,json,os
root=Path.cwd();d=root/'.agent/semester-03/est-07';dest=Path('D:/Workspace/control-universe-rank4-est07');records=json.loads((d/'runtime-commands.json').read_text(encoding='utf8'))[:5]
for label,args,cwd in [('validation',['node',str(d/'validate-final.mjs')],root),('math',['npm.cmd','run','math:check'],dest),('glossary',['npm.cmd','run','glossary:check'],dest)]:
 with (d/(label+'.log')).open('wb') as log:p=subprocess.run(args,cwd=cwd,stdout=log,stderr=subprocess.STDOUT)
 records.append(dict(label=label,command=args,exitCode=p.returncode));(d/'runtime-commands.json').write_text(json.dumps(records,indent=2),encoding='utf8');assert p.returncode==0,label
 print(label,'PASS',flush=True)
