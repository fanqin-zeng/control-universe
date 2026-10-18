import numpy as np
from scipy.signal import StateSpace, step
m,c,k=250.,2000.,16000.
wn=np.sqrt(k/m); z=c/(2*np.sqrt(m*k))
print('wn,zeta,poles',wn,z,np.roots([m,c,k]))
for w in [0,4,8,40]:
    g=1/(k-m*w*w+1j*c*w)
    print('omega, compliance m/N, normalized',w,abs(g),abs(k*g))
wr=wn*np.sqrt(1-2*z*z)
wc=wn*np.sqrt(1-2*z*z+np.sqrt((1-2*z*z)**2+1))
print('resonance/cutoff',wr,wc)
for damping in [.5,1,2]:
    a=np.array([[0,1],[-64,-16*damping]])
    t,y=step(StateSpace(a,[[0],[64]],[[1,0]],[[0]]),T=np.linspace(0,3,401))
    print('zeta,maxsample,last',damping,max(y),y[-1])
print('cancellation: u -> Ga -> v -> Gb -> y; d -> Gb; reverse d -> Ga')
