"""Exact latent-tree enumeration, outcome products and independent high precision integrals."""
from fractions import Fraction as F
from itertools import product
import json
import mpmath as mp
mp.mp.dps=60
params=list(product([0,.001,.01,.1,.25,.5],[0,.05,.2,.5,.9,1],[0,.01,.05,.2,.5,1]))+[(1e-12,1,0),(0,0,0),(.01,0,1),(.5,1,1)]
cases=[]
for p,t,f in params:
 pf,tf,ff=map(F,[p,t,f]);table={}
 for d in [True,False]:
  w=pf if d else 1-pf
  condition=tf if d else ff
  for b in [True,False]:table[d,b]=w*(condition if b else 1-condition)
 joint=[table[True,True],table[True,False],table[False,True],table[False,False]]
 bell=sum(v for (d,b),v in table.items() if b)
 conditional={d:sum(v for (dd,b),v in table.items() if dd==d and b)/bell for d in [True,False]} if bell else None
 cases.append(dict(parameters=[p,t,f],joint=list(map(float,joint)),bell=float(bell),posterior=float(conditional[True]) if conditional else None,expected=[float(10000*v) for v in joint]))
# 4 equiprobable elementary outcomes (-1, 0a, 0b, 1): 256 equally likely 4-tuples.
samples=list(product([-1,0,0,1],repeat=4))
means=[F(sum(v),4) for v in samples]
variances=[sum((F(x)-avg)**2 for x in v)/3 for v,avg in zip(samples,means)]
assert sum(variances)/len(variances)==F(1,2)
assert sum(x*x for x in means)/len(means)==F(1,8)
common=[]
for b,*es in product([-1,1],repeat=5):common.append(F(b)+F(sum(es),4))
assert sum(common)/32==0 and sum(v*v for v in common)/32==F(5,4)
counts=[F(0) for _ in range(6)]
for bits in product([0,1],repeat=5):
 w=F(1)
 for b in bits:w*=F(1,5) if b else F(4,5)
 counts[sum(bits)]+=w
assert sum(counts)==1
pdf=lambda x:mp.exp(-x*x/8)/(2*mp.sqrt(2*mp.pi))
normal=dict(density0=float(pdf(0)),area=float(mp.quad(pdf,[-2,0,2])),normalization=float(mp.quad(pdf,[-mp.inf,0,mp.inf])),variance=float(mp.quad(lambda x:x*x*pdf(x),[-mp.inf,0,mp.inf])))
assert abs(normal['normalization']-1)<1e-12 and abs(normal['variance']-4)<1e-12
print(json.dumps(dict(cases=cases,normal=normal,binomial=list(map(float,counts)),sampleCount=256,expectedSampleVariance=float(sum(variances)/256),sampleMeanVariance=float(sum(x*x for x in means)/256),commonCount=32,commonVariance=float(sum(v*v for v in common)/32),versions=dict(mpmath=mp.__version__))))
