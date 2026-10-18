import json
import numpy as np
from scipy import signal
cases=[]
for kp in [0,1,2,5]:
 for ki in [0,.1,.5,1,2,10,15]:
  for kd in [0,.2,1,2]:
   num=np.trim_zeros([kd,kp,ki],'f')
   if len(num)==0:num=[0.]
   t,y=signal.step((num,[1+kd,1+kp,ki]),T=np.arange(501)/50)
   cases.append(dict(kp=kp,ki=ki,kd=kd,y=y.tolist()))
for kd in [0,.2,2]:
 kp=2;ki=(1+kp)**2/(4*(1+kd));num=[kd,kp,ki]
 t,y=signal.step((np.trim_zeros(num,'f'),[1+kd,1+kp,ki]),T=np.arange(501)/50)
 cases.append(dict(kp=kp,ki=ki,kd=kd,y=y.tolist()))
print(json.dumps(cases))
