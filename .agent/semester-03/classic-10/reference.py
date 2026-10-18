import numpy as np,json
from scipy.linalg import expm
from scipy.signal import StateSpace,step
from scipy.optimize import brentq,minimize_scalar
import control as ct
s=ct.tf('s');G=1/(s+1);rows=[];maxerr=0
for name,kp,ki in [('P4',4,0),('PI11',1,1),('PI21',2,1)]:
 A=np.array([[-1-kp]]) if ki==0 else np.array([[-1-kp,1],[-ki,0]])
 B=np.array([[kp]]) if ki==0 else np.array([[kp],[ki]])
 Cy=np.array([[1.]]) if ki==0 else np.array([[1.,0.]])
 Cu=np.array([[-kp]]) if ki==0 else np.array([[-kp,1.]])
 C=ct.tf([kp],[1]) if ki==0 else (kp*s+ki)/s
 def val(t,Cout,D=0):return float((Cout@np.linalg.solve(A,(expm(A*t)-np.eye(len(A)))@B)).item()+D)
 t=np.arange(2001)/100
 for amp in [.25,1,1.7]:
  for Cout,D,tf in [(Cy,0,ct.feedback(C*G)),(Cu,kp,ct.feedback(C,G))]:
   _,ref=step(StateSpace(A,B,Cout,[[D]]),T=t);_,actual=ct.step_response(tf,t)
   e=float(np.max(abs(amp*(ref-actual))));maxerr=max(maxerr,e);assert e<1e-8
 residual=1-val(1000,Cy)
 peak=max(abs(val(0,Cu,kp)),abs(val(1000,Cu,kp)),abs(val(minimize_scalar(lambda t:-abs(val(t,Cu,kp)),bounds=(0,20),method='bounded').x,Cu,kp)))
 freq=[]
 for w in [.01,.1,1.,10.,100.,1000.]:
  for Cout,D,tf in [(Cy,0,ct.feedback(C*G)),(Cu,kp,ct.feedback(C,G))]:
   v=(Cout@np.linalg.solve(1j*w*np.eye(len(A))-A,B)).item()+D
   assert abs(v-ct.evalfr(tf,1j*w))<1e-10
   if w==100.:freq.append(abs(v))
 results=[]
 for label,amp,eps,lim,deadline in [('A',1,.02,3,8),('B',.25,.06,1.2,2),('C',1,.02,1.5,8),('D',1,.02,.5,8)]:
  ts=None if amp*residual>=eps-1e-12 else brentq(lambda t:amp*(1-val(t,Cy))-eps,0,100)
  results.append(dict(contract=label,entry=ts,peak=amp*peak,passed=ts is not None and ts<=deadline and amp*peak<=lim+1e-10))
 rise=None if ki==0 else brentq(lambda t:val(t,Cy)-.9,0,100)-brentq(lambda t:val(t,Cy)-.1,0,100)
 rows.append(dict(name=name,roots=np.linalg.eigvals(A).tolist(),residual=residual,rise=rise,peak=peak,contracts=results,noise100=freq))
for label,expected in [('A',['PI11','PI21']),('B',['P4','PI11','PI21']),('C',['PI11']),('D',[])]:assert [r['name'] for r in rows if next(c for c in r['contracts'] if c['contract']==label)['passed']]==expected
print(json.dumps(dict(pass_=True,maxResponseError=maxerr,nodes=2001,amplitudes=[.25,1,1.7],rows=rows),indent=2))
