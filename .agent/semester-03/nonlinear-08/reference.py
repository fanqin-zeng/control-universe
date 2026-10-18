"""Independent error-coordinate implementation. Executes actual TS results as inputs.
Known constant input direction; no use of TS implementation source or notebook simulator.
Tolerances: absolute/relative trace 2e-7; deterministic continuous DOP853 2e-5.
"""
import sys,json,math
import numpy as np
from scipy.integrate import solve_ivp
data=json.load(open(sys.argv[1],encoding='utf8'))['cases']
M=len(data); dt=.001; steps=40000
gam=np.array([c['params'][1] for c in data]); sig=np.array([c['params'][2] for c in data]); noise=np.array([c['params'][3] for c in data]); unm=np.array([c['params'][4] for c in data])
def signal(t):
    return np.array([1. if c['params'][0]=='step' else math.sin(t) if c['params'][0]=='sine' else 1+.5*math.sin(2*t)+.3*math.sin(5*t) for c in data])
def gaussians(seed,n):
    a=seed&0xffffffff
    def rnd():
        nonlocal a
        a=(a+0x6d2b79f5)&0xffffffff
        t=((a^(a>>15))*(1|a))&0xffffffff
        t=((t+(((t^(t>>7))*(61|t))&0xffffffff))&0xffffffff)^t
        return ((t^(t>>14))&0xffffffff)/4294967296
    out=[]
    while len(out)<n:
        u=rnd(); v=rnd()
        while u==0: u=rnd()
        while v==0: v=rnd()
        mag=math.sqrt(-2*math.log(u)); out.extend([mag*math.cos(2*math.pi*v),mag*math.sin(2*math.pi*v)])
    return np.array(out[:n])
wn=np.array([gaussians(c['params'][5] if len(c['params'])>5 else 20260924,steps+1) if c['params'][3] else np.zeros(steps+1) for c in data])
wn*=noise[:,None]*math.sqrt(20)
# Coordinates [tracking error, reference state, k1, k2, v1, v2, noise].
z=np.zeros((7,M)); alive=np.ones(M,dtype=bool); sq=np.zeros(M); count=np.zeros(M); peak=np.zeros(M); stop=[None]*M
sample=[[] for _ in data]; per=[[] for _ in data]
def f(z,t,xi):
    ee,m,k1,k2,v1,v2,n=z; xp=ee+m; r=signal(t); em=ee+n; u=k1*(xp+n)+k2*r
    md=-5*m+5*r
    ed=-2*ee+3*m+3*np.where(unm,v2,u)-5*r
    return np.array([ed,md,-gam*em*(xp+n)-sig*gam*k1,-gam*em*r-sig*gam*k2,np.where(unm,3*(u-v1),0),np.where(unm,20*(v1-v2),0),(-n+xi)/.01])
for i in range(steps+1):
    t=i*dt; r=signal(t); xp=z[0]+z[1]; u=z[2]*(xp+z[6])+z[3]*r
    for j in np.where(alive)[0]:
        if i%25==0: sample[j].append([t,xp[j],z[1,j],z[0,j],z[2,j],z[3,j]])
        if i%2==0: per[j].append([xp[j],r[j]])
    if t>32:
        sq[alive]+=z[0,alive]**2; count[alive]+=1
    peak[alive]=np.maximum(peak[alive],abs(u[alive]))
    if i==steps: break
    a=f(z,t,wn[:,i]); b=f(z+dt*a/2,t+dt/2,wn[:,i]); c=f(z+dt*b/2,t+dt/2,wn[:,i]); d=f(z+dt*c,t+dt,wn[:,i]); new=z+dt/6*(a+2*b+2*c+d)
    z[:,alive]=new[:,alive]
    bad=alive & ((np.max(abs(z),axis=0)>1e100) | (abs(z[0]+z[1])>1e3) | (abs(z[2])>1e4) | ~np.isfinite(z).all(axis=0))
    for j in np.where(bad)[0]:
        stop[j]=t+dt
        if np.isfinite(z[:4,j]).all(): sample[j].append([t+dt,z[0,j]+z[1,j],z[1,j],z[0,j],z[2,j],z[3,j]])
    alive[bad]=False
    # Frozen finished cases must not overflow intermediate vectorized stages.
    z[:,~alive]=0
maxdiff=maxmetric=maxpe=0.; points=0; rows=[]
for j,c in enumerate(data):
    a=c['result']; expected=np.array(sample[j]); actual=np.column_stack([a['t'],a['xp'],a['xm'],a['e'],np.array(a['traj'])])
    assert actual.shape==expected.shape,(j,actual.shape,expected.shape)
    # Absolute+relative tolerance for the large state at a numerical cutoff.
    delta=float(np.max(abs(actual-expected)/(1+abs(expected)))); maxdiff=max(maxdiff,delta); assert delta<2e-7,(j,delta)
    assert a['divT']==stop[j] or (a['divT'] is not None and stop[j] is not None and abs(a['divT']-stop[j])<1e-9)
    rms=math.sqrt(sq[j]/count[j]) if count[j] else None
    for key,v in [('rmsE',rms),('maxU',peak[j])]:
        if v is None: assert a[key] is None
        else:
            diff=abs(a[key]-v)/(1+abs(v)); maxmetric=max(maxmetric,diff); assert diff<2e-7,(j,key,diff)
    pp=np.array(per[j]); nw=round(2*math.pi/.002)
    if len(pp)>=round(19/.002)+nw:
        pe=min(np.linalg.eigvalsh(pp[round(k/.002):round(k/.002)+nw].T@pp[round(k/.002):round(k/.002)+nw]*.002)[0] for k in range(20))
        diff=abs(a['peLmin']-max(0,pe)); maxpe=max(maxpe,diff); assert diff<1e-8,(j,diff)
    else: assert a['peLmin'] is None
    points+=len(expected); rows.append(dict(params=c['params'],rms=rms,maxu=float(peak[j]),stop=stop[j]))
# Continuous independent integration, conventional plant coordinates (different solver).
continuous=[]
for kind,gamma in [('step',50),('sine',50),('multi',50)]:
    c=next(c for c in data if c['params'][:2]==[kind,gamma] and c['params'][2:5]==[0,0,False]); a=c['result']
    def rhs(t,z):
        xp,xm,k1,k2=z; r=1 if kind=='step' else np.sin(t) if kind=='sine' else 1+.5*np.sin(2*t)+.3*np.sin(5*t); e=xp-xm
        return [-2*xp+3*(k1*xp+k2*r),-5*xm+5*r,-gamma*e*xp,-gamma*e*r]
    sol=solve_ivp(rhs,[0,40],np.zeros(4),method='DOP853',rtol=1e-11,atol=1e-13,t_eval=a['t'])
    actual=np.array([a['xp'],a['xm'],np.array(a['traj'])[:,0],np.array(a['traj'])[:,1]])
    diff=float(np.max(abs(sol.y-actual))); assert diff<2e-5,(kind,diff); continuous.append(diff)
distribution=[]
for sigma in [0,.1]:
    r=[r for r in rows if r['params'][2]==sigma and r['params'][3]>.0]
    distribution.append(dict(sigma=sigma,seeds=[r['params'][5] for r in r],rms=[r['rms'] for r in r],maxu=[r['maxu'] for r in r]))
print(json.dumps(dict(pass_=True,cases=M,points=points,maxTraceDifference=maxdiff,maxMetricDifference=maxmetric,maxPEDifference=maxpe,continuousDifferences=continuous,distribution=distribution,rows=rows)))
