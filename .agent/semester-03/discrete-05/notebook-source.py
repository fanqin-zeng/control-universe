# %% SETUP
import numpy as np
import control as ctrl
import matplotlib.pyplot as plt
from scipy.optimize import brentq
from scipy.linalg import solve_discrete_lyapunov
plt.rcParams['font.sans-serif']=['DejaVu Sans']
plt.rcParams['axes.unicode_minus']=False

def root_radius(loop):
    return float(np.max(np.abs(ctrl.poles(ctrl.feedback(loop,1)))))

def phase_margin(loop):
    # One gain crossover in the course examples; exclude DC and Nyquist endpoints.
    upper=np.pi/loop.dt*(1-1e-8) if loop.dt else 1e4
    grid=np.geomspace(1e-5,upper,2500)
    points=np.exp(1j*grid*loop.dt) if loop.dt else 1j*grid
    logs=np.log(np.abs(loop(points)))
    brackets=np.where(logs[:-1]*logs[1:]<0)[0]
    if len(brackets)==0: return float('nan'),float('nan')
    if len(brackets)!=1: raise ValueError('Multiple crossovers require individual analysis')
    j=int(brackets[0])
    def H(w): return complex(loop(np.exp(1j*w*loop.dt) if loop.dt else 1j*w))
    wc=brentq(lambda w:np.log(abs(H(w))),grid[j],grid[j+1],xtol=1e-12)
    phases=np.unwrap(np.angle(loop(points)))*180/np.pi
    if phases[0]>0: phases=phases-360
    nearby=np.interp(np.log(wc),np.log(grid),phases)
    angle=np.angle(H(wc),deg=True)
    angle+=360*round((nearby-angle)/360)
    return float(180+angle),float(wc)

def jury(coeff):
    a=np.array(coeff,dtype=float);a=a/a[0]
    while len(a)>1:
        if abs(a[-1])>=a[0]: return False
        a=(a[0]*a-a[-1]*a[::-1])[:-1]
        a=a/a[0]
    return True

# %% CELL1
cases=[[1,-1.5,.7],[1,-2,.9],[1,-2.1,.9],[1,.5,.5]]
rows=[]
for coeff in cases:
    a0,a1,a2=coeff; roots=np.roots(coeff)
    wcoeff=[a0+a1+a2,2*a0-2*a2,a0-a1+a2]
    # A common sign is enough; multiply a polynomial by -1 if needed.
    wstable=all(x>0 for x in wcoeff) or all(x<0 for x in wcoeff)
    rows.append([jury(coeff),wstable,bool(np.all(abs(roots)<1)),max(abs(roots))])
print('Jury,w-Routh,roots,radius:',[[*r[:3],round(r[3],9)] for r in rows])
print('default roots:',[[round(float(x.real),9),round(float(x.imag),9)] for x in np.roots(cases[0])])
ca0,ca1,ca2=cases[0]
print('default Jury:',np.round([ca0+ca1+ca2,ca0-ca1+ca2,ca0-abs(ca2)],9).tolist())
a1,a2=np.meshgrid(np.linspace(-3,3,151),np.linspace(-1.5,1.5,151))
stable=(1+a1+a2>0)&(1-a1+a2>0)&(abs(a2)<1)
fig,ax=plt.subplots(figsize=(7,5))
ax.contourf(a1,a2,stable.astype(int),levels=[-.5,.5,1.5],colors=['#fee2e2','#bbf7d0'])
ax.plot([-2,0,2,-2],[1,-1,1,1],'k-',label='strict interior only')
for a0,x,y in cases:ax.plot(x,y,'ko')
ax.set(xlim=(-3,3),ylim=(-1.5,1.5),xlabel='a1',ylabel='a2',title='P(z) = z^2 + a1 z + a2')
ax.legend();ax.grid();plt.tight_layout();plt.show()

# %% CELL2
G=ctrl.tf([1],[1,1,0]);C=ctrl.tf([2,1],[1,0]);Lc=G*C
def digital(T):return ctrl.c2d(G,T,method='zoh')*ctrl.c2d(C,T,method='tustin')
pmc,wcc=phase_margin(Lc)
periods=[.01,.05,.1,.5,1.,2.]
metrics=[];responses=[]
fig,axes=plt.subplots(2,2,figsize=(12,9))
tc=np.linspace(0,30,601);axes[0,0].plot(tc,ctrl.step_response(ctrl.feedback(Lc,1),T=tc).outputs,label='continuous')
for T in periods:
    L=digital(T);pm,wc=phase_margin(L);rho=root_radius(L)
    metrics.append([T,rho,pm,wc]);t=np.arange(int(30/T)+1)*T
    y=ctrl.step_response(ctrl.feedback(L,1),T=t).outputs;responses.append([t.tolist(),y.tolist()])
    axes[0,0].plot(t,y,label=f'T={T:g}')
