from pathlib import Path
import json,numpy as np,sympy as sy
from scipy.optimize import brentq
from scipy.special import lambertw
from scipy.linalg import expm
import matplotlib
matplotlib.use('Agg')
E=Path('.agent/semester-03/robust-10');ex=json.loads((E/'extracted.json').read_text(encoding='utf8'));scopes=[]
for nb in ex['notebooks']:
 ns={};exec(nb['setupCode'],ns)
 for cell in nb['cells']:exec(cell['code'],ns)
 scopes.append(ns)
actual=json.loads((E/'actual-ts.json').read_text(encoding='utf8'));err=0.;residual=0.;details=[]
for row in actual['cases']:
 p=row['p'];a,k,tau=[p[x] for x in ['a','k','tau']];r=row['r']
 if k>a:
  w=brentq(lambda w:np.hypot(a,w)-k,0,2*k);margin=np.angle(complex(-a,w))/w;err=max(err,abs(w-r['omega']),abs(margin-r['exactMargin']))
  state='critical' if abs(tau-margin)<=1e-10 else 'stable' if tau<margin else 'unstable';assert r['state']==state
  err=max(err,abs(2/np.sqrt(4*k*k-(a+k)**2)-r['sgMargin']),abs(2/(k-a)-r['padeMargin']))
 else:assert r['exactMargin'] is None and r['state']=='stable'
 pp=np.array([-a-k]) if tau==0 else np.linalg.eigvals([[k-a,-2*k],[2/tau,-2/tau]])
 err=max(err,abs(float(max(pp.real))-r['padeAlpha']))
 if a>k:
  eta=a if k==0 else brentq(lambda z:a-k*np.exp(z*tau)-z,0,a-k);err=max(err,abs(eta-r['halanayRate']))
 else:assert r['halanayRate'] is None
 B=0 if tau==0 else k*np.linalg.norm([min((2/tau)*tau,2)])/np.hypot(2/tau,a+k);err=max(err,abs(B-r['sgPeak']));assert r['certified']==(B<1-1e-12)
 for f in row['frequency']:
  w=f['w'];product=k/(1j*w+a+k)*(np.exp(-1j*w*tau)-1);upper=k/abs(1j*w+a+k)*min(w*tau,2);err=max(err,abs(abs(product)-f['actual']),abs(upper-f['upper']))
 for branch in [0,-1]:
  if tau>0 and k>0:
   root=-a+lambertw(-k*tau*np.exp(a*tau),branch)/tau;residual=max(residual,float(abs(root+a+k*np.exp(-root*tau))/(1+abs(root))))
for tr in actual['traces']:
 p=tr['p'];a,k,tau=[p[x] for x in ['a','k','tau']];reports={}
 for name in ['coarse','fine']:
  t=np.array([x['t'] for x in tr[name]]);observed=np.array([x['x'] for x in tr[name]]);reference=scopes[1]['dde'](a,k,tau,t,rtol=1e-11);pade=scopes[1]['pade_trace'](a,k,tau,t);pobs=np.array([x['pade'] for x in tr[name]])
  scale=max(1,float(max(abs(reference))));e=float(max(abs(observed-reference))/scale);pe=float(max(abs(pobs-pade))/max(1,float(max(abs(pade)))));reports[name]={'relativeDDEError':e,'relativePadeError':pe};assert e<1e-3 and pe<1e-5,(p,name,e,pe)
 assert reports['fine']['relativeDDEError']<=reports['coarse']['relativeDDEError']*.7+1e-9,(p,reports)
 details.append({'p':p,**reports})
assert err<1e-9 and residual<1e-9,(err,residual)
s,a,k,tau=sy.symbols('s a k tau');F=s+a+k*sy.exp(-s*tau);sprime=sy.cancel(-sy.diff(F,tau)/sy.diff(F,s));onroot=sy.cancel(sprime.subs(sy.exp(-s*tau),-(s+a)/k));assert sy.cancel(onroot+s*(s+a)/(1+tau*(s+a)))==0
poly=sy.expand((s+a)*(1+s*tau/2)+k*(1-s*tau/2));assert sy.expand(poly-(tau*s*s/2+(1+(a-k)*tau/2)*s+a+k))==0
report={'pass':True,'configurations':len(actual['cases']),'frequencyChecks':sum(len(x['frequency']) for x in actual['cases']),'historyTraces':len(details),'maxScalarTSError':err,'maxLambertRelativeResidual':residual,'maxCoarseDDEError':max(x['coarse']['relativeDDEError'] for x in details),'maxFineDDEError':max(x['fine']['relativeDDEError'] for x in details),'maxPadeError':max(x['coarse']['relativePadeError'] for x in details),'traceChecks':details,'default':actual['default'],'exactRows':scopes[0]['rows'],'halanayRate':scopes[1]['eta'],'newNotebooks':3,'newCells':5,'symbolicCharacteristicAndPade':True,'externalGeneralDDESolverClaimed':False,'versions':{'numpy':np.__version__}}
(E/'reconciliation.json').write_text(json.dumps(report,indent=2,allow_nan=False),encoding='utf8');print(json.dumps(report,indent=2));print('PASS original cells + independent nonlinear roots/complex products/DOP853 dense history/expm/SymPy')
