from reference import metrics
import numpy as np
from scipy.signal import TransferFunction,step
print('first tr,ts2,ts5',.5*np.log(9),-.5*np.log(.02),-.5*np.log(.05))
for z in [.3,.5,.707,1.,2.]:
    print('zeta',z,'standard',metrics(z,8),'road',metrics(z,8,True))
for wn in [4/.7/2,4/.7/2*1.12,3.2]:
    print('reverse design .7',wn,metrics(.7,wn))
for p in [5,10,20]:
    t=np.linspace(0,8,8001)
    _,full=step(TransferFunction([10*p],np.polymul([1,p],[1,2,10])),T=t)
    _,approx=step(TransferFunction([10],[1,2,10]),T=t)
    print('dominant',p,'maxabs',max(abs(full-approx)))
z=-np.log(.16)/np.sqrt(np.pi**2+np.log(.16)**2);wn=np.pi/(.5*np.sqrt(1-z*z))
print('identification Q6',z,wn,metrics(z,wn))
print('Q2',metrics(.4,6));print('Q4',metrics(1/np.sqrt(10),np.sqrt(10)))
print('Q9 impulse peak',np.arccos(.4)/(5*np.sqrt(1-.4**2)),'step peak',np.pi/(5*np.sqrt(1-.4**2)))
