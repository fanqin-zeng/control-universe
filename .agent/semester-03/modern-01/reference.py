import json
import numpy as np
from scipy.linalg import expm, logm
from scipy.integrate import solve_ivp
A=np.array([[0.,1.],[-64.,-2.]])
B=np.array([0.,.004])
M=np.block([[A,(1000*B)[:,None]],[np.zeros((1,3))]])
ts=np.linspace(0,3,601)
E=np.array([expm(A*t) for t in ts])
Z=np.array([(expm(M*t)@np.array([0.,0.,1.]))[:2] for t in ts])
cases=[]
for q in range(21):
 x0=q/100
 free=np.array([e@np.array([x0,0.]) for e in E])
 total=free+Z
 ode=solve_ivp(lambda t,x:[x[1],(1000-500*x[1]-16000*x[0])/250],[0,3],[x0,0],t_eval=ts,rtol=1e-11,atol=1e-13)
 assert np.max(np.abs(total.T-ode.y))<1e-9
 cases.append({'x0':x0,'free':free[:,0].tolist(),'step':Z[:,0].tolist(),'total':total[:,0].tolist(),'velocity':total[:,1].tolist()})
Ad=np.array([[.5,.2],[0.,.8]])
Alog=logm(Ad)/.1
motor=np.array([[-100.,-50.],[25.,-5.]])
roots=np.sort(np.linalg.eigvals(motor))
print(json.dumps({'cases':cases,'defaultAt1':{'free':cases[10]['free'][200],'step':cases[10]['step'][200],'total':cases[10]['total'][200]},'matrixLog':Alog.tolist(),'motorPoles':roots.tolist(),'motorTimeMs':(-1000/roots).tolist(),'motorSlowErrorPercent':100*(abs(roots[1])-17.5)/abs(roots[1])}))
