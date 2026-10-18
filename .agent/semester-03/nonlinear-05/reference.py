import json,sys
import numpy as np
import sympy as S
from scipy.linalg import expm
from scipy.integrate import solve_ivp
from scipy.optimize import brentq
P=json.load(open(sys.argv[1],encoding='utf-8')); maximum=0.; points=0
for case in P['actual']:
 a=case['a'];A=np.array([[-1/a,1/a],[0.,-2.]])
 for row in case['rows']:
  x1,y=expm(A*row['t'])@np.ones(2);x2=(y-x1)/a;u=(-2*y-x2-a*x1*x2)/a
  for key,val in [('x1',x1),('y',y),('x2',x2),('u',u)]:
   err=abs(row[key]-val)/max(1.,abs(val));maximum=max(maximum,err)
   assert err<2e-10,(a,row['t'],key,err)
  points+=1
x,z=S.symbols('x z',real=True);X=S.Matrix([x,z]);f=S.Matrix([z*(1+x*x),x*z]);g=S.Matrix([0,1+x*x]);br=g.jacobian(X)*f-f.jacobian(X)*g
expected=S.Matrix([-(1+x*x)**2,x*(1+x*x)*(2*z-1)])
assert all(S.simplify(v)==0 for v in br-expected)
assert S.simplify(S.det(S.Matrix.hstack(g,br))-(1+x*x)**3)==0
h=x;Lf=S.Matrix([h]).jacobian(X)*f;Lf2=(Lf.jacobian(X)*f)[0];assert S.simplify(Lf2-x*z*(1+x*x)*(2*z+1))==0
assert S.simplify((Lf.jacobian(X)*g)[0]-(1+x*x)**2)==0
f2=S.Matrix([z,x*z]);g2=S.Matrix([0,1]);h2=x*x;Lf2h=(S.Matrix([h2]).jacobian(X)*f2)[0];Lf22=(S.Matrix([Lf2h]).jacobian(X)*f2)[0]
assert S.simplify(Lf22-(2*z*z+2*x*x*z))==0
assert S.simplify((S.Matrix([Lf22]).jacobian(X)*g2)[0]-(4*z+2*x*x))==0
r,v,th,w,G=S.symbols('r v th w G',real=True,nonzero=True);xx=S.Matrix([r,v,th,w]);ff=S.Matrix([v,r*w*w-G*S.sin(th),w,0]);gg=S.Matrix([0,0,0,1]);hh=S.Matrix([r]);lh=hh.jacobian(xx)*ff;llh=lh.jacobian(xx)*ff
assert S.simplify((llh.jacobian(xx)*gg)[0]-2*r*w)==0
V=S.symbols('V');u=(G*S.sin(th)*w*w-V)/(G*S.cos(th));T=S.Matrix([r,v,-G*S.sin(th),-G*S.cos(th)*w]);dT=T.jacobian(xx)*(ff+gg*u)
assert all(S.simplify(vv)==0 for vv in dT-S.Matrix([v,-G*S.sin(th)+r*w*w,-G*S.cos(th)*w,V]))
assert S.simplify(T.jacobian(xx).det()-G**2*S.cos(th)**2)==0
# Independent error-coordinate integration of the actual controllers.
comparisons=[];maxstate=0.
for case in P['notebooks'][2]:
 t=np.array(case['t']);wn=case['wn'];k1=2*wn;k0=wn**2;kind=case['kind']
 if case.get('tracking'):
  def rhs(t,e):
   qd=.8*np.sin(1.5*t);extra=0 if kind=='IOL' else 12*(np.sin(e[0]+qd)-(e[0]+qd))
   return [e[1],-k1*e[1]-k0*e[0]+extra]
  q=solve_ivp(rhs,[0,20],[0.,0.],method='DOP853',rtol=1e-12,atol=1e-13,t_eval=t,max_step=.05)
  ref=np.column_stack([q.y[0]+.8*np.sin(1.5*t),q.y[1]+1.2*np.cos(1.5*t)])
 else:
  def rhs(t,e):return [e[1],-k1*e[1]-k0*e[0]+(0 if kind=='IOL' else 12*(np.sin(e[0])-e[0]))]
  q=solve_ivp(rhs,[0,case['T']],[case['x0'],0.],method='DOP853',rtol=1e-12,atol=1e-13,t_eval=t,max_step=.05)
  ref=q.y.T
 assert q.success and abs(q.t[-1]-t[-1])<1e-12
 err=float(np.max(np.abs(ref-np.array(case['x']))));maxstate=max(maxstate,err);assert err<2e-7
 comparisons.append({k:val for k,val in case.items() if k not in ('t','x')})
# Ball beam: integrate exact closed loop in z coordinates, independently of original x ODE.
case=P['notebooks'][3];tt=np.array(case['t']);gnum=9.81
z0=np.array([.4,0.,-gnum*np.sin(.35),0.])
def ball(t,z):
 theta=-np.arcsin(z[2]/gnum);omega=-z[3]/(gnum*np.cos(theta))
 return [z[1],z[2]+z[0]*omega**2,z[3],-16*z[0]-32*z[1]-24*z[2]-8*z[3]]
sol=solve_ivp(ball,[0,12],z0,method='DOP853',rtol=1e-12,atol=1e-13,t_eval=tt,max_step=.01)
assert sol.success
ref=sol.y.T;theta=-np.arcsin(ref[:,2]/gnum);omega=-ref[:,3]/(gnum*np.cos(theta));ref=np.column_stack([ref[:,:2],theta,omega]);errball=float(np.max(np.abs(ref-np.array(case['x']))));assert errball<2e-7
assert P['notebooks'][0]['maxError']<1e-9
for row in P['notebooks'][1]:assert abs(row['slope']+1/row['a'])<5e-5
print(json.dumps(dict(pass_=True,cases=40,points=points,maxComponentRelativeError=maximum,symbolicChecks=9,maxPendulumStateError=maxstate,maxBallStateError=errball,pendulum=comparisons,ball={k:v for k,v in case.items() if k not in ('t','x','u')},ballRange=[float(np.min(ref[:,2])),float(np.max(ref[:,2]))],ballMaxInput=float(np.max(np.abs(case['u']))))))
