from pathlib import Path
import json,time,io,contextlib
import numpy as np
from scipy.optimize import nnls
from model import *
d=Path(__file__).parent;start=__import__('time').perf_counter();data=json.loads((d/'ts-cases.json').read_text(encoding='utf8'));mu=mc=mk=ms=0.;feasible=0
assert np.max(np.abs(np.array(data['Ad'])-Ad))<1e-13 and np.max(np.abs(np.array(data['Bd'])-Bd))<1e-13
def certify(p,v):
    g=p['jac'](v);slack=p['h']-p['G']@v;active=np.flatnonzero(slack<1e-6)
    multipliers,res=nnls(p['G'][active].T,-g) if len(active) else ([],np.linalg.norm(g))
    return max(0,float(-min(slack)),float(res),max([abs(a*slack[i]) for i,a in zip(active,multipliers)]+[0]))
for item in data['cases']:
 c=item['c'];x=np.array(item['x']);previous=np.array(item['previous']);r=item['result'];p=problem(x,previous,c);opt=original_plan(x,previous,c)
 assert r['feasible']==(opt is not None),(c,x,r,opt)
 if opt is None:continue
 feasible+=1;v=np.array(r['v']);error=np.max(abs(v-opt['v']));ce=abs(r['cost']-opt['cost']);kkt=certify(p,v);mu=max(mu,error);mc=max(mc,ce);mk=max(mk,kkt)
 assert error<1e-5 and ce<1e-6 and kkt<1e-6,(c,x,error,ce,kkt)
 assert np.max(abs(np.array(r['pred'])-opt['pred']))<1e-5
controls=0
for item in data['loops']:
 c=item['c'];r=item['result'];x=np.array([.5,350.]);previous=np.array([100.,300.]);states=[x.copy()]
 for k,u in enumerate(r['controls']):
  p=original_plan(np.array(r['states'][k]),previous,c);assert p is not None;error=np.max(abs(np.array(u)-p['u']));assert error<1e-5,(c,k,error);mu=max(mu,error)
  sol=solve_ivp(lambda t,z:derivative(z,np.array(u),c['feed'] if k>=20 else 1.),(0,.1),x,method='DOP853',rtol=1e-12,atol=1e-13);assert sol.success;x=sol.y[:,-1];states.append(x.copy());previous=np.array(u);controls+=1
 gap=np.max(abs(np.array(states)-np.array(r['states'])));ms=max(ms,gap);assert gap<1e-5,(c,gap)
 if r['stopped'] is not None:assert original_plan(np.array(r['states'][-1]),previous,c) is None
output=io.StringIO();cells=0
with contextlib.redirect_stdout(output):
 for nb in json.loads((d/'cells.json').read_text(encoding='utf8'))['notebooks']:
  scope={};exec(nb['setupCode'],scope)
  for cell in nb['cells']:exec(cell['code'],scope);cells+=1
(d/'raw-cells.log').write_text(output.getvalue(),encoding='utf8');assert cells==4 and data['rejected']==6
summary=dict(cases=len(data['cases']),feasible=feasible,infeasible=len(data['cases'])-feasible,closedLoops=len(data['loops']),closedLoopControls=controls,rejected=data['rejected'],maxActionError=mu,maxCostError=mc,maxKkt=mk,maxIntegratorStateError=ms,rawCells=cells,seconds=__import__('time').perf_counter()-start)
(d/'numeric.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2));print(output.getvalue())