scan=np.linspace(.01,3,100);sweep=[]
for T in scan:
    L=digital(T);pm,_=phase_margin(L);sweep.append(pm)
axes[0,1].plot(scan,sweep,label='digital');axes[0,1].plot(scan,pmc-wcc*scan/2*180/np.pi,'--',label='half-sample estimate')
axes[1,1].plot(scan,np.array(sweep)-(pmc-wcc*scan/2*180/np.pi))
circle=np.exp(1j*np.linspace(0,2*np.pi,201));axes[1,0].plot(circle.real,circle.imag,'k--')
pole_scan=np.linspace(.01,3,50)
for T in pole_scan:
    p=ctrl.poles(ctrl.feedback(digital(T),1));axes[1,0].plot(p.real,p.imag,'.',color='green' if max(abs(p))<1 else 'red')
critical=brentq(lambda T:root_radius(digital(T))-1,.1,1.,xtol=1e-12)
print('PI continuous PM,wgc:',round(pmc,9),round(wcc,9))
print('PI T,radius,PM,wgc:',np.round(metrics,9).tolist())
print('PI first crossing:',round(critical,9),'estimate:',round(2*pmc*np.pi/180/wcc,9))
axes[0,0].set(xlim=(0,30),ylim=(-2,4),xlabel='time (s)',ylabel='output');axes[0,0].legend(fontsize=7)
axes[0,1].set(xlim=(0,3),ylim=(-100,40),xlabel='Ts (s)',ylabel='PM (deg)');axes[0,1].legend()
axes[1,0].set(xlim=(-2,2),ylim=(-2,2),xlabel='Re(z)',ylabel='Im(z)');axes[1,0].set_aspect('equal')
axes[1,1].set(xlim=(0,3),ylim=(-5,80),xlabel='Ts (s)',ylabel='actual minus estimate (deg)')
for ax in axes.flat:ax.grid()
plt.tight_layout();plt.show()

# %% CELL3
G3=ctrl.tf([1],[1,3,2,0])
continuous10=ctrl.poles(ctrl.feedback(10*G3,1))
oldscan=np.linspace(.1,2,50)
oldradii=[root_radius(10*ctrl.c2d(G3,T,method='zoh')) for T in oldscan]
print('K10 continuous roots:',[[round(float(p.real),9),round(float(p.imag),9)] for p in continuous10])
print('K10 original scan radius range:',round(min(oldradii),9),round(max(oldradii),9))
boundary=brentq(lambda T:root_radius(ctrl.c2d(G3,T,method='zoh'))-1,5,10,xtol=1e-12)
scenarios=[.5*boundary,boundary,1.5*boundary];newradii=[]
fig,axes=plt.subplots(1,2,figsize=(11,4))
circle=np.exp(1j*np.linspace(0,2*np.pi,201));axes[1].plot(circle.real,circle.imag,'k--')
for T in scenarios:
    L=ctrl.c2d(G3,T,method='zoh');closed=ctrl.feedback(L,1);p=ctrl.poles(closed);newradii.append(float(max(abs(p))))
    t=np.arange(41)*T;y=ctrl.step_response(closed,T=t).outputs
    axes[0].plot(t,y,'o-',markersize=2,label=f'K=1, Ts={T:.3f}')
    axes[1].plot(p.real,p.imag,'o',label=f'Ts={T:.3f}')
print('K1 crossing:',round(boundary,9),'radii:',np.round(newradii,9).tolist())
axes[0].set(xlim=(0,420),ylim=(-4,6),xlabel='time (s)',ylabel='output (outside limits may grow)')
axes[1].set(xlim=(-3,3),ylim=(-3,3),xlabel='Re(z)',ylabel='Im(z)');axes[1].set_aspect('equal')
for ax in axes:ax.grid();ax.legend(fontsize=7)
plt.tight_layout();plt.show()

# %% CELL4
G2=ctrl.tf([10],[1,2,10])
# Keep the original Kp/Ki/Kd; make derivative realizable, tau_f=0.02 s.
Cf=ctrl.tf([5],[1])+ctrl.tf([2],[1,0])+ctrl.tf([.5,0],[.02,1])
Lcont=G2*Cf;gm0,pm0,wpc0,wgc0=ctrl.margin(Lcont)
filtered=[];curves=[]
fig,axes=plt.subplots(1,3,figsize=(14,4))
w0=np.geomspace(.01,100,700);H0=Lcont(1j*w0)
axes[0].plot(H0.real,H0.imag,label='continuous filtered PID')
for T in [.01,.05,.1,.2]:
    Gd=ctrl.c2d(G2,T,method='zoh');Cd=ctrl.c2d(Cf,T,method='tustin');L=Gd*Cd
    gm,pm,_,wpc,wgc,_=ctrl.stability_margins(L,method='frd');pmi,wci=phase_margin(L)
    assert abs(pm-pmi)<1e-5 and abs(wgc-wci)<1e-5
    filtered.append([T,gm,pm,wpc,wgc,root_radius(L)])
    w=np.geomspace(.01,np.pi/T*(1-1e-6),700);zz=np.exp(1j*w*T)
    # Evaluate factors separately to reduce cancellation near z=1.
    H=Gd(zz)*Cd(zz);curves.append([w.tolist(),H.real.tolist(),H.imag.tolist()])
    axes[0].plot(H.real,H.imag,label=f'T={T:g}')
    axes[1].semilogx(w,20*np.log10(abs(H)),label=f'T={T:g}')
    axes[2].semilogx(w,np.unwrap(np.angle(H))*180/np.pi,label=f'T={T:g}')
