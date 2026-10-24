import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize_scalar

def cost(c,u):
    x=c['x0'];v=2-u;y=x+u-1
    return c['p0']*u+c['p1']*v+.5*(u*u+v*v)+.5*c['h']*(x*x+y*y)

def original(c,tracking=False):
    x=c['x0'];C=c['capacity'];U=c['limit']
    if x<0 or x>C:return None
    # Construct the feasible interval from the six ORIGINAL input/state inequalities.
    inequalities=[(-1,0),(1,U),(1,2),(-1,U-2),(-1,x-1),(1,C+1-x)]
    lower=max(b/a for a,b in inequalities if a<0);upper=min(b/a for a,b in inequalities if a>0)
    if lower>upper:return None
    objective=(lambda u:.5*c['h']*(x*x+(x+u-1)**2)+.5*((u-1)**2+(1-u)**2)) if tracking else lambda u:cost(c,u)
    if lower==upper:u=lower
    else:
        ans=minimize_scalar(objective,bounds=(lower,upper),method='bounded',options={'xatol':1e-12})
        assert ans.success;u=min([lower,upper,ans.x],key=objective)
    return dict(u=np.array([u,2-u]),x=np.array([x,x+u-1,x]),cost=cost(c,u),objective=objective(u))

default=dict(x0=0.,capacity=2.,limit=2.,p0=1.,p1=4.,h=.2)
