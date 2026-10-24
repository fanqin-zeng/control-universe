"""Independent oracle: vectorized NumPy complex-step, no graph or manual chain rule."""
import sys,json,numpy as np
from fractions import Fraction as F
def training(delta):
    x=np.array([-1.,-.5,0,.5,1.]);y=np.tanh(2*x);y[2]+=delta;return x,y
vx=np.array([-.75,-.25,.25,.75]);vy=np.tanh(2*vx)
tx=np.array([-.9,-.4,.4,.9]);ty=np.tanh(2*tx)
def output(p,x):
    w,b,v,a=p;z=w*x+b
    if np.iscomplexobj(z):
        # Stable complex tanh: avoid overflow in saturated real parts.
        pos=z.real>=0;t=np.exp(np.where(pos,-2*z,2*z));h=np.where(pos,(1-t)/(1+t),(t-1)/(t+1))
    else:h=np.tanh(z)
    return v*h+a
def objective(p,x,y):return np.mean((output(p,x)-y)**2)/2
def gradient(p,x,y):
    result=[]
    for i in range(4):
        q=np.array(p,dtype=complex);q[i]+=1e-25j;result.append(float(objective(q,x,y).imag/1e-25))
    return np.array(result)
def fit(delta,eta,budget,initial):
    x,y=training(delta);p=np.array(initial,dtype=float);rows=[];best=0;status='budget';rejected=None
    for k in range(budget+1):
        g=gradient(p,x,y);norm=float(np.linalg.norm(g));tr=float(2*objective(p,x,y));va=float(np.mean((output(p,vx)-vy)**2))
        if not np.all(np.isfinite([*p,tr,va,norm])) or max(tr,va,norm)>1e6:
            status='guard';rejected=dict(step=k,train=tr,validation=va,norm=norm);break
        rows.append(dict(step=k,p=p.tolist(),train=tr,validation=va,norm=norm))
        if va<rows[best]['validation']:best=k
        if norm<=1e-8:status='gradient';break
        if k==budget:break
        p=p-eta*g
    return dict(history=rows,last=rows[-1],best=rows[best],updates=rows[-1]['step'],status=status,rejected=rejected)
def summary(r):return dict(initial=r['history'][0],first=r['history'][min(1,len(r['history'])-1)],updates=r['updates'],status=r['status'],best=r['best'],last=r['last'],rejected=r['rejected'],test=float(np.mean((output(r['best']['p'],tx)-ty)**2)),last_test=float(np.mean((output(r['last']['p'],tx)-ty)**2)))
error=0.;quantities=0
def compare(a,b,path=''):
    global error,quantities
    if isinstance(b,dict):
        for k,v in b.items():compare(a[k],v,path+'.'+k)
    elif isinstance(b,list):
        assert len(a)==len(b),(path,len(a),len(b))
        for i,v in enumerate(b):compare(a[i],v,path+str(i))
    elif isinstance(b,str) or b is None:assert a==b,(path,a,b)
    else:
        quantities+=1;e=abs(a-b);error=max(error,e);assert e<1e-8+abs(b)*1e-11,(path,a,b,e)
if __name__=='__main__':
    cases=json.load(open(sys.argv[1],encoding='utf-8'))
    drift=[];local_steps=0
    for c in cases['runs']:
        cfg=c['config'];actual=c['result'];x,y=training(cfg['delta']);rows=actual['history']
        # Check every accepted state and each update against an independent local derivative.
        for i,row in enumerate(rows):
            p=np.array(row['p']);g=gradient(p,x,y);tr=float(2*objective(p,x,y));va=float(np.mean((output(p,vx)-vy)**2));norm=float(np.linalg.norm(g))
            compare(dict(train=row['train'],validation=row['validation'],norm=row['norm']),dict(train=tr,validation=va,norm=norm));assert row['step']==i
            if i+1<len(rows):compare(rows[i+1]['p'],(p-cfg['eta']*g).tolist());local_steps+=1
        assert actual['best']['step']==min(range(len(rows)),key=lambda i:rows[i]['validation'])
        assert actual['updates']==len(rows)-1
        if actual['status']=='budget':assert actual['updates']==cfg['budget'] and rows[-1]['norm']>1e-8
        elif actual['status']=='gradient':assert rows[-1]['norm']<=1e-8
        else:
            p=np.array(rows[-1]['p']);q=p-cfg['eta']*gradient(p,x,y);tr=float(2*objective(q,x,y));va=float(np.mean((output(q,vx)-vy)**2));norm=float(np.linalg.norm(gradient(q,x,y)))
            assert max(tr,va,norm)>1e6 or not np.all(np.isfinite([*q,tr,va,norm]));compare(actual['rejected'],dict(step=len(rows),train=tr,validation=va,norm=norm))
        oracle=fit(**cfg)
        # Autonomous unstable trajectories may amplify arithmetic order differences.
        max_drift=max(abs(a-b) for r,s in zip(rows,oracle['history']) for a,b in zip(r['p'],s['p']))
        if len(rows)!=len(oracle['history']) or max_drift>1e-7:
            drift.append(dict(config=cfg,ts_steps=actual['updates'],oracle_steps=oracle['updates'],maximum_parameter_drift=max_drift))
    for c in cases['gradients']:
        x,y=training(c['delta']);compare(c['result'],dict(loss=float(objective(c['p'],x,y)),grad=gradient(c['p'],x,y).tolist()))
    reference_summary=[summary(fit(.3,.2,200,[.5,0,.5,0])),*[summary(fit(d,e,200,p)) for d,e,p in [(.3,0,[.5,0,.5,0]),(.3,.2,[0,0,0,0]),(.3,4,[.5,0,.5,0]),(0,.2,[.5,0,.5,0])]]]
    manual=dict(z=1.5,residual=.5,new_prediction=1.25,loss=float(F(1,8)),grad=[1,.5],again=[1,.5],after=[.4,.45],next_loss=float(F(1,32)))
    expected=[[manual,dict(shared_r_gradient=.5,reused_parameter_gradient=12,batches=3,updates=6,updates_drop=4,weights=[.4,.4,.2])],[reference_summary[0],reference_summary[1:]]]
    print(json.dumps(dict(pass_=True,max_error=error,quantities=quantities,runs=len(cases['runs']),local_steps=local_steps,autonomous_drift=drift,expected_notebooks=expected)))
