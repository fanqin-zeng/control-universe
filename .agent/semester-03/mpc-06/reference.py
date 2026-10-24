from pathlib import Path
import numpy as np,json
from fractions import Fraction as F
from functools import lru_cache
d=Path('.agent/semester-03/mpc-06');data=json.loads((d/'actual-ts.json').read_text(encoding='utf8'))
max_prediction=0.;max_solution=0.;max_gradient=0.;singular=0
@lru_cache(None)
def lifted(delay,horizon,nu):
    # Independent absolute-input realization: output, delayed input history, constant offset.
    a,b=.9048,.0952;n=delay+2;A=np.zeros((n,n));B=np.zeros(n)
    A[0,0]=a;A[0,-1]=1
    if delay==1:B[0]=b
    else:A[0,delay-1]=b
    B[1]=1
    for i in range(2,delay+1):A[i,i-1]=1
    A[-1,-1]=1
    powers=[np.linalg.matrix_power(A,j) for j in range(horizon+1)]
    Phi=np.stack([p[0] for p in powers[1:]])
    T=np.zeros((horizon,horizon))
    for j in range(1,horizon+1):
        for t in range(j):T[j-1,t]=(powers[j-1-t]@B)[0]
    L=np.array([[float(t>=m) for m in range(nu)] for t in range(horizon)])
    return Phi,T,T@L,A,B
for c in data['cases']:
    r=c['result'];N1,N2,Nu,delay=r['N1'],r['N2'],r['Nu'],r['delay'];lam=r['lambda'];past=np.array(r['pastInputs'])
    Phi,T,fullG,A,B=lifted(delay,N2,Nu)
    offset=r['y']-.9048*r['previousY']-.0952*past[delay-1]
    state=np.r_[r['y'],past[:delay],offset]
    fullf=Phi@state+T@np.full(N2,past[0]);G=fullG[N1-1:];f=fullf[N1-1:]
    error=max(np.max(abs(fullf-r['free'])),np.max(abs(fullG-r['fullG'])))
    max_prediction=max(max_prediction,error);assert error<1e-10
    aug=np.vstack([G,np.sqrt(lam)*np.eye(Nu)]);rhs=np.r_[1-f,np.zeros(Nu)]
    rank=np.linalg.matrix_rank(aug,tol=1e-10)
    if not r['solved']:assert lam==0 and rank<Nu;singular+=1;continue
    assert rank==Nu
    du=np.linalg.lstsq(aug,rhs,rcond=None)[0];actual=np.array(r['du'])
    error=np.max(abs(du-actual));gradient=np.max(abs(2*aug.T@(aug@actual-rhs)))
    max_solution=max(max_solution,error);max_gradient=max(max_gradient,gradient)
    assert error<1e-8 and gradient<1e-8
    assert np.allclose(fullf+fullG@actual,r['prediction'],atol=1e-10)
    assert abs(np.linalg.norm(aug@actual-rhs)**2-r['cost'])<1e-9
for p in data['polys']:
    a=list(map(lambda x:F(str(x)),p['a']));e=[]
    for j,r in enumerate(p['result'],1):
        n=j-1;e.append((F(1) if n==0 else F(0))-sum(a[i]*e[n-i] for i in range(1,min(n,len(a)-1)+1)))
        convolution=[sum(e[k]*a[t-k] for k in range(len(e)) if 0<=t-k<len(a)) for t in range(len(e)+len(a)-1)]
        remainder=[(F(1) if t==0 else F(0))-v for t,v in enumerate(convolution)]
        assert all(v==0 for v in remainder[:j])
        ef=np.array(list(map(float,e)));ff=np.array(list(map(float,remainder[j:])))
        assert np.max(abs(ef-r['E']))<1e-10 and np.max(abs(ff-r['F']))<1e-10
envs=[]
for nb in json.loads((d/'extracted.json').read_text(encoding='utf8'))['notebooks']:
    env={};exec(nb['setupCode'],env)
    for cell in nb['cells']:exec(cell['code'],env)
    envs.append(env)
source=envs[2];runs=[source['run80'],*source['runs60'].values()];max_loop=0.;count=0
for run in runs:
    nu=len(run['plans'][0]['du']);lam=.1 if len(run['plans'])==80 else next(k for k,v in source['runs60'].items() if v is run)
    Phi,T,G,A,B=lifted(3,15,nu);G=G[2:]
    physical=np.zeros(5)
    for p in run['plans']:
        past=np.array(p['past']);offset=p['y']-.9048*p['previous_y']-.0952*past[2]
        state=np.r_[p['y'],past,offset];f=(Phi@state+T@np.full(15,past[0]))[2:]
        augmented=np.vstack([G,np.sqrt(lam)*np.eye(nu)]);rhs=np.r_[np.array(p['W'])-f,np.zeros(nu)]
        optimal=np.linalg.lstsq(augmented,rhs,rcond=None)[0]
        error=np.max(abs(optimal-p['du']));max_loop=max(max_loop,error);assert error<1e-7
        k=p['k'];action=run['u'][k]
        physical=A@physical+B*action
        assert abs(physical[0]-run['y'][k+1])<1e-10
        count+=1
report={'pass':True,'cases':len(data['cases']),'singularWithoutUniqueAction':singular,'maxPredictionError':max_prediction,'maxSolutionError':max_solution,'maxGradientResidual':max_gradient,'independentPolynomialIdentities':32,'closedLoopQP':count,'maxClosedLoopPlanError':max_loop,'legacy80LastSample':float(source['run80']['y'][-1]),'legacy60LastSamples':{str(k):float(v['y'][-1]) for k,v in source['runs60'].items()}}
(d/'reconciliation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
