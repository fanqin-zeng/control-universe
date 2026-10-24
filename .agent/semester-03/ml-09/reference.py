"""Fraction contingency tables and multinomial-weight bootstrap oracle."""
from fractions import Fraction as F
from collections import Counter
from math import factorial,ceil
from itertools import combinations_with_replacement
import json,sys

def raw(split='validation',scenario='nominal'):
    text='0.6 0.4 0.8 0.5 0.3 0.2 0.1 0' if split=='validation' else '0.9 0.4 0.8 0.7 0.6 0.3 0.25 0.2 0.18 0.16 0.14 0.12 0.1 0.08 0.06 0.04 0.03 0.02 0.01 0'
    scores=list(map(F,text.split()))
    if split!='validation' and scenario!='nominal':
        scores[0:2]=[F('0.2'),F('0.1')]
        if scenario=='tie':scores=[min(x,F('0.29')) for x in scores]
    return [dict(id=split+'-'+str(i),group=split+'-'+str(i//(4 if split=='validation' else 5)),time=(4 if split=='validation' else 12)+i,x=F('0.1')+F('0.8')*v,y=int(i<2)) for i,v in enumerate(scores)]

def metric(rows,threshold,cfn):
    pred=[0 if threshold is None else int((r['x']-F('0.1'))/F('0.8')>=threshold) for r in rows]
    table=Counter((r['y'],p) for r,p in zip(rows,pred));tp,fp,fn,tn=[table[k] for k in [(1,1),(0,1),(1,0),(0,0)]]
    ratio=lambda a,b:F(a,b) if b else None
    recall=ratio(tp,tp+fn);specificity=ratio(tn,tn+fp)
    losses=[{(0,0):0,(1,1):0,(0,1):1,(1,0):cfn}[(r['y'],p)] for r,p in zip(rows,pred)]
    return dict(n=len(rows),tp=tp,fp=fp,fn=fn,tn=tn,accuracy=ratio(tp+tn,len(rows)),precision=ratio(tp,tp+fp),recall=recall,specificity=specificity,f1=ratio(2*tp,2*tp+fp+fn),balancedAccuracy=None if recall is None or specificity is None else (recall+specificity)/2,cost=sum(losses),risk=ratio(sum(losses),len(rows)),predictions=pred,losses=losses)

def boot(diffs):
    bins=Counter();n=len(diffs)
    for choices in combinations_with_replacement(range(n),n):
        counts=Counter(choices);multiplicity=factorial(n)
        for count in counts.values():multiplicity//=factorial(count)
        value=sum(diffs[i]*k for i,k in counts.items())/n;bins[value]+=multiplicity
    total=sum(bins.values());distribution=[]
    for v,k in sorted(bins.items()):distribution.extend([v]*k)
    assert total==n**n
    return dict(count=total,mean=sum(diffs)/n,lower=distribution[ceil(F(25,1000)*total)-1],upper=distribution[ceil(F(975,1000)*total)-1],distribution=distribution)

def reference(c):
    model=dict(negative=F(1,10),positive=F(9,10),rows=[dict(id='T'+str(i),group='train-'+str(i//2),time=i,x=x,y=int(i>=2)) for i,x in enumerate([F(0),F(1,5),F(4,5),F(1)])])
    candidates=[dict(threshold=t,metrics=metric(raw(),t,c['cfn'])) for t in [F(7,10),F(1,2),F(3,10)]]
    best=sorted(candidates,key=lambda v:(v['metrics']['cost'],-v['threshold']))[0]
    threshold=best['threshold'] if c['policy']=='validation' else F(c['policy'])
    test=metric(raw('test',c['scenario']),threshold,c['cfn']);base=metric(raw('test',c['scenario']),None,c['cfn'])
    differences=[F(a-b) for a,b in zip(test['losses'],base['losses'])];batches=[sum(differences[k:k+5])/5 for k in [0,5,10,15]]
    return dict(model=model,candidates=candidates,selectedThreshold=best['threshold'],usedThreshold=threshold,validationBaseline=metric(raw(),None,c['cfn']),test=test,baseline=base,batches=batches,bootstrap=boot(batches))

def report(s):
    omit=lambda row,keys:{k:v for k,v in row.items() if k not in keys}
    return dict(model=omit(s['model'],['rows']),candidates=[dict(threshold=v['threshold'],cost=v['metrics']['cost'],risk=v['metrics']['risk']) for v in s['candidates']],selectedThreshold=s['selectedThreshold'],usedThreshold=s['usedThreshold'],test=omit(s['test'],['predictions','losses']),baseline=omit(s['baseline'],['predictions','losses']),batches=s['batches'],bootstrap=omit(s['bootstrap'],['distribution']))

def expected():
    c=dict(cfn=5,scenario='nominal',policy='validation');s=reference(c);one=report(reference(dict(c,cfn=1)))
    positive=[dict(x=F(0),y=1)];negative=[dict(x=F(0),y=0)]
    return [[dict(model=s['model'],validation=raw(),candidates=[dict(threshold=v['threshold'],cost=v['metrics']['cost'],risk=v['metrics']['risk']) for v in s['candidates']],selectedThreshold=s['selectedThreshold'],costOne=one),dict(testRows=raw('test'),default=report(s),leakage=dict(rowSplitAccuracy=F(1),groupSplitAccuracy=F(1,2),overlapGroups=4,heldoutGroups=2))],[{k:report(reference(dict(c,scenario=k))) for k in ['nominal','drift','tie']},dict(splitSizes=[4,8,20],groups=[2,2,4],quantileRanks=[ceil(F(25,1000)*256),ceil(F(975,1000)*256)],positiveOnly=metric(positive,None,5),negativeOnly=metric(negative,None,5))]]

def clean(x):
    if isinstance(x,F):return float(x)
    if isinstance(x,list):return [clean(v) for v in x]
    if isinstance(x,dict):return {k:clean(v) for k,v in x.items()}
    return x
if __name__=='__main__':
    from pathlib import Path
    r=Path(__file__).resolve().parent
    cases=json.loads((r/'cases.json').read_text(encoding='utf-8'))
    (r/'reference.json').write_text(json.dumps(clean([reference(c) for c in cases]),indent=2),encoding='utf-8')
    (r/'expected-notebooks.json').write_text(json.dumps(clean(expected()),indent=2),encoding='utf-8')

    supplement=dict(validationBaselineCostOne=metric(raw(),None,1),validationScored=[dict(id=r['id'],score=(r['x']-F('0.1'))/F('0.8')) for r in raw()],testScored=[dict(id=r['id'],score=(r['x']-F('0.1'))/F('0.8')) for r in raw('test')])
    (r/'supplementary-expected.json').write_text(json.dumps(clean(supplement),indent=2),encoding='utf-8')
