import json
import numpy as np
from scipy.integrate import quad,solve_ivp
cases=[]
for k in range(46):
 T=.5+.1*k
 W=quad(lambda time:np.exp(-2*(T-time)),0,T,epsabs=1e-13)[0]
 coefficient=-np.exp(-T)/W
 u=lambda time:coefficient*np.exp(-(T-time))
 times=np.linspace(0,T,401)
 solution=solve_ivp(lambda time,x:-x+u(time),(0,T),[1.],t_eval=times,rtol=1e-12,atol=1e-13)
 J=quad(lambda time:u(time)**2/2,0,T,epsabs=1e-13)[0]
 c=-np.exp(-T)/(1-np.exp(-T));Jc=T*c*c/2
 cases.append({'T':T,'x':solution.y[0].tolist(),'u':[u(t) for t in times],'J':J,'lambda0':-u(0),'c':c,'Jc':Jc,'peak':-u(T),'saving':100*(1-J/Jc)})
print(json.dumps({'cases':cases}))
