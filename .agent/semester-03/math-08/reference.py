"""Independent numerical integration; no copy of component area closed form."""
import json, math
import numpy as np
import scipy
from scipy.integrate import quad
import mpmath as mp
mp.mp.dps=60
parameters=[(a,s,T) for a in [.25,.5,1,1.5,2] for s in [-.5,-.25,0,.5,1,2] for T in [0,.125,1,4,8]]
parameters += [(.25,-.25+d,T) for d in [-1e-12,1e-12,-1e-8,1e-8] for T in [0,4,8]]
cases=[]
for a,sigma,T in parameters:
    r=a+sigma
    value=math.exp(-r*T)
    if 0<abs(r)<1e-6:
        R=mp.mpf(a)+mp.mpf(sigma)
        area=float(mp.quad(lambda t:mp.exp(-R*t),[0,T]))
        total=float(mp.quad(lambda u:mp.exp(-u),[0,mp.inf])/R) if r>0 else None
        tail=float(mp.quad(lambda u:mp.exp(-u),[R*T,mp.inf])/R) if r>0 else None
    else:
        area=quad(lambda t:math.exp(-r*t),0,T,epsabs=1e-12,epsrel=1e-12)[0]
        total=quad(lambda t:math.exp(-r*t),0,np.inf,epsabs=1e-12,epsrel=1e-12)[0] if r>0 else None
        tail=quad(lambda t:math.exp(-r*t),T,np.inf,epsabs=1e-12,epsrel=1e-12)[0] if r>0 else None
    samples=[[i/20,math.exp(-r*i/20)] for i in range(161)]
    shaded=[p for p in samples if p[0]<T]+[[T,value]]
    cases.append(dict(a=a,sigma=sigma,cutoff=T,r=r,value=value,area=area,converges=r>0,total=total,tail=tail,samples=samples,shaded=shaded))
complex_checks=[]
for sigma in [-.5,0,.5,2]:
    for omega in [0,1,3]:
        real=quad(lambda t:math.exp(-(1+sigma)*t)*math.cos(omega*t),0,np.inf,epsabs=1e-12,epsrel=1e-12,limit=300)[0]
        imag=quad(lambda t:-math.exp(-(1+sigma)*t)*math.sin(omega*t),0,np.inf,epsabs=1e-12,epsrel=1e-12,limit=300)[0]
        formula=1/(1+complex(sigma,omega))
        error=abs(complex(real,imag)-formula)
        assert error<1e-10
        complex_checks.append(dict(sigma=sigma,omega=omega,integral=[real,imag],error=error))
print(json.dumps(dict(versions=dict(numpy=np.__version__,scipy=scipy.__version__,mpmath=mp.__version__),cases=cases,complexChecks=complex_checks)))
