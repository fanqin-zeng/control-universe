"""Quadrature coefficients + complex reconstruction, independent of TS cosine/sine sums."""
import json, math
import numpy as np
import scipy
from scipy.integrate import quad
cache={}
def prepare(mode,amp,phase,terms):
    key=(mode,amp,phase,terms) if mode=='vibration' else (mode,terms)
    if key in cache:return cache[key]
    coeff=[]
    ns=[1,3] if mode=='vibration' else list(range(1,2*terms,2))
    for n in ns:
        if mode=='vibration':
            f=lambda t:math.cos(2*math.pi*t)+amp*math.cos(6*math.pi*t+phase*math.pi/180)
            re=quad(lambda t:f(t)*math.cos(2*math.pi*n*t),0,1,epsabs=1e-12,epsrel=1e-12)[0]
            im=quad(lambda t:-f(t)*math.sin(2*math.pi*n*t),0,1,epsabs=1e-12,epsrel=1e-12)[0]
        else:
            re=quad(lambda t:math.cos(2*math.pi*n*t),0,.5,epsabs=1e-12)[0]-quad(lambda t:math.cos(2*math.pi*n*t),.5,1,epsabs=1e-12)[0]
            im=-quad(lambda t:math.sin(2*math.pi*n*t),0,.5,epsabs=1e-12)[0]+quad(lambda t:math.sin(2*math.pi*n*t),.5,1,epsabs=1e-12)[0]
        coeff.append(complex(re,im))
    ns=np.array(ns);coeff=np.array(coeff)
    def signal(t):return float(2*np.real(np.sum(coeff*np.exp(2j*np.pi*ns*t))))
    def at(t):
        v=signal(t)
        target=v if mode=='vibration' else (0 if t in [0,.5,1] else (1 if t<.5 else -1))
        return [float(t),v,target]
    ms=quad(lambda t:signal(t)**2,0,1,points=np.linspace(0,1,61)[1:-1],epsabs=1e-12,epsrel=1e-12,limit=300)[0]
    result=dict(at=at,meanSquare=ms,rms=math.sqrt(ms),harmonics=np.column_stack([ns,2*np.abs(coeff)]).tolist(),samples=[at(i/600) for i in range(601)])
    cache[key]=result
    return result
times=[0,1/6,.25,.5,.95,1]
parameters=[('vibration',amp,phase,3,t) for amp in [0,.5,1] for phase in [-180,-90,0,90,180] for t in times]
parameters += [('square',.5,0,N,t) for N in [1,3,7,15] for t in times]
cases=[]
for mode,amp,phase,N,t in parameters:
    r=prepare(mode,amp,phase,N);current=r['at'](t)
    cases.append(dict(mode=mode,amplitude=amp,phase=phase,terms=N,time=t,value=current[1],target=current[2],meanSquare=r['meanSquare'],rms=r['rms'],harmonics=r['harmonics'],samples=r['samples']))
def transform(f,w,intervals):
    real=sum(quad(lambda t:f(t)*math.cos(w*t),a,b,epsabs=1e-12,epsrel=1e-12,limit=500)[0] for a,b in intervals)
    imag=sum(quad(lambda t:-f(t)*math.sin(w*t),a,b,epsabs=1e-12,epsrel=1e-12,limit=500)[0] for a,b in intervals)
    return complex(real,imag)
checks=[]
for w in [-3,-1,0,1,3,2*math.pi]:
    specs=[('even',lambda t:math.exp(-abs(t)),[(-np.inf,0),(0,np.inf)],2/(1+w*w)),
        ('box',lambda t:1,[(-1,1)],2 if w==0 else 2*math.sin(w)/w),
        ('delay',lambda t:math.exp(-abs(t-2)),[(-np.inf,2),(2,np.inf)],np.exp(-2j*w)*2/(1+w*w)),
        ('H',lambda t:math.exp(-t),[(0,np.inf)],1/(1+1j*w)),
        ('continuous',lambda t:t*math.exp(-t),[(0,np.inf)],1/(1+1j*w)**2),
        ('derivative',lambda t:(1-t)*math.exp(-t),[(0,np.inf)],1j*w/(1+1j*w)**2)]
    for name,f,intervals,expected in specs:
        actual=transform(f,w,intervals);error=abs(actual-expected);assert error<1e-10,(name,w,error)
        checks.append(dict(name=name,omega=w,actual=[actual.real,actual.imag],error=error))
inverse0=quad(lambda w:2/(1+w*w),-np.inf,np.inf,epsabs=1e-12,epsrel=1e-12)[0]/(2*math.pi)
assert abs(inverse0-1)<1e-10
print(json.dumps(dict(versions=dict(numpy=np.__version__,scipy=scipy.__version__),cases=cases,transformChecks=checks,inverseAtZero=inverse0)))
