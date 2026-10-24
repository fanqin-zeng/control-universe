from pathlib import Path
import json,runpy,contextlib,io,sys
import numpy as np
f=Path('.agent/semester-03/id-06');ns=runpy.run_path(str(f/'notebook-code.py'));raw=json.loads((f/'extracted.json').read_text(encoding='utf8'));scope={}
norm=lambda s:s.replace('\r\n','\n')
for i,nb in enumerate(raw['notebooks']):
 assert norm(nb['setupCode'])==norm(ns['SETUP'])
 assert len(nb['cells'])==1 and norm(nb['cells'][0]['code'])==norm(ns['CELLS'][[0,2,1][i]])
results=[]
for nb in raw['notebooks']:
 out=io.StringIO()
 with contextlib.redirect_stdout(out):
  exec(nb['setupCode'],scope);exec(nb['cells'][0]['code'],scope)
 results.append(out.getvalue())
(f/'raw-python-output.txt').write_text('\n'.join(results),encoding='utf8')
(f/'default.json').write_text(json.dumps(scope.get('row'),indent=2))
actual=json.loads((f/'actual-ts.json').read_text());count=0;worst=0
def compare(x,y):
 global count,worst
 x=np.asarray(x);y=np.asarray(y);assert x.shape==y.shape
 assert np.array_equal(np.isnan(x),np.isnan(y));delta=float(np.nanmax(abs(x-y))) if np.any(np.isfinite(x)) else 0
 worst=max(worst,delta);count+=x.size;assert delta<1e-10,(delta,x,y)
for case in actual['cases']:
 c=case['config'];r=scope['experiment'](c['a'],c['outputNoise'],c['inputNoise'],c['periods'],c['missing'],c['seed']);t=case['result'];idx=np.arange(1,32)
 for key,expected in [('trueGain',abs(r['G'][idx])),('truePhase',np.angle(r['G'][idx],deg=True)),('gain',abs(r['H'][idx])),('phase',np.angle(r['H'][idx],deg=True)),('coherence',r['C'][idx]),('power',r['suu'][idx])]:compare([np.nan if row[key] is None else row[key] for row in t['rows']],expected)
 compare([q['u'] for q in t['records']],r['inputs']);compare([q['y'] for q in t['records']],r['outputs'])
for record in actual['repeated']:
 summary=next(s for s in scope['summaries'] if s['label']==record['label'])
 compare(record['error'],summary['errors'][record['periods']]['values'][record['seed']-20261024])
# Independent analytic finite geometric sums for off-grid complex exponential.
for cycles in [8,8.5]:
 q=np.arange(64);d=cycles-q
 def D(delta):
  return np.array([64+0j if abs(x-round(x/64)*64)<1e-10 else (1-np.exp(2j*np.pi*x))/(1-np.exp(2j*np.pi*x/64)) for x in delta])
 for window in [np.ones(64),.5-.5*np.cos(2*np.pi*q/64)]:
  exact=D(d) if np.all(window==1) else .5*D(d)-.25*D(d+1)-.25*D(d-1)
  compare(np.fft.fft(np.exp(2j*np.pi*cycles*q/64)*window),exact)
proof={'pass':True,'configurations':len(actual['cases']),'values':count,'maxError':worst,'repeatedRecords':288,'route':'Actual TS: periodic initial-state recurrence + direct DFT; Python: circular FFT times rational G; leakage: geometric sums'}
(f/'summaries.json').write_text(json.dumps(scope['summaries'],indent=2))
(f/'reconciliation.json').write_text(json.dumps(proof,indent=2));print(json.dumps(proof));print(results[0]);print(results[1])
