"""GitHub Actions evidence; credentials remain in process memory and are never logged."""
from pathlib import Path
import json,subprocess,os,urllib.request,sys
root=Path(__file__).resolve().parents[3];d=root/'docs/deployment/est08-release';target=json.loads((d/'target.json').read_text(encoding='utf8'));merge=json.loads((d/'merge.json').read_text(encoding='utf8'));sha=merge['release'];dest=Path(merge['worktree'])
if sys.argv[1]=='push':
 assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=dest,text=True).strip()==sha
 assert not subprocess.check_output(['git','status','--porcelain'],cwd=dest,text=True).strip()
 local=subprocess.check_output(['git','rev-parse','refs/heads/gh-pages'],cwd=root,text=True).strip()
 subprocess.run(['git','merge-base','--is-ancestor',local,sha],cwd=root,check=True)
 with (d/'push.log').open('wb') as out:p=subprocess.run(['git','push','origin',sha+':refs/heads/gh-pages'],cwd=root,stdout=out,stderr=subprocess.STDOUT)
 (d/'push.json').write_text(json.dumps(dict(command=['git','push','origin',sha+':refs/heads/gh-pages'],exitCode=p.returncode,release=sha),indent=2),encoding='utf8');assert p.returncode==0,'Inspect remote divergence; never force push'
 p=subprocess.run(['git','update-ref','refs/heads/gh-pages',sha,local],cwd=root,capture_output=True);assert p.returncode==0,'Concurrent local branch update; preserve it and inspect'
 print('Pushed approved gh-pages',sha,flush=True)
env=os.environ.copy();env['GIT_TERMINAL_PROMPT']='0';r=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',text=True,capture_output=True,env=env);fields=dict(x.split('=',1) for x in r.stdout.splitlines() if '=' in x)
headers={'Accept':'application/vnd.github+json','User-Agent':'control-universe-release'}
if fields.get('password'):headers['Authorization']='Bearer '+fields['password']
op=urllib.request.build_opener(urllib.request.ProxyHandler({}))
def get(url):
 with op.open(urllib.request.Request(url,headers=headers),timeout=30) as r:return json.load(r)
runs=get(target['apiUrl']+'/actions/workflows/pages.yml/runs?branch=gh-pages&head_sha='+sha+'&per_page=10');matches=[x for x in runs['workflow_runs'] if x['head_sha']==sha]
if not matches:print('Workflow dispatch awaiting GitHub indexing');sys.exit(0)
run=matches[0];jobs=get(run['jobs_url']);(d/'actions.json').write_text(json.dumps(dict(run=run,jobs=jobs),indent=2),encoding='utf8');print(json.dumps(dict(id=run['id'],status=run['status'],conclusion=run['conclusion'],url=run['html_url'],jobs=[dict(name=j['name'],status=j['status'],conclusion=j['conclusion']) for j in jobs['jobs']]),indent=2))
if run['status']=='completed':assert run['conclusion']=='success','Inspect failed Actions jobs; do not claim published'
