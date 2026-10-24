"""Run ordered acceptance commands with UTF-8 byte-preserving logs and exit codes."""
from pathlib import Path
import subprocess,os,sys,json
f=Path('D:/Workspace/control-universe/.agent/semester-03/id-05');runtime='D:/Workspace/control-universe-rank3-id05'
actions={
 'check':[['node','scripts/check-catalog.mjs','--fix-outline','--fix-tracker-stats'],['node','scripts/check-catalog.mjs'],['node','scripts/check-python-support.mjs'],['node','scripts/check-semester03.mjs'],['node','scripts/glossary.mjs','check'],['node','scripts/format-display-math.mjs','--check']],
 'build':[['node','node_modules/next/dist/bin/next','build']],
 'pages':[['node','node_modules/next/dist/bin/next','build']],
 'verify':[['node','scripts/verify-lesson.mjs','identification/instrumental-variable']]
}
kind=sys.argv[1];env={**os.environ,'GIT_DIR':'D:/Workspace/control-universe/.git','WIKI_VERIFY_PORT':str(json.loads((f/'ports.json').read_text())['native'])}
if kind=='pages':env.update(PAGES_BUILD='1',NEXT_PUBLIC_BASE_PATH='/control-universe',NEXT_PUBLIC_STATIC_EXPORT='true')
names={'check':['refresh','final-check','python-policy','final-semester','final-glossary','final-math'],'build':['build'],'pages':['pages-build'],'verify':['verify']}
statuses=[]
for command,name in zip(actions[kind],names[kind]):
 with (f/(name+'.log')).open('wb') as log:res=subprocess.run(command,cwd=runtime,env=env,stdout=log,stderr=subprocess.STDOUT)
 statuses.append({'command':command,'exitCode':res.returncode,'log':name+'.log'})
 print(name,res.returncode,flush=True)
 if res.returncode and name!='refresh':break
(f/(kind+'-commands.json')).write_text(json.dumps(statuses,indent=2)+'\n',encoding='utf8')
sys.exit(statuses[-1]['exitCode'])
