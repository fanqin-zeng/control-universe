"""Independent state recurrence + high precision weighted sums and complex contour inversion."""
import json,math
import mpmath as mp
import scipy
from scipy.integrate import quad
mp.mp.dps=70
params=[(i/10,r,n) for i in range(-10,11) for r in [.5,.75,1,1.25,1.5,1.75,2] for n in range(13)]
params += [(a,.5,n) for a in [.5-2**-20,.5+2**-20,-.5+2**-20,-.5-2**-20] for n in [0,8,12]]
cases=[]
for a,r,n in params:
 aa,rr=mp.mpf(a),mp.mpf(r)
 state=mp.mpf(1);samples=[];terms=[];weight=mp.mpf(1)
 for k in range(13):
  samples.append([k,float(state)])
  if k<=n:terms.append(state*weight)
  state*=aa;weight/=rr
 converges=abs(aa)<rr
 # High precision convergent rational solve; finite terms independently evolve state/weight.
 infinite=rr/(rr-aa) if converges else None
 partial=mp.fsum(terms)
 cases.append(dict(a=a,r=r,n=n,partial=float(partial),last=float(terms[-1]),terms=list(map(float,terms)),samples=samples,converges=converges,infinite=float(infinite) if converges else None,tail=float(infinite-partial) if converges else None))
checks=[]
for side in ['right','left']:
 for z in ([1,2,1j,-1,1+1j] if side=='right' else [.25,-.25,.25j,.2+.1j]):
  zz=mp.mpc(z);aa=mp.mpf('.5')
  total=mp.mpc(0);term=mp.mpc(1)
  ratio=aa/zz if side=='right' else zz/aa
  for k in range(400):
   if side=='right':total+=term;term*=ratio
   else:term*=ratio;total-=term
  expected=zz/(zz-aa);err=abs(total-expected);assert err<mp.mpf('1e-50')
  checks.append(dict(side=side,z=[float(zz.real),float(zz.imag)],value=[float(total.real),float(total.imag)],error=float(err)))
inverse=[]
for k in range(9):
 f=lambda t:(1/(1-.5*complex(math.cos(t),-math.sin(t))))*complex(math.cos(k*t),math.sin(k*t))
 re=quad(lambda t:f(t).real,-math.pi,math.pi,epsabs=1e-12,epsrel=1e-12)[0]/(2*math.pi)
 im=quad(lambda t:f(t).imag,-math.pi,math.pi,epsabs=1e-12,epsrel=1e-12)[0]/(2*math.pi)
 assert abs(complex(re,im)-.5**k)<1e-10
 inverse.append(dict(k=k,value=[re,im],expected=.5**k))
print(json.dumps(dict(cases=cases,checks=checks,inverse=inverse,versions=dict(mpmath=mp.__version__,scipy=scipy.__version__))))
