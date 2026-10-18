import numpy as np, control as ct
from scipy.optimize import brentq
s=ct.tf('s')
def show(name,L):
 gm,pm,wpc,wgc=ct.margin(L);p=ct.poles(ct.feedback(L,1));print(name,'wc',wgc,'PM',pm,'RHP',sum(p.real>1e-8),'poles',p)
for name,L in [('lead40',40/(s*(s+2))),('lag60',60/(s*(s+1)*(s+2))),('ll1000',1000/(s*(s+1)*(s+10))),('motor500',500/(s*(s+5))),('Q2',400/(s*(s+4))),('Q4',250/(s*(s+1)*(s+5))),('Q8',1280/(s*(s+2)*(s+8)))]:show(name,L)
w=np.sqrt((-4+np.sqrt(16+4*(40*np.sqrt(5))**2))/2);T=1/(w*np.sqrt(5));print('lead40 T',T);show('lead corrected',40/(s*(s+2))*(1+5*T*s)/(1+T*s))
show('lag corrected',60/(s*(s+1)*(s+2))*(1+.0215*846*s)/(1+846*s))
a=12.;w=3.;z=.3;A=abs(ct.evalfr(1000/(s*(s+1)*(s+10)),1j*w))*np.sqrt(a);b=w/(z*np.sqrt((1+(w/z)**2)*A*A-1));t2=1/(z*b);t1=1/(w*np.sqrt(a));print('LL a,T1,b,T2',a,t1,b,t2);show('LL corrected',1000/(s*(s+1)*(s+10))*(1+a*t1*s)/(1+t1*s)*(1+b*t2*s)/(1+t2*s))
for k,p,a in [(500,5,6.5),(400,4,7)]:
 w=np.sqrt((-p*p+np.sqrt(p**4+4*k*k*a))/2);t=1/(w*np.sqrt(a));print('lead params',k,p,a,w,t);show('corrected',k/(s*(s+p))*(1+a*t*s)/(1+t*s))
for k,p,q,w in [(250,1,5,.5),(1280,2,8,1),(3200,2,8,1)]:
 P=k/(s*(s+p)*(s+q));z=w/10;A=abs(ct.evalfr(P,1j*w));b=w/(z*np.sqrt((1+(w/z)**2)*A*A-1));t=1/(z*b);print('Qlag',k,'beta,T',b,t);show('Qlag corrected',P*(1+b*t*s)/(1+t*s))
