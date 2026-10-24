"""Independent adaptive integration over the real line, split at log-density stationary points."""
from pathlib import Path
import json,math
import numpy as np
from scipy.integrate import quad
folder=Path('.agent/semester-03/est-04');raw=json.loads((folder/'actual-ts.json').read_text());maximum=0.;refs=[]
def posterior(mu,p,r,z,kind):
    h=lambda x:x*x if kind=='square' else x
    log=lambda x:-(x-mu)**2/(2*p)-(z-h(x))**2/(2*r)
    roots=np.roots([2*p,0,r-2*p*z,-r*mu]) if kind=='square' else np.array([(r*mu+p*z)/(r+p)])
    stationary=sorted(float(t.real) for t in roots if abs(t.imag)<1e-9)
    shift=max(log(t) for t in stationary)
    cuts=[-np.inf]+sorted(set(stationary))+[np.inf]
    def integral(n):return sum(quad(lambda x:(x**n)*math.exp(log(x)-shift),a,b,epsabs=1e-12,epsrel=1e-12,limit=200)[0] for a,b in zip(cuts,cuts[1:]))
    mass=integral(0);mean=integral(1)/mass;variance=integral(2)/mass-mean**2
    return mean,variance,lambda x:math.exp(log(x)-shift)/mass
for row in raw['rows']:
    mu,p,r,z,kind=[row[k] for k in ['mu','priorVariance','noise','observation','kind']]
    H=2*mu if kind=='square' else 1;hm=mu*mu if kind=='square' else mu
    # Scalar Gaussian conditioning of the affine observation, independent closed form.
    var=1/(1/p+H*H/r);mean=var*(mu/p+H*(z-hm+H*mu)/r);gain=var*H/r
    refmean,refvar,density=posterior(mu,p,r,z,kind)
    expected=dict(jacobian=H,predictedObservation=hm,innovation=z-hm,innovationVariance=H*H*p+r,gain=gain,mean=mean,variance=var,referenceMean=refmean,referenceVariance=refvar,conditionalRisk=refvar+(mean-refmean)**2)
    for k,v in expected.items():maximum=max(maximum,abs(row[k]-v))
    for point in row['curve']:
        x=point['x'];approx=math.exp(-(x-mean)**2/(2*var))/math.sqrt(2*math.pi*var)
        maximum=max(maximum,abs(point['approximate']-approx),abs(point['reference']-density(x)))
    refs.append(dict(kind=kind,mu=mu,priorVariance=p,noise=r,observation=z,**expected))
assert maximum<1e-9,maximum
assert raw['other']['singular'] is None
assert np.allclose(raw['other']['radar']['jacobian'],[[.6,.8],[-.16,.12]],atol=1e-12)
# Independent finite differences, including range/bearing orientation.
eps=1e-6
measurement=lambda x,y:np.array([math.hypot(x,y),math.atan2(y,x)])
finite=np.column_stack([(measurement(3+eps,4)-measurement(3-eps,4))/(2*eps),(measurement(3,4+eps)-measurement(3,4-eps))/(2*eps)])
assert np.max(abs(finite-np.array(raw['other']['radar']['jacobian'])))<1e-9
assert np.allclose(list(raw['other']['prediction'].values()),[1.4,2.4,.53])
for row in raw['other']['wrap']:
    expected=((row['degrees']+180)%360-180)*math.pi/180
    assert abs(math.sin(row['value'])-math.sin(expected))<1e-12 and abs(math.cos(row['value'])-math.cos(expected))<1e-12
selected=[r for r in refs if (r['kind'],r['mu'],r['priorVariance'],r['noise'],r['observation']) in [('linear',2,.25,1,5),('square',2,.25,1,5),('square',0,1,.25,4),('square',-2,.25,1,5)]]
report={'maxDifference':maximum,'cases':selected,'methods':['adaptive quad on real line split at stationary cubic roots','affine Gaussian precision conditioning','radar central finite differences','angle modular reference']}
(folder/'reference-controls.json').write_text(json.dumps(refs,indent=2));(folder/'reference.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
