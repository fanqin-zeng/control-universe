import numpy as np
from scipy.optimize import minimize
r=np.array([2.,1.]); b=2.
f=lambda u: np.sum((u-r)**2)/2
s=minimize(f,[0.,0.],jac=lambda u:u-r,bounds=[(0,None)]*2,constraints=[{'type':'ineq','fun':lambda u:b-sum(u),'jac':lambda u:-np.ones(2)}],method='SLSQP',options={'ftol':1e-12})
assert s.success and np.allclose(s.x,[1.5,.5])
x=np.zeros(2)
print('optimum',s.x,'objective',s.fun,'lambda',.5,'dual',.25)
for k in range(4):
 print(k,x,f(x)); y=x+.5*(r-x); threshold=max(0,(sum(y)-b)/2); x=np.maximum(y-threshold,0)
print('strict convex no attainment exp; infeasible [2,1]; unbounded -u; all analytic examples')
