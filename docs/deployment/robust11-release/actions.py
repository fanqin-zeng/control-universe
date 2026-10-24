from pathlib import Path
import subprocess,os,json,urllib.request,sys
d=Path(__file__).parent;t=json.loads((d/'target.json').read_text());root=Path(t['worktree']);sha=t['release']
if sys.argv[1]=='push':
 assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()==sha
 assert not subprocess.check_output(['git','status','--porcelain'],cwd=root,text=True).strip(),'Release checkout must be clean'
 with (d/'push.log').open('wb') as f:r=subprocess.run(['git','push','origin','HEAD:refs/heads/gh-pages'],cwd=root,stdout=f,stderr=subprocess.STDOUT)
 assert r.returncode==0,'Push failed; inspect remote advancement and never force push'
 print('Pushed approved release',sha,flush=True)
env=dict(os.environ,GIT_TERMINAL_PROMPT='0');r=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',text=True,capture_output=True,env=env,cwd=root);fields=dict(x.split('=',1) for x in r.stdout.splitlines() if '=' in x)
headers={'Accept':'application/vnd.github+json','User-Agent':'control-universe-rank5-release'}
if fields.get('password'):headers['Authorization']='Bearer '+fields['password']
op=urllib.request.build_opener(urllib.request.ProxyHandler({}))
def get(url):
 with op.open(urllib.request.Request(url,headers=headers),timeout=30) as response:return json.load(response)
data=get(t['apiUrl']+'/actions/workflows/pages.yml/runs?branch=gh-pages&head_sha='+sha+'&per_page=10');runs=[r for r in data['workflow_runs'] if r['head_sha']==sha]
if not runs:print('Waiting for GitHub workflow indexing');sys.exit(0)
run=runs[0];jobs=get(run['jobs_url']);(d/'actions.json').write_text(json.dumps(dict(run=run,jobs=jobs),indent=2)+'\n')
print(json.dumps(dict(id=run['id'],status=run['status'],conclusion=run['conclusion'],url=run['html_url'],jobs=[dict(name=j['name'],status=j['status'],conclusion=j['conclusion']) for j in jobs['jobs']]),indent=2))
if run['status']=='completed':assert run['conclusion']=='success','Actions did not succeed; inspect before claiming publication'
