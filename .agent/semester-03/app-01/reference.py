"""Independent Decimal circuit balances and adaptive segment integration.
The TS code uses a direct ripple formula; Decimal derives the rise from on-slope.
Notebook periodic states use matrix exponentials; this check solves a numerical
shooting problem with DOP853 and independently integrates a periodic orbit.
"""
from pathlib import Path
from decimal import Decimal as Q
import json
import numpy as np
from scipy.integrate import solve_ivp
from scipy.optimize import root
from scipy.linalg import expm

base=Path('.agent/semester-03/app-01')
cases=json.loads((base/'actual-ts.json').read_text())
error=0
for case in cases:
    d,r,l=map(lambda k: Q(str(case[k])),['d','r','l'])
    l=l/1000
    v=24*d;current=v/r;rise=(24-v)/l*d/20000
    expected={'voltage':v,'current':current,'ripple':rise,
              'minimum':current-rise/2,'maximum':current+rise/2,
              'voltageRipple':rise/(8*20000*Q('.0001')),
              'boundary':2*l*20000/(1-d)}
    for key,val in expected.items():
        err=abs(float(val)-case['out'][key]);error=max(error,err)
        assert err<1e-10,(case,key,err)
    assert case['out']['valid']==(expected['minimum']>0)
    pts=case['out']['points']
    if expected['minimum']>0:
        assert len(pts)==6 and pts[0][0]==0 and pts[-1][0]==100
        assert all(0<=p[1]<=7 for p in pts)
    else: assert pts==[]

periodic=[]
for r in [6.,30.,120.]:
    def stage(x,mode,dense=False):
        return solve_ivp(lambda t,z: [(mode*24-z[1])/.001,(z[0]-z[1]/r)/.0001],
                         (0,25e-6),x,method='DOP853',rtol=1e-12,atol=1e-13,dense_output=dense)
    def shoot(x):return stage(stage(x,1).y[:,-1],0).y[:,-1]-x
    sol=root(shoot,[12/r-.15,12]);assert sol.success
    on=stage(sol.x,1,True);off=stage(on.y[:,-1],0,True)
    times=np.linspace(0,50e-6,1001)
    vals=np.array([on.sol(t) if t<=25e-6 else off.sol(t-25e-6) for t in times])
    # Compare periodic matrix exponential implementation independently.
    a=np.array([[0,-1000],[10000,-1/(r*.0001)]])
    e=expm(a*25e-6);b=np.array([24000,0]);q=np.linalg.solve(a,(e-np.eye(2))@b)
    start=np.linalg.solve(np.eye(2)-e@e,e@q)
    assert np.max(abs(start-sol.x))<1e-8
    # Integrate v and i over both stages, independent of plotting grid.
    from scipy.integrate import quad
    avg=np.array([sum(quad(lambda t: segment.sol(t)[j],0,25e-6,epsabs=1e-12)[0] for segment in [on,off])/50e-6 for j in [0,1]])
    assert np.max(abs(avg-[12/r,12]))<1e-8
    periodic.append({'R':r,'initial':sol.x.tolist(),'average':avg.tolist(),'minCurrent':float(vals[:,0].min()),'ripple':np.ptp(vals,axis=0).tolist(),'valid':bool(vals[:,0].min()>0)})

# PI independent transfer-polynomial roots and exact affine state propagation.
l,c,r,v,kp,ki=.001,.0001,6,24,.02,20
poles=np.roots([l*c,l/r,1+v*kp,v*ki])
assert all(poles.real<0)
m=np.array([[0,-(1+v*kp)/l,v/l],[1/c,-1/(r*c),0],[0,-ki,0]])
g=np.array([v*kp/l,0,ki])*.1
times=np.linspace(0,.05,1001)
exact=np.array([np.linalg.solve(m,(expm(m*t)-np.eye(3))@g) for t in times])
adaptive=solve_ivp(lambda t,z: m@z+g,(0,.05),[0,0,0],t_eval=times,method='DOP853',rtol=1e-10,atol=1e-12)
pierror=float(np.max(abs(exact-adaptive.y.T)))
assert pierror<1e-8
duty=.5+kp*(.1-exact[:,1])+exact[:,2]
assert duty.min()>0 and duty.max()<1
result={'cases':len(cases),'maxTsError':error,'periodic':periodic,'piError':pierror,
        'piPoles':[[float(x.real),float(x.imag)] for x in poles],
        'piVoltage20ms':float(12+exact[400,1]),'piVoltage50ms':float(12+exact[-1,1]),
        'piDutyRange':[float(duty.min()),float(duty.max())]}
(base/'reconciliation.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
