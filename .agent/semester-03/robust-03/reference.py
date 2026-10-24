from pathlib import Path
import json
import matplotlib
matplotlib.use('Agg')
import numpy as np
import control as ctrl
import sympy as sy
from scipy import linalg,optimize,stats
from decimal import Decimal,localcontext,ROUND_CEILING
E=Path('.agent/semester-03/robust-03');payload=json.loads((E/'extracted.json').read_text(encoding='utf8'));scopes=[]
for nb in payload['notebooks']:
 ns={};exec(nb['setupCode'],ns)
 for c in nb['cells']:exec(c['code'],ns)
 scopes.append(ns)
# Independent exact arithmetic for both original interval descriptions and the original exercises.
from fractions import Fraction as F
expected_primary=[[1,4,F(11,4),1],[1,2,F(1,2),5],[1,2,F(9,2),5],[1,4,F(27,4),1]]
expected_reverse=[[5,7,F(9,7),1],[5,3,F(1,3),1],[1,3,F(11,3),1],[1,7,F(27,7),1]]
for actual,expected in [(scopes[0]['primary_corners'],expected_primary),(scopes[0]['reversed_corners'],expected_reverse)]:
 for c,fc in zip(actual,expected):
  c0,c1,c2,c3=map(lambda v:F(str(v)),c)
  got=[c3,c2,(c2*c1-c3*c0)/c2,c0];assert got==list(map(F,fc))
  assert linalg.eigvals(linalg.companion(np.asarray(c[::-1]))).real.max()<0
# Independent physical state model: q, velocity, integral of negative position.
n=scopes[2];m=n['m_samples'];b=n['b_samples'];k=n['k_samples'];A=np.zeros((len(m),3,3));A[:,0,1]=1;A[:,1,0]=-(k+2)/m;A[:,1,1]=-(b+1)/m;A[:,1,2]=.5/m;A[:,2,0]=-1
alpha=np.linalg.eigvals(A).real.max(axis=1);mc_error=float(np.max(np.abs(alpha-n['max_real_parts'])));assert mc_error<1e-10
assert (F('1.15')*F('2.7')-F('1.3')*F('.5'))==F('2.455')
assert F('1.1')*F('2.5')-F(2)*F('.5')==F('1.75')
# Independent state/pole and matrix-eigenvalue evaluation of the actual TS implementation.
ts=json.loads((E/'actual-ts.json').read_text());maxerr=0.;poleerr=0.
cp_cache={}
for N in [100,1379,5000,10000]:cp_cache[N]=optimize.brentq(lambda p:stats.binom.logcdf(0,N,p)-np.log(.001),1e-15,.99,xtol=1e-15)
for row in ts['cases']:
 K,b,N=row['K'],row['b'],row['N'];loop=ctrl.tf([K],[1,3,2,0]);actual_poles=ctrl.poles(ctrl.feedback(loop,1));P=np.array([[np.sqrt(.75)+b*b/2,b/2],[b/2,1.]])
 Qs=[np.asarray([[0.,1.],[-kv,-b]]).T@P+P@np.asarray([[0.,1.],[-kv,-b]]) for kv in [.5,1.5]]
 expected={'alpha':max(actual_poles.real),'gm':6/K,'gmDB':20*np.log10(6/K),'pMin':linalg.eigvalsh(P)[0],'qMax':max(linalg.eigvalsh(Q)[-1] for Q in Qs),'critical':np.sqrt(2-np.sqrt(3)),'zeroUpper':cp_cache[N]}
 for key,v in expected.items():maxerr=max(maxerr,abs(v-row[key]))
 # Match each actual pole to the closest TS complex pole, including the imaginary-axis boundary.
 tps=[complex(*v) for v in row['poles']]
 poleerr=max(poleerr,max(min(abs(v-tv) for tv in tps) for v in actual_poles))
 assert row['quadratic']==('strict' if b>expected['critical']+1e-10 else 'none' if b<expected['critical']-1e-10 else 'boundary')
