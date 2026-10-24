import json,sys
import numpy as np
from fractions import Fraction as F
records=json.load(open(sys.argv[1],encoding='utf-8'))
v0=np.array([0.,1.,5.]); maximum=0.
# Build undirected Laplacians through incidence matrices, not the JS adjacency loop.
B=np.array([[1.,0.],[-1.,1.],[0.,-1.]])
graphs={'chain':B@B.T,'split':B[:,:1]@B[:,:1].T,'directed':np.array([[0.,0.,0.],[-1.,1.,0.],[0.,-1.,1.]])}
for rec in records:
    L=graphs[rec['topology']]; a=rec['alpha']; P=np.eye(3)-a*L
    if rec['topology']!='directed':
        lam,Q=np.linalg.eigh(L)
        expected=np.array([Q@((1-a*lam)**k*(Q.T@v0)) for k in range(21)])
    else:
        # Closed-form Jordan-chain solution: b=1-a, v2=b^k, v3=5b^k + k*a*b^(k-1).
        b=1-a
        expected=np.array([[0.,b**k,5*b**k+(k*a*b**(k-1) if k else 0)] for k in range(21)])
    result=rec['result']; actual=np.array(result['states']); err=float(np.max(np.abs(expected-actual)));maximum=max(maximum,err)
    assert err<1e-9,(rec['topology'],a,err)
    selected=actual[rec['selected']]
    assert np.max(np.abs(selected-result['values']))<1e-12
    assert abs(np.mean(selected)-result['mean'])<1e-12
    assert abs(np.ptp(selected)-result['spread'])<1e-12
    assert abs(rec['selected']*a-result['time'])<1e-12
    assert result['convergent']==(rec['topology']!='chain' or a<2/3)
    # Matrix powers provide a third implementation, also testing the neutral endpoint.
    for k in [0,1,20]: assert np.max(np.abs(np.linalg.matrix_power(P,k)@v0-actual[k]))<1e-9
v=[F(0),F(1),F(5)]
first=[v[0]+F(1,4)*(v[1]-v[0]),v[1]+F(1,4)*(v[0]+v[2]-2*v[1]),v[2]+F(1,4)*(v[1]-v[2])]
assert first==[F(1,4),F(7,4),F(4)] and sum(first)/3==2
print(json.dumps({'cases':len(records),'points':len(records)*21*3,'maximum_error':maximum,'exact_step1':[str(x) for x in first],'eigenvalues':[0,1,3]}))
