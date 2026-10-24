import matplotlib
matplotlib.use("Agg")
import json,io,contextlib
from pathlib import Path
import numpy as np
import sympy as sy
from scipy.optimize import minimize_scalar
from scipy.signal import residue,find_peaks
P=Path('.agent/semester-03/robust-01')
source=json.loads((P/'extracted.json').read_text(encoding='utf8'))
scopes=[]
for nb in source['notebooks']:
    ns={}
    exec(nb['setupCode'],ns)
    for c in nb['cells']:exec(c['code'],ns)
    scopes.append(ns)
# Independent residue expansion of full closed-loop step, versus control's state exponential.
for J,pm,os,wc in scopes[0]['load_results']:
    den=[J,.6,50,10];num=[.5,50,10]
    rr,pp,kk=residue(num,np.polymul([1,0],den))
    tt=np.linspace(0,2,20001)
    yy=np.sum(rr[:,None]*np.exp(pp[:,None]*tt),axis=0).real
    assert abs(100*(max(yy)-1)-os)<1e-8
    xs=np.roots([J*J,.1*.1-.5*.5,-(50*50-2*.5*10),-100])
    wref=np.sqrt(next(x.real for x in xs if abs(x.imag)<1e-9 and x.real>0))
    Lj=np.polyval(num,1j*wref)/np.polyval([J,.1,0,0],1j*wref)
    pmref=180+np.angle(Lj,deg=True)
    assert abs(pmref-pm)<1e-8 and abs(wref-wc)<1e-8
# Continuous extrema independently optimized in log-frequency, with both limits.
def independent_peak(num,den):
    def value(logw):
        s=1j*np.exp(logw)
        return abs(np.polyval(num,s)/np.polyval(den,s))
    logs=np.linspace(-18,20,10000)
    vv=np.array([value(x) for x in logs])
    peaks,_=find_peaks(vv)
    candidates=[vv[0],vv[-1],abs(num[0]/den[0]) if len(num)==len(den) else 0]
    for k in peaks:
        r=minimize_scalar(lambda x:-value(x),bounds=(logs[k-1],logs[k+1]),method='bounded',options={'xatol':1e-13})
        candidates.append(-r.fun)
    return max(candidates)
D=[.01,.6,50,10];N=[.5,50,10]
for ns in scopes:
    for num,den in [([.01,.1,0,0],D),(N,D),([5],[1,1,5])]:
        assert abs(ns['peak'](num,den)[0]-independent_peak(num,den))<1e-8
for wn,z,rightmost,gamma,mt,mult,weighted in scopes[1]['resonance_results']:
    # Form characteristic polynomial directly, retaining all fifth-order modes.
    d=np.polyadd(np.polymul([.01,.1,0,0],[1,2*z*wn,wn*wn]),np.array(N)*wn*wn)
    assert abs(max(np.roots(d).real)-rightmost)<1e-8
    dn=[-1,-2*z*wn,0];dd=[1,2*z*wn,wn*wn]
    assert abs(independent_peak(dn,dd)-gamma)<1e-8
    assert abs(independent_peak(np.polymul(N,dn),np.polymul(D,dd))-weighted)<1e-8
# Actual TypeScript frequency computation versus complex rational transfer functions.
ts=json.loads((P/'component-values.json').read_text(encoding='utf8'))
for row in ts:
    wn,z=row['wn'],row['zeta']
    def direct(w):
        s=1j*w;T=(.5*s*s+50*s+10)/(.01*s**3+.6*s*s+50*s+10)
        delta=wn*wn/(s*s+2*z*wn*s+wn*wn)-1
        return abs(T),abs(delta),abs(T*delta)
    for point in row['points']:
        expected=direct(point['w'])
        for key,val in zip(['t','delta','product'],expected):assert abs(point[key]-val)<1e-9
    ww=10**(-2+6*np.arange(1601)/1600)
    expected=np.array([direct(w) for w in ww]).max(axis=0)
    for key,val in zip(['tMax','deltaMax','productMax'],expected):assert abs(row[key]-val)<1e-9
# Exact symbolic exercise checks independent of peak()/component.
x=sy.symbols('x',positive=True);f=(x*x+4*x)/(x*x-16*x+100)
xstar=5+3*sy.sqrt(5)
assert sy.simplify(sy.diff(f,x).subs(x,xstar))==0
assert sy.simplify(f.subs(x,xstar)-(11+5*sy.sqrt(5))/6)==0
u=(1+sy.sqrt(3))/2
assert sy.simplify((u*u+u)/(u*u-u+1)-(1+2/sy.sqrt(3)))==0
assert abs(scopes[3]['ms1']-float(sy.sqrt((11+5*sy.sqrt(5))/6)))<1e-12
assert abs(scopes[3]['ms3']-float(sy.sqrt(1+2/sy.sqrt(3))))<1e-12
result={'pass':True,'original_notebooks':4,'original_cells':4,'load_residue_and_cubic':4,'resonance_root_and_peak_checks':3,'actual_typescript_configurations':len(ts),'independent_symbolic_exercises':True,'default_grid':ts[4],'continuous_Ms':scopes[2]['ms'],'continuous_Mt':scopes[2]['mt'],'continuous_default_product':scopes[1]['resonance_results'][1][-1],'reciprocal_gamma':1/scopes[1]['resonance_results'][1][3]}
(P/'reconciliation.json').write_text(json.dumps(result,indent=2),encoding='utf8')
print('PASS independent residues / crossover polynomial / complex frequency / scalar optimization / exact SymPy')
