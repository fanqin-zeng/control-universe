from pathlib import Path
import subprocess,os,time,urllib.request,socket,json
root=Path('D:/Workspace/control-universe');runtime=Path('D:/Workspace/control-universe-rank3-id09');f=root/'.agent/semester-03/id-09';env={**os.environ,'PYTHONIOENCODING':'utf-8'}
def run(args,log=None):
 if log:
  with (f/log).open('wb') as out:subprocess.run(args,cwd=root,env=env,stdout=out,stderr=subprocess.STDOUT,check=True)
 else:subprocess.run(args,cwd=root,env=env,check=True)
run(['python',str(f/'run.py'),'build']);print('Native build passed',flush=True)
with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
ports=json.loads((f/'ports.json').read_text());ports['native']=port;(f/'ports.json').write_text(json.dumps(ports,indent=2));op=urllib.request.build_opener(urllib.request.ProxyHandler({}))
with (f/'native-server.log').open('wb') as out:
 server=subprocess.Popen(['node',str(runtime/'node_modules/next/dist/bin/next'),'start',str(runtime),'-p',str(port)],cwd=runtime,env=env,stdout=out,stderr=subprocess.STDOUT)
 try:
  for _ in range(80):
   assert server.poll() is None,'Own Next bind failed'
   try:
    if op.open(f'http://127.0.0.1:{port}/identification/identification-case-study',timeout=2).status==200:break
   except Exception:time.sleep(.5)
  else:raise RuntimeError('Own Next did not become ready')
  run(['node',str(f/'page-audit.cjs')],'browser-native.log');run(['python',str(f/'run.py'),'verify'])
 finally:server.terminate();server.wait(timeout=20)
print('Native actual page passed and stopped',flush=True);run(['python',str(f/'run.py'),'pages']);print('Pages build passed',flush=True);run(['python',str(f/'pages-audit.py')]);print('PASS final native and Pages actual pages',flush=True)