assert maxerr<1e-10 and poleerr<1e-10
# General symbolic Q and exact exercise-3 certificate.
a,r,k,b=sy.symbols('a r k b',real=True);P=sy.Matrix([[a,r],[r,1]]);A=sy.Matrix([[0,1],[-k,-b]]);Q=A.T*P+P*A
assert Q==sy.Matrix([[-2*k*r,a-b*r-k],[a-b*r-k,2*r-2*b]])
crit=sy.sqrt(sy.Rational(3,2))-sy.sqrt(sy.Rational(1,2));assert sy.simplify(crit**2-(2-sy.sqrt(3)))==0
pc=P.subs({a:sy.sqrt(sy.Rational(3,4))+b*b/2,r:b/2});assert sy.simplify(pc.det()-(sy.sqrt(sy.Rational(3,4))+b*b/4))==0
for kv in [sy.Rational(1,2),sy.Rational(3,2)]:
 qc=Q.subs({a:sy.sqrt(sy.Rational(3,4))+b*b/2,r:b/2,k:kv});assert sy.simplify(qc.det()-kv*(b*b-crit**2))==0
P3=sy.Matrix([[sy.Rational(3,2),sy.Rational(1,4)],[sy.Rational(1,4),1]]);assert P3.det()==sy.Rational(23,16)
for theta,det in [(-1,sy.Rational(7,64)),(1,sy.Rational(15,64))]:
 A3=sy.Matrix([[0,1],[-2-theta,-1-sy.Rational(1,2)*theta]]);Q3=A3.T*P3+P3*A3;assert Q3.det()==det and Q3[0,0]<0
q=sy.symbols('q',positive=True);assert sy.simplify(q*q-q*q/2-q*q/2)==0
# Exact zero-failure sample sizes using high-precision logarithms; general f=3 via direct binomial CDF inversion.
counts=[]
with localcontext() as ctx:
 ctx.prec=60
 for eps,beta,N in scopes[3]['sample_table']:
  ratio=Decimal(str(beta)).ln()/(1-Decimal(str(eps))).ln();assert int(ratio.to_integral_value(rounding=ROUND_CEILING))==N;counts.append(N)
cp3=optimize.brentq(lambda p:stats.binom.logcdf(3,10000,p)-np.log(.001),1e-8,.01,xtol=1e-15)
assert abs(cp3-scopes[3]['cp_records'][-1][2])<1e-12
# Independent continuous scalar optimization of stable sensitivity, not the notebook's stationarity polynomial.
Ms=[]
for K in [2.,4.]:
 def value(logw):
  s=1j*np.exp(logw);return abs(1/(1+K/(s*(s+1)*(s+2))))
 result=optimize.minimize_scalar(lambda x:-value(x),bounds=(-3,3),method='bounded',options={'xatol':1e-13});Ms.append(-result.fun)
 assert abs(-result.fun-([2.312314014627774,5.875158453504607][len(Ms)-1]))<1e-8
# Exact checks for retained hand calculations and boundary statements.
theta=sy.symbols('theta',nonnegative=True);z=sy.symbols('s')
assert sy.expand((3+theta)*(5+2*theta)-(1+theta))==2*theta**2+10*theta+14
assert sy.factor(z**3+3*z*z+2*z)==z*(z+1)*(z+2)
assert sy.expand((z+3)*(z*z+2))==z**3+3*z*z+2*z+6
assert sy.simplify(10/(z*(z+1)*(z+2))).subs(z,sy.I*sy.sqrt(2)).simplify()==-sy.Rational(5,3)
assert sy.simplify(b*b/4-r*(b-r)-(r-b/2)**2)==0
expected_ex1=[[2,8,F(7,4),1],[2,4,F(1,2),3],[1,4,F(21,4),3],[1,8,F(47,8),1]]
assert np.allclose(scopes[3]['answer1_columns'],np.asarray(expected_ex1,dtype=float),rtol=0,atol=1e-12)
for qv in [1.,2.,3.]:assert linalg.eigvals(linalg.companion([1.,qv,qv,qv*qv/2])).real.max()<0
assert abs((2/.005*(np.log(1000)+1))-3163.1021115928547)<1e-9
result={'pass':True,'notebooks':4,'cells':5,'actual_typescript_cases':len(ts['cases']),'max_ts_scalar_error':maxerr,'max_ts_pole_error':poleerr,'physical_state_mc_max_error':mc_error,'exact_symbolic_certificates':True,'cp3_independent_binomial_cdf':cp3,'exact_sample_counts':counts,'continuous_Ms':Ms,'default':ts['default']}
(E/'reconciliation.json').write_text(json.dumps(result,indent=2)+'\n');print('PASS independent physical state poles, control.feedback, matrix eigensystems, exact SymPy/Fraction, Decimal ceilings and binomial-CDF inversion')
