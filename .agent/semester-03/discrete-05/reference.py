import json,sys,math
import numpy as np
import mpmath as mp
from scipy.linalg import expm
from scipy.optimize import brentq
mp.mp.dps=60
cases=json.load(open(sys.argv[1],encoding='utf8'));max_error=0
for item in cases:
    a,b=map(lambda x:mp.mpf(str(x)),item['params']);r=item['result']
    d=mp.sqrt(a*a-4*b);roots=[(-a+d)/2,(-a-d)/2]
    actual=sorted(r['roots']);expected=sorted([[float(mp.re(z)),float(mp.im(z))] for z in roots])
    for x,y in zip(np.array(actual).ravel(),np.array(expected).ravel()):
        max_error=max(max_error,abs(x-y));assert abs(x-y)<1e-12
    A=mp.matrix([[-a,-b],[1,0]]);init=mp.matrix([0,1])
    for k,row in enumerate(r['samples']):
        value=mp.mpf(1) if k==0 else ((A**(k-1))*init)[0]
        # Large unstable trajectories are compared with a relative bound.
        assert abs(mp.mpf(row[1])-value)<=mp.mpf('2e-12')*max(1,abs(value))
    assert abs(r['radius']-float(max(map(abs,roots))))<1e-12
    assert np.allclose(r['conditions'],[float(1+a+b),float(1-a+b),float(1-abs(b))],atol=1e-14,rtol=0)

def zoh(A,B,T):
    n=len(A);aug=np.zeros((n+1,n+1));aug[:n,:n]=A;aug[:n,n:]=B
    E=expm(aug*T);return E[:n,:n],E[:n,n:]
def controller(T,filtered=False,ki=1,kp=2):
    if filtered:
        A=np.diag([0.,-50.]);B=np.array([[1.],[50.]]);C=np.array([[2.,-25.]]);D=30.
    else:A=np.zeros((1,1));B=np.ones((1,1));C=np.array([[ki]]);D=kp
    R=np.linalg.inv(np.eye(len(A))-T*A/2)
    return R@(np.eye(len(A))+T*A/2),R@(T*B),C@R,float(D+(T/2*C@R@B)[0,0])
def closed(Ap,Bp,Cp,Ac,Bc,Cc,Dc):
    A=np.block([[Ap-Bp*Dc@Cp,Bp@Cc],[-Bc@Cp,Ac]])
    B=np.vstack([Bp*Dc,Bc]);C=np.hstack([Cp,np.zeros((1,len(Ac)))])
    return A,B,C
def radius(A):return float(max(abs(np.linalg.eigvals(A))))
def pm(H,upper):
    grid=np.geomspace(1e-5,upper,3001);v=np.log([abs(H(w)) for w in grid]);idx=np.where(v[:-1]*v[1:]<0)[0]
    if not len(idx):return float('nan'),float('nan')
    assert len(idx)==1;i=idx[0]
    w=brentq(lambda x:math.log(abs(H(x))),grid[i],grid[i+1],xtol=1e-12)
    angle=np.angle(H(w),deg=True)
    # All specified loops have a negative physical phase at their one crossover.
    if angle>0: angle-=360
    return float(180+angle),float(w)
def plant1(T):
    # Exact transfer function from the two sampled step-response residues.
    p=math.exp(-T)
    return lambda z:((T-1+p)*z+(1-p-T*p))/((z-1)*(z-p))
def loop1(T):
    G=plant1(T);return lambda w:G(np.exp(1j*w*T))*(2+(T/2)*(np.exp(1j*w*T)+1)/(np.exp(1j*w*T)-1))
def state1(T):
    Ap,Bp=zoh(np.array([[0.,1.],[0.,-1.]]),np.array([[0.],[1.]]),T)
    return closed(Ap,Bp,np.array([[1.,0.]]),*controller(T))
