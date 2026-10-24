from pathlib import Path
import subprocess,json,os,sys
root=Path('D:/Workspace/control-universe');work=Path('D:/Workspace/control-universe-rank3-pages-id09');e=root/'.agent/semester-03/id-09/pages-release';e.mkdir(exist_ok=True)
target='dcaa4c8b0eff92b7c96f322042f1fd219396774b'
def git(*args,cwd=root):return subprocess.check_output(['git',*args],cwd=cwd).decode().strip()
mode=sys.argv[1]
if mode=='prepare':
 assert not work.exists(),'Do not overwrite an existing release checkout'
 base=git('rev-parse','origin/gh-pages');subprocess.run(['git','worktree','add','--detach',str(work),base],cwd=root,check=True)
 subprocess.run(['git','merge','--no-ff',target,'-m','release: publish approved ID-09 identification course'],cwd=work,check=True,stdout=(e/'merge.log').open('wb'),stderr=subprocess.STDOUT)
 commit=git('rev-parse','HEAD',cwd=work);assert git('rev-parse','HEAD^{tree}',cwd=work)==git('rev-parse',target+'^{tree}')
 for p,t in [('node_modules',root/'node_modules'),('public/pyodide',root/'public/pyodide')]:subprocess.run(['cmd','/c','mklink','/J',str(work/p),str(t)],check=True,stdout=subprocess.DEVNULL)
 assert git('status','--porcelain',cwd=work)==''
 (e/'candidate.json').write_text(json.dumps(dict(approved=target,previousPages=base,pagesCommit=commit,worktree=str(work),sameTree=True),indent=2));print(commit)
elif mode=='gates':
 from concurrent.futures import ThreadPoolExecutor
 env={**os.environ,'PYTHONIOENCODING':'utf-8'}
 def run(item):
  name,cmd=item
  with (e/(name+'.log')).open('wb') as out:r=subprocess.run(cmd,cwd=work,env=env,stdout=out,stderr=subprocess.STDOUT)
  print(name,r.returncode,flush=True);return dict(command=cmd,exitCode=r.returncode,log=name+'.log')
 tasks=[('check',['npm.cmd','run','check']),('tests',['node','--test','scripts/pages.test.mjs','scripts/lesson-route.test.mjs','scripts/browser-python.test.mjs','scripts/python-release-decision.test.mjs']),('math',['npm.cmd','run','math:check'])]
 with ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(run,tasks))
 assert all(r['exitCode']==0 for r in results)
 results.append(run(('build',['npm.cmd','run','build:pages'])))
 (e/'commands.json').write_text(json.dumps(results,indent=2));assert all(r['exitCode']==0 for r in results)
 rel=json.loads((work/'out/release.json').read_text());assert rel['sourceCommit']==git('rev-parse','HEAD',cwd=work) and not rel['sourceDirty'];(e/'local-release.json').write_text(json.dumps(rel,indent=2));print('PASS clean approved release')
elif mode=='push':
 assert all(r['exitCode']==0 for r in json.loads((e/'commands.json').read_text()))
 assert git('status','--porcelain',cwd=work)==''
 with (e/'push.log').open('wb') as out:r=subprocess.run(['git','push','origin','HEAD:refs/heads/gh-pages'],cwd=work,stdout=out,stderr=subprocess.STDOUT)
 assert r.returncode==0,(e/'push.log').read_text();print('Pushed '+git('rev-parse','HEAD',cwd=work))
