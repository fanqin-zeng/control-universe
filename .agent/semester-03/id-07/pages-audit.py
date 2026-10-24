from pathlib import Path
import subprocess,time,json,os
root=Path('D:/Workspace/control-universe');f=root/'.agent/semester-03/id-07';portfile=f/'pages-port.json';env={**os.environ,'PYTHONIOENCODING':'utf-8'}
with (f/'pages-server-final.log').open('wb') as log:
 server=subprocess.Popen(['node',str(f/'static-server.cjs'),'D:/Workspace/control-universe-rank3-id07/out','0',str(portfile)],cwd=root,env=env,stdout=log,stderr=subprocess.STDOUT)
 try:
  for _ in range(50):
   assert server.poll() is None,'Own server failed to bind'
   if portfile.exists():
    port=json.loads(portfile.read_text())
    if port['pid']==server.pid:break
   time.sleep(.2)
  else:raise RuntimeError('Own ephemeral port not ready')
  env.update(ID07_PAGE_URL=f"http://127.0.0.1:{port['port']}/control-universe/identification/subspace-id/",ID07_AUDIT_NAME='pages')
  with (f/'browser-pages.log').open('wb') as out:subprocess.run(['node',str(f/'page-audit.cjs')],cwd=root,env=env,stdout=out,stderr=subprocess.STDOUT,check=True)
 finally:server.terminate();server.wait(timeout=20)
print('PASS final Pages actual page on own OS-assigned port; server stopped')
