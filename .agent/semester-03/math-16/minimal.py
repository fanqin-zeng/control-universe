import numpy as np
from scipy.linalg import expm
x0=np.arange(4.)*2
for w in [0,1,1.5]:
 B=np.array([[-1,0,0],[1,-1,0],[0,1,-1],[0,0,1.]])
 L=B@np.diag([1,w,1])@B.T
 for a in [.25,.5]:
  P=np.eye(4)-a*L;rows=np.array([np.linalg.matrix_power(P,k)@x0 for k in range(21)])
  print(w,a,'eigen',np.linalg.eigvalsh(L),'first',rows[1],'last',rows[-1],'bounds',rows.min(),rows.max())
print('continuous1',expm(-B@np.eye(3)@B.T)@x0)
