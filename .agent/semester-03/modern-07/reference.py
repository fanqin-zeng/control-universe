import json
import numpy as np
from scipy.linalg import solve_continuous_are
from scipy.integrate import solve_ivp
from pathlib import Path
cases=json.loads(Path('.agent/semester-03/modern-07/cases.json').read_text(encoding='utf-8'))
A=np.array([[0.,1.],[0.,0.]]);B=np.array([[0.],[1.]])
records=[]
for q1,q2,r,alpha in cases:
 P=solve_continuous_are(A,B,np.diag([q1,q2]),[[r]]);K=B.T@P/r;F=A-alpha*B@K
 points=solve_ivp(lambda time,x:F@x,(0,15),[1.,0.],t_eval=[0.,1.,5.,15.],rtol=1e-11,atol=1e-12).y.T
 records.append({'params':[q1,q2,r,alpha],'P':P.tolist(),'K':K.ravel().tolist(),'states':points.tolist(),'u':(-alpha*points@K.T).ravel().tolist()})
print(json.dumps({'cases':records}))
