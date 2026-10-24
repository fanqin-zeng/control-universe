from pathlib import Path
from fractions import Fraction as F
import json
import numpy as np
folder=Path('.agent/semester-03/id-03')
source=json.loads((folder/'extracted.json').read_text(encoding='utf8'))
maximum=0.0;count=0
def check(actual,expected):
 global maximum,count
 delta=abs(float(actual)-float(expected));maximum=max(maximum,delta);count+=1
 assert delta<1e-10,(actual,expected,delta)
for nb in source['notebooks']:
 scope={};exec(nb['setupCode'],scope)
 for cell in nb['cells']:exec(cell['code'],scope)
 if 'theta_ls' in scope:
  check(scope['theta_ls'][0],F(4,5));check(scope['theta_ls'][1],F(1,5));assert scope['rank']==2 and scope['flat_rank']==1
 if 'paths' in scope:
  u=[1,0,1,1,0,0,1,0];y=[F(0)]
  for x in u:y.append(F(4,5)*y[-1]+F(1,5)*x)
  for lam,path in scope['paths'].items():
   L=F(str(lam));R=[[F(1),F(0)],[F(0),F(1)]];g=[F(0),F(0)]
   for j,(theta,P,batch) in enumerate(path):
    phi=[y[j],F(u[j])]
    R=[[L*R[a][b]+phi[a]*phi[b] for b in range(2)] for a in range(2)]
    g=[L*g[a]+phi[a]*y[j+1] for a in range(2)]
    det=R[0][0]*R[1][1]-R[0][1]*R[1][0];assert det>0
    inverse=[[R[1][1]/det,-R[0][1]/det],[-R[1][0]/det,R[0][0]/det]]
    exact=[sum(inverse[a][b]*g[b] for b in range(2)) for a in range(2)]
    for a in range(2):
     check(theta[a],exact[a]);check(batch[a],exact[a])
     for b in range(2):check(P[a,b],inverse[a][b])
 if 'scalar_path' in scope:
  ones=0
  for j,(b,P) in enumerate(scope['scalar_path']):
   ones+=[1,0,1,1][j%4];check(b,F(1,5)*ones/(1+ones));check(P,F(1,1+ones))
  check(scope['covariance'],-F(4,5)*F(1,100));check(scope['P'],F(9,10)**-32)
actual=json.loads((folder/'actual-ts.json').read_text(encoding='utf8'))
for case in actual['cases']:
 lam=F(str(case['lambda']));delta=F(str(case['disturbance']));R=F(1);g=F(0);level=F(0);estimate=F(0)
 for i,row in enumerate(case['rows']):
  if i==0:expected=[F(1,5),F(0),F(1),F(0),F(0),F(0)]
  else:
   k=i-1;u=F(0 if case['scenario']=='quiet' else [1,0,1,1][k%4]);b=F(1,2) if case['scenario']=='jump' and k>=16 else F(1,5)
   e=F(0) if case['scenario']=='quiet' else (delta if k%2==0 else -delta)
   level=F(4,5)*level+b*u+e;target=b*u+e;residual=target-u*estimate
   R=lam*R+u*u;g=lam*g+u*target;estimate=g/R
   expected=[b,estimate,1/R,u,level,residual]
  for a,b in zip(row,expected):check(a,b)
assert -F(1,5) != 0
assert F(4,25)/F(1,5)==F(4,5)
assert F(1,2)*F(1,5)==F(1,10)
report={'pass':True,'values':count,'maxError':maximum,'tolerance':1e-10,'configurations':len(actual['cases']),'method':'Fraction information accumulation, direct 2x2 inverse; not the RLS gain recursion','exercises':{'determinant':-.2,'a':.8,'b':.2,'firstGain':.5,'firstEstimate':.1,'firstP':.5,'windup32':float(F(9,10)**-32),'measurementCovariance':-.008}}
(folder/'reconciliation.json').write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report))
