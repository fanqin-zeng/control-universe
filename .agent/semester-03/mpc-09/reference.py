from pathlib import Path
import json,contextlib,io,time
from fractions import Fraction as F
import numpy as np
from model import original,default,cost
p=Path(__file__).parent;t0=time.perf_counter();data=json.loads((p/'ts-cases.json').read_text(encoding='utf8'));max_action=max_cost=max_kkt=0.;feasible=0
for item in data['cases']:
    c=item['c'];r=item['result'];e=original(c);b=original(c,True)
    assert r['feasible']==(e is not None)
    if e is None:continue
    feasible+=1
    for name,ind in [('economic',e),('tracking',b)]:
        got=r[name];error=max(abs(np.array(got['u'])-ind['u']));max_action=max(max_action,error)
        ce=abs(got['cost']-ind['cost']);max_cost=max(max_cost,ce)
        assert error<1e-7 and ce<1e-7,(c,name,got,ind,error,ce)
        assert np.allclose(got['x'],ind['x'],atol=1e-7)
    assert abs(r['tracking']['objective']-b['objective'])<1e-7
    assert r['economic']['cost']<=r['tracking']['cost']+1e-10
    # Independent exact certificate from six original inequalities and derivative.
    x,C,U,p0,p1,h=[F(str(c[k])) for k in ['x0','capacity','limit','p0','p1','h']]
    inequalities=[(-1,F(0)),(1,U),(1,F(2)),(-1,U-2),(-1,x-1),(1,C+1-x)]
    lo=max(bb/aa for aa,bb in inequalities if aa<0);hi=min(bb/aa for aa,bb in inequalities if aa>0)
    v=min(hi,max(lo,(p1-p0+2+h*(1-x))/(2+h)));g=p0-p1+2*(v-1)+h*(x+v-1)
    assert (v==lo and g>=0) or (v==hi and g<=0) or (lo<v<hi and g==0)
    assert abs(float(v)-r['economic']['u'][0])<1e-12
    u=r['economic']['u'][0];grad=c['p0']-c['p1']+2*(u-1)+c['h']*(c['x0']+u-1)
    residual=max(0,float(lo)-u,u-float(hi),abs(grad-r['lambdaLower']+r['lambdaUpper']),abs(r['lambdaLower']*(u-float(lo))),abs(r['lambdaUpper']*(float(hi)-u)))
    assert residual<1e-9 and abs(residual-r['residual'])<1e-12;max_kkt=max(max_kkt,residual)
identities=0
for x in [F(0),F(1,4),F(1),F(2)]:
 for u in [F(0),F(1,2),F(1),F(2)]:
  for price in [F(0),F(2),F(5)]:
   for h in [F(0),F(1,5),F(4)]:
    f=x+u-1;l=price*u+u*u/2+h*x*x/2;steady=price+F(1,2);S=lambda z:(price+1)*z
    L=(u-1)**2/2+h*x*x/2
    assert l-steady+S(x)-S(f)==L
    assert L+S(f)==l+S(x)-steady
    identities+=1
raw=json.loads((p/'cells.json').read_text(encoding='utf8'));output=io.StringIO();cells=0
with contextlib.redirect_stdout(output):
 for nb in raw['notebooks']:
    scope={};exec(nb['setupCode'],scope)
    for cell in nb['cells']:exec(cell['code'],scope);cells+=1
(p/'raw-cells.log').write_text(output.getvalue(),encoding='utf8')
assert cells==4 and data['rejected']==6
summary=dict(cases=len(data['cases']),feasible=feasible,infeasible=len(data['cases'])-feasible,rejected=data['rejected'],maxActionError=max_action,maxCostError=max_cost,maxKkt=max_kkt,fractionIdentities=identities,rawCells=cells,seconds=time.perf_counter()-t0)
(p/'numeric.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2));print(output.getvalue())

