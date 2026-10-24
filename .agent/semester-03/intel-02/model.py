import math
import numpy as np
import matplotlib.pyplot as plt

DEG = math.pi / 180
plt.rcParams['font.family'] = 'DejaVu Sans'

def rules(n=5, design='repaired', mode='PD'):
    if mode == 'P': return np.repeat(np.arange(n)[:, None], n, axis=1)
    if mode == 'D': return np.repeat(np.arange(n)[None, :], n, axis=0)
    return np.array([[max(0, min(n-1, i+j-(n-1)//2)) if design == 'repaired'
                      else round((i+j)/2) for j in range(n)] for i in range(n)])

def mf(x, i, n, old=False):
    if (i == 0 and x <= -1) or (i == n-1 and x >= 1): return 1.
    return max(0., 1-abs(x-(-1+2*i/(n-1)))/((1 if old else 2)/(n-1)))

def envelope(e, de, n=5, design='repaired', mode='PD'):
    old = design == 'legacy'
    R = rules(n, design, mode)
    left = [(i, mf(e,i,n,old)) for i in range(n) if mf(e,i,n,old)>0]
    right = [(j, mf(de,j,n,old)) for j in range(n) if mf(de,j,n,old)>0]
    heights = {}
    for i, a in left:
        for j, b in right:
            k = int(R[i,j]); heights[k] = max(heights.get(k,0), min(a,b))
    return heights

def infer(e, de, n=5, design='repaired', mode='PD', method='COG'):
    old = design == 'legacy'
    hs = envelope(e,de,n,design,mode)
    if not hs: return 0.
    width = (1 if old else 2)/(n-1)
    def f(x,k): return min(hs[k],mf(x,k,n,old))
    knots = {-1.,1.}
    for k,h in hs.items():
        c=-1+2*k/(n-1)
        knots.update(x for x in [c-width,c-width*(1-h),c,c+width*(1-h),c+width] if -1<x<1)
    base=sorted(knots)
    for a,b in zip(base[:-1],base[1:]):
        for i in hs:
            for j in hs:
                if j<=i: continue
                da,db=f(a,i)-f(a,j),f(b,i)-f(b,j)
                if da*db < -1e-24: knots.add(a+(b-a)*da/(da-db))
    xs=sorted(knots); ys=[max(f(x,k) for k in hs) for x in xs]
    segments=list(zip(xs[:-1],xs[1:],ys[:-1],ys[1:]))
    area=sum((b-a)*(p+q)/2 for a,b,p,q in segments)
    if area<=1e-14: return 0.
    if method=='COG':
        return sum((b-a)*((2*a+b)*p+(a+2*b)*q)/6 for a,b,p,q in segments)/area
    if method=='MOM':
        peak=max(ys)
        intervals=[(a,b) for a,b,p,q in segments if abs(p-peak)<1e-12 and abs(q-peak)<1e-12]
        length=sum(b-a for a,b in intervals)
        return (sum((b*b-a*a)/2 for a,b in intervals)/length if length>1e-12
                else float(np.mean([x for x,y in zip(xs,ys) if abs(y-peak)<1e-12])))
    # BIS: solve the half-area condition by monotone bisection.
    target=area/2
    for a,b,p,q in segments:
        piece=(b-a)*(p+q)/2
        if target>piece+1e-14: target-=piece; continue
        lo,hi=0.,b-a
        for _ in range(45):
            z=(lo+hi)/2; v=p*z+(q-p)*z*z/(2*(b-a))
            if v<target: lo=z
            else: hi=z
        return a+(lo+hi)/2
    return xs[-1]

def simulate(Ge=2., Gce=.5, Gu=12., n=5, design='repaired', mode='PD', Ki=0.,
             angle=20., omega=0., gravity=19.6, disturbance=0., T=6., dt=.002,
             pid=None, method='COG'):
    N=round(T/dt); th=angle*DEG; om=omega; integral=0.; sat=0; gaps=0
    theta=[th]; us=[]
    for _ in range(N):
        e,de=-th,-om
        ki=pid[1] if pid is not None else Ki
        if pid is None:
            if not envelope(e*Ge,de*Gce,n,design,mode): gaps+=1
            base=Gu*infer(e*Ge,de*Gce,n,design,mode,method)
        else: base=pid[0]*e+pid[2]*de
        candidate=integral+e*dt; raw=base+ki*candidate
        if abs(raw)<=15 or raw*ki*e<=0: integral=candidate
        command=base+ki*integral; torque=max(-15.,min(15.,command)); sat+=abs(command)>=15
        def acc(x): return gravity*math.sin(x)+4*(torque+disturbance)
        a1,b1=om,acc(th); a2,b2=om+dt*b1/2,acc(th+dt*a1/2)
        a3,b3=om+dt*b2/2,acc(th+dt*a2/2); a4,b4=om+dt*b3,acc(th+dt*a3)
        th+=dt*(a1+2*a2+2*a3+a4)/6; om+=dt*(b1+2*b2+2*b3+b4)/6
        theta.append(th); us.append(torque)
    theta=np.array(theta)/DEG; us=np.array(us)
    return dict(time=np.arange(N+1)*dt,theta=theta,u=us,rms=float(np.sqrt(np.mean(theta**2))),
                final=float(theta[-1]),tail=float(np.max(np.abs(theta[round(max(0,T-1)/dt):]))),
                tv=float(np.sum(np.abs(np.diff(us)))),maxU=float(np.max(np.abs(us))),
                gaps=gaps,saturation=sat/N)

def report(label,r):
    print(label, ' '.join(f'{k}={r[k]:.6f}' for k in ['rms','final','tail','tv','maxU','saturation']), 'gaps=',r['gaps'])

def plot_runs(items):
    fig,ax=plt.subplots(2,1,figsize=(8,6))
    for label,r in items:
        ax[0].plot(r['time'],r['theta'],label=label)
        ax[1].plot(r['time'][:-1],r['u'],label=label)
    ax[0].set(xlabel='Time (s)',ylabel='Angle (deg)')
    ax[1].set(xlabel='Time (s)',ylabel='Torque (N m)',ylim=(-16,16))
    for a in ax: a.grid(alpha=.3); a.legend(loc='upper right')
    plt.tight_layout(); plt.show()
