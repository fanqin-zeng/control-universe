"""Independent SciPy logsumexp/searchsorted and adaptive integration of the probability model."""
from pathlib import Path
import json,math
from functools import lru_cache
import numpy as np
from scipy.integrate import quad
from scipy.special import logsumexp
folder=Path('.agent/semester-03/est-06');data=json.loads((folder/'actual-ts.json').read_text(encoding='utf8'));maximum=0.;cdf_error=0.;references=[]
def moments(x,w):
    mean=float(np.average(x,weights=w))
    return dict(mean=mean,variance=float(np.average((x-mean)**2,weights=w)),negativeMass=float(w[x<0].sum()),ess=float(1/(w@w)))
@lru_cache(None)
def truth(mu,r,z):
    log=lambda x:-(x-mu)**2/2-(z-x*x)**2/(2*r)
    stationary=sorted(float(t.real) for t in np.roots([2,0,r-2*z,-r*mu]) if abs(t.imag)<1e-9);shift=max(log(t) for t in stationary)
    def integral(n,upper=np.inf):
        cuts=[-np.inf]+[t for t in sorted(set(stationary)) if t<upper]+[upper]
        return sum(quad(lambda x:x**n*math.exp(log(x)-shift),a,b,epsabs=1e-12,epsrel=1e-12,limit=200)[0] for a,b in zip(cuts,cuts[1:]))
    mass=integral(0);mean=integral(1)/mass
    return dict(mean=mean,variance=integral(2)/mass-mean*mean,negativeMass=integral(0,0)/mass,curve=[[-6+i/20,integral(0,-6+i/20)/mass] for i in range(241)])
for row in data['rows']:
    x=np.asarray(row['particles']);logs=-(row['observation']-x*x)**2/(2*row['noise']);w=np.exp(logs-logsumexp(logs));n=len(x)
    maximum=max(maximum,float(np.max(abs(w-np.asarray(row['weights'])))))
    cumulative=np.cumsum(w);cumulative[-1]=1.;anc=np.searchsorted(cumulative,row['offset']+np.arange(n)/n,side='right')
    assert anc.tolist()==row['ancestors']
    before=moments(x,w);after=moments(x[anc],np.full(n,1/n));assert row['uniqueAncestors']==len(np.unique(anc))
    for key in before:maximum=max(maximum,abs(row['before'][key]-before[key]),abs(row['after'][key]-after[key]))
    for name,values,weights in [('weightedCurve',x,w),('resampledCurve',x[anc],np.full(n,1/n))]:
        for a,cdf in row[name]:cdf_error=max(cdf_error,abs(cdf-float(weights[values<=a].sum())))
    if row['mode']=='gaussian':ref=truth(row['mu'],row['noise'],row['observation'])
    else:ref={**before,'curve':row['weightedCurve']}
    for k in ['mean','variance','negativeMass']:maximum=max(maximum,abs(row['reference'][k]-ref[k]))
    if row['mode']=='gaussian':
        for (_,a),(_,b) in zip(row['reference']['curve'],ref['curve']):cdf_error=max(cdf_error,abs(a-b))
    references.append(dict(mode=row['mode'],count=n,mu=row['mu'],noise=row['noise'],observation=row['observation'],seed=row['seed'],before=before,after=after,uniqueAncestors=len(np.unique(anc)),reference={k:ref[k] for k in ['mean','variance','negativeMass']}))
assert maximum<1e-9,maximum
assert cdf_error<1e-6,cdf_error
assert data['other']['rejected']==8 and data['other']['zeroWeights']==[1,1] and data['other']['boundary']==[0,1]
assert np.allclose(data['other']['underflow'],np.exp(np.array([-1000,-1001])-logsumexp([-1000,-1001])),atol=1e-12)
# Reproduce only the stated RNG stream, separately from the independent weight arithmetic.
for row in data['rows']:
    if row['mode']!='gaussian':continue
    state=row['seed']
    def uniform():
        global state
        state^=(state<<13)&0xffffffff;state^=state>>17;state^=(state<<5)&0xffffffff;state&=0xffffffff
        return (state+.5)/4294967296
    expected=[row['mu']+math.sqrt(-2*math.log(uniform()))*math.cos(2*math.pi*uniform()) for _ in row['particles']]
    assert np.max(abs(np.asarray(expected)-row['particles']))<1e-12
    assert abs(uniform()/row['count']-row['offset'])<1e-15
report=dict(maxDifference=maximum,maxCdfDifference=cdf_error,configurations=len(references),methods=['SciPy logsumexp/weighted average','NumPy cumulative searchsorted for ancestor indices','adaptive real-line integration split at stationary roots','separate xorshift32/Box-Muller sequence reproducibility check'])
(folder/'reference-controls.json').write_text(json.dumps(references,indent=2),encoding='utf8');(folder/'reference.json').write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report))
