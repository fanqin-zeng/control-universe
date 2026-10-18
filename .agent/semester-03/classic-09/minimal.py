import numpy as np, control as ct
from scipy.optimize import brentq
s=ct.tf('s')
def info(name,L):
 gm,pm,wg,wc=ct.margin(L);print(name,'gm,pm,wg,wc',gm,pm,wg,wc,'poles',ct.poles(ct.feedback(L)))
for k in [1,10,100,110,200,1000]:info('K'+str(k),k/(s*(s+1)*(s+10)))
w=brentq(lambda w:np.arctan(w)+np.arctan(w/10)-np.pi/4,.1,2);k=w*np.sqrt(1+w*w)*np.sqrt(100+w*w);print('PM45 wc,K,Kv',w,k,k/10)
for z in [.5,1/np.sqrt(2),.59,.43,.3,1,1.5]:
 mr=1/(2*z*np.sqrt(1-z*z)) if z<1/np.sqrt(2) else 1;wr=10*np.sqrt(1-2*z*z) if z<1/np.sqrt(2) else 0;wb=10*np.sqrt(1-2*z*z+np.sqrt(2-4*z*z+4*z**4));mp=100*np.exp(-np.pi*z/np.sqrt(1-z*z)) if z<1 else 0;print('z,mr,db,wr,wb,mp',z,mr,20*np.log10(mr),wr,wb,mp)
w=np.sqrt((-1+np.sqrt(401))/2);pm=np.arctan(1/w)*180/np.pi;print('delay wc,pm0,limit,pm05',w,pm,pm*np.pi/(180*w),pm-w*.05*180/np.pi)
for k in [1,10,100,109,111,200]:
 roots=np.roots([-44,3*k-2222,202*k,100*k]);x=next(x.real for x in roots if abs(x.imag)<1e-7 and x.real>0);v=ct.evalfr(1/(1+k/(s*(s+1)*(s+10))),1j*np.sqrt(x));print('peak',k,np.sqrt(x),abs(v))
info('Q4',8/(s*(s+2)**2));info('Q9rhp',4*(1-.5*s)/((s+1)*(s+2)));info('Q9lhp',4*(1+.5*s)/((s+1)*(s+2)))
k=(1+np.tan(np.deg2rad(27))**2)**2.5;info('Q7',k/(s+1)**5);T=ct.feedback(k/(s+1)**5);print('Q7 stepinfo',ct.step_info(T,T=np.arange(30001)/1000))
print('Q8 wc,K',brentq(lambda w:np.arctan(w)+.5*w-3*np.pi/4,1,4),np.sqrt(1+brentq(lambda w:np.arctan(w)+.5*w-3*np.pi/4,1,4)**2));print('Q8 PM,limit',120-.5*np.sqrt(3)*180/np.pi,2*np.pi/(3*np.sqrt(3)))
tu=2*np.pi/np.sqrt(3);C=4.8*(1+1/((tu/2)*s)+(tu/8)*s);info('ZN',C/(s+1)**3)
for factor in [1,.5,.25]:info('ZNfactor'+str(factor),factor*C/(s+1)**3)
info('Q5originalG2',10*(s+5)/(s*(s+1)*(s+20)))
L=100000/(s*(s+10)*(s+100));info('Q11',L)
for w in [1,10]:v=ct.evalfr(1/(1+L),1j*w);print('Q11 S',w,abs(v),20*np.log10(abs(v)))
