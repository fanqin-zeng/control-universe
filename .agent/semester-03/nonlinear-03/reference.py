import json,sys
import numpy as np
from scipy.integrate import solve_ivp
from scipy.linalg import expm
cases=json.load(open(sys.argv[1],encoding='utf-8'))
worst=0.;drift=0.;allpoints=0
for c in cases:
    data=np.array(c['samples']); t=data[:,0];y=data[:,1:3]
    assert len(t)==1501 and t[0]==0 and t[-1]==60 and np.max(abs(np.diff(t)-.04))<1e-12
    d,q,w=c['d'],c['theta'],c['omega']
    ref=solve_ivp(lambda t,z:[z[1],-np.sin(z[0])-d*z[1]],[0,60],[q,w],method='DOP853',t_eval=t,rtol=1e-12,atol=1e-13)
    assert ref.success
    error=float(np.max(abs(y-ref.y.T)));worst=max(worst,error)
    assert error<2e-5,(d,q,w,error)
    E=.5*y[:,1]**2+1-np.cos(y[:,0]);assert np.max(abs(E-data[:,3]))<1e-12
    assert np.max(abs(y[:,1]))<4 and np.max(E)<6.6
    assert np.max(np.diff(E))<1e-6
    if d==0:drift=max(drift,float(np.max(abs(E-E[0]))));assert np.max(abs(E-E[0]))<1e-6
    allpoints+=len(t)
import sympy as sp
x,v,c,d=sp.symbols('x v c d', real=True)
def along(V,f):return sp.simplify(sp.diff(V,x)*f[0]+sp.diff(V,v)*f[1])
assert sp.simplify((along(v*v/2+x*x/2+x**4/4,[v,-c*v-x-x**3]))-(-c*v*v)) == 0
assert sp.simplify((along(v*v/2+1-sp.cos(x),[v,-sp.sin(x)-d*v]))-(-d*v*v)) == 0
assert sp.simplify((along(x*x+v*v,[v,-x-v*(1-x*x)]))-(-2*v*v*(1-x*x))) == 0
assert sp.simplify((along(x*x+v*v+x**4/2,[v,-x-v-x**3]))-(-2*v*v)) == 0
assert sp.simplify((along(x*x+v*v,[v,-x-v+x*v]))-(-2*v*v*(1-x))) == 0
assert sp.simplify((along(x*x+v*v,[v,-x-v**3]))-(-2*v**4)) == 0
P=np.array([[2.25,.5],[.5,2.]])
A=np.array([[0.,1.],[-1.,-.5]])
assert np.max(abs(A.T@P+P@A+np.eye(2)))<1e-12
assert np.min(np.linalg.eigvalsh(P))>0
J,kp,kd=50.,20.,30.
y0=np.array([1.6,0.]);t=np.linspace(0,40,801)
ref=solve_ivp(lambda t,z:[z[1],(-kp*z[0]-kd*z[1])/J],[0,40],y0,t_eval=t,rtol=1e-11,atol=1e-12)
exact=np.array([expm(np.array([[0.,1.],[-kp/J,-kd/J]])*z)@y0 for z in t])
assert np.max(abs(exact-ref.y.T))<1e-9
print(json.dumps({'pass':True,'cases':len(cases),'points':allpoints,'maxStateError':worst,'maxConservativeDrift':drift,'symbolicIdentities':6,'lyapunovResidual':0.0,'pdExpmError':float(np.max(abs(exact-ref.y.T)))}))
