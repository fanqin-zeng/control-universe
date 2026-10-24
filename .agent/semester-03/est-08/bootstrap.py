from pathlib import Path
import subprocess,zipfile,socket,os,json
root=Path.cwd();dest=Path('D:/Workspace/control-universe-rank4-est08');d=root/'.agent/semester-03/est-08';base=(d/'baseline-commit.txt').read_text().strip()
assert not dest.exists(), 'Do not overwrite existing runtime'
archive=root/'logs/est08-initial.zip';subprocess.run(['git','archive',base,'--format=zip','--output='+str(archive)],check=True);dest.mkdir()
with zipfile.ZipFile(archive) as z:
 for name in z.namelist():assert dest.resolve() in (dest/name).resolve().parents or (dest/name).resolve()==dest.resolve()
 z.extractall(dest)
for relative in ['node_modules','public/pyodide']:
 link=dest/relative;link.parent.mkdir(parents=True,exist_ok=True)
 subprocess.run(['powershell','-NoProfile','-Command',f'New-Item -ItemType Junction -Path "{link}" -Target "{root/relative}" | Out-Null'],check=True)
subprocess.run(['git','init',str(dest)],check=True,stdout=subprocess.DEVNULL)
(dest/'.git/objects/info/alternates').write_bytes((str(root/'.git/objects').replace('\\','/')+'\n').encode())
for args in [['update-ref','refs/heads/master',base],['symbolic-ref','HEAD','refs/heads/master'],['read-tree','HEAD']]:subprocess.run(['git',*args],cwd=dest,check=True)
subprocess.run(['python',str(d/'project.py')],check=True)
records=[]
for label,port,args in [('jupyter',19884,['python','scripts/jupyter_server.py']),('fixture',19984,['python','-m','http.server','19984','--bind','127.0.0.1','--directory','public'])]:
 with socket.socket() as s:s.bind(('127.0.0.1',port))
 env=os.environ.copy();env.update(JUPYTER_PORT='19884',PYTHONIOENCODING='utf-8')
 with (root/('logs/est08-'+label+'.log')).open('wb') as out:p=subprocess.Popen(args,cwd=dest,env=env,stdout=out,stderr=subprocess.STDOUT,creationflags=subprocess.CREATE_NO_WINDOW)
 records.append(dict(label=label,port=port,pid=p.pid,args=args))
(root/'logs/est08-services.json').write_text(json.dumps(records,indent=2),encoding='utf8')
print('Runtime and owned services ready',records)
