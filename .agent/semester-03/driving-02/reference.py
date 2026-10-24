import numpy as np
from scipy.linalg import expm
import math, json

def reference(u, delta, mu):
    # Construct state equations from axle forces and yaw moment, not copied A entries.
    def rhs(state, steering):
        vy, r = state
        front = 80000 * (steering - (vy + 1.4*r)/u)
        rear = 80000 * (-(vy - 1.4*r)/u)
        return np.array([(front+rear)/1600-u*r, 1.4*(front-rear)/2500])
    B=rhs([0,0],1)
    A=np.column_stack([rhs([1,0],0),rhs([0,1],0)])
    aug=np.zeros((3,3));aug[:2,:2]=A;aug[:2,2]=B*delta
    values=[]
    for t in np.linspace(0,2,201):
        values.append([float(t),*(expm(aug*t)@np.array([0,0,1]))[:2]])
    steady=np.linalg.solve(A,-B*delta)
    alpha_f=delta-(steady[0]+1.4*steady[1])/u
    alpha_r=-(steady[0]-1.4*steady[1])/u
    return dict(u=u,delta=delta,mu=mu,A=A.tolist(),B=B.tolist(),steady=steady.tolist(),values=values,alpha=[alpha_f,alpha_r],ay=float(u*steady[1]),usage=abs(float(u*steady[1]))/(mu*9.81))

cases=[reference(*args) for args in [(10,.04,.8),(20,.04,.3),(5,-.08,.8),(25,.08,.8),(10,0,.8),(25,-.08,.2)]]
theta=10/2.8*math.tan(.04)*2
radius=2.8/math.tan(.04)
report=dict(cases=cases,kinematic=dict(radius=radius,yawRate=theta/2,X=radius*math.sin(theta),Y=radius*(1-math.cos(theta)),psi=theta),initialDerivative=[2,1.792])
print(json.dumps(report))
