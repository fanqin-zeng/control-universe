import numpy as np,json
from fractions import Fraction as F
b,f,rho,A,sigma=F(4,5),F(1,2),F(1,2),F(1,2),F(1,2)
c=-b*f;vv=sigma*sigma/(1-rho*rho);syv=vv/(1-c*rho);vy=(b*b*A*A+vv+2*c*rho*syv)/(1-c*c);vu=A*A+f*f*vy;uv=-f*rho*syv
print(json.dumps({key:{'fraction':str(val),'value':float(val)} for key,val in {'Vv':vv,'Syv':syv,'Vy':vy,'Vu':vu,'Euv':uv,'Eru':A*A,'OLS_limit':b+uv/vu,'IV_limit':b}.items()}))
def sample(feedback=.5,color=.5,amplitude=.5,seed=1,N=4096,burn=256):
 ref=np.random.default_rng(seed).choice([-amplitude,amplitude],N+burn)
 innovation=np.random.default_rng(seed+104729).choice([-.5,.5],N+burn)
 yp=vp=up=0.;rows=[]
 for rk,w in zip(ref,innovation):
  u=rk-feedback*yp;v=color*vp+w;y=.8*u+v;rows.append((rk,u,y,v,yp,up));yp,vp,up=y,v,u
 return np.array(rows)[burn:]
for label,feedback,color,amp in [('colored',.5,.5,.5),('open',0,.5,.5),('white',.5,0,.5),('no_reference',.5,.5,0)]:
 estimates=[]
 for seed in range(1,33):
  r,u,y,v,yp,up=sample(feedback,color,amp,seed).T
  ols=np.dot(u,y)/np.dot(u,u)
  iv=np.dot(r,y)/np.dot(r,u) if np.dot(r,r)>0 else np.nan
  arx=np.linalg.lstsq(np.column_stack((yp,u,up)),y,rcond=None)[0][1] if amp else np.nan
  estimates.append([ols,iv,arx])
 arr=np.array(estimates)
 print(label,json.dumps({'mean':np.nanmean(arr,axis=0).tolist(),'rmse':np.sqrt(np.nanmean((arr-.8)**2,axis=0)).tolist()}))
