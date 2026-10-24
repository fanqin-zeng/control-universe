"""Independent SciPy ARE + Lyapunov + IVP, plus polynomial and DARE-iteration checks."""
import json,math
from pathlib import Path
import numpy as np
from scipy.linalg import solve_continuous_are,solve_continuous_lyapunov
from scipy.integrate import solve_ivp
folder=Path('.agent/semester-03/est-03');rows=json.loads((folder/'actual-ts.json').read_text())
maximum=0.;refs=[]
for row in rows:
    q,r=row['q'],row['r']
    p=solve_continuous_are([[-1]],[[1]],[[q]],[[r]]).item();k=p/r
    actual=solve_continuous_lyapunov([[-1-k]],[[-1-k*k]]).item()
    opt=math.sqrt(2)-1
    sol=solve_ivp(lambda t,y:-2*(1+k)*y+1+k*k,[0,5],[1.],t_eval=np.linspace(0,5,101),method='DOP853',rtol=1e-13,atol=1e-14,max_step=.01)
    expected=dict(gain=k,nominal=p,actual=actual,optimal=opt,pole=-1-k)
    for key,val in expected.items():maximum=max(maximum,abs(row[key]-val))
    maximum=max(maximum,float(np.max(np.abs(np.array(row['curve'])[:,1]-sol.y[0]))))
    assert actual>=opt-1e-12
    refs.append(dict(q=q,r=r,**expected))
assert maximum<1e-10,maximum
# Exercise2 eliminate p12,p22 to an independent quartic for p11.
from numpy.polynomial import Polynomial as Poly
x=Poly([0,1]);off=(x*x-1)/2;diag=2*x+(3+x)*off
roots=(-4*off-6*diag-off*off+1).roots()
candidates=[]
A=np.array([[0.,1.],[-2.,-3.]]);C=np.array([[1.,0.]])
for z in roots:
 if abs(z.imag)<1e-9:
  z=z.real;P=np.array([[z,off(z)],[off(z),diag(z)]])
  if np.linalg.eigvalsh(P).min()>0 and np.linalg.eigvals(A-P@C.T@C).real.max()<0:candidates.append(P)
assert len(candidates)==1
P=candidates[0];L=P@C.T
comparison=[]
Lp=np.array([[8.],[4.]]);Fp=A-Lp@C
for label,Qcase in [('low',.1*np.eye(2)),('nominal',np.eye(2)),('tie',np.array([[56.,50.],[50.,92.]]))]:
 offcase=(x*x-Qcase[0,0])/2;diagcase=2*x+(3+x)*offcase-Qcase[0,1]
 selected=[]
 for zz in (-4*offcase-6*diagcase-offcase*offcase+Qcase[1,1]).roots():
  if abs(zz.imag)<1e-8:
   z=zz.real;Pc=np.array([[z,offcase(z)],[offcase(z),diagcase(z)]])
   if np.linalg.eigvalsh(Pc).min()>0 and np.linalg.eigvals(A-Pc@C.T@C).real.max()<0:selected.append(Pc)
 assert len(selected)==1
 Pc=selected[0]
 # Row-major vec(F Sigma + Sigma F.T), independent of Lyapunov solver.
 Sc=np.linalg.solve(np.kron(Fp,np.eye(2))+np.kron(np.eye(2),Fp),-(Qcase+Lp@Lp.T).ravel()).reshape(2,2)
 assert np.trace(Pc)<=np.trace(Sc)+1e-10
 comparison.append(dict(case=label,kalmanTrace=float(np.trace(Pc)),placedTrace=float(np.trace(Sc))))
 if label=='tie':assert np.allclose(Pc,[[8,4],[4,10]]) and abs(np.trace(Sc)-18)<1e-10
assert np.max(abs(P-np.array([[.671963340,-.274232635],[-.274232635,.336954500]])))<1e-9
assert np.max(abs(np.sort_complex(np.linalg.eigvals(A-L@C))-np.array([-1.835981670-.608957054j,-1.835981670+.608957054j])))<1e-8
# Exercise7: fixed-point covariance iteration, no DARE solver.
Ad=np.array([[1.,1.],[0,1.]]);G=np.array([[.5],[1.]]);Q=.25*G@G.T;R=1/900
post=np.eye(2)
for iterations in range(1000):
 prior=Ad@post@Ad.T+Q;K=prior@C.T/(C@prior@C.T+R).item()
 new=prior-K@C@prior
 if np.max(abs(new-post))<1e-14:post=new;break
 post=new
assert iterations<999
assert np.max(abs(K.ravel()-[.988667100,1.596841421]))<1e-9
# Exercise10 polynomial, exact gain from hand-derived roots.
gain=np.array([math.sqrt(10),math.sqrt(1+2*math.sqrt(10))])
poles=np.roots([1,gain[1],gain[0]])
assert abs(poles[0].real+1.353195784)<1e-9 and abs(abs(poles[0].imag)-1.153749899)<1e-9
(folder/'reference-controls.json').write_text(json.dumps(refs,indent=2))
report={'maxDifference':maximum,'methods':['SciPy scalar ARE','Lyapunov covariance','DOP853 mean-square IVP','exercise2 eliminated quartic and Kronecker Lyapunov','exercise7 covariance fixed-point','exercise10 exact characteristic roots'],'exercise2P':P.tolist(),'exercise2Comparisons':comparison,'exercise7Prior':prior.tolist(),'exercise7Posterior':post.tolist(),'exercise7K':K.ravel().tolist(),'exercise7Iterations':iterations+1,'exercise10Poles':[[z.real,z.imag] for z in poles]}
(folder/'reference.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
