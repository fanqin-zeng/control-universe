import numpy as np,control as ct
from scipy.optimize import brentq
s=ct.tf('s');G=1000/(s*s+100.1*s+110)
Cs={'P':ct.tf([50],[1]),'PI':(10.24*s+11.26)/s,'PIDideal':(.3*s*s+5*s+5.5)/s,'PIDf':5+5.5/s+.3*s/(1+.001*s),'Lead':50*(1+.00644*s)/(1+.00167*s)}
print('plant',ct.poles(G),ct.dcgain(G))
for n,C in Cs.items():
 T=ct.feedback(C*G);t=np.arange(30001)/10000;_,y=ct.step_response(T,t);idx=np.where(abs(y-1)>.02)[0]
 print(n,'roots',ct.poles(T),'PM/wc',ct.margin(C*G)[1::2],'DC',ct.dcgain(T),'peakaboveTarget%',max(0,(max(y)-1)*100),'gridTs',t[idx[-1]+1] if len(idx) and idx[-1]<len(t)-1 else None,'CS10000',abs(ct.evalfr(ct.feedback(C,G),10000j)))
print('PIalt',ct.margin((2*s+2.2)/s*G)[1::2])
# Q1/2/5/8/10 and discrete Q9
for J in [.03]:
 P=.1/(.01*J*s*s+(.01*.001+J)*s+.011);ps=np.sort(-ct.poles(P).real);zi=ps[0];wc=30;kp=abs(1/ct.evalfr((s+zi)/s*P,1j*wc));print('Q1',ct.poles(P),ct.margin(50*P)[1::2],'PI',kp,kp*zi,ct.margin(kp*(s+zi)/s*P)[1::2])
zi=min(-ct.poles(G).real);kp=abs(1/ct.evalfr((s+zi)/s*G,55j));print('Q2',kp,kp*zi,ct.margin(kp*(s+zi)/s*G)[1::2])
Pr=.1/(.0001*s*s+.01301*s+.0113);print('Q5',ct.poles(Pr),ct.margin(Cs['Lead']*Pr)[1::2])
print('Q8',np.roots([1,100.1,5110,25000]))
for fs in [500,5000]:
 Cz=ct.sample_system(Cs['Lead'],1/fs,method='tustin');Pz=ct.sample_system(G,1/fs,method='zoh');print('Q9',fs,Cz.num,Cz.den,ct.margin(Cz*Pz)[1::2],ct.poles(ct.feedback(Cz*Pz)))
P10=5/((s+2)*(s+20));zi=2;wc=10;kp=abs(1/ct.evalfr((s+zi)/s*P10,1j*wc));print('Q10 PI',kp,kp*zi,ct.margin(kp*(s+zi)/s*P10)[1::2],ct.step_info(ct.feedback(kp*(s+zi)/s*P10)))
for p in [.0002,.000208]:
 C7=1250/s*(1+s)/(1+s/5)*(1+s/.01)/(1+s/p);P7=10/((s+1)*(s+5)*(s+50));print('Q7alternative',p,ct.margin(C7*P7),ct.poles(ct.feedback(C7*P7)))
