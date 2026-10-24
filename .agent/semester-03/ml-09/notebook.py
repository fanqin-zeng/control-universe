import math,json,itertools
THRESHOLDS=[0.7,0.5,0.3]

def fit():
    rows=[dict(id='T'+str(i),group='train-'+str(i//2),time=i,x=x,y=int(i>=2)) for i,x in enumerate([0.0,0.2,0.8,1.0])]
    means=[sum(r['x'] for r in rows if r['y']==y)/sum(r['y']==y for r in rows) for y in [0,1]]
    return dict(negative=means[0],positive=means[1],rows=rows)

def records(split='validation',scenario='nominal'):
    if split=='validation':scores=[0.6,0.4,0.8,0.5,0.3,0.2,0.1,0.0];offset=4;size=4
    else:
        scores=[0.9,0.4,0.8,0.7,0.6,0.3,0.25,0.2,0.18,0.16,0.14,0.12,0.1,0.08,0.06,0.04,0.03,0.02,0.01,0.0];offset=12;size=5
        if scenario in ['drift','tie']:scores[:2]=[0.2,0.1]
        if scenario=='tie':scores=[min(v,0.29) for v in scores]
    return [dict(id=split+'-'+str(i),group=split+'-'+str(i//size),time=offset+i,x=0.1+0.8*v,y=int(i<2)) for i,v in enumerate(scores)]

def score(x,model):return min(1.0,max(0.0,(x-model['negative'])/(model['positive']-model['negative'])))

def metrics(rows,model,threshold,cfn=5):
    pred=[0 if threshold is None else int(score(r['x'],model)>=threshold-1e-12) for r in rows]
    tp=sum(p==1 and r['y']==1 for p,r in zip(pred,rows));fp=sum(p==1 and r['y']==0 for p,r in zip(pred,rows))
    fn=sum(p==0 and r['y']==1 for p,r in zip(pred,rows));tn=len(rows)-tp-fp-fn
    ratio=lambda a,b:a/b if b else None
    recall=ratio(tp,tp+fn);specificity=ratio(tn,tn+fp)
    losses=[cfn if r['y']==1 and p==0 else int(r['y']==0 and p==1) for p,r in zip(pred,rows)]
    return dict(n=len(rows),tp=tp,fp=fp,fn=fn,tn=tn,accuracy=(tp+tn)/len(rows),precision=ratio(tp,tp+fp),recall=recall,specificity=specificity,f1=ratio(2*tp,2*tp+fp+fn),balancedAccuracy=None if recall is None or specificity is None else (recall+specificity)/2,cost=sum(losses),risk=sum(losses)/len(rows),predictions=pred,losses=losses)

def bootstrap(differences):
    if len(differences)!=4 or not all(math.isfinite(v) for v in differences):raise ValueError("Four finite batch differences required")
    values=sorted(sum(v)/len(differences) for v in itertools.product(differences,repeat=len(differences)))
    return dict(count=len(values),mean=sum(differences)/len(differences),lower=values[math.ceil(0.025*len(values))-1],upper=values[math.ceil(0.975*len(values))-1],distribution=values)

def study(cfn=5,scenario='nominal',policy='validation'):
    model=fit();val=records();candidates=[dict(threshold=t,metrics=metrics(val,model,t,cfn)) for t in THRESHOLDS]
    selected=min(candidates,key=lambda c:c['metrics']['cost']);threshold=selected['threshold'] if policy=='validation' else float(policy)
    test=records('test',scenario);result=metrics(test,model,threshold,cfn);base=metrics(test,model,None,cfn)
    batches=[sum(result['losses'][i]-base['losses'][i] for i in range(k,k+5))/5 for k in range(0,20,5)]
    return dict(model=model,candidates=candidates,selectedThreshold=selected['threshold'],usedThreshold=threshold,validationBaseline=metrics(val,model,None,cfn),test=result,baseline=base,batches=batches,bootstrap=bootstrap(batches))

def report(s):
    compact=lambda r:{k:v for k,v in r.items() if k not in ['predictions','losses']}
    return dict(model={k:v for k,v in s['model'].items() if k!='rows'},candidates=[dict(threshold=c['threshold'],cost=c['metrics']['cost'],risk=c['metrics']['risk']) for c in s['candidates']],selectedThreshold=s['selectedThreshold'],usedThreshold=s['usedThreshold'],test=compact(s['test']),baseline=compact(s['baseline']),batches=s['batches'],bootstrap={k:v for k,v in s['bootstrap'].items() if k!='distribution'})

def leakage_demo():
    data=[dict(id=g+'-'+str(j),group=g,y=i%2) for i,g in enumerate(['A','B','C','D']) for j in range(2)]
    def evaluate(train,test):
        memory={r['group']:r['y'] for r in train}
        return sum(memory.get(r['group'],0)==r['y'] for r in test)/len(test)
    row_train=data[::2];row_test=data[1::2]
    group_train=[r for r in data if r['group'] in ['A','B']]
    group_test=[r for r in data if r['group'] in ['C','D']]
    overlap={r['group'] for r in row_train}&{r['group'] for r in row_test}
    return dict(rowSplitAccuracy=evaluate(row_train,row_test),groupSplitAccuracy=evaluate(group_train,group_test),overlapGroups=len(overlap),heldoutGroups=len({r['group'] for r in group_test}))