metrics=[];responses=[]
for T in [.01,.05,.1,.5,1.,2.]:
    A,B,C=state1(T);p,w=pm(loop1(T),np.pi/T*(1-1e-8));metrics.append([T,radius(A),p,w])
    x=np.zeros(len(A));ys=[];time=np.arange(int(30/T)+1)*T
    for t in time:ys.append(float((C@x)[0]));x=A@x+B[:,0]
    responses.append([time.tolist(),ys])
critical=brentq(lambda T:radius(state1(T)[0])-1,.1,1,xtol=1e-12)
Ap3=np.array([[0.,1.,0.],[0.,0.,1.],[0.,-2.,-3.]]);Bp3=np.array([[0.],[0.],[1.]]);Cp3=np.array([[1.,0.,0.]])
def rho3(T,K):
    A,B=zoh(Ap3,Bp3,T);return radius(A-K*B@Cp3)
boundary=brentq(lambda T:rho3(T,1)-1,5,10,xtol=1e-12)
oldradii=[rho3(T,10) for T in np.linspace(.1,2,50)]
newradii=[rho3(T,1) for T in [.5*boundary,boundary,1.5*boundary]]
filtered=[];curves=[]
for T in [.01,.05,.1,.2]:
    Ap,Bp=zoh(np.array([[0.,1.],[-10.,-2.]]),np.array([[0.],[10.]]),T);Cp=np.array([[1.,0.]])
    def H(w):
        z=np.exp(1j*w*T);ss=2/T*(z-1)/(z+1)
        g=(Cp@np.linalg.solve(z*np.eye(2)-Ap,Bp))[0,0]
        return complex(g*(5+2/ss+.5*ss/(.02*ss+1)))
    phase,wgc=pm(H,np.pi/T*(1-1e-8))
    grid=np.geomspace(.01,np.pi/T*(1-1e-6),5001)
    imag=np.array([H(w).imag for w in grid]);pc=[]
    for i in np.where(imag[:-1]*imag[1:]<0)[0]:
        w=brentq(lambda w:H(w).imag,grid[i],grid[i+1],xtol=1e-12)
        if H(w).real<0:pc.append((1/abs(H(w)),w))
    gm,wpc=min(pc,key=lambda pair:abs(math.log(pair[0])))
    A,_,_=closed(Ap,Bp,Cp,*controller(T,True));filtered.append([T,gm,phase,wpc,wgc,radius(A)])
    w=np.geomspace(.01,np.pi/T*(1-1e-6),700);hz=np.array([H(x) for x in w]);curves.append([w.tolist(),hz.real.tolist(),hz.imag.tolist()])
wcq=math.sqrt((3+math.sqrt(10))/2);pmq=180+np.angle((2j*wcq+.5)/(1j*wcq*(1+1j*wcq)),deg=True)
def qpm(T):
    p=math.exp(-T)
    def H(w):
        z=np.exp(1j*w*T);return (1-p)/(z-p)*(2+.5*T/2*(z+1)/(z-1))
    return pm(H,np.pi/T*(1-1e-8))[0]
limit=brentq(lambda T:pmq-qpm(T)-10,.001,.4,xtol=1e-12)
estimate=20*np.pi/180/wcq
import sympy as sp
A=sp.Matrix([[sp.Rational(3,2),-sp.Rational(7,10)],[1,0]])
p,q,r=sp.symbols('p q r');P=sp.Matrix([[p,q],[q,r]]);eq=A.T*P*A-P+sp.eye(2)
sol=sp.solve([eq[0,0],eq[0,1],eq[1,1]],[p,q,r]);P=np.array(P.subs(sol)).astype(float)
result=dict(defaultRoots=[[.75,math.sqrt(.55)/2],[.75,-math.sqrt(.55)/2]],pass_=True,tsCases=len(cases),maxRootError=max_error,metrics=metrics,responses=responses,critical=critical,oldradii=oldradii,boundary=boundary,newradii=newradii,filtered=filtered,curves=curves,Ply=P.tolist(),limit=limit,estimate=estimate,pmq=float(pmq),wcq=wcq,qLoss=[float(pmq-qpm(x)) for x in [.19,.2,estimate]])
print(json.dumps(result))
