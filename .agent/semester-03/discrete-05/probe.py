import numpy as np
import control as ct
from scipy.optimize import brentq
G=ct.tf([1],[1,1,0]); C=ct.tf([2,1],[1,0])
def digital(T): return ct.c2d(G,T,'zoh')*ct.c2d(C,T,'tustin')
def rho(L): return max(abs(ct.poles(ct.feedback(L,1))))
print('continuous PI gm,pm,wpc,wgc',ct.margin(G*C))
for T in [.01,.05,.1,.5,1,2]:
 L=digital(T); print('PI',T,rho(L),ct.margin(L))
print('PI crossing',brentq(lambda T:rho(digital(T))-1,.1,2))
G3=ct.tf([1],[1,3,2,0])
for gain in [10,1]:
 print('G3 continuous',gain,ct.poles(ct.feedback(gain*G3,1)))
 for T in [.01,.1,.5,1,2,3,4,5]: print('G3',gain,T,rho(ct.c2d(G3,T,'zoh')*gain))
print('G3 criticalK1',brentq(lambda T:rho(ct.c2d(G3,T,'zoh'))-1,5,20))
G2=ct.tf([10],[1,2,10]); Cf=ct.tf([5],[1])+ct.tf([2],[1,0])+ct.tf([.5,0],[.02,1])
print('PIDfiltered continuous',ct.margin(G2*Cf))
for T in [.01,.05,.1,.2]:
 L=ct.c2d(G2,T,'zoh')*ct.c2d(Cf,T,'tustin');print('PIDfiltered',T,ct.margin(L),rho(L))
Gq=ct.tf([1],[1,1]); Cq=ct.tf([2,.5],[1,0]); pm=ct.margin(Gq*Cq)[1]; wc=ct.margin(Gq*Cq)[3]
estimate=(20*np.pi/180)/wc
def qmargin(T): return ct.margin(ct.c2d(Gq,T,'zoh')*ct.c2d(Cq,T,'tustin'))[1]
exact=brentq(lambda T:pm-qmargin(T)-10,.001,.4)
print('Q3',wc,pm,estimate,qmargin(estimate),exact,qmargin(exact))
print('example roots',np.roots([1,-1.5,.7]),'q1b',np.roots([1,-1.5,.8,-.1]))

