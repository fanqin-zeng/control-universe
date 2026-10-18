import json,numpy as np
from scipy.signal import StateSpace,step
from scipy.linalg import expm
from pathlib import Path
ns={};book=json.loads(Path('.agent/semester-03/classic-11/extracted.json').read_text(encoding='utf8'))['notebooks'][0]
exec(book['setupCode'],ns)
ct=ns['ct'];response=ns['response'];plant=ns['plant'];controllers=ns['controllers'];maxerr=0;cases=[]
for R,J,B,K in [(1,.01,.001,.1),(1,.015,.001,.1),(1.3,.01,.001,.1),(.8,.005,.002,.09)]:
 Ap=np.array([[-R/.01,-K/.01],[K/J,-B/J]]);bu=np.array([[100.],[0.]]);cy=np.array([[0.,1.]]);E=np.array([[0.],[-1/J]])
 for name,C in controllers.items():
  if name=='P50':Ac=np.zeros((0,0));bc=np.zeros((0,1));cc=np.zeros((1,0));dc=50
  elif name in ['PI','PIsoft']:
   kp,ki=(10.24,11.26) if name=='PI' else (2,2.2);Ac=np.zeros((1,1));bc=np.ones((1,1));cc=np.array([[ki]]);dc=kp
  elif name=='PIDf':Ac=np.diag([0.,-1000.]);bc=np.array([[1.],[1000.]]);cc=np.array([[5.5,-300.]]);dc=305.
  else:Ac=np.array([[-1/.00167]]);bc=np.array([[1/.00167]]);dc=50*.00644/.00167;cc=np.array([[50-dc]])
  A=np.block([[Ap-bu*dc@cy,bu@cc],[-bc@cy,Ac]]);br=np.vstack([bu*dc,bc]);cr=np.hstack([cy,np.zeros((1,len(Ac)))]);cu=np.hstack([-dc*cy,cc]);ed=np.vstack([E,np.zeros((len(Ac),1))]);P=plant(R,J,B,K);t=np.arange(1001)/200
  systems=[(br,cr,0,ct.feedback(C*P)),(br,cu,dc,ct.feedback(C,P)),(ed,cr,0,ct.tf([-.01,-R],[.01*J,.01*B+R*J,R*B+K*K])*ct.feedback(1,C*P))]
  for inp,out,direct,H in systems:
   _,y=step(StateSpace(A,inp,out,[[direct]]),T=t);z=response(H,t);err=float(np.max(abs(y-z)));maxerr=max(maxerr,err);assert err<2e-7,(name,err)
  for w in [.01,.1,1,10,100,1000,10000]:
   v=(cr@np.linalg.solve(1j*w*np.eye(len(A))-A,br)).item();assert abs(v-ct.evalfr(ct.feedback(C*P),1j*w))<1e-8
  cases.append(dict(name=name,R=R,J=J,B=B,K=K,maxRootReal=float(np.max(np.linalg.eigvals(A).real))))
P=plant();# independent P reference used by actual TS harness
p=[]
for k in [1,2,2.3950025,5,10.89,50,100]+list(np.linspace(1,100,100)):
 A=np.array([[-100.,-10.-100*k],[10.,-.1]]);br=np.array([[100*k],[0.]]);t=np.arange(601)/200
 _,y=step(StateSpace(A,br,[[0,1]],[[0]]),T=t);p.append(dict(k=float(k),y=y.tolist()))
from scipy.integrate import solve_ivp
sat=[]
for aw in [False,True]:
 t,orig,u,xi=ns['saturated'](100,aw)
 def physical(t,x):
  current,speed,integral,filtered=x;err=100-speed;request=305*err+integral-300*filtered;voltage=max(-24,min(24,request))
  return [(voltage-current-.1*speed)/.01,(.1*current-.001*speed)/.01,5.5*err+(20*(voltage-request) if aw else 0),1000*(err-filtered)]
 alternative=solve_ivp(physical,[0,8],[0,0,0,0],method='Radau',t_eval=t,rtol=1e-9,atol=1e-11,max_step=.002)
 err=float(max(abs(alternative.y[1]-orig)));assert err<2e-4;sat.append(dict(antiwindup=aw,maxSpeedDifference=err))
print(json.dumps(dict(saturation=sat,pass_=True,maxResponseError=maxerr,cases=cases,p=p)))
