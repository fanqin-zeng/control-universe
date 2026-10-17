"""Independent reference: general matrix exponential + adaptive ODE, no cascade closed form."""
import json
import numpy as np
import scipy
import mpmath as mp
from scipy.linalg import expm
from scipy.integrate import solve_ivp

rates=[.25,.5,1,1.5,2]
times=[0,.025,.05,.7,1,2,4,7.975,8]
parameters=[(a,b,t) for a in rates for b in rates for t in times]
parameters += [(a,a+delta,t) for a in [.5,1,1.5] for delta in [-1e-12,1e-12,-1e-8,1e-8] for t in [0,1,8]]
cases=[]
ode_errors=[]
mp.mp.dps=60
cache={}
near_reference=[]
for a,b,t in parameters:
    A=np.array([[-a,0],[b,-b]])
    close=a!=b and abs(a-b)<1e-6
    def transition(q):
        if close:
            high=mp.expm(mp.matrix([[-mp.mpf(a),0],[mp.mpf(b),-mp.mpf(b)]])*mp.mpf(q))
            return np.array(high.tolist(),dtype=float)
        return expm(A*q)
    E=transition(t)
    if close:
        near_reference.append(dict(a=a,b=b,time=t,scipyError=float(np.max(np.abs(expm(A*t)-E)))))
    state=E@np.array([1.,0.])
    if (a,b) not in cache:
        samples=[]
        for q in np.linspace(0,8,161):
            z=transition(q)@np.array([1.,0.])
            samples.append([float(q),*z.tolist()])
        cache[a,b]=samples
    samples=cache[a,b]
    cases.append(dict(a=a,b=b,time=t,first=float(state[0]),second=float(state[1]),transition=E.flatten().tolist(),rates=(A@state).tolist(),samples=samples))
for a,b in sorted(cache):
        A=np.array([[-a,0],[b,-b]])
        ode=solve_ivp(lambda t,z:A@z,[0,8],[1.,0.],t_eval=np.linspace(0,8,161),rtol=1e-11,atol=1e-13)
        assert ode.success
        exact=np.array(cache[a,b])[:,1:].T
        err=float(np.max(np.abs(exact-ode.y)))
        assert err<1e-10
        ode_errors.append(dict(a=a,b=b,maxError=err))
print(json.dumps(dict(versions=dict(numpy=np.__version__,scipy=scipy.__version__,mpmath=mp.__version__),cases=cases,ode=ode_errors,nearReference=near_reference)))
