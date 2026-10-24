from pathlib import Path
import json
import matplotlib
matplotlib.use('Agg')
import numpy as np
import sympy as sy
import control as ctrl
from scipy import signal,linalg
from fractions import Fraction as F
P=Path('.agent/semester-03/robust-02');source=json.loads((P/'extracted.json').read_text(encoding='utf8'));scopes=[]
for nb in source['notebooks']:
 ns={};exec(nb['setupCode'],ns)
 for cell in nb['cells']:exec(cell['code'],ns)
 scopes.append(ns)
# Independent SciPy TF evaluation of each one-pole response.
n=scopes[0]
responses=[]
for K,T in zip(n['K_samples'],n['T_samples']):
 _,h=signal.freqresp(([K],[T,1]),n['w']);responses.append(h)
responses=np.asarray(responses)
assert np.max(abs(responses-n['G_samples']))<1e-12
assert n['fit_cover'] and n['analytic_cover'] and min(n['a'],n['b'],n['c'])>0
assert n['conversion_residual']<1e-12
# The interval certificate follows from separate exact affine coefficient extrema.
assert max(abs(k-1) for k in [F(4,5),F(6,5)])==F(1,5)
assert max(abs(k-t) for k in [F(4,5),F(6,5)] for t in [F(4,5),F(13,10)])==F(1,2)
# Full matrix force-balance elimination independently reconstructs the uncertain MSD.
n=scopes[1];max_msd_error=0.
for dm in [-1,0,1]:
 for dk in [-1,0,1]:
  m=1+.3*dm;k=1+.3*dk
  A=np.array([[0.,1.],[-k/m,-.2/m]]);B=np.array([0.,1/m])
  for w in [.1,.5,1,3,100]:
   s=1j*w
   plant=np.linalg.solve(s*np.eye(2)-A,B)[0]
   M=np.array([[s*s+.2*s+1,.3,.3],[-dm*s*s,1,0],[-dk,0,1]],dtype=complex)
   eliminated=np.linalg.solve(M,[1.,0.,0.])[0]
   max_msd_error=max(max_msd_error,abs(plant-eliminated))
assert max_msd_error<1e-10 and n['max_lft_residual']<1e-10
assert n['valid_cover'] and not n['old_cover']
assert n['actual']>abs(n['eta'])
# Execute actual TS first; compare its closed forms and singular-value formula with a state-space model and SVD.
ts=json.loads((P/'actual-ts.json').read_text(encoding='utf8'));max_ts_error=0.
G=ctrl.ss(np.diag([-1.,-2.]),np.array([[1.,2.],[0.,1.]]),np.eye(2),np.zeros((2,2)))
for c in ts['cases']:
 K,T,g,w=c['K'],c['T'],c['gain'],c['w'];s=1j*w
 nominal=1/(s+1);actual=K/(T*s+1)
 H=np.asarray(ctrl.evalfr(G,s));C=np.diag([g,1.]);Lo=H@C;Li=C@H
 To=Lo@np.linalg.inv(np.eye(2)+Lo);Ti=Li@np.linalg.inv(np.eye(2)+Li)
 expected={'absolute':abs(actual-nominal),'relative':abs((actual-nominal)/nominal),'weight':abs((.5*s+.2)/(.8*s+1)),'svOutput':linalg.svdvals(To)[0],'svInput':linalg.svdvals(Ti)[0],'matrixDifference':linalg.norm(To-Ti,'fro')}
 for key,val in expected.items():max_ts_error=max(max_ts_error,abs(c[key]-val))
assert max_ts_error<1e-10
# Exact symbolic LFT and coprime conversion, retaining original exercise inputs.
s,d=sy.symbols('s d')
P11=-sy.Rational(1,2)/(s+1);P12=s/(s+1);P21=sy.Rational(1,2)/(s+1);P22=1/(s+1)
assert sy.cancel(P22+P21*d/(1-P11*d)*P12-(1+d/2)/(s+1+d/2))==0
N=1/(s+2);M=(s+1)/(s+2)
assert sy.cancel(M+N-1)==0
assert sy.cancel((N+N*d)/(M+M*d)-N/M)==0
assert sy.cancel((N+N*d)/M-(N/M)*(1+d))==0
si=10*sy.I;delta_a=sy.Rational(2,5)/(si+1)+sy.Rational(1,10)/(si**2+si/5+100)
delta_m=sy.cancel(delta_a/(2/(si+1)))
assert sy.simplify(delta_m-(sy.Rational(9,20)-sy.I/40))==0
assert abs(float(sy.Abs(delta_a))-.08969144025739323)<1e-14
low=[abs(v/F(9,10)-1) for v in map(F,['.95','1.05','.98','1.02','1.10'])]
assert low==[F(1,18),F(1,6),F(4,45),F(2,15),F(2,9)]
# This specific normalized graph pair, not a generic nu-gap implementation.
eps=sy.Rational(1,10);a=sy.sqrt(1+eps**2);w=sy.symbols('w',real=True)
N2=eps/(s+a);M2=(s-1)/(s+a)
assert sy.simplify((eps**2+w*w+1)/(a*a+w*w)-1)==0
cross=sy.cancel(M2.subs(s,-s));assert sy.simplify(cross-(s+1)/(s-a))==0
assert a>0 and sy.solve(s+1,s)==[-1]
chordal=eps/sy.sqrt(w*w+1+eps**2)
assert sy.simplify(sy.diff(chordal,w)+eps*w/(w*w+1+eps**2)**sy.Rational(3,2))==0
result={'pass':True,'notebooks':4,'cells':5,'actual_typescript_cases':len(ts['cases']),'max_ts_error':max_ts_error,'msd_force_balance_error':max_msd_error,'symbolic_exercise_and_coprime':True,'nu_gap_example_RHP_zeros':0,'nu_gap_example_RHP_poles':1,'default':ts['defaultValue'],'answer1':[float(sy.Abs(delta_a)),float(sy.Abs(delta_m))],'answer2_new_lower':[str(v) for v in low]}
(P/'reconciliation.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8')
print('PASS independent SciPy TF, force-balance elimination, actual TS versus state-space/SVD, exact SymPy/Fraction, normalized-graph zero/pole count')
