import math, json

def diffusion(m=2.0,s=0.5,a=0.5,y=1.0):
    v=a*s*s+1-a
    mean=math.sqrt(a)*m
    noise=math.sqrt(1-a)*(y-mean)/v
    score=-(y-mean)/v
    estimate=(y-math.sqrt(1-a)*noise)/math.sqrt(a)
    return dict(mean=mean,variance=v,noise=noise,score=score,estimate=estimate,
                posteriorVariance=s*s*(1-a)/v,estimateVariance=a*s**4/v,noiseRisk=a*s*s/v)

def velocity(t,x,m=2.0,s=0.5):
    v=(1-t)**2+(t*s)**2
    b=(t*s*s-(1-t))/v
    return m+b*(x-t*m)

def flow(m=2.0,s=0.5,n=8,sign=1):
    particles=[-1.0,0.0,1.0]
    history=[dict(t=0.0,mean=0.0,std=1.0,exactMean=0.0,exactStd=1.0)]
    for k in range(n):
        t=k/n
        particles=[x+sign*velocity(t,x,m,s)/n for x in particles]
        q=(k+1)/n
        history.append(dict(t=q,mean=particles[1],std=abs(particles[2]-particles[0])/2,
                            exactMean=q*m,exactStd=math.sqrt((1-q)**2+(q*s)**2)))
    end=history[-1]
    return dict(mean=end['mean'],std=end['std'],w2=math.hypot(end['mean']-m,end['std']-s),history=history)

def snapshot(m=2.0,s=0.5,a=0.5,t=0.5,n=8,sign=1):
    v=(1-t)**2+(t*s)**2
    b=(t*s*s-(1-t))/v
    return dict(diffusion=diffusion(m,s,a),field=dict(t=t,variance=v,slope=b,velocity=velocity(t,1,m,s),risk=s*s/v),flow=flow(m,s,n,sign))
