from pathlib import Path
import json,numpy as np,control as ctrl,sympy as sy
from scipy.optimize import minimize_scalar
from scipy.integrate import quad
from scipy import signal
import matplotlib
matplotlib.use('Agg')
E=Path('.agent/semester-03/robust-06');raw=json.loads((E/'extracted.json').read_text(encoding='utf8'));scopes=[]
for nb in raw['notebooks']:
 ns={};exec(nb['setupCode'],ns)
 for cell in nb['cells']:exec(cell['code'],ns)
 scopes.append(ns)
actual=json.loads((E/'actual-ts.json').read_text());error=0.
for row in actual['cases']:
 p=row['p'];a,k,rho,wb=[p[x] for x in ['a','k','rho','wb']];G=ctrl.tf([100],[1,1,100]);K=ctrl.tf(np.array([1,1,100])*k/100,[1,a,0]);S=ctrl.feedback(1,G*K);T=ctrl.feedback(G*K,1);U=ctrl.feedback(K,G);W=ctrl.tf([.5,wb],[1,.01*wb]);w=scopes[0]['w'];v=np.sqrt(abs((W*S)(1j*w))**2+.01*abs(T(1j*w))**2+rho*rho*abs(U(1j*w))**2)
 expected={'scanPeak':max(1.,float(max(abs(S(1j*w))))),'gamma':max(float(max(v)),.1,np.hypot(.5,rho*k/100)),'DC':0.,'T10':float(abs(T(10j))),'initialControl':k/100}
 assert max(ctrl.poles(T).real)<0
 for key,x in expected.items():error=max(error,abs(x-row['readings'][key]))
 for point in row['frequency']:
  w0=point['w'];vv={'S':abs(S(1j*w0)),'T':abs(T(1j*w0)),'KS':abs(U(1j*w0)),'W1':abs(W(1j*w0)),'bound':1/abs(W(1j*w0)),'stack':np.sqrt(abs((W*S)(1j*w0))**2+.01*abs(T(1j*w0))**2+rho*rho*abs(U(1j*w0))**2)}
  for key,x in vv.items():error=max(error,abs(x-point[key]))
assert error<1e-8,error
# Independent log-frequency maximization vs notebook rational stationary polynomials.
peak_error=0.;full={}
for a,k,rho in [(20,100,.01),(20,200,.01),(30,450,.01),(20,200,.1),(20,200,.2)]+[(r['a'],r['k'],r['rho']) for r in scopes[1]['search']]:
 GG=ctrl.tf([100],[1,1,100]);KK=ctrl.tf(np.array([1,1,100])*k/100,[1,a,0]);SS=ctrl.feedback(1,GG*KK);TT=ctrl.feedback(GG*KK,1);UU=ctrl.feedback(KK,GG);WW=ctrl.tf([.5,5],[1,.05]);target=scopes[0]['full_peaks'](a,k,rho)
 def independent(w):return [abs(SS(1j*w)),None,None,np.sqrt(abs((WW*SS)(1j*w))**2+.01*abs(TT(1j*w))**2+rho*rho*abs(UU(1j*w))**2)]
 values={}
 for name,channel in [('Ms',0),('gamma',3)]:
  ww=np.logspace(-5,5,10001);v=independent(ww)[channel];v=abs(v);j=int(np.argmax(v));fit=minimize_scalar(lambda x:-abs(independent(np.exp(x))[channel]),bounds=(np.log(ww[max(0,j-2)]),np.log(ww[min(len(ww)-1,j+2)])),method='bounded',options={'xatol':1e-13})
  endpoints=1 if name=='Ms' else max(.1,np.hypot(.5,rho*k/100));best=max(endpoints,-fit.fun);values[name]=best;peak_error=max(peak_error,abs(best-target[name][0]))
 full[f'{a}/{k}/{rho}']=values
assert peak_error<1e-7,peak_error
s=sy.symbols('s');G=100/(s*s+s+100);K=2*(s*s+s+100)/(s*(s+20));assert sy.cancel(G*K/(1+G*K)-200/(s*s+20*s+200))==0
char=sy.expand((s*s+s+100)*s*(s+20)+200*(s*s+s+100));assert sy.factor(char)==(s*s+s+100)*(s*s+20*s+200)
integral=quad(lambda w:np.log(abs((1+1j*w)/(3+1j*w))),0,np.inf)[0];assert abs(integral+np.pi)<1e-8
# Independent physical step via scipy state-space lsim vs original notebook control.step_response.
ns=scopes[1];T=ctrl.tf([200],[1,20,200]);U=ctrl.tf([2,2,200],[1,20,200]);t=ns['t'];_,yy,_=signal.lsim(signal.TransferFunction(T.num[0][0],T.den[0][0]),np.ones_like(t),t);_,uu,_=signal.lsim(signal.TransferFunction(U.num[0][0],U.den[0][0]),np.ones_like(t),t)
time_error=max(float(max(abs(yy-ns['y']))),float(max(abs(uu-ns['u']))));assert time_error<1e-8
result={'pass':True,'default':actual['default'],'maxTsError':error,'peakError':peak_error,'timeError':time_error,'full':full,'reports':scopes[1]['reports'],'misalignment':scopes[1]['misalignment'],'search':scopes[1]['search'],'step':{'sampleYmax':float(max(ns['y'])),'sampleUmax':float(max(abs(ns['u']))),'initial':2.},'versions':{'numpy':np.__version__,'control':ctrl.__version__},'integral':integral}
(E/'reconciliation.json').write_text(json.dumps(result,indent=2),encoding='utf8');print(json.dumps(result,indent=2));print('PASS independent control/SymPy/SciPy, actual TS, all original cells')
