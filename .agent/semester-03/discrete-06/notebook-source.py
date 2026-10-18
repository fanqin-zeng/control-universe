# %% SETUP
import numpy as np
import control as ctrl
import matplotlib.pyplot as plt
from scipy.optimize import brentq
import json
plt.rcParams['font.sans-serif']=['DejaVu Sans']
plt.rcParams['axes.unicode_minus']=False

def matched_pi(kp,ki,T,wref=1.):
    q=np.exp(-ki/kp*T);zref=np.exp(1j*wref*T)
    gain=abs(kp+ki/(1j*wref))*abs(zref-1)/abs(zref-q)
    return ctrl.tf([gain,-gain*q],[1.,-1.],T),float(q),float(gain)

def motor(T,kp=.005,ki=.05,gain=1000.,rate=10.):
    G=ctrl.tf([gain],[1.,rate]);C=ctrl.tf([kp,ki],[1.,0.])
    Gd=ctrl.c2d(G,T,method='zoh');Cd=ctrl.c2d(C,T,method='tustin')
    return G,C,Gd,Cd,ctrl.feedback(Gd*Cd,1)

def crossover(Gd,Cd,T):
    def H(w):return complex(Gd(np.exp(1j*w*T))*Cd(np.exp(1j*w*T)))
    grid=np.geomspace(1e-4,np.pi/T*(1-1e-8),1000)
    f=np.log([abs(H(w)) for w in grid]);cross=np.where(f[:-1]*f[1:]<0)[0]
    if len(cross)!=1:raise ValueError('Expected one gain crossover')
    i=int(cross[0]);wc=brentq(lambda w:np.log(abs(H(w))),grid[i],grid[i+1],xtol=1e-12)
    return float(180+np.angle(H(wc),deg=True)),float(wc)

def bandwidth(closed,T):
    dc=float(np.real(closed(1)))
    return float(brentq(lambda w:abs(complex(closed(np.exp(1j*w*T))))-dc/np.sqrt(2),1e-5,np.pi/T*(1-1e-8),xtol=1e-12))

def aw_run(umax,release,kb,T=.01):
    # I[k] is known before u[k]; tracking adjusts I[k+1], no algebraic loop.
    N=int(5/T);p=np.exp(-10*T);b=100*(1-p)
    y=np.zeros(N+1);integ=np.zeros(N+1);raw=np.zeros(N);applied=np.zeros(N);ref=np.zeros(N)
    for k in range(N):
        ref[k]=100. if not release or k*T<2.5 else 0.
        error=ref[k]-y[k];raw[k]=.005*error+integ[k]
        applied[k]=np.clip(raw[k],-umax,umax)
        integ[k+1]=integ[k]+T*(.05*error+kb*(applied[k]-raw[k]))
        y[k+1]=p*y[k]+b*applied[k]
    return y,integ,raw,applied,ref

# %% CELL1
kp,ki,T=.005,.05,.01
C=ctrl.tf([kp,ki],[1.,0.])
cm,q,gain=matched_pi(kp,ki,T)
methods=[ctrl.c2d(C,T,method=m) for m in ['euler','backward_diff','tustin']]+[cm]
labels=['forward Euler','backward Euler','Tustin','matched magnitude at 1 rad/s']
omega=np.geomspace(.1,.95*np.pi/T,500);zc=np.exp(1j*omega*T)
curves=[np.asarray(D(zc)) for D in methods]
metrics=[]
for w in [.1,1.,5.,50.]:
    reference=complex(C(1j*w));row=[]
    for D in methods:
        H=complex(D(np.exp(1j*w*T)))
        row.append([100*(abs(H)/abs(reference)-1),float(np.angle(H/reference,deg=True))])
    metrics.append(row)
print('PI matched q,gain:',round(q,12),round(gain,12))
print('PI coefficients:',[np.round(D.num[0][0],12).tolist() for D in methods])
print('frequency rows .1,1,5,50; magnitude%,phase deg:',np.round(metrics,9).tolist())
fig,axes=plt.subplots(1,2,figsize=(11,4))
for name,H in zip(labels,curves):
    axes[0].semilogx(omega,20*np.log10(abs(H)),label=name)
    axes[1].semilogx(omega,np.angle(H,deg=True),label=name)
