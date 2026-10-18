# Canonical evaluated source is embedded in the MDX. This file assembles its four cells.
# %% setup-control
import numpy as np
import control as ctrl
import matplotlib.pyplot as plt
from scipy.optimize import brentq

G = ctrl.tf([100], [1, 2, 100])
# Explicitly filtered derivative; the former ideal derivative was improper.
C = ctrl.tf([5], [1]) + ctrl.tf([10], [1, 0]) + ctrl.tf([.5, 0], [.01, 1])
Lc = G * C
def margins(L, Ts=None):
    # Physical rad/s; discrete evaluation only on the unit circle, below Nyquist.
    w = np.geomspace(.001, 1e5 if Ts is None else np.pi/Ts*(1-1e-7), 3000)
    points = 1j*w if Ts is None else np.exp(1j*w*Ts)
    values = np.asarray(L(points)).reshape(-1)
    logmag = np.log(np.abs(values))
    phase = np.unwrap(np.angle(values))
    if phase[0] > 0: phase -= 2*np.pi
    result = []
    for i in np.where(logmag[:-1]*logmag[1:] < 0)[0]:
        def value(v):
            return complex(L(1j*v if Ts is None else np.exp(1j*v*Ts)))
        wc = brentq(lambda v: np.log(abs(value(v))), w[i], w[i+1], xtol=1e-12)
        p = np.angle(value(wc))
        p += 2*np.pi*round((np.interp(wc,w,phase)-p)/(2*np.pi))
        result.append([float(wc), float(180+np.degrees(p))])
    return result
def digital(Ts):
    return ctrl.c2d(ctrl.ss(G),Ts,method='zoh')*ctrl.c2d(ctrl.ss(C),Ts,method='tustin')
wc, pmc = margins(Lc)[0]
# %% response
Ts_values = [.001,.005,.01,.02,.05,.08,.1,.2]
response_metrics = []
response_curves = []
fig, axes = plt.subplots(1,2,figsize=(11,4))
tc = np.linspace(0,5,5001)
_, yc = ctrl.step_response(ctrl.feedback(Lc),tc)
axes[0].plot(tc,yc,'k--',label='continuous filtered PID')
theta=np.linspace(0,2*np.pi,201)
axes[1].plot(np.cos(theta),np.sin(theta),'k--')
for Ts in Ts_values:
    Ld=digital(Ts)
    closed=ctrl.feedback(Ld)
    poles=ctrl.poles(closed)
    t=np.arange(int(np.floor(5/Ts+1e-9))+1)*Ts
    _,y=ctrl.step_response(closed,t)
    y=np.asarray(y)
    rho=float(max(abs(poles)))
    crosses=margins(Ld,Ts)
    pm=min((v[1] for v in crosses), default=float("nan"))
    response_metrics.append([Ts,rho,pm,float(max(y)),float(y[-1]),float(t[-1])])
    response_curves.append(y.tolist())
    axes[0].plot(t,y,label=f'{Ts*1000:g} ms')
    axes[1].plot(poles.real,poles.imag,'o',label=f'{Ts*1000:g} ms')
    pm_text=f'{pm:.6f}deg' if np.isfinite(pm) else 'no unity-gain crossing'
    print(f'Ts={Ts*1000:6.1f}ms rho={rho:.9f} PM={pm_text} sample_peak={max(y):.6g} y({t[-1]:g}s)={y[-1]:.6g}; crossings={len(crosses)}')
axes[0].set(xlabel='t (s)',ylabel='sampled y',xlim=(0,5),ylim=(-2,4))
axes[0].set_title('Unstable responses may leave the displayed y range')
axes[1].set(xlabel='Re(z)',ylabel='Im(z)',xlim=(-1.5,1.5),ylim=(-1.5,1.5))
axes[1].set_aspect('equal')
for ax in axes: ax.grid(); ax.legend(fontsize=7)
plt.tight_layout(); plt.show()
print(f'continuous filtered PID: wc={wc:.9f}rad/s PM={pmc:.9f}deg')
# %% budget
budget_rows=[]
for Ts_ms,d_ms in [(3,1),(5,0),(5,1),(.5,1),(1,3)]:
    upper=2000*((60-45)*np.pi/(180*100)-d_ms/1000)
    estimated=60-(Ts_ms/2000+d_ms/1000)*100*180/np.pi
    row=[Ts_ms,d_ms,float(upper),float(estimated)]
    budget_rows.append(row)
    print(f'Ts={Ts_ms:g}ms d={d_ms:g}ms upper={upper:.9f}ms estimated_PM={estimated:.9f}deg')
scan_Ts=np.linspace(.001,.2,100)
scan=[]
for Ts in scan_Ts:
    Ld=digital(Ts); cross=margins(Ld,Ts)
    scan.append([float(Ts),min((v[1] for v in cross),default=float("nan")),float(max(abs(ctrl.poles(ctrl.feedback(Ld)))))])
