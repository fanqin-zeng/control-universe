from pathlib import Path
import subprocess,os,json
from concurrent.futures import ThreadPoolExecutor
root=Path('D:/Workspace/control-universe');f=root/'.agent/semester-03/id-09';e=f/'pages-release';w=Path('D:/Workspace/control-universe-rank3-pages-id09');c=json.loads((e/'candidate.json').read_text());sha=c['pagesCommit'];env={**os.environ,'ID09_PAGE_URL':'https://fanqin-zeng.github.io/control-universe/identification/identification-case-study/','ID09_AUDIT_NAME':'public','PYTHONIOENCODING':'utf-8'}
def run(item):
 name,command,cwd=item
 with (e/(name+'.log')).open('wb') as out:r=subprocess.run(command,cwd=cwd,env=env,stdout=out,stderr=subprocess.STDOUT)
 print(name,r.returncode,flush=True);return dict(command=command,cwd=str(cwd),exitCode=r.returncode,log=name+'.log')
jobs=[('public-http',['node',str(e/'public-http.mjs'),sha,str(e/'public-http.json')],w),('public-ui',['node',str(e/'public-ui.cjs')],root)]
with ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(run,jobs))
(e/'public-commands.json').write_text(json.dumps(results,indent=2));assert all(r['exitCode']==0 for r in results)
load=lambda p:json.loads(p.read_text(encoding='utf8'))
actions=load(e/'actions.json');assert actions['head_sha']==sha and actions['conclusion']=='success';jobs=load(e/'actions-jobs.json');assert all(j['conclusion']=='success' for j in jobs['jobs'])
http=load(e/'public-http.json');assert http['pass'] and http['release']['sourceCommit']==sha and not http['release']['sourceDirty']
ui=load(f/'browser-public.json');local=load(f/'browser-pages.json');assert ui['pass'] and ui['dom']['h2']==local['dom']['h2'];assert ui['dom']['katexErrors']==0 and ui['mobile']['scroll']==375 and not ui['errors'];assert len(ui['controls'])==16
py=load(e/'public-python.json');assert py['pass'] and py['compared']==1023 and py['maxError']<1e-8
report=dict(pass_=True,approved=c['approved'],pagesCommit=sha,actions=actions['html_url'],lessons=http['lessons'],legacyRoutes=http['legacyRoutes'],requests=len(http['results']),notebooks=3,cells=3,pythonValues=py['compared'],maxError=py['maxError'],controls=16,mobileWidth=375,katexErrors=0,pageErrors=0);report['pass']=report.pop('pass_');(e/'public-validation.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
