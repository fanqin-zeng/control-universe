from pathlib import Path
from fractions import Fraction as F
import json,time,io,contextlib
import numpy as np
from model import original
d=Path(__file__).parent;start=time.perf_counter();data=json.loads((d/'ts-cases.json').read_text(encoding='utf8'));mx=mc=mk=0.;certificates=0
for item in data['cases']:
 c=item['c'];r=item['result'];a=original(c);b=original(c,False)
 for ts,ind,value in [(r['x'],a,r['cost']),(r['unconstrained'],b,r['unconstrainedCost'])]:
  error=max(abs(np.array(ts)-ind['x']));ce=abs(value-ind['cost']);mx=max(mx,error);mc=max(mc,ce);assert error<1e-7 and ce<1e-7,(c,error,ce)
 assert r['cost']>=r['unconstrainedCost']-1e-10
 g=a['A'].T@(a['A']@np.array(r['x'])-a['b']);cap=c['capacity']
 residual=max(0.,*(max(0.,-v) if x<1e-9 else max(0.,v) if x>cap-1e-9 else abs(v) for x,v in zip(r['x'],g))) if cap>0 else 0.
 mk=max(mk,residual);assert residual<1e-8 and abs(residual-r['residual'])<1e-9
 assert np.allclose(r['measurement'],a['measurement'],atol=1e-7) and np.allclose(r['process'],a['process'],atol=1e-7)
 # Certify the returned rational point against the ORIGINAL weighted residual derivatives.
 x=[F(v).limit_denominator(1000000) for v in r['x']];mu,P,Q,R,C,spike=[F(str(c[k])) for k in ['mean','P','Q','R','capacity','spike']];y=[F(1,5),F(7,5)+spike,F(11,10)];w=[x[1]-x[0]-F(1,2),x[2]-x[1]]
 grad=[(x[0]-mu)/P-w[0]/Q+(x[0]-y[0])/R,(w[0]-w[1])/Q+(x[1]-y[1])/R,w[1]/Q+(x[2]-y[2])/R]
 assert all(0<=v<=C for v in x)
 if C>0:assert all((v==0 and gg>=0) or (v==C and gg<=0) or (0<v<C and gg==0) for v,gg in zip(x,grad)),(c,x,grad)
 certificates+=1
output=io.StringIO();count=0
with contextlib.redirect_stdout(output):
 for nb in json.loads((d/'cells.json').read_text(encoding='utf8'))['notebooks']:
  scope={};exec(nb['setupCode'],scope)
  for cell in nb['cells']:exec(cell['code'],scope);count+=1
(d/'raw-cells.log').write_text(output.getvalue(),encoding='utf8');assert count==4 and data['rejected']==6
summary=dict(cases=len(data['cases']),fractionCertificates=certificates,rejected=data['rejected'],maxStateError=mx,maxCostError=mc,maxKkt=mk,rawCells=count,seconds=time.perf_counter()-start)
(d/'numeric.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2));print(output.getvalue())
