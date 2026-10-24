import json
from pathlib import Path
import numpy as np
from scipy.optimize import lsq_linear
p=Path('.agent/semester-03/mpc-01')
# minimal independent reference and raw-cell execution
nbs=json.loads((p/'extracted.json').read_text(encoding='utf8'))['notebooks']; outputs=[]
for nb in nbs:
    scope={};exec(nb['setupCode'],scope)
    for c in nb['cells']:exec(c['code'],scope)
    outputs.append(scope)
assert np.allclose(outputs[0]['stacked'],[3.5,2,5.5,2,7,1])
assert np.allclose(outputs[0]['U'],[-1,-.25])
assert abs(outputs[1]['P']-(2+np.sqrt(5)))<1e-12
print('PASS independent closed forms and raw cells')

# Independent SciPy bounded least-squares solves all actual TS cases.
from scipy.linalg import solve_discrete_are
cases=json.loads((p/'actual-ts.json').read_text(encoding='utf8'))
max_error=0.
for case in cases:
    x,r,b=case['x'],case['r'],case['limit']
    design=np.vstack([np.array([[1.,0.],[.5,1.]]),np.sqrt(r)*np.eye(2)])
    target=-np.array([.5*x,.25*x,0.,0.])
    solution=lsq_linear(design,target,bounds=(-b,b),method='bvls',tol=1e-13)
    assert solution.success
    actual=case['result']
    err=float(np.max(abs(solution.x-np.array(actual['u']))));max_error=max(max_error,err)
    assert err<1e-9
    predicted=np.array([.5*x,.25*x])+design[:2]@solution.x
    assert np.max(abs(predicted-actual['states']))<1e-9
    assert abs(np.sum((design@solution.x-target)**2)-actual['cost'])<1e-9
P_check=float(solve_discrete_are([[2.]],[[1.]],[[1.]],[[1.]])[0,0])
assert abs(P_check-outputs[1]['P'])<1e-12
result={'pass':True,'cases':len(cases),'maxTsError':max_error,'scipyDARE':P_check,'default':cases[[c['x']==4 and c['r']==1 and c['limit']==1 for c in cases].index(True)],'exercise1':[3.5,2,5.5,2,7,1],'tolerance':1e-9}
(p/'reconciliation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(result,ensure_ascii=False))

print('unconstrained_U', outputs[0]['free'].tolist())
print('active_gradient', (outputs[0]['H']@outputs[0]['U']+outputs[0]['f']).tolist())
print('full_cost', outputs[0]['x0']**2+outputs[0]['cost'](outputs[0]['U']))
assert np.allclose(outputs[0]['free'],[-18/17,-4/17])
assert np.allclose(outputs[0]['H']@outputs[0]['U']+outputs[0]['f'],[.25,0])
# Analytical LQR identity: same Q,R, no tuning or chosen weak comparator.
for a in [.5,1.,2.]:
    p_exact=(a*a+np.sqrt(a**4+4))/2
    k=a*p_exact/(1+p_exact)
    p_scipy=float(solve_discrete_are([[a]],[[1.]],[[1.]],[[1.]])[0,0])
    assert abs(p_exact-p_scipy)<1e-12
    for n in [1,2,8]:
        sn=p_exact
        for _ in range(n):
            kn=a*sn/(1+sn);sn=1+a*a*sn/(1+sn)
        assert abs(kn-k)<1e-12
    print('analytic_LQR_check',a,p_exact,k,a-k)

assert np.allclose(outputs[0]['F']@np.array([2.,1.]),[3,1,4,1,5,1])
assert np.allclose(outputs[0]['Phi']@np.array([1.,0.,-1.]),[.5,1,1.5,1,2,0])
assert abs(float((outputs[0]['v']+outputs[0]['M']@outputs[0]['U'])[0])+.5-1.5)<1e-12
