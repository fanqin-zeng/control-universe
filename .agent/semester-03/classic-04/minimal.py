import numpy as np
from scipy.optimize import brentq
for k in [1,2,5,10,15]:
 w=np.sqrt(-2+np.sqrt(4+k*k));exact=np.arctan2(2,w)/w;pade=(2-k+np.sqrt(k*k+4))/k
 print(k,w,exact,pade)
w=brentq(lambda w: w*w*(1+w*w)*(25+w*w)-100,.01,10)
print('bode',w,90-np.degrees(np.arctan(w)+np.arctan(w/5)),20*np.log10(3),np.sqrt(5),-2+np.sqrt(21)/3)
import sympy as sp
w,L=sp.symbols('w L',positive=True,real=True)
s=sp.I*w
inverse=-(2*s+2)/(s*s*(s+2))-L/s
positive=2*(w*w+2)/(w*w*(w*w+4))
assert sp.simplify(sp.re(inverse)-positive)==0
print('Re(1/(ds/dL)) at every imaginary crossing =',positive,'>0 for w>0')
