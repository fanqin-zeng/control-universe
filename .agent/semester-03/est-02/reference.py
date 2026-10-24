import contextlib,io,json
from fractions import Fraction as F
from pathlib import Path
from itertools import product
import numpy as np
folder=Path('.agent/semester-03/est-02');raw=[];scopes=[]
for nb in json.loads((folder/'extracted.json').read_text(encoding='utf8'))['notebooks']:
    scope={};capture=io.StringIO()
    with contextlib.redirect_stdout(capture):
        exec(nb['setupCode'],scope)
        for cell in nb['cells']:exec(cell['code'],scope)
    raw.append(capture.getvalue());scopes.append(scope)
max_difference=0;controls=[]
for row in json.loads((folder/'actual-ts.json').read_text(encoding='utf8')):
    r1,r2,p=(F(str(row[k])) for k in ['r1','r2','p'])
    # Precision coordinates give independent exact quadratic forms for the plotted increments.
    tau=1/r1+1/r2;weighted=(22/r1+24/r2)/tau
    posterior=(20/p+tau*weighted)/(tau+1/p)
    expected={'ordinary':F(23),'weighted':weighted,'weightedVariance':1/tau,'posterior':posterior,'posteriorVariance':1/(tau+1/p)}
    for name,value in expected.items():
        delta=abs(row['result'][name]-float(value));max_difference=max(max_difference,delta);assert delta<1e-12,(row,name,value)
    for point in row['points']:
        t=F(str(point['theta']))
        targets={'data':tau*(t-weighted)**2/2,'posterior':(tau+1/p)*(t-posterior)**2/2}
        for name,value in targets.items():
            delta=abs(point[name]-float(value));max_difference=max(max_difference,delta);assert delta<1e-12,(row['r1'],row['r2'],row['p'],point)
    controls.append({'r1':float(r1),'r2':float(r2),'p':float(p),**{k:float(v) for k,v in expected.items()}})
assert np.allclose(scopes[0]['fit'],[float(F(7,6)),float(F(1,2))],rtol=0,atol=1e-12)
assert abs(float(scopes[0]['residual']@scopes[0]['residual'])-float(F(1,6)))<1e-12
risk_rows=[]
for truth in [F(20),F(22),F(26)]:
    errors=[]
    for e1,e2 in product([F(-2),F(2)],[F(-1),F(1)]):
        y1,y2=truth+e1,truth+e2
        errors.append([(y1+y2)/2-truth,(y1+4*y2)/5-truth,(20+y1+4*y2)/6-truth])
    risks=[sum(e[j]**2 for e in errors)/4 for j in range(3)]
    risk_rows.append([truth,*risks])
    assert risks==[F(5,4),F(4,5),F(5,9)+(20-truth)**2/36]
assert np.allclose(scopes[1]['risk_rows'],[[float(v) for v in row] for row in risk_rows],rtol=0,atol=1e-12)
assert abs(scopes[1]['bayes_risk']-float(F(2,3)))<1e-12
assert scopes[1]['losses']==[80,100,16,10]
assert scopes[1]['sse']==8 and scopes[1]['sample_mean']==20
report={'pass':True,'maxDifference':max_difference,'rawNotebookOutput':raw,'exact':{'default':['23','118/5','23','4/5','2/3'],'vector':['7/6','1/2','1/6'],'riskRows':[[str(v) for v in row] for row in risk_rows],'bayesRisk':'2/3','varianceExercise':['20','8','8/3','4'],'outlierExercise':['22','20','80','100','16','10']}}
(folder/'reference-controls.json').write_text(json.dumps(controls,indent=2),encoding='utf8')
(folder/'reference.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report))
