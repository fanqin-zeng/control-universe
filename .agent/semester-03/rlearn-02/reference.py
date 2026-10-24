"""Independent closed-form reference for a synthetic imitation-learning lesson."""
import json
import math
import sys

def mse(k, b):
    return sum(((0.5-k)*x+b)**2 for x in [-0.02, 0.0, 0.02])/3

def rollout(k, b, x0, horizon=20):
    r=1-k
    points=[]
    for n in range(horizon+1):
        x=x0*r**n+b*(n if abs(r-1)<1e-14 else (1-r**n)/(1-r))
        points.append([n,x])
        if abs(x)>1:
            break
    return {"points":points,"finalX":points[-1][1],"lastStep":points[-1][0],
            "exited":abs(points[-1][1])>1,"trainMSE":mse(k,b),
            "expertFinal":x0*0.5**horizon}

def fit(xs, ys):
    xm=sum(xs)/len(xs);ym=sum(ys)/len(ys)
    w=sum((x-xm)*(y-ym) for x,y in zip(xs,ys))/sum((x-xm)**2 for x in xs)
    return w,ym-w*xm

def examples():
    xs=[-0.02,0,0.02];ys=[-0.5*x for x in xs]
    w,b=fit(xs,ys)
    aggregated_x=xs+[0.1];aggregated_y=ys+[-0.05]
    const=sum(aggregated_y)/len(aggregated_y)
    wa,ba=fit(aggregated_x,aggregated_y)
    modes=[-0.2,0.2];average=sum(modes)/len(modes)
    return {"fit":{"constant":sum(ys)/len(ys),"constant_train_mse":mse(0,0),"w":w,"b":b,"validation_mse_constant":0.015**2},
            "default":rollout(0,0.01,0.1),"zero_bias":rollout(0,0,0.1),"feedback":rollout(0.5,0,0.1),"wrong_direction":rollout(-0.2,0.01,0.1),
            "aggregation":{"constant":const,"affine":[wa,ba],"initial_states":[-0.1,0,0.1],"before":[x for x in [-0.1,0,0.1]],"after_constant":[x+20*const for x in [-0.1,0,0.1]],"after_affine":[x*0.5**20 for x in [-0.1,0,0.1]],"collected_steps":20,"new_queries":1,"total_labels":4},
            "multimodal":{"mean":average,"mean_loss":sum((average-a)**2 for a in modes)/2,"mode_loss":sum((-0.2-a)**2 for a in modes)/2,"mean_in_obstacle":abs(average)<0.1}}

if __name__=='__main__':
    if '--grid' in sys.argv:
        rows=[{"k":k,"b":b,"x0":x,"horizon":n,"result":rollout(k,b,x,n)} for k in [-0.2,0,0.3,0.5,1,1.5] for b in [-0.02,-0.01,0,0.01,0.02] for x in [-0.5,-0.1,0,0.1,0.5] for n in [1,5,20]]
        print(json.dumps(rows))
    else:
        print(json.dumps(examples(),indent=2))
