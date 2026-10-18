import json,numpy as np
from scipy.optimize import brentq
cubic=[]
for a2 in np.arange(.5,10.01,.5):
 pts=[]
 for i in range(101):
  for j in range(51):
   a1=i/10;a0=j/5;r=np.roots([1,a2,a1,a0])
   if max(r.real)<-1e-7:pts.append([a1,a0])
 cubic.append(dict(a2=float(a2),stable=pts))
pd=[]
for i in range(51):
 for j in range(51):
  kd=i/5;kp=j*.4
  if max(np.roots([1,kd,kp-9.8]).real)<-1e-7:pd.append([kd,kp])
delay=[]
for i in range(146):
 k=.5+i*.1
 w=brentq(lambda w:w*np.sqrt(w*w+4)-k,1e-9,20,xtol=1e-13)
 edge=(np.pi/2-np.arctan(w/2))/w
 p=brentq(lambda l:2+(2-k)*l-k*l*l/2,0,20,xtol=1e-13)
 delay.append(dict(k=k,omega=w,exact=edge,pade=p))
pdPoles=[dict(kp=kp,kd=kd,poles=[[float(q.real),float(q.imag)] for q in np.roots([1,kd,kp-9.8])]) for kp in [0,9.8,12,20] for kd in [0,2,10]]
print(json.dumps(dict(cubic=cubic,pd=pd,pdPoles=pdPoles,delay=delay)))
