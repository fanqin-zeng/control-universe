import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize_scalar
G=np.array([1.,-1.,1.,-1.])
w=np.array([1.,1.,2.,2.])
S=np.array([[0.,0.],[0.,0.],[-1.,0.],[1.,0.]])
F=np.array([2.,-2.])
regions=[
 dict(id='R0',A=np.array([[-1,1],[1,-1],[1,1],[-1,-1]]),b=np.array([2,2,4,4]),K=np.array([-.5,.5]),c=0.,active=None,polygon=[[-3,-1],[-1,-3],[3,1],[1,3]]),
 dict(id='R1',A=np.array([[1,-1],[1,0]]),b=np.array([-2,1]),K=np.zeros(2),c=1.,active=0,polygon=[[-3,-1],[1,3],[-3,3]]),
 dict(id='R2',A=np.array([[-1,1],[-1,0]]),b=np.array([-2,1]),K=np.zeros(2),c=-1.,active=1,polygon=[[-1,-3],[3,-3],[3,1]]),
 dict(id='R3',A=np.array([[-1,-1],[-1,0]]),b=np.array([-4,-1]),K=np.array([-1.,0.]),c=2.,active=2,polygon=[[1,3],[3,1],[3,3]]),
 dict(id='R4',A=np.array([[1,1],[1,0]]),b=np.array([-4,-1]),K=np.array([-1.,0.]),c=-2.,active=3,polygon=[[-3,-3],[-1,-3],[-3,-1]])
]
def lookup(x,r,tol=0):
    if abs(x)>3 or abs(r)>3:return None
    theta=np.array([x,r]);hits=[p for p in regions if np.all(p['A']@theta<=p['b']+tol)]
    if not hits:return None
    p=hits[0];u=float(p['K']@theta+p['c'])
    lam=np.zeros(4)
    if p['active'] is not None:
        i=p['active'];lam[i]=-(4*u+F@theta)/G[i]
    slack=w+S@theta-G*u
    residual=max(0.,float(max(-slack)),float(max(-lam)),float(abs(4*u+F@theta+G@lam)),float(max(abs(lam*slack))))
    return dict(region=p['id'],hits=[p['id'] for p in hits],u=u,next=x+u,cost=(x+u-r)**2+u*u,slack=slack,lam=lam,residual=residual,violation=max(0.,float(max(-slack))))
def original_qp(x,r):
    lower=max(-1.,-2.-x);upper=min(1.,2.-x)
    if lower>upper:return None
    cost=lambda u:(x+u-r)**2+u*u
    if lower==upper:u=lower
    else:
        opt=minimize_scalar(cost,bounds=(lower,upper),method='bounded',options={'xatol':1e-12})
        if not opt.success:raise RuntimeError(opt.message)
        u=min([lower,upper,opt.x],key=cost)
    return dict(u=u,next=x+u,cost=cost(u))
def area(vertices):
    a=np.array(vertices);return abs(float(np.sum(a[:,0]*np.roll(a[:,1],-1)-a[:,1]*np.roll(a[:,0],-1)))/2)
