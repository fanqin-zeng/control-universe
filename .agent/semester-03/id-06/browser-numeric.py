from pathlib import Path
import ast,json,numpy as np
f=Path('.agent/semester-03/id-06');proof=json.loads((f/'pyodide.json').read_text(encoding='utf8'));reference=json.loads((f/'summaries.json').read_text());count=0;worst=0
for nb in proof['lessons'][0]['notebooks']:
 text=''.join(o.get('text','') for o in nb['cells'][0]['outputs'] if o['type']=='stream');value=ast.literal_eval(text.splitlines()[0])
 if isinstance(value,list):
  for item in value:
   ref=next(s for s in reference if s['label']==item['label'])
   for p in [1,4,16]:
    for key in ['median','q10','q90','values']:
     a=np.asarray(item['errors'][p][key]);b=np.asarray(ref['errors'][str(p)][key]);delta=float(np.max(abs(a-b)));worst=max(worst,delta);count+=a.size;assert delta<1e-10
report={'pass':True,'values':count,'maxError':worst,'tolerance':1e-10,'source':'Actual Pyodide stdout, FFT Python summaries, independently checked against actual TS direct DFT'};(f/'browser-numeric.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
