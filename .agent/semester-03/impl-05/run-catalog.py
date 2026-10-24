"""Run the original catalog CLI through the private persistent process.
Exact CLI exit code and stdout are preserved; dependency changes require restart.
"""
from pathlib import Path
import json,sys,urllib.request
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-05'
info=json.loads((e/'catalog-worker.json').read_text(encoding='utf-8'))
request=urllib.request.Request(f'http://127.0.0.1:{info["port"]}/run',data=json.dumps({'fix':'--fix' in sys.argv}).encode(),headers={'Content-Type':'application/json'},method='POST')
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
with opener.open(request,timeout=600) as response:r=json.load(response)
if r.get('restart'):raise RuntimeError('Catalog pipeline changed; restart private runner before reuse')
output=e/('scoped-refresh.log' if '--fix' in sys.argv else 'scoped-check.log')
output.write_text(r['output'],encoding='utf-8')
p=e/'catalog-runs.json';history=json.loads(p.read_text(encoding='utf-8')) if p.exists() else []
history.append({k:v for k,v in r.items() if k!='output'});p.write_text(json.dumps(history,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'code':r['code'],'run':r['run'],'log':str(output)}));sys.exit(r['code'])
