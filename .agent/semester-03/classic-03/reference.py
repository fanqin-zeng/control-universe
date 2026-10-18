import numpy as np
from scipy.linalg import expm, eig
from scipy.signal import StateSpace, step, impulse
from scipy.optimize import brentq, minimize_scalar

def state(z,wn,road=False):
    return np.array([[0.,1.],[-wn*wn,-2*z*wn]]),np.array([0.,1.]),np.array([wn*wn,2*z*wn if road else 0.])

def at(z,wn,t,road=False):
    A,B,C=state(z,wn,road)
    return float(C@np.linalg.solve(A,(expm(A*t)-np.eye(2))@B))

def settle(z,wn,road=False,band=.02):
    if z==0:return None
    A,B,C=state(z,wn,road)
    if z==1:
        tail=lambda t:(1+wn*t)*np.exp(-wn*t)
    else:
        vals,V=eig(A)
        # Independent modal bound on the initial displacement from equilibrium.
        coef=(C@V)*np.linalg.solve(V,np.linalg.solve(A,B))
        tail=lambda t:float(np.sum(abs(coef)*np.exp(np.real(vals)*t)))
    end=1/wn
    while tail(end)>.01:end*=2
    times=np.linspace(0,end,int(np.ceil(end*wn/.01))+1)
    _,ys=step(StateSpace(A,B[:,None],C[None,:],[[0.]]),T=times)
    bad=np.flatnonzero(abs(ys-1)>band)
    if not len(bad):return 0.
    j=bad[-1]
    assert j<len(times)-1
    return float(brentq(lambda t:abs(at(z,wn,t,road)-1)-band,times[j],times[j+1],xtol=1e-12))

def metrics(z,wn,road=False):
    ts=settle(z,wn,road)
    if z==0:return dict(tp=None,mp=None,tr=None,ts=None)
    A,B,C=state(z,wn,road)
    # Derivative of the forced step is the impulse C exp(At) B.
    deriv=lambda t:float(C@expm(A*t)@B)
    if not road and z>=1:tp=None;mp=0.
    else:
        grid=np.linspace(1e-9,(2*np.pi/(wn*np.sqrt(1-z*z))) if not road and z<1 else 20/wn,2001)
        signs=[deriv(t) for t in grid]
        j=next(i for i in range(1,len(grid)) if signs[i]<=0<signs[i-1])
        tp=float(brentq(deriv,grid[j-1],grid[j],xtol=1e-13));mp=100*(at(z,wn,tp,road)-1)
    tr=(float(brentq(lambda t:at(z,wn,t)-1,1e-12,tp)) if z<.95 else float((np.pi-np.arctan2(np.sqrt(1-z*z),z))/(wn*np.sqrt(1-z*z)))) if not road and z<1 else None
    return dict(tp=tp,mp=mp,tr=tr,ts=ts)

if __name__=='__main__':
    import json
    cases=[]
    for z in [0.,.05,.1,.3,.5,.707,.95,.999,1.,1.001,1.5,2.]:
        for wn in [1.,8.,10.]:
            A,B,C=state(z,wn)
            t=np.linspace(0,15,1501)
            _,y=step(StateSpace(A,B[:,None],C[None,:],[[0.]]),T=t)
            tc=np.linspace(0,3,601)
            _,h=impulse(StateSpace(A,B[:,None],C[None,:],[[0.]]),T=tc)
            Ar,Br,Cr=state(z,wn,True)
            _,road=step(StateSpace(Ar,Br[:,None],Cr[None,:],[[0.]]),T=tc)
            cases.append(dict(zeta=z,wn=wn,step=np.c_[t,y].tolist(),impulse=np.c_[tc,h].tolist(),road=np.c_[tc,road].tolist(),metrics=metrics(z,wn),roadMetrics=metrics(z,wn,True)))
    print(json.dumps(dict(cases=cases)))
