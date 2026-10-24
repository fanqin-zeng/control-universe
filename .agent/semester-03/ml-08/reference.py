"""Independent Decimal covariance projection and affine homogeneous-map oracle."""
import json,sys
from decimal import Decimal as D, localcontext

def reference(c):
 with localcontext() as ctx:
  ctx.prec=60
  m,s,a,t=map(lambda k:D(str(c[k])),['m','s','a','t'])
  # covariance of independent (X,Z), conditional regression via vector products
  cov=[[s*s,D(0)],[D(0),D(1)]]
  def bilinear(w,v):return sum(w[i]*cov[i][j]*v[j] for i in range(2) for j in range(2))
  wa=[a.sqrt(),(1-a).sqrt()];vy=bilinear(wa,wa);my=wa[0]*m
  epscov=bilinear([D(0),D(1)],wa);xcov=bilinear([D(1),D(0)],wa)
  diff=dict(mean=my,variance=vy,noise=epscov/vy*(1-my),score=-(1-my)/vy,
   estimate=m+xcov/vy*(1-my),posteriorVariance=s*s-xcov*xcov/vy,
   estimateVariance=xcov*xcov/vy,noiseRisk=1-epscov*epscov/vy)
  def coef(q):
   weights=[q,1-q];v=bilinear(weights,weights);cv=bilinear([D(1),D(-1)],weights)
   return v,cv/v,m-(cv/v)*q*m
  v,b,d=coef(t)
  field=dict(t=t,variance=v,slope=b,velocity=b+d,risk=bilinear([D(1),D(-1)],[D(1),D(-1)])-b*b*v)
  n=c['n'];h=D(1)/n;sign=D(c['sign']);A=D(1);B=D(0);history=[]
  for k in range(n+1):
   q=D(k)/n;v,b,d=coef(q)
   history.append(dict(t=q,mean=B,std=abs(A),exactMean=q*m,exactStd=v.sqrt()))
   # affine homogeneous 2x2 composition instead of updating particles
   if k<n:A,B=(1+sign*h*b)*A,(1+sign*h*b)*B+sign*h*d
  flow=dict(mean=B,std=abs(A),w2=((B-m)**2+(abs(A)-s)**2).sqrt(),history=history)
  def clean(x):
   if isinstance(x,D):return float(x)
   if isinstance(x,list):return list(map(clean,x))
   if isinstance(x,dict):return {k:clean(v) for k,v in x.items()}
   return x
  return clean(dict(diffusion=diff,field=field,flow=flow))
if __name__=='__main__':
 cases=json.load(open(sys.argv[1],encoding='utf-8'));json.dump([reference(c) for c in cases],open(sys.argv[2],'w',encoding='utf-8'),indent=2)
