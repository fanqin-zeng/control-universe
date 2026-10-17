import json,itertools,numpy as np,sys,scipy
from scipy.optimize import minimize
# Independent projection: enumerate active constraints and solve equality KKT systems.
G=np.array([[-1.,0.],[0.,-1.],[1.,1.]])
def project(y,b):
 h=np.array([0.,0.,b]); choices=[]
 for size in range(3):
  for active in itertools.combinations(range(3),size):
   if size:
    M=G[list(active)]; lam=np.linalg.solve(M@M.T,M@y-h[list(active)]); x=y-M.T@lam
    if np.min(lam)<-1e-9:continue
   else:x=y.copy()
   if np.max(G@x-h)<=1e-9:choices.append(x)
 assert choices
 return min(choices,key=lambda x:np.dot(x-y,x-y)).copy()
cases=[]
for a,c,b,e in itertools.product([0.,.25,1.,2.,3.],[0.,.5,1.,2.,3.],[0.,.25,1.,2.,3.,4.],[.25,.5,1.,1.5,2.]):
 r=np.array([a,c]); opt=project(r,b); u=np.zeros(2); paths=[u.copy().tolist()]; vals=[[0,float(np.dot(u-r,u-r)/2)]]
 for k in range(1,19):
  u=project((1-e)*u+e*r,b);paths.append(u.tolist());vals.append([k,float(np.dot(u-r,u-r)/2)])
 mapped=project((1-e)*u+e*r,b)
 cases.append({'parameters':[a,c,b,e],'optimum':opt.tolist(),'optimalValue':float(np.dot(opt-r,opt-r)/2),'paths':paths,'values':vals,'last':u.tolist(),'lastValue':vals[-1][1],'distance':float(np.linalg.norm(u-opt)),'residual':float(np.linalg.norm(u-mapped)/e),'violation':float(max(0,-min(u),sum(u)-b))})
print(json.dumps({'versions':{'python':sys.version,'numpy':np.__version__,'scipy':scipy.__version__},'cases':cases}))
