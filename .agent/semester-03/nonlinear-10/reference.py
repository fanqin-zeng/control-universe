import json,sys
import numpy as np
from scipy.linalg import expm

cases=json.load(open(sys.argv[1],encoding='utf-8'))
results=[]
for case in cases:
    g,D,opposite=case['params']
    sign=-1 if opposite else 1
    # Augmented matrix exponential, independent of the RK4 implementation and nonsingular at g=1.
    A=np.array([[-1.,g,D],[sign*g,-1.,0.],[0.,0.,0.]])
    rows=np.asarray(case['result']['rows'],dtype=float)
    states=np.array([(expm(A*t)@np.array([1.,0.,1.]))[:2] for t in rows[:,0]])
    err=float(np.max(np.abs(states-rows[:,1:3])))
    assert err<1e-7,(case['params'],err)
    eig=np.linalg.eigvals(A[:2,:2]); re=float(np.max(eig.real))
    assert abs(re-case['result']['maxReal'])<1e-12
    if g<1:
        bound=np.exp(-(1-g)*rows[:,0])+D/(1-g)*(1-np.exp(-(1-g)*rows[:,0]))
        assert np.max(abs(bound-rows[:,3]))<1e-12
        assert case['result']['maxViolation']<1e-8
    if opposite or g<1:
        equilibrium=np.linalg.solve(-A[:2,:2],[D,0.])
        assert np.max(abs(equilibrium-case['result']['steady']))<1e-12
    else:
        assert case['result']['steady'] is None
    results.append(dict(params=case['params'],maxAbsError=err,maxReal=re,final=states[-1].tolist()))
print(json.dumps(dict(passed=True,cases=results)))
