from pathlib import Path
import subprocess,socket,json,os,time,urllib.request,sys
root=Path('D:/Workspace/control-universe');f=root/'.agent/semester-03/id-05';runtime=Path('D:/Workspace/control-universe-rank3-id05');runtime.mkdir(exist_ok=True)
def free():
 with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
kernel=free();env={**os.environ,'JUPYTER_PORT':str(kernel),'PYTHONIOENCODING':'utf-8'};flags=subprocess.CREATE_NO_WINDOW if os.name=='nt' else 0
with (f/'kernel-server.log').open('wb') as out:k=subprocess.Popen(['python',str(root/'scripts/jupyter_server.py')],cwd=root,env=env,stdout=out,stderr=subprocess.STDOUT,creationflags=flags)
op=urllib.request.build_opener(urllib.request.ProxyHandler({}))
for _ in range(60):
 assert k.poll() is None,'Own kernel server failed'
 try:
  if json.load(op.open(f'http://127.0.0.1:{kernel}/health',timeout=1))['status']=='ok':break
 except Exception:time.sleep(.2)
else:raise RuntimeError('Own kernel not ready')
with (f/'fixture-server.log').open('wb') as out:p=subprocess.Popen(['node',str(f/'static-server.cjs'),str(runtime/'public'),'0',str(f/'fixture-port.json')],cwd=root,env=env,stdout=out,stderr=subprocess.STDOUT,creationflags=flags)
for _ in range(60):
 assert p.poll() is None,'Own fixture server failed'
 if (f/'fixture-port.json').exists():
  fixture=json.loads((f/'fixture-port.json').read_text())
  if fixture['pid']==p.pid:break
 time.sleep(.2)
else:raise RuntimeError('Own fixture not ready')
ports={'kernel':kernel,'kernelPid':k.pid,'native':free(),'fixture':fixture['port'],'fixturePid':p.pid};(f/'ports.json').write_text(json.dumps(ports,indent=2));print(json.dumps(ports))
