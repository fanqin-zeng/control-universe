"""Independent closed Gaussian moments and adaptive real-line posterior integration."""
from pathlib import Path
import json,math
import numpy as np
from scipy.integrate import quad
folder=Path('.agent/semester-03/est-05');raw=json.loads((folder/'actual-ts.json').read_text());maximum=0.;refs=[]
def posterior(mu,p,r,z,kind):
    h=lambda x:x*x if kind=='square' else x
    log=lambda x:-(x-mu)**2/(2*p)-(z-h(x))**2/(2*r)
    roots=np.roots([2*p,0,r-2*p*z,-r*mu]) if kind=='square' else np.array([(r*mu+p*z)/(r+p)])
    stationary=sorted(float(t.real) for t in roots if abs(t.imag)<1e-9);shift=max(log(t) for t in stationary)
    cuts=[-np.inf]+sorted(set(stationary))+[np.inf]
    def integral(n):return sum(quad(lambda x:x**n*math.exp(log(x)-shift),a,b,epsabs=1e-12,epsrel=1e-12,limit=200)[0] for a,b in zip(cuts,cuts[1:]))
    mass=integral(0);mean=integral(1)/mass;variance=integral(2)/mass-mean**2
    return mean,variance,lambda x:math.exp(log(x)-shift)/mass
for row in raw['rows']:
    mu,p,r,z,kind=[row[k] for k in ['mu','priorVariance','noise','observation','kind']]
    # No sigma-point algorithm: use exact Gaussian moments for these two functions.
    hm=mu*mu+p if kind=='square' else mu;v=4*mu*mu*p+2*p*p if kind=='square' else p;C=2*mu*p if kind=='square' else p
    S=v+r;gain=C/S;mean=mu+gain*(z-hm);var=p-C*C/S
    H=2*mu if kind=='square' else 1;ve=1/(1/p+H*H/r);me=ve*(mu/p+H*(z-(mu*mu if kind=='square' else mu)+H*mu)/r)
    refmean,refvar,density=posterior(mu,p,r,z,kind)
    expected=dict(predictedObservation=hm,innovation=z-hm,innovationVariance=S,cross=C,gain=gain,mean=mean,variance=var,referenceMean=refmean,referenceVariance=refvar,ekfMean=me,ekfVariance=ve)
    for k,v in expected.items():maximum=max(maximum,abs(row[k]-v))
    for point in row['curve']:
        x=point['x'];ukf=math.exp(-(x-mean)**2/(2*var))/math.sqrt(2*math.pi*var);ekf=math.exp(-(x-me)**2/(2*ve))/math.sqrt(2*math.pi*ve)
        maximum=max(maximum,abs(point['approximate']-ukf),abs(point['ekf']-ekf),abs(point['reference']-density(x)))
    refs.append(dict(kind=kind,mu=mu,priorVariance=p,noise=r,observation=z,**expected))
# Independently integrate the nonlinear process with Gaussian quadrature.
t,w=np.polynomial.hermite.hermgauss(24);w=w/np.sqrt(np.pi);x=2+np.sqrt(.5)*t;y=x+.1*x*x;m=float(w@y);v=float(w@((y-m)**2))
assert np.allclose([raw['other']['prediction']['mean'],raw['other']['prediction']['variance']],[m,v],atol=1e-12)
assert raw['other']['cube']['mean']==0 and raw['other']['cube']['variance']==1 and abs(w@((np.sqrt(2)*t)**6)-15)<1e-12
assert np.allclose(raw['other']['smallAlpha']['wm'],[-999999,500000,500000],atol=1e-10)
assert raw['other']['invalid']==6
assert maximum<1e-9,maximum
selected=[r for r in refs if (r['kind'],r['mu'],r['priorVariance'],r['noise'],r['observation']) in [('linear',2,.25,1,5),('square',2,.25,1,5),('square',0,1,.25,4),('square',-2,.25,1,5)]]
report={'maxDifference':maximum,'cases':selected,'methods':['closed Gaussian moments, not sigma-point summation','adaptive quad on real line split at stationary cubic roots','precision-form affine conditioning for EKF','24-point Gauss-Hermite for process moments and sixth Gaussian moment']}
(folder/'reference-controls.json').write_text(json.dumps(refs,indent=2));(folder/'reference.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
