from pathlib import Path
import ast,json,numpy as np
f=Path('.agent/semester-03/id-08');proof=json.loads((f/'pyodide.json').read_text(encoding='utf8'));reference=json.loads((f/'summaries.json').read_text(encoding='utf8'));count=0;worst=0.
for nb in proof['lessons'][0]['notebooks']:
 text=''.join(o.get('text','') for o in nb['cells'][0]['outputs'] if o['type']=='stream');value=ast.literal_eval(text.splitlines()[0])
 if isinstance(value,list):
  for item in value:
   ref=next(s for s in reference if s['label']==item['label']);assert item['choices']==ref['choices']
   for name,metrics in item['stats'].items():
    for metric,values in metrics.items():
     for key in ['median','q10','q90','values']:
      a=np.asarray(values[key]);b=np.asarray(ref['stats'][name][metric][key]);error=float(np.max(abs(a-b)));worst=max(worst,error);count+=a.size;assert error<1e-9
report={'pass':True,'values':count,'maxError':worst,'tolerance':1e-9,'source':'Actual Pyodide stdout vs NumPy SVD summaries independently audited by actual TS QR and lfilter; validation choices exact'};(f/'browser-numeric.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
