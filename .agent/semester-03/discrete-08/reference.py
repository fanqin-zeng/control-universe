"""60-digit analytic reference, independent of the notebook's expm/ODE calculations."""
import json,sys
import mpmath as mp
mp.mp.dps=60
M=mp.mpf
max_ts_error=0.
def check(a,e):
    global max_ts_error
    if isinstance(e,list):
        assert len(a)==len(e)
        for aa,ee in zip(a,e):check(aa,ee)
    else:
        err=abs(float(a)-float(e));max_ts_error=max(err,max_ts_error)
        assert err<1e-10,(a,e,err)
def scalar(T):
    h=M(str(T));phi=mp.exp(-h);gamma=1-phi;p=phi-2*gamma
    N=int(mp.floor(6/h+M('1e-10')))
    samples=[[float(k*h),float(p**k)] for k in range(N+1)]
    held=[[float(k*h),float(-2*p**k)] for k in range(N+1)]
    curve=[[float(k*h+h*j/100),float((3*mp.exp(-h*j/100)-2)*p**k)] for k in range(N) for j in range(100)]
    curve.append(samples[-1])
    return dict(T=float(h),phi=float(phi),gamma=float(gamma),p=float(p),critical=float(mp.log(3)),samples=samples,curve=curve,held=held,firstMid=float(3*mp.exp(-h/2)-2))
cases=json.load(open(sys.argv[1],encoding='utf-8'))
for case in cases:
    expected=scalar(case['T'])
    for name,value in expected.items():check(case['result'][name],value)
    r=case['result']
    if abs(abs(expected['p'])-1)>1e-12:assert r['stable']==(abs(expected['p'])<1)
    assert max(abs(v[1]) for v in r['curve'])<=4
    assert max(abs(v[1]) for v in r['held'])<=8
main=[]
for T in [.1,.5,float(mp.log(3)),1.2]:
    r=scalar(T)
    main.append(dict(T=T,phi=r['phi'],gamma=r['gamma'],p=r['p'],times=[v[0] for v in r['curve']],values=[v[1] for v in r['curve']],numeric=[v[1] for v in r['curve']],nodes=[v[1] for v in r['samples']],inputs=[v[1] for v in r['held'][:-1]]))
delays=[]
for T in [.1,.5,.8,1.2]:
    h=M(str(T));phi=mp.exp(-h);gamma=1-phi
    # Roots from the quadratic formula, not an eigenvalue solver.
    d=mp.sqrt(mp.mpc(phi**2-8*gamma))
    roots=[(phi+d)/2,(phi-d)/2]
    x=M(1);u=M(-2);history=[[float(x),float(u)]]
    for k in range(int(mp.floor(6/h+M('1e-10')))):
        x,u=phi*x+gamma*u,-2*x
        history.append([float(x),float(u)])
    delays.append(dict(T=T,phi=float(phi),gamma=float(gamma),p=float(phi-2*gamma),rho=float(max(abs(v) for v in roots)),history=history))
def oscillator(alpha,T):
    a=M(str(alpha));h=M(str(T));w=2*mp.pi
    Phi=mp.exp(a*h)*mp.matrix([[mp.cos(w*h),mp.sin(w*h)],[-mp.sin(w*h),mp.cos(w*h)]])
    samples=[[float(mp.exp(a*k*h)*mp.sin(w*k*h)),float(mp.exp(a*k*h)*mp.cos(w*k*h))] for k in range(7)]
    times=[float(M(6)*j/2400) for j in range(2401)]
    y=[float(mp.exp(a*M(6)*j/2400)*mp.sin(w*M(6)*j/2400)) for j in range(2401)]
    t=mp.atan2(w,-a)/w
    return dict(alpha=alpha,T=T,Phi=[[float(v) for v in row] for row in Phi.tolist()],samples=samples,time=times,y=y,rho=float(mp.exp(a*h)),peak_t=float(t),peak_y=float(mp.exp(a*t)*mp.sin(w*t)),observation_det=float(mp.exp(a*h)*mp.sin(w*h)))
alias=[oscillator(a,1.) for a in [-.2,0.,.2]]
r=scalar(.5)
defaults=[r['phi'],r['gamma'],r['p'],r['firstMid'],r['critical'],float(mp.log(M('1.5'))) ]
q=scalar(.8)
answers=defaults[:5]+[1.,.5,0.,1.,q['p'],delays[2]['rho']]
observations=[[T,oscillator(-.2,T)['observation_det']] for T in [.9,1.,1.1]]
print(json.dumps(dict(pass_=True,configs=len(cases),max_ts_error=max_ts_error,main_results=main,default_values=defaults,delay_results=delays,alias_results=alias,answer_values=answers,observation_values=observations)))
