from pathlib import Path
import json,runpy,contextlib,io
import numpy as np
from scipy.signal import lfilter
f=Path('.agent/semester-03/id-08');ns=runpy.run_path(str(f/'notebook-code.py'))
if (f/'extracted.json').exists():
 raw=json.loads((f/'extracted.json').read_text(encoding='utf8'));norm=lambda s:s.replace('\r\n','\n')
 for i,nb in enumerate(raw['notebooks']):assert norm(nb['setupCode'])==norm(ns['SETUP']) and norm(nb['cells'][0]['code'])==norm(ns['CELLS'][[0,2,1][i]])
 ns['SETUP']=raw['notebooks'][0]['setupCode'];ns['CELLS']=[nb['cells'][0]['code'] for nb in raw['notebooks']]
scope={};exec(ns['SETUP'],scope);outputs=[]
for cell in ns['CELLS']:
 out=io.StringIO()
 with contextlib.redirect_stdout(out):exec(cell,scope)
 outputs.append(out.getvalue())
(f/'raw-python-output.txt').write_text('\n'.join(outputs),encoding='utf8');(f/'summaries.json').write_text(json.dumps(scope['summaries'],indent=2));actual=json.loads((f/'actual-ts.json').read_text());count=0;worst=0.
def compare(a,b):
 global count,worst
 a=np.asarray(a);b=np.asarray(b);assert a.shape==b.shape
 error=float(np.max(abs(a-b)));worst=max(worst,error);count+=a.size;assert error<1e-9,error
for item in actual['cases']:
 c=item['config'];r=scope['experiment'](c['amplitude'],c['binary'],c['noise'],c['plant'],c['testAmplitude'],c['seed']);t=item['result'];assert t['selected']==r['selected']
 for part in ['train','validation','test']:
  for key in ['u','y','innovation']:compare(t[part][key],r[part][key])
  forcing=.3*(np.tanh(r[part]['u']) if c['plant']=='tanh' else r[part]['u'])+r[part]['innovation'];compare(r[part]['y'][1:],lfilter([1],[1,-.7],forcing))
 for name in ['linear','cubic']:
  m=r['models'][name];tm=t['models'][name];assert tm['rank']==m['rank'];assert (tm['coefficients'] is None)==(m['coefficients'] is None)
  if m['coefficients'] is None:continue
  compare(tm['coefficients'],m['coefficients']);a,b=m['coefficients'][:2];cc=m['coefficients'][2] if name=='cubic' else 0.
  for part in ['train','validation','test']:
   for key in ['one','roll','oneRMSE','rollRMSE']:compare(tm[part][key],m[part][key])
   forcing=b*r[part]['u']+cc*r[part]['u']**3;compare(m[part]['roll'],lfilter([1],[1,-a],forcing))
for rec in actual['repeated']:
 ref=next(s for s in scope['summaries'] if s['label']==rec['label']);assert rec['selected']==ref['choices'][rec['seed']-20261024]
 for name,metrics in rec['metrics'].items():
  for metric,v in metrics.items():compare(v,ref['stats'][name][metric]['values'][rec['seed']-20261024])
proof={'pass':True,'configurations':len(actual['cases']),'repeatedRecords':len(actual['repeated']),'values':count,'maxError':worst,'tolerance':1e-9,'route':'Actual TS reorthogonalized QR vs NumPy SVD least squares; true and predicted recurrences separately audited with scalar lfilter; test data never enter fitting or selection'}
(f/'reconciliation.json').write_text(json.dumps(proof,indent=2));print(json.dumps(proof));print(outputs[0]);print(outputs[1])
