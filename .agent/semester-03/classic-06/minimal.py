import numpy as np
from scipy.signal import residue
from scipy.optimize import brentq
def response(a,b,k,t,zero=None):
 den=[1,a,b,k] if zero is None else [1,a,b+k,k*zero]
 num=[k] if zero is None else [k,k*zero]
 r,p,_=residue(num,np.polymul(den,[1,0]));return np.real(np.sum(r[:,None]*np.exp(p[:,None]*np.asarray(t)),axis=0))
def metrics(a,b,k,zero=None):
 den=[1,a,b,k] if zero is None else [1,a,b+k,k*zero]
 p=np.roots(den)
 if np.max(p.real)>=0:return p,None,None
 t=np.linspace(0,120,120001);y=response(a,b,k,t,zero);idx=np.where(abs(y-1)>.02)[0];i=idx[-1]
 ts=brentq(lambda q:abs(response(a,b,k,[q],zero)[0]-1)-.02,t[i],t[i+1])
 return p,ts,100*(y.max()-1)
sd=-2+2/np.sqrt(3);kd=-sd*(sd+2)*(sd+4)
print('main break s,K',sd,kd)
for k in [kd,224/27,10,48,60]:print('main K,poles,ts,MPsample',k,metrics(6,8,k))
sd=(-10+2*np.sqrt(7))/3;print('Q4 break',sd,-sd*(sd+4)*(sd+6))
for k in [448/27,20,25,880/27,43.776]:print('Q5 K,poles,ts,MPsample',k,metrics(10,24,k))
for k in [1,10,40]:
 print('compare sameK',k,'original',metrics(6,8,k),'PDz1',metrics(6,8,k,1),'PDz10',metrics(6,8,k,10))
for z in [1,6,10]:print('added zero z,centroid,strict range',z,(z-6)/2, 'all K>0' if z<=6 else 48/(z-6))
