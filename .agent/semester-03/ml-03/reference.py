"""Independent scalar analytic oracle, Fraction arithmetic and 60 digit tanh."""
import json,sys,mpmath as mp
from fractions import Fraction as F
mp.mp.dps=60
cases=json.load(open(sys.argv[1],encoding='utf-8'));error=0
def oracle(x,c,g,d,kind):
 x,c,g,d=map(lambda v:F(str(v)),(x,c,g,d));z=[x-c+d,-x+c+d]
 h=[max(F(0),v) if kind=='relu' else v if kind=='linear' else mp.tanh(mp.mpf(v.numerator)/v.denominator) for v in z]
 return dict(z=list(map(float,z)),h=list(map(float,h)),output=float(g*sum(h)))
def eq(a,b):
 global error
 if isinstance(b,dict):
  for k,v in b.items():eq(a[k],v)
 elif isinstance(b,list):
  for x,y in zip(a,b):eq(x,y)
 else:error=max(error,abs(a-b));assert abs(a-b)<1e-10,(a,b)
for case in cases['forward']:
 p=case['p'];eq(case['result'],oracle(*p))
for case in cases['losses']:
 c,g,d,k=case['p'];expected={}
 for name,xs in [('training',[-1,0,1]),('validation',[-.5,.5]),('test',[-.75,.75])]:
  expected[name]=sum((oracle(x,c,g,d,k)['output']-abs(x))**2 for x in xs)/len(xs)
 eq(case['result'],expected)
for case in cases['xor']:
 x,y=case['x'];s=x+y
 expected=s if 0<=s<=1 else 2-s if s>1 else 0
 eq(case['result']['output'],expected)
expected=[]
v=oracle(.5,0,1,0,'relu');v.update(parameters=7,training=0,validation=0,test=0);expected.append([v])
for c,g,d,k in [(.5,2,0,'relu'),(0,1,0,'linear'),(0,1,0,'tanh'),(0,1,-3,'relu'),(0,0,0,'relu')]:
 v=oracle(-.5,c,g,d,k)
 for name,xs in [('training',[-1,0,1]),('validation',[-.5,.5]),('test',[-.75,.75])]:v[name]=sum((oracle(x,c,g,d,k)['output']-abs(x))**2 for x in xs)/len(xs)
 expected[0].append(v)
expected[0].append(dict(dL_dW1=[0,0],dL_db1=[0,0],dL_dW2=[0,0],dL_db2=float(-F(2,3))))
expected.append([dict(x=[a,b],h=[a+b,max(0,a+b-1)],output=(a!=b)*1,parameters=9) for a,b in [(0,0),(0,1),(1,0),(1,1)]])
expected[1].append(dict(x=[2,2],h=[4,3],output=-2,parameters=9))
expected[1].append(dict(z=[-1,1],h=[0,1],output=2,parameters=7,dead_training=float(F(2,3)),dead_validation=.25,dead_test=.5625,dead_bias_gradient=float(-F(2,3))))
print(json.dumps({'pass':True,'forwardCases':len(cases['forward']),'lossCases':len(cases['losses']),'xorCases':len(cases['xor']),'maxError':error,'expected_notebooks':expected}))
