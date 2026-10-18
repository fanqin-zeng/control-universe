import json,sys,math
import numpy as np
import sympy as S
from scipy.integrate import solve_ivp,quad
from scipy.optimize import brentq
P=json.load(open(sys.argv[1],encoding='utf-8'));maxerr=0.;maxsmooth=0.;count=0;tvrel=0.
def recurrence(p,law,dt):
 lam,K,phi,D=p;alpha=1.5*math.sqrt(max(5*D,.5));beta=1.1*max(5*D,.5);x=1.5;s=lam*x;integ=0.;n=round(6/dt)
 rows=[];tv=0.;prev=None;ssq=0.;nn=0;band=0.;reach=None;hold=0
 for i in range(n+1):
  t=i*dt;velocity=s-lam*x;sign=1 if s>0 else -1 if s<0 else 0
  force=-K*sign if law=='sgn' else -K*max(-1,min(1,s/phi)) if law=='sat' else -K*math.tanh(s/phi) if law=='tanh' else -alpha*math.sqrt(abs(s))*sign+integ
  u=(2-lam)*velocity+math.sin(x)+force
  hold=hold+1 if abs(s)<.02 else 0
  if reach is None and hold>=round(.2/dt):reach=(i-hold+1)*dt
  if t>4:
   band=max(band,abs(s))
   if prev is not None:tv+=abs(u-prev)
   prev=u
  if t>5:ssq+=x*x;nn+=1
  if i%20==0 or i==n:rows.append([t,x,velocity,s,u])
  if i==n:break
  acc=-lam*velocity+force+D*math.sin(5*t)
  x=x+dt*velocity+dt*dt*acc;s=s+dt*(force+D*math.sin(5*t))+lam*dt*dt*acc
  if law=='sta':integ-=dt*beta*sign
 return np.array(rows),dict(tv=tv,band=band,rms=math.sqrt(ssq/nn),reach=reach)
for case in P['cases']:
 ref,metrics=recurrence(case['params'],case['law'],2e-4);rows=case['result']['rows'];actual=np.array([[r[k] for k in ['t','x','velocity','s','u']] for r in rows]);assert actual.shape==ref.shape
 # Discontinuous raw u can differ by a whole switching jump from roundoff; do not disguise this as state error.
 err=float(np.max(np.abs(actual[:,:4]-ref[:,:4])));maxerr=max(maxerr,err);assert err<1e-7,(case['params'],case['law'],err)
 if case['law'] in ('sat','tanh'):
  maxsmooth=max(maxsmooth,float(np.max(np.abs(actual-ref))));assert np.max(np.abs(actual-ref))<1e-8
 else:
  assert abs(case['result']['rms']-metrics['rms'])<3e-4
 rel=abs(case['result']['tv']-metrics['tv'])/max(1,metrics['tv']);tvrel=max(tvrel,rel);assert rel<1e-5
 assert case['result']['steps']==30000 and case['result']['lastTime']==6
 count+=len(rows)
def smooth(t,z,law):
 x,s=z;return [-3*x+s,-2*(max(-1,min(1,s/.05)) if law=='sat' else np.tanh(s/.05))+.3*np.sin(5*t)]
continuous={}
for law in ['sat','tanh']:
 case=next(c for c in P['cases'] if c['params']==[3,2,.05,.3] and c['law']==law);tt=np.array([r['t'] for r in case['result']['rows']]);sol=solve_ivp(lambda t,z:smooth(t,z,law),[0,6],[1.5,4.5],method='DOP853',rtol=1e-12,atol=1e-13,dense_output=True,max_step=.01);assert sol.success
 err=max(abs(r['x']-v) for r,v in zip(case['result']['rows'],sol.sol(tt)[0]));assert err<.002
 continuous[law]=float(err)
 if law=='sat':
  errors=[]
  for a in P['refinement']:
   rr=a['result']['rows'];tx=np.array([r['t'] for r in rr]);errors.append(float(max(abs(r['x']-v) for r,v in zip(rr,sol.sol(tx)[0]))))
  assert errors[1]<errors[0];continuous['sat_refinement']=errors
# Projection cancels matched g*d, not nominal tangential f.
f1,f2,g1,g2,c1,c2,d=S.symbols('f1 f2 g1 g2 c1 c2 d');f=S.Matrix([f1,f2]);g=S.Matrix([g1,g2]);c=S.Matrix([[c1,c2]]);proj=lambda F:F-g*(c*F)[0]/(c*g)[0]
assert all(S.simplify(x)==0 for x in proj(f+g*d)-proj(f))
eta,V=S.symbols('eta V',positive=True);assert S.simplify(-eta*S.sqrt(2*V)/(2*S.sqrt(V))+eta/S.sqrt(2))==0
B=S.Matrix([0,0,1]);da=S.zeros(3);da[2,2]=S.Rational(1,2);assert B.row_join(da).rank()==1
da=S.zeros(3);da[0,1]=S.Rational(1,5);assert B.row_join(da).rank()==2
tr=brentq(lambda t:4.5-2*t+.06*(1-np.cos(5*t)),2.,2.7);assert abs(P['notebooks'][0]['bandEnter']-tr)<.03
nb2={q['law']:q for q in P['notebooks'][1]};assert nb2['sat']['smax']<.0075*1.05
for q in P['notebooks'][3]:
 if q['K']>=1:assert .014<q['unmatched']<.018
# Exact scalar CT equilibrium uses nominal inertia, provided zero-velocity friction vanishes.
J0,kp,load=.01,400.,.15;equilibrium=-load/(J0*kp);assert abs(equilibrium+.0375)<1e-15
print(json.dumps(dict(pass_=True,cases=len(P['cases']),points=count,maxStateDifference=maxerr,maxSmoothDifference=maxsmooth,maxTVRelativeDifference=tvrel,continuous=continuous,symbolicChecks=4,idealReach=tr,reachBound=4.5/1.7,motorEquilibrium=equilibrium)))
