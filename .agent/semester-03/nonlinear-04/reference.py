import json,sys
import numpy as np
from scipy.integrate import quad,solve_ivp
from scipy.optimize import brentq
payload=json.load(open(sys.argv[1],encoding='utf-8'))
def project(kind,A,k,a):
 if kind in ('hysteresis','backlash') and A<=a:return 0j
 if kind=='hysteresis':
  al=np.arcsin(a/A);pts=[al,np.pi+al];f=lambda t:k if al<=t<=np.pi+al else -k;lo,hi=0,2*np.pi
 elif kind=='backlash':
  b=a;start=np.arcsin(-1+2*b/A);end=np.pi-np.arcsin(1-2*b/A);lo,hi=-np.pi/2,3*np.pi/2;pts=[start,np.pi/2,end]
  def f(t):
   if t<start:return -k*(A-b)
   if t<=np.pi/2:return k*(A*np.sin(t)-b)
   if t<end:return k*(A-b)
   return k*(A*np.sin(t)+b)
 else:
  lo,hi=0,2*np.pi;pts=[np.pi/2,np.pi,3*np.pi/2]
  if a<A:
   al=np.arcsin(a/A);pts+= [al,np.pi-al,np.pi+al,2*np.pi-al]
  def f(t):
   u=A*np.sin(t)
   if kind=='relay':return k*np.sign(u)
   if kind=='saturation':return np.clip(k*u,-k*a,k*a)
   return k*np.sign(u)*max(abs(u)-a,0)
 re=quad(lambda t:f(t)*np.sin(t),lo,hi,points=sorted(set(pts)),epsabs=1e-11,limit=100)[0]/(np.pi*A)
 im=quad(lambda t:f(t)*np.cos(t),lo,hi,points=sorted(set(pts)),epsabs=1e-11,limit=100)[0]/(np.pi*A)
 return re+1j*im
maxdf=0.;maxhb=0.
for row in payload['df']:
 ref=project(row['type'],row['A'],row['k'],row['a']);err=abs(ref-complex(row['re'],row['im']));maxdf=max(maxdf,err);assert err<1e-7,(row,ref)
for row in payload['hb']:
 K,a,T=row['K'],row['a'],row['T'];G=lambda w:K/(1j*w*(1j*w+a)*(T*1j*w+1))
 omega=brentq(lambda w:G(w).imag,.05,20,xtol=1e-12);g=G(omega)
 assert abs(omega-row['omega'])<1e-9 and abs(g-complex(row['g']['re'],row['g']['im']))<1e-9
 if row['status']=='critical':assert abs((-1/g).real-1)<1e-10 and row['amplitude'] is None
 elif row['status']=='none':assert (-1/g).real>1 and row['amplitude'] is None
 else:
  amp=row['amplitude'];n=project(row['type'],amp,1,1);err=abs(n*g+1);maxhb=max(maxhb,err);assert err<1e-8,(row,err)
