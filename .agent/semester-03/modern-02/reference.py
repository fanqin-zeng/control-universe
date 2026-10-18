"""Independent mechanical normal modes and analytic Gramian, no MDX parsing."""
import json
import numpy as np
from scipy.integrate import solve_ivp

times=np.linspace(0,6,301)
cases=[]
for k in [0.,.1,1.]:
    # Diagonalize the symmetric stiffness of unit masses, rather than exp(A t).
    stiffness=np.array([[1+k,-k],[-k,k]])
    values,V=np.linalg.eigh(stiffness)
    omega=np.sqrt(np.maximum(values,0))
    forcing=V.T@np.array([1.,0.]); initial=V.T@np.array([0.,1.])
    forced=[];free=[]
    for t in times:
        q=np.zeros(2);v=np.zeros(2);qf=np.zeros(2);vf=np.zeros(2)
        for i,w in enumerate(omega):
            q[i]=forcing[i]*((1-np.cos(w*t))/w**2 if w>1e-12 else t*t/2)
            v[i]=forcing[i]*(np.sin(w*t)/w if w>1e-12 else t)
            qf[i]=initial[i]*np.cos(w*t);vf[i]=-initial[i]*w*np.sin(w*t)
        q=V@q;v=V@v;qf=V@qf;vf=V@vf
        forced.append([q[0],v[0],q[1],v[1]])
        free.append([qf[0],vf[0],qf[1],vf[1]])
    cases.append(dict(k=k,forced=forced,free=free))
rates=np.array([1.,2.]);W=np.array([[1/(a+b) for b in rates] for a in rates])
WT=np.array([[(1-np.exp(-a-b))/(a+b) for b in rates] for a in rates])
print(json.dumps(dict(cases=cases,W=W.tolist(),WT=WT.tolist(),energy=float(np.linalg.inv(WT)[0,0]))))
