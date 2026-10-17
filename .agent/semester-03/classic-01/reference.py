import json,numpy as np,scipy,sympy
from scipy.linalg import expm
m=250.;k=16000.;x0=np.array([.05,0.]);cases=[]
for z in np.arange(41)/20:
 c=2*z*np.sqrt(m*k);A=np.array([[0.,1.],[-k/m,-c/m]])
 def at(t):
  y,v=expm(A*t)@x0
  return [t,y,v,.5*m*v*v+.5*k*y*y,c*v*v]
 cases.append(dict(zeta=float(z),c=float(c),wn=8,samples=[at(j/100) for j in range(301)],cursors=[at(t) for t in [0,.37,1,3]]))
print(json.dumps(dict(versions=dict(numpy=np.__version__,scipy=scipy.__version__,sympy=sympy.__version__),cases=cases)))
