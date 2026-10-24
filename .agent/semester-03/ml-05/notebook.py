import json

def seq(a=.5, n=4, kind='impulse', initial=0, k=2):
    x=[(1 if i==0 else 0) if kind=='impulse' else 1 if kind=='constant' else (-1)**i for i in range(n)]
    h=[initial]; sensitivity=[1]
    for v in x:
        h.append(a*h[-1]+v); sensitivity.append(a*sensitivity[-1])
    adj=h[-1]; full=0; truncated=0; contributions=[0]*n
    for t in range(n,0,-1):
        contributions[t-1]=adj*h[t-1]; full+=contributions[t-1]
        if t>n-k: truncated+=contributions[t-1]
        adj*=a
    return dict(x=x,h=h,sensitivity=sensitivity,loss=h[-1]**2/2,full=full,truncated=truncated,contributions=contributions)

def cooling(a):
    truth=[1]; one=[]; rollout=[]
    for t in range(4):
        truth.append(.8*truth[-1]); one.append(a*truth[t]); rollout.append(a*(rollout[-1] if rollout else 1))
    mse=lambda ys:sum((ys[i]-truth[i+1])**2 for i in range(4))/4
    return dict(a=a,truth=truth[1:],oneStep=one,rollout=rollout,oneMSE=mse(one),rolloutMSE=mse(rollout))
