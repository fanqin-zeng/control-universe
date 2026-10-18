# Evaluated source is embedded in the lesson; these sections reproduce its four cells.
# %% setup-main
import numpy as np
import matplotlib.pyplot as plt
from scipy.linalg import expm
from scipy.integrate import solve_ivp

def sample_model(T):
    # exp([[A,B],[0,0]]T), valid even when A=0.
    E=expm(np.array([[-1.,1.],[0.,0.]])*T)
    phi,gamma=E[0]
    return float(phi),float(gamma),float(phi-2*gamma)

def trajectory(T):
    phi,gamma,p=sample_model(T)
    N=int(np.floor(6/T+1e-10))
    times=[]; values=[]; numeric=[]; nodes=[1.]; inputs=[]
    x=1.
    for k in range(N):
        u=-2*x; tau=np.linspace(0,T,101)
        E=np.exp(-tau)
        flow=E*x+(1-E)*u
        ode=solve_ivp(lambda t,z:-z+u,(0,T),[x],t_eval=tau,rtol=1e-11,atol=1e-13)
        assert ode.success
        times.extend((k*T+tau[:-1]).tolist()); values.extend(flow[:-1].tolist());numeric.extend(ode.y[0,:-1].tolist())
        inputs.append(u); x=phi*x+gamma*u;nodes.append(x)
    times.append(N*T);values.append(x);numeric.append(float(ode.y[0,-1]))
    return dict(T=T,phi=phi,gamma=gamma,p=p,times=times,values=values,numeric=numeric,nodes=nodes,inputs=inputs)
# %% main
main_periods=[.1,.5,np.log(3),1.2]
main_results=[trajectory(float(T)) for T in main_periods]
fig,axes=plt.subplots(2,1,figsize=(10,6),sharex=True)
for result in main_results:
    T=result['T']; t=np.array(result['times']);x=np.array(result['values'])
    axes[0].plot(t,x,label=f'T={T:.6g}s')
    axes[0].plot(np.arange(len(result['nodes']))*T,result['nodes'],'o',markersize=3)
    axes[1].step(np.arange(len(result['inputs'])+1)*T,result['inputs']+[result['inputs'][-1]],where='post',label=f'T={T:.6g}s')
    error=max(abs(x-np.array(result['numeric'])))
    print(f'T={T:.9f}s phi={result["phi"]:.9f} gamma={result["gamma"]:.9f} p={result["p"]:.9f} last_t={t[-1]:.9f}s last_x={x[-1]:.9f} ODE_error={error:.2e}')
ref_t=np.linspace(0,6,601)
axes[0].plot(ref_t,np.exp(-3*ref_t),'k--',label='continuous feedback, same K=2')
axes[0].set(ylabel='state x',ylim=(-4,4));axes[1].set(ylabel='held u',xlabel='t (s)',ylim=(-8,8))
for ax in axes:ax.set_xlim(0,6);ax.grid();ax.legend(fontsize=7)
plt.tight_layout();plt.show()
phi,gamma,p=sample_model(.5)
default_values=[phi,gamma,p,float(3*np.exp(-.25)-2),float(np.log(3)),float(np.log(1.5))]
print('default phi/gamma/p/x(T/2)/critical_T/first_zero:',', '.join(f'{x:.12f}' for x in default_values))
# %% delay
delay_periods=[.1,.5,.8,1.2]
delay_results=[]
fig,ax=plt.subplots(figsize=(9,4))
for T in delay_periods:
    phi,gamma,p=sample_model(T)
    M=np.array([[phi,gamma],[-2.,0.]])
    roots=np.linalg.eigvals(M);rho=float(max(abs(roots)))
    # x[-1]=1, so u[0]=-2. Undelayed experiment also starts with u[0]=-2.
    state=np.array([1.,-2.]);history=[state.copy()]
    for k in range(int(np.floor(6/T+1e-10))):
        state=M@state;history.append(state.copy())
    history=np.array(history)
    delay_results.append(dict(T=T,phi=phi,gamma=gamma,p=p,rho=rho,history=history.tolist()))
    ax.plot(np.arange(len(history))*T,history[:,0],'-o',markersize=3,label=f'T={T:g}s delayed')
    print(f'T={T:g}s no_delay_abs_p={abs(p):.9f} one_tick_delay_rho={rho:.9f} last_t={(len(history)-1)*T:.9f}s')
