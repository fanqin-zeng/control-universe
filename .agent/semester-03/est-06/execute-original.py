import json,io,contextlib
from pathlib import Path
d=json.loads(Path('.agent/semester-03/est-06/extracted.json').read_text(encoding='utf8'))
reports=[]
for i,nb in enumerate(d['notebooks']):
    ns={};out=io.StringIO()
    with contextlib.redirect_stdout(out):
        exec(nb['setupCode'],ns)
        for c in nb['cells']:exec(c['code'],ns)
    if 'mc_rows' in ns:Path('.agent/semester-03/est-06/monte-carlo.json').write_text(json.dumps(ns['mc_rows'],indent=2),encoding='utf8')
    if 'seq_rows' in ns:Path('.agent/semester-03/est-06/sequential.json').write_text(json.dumps(dict(gridDifference=ns['grid_difference'],reference=ns['fine'].tolist(),runs=ns['seq_rows']),indent=2),encoding='utf8')
    reports.append({'notebook':i,'output':out.getvalue()})
Path('.agent/semester-03/est-06/original-python.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf8')
print('\n'.join(r['output'] for r in reports))
