"""Exact condensed quadratic problem, independent of Riccati implementation."""
from fractions import Fraction as F
from decimal import Decimal,localcontext
import json,sys,itertools
def solve(H,b):
    a=[list(row)+[v] for row,v in zip(H,b)];n=len(b)
    for j in range(n):
        pivot=next(k for k in range(j,n) if a[k][j]);a[j],a[pivot]=a[pivot],a[j]
        v=a[j][j];a[j]=[x/v for x in a[j]]
        for i in range(n):
            if i!=j:
                v=a[i][j];a[i]=[x-v*y for x,y in zip(a[i],a[j])]
    return [row[-1] for row in a]
def exact(N,s):
    # Eliminate states and solve the complete N-variable quadratic objective.
    w=[F(1)]*(N-1)+[F(s)]
    H=[[F(i==j)+sum(w[t] for t in range(max(i,j),N)) for j in range(N)] for i in range(N)]
    g=[sum(w[t] for t in range(i,N)) for i in range(N)]
    u=solve(H,[-v for v in g]);x=[F(1)]
    for v in u:x.append(x[-1]+v)
    stage=[a*a+b*b for a,b in zip(x,u)];terminal=F(s)*x[-1]**2
    P=[];K=[]
    # Each suffix is an independently condensed problem with initial state 1.
    for start in range(N):
        m=N-start;ww=[F(1)]*(m-1)+[F(s)]
        hh=[[F(i==j)+sum(ww[t] for t in range(max(i,j),m)) for j in range(m)] for i in range(m)]
        gg=[sum(ww[t] for t in range(i,m)) for i in range(m)]
        uu=solve(hh,[-v for v in gg]);K.append(-uu[0]);P.append(F(1)+sum(ww)+sum(a*b for a,b in zip(gg,uu)))
    P.append(F(s))
    return dict(P=P,K=K,x=x,u=u,stage=stage,terminal=terminal,J=sum(stage)+terminal)
def floats(o):
    if isinstance(o,dict):return {k:floats(v) for k,v in o.items()}
    if isinstance(o,(list,tuple)):return [floats(v) for v in o]
    return float(o)
max_ts_error=0
def compare(a,b):
    global max_ts_error
    if isinstance(b,dict):
        for k,v in b.items():compare(a[k],v)
    elif isinstance(b,list):
        assert len(a)==len(b)
        for x,y in zip(a,b):compare(x,y)
    else:
        err=abs(a-float(b));max_ts_error=max(err,max_ts_error);assert err<1e-10,(a,b)
for case in json.load(open(sys.argv[1])):compare(case['result'],floats(exact(case['N'],case['s'])))
default=floats(exact(3,1));terminal_cases=[]
for s in [0,1,8]:
    z=exact(3,s);terminal_cases.append(floats([s,z['K'][0],z['u'][-1],z['x'][-1],z['J']]))
constraints=[]
for x0 in [F(1,10),F(1),F(-1)]:
    H=[[F(3),F(1)],[F(1),F(2)]];g=[2*x0,x0];choices=[]
    for status in itertools.product([-1,0,1],repeat=2):
        u=[F(v,5) for v in status];free=[i for i,v in enumerate(status) if v==0];fixed=[i for i,v in enumerate(status) if v]
        if free:
            solved=solve([[H[i][j] for j in free] for i in free],[-g[i]-sum(H[i][j]*u[j] for j in fixed) for i in free])
            for i,v in zip(free,solved):u[i]=v
        if all(abs(v)<=F(1,5) for v in u):
            x=[x0,x0+u[0],x0+sum(u)];J=sum(v*v for v in x+u);choices.append((J,u,x))
    J,u,x=min(choices,key=lambda a:a[0]);constraints.append(floats([x0,J,*u,*x,0]))
with localcontext() as ctx:
    ctx.prec=60;p=(1+Decimal(5).sqrt())/2;k=p/(1+p);steady=[float(p),float(k),float(1-k)]
print(json.dumps(dict(pass_=True,max_ts_error=max_ts_error,default=default,terminal_cases=terminal_cases,steady=steady,constraint_results=constraints,answer_values=floats([0,F(-1,13),F(1,13),F(21,13),F(52,25)]),hard_terminal_input=-1.)))
