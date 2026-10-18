import json,numpy as np,control as ct
from scipy.optimize import minimize_scalar,brentq
from scipy.linalg import expm
s=ct.tf('s');w=10.**np.linspace(-2,2,401);loops=[];seconds=[]
for k in range(1,201):
 L=k/(s*(s+1)*(s+10));gm,pm,wg,wc=ct.margin(L);S=1/(1+L);T=ct.feedback(L)
 sv=np.array([abs(ct.evalfr(S,1j*x)) for x in w]);tv=np.array([abs(ct.evalfr(T,1j*x)) for x in w])
 if k==110:ms=None;wms=np.sqrt(10)
 else:
  peak=minimize_scalar(lambda x:-abs(ct.evalfr(S,1j*x)),bounds=(0,100),method='bounded',options={'xatol':1e-13});ms=-peak.fun;wms=peak.x
 loops.append(dict(k=k,wc=wc,pm=pm,gm=20*np.log10(gm),ms=ms,wms=wms,s=sv.tolist(),t=tv.tolist(),stable=bool(np.max(ct.poles(T).real)<-1e-8)))
for z in sorted(set([round(.1+i*.01,2) for i in range(141)]+[1/np.sqrt(2)])):
 T=100/(s*s+20*z*s+100);mag=lambda x:abs(ct.evalfr(T,1j*x));wb=brentq(lambda x:mag(x)-1/np.sqrt(2),.00001,1000,xtol=1e-13)
 if z<1/np.sqrt(2):
  peak=minimize_scalar(lambda x:-mag(x),bounds=(0,20),method='bounded',options={'xatol':1e-13});mr=-peak.fun;wr=peak.x
 else:mr=1;wr=0
 if z<1:
  A=np.array([[0.,1.],[-100.,-20*z]]);B=np.array([0.,100.]);tp=np.pi/np.sqrt(100-(10*z)**2);mp=100*((np.linalg.solve(A,(expm(A*tp)-np.eye(2))@B))[0]-1)
 else:mp=0
 seconds.append(dict(z=z,wb=wb,mr=mr,wr=wr,mp=mp,mag=[mag(x) for x in w]))
wc=brentq(lambda x:abs(ct.evalfr(10/(s*(s+1)),1j*x))-1,1,10);pm0=180+np.angle(ct.evalfr(10/(s*(s+1)),1j*wc),deg=True);critical=pm0*np.pi/(180*wc)
delays=[dict(tau=tau,wc=wc,pm0=pm0,limit=critical,pm=pm0-tau*wc*180/np.pi) for tau in [0,.05,critical,.15,.3]]
print(json.dumps(dict(loops=loops,seconds=seconds,delays=delays)))
