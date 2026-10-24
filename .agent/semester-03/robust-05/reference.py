from pathlib import Path
import json,numpy as np,control as ctrl,sympy as sy
from scipy.optimize import minimize_scalar
from scipy.linalg import eigvalsh
from scipy import signal
import matplotlib
matplotlib.use('Agg')
E=Path('.agent/semester-03/robust-05');raw=json.loads((E/'extracted.json').read_text(encoding='utf8'));scopes=[]
for nb in raw['notebooks']:
 ns={};exec(nb['setupCode'],ns)
 for c in nb['cells']:exec(c['code'],ns)
 scopes.append(ns)
actual=json.loads((E/'actual-ts.json').read_text());err=0.;coefferr=0.;cases=0
for row in actual['cases']:
 p=row['p'];K,f,zn,zd,a=[p[k] for k in ['gain','frequency','numeratorDamping','denominatorDamping','lowpass']]
 G=ctrl.tf([100],[1,1,100]);C=K*ctrl.tf([1,2*zn*f,f*f],[1,2*zd*f,f*f]);C=C*ctrl.tf([a],[1,a]) if a else C;L=G*C;S=ctrl.feedback(1,L);T=ctrl.feedback(L,1)
 roots=ctrl.poles(T);stable=max(roots.real)<-1e-9;rr=row['readings'];assert rr['stable']==stable,(p,roots,rr)
 assert not rr['unstable'] if stable else rr['unstable'] or rr['degenerate']
 coefferr=max(coefferr,max(abs(np.asarray(rr['closed'])-T.den[0][0])))
 expected={'scanPeak':float(max(abs(S(1j*scopes[0]['w'])))),'DC':float(ctrl.dcgain(S)),'notchRatio':zn/zd,'T10':float(abs(T(10j))),'S10':float(abs(S(10j)))}
 for k,v in expected.items():err=max(err,abs(v-rr[k]))
 for point in row['responses']:
  ww=point['w']
  for k,H in [('L',L),('S',S),('T',T)]:err=max(err,abs(point[k]-abs(H(1j*ww))))
 cases+=1
assert err<1e-8 and coefferr<1e-8
# Independent scalar optimization in log-frequency, avoiding the notebook stationary-polynomial solver.
peakerr=0.;continuous={}
for name,C in scopes[1]['cases'].items():
 S=ctrl.feedback(1,scopes[1]['plant']()*C);ww=np.logspace(-4,4,50001);vv=abs(S(1j*ww));j=int(np.argmax(vv));lo=np.log(ww[max(0,j-2)]);hi=np.log(ww[min(len(ww)-1,j+2)])
 fit=minimize_scalar(lambda x:-abs(S(1j*np.exp(x))),bounds=(lo,hi),method='bounded',options={'xatol':1e-13});continuous[name]=float(-fit.fun);peakerr=max(peakerr,abs(-fit.fun-scopes[1]['reports'][name]['frequency_max']))
assert peakerr<1e-6
for wn,row in scopes[2]['misalignment']:
 S=ctrl.feedback(1,scopes[2]['plant'](wn)*scopes[2]['controller']());ww=np.logspace(-2,3,30001);v=abs(S(1j*ww));j=int(np.argmax(v));fit=minimize_scalar(lambda x:-abs(S(1j*np.exp(x))),bounds=(np.log(ww[j-2]),np.log(ww[j+2])),method='bounded',options={'xatol':1e-13});assert abs(-fit.fun-row['frequency_max'])<1e-6
s=sy.symbols('s');G=100/(s*s+s+100);C=20*(s*s+s+100)/(s*s+10*s+100)*sy.Rational(1,10)/(s+sy.Rational(1,10));T=sy.cancel(G*C/(1+G*C));assert sy.cancel(T-200/(s**3+sy.Rational(101,10)*s*s+101*s+210))==0
assert sy.cancel((100*s+1)/(s+sy.Rational(1,100))-100)==0
X=sy.Matrix([[-4,1,1],[1,-1,0],[1,0,-1]]);assert set(X.eigenvals())=={-1,(-5-sy.sqrt(17))/2,(-5+sy.sqrt(17))/2}
assert sy.Rational(101,10)*101-210==sy.Rational(8101,10)
# Original unstable controller exact quartic, no reduced hidden instability.
original=sy.expand((s*s+s+100)*(s*s+sy.Rational(2,5)*s+100)+2000*(s*s+10*s+100));assert sy.Poly(original,s).all_coeffs()==[1,sy.Rational(7,5),sy.Rational(11002,5),20140,210000]
# PD properness and exact preserved problem.
assert sy.cancel((1/(s*(s+2)))*(5+sy.Rational(5,2)*s)-sy.Rational(5,2)/s)==0
n=scopes[1];C=n['cases']['candidate'];G=n['plant']();T=ctrl.feedback(G*C,1);U=ctrl.feedback(C,G);step_error=0.
for H,key in [(T,'y'),(U,'u')]:
 _,result_y,_=signal.lsim((H.num[0][0],H.den[0][0]),U=np.ones(len(n['t'])),T=n['t']);step_error=max(step_error,float(max(abs(result_y-n[key]))))
assert step_error<1e-9
result={'pass':True,'actualTSCases':cases,'frequencyPoints':cases*6,'maxNumericalError':err,'maxCharacteristicCoefficientError':coefferr,'independentContinuousPeakError':peakerr,'independentStepResponseError':step_error,'default':actual['default'],'continuousPeaks':continuous,'exactNominalCancellationStable':True,'exactOriginalQuartic':str(original),'boundedRealLargestEigenvalue':float(eigvalsh(np.array(X).astype(float))[-1])}
(E/'reconciliation.json').write_text(json.dumps(result,indent=2),encoding='utf8');print(json.dumps(result,indent=2))