# Independent continuous ODE with event-driven relay switching: no fixed-step Euler.
def relay_metrics(K=1.,Tc=.5,h=0.,order=3,zeta=None):
 end=120. if zeta is not None else 80.;s=1.;t=0.;ix=3 if zeta is not None else 0
 x=np.zeros(5 if zeta is not None else order);x[ix]=-1e-6 if h==0 else -.5
 segments=[];rises=[];wr=3*np.sqrt(2.)
 while t<end-1e-10:
  def rhs(t,z):
   if zeta is not None:return [z[1],z[2],-3*z[2]-2*z[1]+2*s,z[4],-2*zeta*wr*z[4]-wr*wr*z[3]+wr*wr*z[0]]
   if order==2:return [z[1],-z[1]+K*s]
   return [z[1],z[2],-(1+1/Tc)*z[2]-z[1]/Tc+K*s/Tc]
  # Advance away from the just-crossed switching surface before enabling events.
  te=min(t+1e-8,end);tiny=solve_ivp(rhs,[t,te],x,method='DOP853',rtol=2e-11,atol=1e-12,dense_output=True)
  assert tiny.success;segments.append((t,te,tiny.sol));x=tiny.y[:,-1];t=te
  if t>=end:break
  def event(t,z):return -z[ix]+s*h
  event.terminal=True;event.direction=-s
  sol=solve_ivp(rhs,[t,end],x,events=event,method='DOP853',rtol=2e-11,atol=1e-12,max_step=.04,dense_output=True)
  assert sol.success;segments.append((t,sol.t[-1],sol.sol));x=sol.y[:,-1];t=sol.t[-1]
  if len(sol.t_events[0]):
   if s<0:rises.append(t)
   s=-s
  else:break
 assert t>=end-1e-9
 rises=np.array([v for v in rises if v>=end/2]);assert len(rises)>=4
 period=float(np.mean(np.diff(rises)));ta,tb=rises[len(rises)//2],rises[-1];ts=np.linspace(ta,tb,20001)
 starts=np.array([q[0] for q in segments]);indices=np.minimum(np.searchsorted(starts,ts,side='right')-1,len(segments)-1);wave=np.empty(len(ts))
 for j in np.unique(indices):
  m=indices==j;wave[m]=-segments[j][2](ts[m])[ix]
 w=2*np.pi/period;amps=[]
 for n in range(1,8):amps.append(float(abs(2*np.trapezoid(wave*np.exp(-1j*n*w*(ts-ta)),ts)/(tb-ta))))
 return {'amplitude':amps[0],'period':period,'thd':float(np.linalg.norm(amps[1:])/amps[0]),'lastTime':t,'switchSegments':len(segments)//2}
continuous={}
for T in [.5,.05]:continuous['relay-'+str(T)]=relay_metrics(Tc=T)
continuous['hysteresis-2']=relay_metrics(K=2,h=.2,order=2)
continuous['hysteresis-3']=relay_metrics(K=2,Tc=.1,h=.2,order=3)
for zeta in [.02,.1,.2]:continuous['resonance-'+str(zeta)]=relay_metrics(zeta=zeta)
inverse_r=1/np.sqrt(1+np.pi**2);inverse_k=np.sqrt(1-inverse_r**2)/(4/np.pi)/(inverse_r**2)
continuous['inverse']=relay_metrics(K=inverse_k,h=inverse_r,order=2)
def static_metrics(kind,K,initial=-.2,end=80.):
 def control(e):
  value=e if kind=='sat' else np.sign(e)*max(abs(e)-.3,0)
  return np.clip(value,-1,1)
 def rhs(t,z):return [z[1],z[2],-3*z[2]-2*z[1]+2*K*control(-z[0])]
 ts=np.arange(0,end,.0005);sol=solve_ivp(rhs,[0,end],[initial,0,0],t_eval=ts,method='DOP853',rtol=2e-11,atol=1e-12,max_step=.03)
 assert sol.success and sol.t[-1]>end-.001
 wave=-sol.y[0];late=ts>=end/2;peak=float(np.max(abs(wave[late])))
 if K==2:return {'peak30to40':float(np.max(abs(wave[(ts>=30)&(ts<40)]))),'lastTime':float(ts[-1])}
 ix=np.flatnonzero((wave[:-1]<0)&(wave[1:]>=0)&(ts[:-1]>=end/2));zc=ts[ix]+.0005*(-wave[ix])/(wave[ix+1]-wave[ix]);assert len(zc)>=4
 period=float(np.mean(np.diff(zc)));a,b=zc[len(zc)//2],zc[-1];t=np.linspace(a,b,20001);y=np.interp(t,ts,wave);w=2*np.pi/period
 amps=[abs(2*np.trapezoid(y*np.exp(-1j*n*w*(t-a)),t)/(b-a)) for n in range(1,8)]
 return {'amplitude':float(amps[0]),'period':period,'thd':float(np.linalg.norm(amps[1:])/amps[0]),'lastTime':float(ts[-1])}
continuous['saturation-6']=static_metrics('sat',6)
continuous['saturation-2']=static_metrics('sat',2,initial=-1,end=40)
continuous['composite']=static_metrics('comp',7.030174003420147,initial=-3)
# Independent static Fourier root for the two-branch example and analytic Q5 integrals.
composite=lambda A:quad(lambda t:np.clip(max(A*np.sin(t)-.3,0),0,1)*np.sin(t),0,np.pi/2,points=[np.arcsin(min(.3/A,1)),np.arcsin(min(1.3/A,1))],epsabs=1e-12)[0]*4/(np.pi*A)
grid=np.linspace(.31,8,400);peak=max(composite(a) for a in grid);K=3/(.6*peak);target=3/K
roots=[brentq(lambda a:composite(a)-target,.31,1.3),brentq(lambda a:composite(a)-target,1.3,8)]
I1=quad(lambda x:(1-x*x)*np.cos(np.pi*x/2),0,1)[0];I2=quad(lambda x:(2*x-x*x)*np.sin(np.pi*x/2),0,1)[0]
assert max(abs(I1-16/np.pi**3),abs(I2-16/np.pi**3))<1e-12
print(json.dumps({'pass':True,'dfCases':len(payload['df']),'hbCases':len(payload['hb']),'maxDFError':maxdf,'maxHBResidual':maxhb,'continuous':continuous,'doubleRoots':roots,'doubleK':K,'q5Integrals':[I1,I2],'circleCounterexample':[-1.2,-.4]}))
