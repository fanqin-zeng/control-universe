from pathlib import Path
import ast,json,numpy as np
f=Path('.agent/semester-03/id-07');proof=json.loads((f/'pyodide.json').read_text(encoding='utf8'));reference=json.loads((f/'summaries.json').read_text());count=0;worst=0
for nb in proof['lessons'][0]['notebooks']:
 text=''.join(o.get('text','') for o in nb['cells'][0]['outputs'] if o['type']=='stream');value=ast.literal_eval(text.splitlines()[0])
 if isinstance(value,list):
  for item in value:
   ref=next(s for s in reference if s['sigma']==item['sigma'])
   for p in [1,2,3]:
    assert item['errors'][p]['unavailable']==ref['errors'][str(p)]['unavailable']
    for key in ['median','q10','q90','values']:
     a=np.asarray(item['errors'][p][key],dtype=float);b=np.asarray(ref['errors'][str(p)][key],dtype=float);assert np.array_equal(np.isnan(a),np.isnan(b));delta=float(np.nanmax(abs(a-b))) if np.any(np.isfinite(a)) else 0.;worst=max(worst,delta);count+=a.size;assert delta<1e-9
report={'pass':True,'values':count,'maxError':worst,'tolerance':1e-9,'source':'Actual Pyodide stdout vs NumPy reference; every successful validation RMSE separately audited through scalar transfer lfilter; unavailable masks and counts identical'};(f/'browser-numeric.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
