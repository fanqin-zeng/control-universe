"""Final source builds and real page audits; operate only the rank4 runtime and owned processes."""
from pathlib import Path
import subprocess,os,json,time,urllib.request,shutil,socket
root=Path(__file__).resolve().parents[3];dest=Path('D:/Workspace/control-universe-rank4-est05');folder=root/'.agent/semester-03/est-05'
env=os.environ.copy();env.update(PYTHONIOENCODING='utf-8')
for key in ['PAGES_BUILD','NEXT_PUBLIC_BASE_PATH','NEXT_PUBLIC_STATIC_EXPORT']:env.pop(key,None)
records=json.loads((folder/'runtime-commands.json').read_text(encoding='utf8'))[:3] if os.environ.get('EST05_RESUME_PAGES')=='1' else []
def run(label,args,cwd=dest,extra=None):
    e=env.copy();e.update(extra or {})
    with (folder/(label+'.log')).open('wb') as log:p=subprocess.run(args,cwd=cwd,env=e,stdout=log,stderr=subprocess.STDOUT)
    records.append(dict(label=label,command=args,exitCode=p.returncode))
    (folder/'runtime-commands.json').write_text(json.dumps(records,indent=2),encoding='utf8')
    assert p.returncode==0,(label,p.returncode)
    print(label,'PASS',flush=True)
def start(label,args,port):
    with socket.socket() as s:s.bind(('127.0.0.1',port))
    out=(root/'logs'/('est05-'+label+'.log')).open('wb')
    p=subprocess.Popen(args,cwd=dest,env=env,stdout=out,stderr=subprocess.STDOUT,creationflags=subprocess.CREATE_NO_WINDOW)
    (folder/(label+'-process.json')).write_text(json.dumps(dict(pid=p.pid,args=args,port=port)),encoding='utf8')
    return p,out
def ready(port,path):
    deadline=time.time()+90
    while time.time()<deadline:
        try:
            with urllib.request.build_opener(urllib.request.ProxyHandler({})).open('http://127.0.0.1:'+str(port)+path,timeout=5) as r:
                if r.status==200:return
        except Exception:time.sleep(.5)
    raise RuntimeError('owned server did not become ready')
def stop(p,out):
    if p.poll() is None:p.terminate();p.wait(timeout=20)
    out.close()
if os.environ.get('EST05_RESUME_PAGES')!='1':
    shutil.copy2(root/'components/wiki/unscented-kalman-explorer.tsx',dest/'components/wiki/unscented-kalman-explorer.tsx')
    run('build',['npm.cmd','run','build'])
    p,out=start('native-preview',['node','node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','18584'],18584)
    try:
        ready(18584,'/estimation/unscented-kalman-filter')
        run('browser-native',['node',str(folder/'audit-page.cjs')],root)
        run('verify',['node','scripts/verify-lesson.mjs','estimation/unscented-kalman-filter'],root,{'WIKI_VERIFY_PORT':'18584'})
    finally:stop(p,out)
run('pages-build',['npm.cmd','run','build:pages'],extra={'PAGES_BUILD':'1','NEXT_PUBLIC_BASE_PATH':'/control-universe','NEXT_PUBLIC_STATIC_EXPORT':'true'})
p,out=start('pages-preview',['node','scripts/serve-pages.mjs','out','18684'],18684)
try:
    ready(18684,'/control-universe/estimation/unscented-kalman-filter/')
    run('browser-pages',['node',str(folder/'audit-page.cjs')],root,{'EST05_PAGE_URL':'http://127.0.0.1:18684/control-universe/estimation/unscented-kalman-filter/','EST05_AUDIT_NAME':'pages'})
finally:stop(p,out)
run('validation',['node',str(folder/'validate-final.mjs')],root)
run('math',['npm.cmd','run','math:check'])
run('glossary',['npm.cmd','run','glossary:check'])
print('Final native + Pages source verification complete',flush=True)
