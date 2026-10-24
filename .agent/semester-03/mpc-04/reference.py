import json
from pathlib import Path
from fractions import Fraction as F
import numpy as np
from scipy.optimize import linprog, nnls
p=Path('.agent/semester-03/mpc-04')
scopes=[]
for nb in json.loads((p/'extracted.json').read_text(encoding='utf8'))['notebooks']:
    scope={};exec(nb['setupCode'],scope)
    for cell in nb['cells']:exec(cell['code'],scope)
    scopes.append(scope)
def trajectory(position,U):
    pos,vel=position,1.
    out=[]
    for i in range(3):
        u=U[min(i,1)]
        pos,vel=pos+vel+.5*u,vel+u
        out.append(pos)
    return np.array(out)
maxres=0.;maxmatrix=0.;feasible=0;infeasible=0
for case in json.loads((p/'actual-ts.json').read_text(encoding='utf8')):
    position,rate,limit=case['position'],case['rate'],case['limit'];actual=case['result']
    def cost(u):return np.sum(trajectory(position,u)**2)+.1*(u@u)
    def violations(u):
        du=np.diff(np.r_[.5,u]);ys=trajectory(position,u)
        return np.r_[u-2,-u-2,du-rate,-du-rate,ys-limit,-ys-limit]
    zero=np.zeros(2);b=-violations(zero)
    A=np.column_stack([violations(np.eye(2)[i])-violations(zero) for i in range(2)])
    linear=np.array([(cost(np.eye(2)[i])-cost(-np.eye(2)[i]))/2 for i in range(2)])
    diagonal=[cost(np.eye(2)[i])+cost(-np.eye(2)[i])-2*cost(zero) for i in range(2)]
    cross=cost(np.ones(2))-cost(np.eye(2)[0])-cost(np.eye(2)[1])+cost(zero)
    H=np.array([[diagonal[0],cross],[cross,diagonal[1]]])
    maxmatrix=max(maxmatrix,float(np.max(np.abs(H-actual['H']))))
    assert np.allclose(A,actual['A'],atol=1e-12)
    assert np.allclose(b,actual['b'],atol=1e-12)
    assert np.allclose(linear,actual['f'],atol=1e-10)
    lp=linprog([0.,0.],A_ub=A,b_ub=b,bounds=[(None,None)]*2,method='highs')
    if not lp.success:
        assert lp.status==2 and not actual['feasible'];infeasible+=1;continue
    feasible+=1;assert actual['feasible']
    u=np.array(actual['u']);lam=np.array(actual['lambda'])
    slack=b-A@u
    res=max(0.,float(-np.min(slack)),float(-np.min(lam)),float(np.max(np.abs(H@u+linear+A.T@lam))),float(np.max(np.abs(lam*slack))))
    maxres=max(maxres,res);assert res<1e-8
    # Independent weak-duality bound: this multiplier proves global optimality.
    q=linear+A.T@lam
    dual=-.5*q@np.linalg.solve(H,q)-b@lam+cost(zero)
    assert abs(cost(u)-dual)<1e-8
    assert abs(cost(u)-actual['cost'])<1e-8
    assert np.max(np.abs(trajectory(position,u)-actual['prediction']))<1e-10
default=next(c['result'] for c in json.loads((p/'actual-ts.json').read_text()) if c['position']==4 and c['rate']==1 and c['limit']==5)
assert np.allclose(default['u'],[-.5,-1.5]) and abs(default['cost']-50.625)<1e-12
for V in [1,10,100]:
    eps=F(1,1+V);u=1+eps
    assert 2*(u-2)+2*V*eps==0
assert np.allclose(scopes[1]['phase1'].x,[-1,-1,5])
# Original 40-QP experiment: independent matrix powers, repeated-last-input map,
# and primal/dual certificates, without rerunning the notebook's optimizer.
s=scopes[2];Np,Nu,Ts=15,5,.1
Ad=np.array([[1.,Ts],[0.,1.]]);Bd=np.array([0.,Ts])
E=np.vstack([np.eye(Nu),np.tile(np.eye(Nu)[-1],(Np-Nu,1))])
M=np.zeros((2*Np,Nu))
for j in range(1,Np+1):
    for i in range(j):M[2*(j-1):2*j]+=np.outer(np.linalg.matrix_power(Ad,j-i-1)@Bd,E[i])
assert np.max(np.abs(M-s['Phi']))<1e-12
Q=np.diag(np.tile([1.,.2],Np));H=2*(M.T@Q@M+.1*np.eye(Nu))
D=np.eye(Nu)-np.eye(Nu,k=-1)
A=np.vstack([np.eye(Nu),-np.eye(Nu),D,-D,M[::2],-M[::2]])
maxgap=0.;maxlegacy=0.
for plan in s['plans']:
    x=np.array(plan['x']);previous=plan['previous'];u=np.array(plan['u'])
    free=np.concatenate([np.linalg.matrix_power(Ad,j)@x for j in range(1,Np+1)])
    f=2*M.T@Q@free;shift=np.r_[previous,np.zeros(Nu-1)]
    b=np.r_[np.full(2*Nu,2.),np.ones(Nu)+shift,np.ones(Nu)-shift,8-free[::2],8+free[::2]]
    slack=b-A@u;assert np.min(slack)>-1e-7
    active=np.flatnonzero(slack<1e-5);lam=np.zeros(len(b))
    if len(active):lam[active]=nnls(A[active].T,-(H@u+f))[0]
    res=max(np.max(np.abs(H@u+f+A.T@lam)),np.max(np.abs(lam*slack)))
    maxlegacy=max(maxlegacy,float(res));assert res<1e-4
    v=f+A.T@lam;dual=-.5*v@np.linalg.solve(H,v)-b@lam
    primal=.5*u@H@u+f@u;gap=abs(primal-dual)
    maxgap=max(maxgap,float(gap));assert gap<1e-4
report={'pass':True,'cases':952,'feasible':feasible,'infeasible':infeasible,'maxIndependentKKT':maxres,'maxIndependentHError':maxmatrix,'legacyQP':40,'maxLegacyKKT':maxlegacy,'maxLegacyDualityGap':maxgap,'legacyLastSample':s['states'][-1].tolist()}
(p/'reconciliation.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print('PASS independent LP feasibility, objective-derived KKT/duality, matrix-power 40QP certificates',report)
