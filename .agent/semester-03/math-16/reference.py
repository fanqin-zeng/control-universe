import numpy as np,json,scipy,sympy
B=np.array([[-1,0,0],[1,-1,0],[0,1,-1],[0,0,1]],float)
cases=[]
for w in [0,.25,.5,.75,1,1.25,1.5]:
 L=B@np.diag([1,w,1])@B.T;ev=np.linalg.eigvalsh(L);ev[np.abs(ev)<1e-13]=0
 for a in [.1,.15,.25,.4,.5]:
  P=np.eye(4)-a*L;states=np.array([np.linalg.matrix_power(P,k)@np.array([0,2,4,6]) for k in range(21)])
  for k in range(21):
   x=states[k];cases.append(dict(parameters=[w,a,k],states=states.tolist(),values=x.tolist(),mean=float(x.mean()),energy=float(x@L@x),eigenvalues=ev.tolist(),rho=float(max(abs(1-a*ev[1:]))),components=2 if w==0 else 1,limit=[1,1,5,5] if w==0 else [3]*4,stable=bool(w>0 and a<2/ev[-1]),stepBound=float(2/ev[-1])))
print(json.dumps(dict(versions=dict(numpy=np.__version__,scipy=scipy.__version__,sympy=sympy.__version__),cases=cases)))
