import numpy as np
from scipy.optimize import brentq
for z in [.3,.5,.707,1]:
 wb=np.sqrt(1-2*z*z+np.sqrt((1-2*z*z)**2+1))
 def y(t):
  if z<1:return 1-np.exp(-z*t)/np.sqrt(1-z*z)*np.sin(np.sqrt(1-z*z)*t+np.arccos(z))
  return 1-(1+t)*np.exp(-t)
 end=np.pi/np.sqrt(1-z*z) if z<1 else 20
 tr=brentq(lambda t:y(t)-.9,0,end)-brentq(lambda t:y(t)-.1,0,end)
 wr=np.sqrt(2/(1+np.sqrt(1+8*z*z)))
 mr=np.sqrt((1+4*z*z*wr*wr)/((1-wr*wr)**2+4*z*z*wr*wr))
 print('z, tr10-90*wn, wb/wn, product, roadwr/wn, roadpeakdb',z,tr,wb,tr*wb,wr,20*np.log10(mr))
print('GM10',20*np.log10(126/10),'crossing',-10/126)
