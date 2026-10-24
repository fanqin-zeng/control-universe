import json,io,contextlib
from pathlib import Path
d=json.loads(Path('.agent/semester-03/est-08/extracted.json').read_text(encoding='utf8'))
reports=[]
for i,nb in enumerate(d['notebooks']):
    ns={};out=io.StringIO()
    with contextlib.redirect_stdout(out):
        exec(nb['setupCode'],ns)
        for c in nb['cells']:exec(c['code'],ns)
    reports.append({'notebook':i,'output':out.getvalue()})
    if 'rows' in ns:Path('.agent/semester-03/est-08/multi-seed.json').write_text(json.dumps(ns['rows'],ensure_ascii=False,indent=2),encoding='utf8')
Path('.agent/semester-03/est-08/original-python.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf8')
print('\n'.join(r['output'] for r in reports))
