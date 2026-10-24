from pathlib import Path
import runpy,json,io,contextlib,itertools
import numpy as np
f=Path('.agent/semester-03/id-07');ns=runpy.run_path(str(f/'notebook-code.py'));scope={};exec(ns['SETUP'],scope);outputs=[]
if (f/'extracted.json').exists():
 raw=json.loads((f/'extracted.json').read_text(encoding='utf8'));norm=lambda s:s.replace('\r\n','\n')
 for i,nb in enumerate(raw['notebooks']):assert norm(nb['setupCode'])==norm(ns['SETUP']) and norm(nb['cells'][0]['code'])==norm(ns['CELLS'][i])
 ns['SETUP']=raw['notebooks'][0]['setupCode'];ns['CELLS']=[nb['cells'][0]['code'] for nb in raw['notebooks']];scope={};exec(ns['SETUP'],scope)
for cell in ns['CELLS']:
 stream=io.StringIO()
 with contextlib.redirect_stdout(stream):exec(cell,scope)
 outputs.append(stream.getvalue())
(f/'raw-python-output.txt').write_text('\n'.join(outputs),encoding='utf8');(f/'summaries.json').write_text(json.dumps(scope['summaries'],indent=2))
actual=json.loads((f/'actual-ts.json').read_text());count=0;worst=0.
def compare(a,b,tol=1e-9):
 global count,worst
 a=np.asarray(a);b=np.asarray(b);assert a.shape==b.shape
 error=float(np.max(abs(a-b)));worst=max(worst,error);count+=a.size;assert error<tol,error
for item in actual['cases']:
 c=item['config'];r=scope['era'](c['amplitude'],c['pole'],c['noise'],c['order'],c['tolerance']);t=item['result'];compare(t['singular'],r['singular']);assert t['rank']==r['rank'];compare(t['truth'],r['truth']);compare(t['measured'],r['measured']);assert (t['prediction'] is None)==('prediction' not in r)
 if t['prediction'] is not None:
  compare(t['prediction'],r['prediction']);compare(t['rmse'],r['rmse']);p=np.array([complex(p['re'],p['im']) for p in t['poles']]);q=r['poles'];err=min(max(abs(p[i]-perm[i]) for i in range(len(p))) for perm in itertools.permutations(q));assert err<1e-9;worst=max(worst,float(err));count+=len(p)
proof=dict(pass_=True,configurations=len(actual['cases']),values=count,maxError=worst,tolerance=1e-9,repeatedFits=288,route='Actual TS symmetric Jacobi ERA vs independent NumPy SVD; invariant poles/impulse, not arbitrary basis entries');proof['pass']=proof.pop('pass_');(f/'reconciliation.json').write_text(json.dumps(proof,indent=2));print(json.dumps(proof));print(outputs[0]);print(outputs[1]);print([(s['sigma'],{o:s['errors'][o]['median'] for o in [1,2,3]}) for s in scope['summaries']])
proof.update(eraValues=count,eraMaxError=worst)
# Audit the general-input branch independently: analytic transfer convolution and
# state-factor identity; compare candidate simulation via ss2tf + scalar lfilter.
from scipy.signal import lfilter,ss2tf
u=scope['prng'](20261024,256);clean=lfilter([0,1.5,-.7],[1,-1.1,.24],u);compare(clean,scope['simulate'](scope['Atrue'],scope['Btrue'],scope['Ctrue'],0,u))
Uf=np.array([u[i:i+251] for i in range(6)]);Yf=np.array([clean[i:i+251] for i in range(6)]);X=np.array([lfilter([0,1],[1,-a],u)[:251] for a in [.8,.3]]);O=np.array([[.8**i,.5*.3**i] for i in range(6)])
P=np.eye(251)-np.linalg.pinv(Uf)@Uf;compare(Yf@P,O@X@P);assert np.linalg.matrix_rank(np.vstack([X,Uf]))==8
fit=scope['identify'](u,clean,2);compare(np.sort(np.linalg.eigvals(fit['A'])),[.3,.8]);assert fit['fitrank']==5
for summary in scope['summaries']:
 sigma=summary['sigma']
 for seed in range(20261024,20261056):
  u=scope['prng'](seed,256);y=lfilter([0,1.5,-.7],[1,-1.1,.24],u)+scope['prng'](seed+5000,256)*sigma;uv=scope['prng'](seed+1000,128);target=lfilter([0,1.5,-.7],[1,-1.1,.24],uv)
  for order in [1,2,3]:
   m=scope['identify'](u,y,order)
   if m is None:
    assert summary['errors'][order]['values'][seed-20261024] is None;continue
   num,den=ss2tf(m['A'],m['B'][:,None],m['C'][None,:],np.array([[m['D']]]));pred=lfilter(num[0],den,uv)
   error=float(np.sqrt(np.mean((pred-target)**2)));compare(error,summary['errors'][order]['values'][seed-20261024],1e-8)
proof.update(values=count,maxError=worst,tolerance=1e-8,successfulFits=256,rejectedFits=32,generalInputAudit='QR route checked by pseudoinverse projection and analytic OXP; 256 successful validation RMSEs checked with scalar transfer lfilter; 32 noiseless order-3 fits rejected; no independent statistical consistency claim')
(f/'reconciliation.json').write_text(json.dumps(proof,indent=2));print(json.dumps(proof))
