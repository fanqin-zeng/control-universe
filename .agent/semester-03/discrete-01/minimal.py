import numpy as np,control as ct
from scipy.signal import butter,freqs
from scipy.optimize import brentq
G=ct.tf([100],[1,10,100]);wb=brentq(lambda w:abs(ct.evalfr(G,1j*w))**2-.5,10,30)
print('secondorderbw',wb)
for fc in [400,50]:
 b,a=butter(2,2*np.pi*fc,analog=True)
 for f in [20,500,50/(2*np.pi)]:
  h=freqs(b,a,[2*np.pi*f])[1][0];print('filter',fc,f,-20*np.log10(abs(h)),np.angle(h)*180/np.pi)
print('speedq',2*(3000*2*np.pi/60)/4096,'zohphase',50*.001/2*180/np.pi)
G=ct.tf([1],[1,2,0]);K=ct.tf([.5,10,5],[1,0]);L=G*K;CL=ct.feedback(L,1)
wc=brentq(lambda w:abs(ct.evalfr(L,1j*w))-1,1,10);bw=brentq(lambda w:abs(ct.evalfr(CL,1j*w))**2-.5,1,20)
print('answer4wc,bw,loss',wc,bw,bw*.01/2*180/np.pi)
# old ideal derivative failed; implement filtered derivative with pole100rad/s.
Gm=ct.tf([1],[.01,.1,1]);s=ct.tf([1,0],[1]);Kf=5+10/s+.5*s/(1+s/100)
print('filteredK',Kf)
for Ts in [.001,.005,.01,.02,.05]:
 D=ct.feedback(ct.c2d(Gm,Ts,'zoh')*ct.c2d(Kf,Ts,'tustin'),1)
 print(Ts,max(abs(ct.poles(D))))
