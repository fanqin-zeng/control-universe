import json,math
from pathlib import Path
import numpy as np
from scipy.integrate import quad
folder=Path('.agent/semester-03/intel-01')
cases=json.loads((folder/'actual-ts.json').read_text())
worst={'cog':0.,'bis':0.,'mom':0.};quad_error=0.;no_cover=0
def shoulder(x,c,h,left=False,right=False):
    if left and x<=c:return 1.
    if right and x>=c:return 1.
    return max(0.,1-abs(x-c)/h)
for case in cases:
    n,hs,x=case['n'],case['hs'],case['x']
    cx=np.linspace(-30,30,n);cu=np.linspace(-15,15,n);h=hs*60/(n-1);hu=30/(n-1)
    weights=[shoulder(x,c,h,i==0,i==n-1) for i,c in enumerate(cx)]
    assert sum(w>1e-14 for w in weights)==case['fired'] or any(0<w<1e-14 for w in weights)
    def agg(y):
        return max(min(w,shoulder(y,cu[n-1-i],hu,n-1-i==0,n-1-i==n-1)) for i,w in enumerate(weights))
    y=np.linspace(-15,15,601);mu=np.array([agg(v) for v in y]);area=np.trapezoid(mu,y)
    if area<1e-14:
        no_cover+=1
        for k in worst:assert abs(case[k])<1e-10
        continue
    expected={'cog':np.trapezoid(y*mu,y)/area,'mom':y[mu>=max(mu)-1e-12].mean()}
    cumulative=np.r_[0,np.cumsum(np.diff(y)*(mu[1:]+mu[:-1])/2)]
    expected['bis']=np.interp(area/2,cumulative,y)
    for k in worst:
        err=abs(expected[k]-case[k]);worst[k]=max(worst[k],err)
        assert err<1e-9,(case,k,expected[k])
    # Independent adaptive continuous quadrature at selected non-degenerate configurations.
    if hs==1 and x in [-5,5]:
        points=sorted(set([-15,15]+list(cu)+[max(-15,min(15,c+sign*hu*(1-w))) for c in cu for w in weights for sign in [-1,1]]))
        exact_a=quad(agg,-15,15,points=points,epsabs=1e-10)[0]
        exact_m=quad(lambda v:v*agg(v),-15,15,points=points,epsabs=1e-10)[0]
        quad_error=max(quad_error,abs(case['cog']-exact_m/exact_a))
        assert abs(case['cog']-exact_m/exact_a)<0.001
# Analytic counterexamples and original hand calculations using independent arithmetic.
assert sum([2.,3.])!=1 and np.dot([2.,3.],[-15.,15.])/5==3
assert abs((1.5*2+1.5*6+.875*10)/3.875-166/31)<1e-14
assert 5.375==5+.1875/.5
assert abs(sum([0,1,4])/3-5/3)<1e-14
assert abs((-6.25)/(4/3)+4.6875)<1e-14
assert -1+2*math.exp(-2.5)<0
samples=[]
for theta,omega in [(-23,1),(-15,70),(20,-50),(5,10),(0,0),(30,120)]:
    tx=np.maximum(0,1-np.abs(theta-np.linspace(-30,30,5))/15)
    tw=np.maximum(0,1-np.abs(omega-np.linspace(-120,120,5))/60)
    tx[0]=1 if theta<=-30 else tx[0];tx[-1]=1 if theta>=30 else tx[-1]
    tw[0]=1 if omega<=-120 else tw[0];tw[-1]=1 if omega>=120 else tw[-1]
    active=[]
    for row in range(5):
        for col in range(5):
            v=-(row-2+.7*(col-2))
            j=int(math.copysign(min(2,math.floor(abs(v)+.5)),v))+2
            if min(tx[row],tw[col])>0:active.append((min(tx[row],tw[col]),j))
    def envelope(v):
        return max(min(w,shoulder(v,[-15,-7.5,0,7.5,15][j],7.5,j==0,j==4)) for w,j in active)
    cuts=sorted(set([-15,-7.5,0,7.5,15]+[max(-15,min(15,[-15,-7.5,0,7.5,15][j]+sgn*7.5*(1-w))) for w,j in active for sgn in [-1,1]]))
    area=quad(envelope,-15,15,points=cuts,epsabs=1e-9,limit=300)[0]
    moment=quad(lambda v:v*envelope(v),-15,15,points=cuts,epsabs=1e-9,limit=300)[0]
    samples.append({'theta':theta,'omega':omega,'cog':moment/area})
result={'pass':True,'twoInputSamples':samples,'configs':len(cases),'maxTsErrors':worst,'noCoverageCases':no_cover,'maxContinuousCogDiscretizationError':quad_error,
        'exercise3':{'area':3.875,'moment':20.75,'cog':166/31,'bis':5.375,'mom':4.,'N13':5.2},'counterexamples':{'unnormalizedSum':5.,'normalizedOutput':3.,'asymmetricCogExact':4/3,'asymmetricCogTrapezoid':1.,'disjointMom':5/3,'extremesMidpoint':2.},'tsDerivativeUpperBound':-1+2*math.exp(-2.5)}
(folder/'reference.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
