import numpy as np,control as ct
from scipy.optimize import brentq
s=ct.tf('s');G=1/(s+1);a=(3-np.sqrt(5))/2;b=(3+np.sqrt(5))/2;c=(np.sqrt(5)-1)/(2*np.sqrt(5));d=1-c
errors={'P4':lambda t:.2+.8*np.exp(-5*t),'PI11':lambda t:np.exp(-t),'PI21':lambda t:c*np.exp(-a*t)+d*np.exp(-b*t)}
for name,C in [('P4',4),('PI11',1+1/s),('PI21',2+1/s)]:
 T=ct.feedback(C*G);U=ct.feedback(C,G);print(name,'T,U',T,U,'closed roots',ct.poles(T));print(name,'PM/wc',ct.margin(C*G)[1::2]);print(name,'DC',ct.dcgain(T),'noiseT,CS@100',abs(ct.evalfr(T,100j)),abs(ct.evalfr(U,100j)))
 e=errors[name];rise=None if name=='P4' else brentq(lambda t:e(t)-.1,0,30)-brentq(lambda t:e(t)-.9,0,30);print(name,'rise target .1 to .9',rise)
 for A,eps,limit,deadline in [(1,.02,3,8),(.25,.06,1.2,2),(1,.02,1.5,8),(1,.02,.5,8)]:
  residual=A*(.2 if name=='P4' else 0);ts=None if eps<=residual else brentq(lambda t:A*e(t)-eps,0,100);peak=A*{'P4':4,'PI11':1,'PI21':2}[name];print('contract',name,A,eps,limit,deadline,'ts',ts,'upeak',peak,'pass',ts is not None and ts<=deadline and peak<=limit)
print('PI21 a,b,c,d',a,b,c,d)
for Tp in [.5,1,2]:print('plant variation',Tp,ct.poles(ct.feedback((1+1/s)/(Tp*s+1))))
