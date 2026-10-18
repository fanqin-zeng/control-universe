import json,numpy as np
from scipy.signal import freqs,step,TransferFunction
from scipy.optimize import brentq,minimize_scalar
from scipy.linalg import expm
cases=[]
w=np.logspace(-2,3,601)
for i in range(1,41):
 z=i*.05
 for wn in [2,8,50]:
  _,h=freqs([wn*wn],[1,2*z*wn,wn*wn],w)
  wb=brentq(lambda q:abs(wn*wn/(-q*q+2j*z*wn*q+wn*wn))**2-.5,0,wn*4,xtol=1e-12)
  wc=brentq(lambda q:abs(wn*wn/(1j*q*(1j*q+2*z*wn)))-1,wn*1e-6,wn*3,xtol=1e-12)
  pm=180+np.angle(wn*wn/(1j*wc*(1j*wc+2*z*wn)),deg=True)
  cases.append(dict(z=z,wn=wn,curve=[[float(q.real),float(q.imag)] for q in h],wb=wb,wc=wc,pm=pm))
bands=[]
for wn in [2,8,50]:
 A=np.array([[0.,1.],[-wn*wn,-wn]]);B=np.array([0.,wn*wn]);
 def y(t):return float((np.linalg.solve(A,expm(A*t)-np.eye(2))@B)[0])
 end=4/wn
 tr=brentq(lambda t:y(t)-.9,0,end)-brentq(lambda t:y(t)-.1,0,end)
 _,values=step(TransferFunction([wn*wn],[1,wn,wn*wn]),T=np.linspace(0,3,601))
 bands.append(dict(wn=wn,tr=tr,steps=values.tolist()))
rc=[]
for r in [100,1000,10000]:
 for c in [.1,1,10]:
  _,h=freqs([1],[r*c*1e-6,1],np.logspace(0,6,601))
  rc.append(dict(r=r,c=c,mag=np.abs(h).tolist(),phase=np.angle(h,deg=True).tolist()))
print(json.dumps(dict(cases=cases,bands=bands,rc=rc)))
