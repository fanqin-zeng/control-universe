"""Independent exact rational oracle: constrained precision minimization + covariance quadratic form."""
import json
from fractions import Fraction as F
from pathlib import Path
root=Path('.agent/semester-03/embodied-02')
cases=json.loads((root/'ts-results.json').read_text())
maximum=0; count=0
def check(a,b):
    global maximum,count
    if b is None: assert a is None; return
    error=abs(a-float(b));maximum=max(maximum,error);count+=1
    assert error<1e-9,(a,b,error)
for case in cases:
    p=case['p'];r=case['r'];v=p['vision'];q=p['proprio'];rho=F(str(p['rho']))
    # Independent precision normalization, rather than copying TS weight constants.
    precision=[F(1,16) if v else F(0),F(1,4) if q else F(0)]
    total=sum(precision);weights=[s/total for s in precision] if total else [F(0),F(0)]
    covariance=[[F(16),rho*8],[rho*8,F(4)]]
    variance=sum(weights[i]*covariance[i][j]*weights[j] for i in range(2) for j in range(2))
    shift=-F(str(p['speed']))*F(str(p['age']))
    check(r['w'],weights[0]);check(r['q'],weights[1]);check(r['bias'],shift)
    check(r['variance'],variance if total else None)
    check(r['mse'],variance+(weights[0]*shift)**2 if total else None)
    check(r['estimate'],weights[0]*(104+shift)+weights[1]*98 if total else None)
    check(r['baseline'],F(4) if q else None)
result={'cases':len(cases),'scalars':count,'maximumAbsoluteError':maximum,'tolerance':1e-9,'method':'Fraction precision weights and full covariance quadratic form'}
(root/'oracle-results.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
