import numpy as np
for mode in ['periodic','constant','alternating','burst']:
 def u(k):
  if mode=='constant':return 1.
  if mode=='alternating':return 1. if k%2==0 else -1.
  return [1.,0.,-1.,0.][k%4] if mode!='burst' or 0<=k<8 else 0.
 X=np.array([[u(k),u(k-1)] for k in range(64)]);theta=np.array([.6,.2]);Y=X@theta
 estimate=np.linalg.solve(np.eye(2)+X.T@X,X.T@Y)
 windows=[np.linalg.eigvalsh(X[k:k+8].T@X[k:k+8])[0] for k in range(57)]
 print(mode,'gram8',X[:8].T@X[:8],'min_window',min(windows),'theta64',estimate,'rank',np.linalg.matrix_rank(X),flush=True)
for a in [1.,.1]:
 X=np.array([[a*[1,0,-1,0][k%4],a*[1,0,-1,0][(k-1)%4]] for k in range(64)])
 e=.01*np.array([[1,0,-1,0][k%4] for k in range(64)])
 print('perturbed',a,np.linalg.lstsq(X,X@np.array([.6,.2])+e,rcond=None)[0],flush=True)
