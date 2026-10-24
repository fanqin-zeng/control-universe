import os, subprocess, json, pathlib
root=pathlib.Path('D:/Workspace/control-universe-rank2-ml-pages')
evidence=pathlib.Path('D:/Workspace/control-universe/docs/deployment/ml09-release')
commands=[('check',['npm.cmd','run','check']),('semester',['node','scripts/check-semester03.mjs']),('math',['npm.cmd','run','math:check']),('tests',['node','--test','scripts/pages.test.mjs','scripts/lesson-route.test.mjs','scripts/browser-python.test.mjs','scripts/python-release-decision.test.mjs']),('pages-build',['npm.cmd','run','build:pages'])]
rows=[]
for label,cmd in commands:
    with (evidence/(label+'.log')).open('w',encoding='utf-8') as log:
        result=subprocess.run(cmd,cwd=root,stdout=log,stderr=subprocess.STDOUT,env={**os.environ,'NODE_OPTIONS':'--max-old-space-size=8192'})
    rows.append(dict(label=label,command=cmd,exitCode=result.returncode))
    (evidence/'local-gates.json').write_text(json.dumps(rows,indent=2)+'\n')
    print(label,result.returncode,flush=True)
    if result.returncode: raise SystemExit(result.returncode)
(evidence/'local-release.json').write_bytes((root/'out/release.json').read_bytes())
