import numpy as np, scipy, control as ct
import matplotlib.pyplot as plt
from scipy.signal import residue
from scipy.optimize import brentq
from scipy.integrate import solve_ivp
s=ct.tf('s')
def plant(R=1.,J=.01,B=.001,K=.1):
 return ct.tf([K],[.01*J,.01*B+R*J,R*B+K*K])
G=plant();Gd=ct.tf([-.01,-1],[.0001,.01001,.011])
controllers={'P50':ct.tf([50],[1]),'PI':(10.24*s+11.26)/s,'PIDf':5+5.5/s+.3*s/(1+.001*s),'Lead':50*(1+.00644*s)/(1+.00167*s),'PIsoft':2+2.2/s}
def expansion(H):
 n=np.asarray(H.num[0][0]);d=np.asarray(H.den[0][0]);r,p,k=residue(n,np.polymul(d,[1,0]));assert len(k)==0
 return r,p
def response(H,t):
 r,p=expansion(H);return np.real(np.exp(np.outer(t,p))@r)
def metrics(C,P=G,dt=.0005,end=5.):
 T=ct.feedback(C*P);U=ct.feedback(C,P);t=np.arange(round(end/dt)+1)*dt;y=response(T,t);u=response(U,t)
 roots=ct.poles(T);assert np.max(roots.real)<0
 r,p=expansion(T);nz=abs(p)>1e-8;tail=float(np.sum(abs(r[nz])*np.exp(p[nz].real*end)));dc=float(ct.dcgain(T));bad=np.flatnonzero(abs(y-1)>.02)
 ts=None if abs(dc-1)+tail>=.02 or (len(bad)>0 and bad[-1]==len(t)-1) else float(t[bad[-1]+1] if len(bad) else 0.)
 gm,pm,wg,wc=ct.margin(C*P)
 return dict(ess=1-dc,peak_target_pct=float(max(0,(max(y)-1)*100)),ts_grid=ts,u_peak_grid=float(max(abs(u))),pm=float(pm),wc=float(wc),gm_db=None if np.isinf(gm) else float(20*np.log10(gm)),roots=[[float(z.real),float(z.imag)] for z in roots],tail_bound=tail,grid_dt=dt,window=end)
def print_metrics():
 for n,C in controllers.items():print(n,metrics(C))
def discrete_metrics(fs):
 Cz=ct.sample_system(controllers['Lead'],1/fs,method='tustin');Pz=ct.sample_system(G,1/fs,method='zoh');L=Cz*Pz
 # Direct discrete frequency root avoids polynomial margin fallback on fine sample times.
 w=brentq(lambda w:abs(ct.evalfr(L,np.exp(1j*w/fs)))-1,100,600)
 pm=180+np.angle(ct.evalfr(L,np.exp(1j*w/fs)),deg=True)
 return dict(fs=fs,wc=w,pm=float(pm),num=Cz.num[0][0].tolist(),den=Cz.den[0][0].tolist(),closed_poles=[[float(z.real),float(z.imag)] for z in ct.poles(ct.feedback(L))])
def saturated(amp,aw):
 kp,ki,kd,tf,tt=5.,5.5,.3,.001,.05
 def rhs(t,x):
  i,w,xi,xf=x;e=amp-w;v=kp*e+xi+kd/tf*(e-xf);u=np.clip(v,-24,24)
  return [(u-i-.1*w)/.01,(.1*i-.001*w)/.01,ki*e+((u-v)/tt if aw else 0),(e-xf)/tf]
 t=np.arange(8001)/1000;sol=solve_ivp(rhs,[0,8],[0,0,0,0],t_eval=t,rtol=1e-7,atol=1e-9,max_step=.001);assert sol.success
 i,w,xi,xf=sol.y;e=amp-w;v=kp*e+xi+300*(e-xf);u=np.clip(v,-24,24)
 return t,w,u,xi
