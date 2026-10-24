"""Read GitHub Actions status; saved Git credentials remain in process memory."""
import json, pathlib, subprocess, urllib.request
directory=pathlib.Path(__file__).parent
sha='99945e1fd8f2abe94ed7db92e889d79223692979'
credential=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',text=True,capture_output=True,check=True).stdout
fields=dict(line.split('=',1) for line in credential.splitlines() if '=' in line)
headers={'Accept':'application/vnd.github+json','User-Agent':'control-universe-release-verifier','Authorization':'Bearer '+fields['password']}
def read(path):
    request=urllib.request.Request('https://api.github.com/repos/fanqin-zeng/control-universe/'+path,headers=headers)
    with urllib.request.urlopen(request,timeout=40) as response:return json.load(response)
payload=read('actions/workflows/pages.yml/runs?branch=gh-pages&per_page=20')
runs=[run for run in payload['workflow_runs'] if run['head_sha']==sha]
if not runs:
    print(json.dumps({'found':False,'sourceCommit':sha}));raise SystemExit(0)
run=runs[0]
(directory/'actions.json').write_text(json.dumps(run,indent=2)+'\n',encoding='utf-8')
jobs=read('actions/runs/'+str(run['id'])+'/jobs')
(directory/'actions-jobs.json').write_text(json.dumps(jobs,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'id':run['id'],'url':run['html_url'],'sha':run['head_sha'],'status':run['status'],'conclusion':run['conclusion'],'jobs':[{'name':j['name'],'status':j['status'],'conclusion':j['conclusion']} for j in jobs['jobs']]}))
