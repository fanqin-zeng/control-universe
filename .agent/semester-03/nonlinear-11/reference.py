import json,sys
import numpy as np
from scipy.linalg import expm,solve_continuous_lyapunov,eigvalsh

cases=json.load(open(sys.argv[1],encoding='utf-8')); results=[]
for case in cases:
    tau,a=case['params']; actual=case['result']; rows=np.array(actual['rows'])
    A1=np.array([[-1.,a],[0.,-1.]]); A2=A1.T
    E1=expm(A1*tau); M=expm(A2*tau)@E1
    reference=[]
    for t in rows[:,0]:
        segment=int(np.floor((t+1e-12)/tau)); cycles=segment//2
        x=np.linalg.matrix_power(M,cycles)@np.array([1.,0.])
        if segment%2: x=E1@x
        x=expm((A2 if segment%2 else A1)*max(0.,t-segment*tau))@x
        reference.append(x)
    reference=np.array(reference); err=float(np.max(abs(reference-rows[:,1:3])))
    assert err<1e-8,(tau,a,err)
    assert np.max(abs(np.linalg.norm(reference,axis=1)-rows[:,3]))<1e-8
    modes=1+(np.floor((rows[:,0]+1e-12)/tau).astype(int)%2)
    assert np.array_equal(modes,rows[:,4])
    rho=float(max(abs(np.linalg.eigvals(M))))
    assert abs(rho-actual['rho'])<1e-12
    P=[solve_continuous_lyapunov(A.T,-np.eye(2)) for A in [A1,A2]]
    lam=min(1/max(np.linalg.eigvalsh(p)) for p in P)
    mu=max(eigvalsh(P[1],P[0])[-1],eigvalsh(P[0],P[1])[-1])
    assert abs(actual['lambda']-lam)<1e-12
    assert abs(actual['mu']-mu)<1e-12
    assert abs(actual['threshold']-np.log(mu)/lam)<1e-12
    if a==1:
        assert np.max(rows[:,3]-np.exp(-rows[:,0]/2))<1e-10
    results.append(dict(params=case['params'],maxAbsError=err,rho=rho,threshold=float(np.log(mu)/lam),final=reference[-1].tolist()))
print(json.dumps(dict(passed=True,cases=results)))
