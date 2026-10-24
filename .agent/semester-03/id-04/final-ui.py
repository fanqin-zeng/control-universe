from pathlib import Path
import subprocess,os,sys,time,urllib.request,shutil,json
root=Path('D:/Workspace/control-universe');runtime=Path('D:/Workspace/control-universe-rank3-id04');f=root/'.agent/semester-03/id-04';env={**os.environ,'PYTHONIOENCODING':'utf-8'}
shutil.copyfile(root/'components/wiki/persistent-excitation-explorer.tsx',runtime/'components/wiki/persistent-excitation-explorer.tsx')
def run(args,log=None,extra=None):
 if log:
  with (f/log).open('wb') as out:subprocess.run(args,cwd=root,env={**env,**(extra or {})},stdout=out,stderr=subprocess.STDOUT,check=True)
 else:subprocess.run(args,cwd=root,env=env,check=True)
def ready(url):
 op=urllib.request.build_opener(urllib.request.ProxyHandler({}))
 for _ in range(80):
  try:
   if op.open(url,timeout=2).status==200:return
  except Exception:time.sleep(.5)
 raise RuntimeError('Own server not ready '+url)
run(['python',str(f/'run.py'),'build']);print('Final native build passed',flush=True)
with (f/'native-server.log').open('wb') as out:
 server=subprocess.Popen(['node',str(runtime/'node_modules/next/dist/bin/next'),'start',str(runtime),'-p','18194'],cwd=runtime,env=env,stdout=out,stderr=subprocess.STDOUT)
 try:
  ready('http://127.0.0.1:18194/identification/persistent-excitation');run(['node',str(f/'page-audit.cjs')],'browser-native.log');run(['python',str(f/'run.py'),'verify'])
 finally:server.terminate();server.wait(timeout=20)
print('Final native actual page passed',flush=True)
run(['python',str(f/'run.py'),'pages']);print('Final Pages build passed',flush=True)
run(['python',str(f/'pages-audit.py')])
print('PASS final native and Pages actual pages; own preview processes stopped',flush=True)
