import json,sys,numpy as np
from scipy.integrate import solve_ivp
from scipy.linalg import expm
data=json.load(open(sys.argv[1],encoding='utf-8'));errors=[];radial=[]
def deriv(key,p):
    if key=='pendulum':return lambda t,z:[z[1],-np.sin(z[0])-p*z[1]]
    if key=='duffing':return lambda t,z:[z[1],-z[0]-p*z[1]+.2*z[0]**3]
    if key=='vanderpol':return lambda t,z:[z[1],p*(1-z[0]**2)*z[1]-z[0]]
    if key=='lotka':return lambda t,z:[p*z[0]-.5*z[0]*z[1],-1.5*z[1]+.75*z[0]*z[1]]
    return lambda t,z:[-z[1]+p*z[0]*sum(q*q for q in z),z[0]+p*z[1]*sum(q*q for q in z)]
for case in data['phase']:
    key,p,ic=case['key'],case['p'],case['ic'];a=np.array(case['trajectory']);t=a[:,0]
    sol=solve_ivp(deriv(key,p),[0,float(t[-1])],ic,t_eval=t,rtol=2e-12,atol=2e-13,max_step=.01,method='DOP853')
    assert sol.success
    expected=sol.y
    if key=='pendulum' and p==0 and ic[0]==0 and abs(ic[1])==2:
        sign=np.sign(ic[1]);expected=np.array([sign*(4*np.arctan(np.exp(t))-np.pi),sign*2/np.cosh(t)])
    error=float(np.max(abs(a[:,1:].T-expected)));assert error<.002,(key,p,error);errors.append(error)
    for eq in case['equilibria']:
        assert np.max(np.abs(deriv(key,p)(0,eq['point'])))<1e-10
        values=np.linalg.eigvals(np.array(eq['J']).reshape(2,2))
        hyper=all(abs(v.real)>1e-9 for v in values);assert eq['hyperbolic']==hyper
    if key=='cubic':
        x=case['extra'];r0=np.linalg.norm(ic);reference=r0/np.sqrt(1-2*p*r0*r0*t[-1]);assert abs(x['rAna']-reference)<1e-11;assert abs(x['rEnd']-reference)<.002;radial.append({'p':p,'t':float(t[-1]),'r':reference,'error':abs(x['rEnd']-reference)})
for row in data['trace']:
    tr,de=row['tr'],row['det'];ev=np.linalg.eigvals([[0.,1.],[-de,tr]])
    assert row['classification']['hyperbolic']==all(abs(v.real)>1e-9 for v in ev)
    real1,real2,im=row['eigen'];expected=sorted(ev,key=lambda z:(z.real,z.imag));computed=sorted([complex(real1,im),complex(real2,-im)],key=lambda z:(z.real,z.imag));assert max(abs(a-b) for a,b in zip(expected,computed))<1e-10
    for i,point in enumerate(row['trajectory']):
        # Original TraceDet samples after steps 1,4,7,...; derive exact actual time.
        t=0. if i==0 else (1+3*(i-1))*9/900
        error=np.max(abs(expm(np.array([[0.,1.],[-de,tr]])*t)@np.array([.2,-.1])-point));assert error<2e-5,(tr,de,t,error)
# Independent stable-manifold intersection, rather than the UI's forward bisection.
saddle=np.array([np.sqrt(5.),0.]);values,vectors=np.linalg.eig([[0.,1.],[2.,-.5]]);v=vectors[:,np.argmin(values)];v=v*(-1 if v[0]>0 else 1)
def crossing(t,z):return z[0]
crossing.terminal=True
back=solve_ivp(lambda t,z:-np.array(deriv('duffing',.5)(t,z)),[0,40],saddle+1e-8*v,events=crossing,rtol=2e-12,atol=2e-13,max_step=.005)
assert back.success and len(back.y_events[0])==1
threshold=float(back.y_events[0][0,1]);actual=next(c for c in data['phase'] if c['key']=='duffing' and c['p']==.5)['extra']['vCrit'];assert abs(threshold-actual)<2e-7
print(json.dumps({'threshold':threshold,'thresholdError':abs(threshold-actual),'pass':True,'phaseCases':len(data['phase']),'traceCases':len(data['trace']),'maxStateError':max(errors),'radial':radial}))
