"""60-digit closed event segments: choose event spacing once, no stepwise ODE simulation."""
import json,sys
import mpmath as mp
mp.mp.dps=60
M=lambda v:mp.mpf(str(v))
def closed(h,sigma,x0=1):
    h,sigma,x0=map(M,[h,sigma,x0]);N=int(mp.nint(6/h));p=lambda t:3*mp.exp(-t)-2
    # After each reset, x/x_event=p(elapsed). Homogeneity fixes the next interval.
    spacing=next((j for j in range(1,N+1) if abs(1-p(j*h))>=sigma*abs(p(j*h))),N+1) if x0 else N+1
    event_indices=list(range(0,N,spacing));factor=p(spacing*h)
    def state(t,k):
        event_index=(k//spacing)*spacing
        return x0*factor**(k//spacing)*p(t-event_index*h)
    samples=[[k*h,state(k*h,k)] for k in range(N+1)]
    baseline_samples=[[k*h,x0*p(h)**k] for k in range(N+1)]
    curve=[];baseline_curve=[]
    for k in range(N):
        for j in range(20):
            tau=j*h/20;t=k*h+tau
            curve.append([t,state(t,k)])
            baseline_curve.append([t,x0*p(h)**k*p(tau)])
    curve.append(samples[-1]);baseline_curve.append(baseline_samples[-1])
    return dict(h=h,sigma=sigma,x0=x0,samples=samples,baselineSamples=baseline_samples,curve=curve,baselineCurve=baseline_curve,events=[[k*h,state(k*h,k)] for k in event_indices],count=len(event_indices),baselineCount=N,terminal=samples[-1][1],baselineTerminal=baseline_samples[-1][1])
def floats(v):
    if isinstance(v,dict):return {k:floats(x) for k,x in v.items()}
    if isinstance(v,list):return [floats(x) for x in v]
    return float(v)
max_ts_error=0.;ts_quantities=0
def check(a,b):
    global max_ts_error,ts_quantities
    if isinstance(b,dict):
        for k,v in b.items():check(a[k],v)
    elif isinstance(b,list):
        assert len(a)==len(b),(len(a),len(b))
        for x,y in zip(a,b):check(x,y)
    else:
        err=abs(a-float(b));max_ts_error=max(err,max_ts_error);ts_quantities+=1;assert err<1e-10,(a,b,err)
for case in json.load(open(sys.argv[1])):check(case['result'],closed(case['h'],case['sigma'],case.get('x0',1)))
sigma=M(.25);interval=mp.log(3*(1+sigma)/(3+2*sigma));p=3*mp.exp(-M(.1))-2;ratio=(1-p)/abs(p)
proof=[3-2*sigma,2*(3-2*sigma),interval,M(.1),ratio]
miss=[[k*M(1.2),3*mp.exp(-k*M(1.2))-2] for k in range(6)]
answers=list(map(M,[.2,.2,-1.6,2.5,5]))+[interval,M(.1),3*mp.exp(-6)-2,M(-2)]
print(json.dumps(dict(pass_=True,max_ts_error=max_ts_error,ts_quantities=ts_quantities,default=floats(closed(.05,.25)),cases=[floats(closed(h,s)) for h,s in [(.05,.25),(.1,.1),(1.2,.25),(1.2,2)]],origin=floats(closed(.05,.25,0)),proof_values=floats(proof),miss_samples=floats(miss),answer_values=floats(answers))))