scan=np.array(scan)
fig,axes=plt.subplots(1,2,figsize=(11,4))
axes[0].plot(scan[:,0]*1000,scan[:,1],label='actual sampled loop')
axes[0].plot(scan[:,0]*1000,pmc-wc*scan[:,0]/2*180/np.pi,'--',label='fixed-crossover approximation')
axes[0].axhline(0,color='red',linestyle=':')
axes[0].set(xlabel='Ts (ms)',ylabel='PM (deg)',xlim=(0,200),ylim=(-200,100))
minimum=np.linspace(5,pmc-1,100)
axes[1].plot(minimum,2000*(pmc-minimum)*np.pi/(180*wc))
axes[1].set(xlabel='required PM (deg)',ylabel='estimated upper Ts (ms)',xlim=(5,pmc),ylim=(0,200))
for ax in axes: ax.grid()
axes[0].legend(); plt.tight_layout(); plt.show()
print(f'filtered PID zero-extra-delay screening upper for 45deg: {2000*(pmc-45)*np.pi/(180*wc):.9f}ms')
# %% answers
Lq=ctrl.tf([10],[1,2,0])*ctrl.tf([2,5],[1,0])
qwc,qpm=margins(Lq)[0]
qroots=ctrl.poles(ctrl.feedback(Lq))
qold=2*(51.3-40)*np.pi/(180*4.5)
q2=2*np.pi/(20*np.array([500,50,5]))
d=(10e-6+.5e-3+.2e-3)
q3=2*((55-40)*np.pi/(180*200)-d)
answer_values=[float(qwc),float(qpm),float(max(qroots.real)),float(qold),*q2.tolist(),float(d),float(q3),float(55-(.001/2+d)*200*180/np.pi)]
losses=[float(180/n) for n in [2,10,20,30,50]]
hold_losses=[float(w*.001/2*180/np.pi) for w in [100,1000]]
print(f'Q1 actual loop: wc={qwc:.9f}rad/s PM={qpm:.9f}deg max_Re_pole={max(qroots.real):.9f}/s')
print(f'Q1 former given-number arithmetic only: {qold*1000:.9f}ms; not a design for this loop')
print('Q2 period upper bounds (ms):', ', '.join(f'{x*1000:.9f}' for x in q2))
print(f'Q3 d={d*1000:.9f}ms upper={q3*1000:.9f}ms; Ts=1ms estimated_PM={answer_values[-1]:.9f}deg')
print('hold phase losses for fs/f=2,10,20,30,50 (deg):',losses)
print('1ms hold phase losses at 100,1000rad/s (deg):',hold_losses)
extra_answers=[float(np.degrees(np.arctan(1/3))),float(2*np.pi/(.05*4.5))]
print(f'one-pole inner-loop lag at bandwidth ratio 3: {extra_answers[0]:.9f}deg; Q1 former-number frequency ratio at 50ms: {extra_answers[1]:.9f}')
application_ratios=(2*np.pi/(np.array([1,.1,.05,.001,.0001,.00001])*np.array([.01,.1,.5,50,200,1000]))).tolist()
print('illustrative application sampling/bandwidth ratios:', ', '.join(f'{x:.6f}' for x in application_ratios))
# %% setup-cascade
import numpy as np
import matplotlib.pyplot as plt
from scipy.linalg import expm
# SI units, x=[current(A), velocity(rad/s), position(rad)].
A=np.array([[-500.,-10.,0.],[1.,-.1,0.],[0.,1.,0.]])
B=np.array([1000.,0.,0.])
dt=1e-5
aug=np.zeros((4,4)); aug[:3,:3]=A; aug[:3,3]=B
transition=expm(aug*dt)
Ad=transition[:3,:3]; Bd=transition[:3,3]
gains=np.array([[8.,1.,.05],[5.,10.,.01],[2.,50.,.001]])
limits=np.array([100.,200.,400.])
def cascade(periods):
    periods=np.array(periods,dtype=float)
    ticks=np.rint(periods/dt).astype(int)
    if np.any(ticks<1) or not np.allclose(periods,ticks*dt,rtol=0,atol=1e-12):
        raise ValueError('periods must be positive integer multiples of 10us')
    x=np.zeros(3); integ=np.zeros(3); prev=np.zeros(3); held=np.zeros(3)
    trajectory=[x.copy()]; counts=np.zeros(3,dtype=int)
    # Position->velocity->current at a common tick; latest upstream reference.
    for k in range(50000):
        for loop in range(3):
            if k % ticks[loop]==0:
                measured=x[2-loop]
                target=1. if loop==0 else held[loop-1]
                e=target-measured
                kp,ki,kd=gains[loop]
                integ[loop]+=ki*periods[loop]*e
                held[loop]=np.clip(kp*e+integ[loop]+kd*(e-prev[loop])/periods[loop],-limits[loop],limits[loop])
                prev[loop]=e; counts[loop]+=1
        x=Ad@x+Bd*held[2]
        trajectory.append(x.copy())
    arr=np.array(trajectory)
    metrics=[float(max(arr[:,2])),float(arr[-1,2]),float(abs(1-arr[-1,2])),*counts.tolist()]
    return arr,metrics
# %% cascade
cascade_periods=[[.001,.0001,.00001],[.001,.001,.001],[.01,.001,.0001]]
cascade_results=[]
cascade_curves=[]
fig,axes=plt.subplots(3,1,figsize=(10,7),sharex=True)
t=np.arange(50001)*dt
for periods in cascade_periods:
    arr,metrics=cascade(periods)
    cascade_results.append(metrics)
    # Store full-rate metrics, plot every 100th point on its real time axis.
    cascade_curves.append(arr[::100].tolist())
    for i,ax in enumerate(axes): ax.plot(t[::100],arr[::100,2-i],label='/'.join(f'{p*1000:g}' for p in periods)+' ms')
    print('periods_ms='+str([p*1000 for p in periods])+f' sample_peak={metrics[0]:.9f} y(.5s)={metrics[1]:.9f} terminal_error={metrics[2]:.9f} updates={metrics[3:]}')
for ax,label in zip(axes,['position (rad)','velocity (rad/s)','current (A)']):
    ax.set_ylabel(label); ax.set_xlim(0,.5); ax.grid(); ax.legend(fontsize=7)
axes[-1].set_xlabel('t (s)'); plt.tight_layout(); plt.show()
try:
    cascade([.001,.000105,.00001])
except ValueError as error:
    print('noninteger schedule rejected:',error)
