import json,numpy as np
from scipy.signal import step,TransferFunction
ks=np.unique(np.r_[np.arange(0,60.01,.5),224/27,16*np.sqrt(3)/9,16*np.sqrt(3)/9-1e-8,16*np.sqrt(3)/9+1e-8,47.999,48.001])
cases=[]
for k in ks:
 p=np.roots([1,6,8,k]);t=np.linspace(0,10,501)
 if k==0:y=np.zeros(len(t))
 else:_,y=step(TransferFunction([k],[1,6,8,k]),T=t)
 cases.append(dict(k=float(k),poles=[[float(q.real),float(q.imag)] for q in p],steps=y.tolist()))
locus=[[[float(q.real),float(q.imag)] for q in np.roots([1,6,8,i/10])] for i in range(601)]
print(json.dumps(dict(cases=cases,locus=locus)))
