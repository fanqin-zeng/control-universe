import numpy as np
import matplotlib.pyplot as plt
from scipy.linalg import expm
from scipy.optimize import minimize,LinearConstraint,linprog,nnls
from scipy.integrate import solve_ivp

beta=50000/239;gamma=50000/23900
Ac=np.array([[-2.,-1/28],[beta,-1+beta/28-gamma]])
Bc=np.array([[.005,0],[0,gamma]])
block=np.zeros((4,4));block[:2,:2]=Ac;block[:2,2:]=Bc
disc=expm(.1*block);Ad=disc[:2,:2];Bd=disc[:2,2:]
defaults=dict(N=10,q=1.,r=1.,step=2.,rate=2.,feed=.9)
def derivative(x,u,feed=1.):
    ca,T=x;F,Tc=u;k=np.exp(25-8750/T)
    return np.array([F/100*(feed-ca)-k*ca,F/100*(350-T)+beta*k*ca-gamma*(T-Tc)])

def problem(x,previous,c):
    A=np.eye(2);S=np.zeros((2,2));base=[];gain=[];du=previous-np.array([100,300])
    for j in range(c['N']):A=Ad@A;S=Ad@S+Bd;base.append(A@(x-np.array([.5,350]))+S@du);gain.append(S.copy())
    base=np.array(base);gain=np.array(gain);target=np.array([0,c['step']]);Q=np.diag([400*c['q'],.04*c['q']]);R=np.diag([.01*c['r'],.04*c['r']])
    lower=np.maximum(np.array([80,280])-previous,-c['rate']);upper=np.minimum(np.array([120,320])-previous,c['rate'])
    G=np.vstack([np.eye(2),-np.eye(2),gain[:,1,:]]);h=np.r_[upper,-lower,5-base[:,1]]
    def objective(v):
        errors=base+gain@v-target
        return np.einsum('ni,ij,nj->',errors,Q,errors)+v@R@v
    def jac(v):return 2*np.einsum('nki,kl,nl->i',gain,Q,base+gain@v-target)+2*R@v
    return dict(base=base,gain=gain,G=G,h=h,objective=objective,jac=jac)

def original_plan(x,previous,c):
    p=problem(x,previous,c);feas=linprog(np.zeros(2),A_ub=p['G'],b_ub=p['h'],bounds=[(None,None)]*2,method='highs')
    if not feas.success:return None
    ans=minimize(p['objective'],feas.x,jac=p['jac'],constraints=[LinearConstraint(p['G'],-np.inf,p['h'])],method='SLSQP',options=dict(ftol=1e-10,maxiter=500))
    # Polish the active set found by SLSQP using the original residual-gradient KKT system.
    f=p['jac'](np.zeros(2));H=np.column_stack([p['jac'](e)-f for e in np.eye(2)])
    active=np.flatnonzero(p['h']-p['G']@ans.x<1e-5);Ga=p['G'][active]
    K=np.block([[H,Ga.T],[Ga,np.zeros((len(active),len(active)))]])
    solution=np.linalg.lstsq(K,np.r_[-f,p['h'][active]],rcond=None)[0];v=solution[:2]
    assert max(p['G']@v-p['h'])<1e-7,(ans.message,x,c)
    _,res=nnls(Ga.T,-p['jac'](v)) if len(active) else ([],np.linalg.norm(p['jac'](v)))
    assert res<1e-6,(ans.message,res,x,c)
    return dict(v=v,u=previous+v,cost=p['objective'](v),pred=p['base']+p['gain']@v+np.array([.5,350]),problem=p)

def simulate(c=defaults):
    x=np.array([.5,350.]);previous=np.array([100.,300.]);states=[x.copy()];controls=[];plans=[]
    for k in range(40):
        p=original_plan(x,previous,c)
        if p is None:return dict(x=np.array(states),u=np.array(controls),plans=plans,stopped=k)
        feed=c['feed'] if k>=20 else 1.
        sol=solve_ivp(lambda t,z:derivative(z,p['u'],feed),(0,.1),x,method='DOP853',rtol=1e-11,atol=1e-12)
        assert sol.success;x=sol.y[:,-1];previous=p['u'];states.append(x.copy());controls.append(previous.copy());plans.append(p)
    return dict(x=np.array(states),u=np.array(controls),plans=plans,stopped=None)
