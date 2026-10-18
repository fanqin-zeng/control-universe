import json
import numpy as np
from scipy.integrate import solve_ivp
A=np.array([[0.,1.],[-2.,-3.]]);C=np.array([[1.,0.]]);t=np.linspace(0,2,401)
cases=[]
for p in range(-30,-4):
    # Gains independently obtained by the two target polynomial coefficients.
    l1=-2*p-3;l2=p*p-3*l1-2;L=np.array([l1,l2])
    z=solve_ivp(lambda time,z:np.r_[A@z[:2],A@z[2:]+L*(C@(z[:2]-z[2:])).item()],(0,2),[1.,0.,0.,0.],t_eval=t,rtol=1e-12,atol=1e-13).y.T
    F=A-L[:,None]@C;noise=abs(np.linalg.solve(100j*np.eye(2)-F,L)[1])
    cases.append({'p':p,'x':z[:,:2].tolist(),'estimate':z[:,2:].tolist(),'e':(z[:,2:]-z[:,:2]).tolist(),'noise':float(noise)})
print(json.dumps({'cases':cases}))
