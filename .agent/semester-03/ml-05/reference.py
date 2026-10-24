"""Independent closed polynomial oracle: no recurrent reverse loop."""
from fractions import Fraction as F
from pathlib import Path
import json,sys

def oracle(a,n,kind,initial,k):
    a=F(str(a)); initial=F(str(initial))
    x=[F((i==0) if kind=='impulse' else 1 if kind=='constant' else (-1)**i) for i in range(n)]
    # h_t = a^t h0 + sum_{j=1}^t a^(t-j) x_j
    h=[a**t*initial+sum((a**(t-j)*x[j-1] for j in range(1,t+1)),F(0)) for t in range(n+1)]
    def deriv(t):return (t*a**(t-1)*initial if t else F(0))+sum(((t-j)*a**(t-j-1)*x[j-1] for j in range(1,t) ),F(0))
    full=h[n]*deriv(n)
    # Hold boundary h_{n-k} constant and differentiate its k-step closed polynomial.
    cut=h[n]*(k*a**(k-1)*h[n-k]+sum(((n-j)*a**(n-j-1)*x[j-1] for j in range(n-k+1,n)),F(0)))
    return dict(x=x,h=h,sensitivity=[a**t for t in range(n+1)],loss=h[n]**2/2,full=full,truncated=cut,contributions=[h[n]*a**(n-t)*h[t-1] for t in range(1,n+1)])

def cool(a):
    a=F(str(a)); r=F(4,5)
    truth=[r**t for t in range(1,5)];one=[a*r**(t-1) for t in range(1,5)];roll=[a**t for t in range(1,5)]
    return dict(a=a,truth=truth,oneStep=one,rollout=roll,oneMSE=sum((x-y)**2 for x,y in zip(one,truth))/4,rolloutMSE=sum((x-y)**2 for x,y in zip(roll,truth))/4)
def convert(x):
    if isinstance(x,dict):return {k:convert(v) for k,v in x.items()}
    if isinstance(x,list):return [convert(v) for v in x]
    return float(x) if isinstance(x,F) else x
expected=[[oracle(.5,4,'impulse',0,2),[oracle(a,4,'impulse',0,2) for a in [0,.5,1,1.5]]],[[cool(a) for a in [.5,.8,1.1]],dict(resetTail=0,carryTail=F(1,8),fullGradient=F(3,32),cutGradient=F(1,16),updatedA=F(1,2)-F(1,10)*F(3,32))]]
count=0; maxerror=0
def compare(a,b):
    global count,maxerror
    if isinstance(b,dict):
        for k,v in b.items():compare(a[k],v)
    elif isinstance(b,list):
        assert len(a)==len(b)
        for x,y in zip(a,b):compare(x,y)
    else:
        error=abs(a-float(b));count+=1;maxerror=max(maxerror,error)
        assert error<=1e-10+1e-12*abs(float(b)),(a,float(b))
if len(sys.argv)>1:
    data=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    for case in data['runs']:compare(case['result'],oracle(**case['config']))
    for row in data['cooling']:compare(row,cool(row['a']))
    for i,nb in enumerate(data['notebooks']):compare(nb,expected[i])
print(json.dumps(dict(pass_=True,quantities=count,max_error=maxerror,expected_notebooks=convert(expected))))
