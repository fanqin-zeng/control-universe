"""Independent event-driven Fraction oracle, not the fixed half-ms TS loop."""
from fractions import Fraction as F
from pathlib import Path
import math,json
def schedule(tasks,policy,horizon=60):
    ts=[(F(str(t['period'])),F(str(t['cost']))) for t in tasks];H=F(horizon);now=F(0);jobs=[];releases=[F(0)]*len(ts);spans=[]
    while True:
        for j in jobs:
            if j['left'] and j['deadline']<=now:j['miss']=True
        if now==H:break
        for i,(period,cost) in enumerate(ts):
            if releases[i]==now:
                jobs.append(dict(task=i,release=now,deadline=now+period,left=cost,finish=None,miss=False));releases[i]+=period
        ready=[j for j in jobs if j['left']]
        order=lambda j:((ts[j['task']][0] if policy=='RMS' else j['deadline']),ts[j['task']][0],j['task'],j['release'])
        chosen=min(ready,key=order) if ready else None
        future=[H]+[r for r in releases if r>now]+[j['deadline'] for j in jobs if j['left'] and j['deadline']>now]
        if chosen:future.append(now+chosen['left'])
        end=min(future);spans.append((now,end,chosen['task'] if chosen else -1))
        if chosen:
            chosen['left']-=end-now
            if chosen['left']==0:chosen['finish']=end
        now=end
    trace=[next(i for a,b,i in spans if a<=F(k,2)<b) for k in range(2*horizon)]
    records=[dict(task=j['task'],release=float(j['release']),deadline=float(j['deadline']),remaining=float(j['left']),finish=None if j['finish'] is None else float(j['finish']),miss=j['miss']) for j in jobs]
    due=[j for j in jobs if j['deadline']<=H]
    return dict(utilization=float(sum(c/t for t,c in ts)),bound=len(ts)*(2**(1/len(ts))-1),first=[next(j['finish'] for j in records if j['task']==i) for i in range(len(ts))],misses=sum(j['miss'] for j in due),due=len(due),pending=sum(bool(j['left']) for j in jobs),work=float(sum(ts[j['task']][1]-j['left'] for j in jobs)),trace=trace,jobs=records)
sets=[[(5,1),(10,2),(20,3)],[(4,2),(6,2)],[(5,2),(7,4)],[(4,3),(6,3)]]
cases=[]
for case_id,tasks in enumerate(sets):
    for c3 in (range(1,15) if case_id==0 else [3]):
        actual=[dict(period=t,cost=(c3 if case_id==0 and i==2 else c)) for i,(t,c) in enumerate(tasks)]
        for policy in ['RMS','EDF']:cases.append(dict(caseId=case_id,c3=c3,policy=policy,**schedule(actual,policy)))
def q15(x):return max(-32768,min(32767,math.floor(x*32768+.5)))
a,b=q15(.6),q15(.4);prod=a*b;word=prod//32768
facts=dict(bounds={str(n):n*(2**(1/n)-1) for n in [1,2,3,4,5,10]},limit=math.log(2),exercise1U=.7,exercise1C4=(4*(2**.25-1)-.6)*20,exercise5U=.16854,latencyUs=20/168,latencyPercent=20/168,plainBlocking=6,plainResponse=9,inheritedBlocking=1,inheritedResponse=4,qA=a,qB=b,qProduct=prod,qWord=word,qValue=word/32768,qError=word/32768-.24,qAdd=28672/32768,qHalfProduct=8192,qMinSquared=32767)
Path(__file__).with_name('reference.json').write_text(json.dumps(dict(cases=cases,facts=facts),indent=2)+'\n',encoding='utf-8')
print(json.dumps({'default':next({k:v for k,v in c.items() if k not in ['trace','jobs']} for c in cases if c['caseId']==0 and c['c3']==3 and c['policy']=='RMS'),'facts':facts}))
