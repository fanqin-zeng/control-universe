import json
from pathlib import Path
from fractions import Fraction as F
import numpy as np
from scipy.linalg import expm
p=Path('.agent/semester-03/mpc-02')
scopes=[]
for nb in json.loads((p/'extracted.json').read_text(encoding='utf8'))['notebooks']:
    scope={};exec(nb['setupCode'],scope)
    for c in nb['cells']:exec(c['code'],scope)
    scopes.append(scope)
assert np.allclose(scopes[0]['aug'],[1.125,1.3125,1.15625,1.078125])
assert np.allclose(scopes[0]['free'],[.625,.5625,.53125,.515625])
maxerr=0.
for case in json.loads((p/'actual-ts.json').read_text(encoding='utf8')):
    a=F(str(case['a']));h=F(str(case['h']));m=case['m'];b=1-a
    current=(1+a)/2
    # Independent absolute-input convolution from x(k), no augmented recurrence.
    us=[F(1,2)+h,F(1,2)+h,F(1,2)+h/2,F(1,2)+h/2]
    exact=[a**j*current+sum(a**(j-i-1)*b*us[i] for i in range(j)) for j in range(1,5)]
    # Each input change is a sustained step; include the previous -1/2 step.
    ss=lambda j: 1-a**min(j,m)
    changes=[F(-1,2),h,F(0),-h/2]
    # Base level chosen so that the truncated model matches current measurement.
    base=current+ss(1)/2
    trunc=[base+sum(changes[i]*ss(j+1-i) for i in range(min(4,j+1))) for j in range(1,5)]
    result=case['result']
    for key in ['direct','augmented','carima']:
        err=max(abs(float(x)-y) for x,y in zip(exact,result[key]));maxerr=max(maxerr,err);assert err<1e-12
    assert np.allclose([float(v) for v in trunc],result['dmc'],rtol=0,atol=1e-12)
    assert abs(max(abs(float(x-y)) for x,y in zip(exact,trunc))-result['error'])<1e-12
# Independent continuous-state matrix exponential, not TF coefficients copied from notebook.
Ac=np.array([[0.,1.],[-1.,-.4]])
block=np.block([[Ac,np.array([[0.],[1.]])],[np.zeros((1,3))]])
Md=expm(.2*block);Ad=Md[:2,:2];Bd=Md[:2,2]
n1=float(Bd[0]);n2=float((Ad@Bd)[0]-np.trace(Ad)*n1)
assert np.allclose([n1,n2],[scopes[1]['n1'],scopes[1]['n2']],atol=1e-12)
assert abs(scopes[1]['y3']-1.36)<1e-12
report={'pass':True,'cases':440,'maxComponentError':maxerr,'ZOH_num':[n1,n2],'ZOH_den':[1.,-float(np.trace(Ad)),float(np.linalg.det(Ad))]}
(p/'reconciliation.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print('PASS independent Fraction convolution 440 actual TS cases and continuous-state exponential',report)
