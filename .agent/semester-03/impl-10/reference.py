"""Independent exact rational oracle: integer codes, exact plant and PI state."""
from fractions import Fraction as F
from pathlib import Path
import json

def experiment(bits=8,mode='nominal',path='guarded',costMs=4):
    levels=2**bits-1;target=3 if mode=='capacity' else 1
    y=F(0);integ=F(0);code=0;u=F(0);stale=0;points=[]
    def q(v,span):
        scaled=max(F(0),min(F(span),v))*levels/span+F(1,2)
        return scaled.numerator//scaled.denominator
    for k in range(300):
        valid=(101 if mode=='late' else costMs)<=100 and not(mode=='drop' and 100<=k<=114)
        stale=0 if valid else stale+1
        if valid:code=q(y,4)
        measured=F(4*code,levels);degraded=path=='guarded' and stale>=3;saturated=False
        if valid or path=='naive':
            err=target-measured;trial=integ+err/20;raw=err+trial
            if 0<=raw<=1 or (raw>1 and err<=0) or (raw<0 and err>=0):integ=trial
            cmd=err+integ;saturated=cmd<0 or cmd>1;u=F(q(cmd,1),levels)
        elif degraded:u=F(0)
        points.append(dict(k=k,y=float(y),measured=float(measured),integral=float(integ),u=float(u),valid=valid,stale=stale,degraded=degraded,saturated=saturated))
        y=F(19,20)*y+u/10-(F(3,200) if mode=='load' and k>=150 else 0)
    states=[p['y'] for p in points]+[float(y)];lastError=max(abs(target-x) for x in states[251:]);overshoot=max(0,max(states)-target);invalid=sum(not p['valid'] for p in points)
    tracking=lastError<=.05;peakOk=overshoot<=.1;freshness=invalid==0
    return dict(bits=bits,mode=mode,path=path,costMs=costMs,target=target,levels=levels,points=points,final=float(y),iae=.1*sum(abs(target-p['y']) for p in points),lastError=lastError,overshoot=overshoot,invalid=invalid,degraded=sum(p['degraded'] for p in points),saturated=sum(p['saturated'] for p in points),tracking=tracking,peakOk=peakOk,freshness=freshness,accepted=tracking and peakOk and freshness)

cases=[experiment(b,m,p) for b in [4,8,12] for m in ['nominal','load','drop','late','capacity'] for p in ['guarded','naive']]+[experiment(8,'nominal',p,c) for p in ['guarded','naive'] for c in [100,101,120]]
summary=lambda c:{k:v for k,v in c.items() if k!='points'}
doc=dict(cases=cases,default=experiment(),table=[summary(experiment(8,m,p)) for m in ['nominal','load','drop','late','capacity'] for p in ['guarded','naive']],bounds=[summary(experiment(b)) for b in [4,8,12]],boundary=[summary(experiment(8,'nominal','guarded',c)) for c in [100,101]],events=dict(firstZero=102,lastZero=114,recovered=115),first=experiment()['points'][:2])
Path(__file__).with_name('reference.json').write_text(json.dumps(doc,indent=2)+'\n',encoding='utf-8')
if __name__=='__main__':print(json.dumps(dict(default=summary(doc['default']),table=doc['table'],bounds=doc['bounds'])))
