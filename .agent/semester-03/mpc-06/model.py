import numpy as np
import matplotlib.pyplot as plt
from fractions import Fraction

def dio(coeff, horizon):
    degree=len(coeff)-1
    f=np.zeros(degree); f[0]=1
    e=[]; result=[]
    for j in range(1,horizon+1):
        lead=f[0]; e.append(lead)
        f=np.r_[f[1:],0]-lead*np.asarray(coeff[1:])
        result.append((np.array(e),f.copy()))
    return result

def predict(y,previous_y,past,du,horizon,a=.9048,b=.0952,delay=3):
    # past[0]=actual u(k-1), ..., past[d-1]=u(k-d).
    offset=y-a*previous_y-b*past[delay-1]
    levels={-i-1:float(v) for i,v in enumerate(past)}
    current=past[0]
    for i in range(horizon):
        current+=du[i] if i<len(du) else 0.
        levels[i]=current
    z=float(y); out=[]
    for j in range(1,horizon+1):
        z=a*z+b*levels[j-delay]+offset;out.append(z)
    return np.array(out)

def matrices(N1=3,N2=10,Nu=3,a=.9048,b=.0952,delay=3):
    return np.stack([predict(0,0,np.zeros(delay),v,N2,a,b,delay) for v in np.eye(Nu)],axis=1)[N1-1:]

def plan(y=0,previous_y=0,past=None,N1=3,N2=10,Nu=3,lam=.1,delay=3,a=.9048,b=.0952,W=None):
    if past is None:past=np.zeros(delay)
    G=matrices(N1,N2,Nu,a,b,delay)
    f=predict(y,previous_y,past,np.zeros(Nu),N2,a,b,delay)[N1-1:]
    if W is None:W=np.ones(N2-N1+1)
    aug=np.vstack([G,np.sqrt(lam)*np.eye(Nu)])
    du=np.linalg.lstsq(aug,np.r_[W-f,np.zeros(Nu)],rcond=None)[0]
    gradient=2*(G.T@(G@du+f-W)+lam*du)
    if np.max(abs(gradient))>1e-8:raise RuntimeError('Normal-equation residual too large')
    return dict(G=G,f=f,du=du,cost=float(np.sum((G@du+f-W)**2)+lam*du@du),gradient=float(max(abs(gradient))))

def simulate(N1=3,N2=15,Nu=3,lam=.1,steps=80,schedule='two'):
    # Future schedule is explicitly assumed known. No finite reference array is indexed.
    def reference(t):return (0. if t<10 else 1. if t<50 else .5) if schedule=='two' else (0. if t<5 else 1.)
    output=[0.]; inputs=[]; plans=[]
    for k in range(steps):
        y=output[-1];previous_y=output[-2] if k else 0.
        past=np.array([inputs[k-i-1] if k-i-1>=0 else 0. for i in range(3)])
        W=np.array([reference(k+j) for j in range(N1,N2+1)])
        r=plan(y,previous_y,past,N1,N2,Nu,lam,W=W)
        action=past[0]+r['du'][0]
        inputs.append(float(action))
        # y(k+1)=a*y(k)+b*u(k-2); first response to u(0) is y(3).
        applied=inputs[k-2] if k>=2 else 0.
        output.append(.9048*y+.0952*applied)
        plans.append(dict(k=k,y=y,previous_y=previous_y,past=past.tolist(),du=r['du'].tolist(),W=W.tolist()))
    return dict(y=np.array(output),u=np.array(inputs),reference=np.array([reference(t) for t in range(steps+1)]),plans=plans)
