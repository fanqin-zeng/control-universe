from pathlib import Path
from fractions import Fraction as F
import json,numpy as np
f=Path('.agent/semester-03/id-04');raw=json.loads((f/'extracted.json').read_text(encoding='utf8'))
for nb in raw['notebooks']:
 scope={};exec(nb['setupCode'],scope)
 for cell in nb['cells']:exec(cell['code'],scope)
actual=json.loads((f/'actual-ts.json').read_text(encoding='utf8'));maximum=0.;values=0
def check(a,b):
 global maximum,values
 delta=abs(float(a)-float(b));maximum=max(maximum,delta);values+=1
 assert delta<1e-10,(a,b,delta)
for case in actual['cases']:
 a=case['amplitude'];L=case['window'];lam=case['forgetting'];mode=case['mode']
 def u(k):
  if mode=='constant':return a
  if mode=='alternating':return a if k%2==0 else -a
  if mode=='burst' and not 0<=k<8:return 0.
  return a*[1.,0.,-1.,0.][k%4]
 X=np.array([[u(k),u(k-1)] for k in range(64)]);Y=X@np.array([.6,.2]);mins=[]
 r11=F(1);r12=F(0);r22=F(1);lf=F(str(lam))
 for n,row in enumerate(case['rows']):
  if n:
   x,z=map(lambda v:F(str(v)),X[n-1]);r11=lf*r11+x*x;r12=lf*r12+x*z;r22=lf*r22+z*z
  determinant=r11*r22-r12*r12
  exactP=[r22/determinant,-r12/determinant,r11/determinant]
  weights=lam**np.arange(n-1,-1,-1)
  # Direct weighted augmented QR/SVD solution; no RLS gain recursion.
  aug=np.vstack((lam**(n/2)*np.eye(2),X[:n]*np.sqrt(weights)[:,None]));target=np.r_[np.zeros(2),Y[:n]*np.sqrt(weights)]
  theta=np.linalg.lstsq(aug,target,rcond=None)[0]
  for x,y in zip(row[:5],[*theta,*exactP]):check(x,y)
  check(row[6],u(n-1))
  if n>=L:
   v=np.linalg.eigvalsh(X[n-L:n].T@X[n-L:n])[0];check(row[5],v);mins.append(v)
  else:assert row[5] is None
 check(case['minimum'],min(mins))
check(actual['defaults']['rows'][-1]['first'],F(3,5)*F(32,33));check(actual['defaults']['rows'][-1]['second'],F(1,5)*F(32,33));check(actual['defaults']['observedMinimum'],4)
check(F(3,5)*F(4,5),.48);check(F(1,5)*F(4,5),.16);check(F(1,100)/F(1,10),.1)
report={'pass':True,'configurations':len(actual['cases']),'values':values,'maxError':maximum,'tolerance':1e-10,'rawNotebooks':raw['count'],'rawCells':sum(len(nb['cells']) for nb in raw['notebooks'])}
(f/'reconciliation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
