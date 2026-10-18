import numpy as np
from scipy.integrate import solve_ivp

def run(c=.8, b=.2, shaped=True, dt=.002):
    t=np.linspace(0,10,round(10/dt)+1)
    def force(q,v):
        return (2*q+q**3-2*(q-1)-(q-1)**3 if shaped else 0)-c*v
    def rhs(t,z):
        q,v,D=z
        return [v,force(q,v)-b*v-2*q-q**3,(b+c)*v*v]
    sol=solve_ivp(rhs,[0,10],[0,0,0],method='DOP853',rtol=1e-11,atol=1e-12,t_eval=t)
    assert sol.success
    q,v,D=sol.y
    e=q-1 if shaped else q
    H=.5*v*v+e*e+.25*e**4
    return np.column_stack([t,q,v,H,D,force(q,v)])
