from pathlib import Path
from fractions import Fraction as F
import numpy as np,json
from scipy.linalg import solve_discrete_lyapunov
from scipy.signal import lfilter
f=Path('.agent/semester-03/id-05');raw=json.loads((f/'extracted.json').read_text(encoding='utf8'));scopes=[]
for nb in raw['notebooks']:
 scope={};exec(nb['setupCode'],scope)
 for cell in nb['cells']:exec(cell['code'],scope)
 scopes.append(scope)
values=0;maximum=0.
def check(a,b):
 global values,maximum
 delta=float(np.max(np.abs(np.asarray(a,dtype=float)-np.asarray(b,dtype=float))));maximum=max(maximum,delta);values+=np.size(a)
 assert delta<1e-10,(delta,a,b)
def independent(feedback,color,amplitude,instrument):
 M=np.array([[-.8*feedback,color],[0.,color]])
 Q=np.array([[.64*amplitude**2+.25,.25],[.25,.25]])
 P=solve_discrete_lyapunov(M,Q)
 vu=amplitude**2+feedback**2*P[0,0];uv=-feedback*color*P[0,1]
 zu=amplitude**2 if instrument=='reference' else vu;zv=0 if instrument=='reference' else uv
 return dict(varianceV=P[1,1],covarianceYV=P[0,1],varianceY=P[0,0],varianceU=vu,covarianceUV=uv,momentZU=zu,momentZV=zv,lsTarget=.8+uv/vu if vu>1e-14 else None,ivTarget=.8+zv/zu if zu>1e-14 else None,admissible=bool(zu>1e-14 and abs(zv)<1e-14))
actual=json.loads((f/'actual-ts.json').read_text(encoding='utf8'))
for case in actual['cases']:
 expected=independent(case['feedback'],case['color'],case['amplitude'],case['instrument'])
 for key,v in expected.items():
  if v is None or isinstance(v,bool):assert case['result'][key]==v
  else:check(case['result'][key],v)
for curve in actual['curves']:
 for row in curve['rows']:
  expected=independent(curve['feedback'],row['rho'],curve['amplitude'],curve['instrument'])
  for key,v in expected.items():
   if v is None or isinstance(v,bool):assert row[key]==v
   else:check(row[key],v)
for key,val in {'varianceV':F(1,3),'covarianceYV':F(5,18),'varianceY':F(86,189),'varianceU':F(275,756),'covarianceUV':F(-5,72),'momentZU':F(1,4),'momentZV':F(0),'lsTarget':F(67,110),'ivTarget':F(4,5)}.items():check(actual['defaults'][key],val)
# Independent filter composition, not the Notebook's coupled time loop.
scope=scopes[1];summary={}
for label,feedback,color in [('colored',.5,.5),('open',0,.5),('white',.5,0)]:
 estimates=[]
 for seed in range(1,33):
  r=np.random.default_rng(seed).choice([-.5,.5],4352);w=np.random.default_rng(seed+104729).choice([-.5,.5],4352)
  v=lfilter([1],[1,-color],w);y=lfilter([1],[1,.8*feedback],.8*r+v);yp=np.r_[0,y[:-1]];u=r-feedback*yp;up=np.r_[0,u[:-1]]
  independent_record=np.column_stack((r,u,y,v,yp,up))[256:];observed=scope['closed_record'](feedback,color,seed=seed);check(observed,independent_record)
  r,u,y,v,yp,up=independent_record.T;X=np.column_stack((yp,u,up));coef=np.linalg.solve(X.T@X,X.T@y)
  estimates.append([np.sum(u*y)/np.sum(u*u),np.sum(r*y)/np.sum(r*u),coef[1]])
 arr=np.array(estimates);expected={'mean':arr.mean(axis=0),'std_ddof1':arr.std(axis=0,ddof=1),'rmse':np.sqrt(((arr-.8)**2).mean(axis=0)),'q05':np.quantile(arr,.05,axis=0),'q95':np.quantile(arr,.95,axis=0)}
 for key,val in expected.items():check(scope['mc_results'][label][key],val)
 summary[label]={k:v.tolist() for k,v in expected.items()}
report={'pass':True,'populationConfigurations':len(actual['cases']),'curveConfigurations':len(actual['curves']),'repeatedRecords':96,'values':int(values),'maxError':maximum,'tolerance':1e-10,'rawNotebooks':raw['count'],'rawCells':sum(len(n['cells']) for n in raw['notebooks']),'monteCarlo':summary}
(f/'reconciliation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf8');print(json.dumps({k:v for k,v in report.items() if k!='monteCarlo'}))
