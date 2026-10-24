from pathlib import Path
import json,numpy as np,sympy as sy,control as ctrl
from scipy.linalg import solve_continuous_lyapunov,solve_continuous_are
from scipy.optimize import minimize_scalar
from scipy.integrate import quad
import matplotlib
matplotlib.use('Agg')
E=Path('.agent/semester-03/robust-09');ex=json.loads((E/'extracted.json').read_text(encoding='utf8'));scopes=[]
for nb in ex['notebooks']:
 ns={};exec(nb['setupCode'],ns)
 for cell in nb['cells']:exec(cell['code'],ns)
 scopes.append(ns)
actual=json.loads((E/'actual-ts.json').read_text(encoding='utf8'));err=0.;pulse_err=0.;optimizations=0;stable_count=0
for row in actual['cases']:
 p=row['p'];a,L,q,r=[p[k] for k in ['a','gain','q','r']];A=np.array([[a-L]]);B=np.array([[np.sqrt(q),-L*np.sqrt(r)]]);stable=bool(max(np.linalg.eigvals(A).real)<0)
 assert row['r']['stable']==stable
 P=solve_continuous_are([[a]],[[1]],[[q]],[[r]])[0,0];err=max(err,abs(P/r-row['r']['kalmanGain']))
 if stable:
  stable_count+=1
  dc=np.linalg.solve(-A,B);peak=float(np.linalg.svd(dc,compute_uv=False)[0]);variance=float(solve_continuous_lyapunov(A,-B@B.T)[0,0]);err=max(err,abs(peak-row['r']['peak']),abs(variance-row['r']['variance']),abs(-2/A[0,0]-row['r']['eulerLimit']))
  for f in row['frequencies']:
   G=np.linalg.solve(1j*f['w']*np.eye(1)-A,B);value=float(np.linalg.svd(G,compute_uv=False)[0]);err=max(err,abs(value-f['value']))
  for pulse in row['pulses']:
   T=pulse['T'];rate=-A[0,0];b=np.linalg.norm(B)
   # Independent time-domain quadrature including an analytically integrated tail.
   energy=quad(lambda t:(b/rate*(-np.expm1(-rate*t)))**2,0,T,epsabs=1e-11)[0]+(b/rate*(-np.expm1(-rate*T)))**2/(2*rate)
   pulse_err=max(pulse_err,abs(np.sqrt(energy/T)-pulse['value']))
 else:
  assert row['r']['peak'] is None and row['r']['variance'] is None
  assert all(f['value'] is None for f in row['frequencies']);assert all(v['value'] is None for v in row['pulses'])
 if a<0:
  candidate=row['r']['hinfGain'];v=minimize_scalar(lambda k:np.linalg.svd(np.linalg.solve(np.array([[k-a]]),np.array([[np.sqrt(q),-k*np.sqrt(r)]])),compute_uv=False)[0],bounds=(max(0,a+1e-6),max(8,3*candidate+1)),method='bounded',options={'xatol':1e-10})
  optimum=float(v.fun);err=max(err,abs(optimum-row['r']['bestPeak']));assert abs(v.x-candidate)<1e-5*max(1,candidate),(v.x,candidate);optimizations+=1
 else:assert row['r']['hinfGain'] is None and row['r']['finiteOptimum'] is False
assert err<1e-9 and pulse_err<1e-9,(err,pulse_err)
# Exact symbolic derivatives and the scalar Schur-complement certificate.
L,a,q,r,p,g=sy.symbols('L a q r p g',real=True);F=(q+r*L*L)/(L-a)**2;assert sy.cancel(sy.diff(F,L)+2*(r*a*L+q)/(L-a)**3)==0
V=(q+r*L*L)/(2*(L-a));assert sy.cancel(sy.diff(V,L)-(r*L*L-2*r*a*L-q)/(2*(L-a)**2))==0
assert sy.cancel(F.subs(L,-q/(r*a))-q*r/(q+r*a*a))==0
certificate=np.array([[-1.5,.25,-.5],[.25,-.25,0],[-.5,0,-.25]]);assert np.linalg.eigvalsh(certificate).max()<0
result={'pass':True,'configurations':len(actual['cases']),'stableConfigurations':stable_count,'independentScalarOptimizations':optimizations,'maxTSError':err,'maxCompleteTailPulseError':pulse_err,'default':actual['default'],'comparison':scopes[1]['comparison'],'pulses':scopes[1]['pulse_reports'],'certificateEigenvalues':np.linalg.eigvalsh(certificate).tolist(),'newNotebooks':3,'newCells':5,'externalGeneralFilterSolverExecuted':False,'versions':{'numpy':np.__version__,'control':ctrl.__version__},'symbolicDerivativeAndSchur':True}
(E/'reconciliation.json').write_text(json.dumps(result,indent=2,allow_nan=False),encoding='utf8');print(json.dumps(result,indent=2));print('PASS original setup/cells + independent SVD/CARE/Lyapunov/optimization/quadrature/SymPy')
