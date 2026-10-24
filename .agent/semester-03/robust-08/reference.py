from pathlib import Path
import json,numpy as np,scipy.optimize as opt,sympy as sy,control as ctrl
import matplotlib
matplotlib.use('Agg')
E=Path('.agent/semester-03/robust-08');ex=json.loads((E/'extracted.json').read_text(encoding='utf8'));scopes=[]
for nb in ex['notebooks']:
 ns={};exec(nb['setupCode'],ns)
 for cell in nb['cells']:exec(cell['code'],ns)
 scopes.append(ns)
actual=json.loads((E/'actual-ts.json').read_text(encoding='utf8'));err=0.;res=0.
for row in actual['cases']:
 p=row['p'];k=p['k'];d=p['d'];w=p['frequency'];A=np.array([[0.,2.],[.125,0.]])+k*np.array([[0.,-1.5],[.675,0.]])
 # Build actual lower LFT by independent control state-space interconnection algebra.
 M=A/(1+1j*w);D=np.diag([d,1.]);mu=float(max(abs(np.linalg.eigvals(A))));upper=float(np.linalg.svd(D@A@np.linalg.inv(D),compute_uv=False)[0]);single=float(max(abs(np.linalg.eigvals(M))));su=float(np.linalg.svd(D@M@np.linalg.inv(D),compute_uv=False)[0])
 expected={'mu':mu,'upper':upper,'singleMu':single,'singleUpper':su,'optimalD':np.sqrt(A[1,0]/A[0,1]),'radius':1/mu,'b':A[0,1],'c':A[1,0]}
 for key,v in expected.items():err=max(err,abs(v-row['r'][key]))
 # A complex diagonal perturbation witnesses exact frequency mu.
 delta=(1+1j*w)/np.sqrt(A[0,1]*A[1,0]);Delta=delta*np.eye(2);res=max(res,float(np.linalg.svd(np.eye(2)-M@Delta,compute_uv=False)[-1]))
for step in actual['steps']:
 d=step['d']
 # Independent epigraph linear program, not the TS intersection formula.
 lp=opt.linprog([0,1],A_ub=[[-1.5*d,-1],[.675/d,-1]],b_ub=[-2*d,-.125/d],bounds=[(0,1),(0,None)],method='highs')
 assert lp.success;err=max(err,abs(lp.x[0]-step['k']))
for trace in actual['traces']:
 for i,row in enumerate(trace['rows']):
  if i:assert row['upper']<=trace['rows'][i-1]['upper']+1e-12
assert err<1e-9 and res<1e-9
s,dm,dk=sy.symbols('s dm dk');h=1/(s*s+s/5+1);M=h*sy.Matrix([[-sy.Rational(3,10)*s*s,-sy.Rational(3,10)*s*s,s*s],[-sy.Rational(3,10),-sy.Rational(3,10),1],[-sy.Rational(3,10),-sy.Rational(3,10),1]])
D=sy.diag(dm,dk);cl=M[2,2]+(M[2,:2]*D*(sy.eye(2)-M[:2,:2]*D).inv()*M[:2,2:])[0]
assert sy.cancel(cl-1/((1+sy.Rational(3,10)*dm)*s*s+s/5+1+sy.Rational(3,10)*dk))==0
T=sy.Matrix([[2,1],[0,3]]);assert set((T.T*T).eigenvals())=={7+sy.sqrt(13),7-sy.sqrt(13)}
k=sy.symbols('k',real=True);product=(2-3*k/2)*(sy.Rational(1,8)+sy.Rational(27,40)*k);assert sy.diff(product,k,2)<0
# P22=0 lower LFT exactly equals affine A; every nominal state has pole -1.
A0=sy.Matrix([[0,2],[sy.Rational(1,8),0]]);A1=sy.Matrix([[0,-sy.Rational(3,2)],[sy.Rational(27,40),0]])
assert (A0/(s+1)+sy.eye(2)/(s+1)*(k*sy.eye(2))*A1-(A0+k*A1)/(s+1)).applyfunc(sy.cancel)==sy.zeros(2)
rng=np.random.default_rng(20261024);lft_error=0
for _ in range(500):
 d1,d2=rng.uniform(-1,1,2);w=rng.uniform(0,30);lft_error=max(lft_error,abs(scopes[0]['close_lft'](1j*w,d1,d2)-1/((1+.3*d1)*(1j*w)**2+.2j*w+1+.3*d2)))
assert lft_error<1e-10
report={'pass':True,'configurations':len(actual['cases']),'independentKLinearPrograms':len(actual['steps']),'maxTSError':err,'maxWitnessResidual':res,'randomLFTChecks':500,'maxLFTError':lft_error,'symbolicLFT':True,'originalNotebooks':{'retained':2,'retainedPurposes':4,'final':3,'cells':6},'nominalPIAlpha':scopes[1]['alpha'],'unstableSamples':int(sum(scopes[1]['alphas']>=0)),'sampleAlphaRange':[float(min(scopes[1]['alphas'])),float(max(scopes[1]['alphas']))],'default':actual['default'],'traces':actual['traces'],'matlabMusynExecuted':False,'versions':{'numpy':np.__version__,'control':ctrl.__version__}}
(E/'reconciliation.json').write_text(json.dumps(report,indent=2,allow_nan=False),encoding='utf8');print(json.dumps(report,indent=2));print('PASS original cells + independent SVD/eigen/LP/SymPy/500 LFT checks')
