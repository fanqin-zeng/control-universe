import json, numpy as np, control as ct
from scipy.integrate import solve_ivp
s=ct.tf('s'); rows=[]
lead_t=1/(np.sqrt((-25+np.sqrt(625+4*500**2*6.5))/2)*np.sqrt(6.5))
t1=1/(3*np.sqrt(12)); a=1/(1000/(3*np.sqrt(10)*np.sqrt(109))*np.sqrt(12)); beta=3/(.3*np.sqrt(101/a**2-1));t2=1/(.3*beta)
for kind, gains, plant, C in [('lead',range(100,1001,100),1/(s*(s+5)),(1+6.5*lead_t*s)/(1+lead_t*s)),('lag',range(10,201,10),1/(s*(s+1)*(s+2)),(1+.0215*846*s)/(1+846*s)),('combined',sorted(set([110]+list(range(100,2001,100)))),1/(s*(s+1)*(s+10)),(1+12*t1*s)/(1+t1*s)*(1+beta*t2*s)/(1+t2*s))]:
 for k in gains:
  for corrected in [False,True]:
   L=k*plant*(C if corrected else 1);_,pm,_,wc=ct.margin(L);p=ct.poles(ct.feedback(L));w=10.**np.linspace(-4,4,401);v=np.array([ct.evalfr(L,1j*x) for x in w]);row=dict(kind=kind,k=k,corrected=corrected,wc=wc,pm=pm,stable=bool(np.max(p.real)<-1e-8),boundary=bool(np.any(np.abs(p.real)<1e-8)),db=(20*np.log10(abs(v))).tolist(),phase=(np.unwrap(np.angle(v))*180/np.pi).tolist())
   if kind!='lag':row['y']=np.asarray(ct.step_response(ct.feedback(L),np.arange(501)/100).outputs).tolist()
   rows.append(row)
aw=[]
for limit in [.5,2,5,100]:
 for mode in ['ideal','plain','back']:
  def f(t,x):
   raw=5*(1-x[0])+x[2];u=raw if mode=='ideal' else np.clip(raw,-limit,limit)
   return [x[1],u-2*x[1],2*(1-x[0])+(u-raw if mode=='back' else 0)]
  t=np.arange(501)/50;sol=solve_ivp(f,[0,10],[0,0,0],t_eval=t,rtol=1e-11,atol=1e-13,max_step=.002);raw=5*(1-sol.y[0])+sol.y[2];u=raw if mode=='ideal' else np.clip(raw,-limit,limit)
  aw.append(dict(limit=limit,mode=mode,y=sol.y[0].tolist(),integral=sol.y[2].tolist(),u=u.tolist()))
print(json.dumps(dict(rows=rows,aw=aw)))
