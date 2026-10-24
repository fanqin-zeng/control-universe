"""Independent exact-rational oracle: preallocated delivery slots and plant polynomial."""
from fractions import Fraction as F
from pathlib import Path
import json,cmath
E=Path(__file__).resolve().parent

def oracle(K,mode,policy):
 slots=[[] for _ in range(42)]; x=F(1); held=F(0); last=None; rejected=0; points=[]
 for tick in range(40):
  delay=0 if mode in ('clean','burst') else 1 if mode=='delay' else 2 if tick%2==0 else 0
  if not(mode=='burst' and 3<=tick%10<=5):slots[tick+delay].append((tick,x))
  for seq,value in sorted(slots[tick]):
   if policy=='arrival' or last is None or seq>last:last,held=seq,value
   else:rejected+=1
  age=None if last is None else (tick-last)/10
  u=-F(K)*held
  points.append(dict(k=tick,x=float(x),held=float(held),u=float(u),age=age,seq=last))
  x=F(11,10)*x+F(1,10)*u
 points.append(dict(k=40,x=float(x)))
 return dict(K=K,mode=mode,policy=policy,points=points,final=float(x),peak=max(abs(v['x']) for v in points),energy=float(sum(F(str(v['x']))**2 for v in points[:-1])),maxAge=max(v['age'] for v in points[:-1] if v['age'] is not None),rejected=rejected)
cases=[oracle(K,m,p) for K in [1,4,9,10,12] for m in ['clean','delay','reorder','burst'] for p in ['fresh','arrival']]
def poles(K):
 z=cmath.sqrt(1.21-.4*K);return [(1.1+z)/2,(1.1-z)/2]
report={'cases':cases,'default':oracle(4,'clean','fresh'),'roots':{str(K):{'clean':1.1-.1*K,'delay':[[z.real,z.imag] for z in poles(K)],'rho':max(map(abs,poles(K)))} for K in [4,10,12]}}
(E/'reference.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'default':{k:v for k,v in report['default'].items() if k!='points'},'roots':report['roots'],'table':[{k:v for k,v in c.items() if k not in ['points','energy']} for c in cases if c['K']==4]}))
