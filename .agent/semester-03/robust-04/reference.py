from pathlib import Path
import json,numpy as np,control as ctrl,sympy as sy
from scipy.linalg import svdvals
from scipy.optimize import minimize_scalar
E=Path('.agent/semester-03/robust-04');payload=json.loads((E/'extracted.json').read_text(encoding='utf8'));scopes=[]
import matplotlib
matplotlib.use('Agg')
for nb in payload['notebooks']:
 ns={};exec(nb['setupCode'],ns)
 for cell in nb['cells']:exec(cell['code'],ns)
 scopes.append(ns)
ts=json.loads((E/'actual-ts.json').read_text());err=0.
for a in ts['cases']:
 k,d,wb=a['k'],a['d'],a['wb'];plant=ctrl.tf([1+.5*d],[1,1]);actual=float(ctrl.dcgain(ctrl.feedback(1,plant*k)))
 s=ctrl.tf('s');W=(s/2+wb)/(s+.01*wb);z,p=ctrl.zeros(W),ctrl.poles(W)
 expect={'nominal':float(ctrl.dcgain(ctrl.feedback(1,ctrl.tf([k],[1,1])))),'actual':actual,'worst':1/(1+.5*k),'pole':float(ctrl.poles(ctrl.feedback(plant*k,1))[0].real),'rs':.5*k/(1+k),'weightDC':float(ctrl.dcgain(W)),'weightInf':.5,'weightAtWb':abs(ctrl.evalfr(W,1j*wb)),'weightPole':float(-p[0].real),'weightZero':float(-z[0].real)}
 unity=np.sqrt((wb*wb-(wb*.01)**2)/.75);expect['unity']=unity
 for key,v in expect.items():err=max(err,abs(a[key]-v))
 assert a['nominalDC']==(k>9) and a['robustDC']==(k>18)
for a in ts['envelope']:
 s=ctrl.tf('s');W=(s/2+a['wb'])/(s+.01*a['wb']);err=max(err,abs(a['value']-1/abs(ctrl.evalfr(W,1j*a['w']))))
assert err<1e-10
# Independent transfer-function evaluation of every sample, using polynomial evaluation of control.feedback.
n=scopes[1];max_response_error=0.;max_pole_error=0.
for dm,dk,peak,alpha in zip(n['dm_samples'],n['dk_samples'],n['sample_peaks'],n['sample_alpha']):
 m,k=1+.3*dm,1+.3*dk;G=ctrl.tf([1],[m,.2,k]);S=ctrl.feedback(1,G*n['K_tf']);Wtf=ctrl.tf([1/1.5,.8],[1,.016]);weighted=ctrl.minreal(Wtf*S,verbose=False)
 y=np.abs(np.polyval(weighted.num[0][0],1j*n['w'])/np.polyval(weighted.den[0][0],1j*n['w']));max_response_error=max(max_response_error,abs(float(max(y))-peak));max_pole_error=max(max_pole_error,abs(max(ctrl.poles(ctrl.feedback(G*n['K_tf'],1))).real-alpha))
assert max_response_error<1e-9 and max_pole_error<1e-9
# Recompute chosen feasible-D singular value by Hermitian eigenvalues rather than notebook SVD.
mu=scopes[0];derr=0.
for M,x,upper in zip(mu['matrices'],mu['d_logs'],mu['upper']):
 D=np.diag(np.exp(np.r_[x,0.]));A=D@M@np.linalg.inv(D);derr=max(derr,abs(np.sqrt(np.linalg.eigvalsh(A.conj().T@A)[-1])-upper))
assert derr<1e-10
# Symbolic exact LFT closure with finite mass/stiffness variation, not derivative approximation.
s,K,W,dm,dk=sy.symbols('s K W dm dk');h=1/(s*s+s/5+1+K);M=sy.Matrix([[-sy.Rational(3,10)*s*s*h,-sy.Rational(3,10)*s*s*h,s*s*h*K],[-sy.Rational(3,10)*h,-sy.Rational(3,10)*h,h*K],[sy.Rational(3,10)*W*h,sy.Rational(3,10)*W*h,W*(1-h*K)]]);Delta=sy.diag(dm,dk)
closed=M[2,2]+(M[2,:2]*Delta*(sy.eye(2)-M[:2,:2]*Delta).inv()*M[:2,2])[0]
D=(1+sy.Rational(3,10)*dm)*s*s+s/5+1+sy.Rational(3,10)*dk
assert sy.cancel(closed-W*D/(D+K))==0
x=sy.symbols('x',nonnegative=True);assert sy.expand((1+x)*(121+x)-121*(1+x/4))==x*x+sy.Rational(367,4)*x
r=sy.sqrt(sy.Rational(4,3));mat=sy.Matrix([[sy.Rational(1,2),sy.Rational(3,10)*r],[sy.Rational(2,5)/r,sy.Rational(3,5)]])
assert set(mat.eigenvals())=={sy.Rational(9,10),sy.Rational(1,5)}
assert (sy.eye(2)-sy.Matrix([[sy.Rational(1,2),sy.Rational(3,10)],[sy.Rational(2,5),sy.Rational(3,5)]])*sy.Rational(10,9)).det()==0
# Continuous nominal peak for context only; published notebook/table deliberately report the fixed grid peak.
opt=minimize_scalar(lambda v:-abs(n['weight'](1j*np.exp(v))*n['responses']([np.exp(v)])[0][0]),bounds=(.5,1.4),method='bounded',options={'xatol':1e-13})
result={'pass':True,'actualTSConfigurations':len(ts['cases']),'weightPoints':len(ts['envelope']),'maxTSError':err,'all500TransferResponseError':max_response_error,'all500PoleError':max_pole_error,'feasibleDCheckError':derr,'exactLFTSymbolic':True,'default':ts['default'],'nominalContinuousPeak':-opt.fun,'nominalContinuousFrequency':float(np.exp(opt.x))}
(E/'reconciliation.json').write_text(json.dumps(result,indent=2),encoding='utf8');print(json.dumps(result,indent=2))
