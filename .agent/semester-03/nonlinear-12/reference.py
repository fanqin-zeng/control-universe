import json,sys,math
from decimal import Decimal, localcontext
import numpy as np
import mpmath as mp
from scipy.integrate import solve_ivp
from scipy.optimize import root
cases=json.load(open(sys.argv[1],encoding='utf-8'));mp.mp.dps=60;reports=[]
for case in cases:
    p=case['params'];o=case['result'];r,x0=p;values=o['orbit']
    with localcontext() as ctx:
        ctx.prec=80;dr=Decimal.from_float(r);x=Decimal.from_float(x0);short=0.;residual=0.
        for i in range(1,21):
            x=dr*x*(1-x);short=max(short,abs(float(x)-values[i]))
        for before,after in zip(values,values[1:]):
            v=Decimal.from_float(before);exact=dr*v*(1-v);residual=max(residual,abs(float(exact)-after))
    assert short<1e-8,(p,short)
    assert residual<5e-16,(p,residual)
    assert all(0<=x<=1 for x in values)
    ds=[abs(r*(1-2*x)) for x in values[o['burn']:o['burn']+o['window']]]
    if any(d==0 for d in ds):assert o['zeroDerivative'] and o['lyapunov'] is None
    else:
        lam=math.fsum(math.log(d) for d in ds)/len(ds)
        assert abs(lam-o['lyapunov'])<1e-11
    periodic_error=None
    period={2.8:1,3.2:2,3.5:4,3.83:3}.get(r)
    if r==4 and x0==.75:period=1
    if period:
        mr=mp.mpf(r)
        def advance(x):return mr*x*(1-x)
        def periodic(x):
            z=x
            for _ in range(period):z=advance(z)
            return z-x
        start=mp.findroot(periodic,(mp.mpf(values[2000])-.00001,mp.mpf(values[2000])+.00001))
        cycle=[];z=start
        for _ in range(period):cycle.append(float(z));z=advance(z)
        periodic_error=max(min(abs(x-c) for c in cycle) for x in values[2000:])
        assert periodic_error<1e-10
    if period:
        multiplier=mp.mpf(1)
        for cval in cycle:multiplier*=mp.mpf(r)*(1-2*mp.mpf(cval))
        if not (r==4 and x0==.75):assert abs(multiplier)<1
    reports.append({'params':p,'short20HighPrecisionError':short,'maxPolynomialResidual':residual,'stableCycleHighPrecisionError':periodic_error,'finiteExponent':o['lyapunov'],'zeroDerivative':o['zeroDerivative']})
clouds=json.load(open('.agent/semester-03/nonlinear-12/actual-cloud.json'))
cloudResidual=0.;cloudPoints=0
with localcontext() as ctx:
    ctx.prec=80
    for specimen in clouds:
        cloud=specimen['points'];assert len(cloud)==121*48;cloudPoints+=len(cloud)
        for j in range(121):
            group=cloud[j*48:(j+1)*48];r=group[0][0];assert abs(r-(2.8+j*.01))<1e-14
            for prev,nxt in zip(group,group[1:]):
                a=Decimal.from_float(prev[1]);exact=Decimal.from_float(r)*a*(1-a)
                cloudResidual=max(cloudResidual,abs(float(exact)-nxt[1]));assert 0<=nxt[1]<=1
assert cloudResidual<5e-16
# Independently solve Cartesian Hopf with Radau, compare closed radial law.
hopf=[]
for mu in [-.25,0,.25]:
    def rhs(t,z):
        x,y=z;return [mu*x-y-(x*x+y*y)*x,x+mu*y-(x*x+y*y)*y]
    sol=solve_ivp(rhs,[0,40],[.1,0],method='Radau',rtol=1e-10,atol=1e-12)
    exact=math.sqrt(.01/(1+.02*40)) if mu==0 else math.sqrt(mu/(1+(mu/.01-1)*math.exp(-80*mu)))
    assert abs(np.linalg.norm(sol.y[:,-1])-exact)<1e-8
    hopf.append({'mu':mu,'radius40':float(np.linalg.norm(sol.y[:,-1])),'closedForm':exact})
# Shooting with Radau and a finite-difference Jacobian, independent of NB's augmented DOP853.
w=2;P=np.pi
seeds=[[-.5077,.1411],[-1.8089,3.8893],[1.6996,4.8467]];duffing=[]
def endpoint(z):
    sol=solve_ivp(lambda t,y:[y[1],-.2*y[1]-y[0]-.5*y[0]**3+1.5*np.cos(2*t)],[0,P],z,method='Radau',rtol=2e-11,atol=2e-13)
    assert sol.success
    return sol.y[:,-1]
for seed in seeds:
    answer=root(lambda z:endpoint(z)-z,seed,tol=1e-9);z=answer.x
    assert np.linalg.norm(endpoint(z)-z)<1e-8
    eps=1e-5;J=np.column_stack([(endpoint(z+np.eye(2)[i]*eps)-endpoint(z-np.eye(2)[i]*eps))/(2*eps) for i in range(2)])
    rho=float(max(abs(np.linalg.eigvals(J))));assert abs(np.linalg.det(J)-np.exp(-.2*P))<1e-6
    duffing.append({'state':z.tolist(),'rho':rho,'det':float(np.linalg.det(J))})
print(json.dumps({'passed':True,'cases':reports,'hopf':hopf,'duffing':duffing,'cloudPoints':cloudPoints,'cloudMaxResidual':cloudResidual}))
