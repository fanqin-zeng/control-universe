"""Independent Decimal(70) matrix formula; direct exponent normalization."""
from decimal import Decimal as D,getcontext
from pathlib import Path
import json,sys
getcontext().prec=70
def calc(q,k,v,mask,tau=1):
    q=[[D(str(x)) for x in r] for r in q]; k=[[D(str(x)) for x in r] for r in k];v=[[D(str(x)) for x in r] for r in v]
    scale=D(len(q[0])).sqrt()*D(str(tau))
    s=[[sum((x*y for x,y in zip(r,key)),D(0))/scale for key in k] for r in q]
    e=[[x.exp() if mask[i][j] else D(0) for j,x in enumerate(row)] for i,row in enumerate(s)]
    w=[[x/sum(row) for x in row] for row in e]
    out=[[sum((row[j]*v[j][c] for j in range(len(k))),D(0)) for c in range(len(v[0]))] for row in w]
    return dict(scores=s,weights=w,output=out)
def oracle(temperature=1,delta=0,causal=True):
    x=[[1,0],[0,1],[1,1]]
    return calc(x,x,[[1],[2],[3+delta]],[[not causal or j<=i for j in range(3)] for i in range(3)],temperature)
def perm():
    keys=[[1,0],[0,1],[1,1]];values=[[1],[2],[3]];p=[2,0,1]
    pos=lambda rows:[[D(str(row[0]))+D(j)/2,row[1]] for j,row in enumerate(rows)]
    run=lambda k,v:calc([[1,0]],k,v,[[True]*3])['output'][0][0]
    pk=[keys[j] for j in p];pv=[values[j] for j in p]
    return dict(original=run(keys,values),permuted=run(pk,pv),positionOriginal=run(pos(keys),values),positionPermuted=run(pos(pk),pv))
expected=[[oracle(),dict(stable=[1/(1+D(1).exp()),1/(1+(-D(1)).exp())],padding=[1,0,0],allMaskedRejected=True)],[[dict(delta=d,causalSecond=oracle(delta=d)['output'][1][0],fullSecond=oracle(delta=d,causal=False)['output'][1][0],causalThird=oracle(delta=d)['output'][2][0],fullThird=oracle(delta=d,causal=False)['output'][2][0]) for d in [0,5,10]],dict(permutation=perm(),scoreCounts=[9,36])]]
count=0;error=0
def compare(a,b):
    global count,error
    if isinstance(b,dict):
        for k,v in b.items():compare(a[k],v)
    elif isinstance(b,list):
        assert len(a)==len(b)
        for x,y in zip(a,b):compare(x,y)
    elif isinstance(b,bool):assert a==b
    else:
        e=abs(a-float(b));count+=1;error=max(error,e);assert e<1e-11,(a,float(b))
def conv(x):
    if isinstance(x,dict):return {k:conv(v) for k,v in x.items()}
    if isinstance(x,list):return [conv(v) for v in x]
    return float(x) if isinstance(x,D) else x
if len(sys.argv)>1:
    data=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    for row in data['runs']:compare(row['result'],oracle(**row['config']))
    for i,n in enumerate(data['notebooks']):compare(n,expected[i])
    compare(data['permutation'],perm());compare(data['stable'],expected[0][1]['stable'])
print(json.dumps(dict(pass_=True,quantities=count,max_error=error,expected_notebooks=conv(expected))))
