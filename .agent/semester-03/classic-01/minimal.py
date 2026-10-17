import numpy as np
from scipy.linalg import expm
from scipy.integrate import solve_ivp
m=250.;k=16000.;y0=.05
for z in [0,.3,1,2]:
 c=2*z*np.sqrt(m*k);A=np.array([[0,1],[-k/m,-c/m]])
 for t in [1,3]:
  y,v=expm(A*t)@np.array([y0,0.]);E=.5*m*v*v+.5*k*y*y
  print('free z/c/t/y/v/E:',z,c,t,y,v,E)
for L in [.001,.01,.1]:
 R=1.;J=.01;B=.1;K=.1;A=np.array([[-R/L,-K/L],[K/J,-B/J]])
 t=np.linspace(0,1,601);ss=np.linalg.solve(-A,np.array([1/L,0.]));full=np.array([ss-expm(A*x)@ss for x in t]);red=(K/(R*B+K*K))*(1-np.exp(-(B+K*K/R)*t/J))
 print('motor L/poles/ss/maxerr/final:',L,np.linalg.eigvals(A),ss,np.max(abs(full[:,1]-red)),full[-1],red[-1])
S=1361.;a=.3;sig=5.67e-8;C=1e8;Te=(S*(1-a)/(4*sig))**.25
print('radiation Te/tauyear/epsilon1pct:',Te,C/(4*sig*Te**3)/(365.25*86400),Te*((1/.99)**.25-1))
print('tau at 288 year:',C/(4*sig*288**3)/(365.25*86400))
print('SIS r,R0,Istar,derivativeN:',.0002*10000-.1,.0002*10000/.1,10000-.1/.0002,-.1*10000)
