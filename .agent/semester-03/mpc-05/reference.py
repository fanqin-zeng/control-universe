from pathlib import Path
import json,numpy as np
from fractions import Fraction as F
from scipy.optimize import linprog,nnls
d=Path('.agent/semester-03/mpc-05'); cases=json.loads((d/'actual-ts.json').read_text(encoding='utf8'))
max_kkt=0.;max_gap=0.;feasible=0;infeasible=0;cache={}
def states(x,u):
    out=[x]
    for action in u:out.append(1.2*out[-1]+action)
    return np.array(out)
def cost(x,u):
    z=states(x,u)
    return sum(a*a+b*b for a,b in zip(z[:-1],u))+17/8*z[-1]**2
def inequalities(x,u,r):
    z=states(x,u)
    return np.r_[np.array(u)-1,-np.array(u)-1,z[1]-3,-z[1]-3,z[-1]-r,-z[-1]-r]
def certify(x,r,result):
    global max_kkt,max_gap
    zero=np.zeros(2);g0=inequalities(x,zero,r)
    A=np.stack([inequalities(x,e,r)-g0 for e in np.eye(2)],axis=1);b=-g0
    # Metadata uses interleaved upper/lower input rows; independent simulation uses grouped signs.
    order=[0,2,1,3,4,5,6,7]
    c0=cost(x,zero);f=np.array([(cost(x,e)-cost(x,-e))/2 for e in np.eye(2)])
    H=np.empty((2,2))
    for i in range(2):
        for j in range(2):
            e=np.eye(2)[i];v=np.eye(2)[j]
            H[i,j]=(cost(x,e+v)-cost(x,e-v)-cost(x,-e+v)+cost(x,-e-v))/4
    lp=linprog([0,0],A_ub=A,b_ub=b,bounds=[(None,None)]*2,method='highs')
    assert result['feasible']==lp.success,(x,r,lp.message)
    if not lp.success:assert lp.status==2;return
    u=np.array(result['u']);lam=np.array(result['lambda'])[order]
    slack=b-A@u;grad=H@u+f
    residual=max(0.,max(-slack),max(-lam),max(abs(grad+A.T@lam)),max(abs(lam*slack)))
    dual=c0-.5*(f+A.T@lam)@np.linalg.solve(H,f+A.T@lam)-b@lam
    gap=abs(cost(x,u)-dual)
    max_kkt=max(max_kkt,residual);max_gap=max(max_gap,gap)
    assert residual<1e-8 and gap<1e-8,(x,r,residual,gap)
    assert np.allclose(result['states'],states(x,u),atol=1e-10)
    assert abs(result['cost']-cost(x,u))<1e-9
    assert np.max(abs(np.array(result['H'])-H))<1e-10
for c in cases:
    x,r,w=c['x'],c['radius'],c['w'];v=c['result'];p=v['plan'];k=(x,r)
    if k not in cache:certify(x,r,p);cache[k]=p
    if not p['feasible']:infeasible+=1;continue
    feasible+=1
    u=np.array(p['u']);z=states(x,u);shift=[u[1],-.6*z[-1]];measurement=z[1]+w
    zs=states(measurement,shift);violation=max(0.,max(abs(zs)-3),max(abs(np.array(shift))-1),abs(zs[-1])-r)
    assert np.allclose(v['shift'],shift) and np.allclose(v['candidateStates'],zs)
    assert abs(v['candidateCost']-cost(measurement,shift))<1e-9 and abs(v['violation']-violation)<1e-9
    if v['next'] is not None:certify(measurement,r,v['next'])
    else:assert abs(measurement)>3
    if w==0:
        assert violation<1e-8 and v['next']['feasible']
        assert v['next']['cost']<=p['cost']-(x*x+u[0]**2)+1e-8
assert F(17,8)*(1-F(3,5)**2)==1+F(3,5)**2
assert (F(1)+1)/F(6,5)==F(5,3)
assert (F(5,3)+1)/F(6,5)==F(20,9)
envs=[]
for nb in json.loads((d/'extracted.json').read_text(encoding='utf8'))['notebooks']:
    env={};exec(nb['setupCode'],env)
    for cell in nb['cells']:exec(cell['code'],env)
    envs.append(env)
e=envs[1]
for p in e['plans']:
    x=p['x'];u=np.array(p['u']);z=states(x,u)
    constraints=inequalities(x,np.zeros(2),1)
    A=np.stack([inequalities(x,v,1)-constraints for v in np.eye(2)],axis=1);b=-constraints
    delta=1e-20;g=np.array([np.imag(cost(x,u.astype(complex)+1j*delta*v))/delta for v in np.eye(2)])
    active=np.where(b-A@u<1e-7)[0];lam=np.zeros(8)
    if len(active):lam[active]=nnls(A[active].T,-g)[0]
    assert max(abs(g+A.T@lam))<1e-5
report={'pass':True,'cases':len(cases),'feasible':feasible,'infeasible':infeasible,'maxIndependentKKT':max_kkt,'maxIndependentDualityGap':max_gap,'closedLoopQP':len(e['plans']),'sourceMaxKKT':max(e['residuals']),'sourceMaxDescentResidual':float(max(e['descent'])),'lastSample':e['trajectory'][-1]}
(d/'reconciliation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
