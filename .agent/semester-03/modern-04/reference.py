"""Independent physical ODE reference for the actual browser closed forms."""
import json
import numpy as np
from scipy.integrate import solve_ivp
from scipy.optimize import brentq
cases=[]
t=np.linspace(0,4,501)
for p in np.arange(-10.,-.49,.5):
    gain=np.array([p*p-2,-2*p-3]);N=p*p
    # Integrate physical acceleration; do not use the component response formulas.
    def rhs(t,x):
        force=N-gain@x
        return [x[1],force-3*x[1]-2*x[0]]
    x=solve_ivp(rhs,[0,4],[0.,0.],t_eval=t,rtol=1e-12,atol=1e-13).y.T
    f=N-x@gain
    baseline=solve_ivp(lambda t,z:[z[1],2-3*z[1]-2*z[0]],[0,4],[0.,0.],t_eval=t,rtol=1e-12,atol=1e-13).y.T[:,0]
    cases.append(dict(p=float(p),states=x.tolist(),force=f.tolist(),baseline=baseline.tolist(),K=gain.tolist(),N=N))
error=lambda t:np.exp(-10*t)*(np.cos(10*t)+np.sin(10*t))
print(json.dumps(dict(cases=cases,motor=dict(ts=brentq(lambda t:error(t)+.02,.32,.5,xtol=1e-14),tp=np.pi/10,overshoot=100*np.exp(-np.pi),y=(1-error(np.linspace(0,.8,801))).tolist()))))
