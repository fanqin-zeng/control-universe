import json, cmath
from pathlib import Path
from fractions import Fraction as F
import numpy as np
from scipy.linalg import expm

base=Path('.agent/semester-03/robot-01')
raw=json.loads((base/'extracted.json').read_text(encoding='utf8'))
for nb in raw['notebooks']:
    scope={};exec(nb['setupCode'],scope)
    for cell in nb['cells']:exec(cell['code'],scope)
    if 'endpoint' in scope:
        for q1,q2 in [(0,np.pi/2),(np.pi/2,-np.pi/2),(0,0),(.8,-.4)]:
            z=cmath.exp(1j*q1)+.5*cmath.exp(1j*(q1+q2))
            assert np.max(abs(scope['endpoint'](q1,q2)-[z.real,z.imag]))<1e-12
    else:
        assert F(1,5)+F(1,2)==F(7,10)
        assert abs(scope['hit']-(np.sqrt(26)-1)/5)<1e-12
        for k in range(101):
            t=F(k,100)
            assert abs(scope['q'][k]-float(F(1,5)*t+t*t/2))<1e-12
cases=json.loads((base/'component-values.json').read_text())
max_error=0
for c in cases:
    m,u,v=map(lambda x:F(str(x)),(c['m'],c['u'],c['v']))
    force=sorted([F(-2),u,F(2)])[1]
    # Independent augmented state transition [q,v,constant input].
    A=np.array([[0,1,0],[0,0,1/float(m)],[0,0,0.]])
    for k,s in enumerate(c['samples']):
        t=F(k,100);expected=expm(A*float(t))@np.array([0,float(v),float(force)])
        exact=F(v)*t+force*t*t/(2*m)
        err=max(abs(s['q']-float(exact)),abs(s['q']-expected[0]),abs(s['v']-expected[1]))
        max_error=max(max_error,err)
        assert err<1e-10
        assert -1.6<=s['q']<=1.6
    assert c['force']==float(force)
proof={'pass':True,'configurations':len(cases),'samples':len(cases)*101,'max_error':max_error,'tolerance':1e-10,'default':[2,1,.7,1.2,.71],'stop_time':(np.sqrt(26)-1)/5,'exercise1':[.5,1],'exercise2':[.2,-.2],'exercise3':[.5,1]}
(base/'reconciliation.json').write_text(json.dumps(proof,indent=2),encoding='utf8')
print(proof)