axes[0].semilogx(omega,20*np.log10(abs(C(1j*omega))),'k--',label='continuous')
axes[1].semilogx(omega,np.angle(C(1j*omega),deg=True),'k--',label='continuous')
axes[0].set(xlim=(.1,320),ylim=(-70,0),xlabel='omega (rad/s)',ylabel='magnitude (dB)')
axes[1].set(xlim=(.1,320),ylim=(-100,10),xlabel='omega (rad/s)',ylabel='phase (deg)')
for ax in axes:ax.grid();ax.legend(fontsize=7)
plt.tight_layout();plt.show()

# %% CELL2
scenarios=[(50.,False),(.6,False),(.6,True)]
aw=[];summary=[]
fig,axes=plt.subplots(3,3,figsize=(13,10))
for col,(umax,release) in enumerate(scenarios):
    pairs=[];rows=[]
    for kb in [0.,10.]:
        y,I,raw,us,r=aw_run(umax,release,kb);pairs.append([y.tolist(),I.tolist(),raw.tolist(),us.tolist(),r.tolist()])
        rows.append([float(np.max(y)),float(np.max(abs(I))),int(np.count_nonzero(abs(raw-us)>1e-12)),float(y[-1])])
        time=np.arange(len(y))*.01;label=f'Kb={kb:g}/s'
        axes[0,col].plot(time,y,label=label);axes[1,col].plot(time[:-1],us,label=label);axes[2,col].plot(time,I,label=label)
    aw.append(pairs);summary.append(rows)
    axes[0,col].set_title(f'limit={umax:g} V; '+('release at 2.5 s' if release else 'constant target'))
    for row in range(3):axes[row,col].set_xlim(0,5);axes[row,col].grid();axes[row,col].legend(fontsize=7)
    axes[0,col].set_ylim(-10,130);axes[1,col].set_ylim(-1.5,1.5);axes[2,col].set_ylim(-1,15)
    axes[2,col].set_xlabel('time (s)')
for row,name in enumerate(['speed (rpm)','applied voltage (V)','integral output (V)']):axes[row,0].set_ylabel(name)
print('AW rows baseline/unreachable/release, each no-AW then AW: peak,maxI,saturated steps,final y:',np.round(summary,9).tolist())
print('original unsaturated max difference:',round(np.max(abs(np.array(aw[0][0][0])-np.array(aw[0][1][0]))),12))
plt.tight_layout();plt.show()

# %% CELL3
T=.01;G,C,Gd,Cd,Td=motor(T);Tc=ctrl.feedback(G*C,1)
t=np.arange(301)*T;y_cont=ctrl.step_response(Tc,T=t).outputs;y_disc=ctrl.step_response(Td,T=t).outputs
assert np.max(abs(y_cont-(1-np.exp(-5*t))))<1e-10
first90_cont=float(np.log(10)/5);first90_disc=float(t[np.flatnonzero(y_disc>=.9)[0]])
pm,wc=crossover(Gd,Cd,T);bw=bandwidth(Td,T)
motor_metrics=[pm,wc,bw,first90_cont,first90_disc,float(np.max(abs(y_disc-y_cont)))]
print('motor Cd numerator:',np.round(Cd.num[0][0],12).tolist())
print('motor PM,wgc,bandwidth,t90 continuous exact,t90 sampled,max error:',np.round(motor_metrics,9).tolist())
fig,axes=plt.subplots(1,2,figsize=(10,4));axes[0].plot(t,y_cont,label='continuous');axes[0].plot(t,y_disc,'--',label='digital')
axes[1].plot(t,y_disc-y_cont)
axes[0].set(xlim=(0,3),ylim=(0,1.2),xlabel='time (s)',ylabel='unit response');axes[0].legend()
axes[1].set(xlim=(0,3),ylim=(-.03,.03),xlabel='time (s)',ylabel='digital minus continuous')
for ax in axes:ax.grid()
plt.tight_layout();plt.show()

