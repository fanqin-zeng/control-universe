import urllib.request,json,sys
from pathlib import Path
sha=sys.argv[1];url='https://api.github.com/repos/fanqing-zeng/control-universe/actions'
def get(u):return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'control-universe-release-review'}),timeout=30))
runs=get(url+'/workflows/pages.yml/runs?branch=gh-pages&per_page=5')['workflow_runs'];run=next((r for r in runs if r['head_sha']==sha),None)
if not run:print(json.dumps({'pending':True,'sha':sha}));sys.exit(0)
if run['status']=='completed':
    run['jobs']=get(url+'/runs/'+str(run['id'])+'/jobs')['jobs'];Path('docs/deployment/nonlinear12-zh-public-actions.json').write_text(json.dumps(run,indent=2),encoding='utf-8')
print(json.dumps({k:run[k] for k in ['id','head_sha','status','conclusion','html_url']}))
