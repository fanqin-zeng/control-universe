import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize_scalar, minimize

def step(x,u,linear=False,dt=.1):
    def f(z):return np.array([z[1],-9.81*(z[0] if linear else np.sin(z[0]))+u])
    a=f(x);b=f(x+dt*a/2);c=f(x+dt*b/2);d=f(x+dt*c)
    return x+dt*(a+2*b+2*c+d)/6

def shooting(theta,u,N=8,Q=10,linear=False,omega=0):
    x=np.array([theta,omega]);xs=[x.copy()];rs=[]
    for k in range(N):
        x=step(x,u,linear);xs.append(x.copy());rs.extend([np.sqrt(Q)*x[0],np.sqrt(.1)*x[1],np.sqrt(.1)*u])
    r=np.array(rs);return r@r,np.array(xs),r

def derivatives(theta,u,N=8,Q=10,linear=False,omega=0):
    value,xs,r=shooting(theta,u,N,Q,linear,omega)
    jac=np.imag(shooting(theta,u+1e-25j,N,Q,linear,omega)[2])/1e-25
    return float(value),float(2*jac@r),float(2*jac@jac+1e-8)

def sqp(theta,N=8,Q=10,limit=5,budget=60,initial=0,linear=False,omega=0):
    clip=lambda z:float(np.clip(z,-limit,limit));u=clip(initial);history=[];used=0
    for k in range(budget):
        value,g,H=derivatives(theta,u,N,Q,linear,omega);history.append(value)
        if abs(u-clip(u-g))<1e-6:break
        direction=clip(u-g/H)-u;alpha=1;accepted=False
        for j in range(20):
            trial=u+alpha*direction
            if shooting(theta,trial,N,Q,linear,omega)[0]<=value+1e-4*alpha*g*direction:u=trial;accepted=True;break
            alpha/=2
        used+=1
        if not accepted:break
    value,g,H=derivatives(theta,u,N,Q,linear,omega)
    return dict(u=u,cost=value,pg=abs(u-clip(u-g)),used=used,xs=shooting(theta,u,N,Q,linear,omega)[1],history=history)

def original(theta,N=8,Q=10,limit=5,linear=False,omega=0):
    # Independent scalar original-NLP search. Report numerical reference, not certified global optimum.
    f=lambda u:float(shooting(theta,u,N,Q,linear,omega)[0])
    grid=np.linspace(-limit,limit,81);vals=np.array([f(u) for u in grid]);candidates=[(f(-limit),-limit),(f(limit),limit)]
    for i in range(1,80):
        if i in [1,79] or (vals[i]<=vals[i-1] and vals[i]<=vals[i+1]):
            result=minimize_scalar(f,bounds=(grid[i-1],grid[i+1]),method='bounded',options={'xatol':1e-11})
            assert result.success;candidates.append((result.fun,result.x))
    value,u=min(candidates);return dict(u=u,cost=value)
