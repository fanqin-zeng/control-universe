import json,math
import numpy as np
import matplotlib.pyplot as plt
def schedule(tasks,policy='RMS',horizon=60):
    jobs=[];trace=[]
    for tick in range(2*horizon+1):
        now=tick/2
        for job in jobs:
            if job['remaining']>0 and job['deadline']<=now:job['miss']=True
        if now==horizon:break
        for i,(period,cost) in enumerate(tasks):
            if tick%(2*period)==0:jobs.append(dict(task=i,release=now,deadline=now+period,remaining=cost,finish=None,miss=False))
        ready=[j for j in jobs if j['remaining']>0]
        rank=lambda j:((tasks[j['task']][0] if policy=='RMS' else j['deadline']),tasks[j['task']][0],j['task'],j['release'])
        chosen=min(ready,key=rank) if ready else None;trace.append(chosen['task'] if chosen else -1)
        if chosen:
            chosen['remaining']-=.5
            if chosen['remaining']==0:chosen['finish']=now+.5
    due=[j for j in jobs if j['deadline']<=horizon]
    return dict(U=sum(c/t for t,c in tasks),bound=len(tasks)*(2**(1/len(tasks))-1),first=[next(j['finish'] for j in jobs if j['task']==i) for i in range(len(tasks))],misses=sum(j['miss'] for j in due),due=len(due),pending=sum(j['remaining']>0 for j in jobs),trace=trace,jobs=jobs)
def response(tasks):
    result=[]
    for i,(t,c) in enumerate(tasks):
        higher=[(tj,cj) for j,(tj,cj) in enumerate(tasks) if (tj,j)<(t,i)]
        r=c;seq=[r]
        for _ in range(100):
            nxt=c+sum(math.ceil(r/tj)*cj for tj,cj in higher);seq.append(nxt)
            if nxt==r or nxt>t:break
            r=nxt
        result.append(dict(response=seq[-1],pass_=seq[-1]<=t,iterations=seq))
    return result
def timeline(tasks,policy='RMS',horizon=60):
    v=schedule(tasks,policy,horizon)
    for i in range(len(tasks)):
        spans=[(k/2,.5) for k,j in enumerate(v['trace']) if j==i]
        plt.broken_barh(spans,(i+.7,.6),label='task '+str(i+1))
    plt.xlim(0,horizon);plt.ylim(.5,len(tasks)+.5);plt.yticks(range(1,len(tasks)+1));plt.xlabel('Time (ms)');plt.ylabel('Task');plt.grid(axis='x')
