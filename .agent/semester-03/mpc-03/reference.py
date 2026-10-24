import json
from pathlib import Path
from fractions import Fraction as F
import numpy as np
from scipy.optimize import lsq_linear
from scipy.linalg import expm
p=Path('.agent/semester-03/mpc-03')
scopes=[]
for nb in json.loads((p/'extracted.json').read_text(encoding='utf8'))['notebooks']:
    scope={};exec(nb['setupCode'],scope)
    for cell in nb['cells']:exec(cell['code'],scope)
    scopes.append(scope)
def independent(x,prev,N,bound):
    # Fit the quadratic by exact objective evaluations of direct plant trajectories.
    def trajectory(z):
        v=x;ys=[]
        for j in range(N):v=F(4,5)*v+F(1,5)*(prev+z);ys.append(v)
        return ys
    def cost(z):return sum((y-1)**2 for y in trajectory(z))+F(1,10)*z*z
    c0,c1,cm=cost(F(0)),cost(F(1)),cost(F(-1))
    aa=(c1+cm-2*c0)/2;bb=(c1-cm)/2
    zfree=-bb/(2*aa);low=max(-bound,-2-prev);high=min(bound,2-prev)
    candidates=[low,high]
    if low<=zfree<=high:candidates.append(zfree)
    z=min(candidates,key=cost)
    return {'delta':z,'u':prev+z,'unconstrained':zfree,'prediction':trajectory(z),'free':trajectory(F(0)),'H':2*aa,'f':bb,'cost':cost(z)}
maxerr=0.
for case in json.loads((p/'actual-ts.json').read_text(encoding='utf8')):
    N,bound,shock=case['np'],F(str(case['bound'])),F(str(case['shock']))
    first=independent(F(0),F(0),N,bound)
    measured=first['prediction'][0]+shock
    second=independent(measured,first['u'],N,bound)
    result=case['result']
    for key,expected in [('initial',first),('revised',second)]:
        for field,value in expected.items():
            if isinstance(value,list):err=max(abs(float(v)-w) for v,w in zip(value,result[key][field]))
            else:err=abs(float(value)-result[key][field])
            maxerr=max(maxerr,err);assert err<1e-11,(key,field,case)
        assert result[key]['residual']<1e-11
    assert abs(float(measured)-result['measured'])<1e-12
# Independently solve each of the original object's 20 QPs as bounded least squares.
s=scopes[0];a=.9;b=.1;N=10;Nu=5
def direct(x,prev,du):
    values=[];u=prev
    for j in range(N):
        if j<Nu:u+=du[j]
        x=a*x+b*u;values.append(x)
    return np.array(values)
referenceG=np.column_stack([direct(0.,0.,np.eye(Nu)[i]) for i in range(Nu)])
assert np.max(np.abs(referenceG-s['G']))<1e-12
rollerr=0.
for plan in s['plans']:
    free=direct(plan['x'],plan['previous'],np.zeros(Nu))
    M=np.vstack([referenceG,np.sqrt(.1)*np.eye(Nu)])
    target=np.r_[1-free,np.zeros(Nu)]
    sol=lsq_linear(M,target,bounds=(-2,2),method='bvls',tol=1e-13)
    assert sol.success
    rollerr=max(rollerr,float(np.max(np.abs(sol.x-plan['du']))))
assert rollerr<1e-5
# Exercise 1: exact rational dynamic programming for the future-state cost.
a,b,R=F(4,5),F(1,5),F(1,10)
P=F(0);gains=[]
for _ in range(3):
    # This cost penalizes x_next and u, so effective next-state weight is 1+P.
    gain=a*b*(1+P)/(R+b*b*(1+P));gains.append(gain)
    P=a*a*(1+P)-((a*b*(1+P))**2)/(R+b*b*(1+P))
x=F(1);us=[]
for k in reversed(gains):u=-k*x;us.append(float(u));x=a*x+b*u
assert np.max(np.abs(scopes[2]['Uf']-us))<1e-12
P=F(0);current_gains=[]
for _ in range(3):
    k=a*b*P/(R+b*b*P);current_gains.append(k)
    P=1+a*a*P-(a*b*P)**2/(R+b*b*P)
x=F(1);current_us=[]
for k in reversed(current_gains):
    u=-k*x;current_us.append(float(u));x=a*x+b*u
assert np.max(np.abs(scopes[2]['Ucurrent']-current_us))<1e-12
assert np.allclose(scopes[1]['gains'](2.,2)[0],[1.,0.])
assert abs(scopes[1]['Pterminal']-1.71875)<1e-12
assert abs(scopes[2]['increment_tail']+.24)<1e-12
assert abs(scopes[2]['absolute_tail_as_increment']+.34)<1e-12
# Exercise 5 independent integral of nilpotent Ac: Bd=(T I+T^2 Ac/2)Bc.
Ac=np.array([[0.,20.],[0.,0.]]);Bc=np.array([[0.],[8.]])
Bd=(.05*np.eye(2)+.05**2/2*Ac)@Bc
assert np.allclose(scopes[2]['Bd'],Bd,atol=1e-12)
report={'pass':True,'componentCases':160,'maxComponentError':maxerr,'rolloutQPs':20,'maxSLSQPvsIndependentBVLS':rollerr,'exercise1_future_U':us,'exercise1_current_U':scopes[2]['Ucurrent'].tolist(),'exercise1_H':scopes[2]['H'].tolist(),'exercise1_f':scopes[2]['linear'].tolist(),'vehicleR':float(scopes[2]['R'])}
(p/'reconciliation.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print('PASS independent Fraction objectives, rational dynamic programming, 20 BVLS QPs, nilpotent integration',report)
