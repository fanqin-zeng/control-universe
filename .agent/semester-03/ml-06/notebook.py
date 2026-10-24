import math,json

def softmax(scores,visible):
    if not scores or len(scores)!=len(visible) or not any(visible) or not all(math.isfinite(x) for x in scores):
        raise ValueError('invalid or fully masked row')
    high=max(x for x,ok in zip(scores,visible) if ok)
    e=[math.exp(x-high) if ok else 0 for x,ok in zip(scores,visible)]
    total=sum(e)
    return [x/total for x in e]

def attend(q,k,v,visible,temperature=1):
    scores=[[sum(x*y for x,y in zip(row,key))/math.sqrt(len(row))/temperature for key in k] for row in q]
    weights=[softmax(row,visible[i]) for i,row in enumerate(scores)]
    output=[[sum(w*v[j][c] for j,w in enumerate(row)) for c in range(len(v[0]))] for row in weights]
    return dict(scores=scores,weights=weights,output=output)

def experiment(temperature=1,delta=0,causal=True):
    x=[[1,0],[0,1],[1,1]]
    return attend(x,x,[[1],[2],[3+delta]],[[not causal or j<=i for j in range(3)] for i in range(3)],temperature)

def permutation_demo():
    keys=[[1,0],[0,1],[1,1]]; values=[[1],[2],[3]]; p=[2,0,1]
    def run(ks,vs,position=False):
        if position: ks=[[row[0]+j*.5,row[1]] for j,row in enumerate(ks)]
        return attend([[1,0]],ks,vs,[[True]*3])['output'][0][0]
    return dict(original=run(keys,values),permuted=run([keys[j] for j in p],[values[j] for j in p]),positionOriginal=run(keys,values,True),positionPermuted=run([keys[j] for j in p],[values[j] for j in p],True))
