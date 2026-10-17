"""Independent impulse weights and covariance matrices, never the TS state update loop."""
import json,math,itertools
import numpy as np
import scipy
from scipy.integrate import quad
cases=[]
for a,q,second in itertools.product([-.8,-.5,-.1,0,.1,.5,.8],[.25,.5,.75,1],[False,True]):
 limit=q/(1-a*a);p0=limit if second else 0
 B=np.zeros((13,13))
 for k in range(13):
  B[k,0]=a**k
  for r in range(k):B[k,r+1]=a**(k-1-r)
 C=(B*np.array([p0]+[q]*12))@B.T
 signs=[[1]*12,[-1]*12,[(-1)**j for j in range(12)],[1 if j%4<2 else -1 for j in range(12)]]
 paths=[]
 for i,s in enumerate(signs):
  initial=([1,-1,1,-1][i]*math.sqrt(limit)) if second else 0
  paths.append([[k,a**k*initial+math.sqrt(q)*math.fsum(a**(k-1-r)*s[r] for r in range(k))] for k in range(13)])
 variances=[[k,float(C[k,k])] for k in range(13)]
 for selected in range(13):cases.append(dict(parameters=[a,q,second,selected],mean=0,variance=float(C[selected,selected]),sd=math.sqrt(C[selected,selected]),limit=limit,initialVariance=p0,variances=variances,paths=paths))
spectra=[]
for a in [-.5,0,.5]:
 gamma=np.array([a**l for l in range(1,129)])
 series=lambda t:1+2*float(gamma@np.cos(np.arange(1,129)*t))
 angles=[0,math.pi/2,math.pi,.2,1]
 values=[series(t) for t in angles]
 expected=[(1-a*a)/(1+a*a-2*a*math.cos(t)) for t in angles]
 assert np.max(np.abs(np.array(values)-expected))<1e-10
 integral=quad(series,-math.pi,math.pi,epsabs=1e-12,epsrel=1e-12,limit=500)[0]/(2*math.pi)
 assert abs(integral-1)<1e-10
 C4=np.array([[a**abs(i-j) for j in range(4)] for i in range(4)])
 spectra.append(dict(a=a,q=1-a*a,angles=angles,values=values,integral=integral,averageVariance=float(np.ones(4)@C4@np.ones(4)/16)))
A=np.diag([.5,.25]);Q=np.array([[.75,.25],[.25,15/16]])
Ps=np.linalg.solve(np.eye(4)-np.kron(A,A),Q.reshape(4,order='F')).reshape((2,2),order='F')
assert np.max(np.abs(Ps-np.array([[1,2/7],[2/7,1]])))<1e-10
L=np.tril(np.ones((3,3)));brownian=L@np.diag([1,1,2])@L.T
print(json.dumps(dict(cases=cases,spectra=spectra,vector=dict(Ps=Ps.tolist(),P2=(Q+A@Q@A.T).tolist(),residual=float(np.max(np.abs(Ps-A@Ps@A.T-Q)))),brownian=brownian.tolist(),versions=dict(numpy=np.__version__,scipy=scipy.__version__))))
