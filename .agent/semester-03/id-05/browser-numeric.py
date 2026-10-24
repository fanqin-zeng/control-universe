from pathlib import Path
import json,ast,numpy as np
f=Path('.agent/semester-03/id-05');proof=json.loads((f/'pyodide.json').read_text(encoding='utf8'));expected=json.loads((f/'reconciliation.json').read_text(encoding='utf8'))['monteCarlo'];outputs=proof['lessons'][0]['notebooks'][1]['cells'][0]['outputs'];text=''.join(o.get('text','') for o in outputs if o['type']=='stream');count=0;maximum=0.
for label in ['colored','open','white']:
 line=next(l for l in text.splitlines() if l.startswith(label+' '));actual=ast.literal_eval(line[len(label)+1:]);assert actual['unavailable']==0
 for key,values in expected[label].items():
  delta=float(np.max(np.abs(np.array(actual[key])-values)));maximum=max(maximum,delta);count+=len(values);assert delta<1e-10,(label,key,delta)
report={'pass':True,'values':count,'maxError':maximum,'tolerance':1e-10,'source':'actual Pyodide stdout versus independent filter-based Python reference'};(f/'browser-numeric.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
