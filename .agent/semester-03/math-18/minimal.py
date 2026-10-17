import numpy as np
from scipy.integrate import solve_ivp
for k in [0,1,2]:
 for n in [4,8,16,32,64]:
  h=4/n;g=1-k*h;be=1/(1+k*h);z=-k*h;r=1+z+z*z/2+z**3/6+z**4/24
  exact=20+60*np.exp(-4*k);values=20+60*np.array([g**n,be**n,r**n]);print('k n exact E BE RK errors',k,n,exact,values,abs(values-exact))
f=lambda t:20+60*np.exp(-t)-40
lo,hi=0.,4.;cnt=0
while hi-lo>1e-6:
 mid=(lo+hi)/2
 if f(mid)>0:lo=mid
 else:hi=mid
 cnt+=1
print('root',cnt,(lo+hi)/2,hi-lo,np.log(3),(lo+hi)/2-np.log(3))
t=np.linspace(0,4,9);y=20+60*np.exp(-t);h=.5
print('integral',80+60*(1-np.exp(-4)),h*(y[0]/2+sum(y[1:-1])+y[-1]/2),h/3*(y[0]+y[-1]+4*sum(y[1:-1:2])+2*sum(y[2:-1:2])))
def event(t,y):return y[0]-40
event.direction=-1
s=solve_ivp(lambda t,y:-(y-20),(0,4),[80.],rtol=1e-8,atol=1e-10,events=event,dense_output=True)
print('adaptive',s.success,s.y[0,-1],s.t_events,s.nfev)
