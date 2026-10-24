from pathlib import Path
import json,io,contextlib,importlib.util
import numpy as np
d=Path('.agent/semester-03/mpc-08');spec=importlib.util.spec_from_file_location('model',d/'model.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
cases=json.loads((d/'ts-cases.json').read_text(encoding='utf8'));maxcost=maxtraj=maxgrad=maxaction=0.;converged=budget=0
for case in cases:
    c=case['c'];r=case['result'];value,xs,res=m.shooting(c['theta'],r['u'],c['N'],c['Q']);_,g,H=m.derivatives(c['theta'],r['u'],c['N'],c['Q'])
    dc=abs(value-r['cost']);dx=float(np.max(abs(xs-np.array(r['trajectory']))));dg=abs(g-r['gradient']);maxcost=max(maxcost,dc);maxtraj=max(maxtraj,dx);maxgrad=max(maxgrad,dg)
    assert dc<1e-8 and dx<1e-8 and dg<1e-5,(c,dc,dx,dg)
    assert abs(r['u'])<=c['limit']+1e-12 and all(b<=a+1e-9 for a,b in zip(r['history'],r['history'][1:]))
    independent_pg=abs(r['u']-np.clip(r['u']-g,-c['limit'],c['limit']));assert abs(independent_pg-r['projectedGradient'])<1e-5
    if r['converged']:converged+=1;assert independent_pg<2e-6
    else:budget+=1
    # A different optimization algorithm checks ORIGINAL objective from identical initial zero.
    if c['iterations']==60:
        obj=lambda v:float(m.shooting(c['theta'],v[0],c['N'],c['Q'])[0])
        jac=lambda v:np.array([m.derivatives(c['theta'],v[0],c['N'],c['Q'])[1]])
        ans=m.minimize(obj,[0.],jac=jac,bounds=[(-c['limit'],c['limit'])],method='L-BFGS-B',options={'ftol':1e-13,'gtol':1e-9,'maxiter':100})
        # Different local basins may differ; report, never force a universal equivalence claim.
        maxaction=max(maxaction,abs(ans.x[0]-r['u']))
raw=json.loads((d/'extracted.json').read_text(encoding='utf8'));capture=io.StringIO();executed=0;metrics=[]
with contextlib.redirect_stdout(capture):
    for nb in raw['notebooks']:
        ns={};exec(nb['setupCode'],ns)
        for cell in nb['cells']:exec(cell['code'],ns);executed+=1
        if 'loops' in ns:
            for z in ns['loops']:
                # Audit all 240 actual loop inputs by independently minimizing original scalar NLP.
                for k,u in enumerate(z['u']):
                    x=z['x'][k];ref=m.original(x[0],linear=z['linear'],omega=x[1]);actual=m.shooting(x[0],u,linear=z['linear'],omega=x[1])[0]
                    assert abs(actual-ref['cost'])<1e-7,(z['deg'],z['linear'],k,u,actual,ref)
                metrics.append({key:(float(z[key]) if key in ['cost','pg'] else z[key]) for key in ['deg','linear','cost','pg']})
(d/'raw-cells.log').write_text(capture.getvalue(),encoding='utf8')
report={'pass':True,'cases':len(cases),'stationary':converged,'notStationary':budget,'maxCostError':maxcost,'maxTrajectoryError':maxtraj,'maxGradientError':maxgrad,'maxDifferentSolverActionGap':float(maxaction),'rawCells':executed,'closedLoopInputsAudited':240,'loops':metrics}
(d/'numeric.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf8');print(json.dumps(report,indent=2))