# %% CELL4
periods=[.001,.005,.01,.02,.05,.1];sweep=[];responses=[];freq_curves=[]
fig,axes=plt.subplots(1,3,figsize=(14,4))
for T in periods:
    G,C,Gd,Cd,Td=motor(T);t=np.arange(int(round(3/T))+1)*T;y=ctrl.step_response(Td,T=t).outputs
    pm,wc=crossover(Gd,Cd,T);bw=bandwidth(Td,T);roots=ctrl.poles(Td)
    sweep.append([T,float(max(abs(roots))),pm,wc,bw,float(t[np.flatnonzero(y>=.9)[0]]),float(max(0,np.max(y)-1)*100)])
    responses.append([t.tolist(),y.tolist()]);w=np.geomspace(.1,.95*np.pi/T,500);zz=np.exp(1j*w*T);H=Gd(zz)*Cd(zz)
    freq_curves.append([w.tolist(),H.real.tolist(),H.imag.tolist()])
    axes[0].plot(t,y,label=f'T={T:g}');axes[1].semilogx(w,20*np.log10(abs(H)),label=f'T={T:g}');axes[2].semilogx(w,np.angle(H,deg=True),label=f'T={T:g}')
print('motor T,radius,PM,wgc,bandwidth,first90,overshoot%:',np.round(sweep,9).tolist())
axes[0].set(xlim=(0,3),ylim=(0,1.2),xlabel='time (s)',ylabel='unit response')
axes[1].set(xlim=(.1,3500),ylim=(-80,40),xlabel='omega (rad/s)',ylabel='magnitude (dB)')
axes[2].set(xlim=(.1,3500),ylim=(-180,0),xlabel='omega (rad/s)',ylabel='phase (deg)')
for ax in axes:ax.grid();ax.legend(fontsize=7)
plt.tight_layout();plt.show()

# %% CELL5
import sympy as sp
z,s=sp.symbols('z s')
T=.05;kp=2.;ki=.5
Q1=[ctrl.c2d(ctrl.tf([kp,ki],[1,0]),T,method=m) for m in ['euler','backward_diff','tustin']]
qm,qzero,qgain=matched_pi(kp,ki,T);Q1.append(qm)
print('Q1 numerators:',[np.round(D.num[0][0],12).tolist() for D in Q1],'denominator:',[1,-1])
T=.1;w0=2.;kappa=w0/np.tan(w0*T/2);warped=2/T*np.tan(w0*T/2)
Q2=ctrl.c2d(ctrl.tf([10.,20.],[1,0]),T,method='tustin',prewarp_frequency=w0)
q2error=abs(complex(Q2(np.exp(1j*w0*T)))-(10+20/(1j*w0)))
print('Q2 warped frequency,kappa:',round(warped,12),round(kappa,12),'numerator:',np.round(Q2.num[0][0],12).tolist(),'target error:',round(q2error,12))
print('reverse frequency ratios:',[round(np.tan(x/2)/(x/2),9) for x in [.1,.3,.5,1.,np.pi/2]])
alpha=1/(1+20*.01);beta=.1*20/(1+20*.01)
print('derivative alpha,beta,Nyquist gain:',round(alpha,9),round(beta,9),round(2*beta/(1+alpha),9))
Q4=ctrl.c2d(ctrl.tf([.04,.2],[1,0]),.02,method='tustin')
print('Q4 numerator:',np.round(Q4.num[0][0],12).tolist())
_,_,Gq,Cq,Tq=motor(.02,.04,.2,250.,5.)
initial_bw=bandwidth(Tq,.02)
def target(kp):
    _,_,_,_,Q=motor(.02,kp,5*kp,250.,5.)
    return abs(complex(Q(np.exp(.2j))))-1/np.sqrt(2)
refined=brentq(target,.01,.05,xtol=1e-14)
_,_,_,Cqr,Tqr=motor(.02,refined,5*refined,250.,5.)
print('Q4 original bandwidth,refined Kp,Ki,bandwidth,radius:',np.round([initial_bw,refined,5*refined,bandwidth(Tqr,.02),max(abs(ctrl.poles(Tqr)))],12).tolist())
print('Q4 refined numerator:',np.round(Cqr.num[0][0],12).tolist())
for kb in [0.,10.,100.,250.]:
    p=1-.01*kb;print('Q3 Kb,pole:',kb,round(p,9))
print('fixed coefficients nearest:',[int(round(x*65536)) for x in [.00525,.00475]])
print('Q3 time constant:',round(-.01/np.log(.9),12))
print('mode default multipliers:',np.round([.9,1/1.1,.95/1.05,np.exp(-.1)],12).tolist())
