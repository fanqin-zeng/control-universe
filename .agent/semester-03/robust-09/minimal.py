from pathlib import Path
import json,numpy as np
from scipy.linalg import solve_continuous_are,solve_continuous_lyapunov
out={}
for q,r in [(1,.25),(1,1),(.25,1)]:
 a=-1.;P=float(solve_continuous_are([[a]],[[1]],[[q]],[[r]])[0,0]);Lk=P/r;Lh=-q/(r*a)
 def values(L):return {'gain':L,'peak':float(np.sqrt(q+r*L*L)/(L-a)),'variance':float(solve_continuous_lyapunov([[a-L]],[[-q-r*L*L]])[0,0])}
 out[str((q,r))]={'hinf':values(Lh),'kalman':values(Lk),'no_correction':values(0)}
M=np.array([[-1.5,.25,-.5],[.25,-.25,0],[-.5,0,-.25]])
out['certificate']={'p':.25,'gamma':.5,'eigenvalues':np.linalg.eigvalsh(M).tolist()};out['pulse']={str(T):float(np.sqrt(.2*(1+np.expm1(-5*T)/(5*T)))) for T in [.2,2,20]}
Path('.agent/semester-03/robust-09/minimal.json').write_text(json.dumps(out,indent=2),encoding='utf8');print(json.dumps(out,indent=2))
