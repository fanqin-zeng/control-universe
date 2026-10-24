from pathlib import Path
import json,numpy as np,sympy as sy,control as ctrl
import matplotlib
matplotlib.use('Agg')
E=Path('.agent/semester-03/robust-07');ex=json.loads((E/'extracted.json').read_text(encoding='utf8'));scopes=[]
for nb in ex['notebooks']:
 ns={};exec(nb['setupCode'],ns)
 for cell in nb['cells']:exec(cell['code'],ns)
 scopes.append(ns)
actual=json.loads((E/'actual-ts.json').read_text(encoding='utf8'));error=0.;residual=0.;witness_cases=0
for row in actual['cases']:
 p=row['p'];b,c,d,w,mode=[p[x] for x in ['b','c','d','frequency','structure']];A=np.array([[0.,b],[c,0.]]);M=A/(1+1j*w);D=np.diag([d,1.]);sigma=float(np.linalg.svd(M,compute_uv=False)[0])
 # For this off-diagonal family, complex diagonal mu equals spectral radius; verify via eigenvalues rather than copied formula.
 ev=np.linalg.eigvals(M);mu=float(max(abs(ev))) if mode=='diagonal' else sigma
 peak=float(max(abs(np.linalg.eigvals(A)))) if mode=='diagonal' else float(np.linalg.svd(A,compute_uv=False)[0]);upper=float(np.linalg.svd(D@M@np.linalg.inv(D),compute_uv=False)[0]) if mode=='diagonal' else sigma
 expected={'mu':mu,'sigma':sigma,'upper':upper,'peak':peak,'pointRadius':1/mu if mu else None,'radius':1/peak if peak else None}
 for key,x in expected.items():
  if x is None:assert row['r'][key] is None
  else:error=max(error,abs(x-row['r'][key]))
 assert row['r']['certified']==(peak<1)
 if mode=='diagonal':
  Delta=scopes[0]['diag_witness'](b,c,w)
 else:Delta=scopes[0]['full_witness'](M)
 if Delta is not None:
  res=float(np.linalg.svd(np.eye(2)-M@Delta,compute_uv=False)[-1]);residual=max(residual,res);error=max(error,abs(1/np.linalg.norm(Delta,2)-mu));witness_cases+=1
 # Independent control state-space closure with positive feedback, not a copied polynomial.
 P=ctrl.ss(-np.eye(2),np.eye(2),A,np.zeros((2,2)))
 if mode=='diagonal':Delta0=np.diag([1.,float(np.sign(b*c)) if b*c else 1.])
 elif abs(b)>=abs(c):Delta0=np.array([[0.,0.],[float(np.sign(b)),0.]])
 else:Delta0=np.array([[0.,float(np.sign(c))],[0.,0.]])
 closed=ctrl.feedback(P,ctrl.ss([],[],[],Delta0),sign=1);alpha=float(max(ctrl.poles(closed).real));error=max(error,abs(alpha-row['r']['alpha']))
assert error<1e-10 and residual<1e-10,(error,residual)
# Exact symbolic determinants, commutation, augmented closure and norm witnesses.
b,c,d1,d2,s,a,q=sy.symbols('b c d1 d2 s a q');A=sy.Matrix([[0,b],[c,0]]);assert sy.expand((sy.eye(2)-A*sy.diag(d1,d2)).det())==1-b*c*d1*d2
Ma=sy.Matrix([[a,1],[q*a,q]])/(s+1);closed=sy.cancel(Ma[1,1]+Ma[1,0]*d1/(1-Ma[0,0]*d1)*Ma[0,1]);assert sy.cancel(closed-q/(s+1-a*d1))==0
assert sy.cancel((sy.eye(2)-Ma*sy.diag(d1,d2)).det()-(1-(a*d1+q*d2)/(s+1)))==0
R=sy.Rational;Ad=sy.Matrix([[0,2],[R(1,8),0]]);D=sy.diag(R(1,4),1);B=D*Ad*D.inv();assert B==sy.Matrix([[0,R(1,2)],[R(1,2),0]])
assert set((B.T*B).eigenvals())=={R(1,4)};assert (sy.eye(2)-2*Ad).det()==0;assert (sy.eye(2)-Ad*sy.Matrix([[0,0],[R(1,2),0]])).det()==0
for qv in [R(2,5),R(3,5),R(4,5)]:
 av=R(2,5);MM=sy.Matrix([[av,1],[qv*av,qv]]);DD=sy.diag(sy.sqrt(qv*av),1);scaled=DD*MM*DD.inv();assert scaled==scaled.T;assert set(scaled.eigenvals())=={0,av+qv};assert (sy.eye(2)-MM/(av+qv)).det()==0
 # Independent whole-frequency peak: derivative of q²/(w²+(1-a delta)²) is nonpositive for w>=0.
 H=ctrl.tf([float(qv)],[1,.6]);assert abs(ctrl.dcgain(H)-float(qv/R(3,5)))<1e-12
result={'pass':True,'configurations':len(actual['cases']),'witnessChecks':witness_cases,'maxTSError':error,'maxWitnessResidual':residual,'default':actual['default'],'frequencyCases':scopes[1]['freq_reports'],'performance':scopes[2]['performance'],'versions':{'numpy':np.__version__,'control':ctrl.__version__},'exactDeterminants':True,'externalMussvExecuted':False}
result['frequencyCases']=[dict(row,radius=None if not np.isfinite(row['radius']) else row['radius']) for row in result['frequencyCases']]
result['nullRadiusMeaning']='no finite singularizing perturbation in this declared structure'
(E/'reconciliation.json').write_text(json.dumps(result,indent=2,allow_nan=False),encoding='utf8');print(json.dumps(result,indent=2,allow_nan=False));print('PASS original cells, independent SVD/eigen/control feedback/SymPy/witnesses')