ax.set(xlabel='t (s)',ylabel='sampled x',xlim=(0,6));ax.grid();ax.legend();plt.tight_layout();plt.show()
# %% setup-alias
import numpy as np
import matplotlib.pyplot as plt
from scipy.linalg import expm
omega=2*np.pi
x0=np.array([0.,1.]); C=np.array([[1.,0.]])
def oscillator(alpha,T):
    A=np.array([[alpha,omega],[-omega,alpha]])
    Phi=expm(A*T)
    samples=np.array([np.linalg.matrix_power(Phi,k)@x0 for k in range(7)])
    time=np.linspace(0,6,2401)
    y=np.exp(alpha*time)*np.sin(omega*time)
    peak_t=float(np.arctan2(omega,-alpha)/omega)
    peak_y=float(np.exp(alpha*peak_t)*np.sin(omega*peak_t))
    O=np.vstack([C,C@Phi])
    return dict(alpha=alpha,T=T,Phi=Phi.tolist(),samples=samples.tolist(),time=time.tolist(),y=y.tolist(),rho=float(max(abs(np.linalg.eigvals(Phi)))),peak_t=peak_t,peak_y=peak_y,observation_det=float(np.linalg.det(O)))
# %% alias
alias_results=[oscillator(alpha,1.) for alpha in [-.2,0.,.2]]
fig,ax=plt.subplots(figsize=(10,4))
for result in alias_results:
    alpha=result['alpha'];s=np.array(result['samples'])
    ax.plot(result['time'],result['y'],label=f'alpha={alpha:g}/s')
    ax.plot(np.arange(7),s[:,0],'o',markersize=4)
    print(f'alpha={alpha:g}/s sampled_rho={result["rho"]:.9f} max_abs_sample_y={max(abs(s[:,0])):.2e} norm_x(6s)={np.linalg.norm(s[-1]):.9f} first_positive_peak_t={result["peak_t"]:.9f}s peak_y={result["peak_y"]:.9f}')
ax.set(xlabel='t (s)',ylabel='continuous y and sample markers',xlim=(0,6),ylim=(-3.5,3.5));ax.grid();ax.legend();plt.tight_layout();plt.show()
# %% answers
qphi,qgamma,qp=np.exp(-.5),1-np.exp(-.5),3*np.exp(-.5)-2
qmid=3*np.exp(-.25)-2
# Integrator: A=0, B=1, K=2; x[k+1]=(1-2T)x[k].
E=expm(np.array([[0.,1.],[0.,0.]])*.5)
qdelay_phi=np.exp(-.8);qdelay_gamma=1-qdelay_phi
qdelay_roots=np.linalg.eigvals([[qdelay_phi,qdelay_gamma],[-2.,0.]])
answer_values=[float(qphi),float(qgamma),float(qp),float(qmid),float(np.log(3)),float(E[0,0]),float(E[0,1]),float(1-2*.5),float(1.),float(3*np.exp(-.8)-2),float(max(abs(qdelay_roots)))]
observations=[oscillator(-.2,T) for T in [.9,1.,1.1]]
print('Q1 phi/gamma/p/x(T/2)/critical_T:',', '.join(f'{x:.12f}' for x in answer_values[:5]))
print('Q2 integrator phi/gamma/p at .5s:',answer_values[5:8],'; stability interval 0<T<1s')
print(f'Q4 T=.8s p={answer_values[-2]:.12f} delayed_rho={answer_values[-1]:.12f}')
for obs in observations:print(f'alpha=-.2/s T={obs["T"]:g}s two_sample_observation_det={obs["observation_det"]:.12f}')
