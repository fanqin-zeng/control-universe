from pathlib import Path
import subprocess,json,urllib.request,sys
e=Path('.agent/semester-03/id-09/pages-release');sha=json.loads((e/'candidate.json').read_text())['pagesCommit']
# Reuse Git's existing credential only in memory; never print or persist it.
result=subprocess.run(['git','credential','fill'],input=b'protocol=https\nhost=github.com\n\n',capture_output=True,check=True)
cred=dict(line.split('=',1) for line in result.stdout.decode().splitlines() if '=' in line);token=cred['password']
op=urllib.request.build_opener(urllib.request.ProxyHandler({}))
def get(path):
 req=urllib.request.Request('https://api.github.com/repos/fanqin-zeng/control-universe/'+path,headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','User-Agent':'control-universe-release-audit'})
 with op.open(req,timeout=30) as r:return json.load(r)
runs=get('actions/runs?branch=gh-pages&per_page=20')['workflow_runs'];run=next((r for r in runs if r['head_sha']==sha),None)
if run is None:print('Exact approved Pages run not indexed yet');sys.exit()
(e/'actions.json').write_text(json.dumps(run,indent=2));print(json.dumps({k:run[k] for k in ['id','head_sha','status','conclusion','html_url']}))
jobs=get('actions/runs/'+str(run['id'])+'/jobs');(e/'actions-jobs.json').write_text(json.dumps(jobs,indent=2));print(json.dumps([dict(name=j['name'],status=j['status'],conclusion=j['conclusion'],current=[s['name'] for s in j['steps'] if s['status']=='in_progress']) for j in jobs['jobs']]))
if run['status']=='completed':
 assert run['conclusion']=='success','Approved deployment failed; see Actions jobs'
 (e/'pages-api.json').write_text(json.dumps(get('pages'),indent=2));print('Exact approved Actions build and deployment succeeded')
