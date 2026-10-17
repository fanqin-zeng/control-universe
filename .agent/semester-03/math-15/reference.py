import json,itertools,numpy as np,sys,scipy
from scipy.integrate import solve_ivp
from scipy.linalg import expm
A=np.array([[0.,-1.],[1.,0.]])
def solve(e,theta):
 controls=[(1.,0.),(0.,1.),(-1.,0.),(0.,-1.)];sols=[];z=np.array([0.,0.,theta])
 for i,(v,w) in enumerate(controls):
  def rhs(t,z):return [v*np.cos(z[2]),v*np.sin(z[2]),w]
  sol=solve_ivp(rhs,[i*e,(i+1)*e],z,rtol=1e-12,atol=1e-14,dense_output=True,max_step=e/8);assert sol.success
  sols.append(sol);z=sol.y[:,-1]
 def at(t):return sols[min(int(t/e),3)].sol(t)
 return at,z
cases=[]
for e,theta in itertools.product([.1,.25,.5,.8],[-np.pi/2,-np.pi/4,0.,np.pi/6,np.pi/2]):
 at,net=solve(e,theta);direction=np.array([np.cos(theta),np.sin(theta)]);br=-A@direction;approx=e*e*br
 samples=[[t,*at(t).tolist()] for t in np.linspace(0,4*e,101)]
 curve=[[0.,*br.tolist()]]+[[a,*(((np.eye(2)-expm(A*a))@direction)/a).tolist()] for a in np.arange(1,81)/100]
 for progress in [0.,.25,.375,.625,.75,1.]:
  cases.append({'parameters':[e,theta,progress],'samples':samples,'net':net.tolist(),'bracket':br.tolist(),'approx':approx.tolist(),'selectedTime':4*e*progress,'selected':at(4*e*progress).tolist(),'norm':float(np.linalg.norm(net[:2])),'error':float(np.linalg.norm(net[:2]-approx)),'scaled':(net[:2]/e**2).tolist(),'duration':4*e,'curve':curve})
print(json.dumps({'versions':{'python':sys.version,'numpy':np.__version__,'scipy':scipy.__version__},'cases':cases}))