print('filtered continuous gm,PM,wpc,wgc:',float(gm0),round(pm0,9),float(wpc0),round(wgc0,9))
print('filtered T,gm,PM,wpc,wgc,radius:',np.round(filtered,9).tolist())
axes[0].plot(-1,0,'rx');axes[0].set(xlim=(-3,3),ylim=(-3,3),xlabel='Re(L)',ylabel='Im(L)')
axes[1].set(xlim=(.01,400),ylim=(-80,70),xlabel='omega (rad/s)',ylabel='magnitude (dB)')
axes[2].set(xlim=(.01,400),ylim=(-300,0),xlabel='omega (rad/s)',ylabel='phase (deg)')
for ax in axes:ax.grid();ax.legend(fontsize=7)
plt.tight_layout();plt.show()

# %% CELL5
import sympy as sp
z,w=sp.symbols('z w')
example=[1,-sp.Rational(3,2),sp.Rational(7,10)]
P=sum(a*z**(2-i) for i,a in enumerate(example))
transformed=sp.cancel((w-1)**2*P.subs(z,(w+1)/(w-1)))
assert sp.expand(transformed-(w*w/5+3*w/5+sp.Rational(16,5)))==0
print('w polynomial:',sp.expand(transformed))
print('w roots:',[[round(float(complex(x).real),9),round(float(complex(x).imag),9)] for x in sp.nroots(transformed)])
q1a=np.roots([1,.5,-.6]);q1b=np.roots([1,-1.5,.8,-.1])
print('Q1a roots:',np.round(q1a,9).tolist(),'stable:',jury([1,.5,-.6]))
print('Q1b roots:',[[round(float(x.real),9),round(float(x.imag),9)] for x in q1b],'stable:',jury([1,-1.5,.8,-.1]))
q2=np.roots([1,-1.8,.9]);print('Q2 roots:',[[round(float(x.real),9),round(float(x.imag),9)] for x in q2],'radius:',round(np.sqrt(.9),9))
# Schur-Cohn Hermitian form for the same real polynomial.
A=np.array([[1.,0],[-1.5,1.]]);B=np.array([[.7,0],[-1.5,.7]])
H=A@A.T-B@B.T;print('Schur-Cohn H:',H.tolist(),'leading minors:',[round(H[0,0],9),round(np.linalg.det(H),9)])
state=np.array([[1.5,-.7],[1.,0.]])
Ply=solve_discrete_lyapunov(state.T,np.eye(2))
residual=state.T@Ply@state-Ply+np.eye(2)
print('Lyapunov P:',np.round(Ply,9).tolist(),'min eigenvalue:',round(min(np.linalg.eigvalsh(Ply)),9),'residual:',round(np.max(abs(residual)),12))
unit5=np.linalg.matrix_power(np.eye(2),5)@np.array([0.,1.])
jordan5=np.linalg.matrix_power(np.array([[1.,1.],[0.,1.]]),5)@np.array([0.,1.])
print('unit mode and Jordan k5:',int(unit5[1]),int(jordan5[0]))

# %% CELL6
Gq=ctrl.tf([1],[1,1]);Cq=ctrl.tf([2,.5],[1,0]);Lq=Gq*Cq
pmq,wcq=phase_margin(Lq)
estimate=20*np.pi/180/wcq
def qloop(T):return ctrl.c2d(Gq,T,method='zoh')*ctrl.c2d(Cq,T,method='tustin')
def loss(T):return pmq-phase_margin(qloop(T))[0]
limit=brentq(lambda T:loss(T)-10,.001,.4,xtol=1e-12)
print('Q3 wgc,continuous PM,estimated Ts:',round(wcq,9),round(pmq,9),round(estimate,9))
print('Q3 exact first limit,loss at estimate:',round(limit,9),round(loss(estimate),9))
print('Q3 loss at .19,.20:',round(loss(.19),9),round(loss(.2),9))
gains=[-1.,-.5,0.,1.,1.5,2.]
print('Q4 K,root,strict:',[[K,.5-K,abs(.5-K)<1] for K in gains])
print('unit-circle step of 1/(z-1):',np.arange(6).tolist())
