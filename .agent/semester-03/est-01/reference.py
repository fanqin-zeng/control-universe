import contextlib,io,json
from fractions import Fraction as F
from pathlib import Path
from itertools import product
import numpy as np
folder=Path('.agent/semester-03/est-01')
source=json.loads((folder/'extracted.json').read_text(encoding='utf8'))
scopes=[]; raw=[]
for nb in source['notebooks']:
    scope={}; capture=io.StringIO()
    with contextlib.redirect_stdout(capture):
        exec(nb['setupCode'],scope)
        for cell in nb['cells']: exec(cell['code'],scope)
    scopes.append(scope);raw.append(capture.getvalue())
def exact_risk(p,r,k,b=F(0)):
    # Enumerate centered independent errors rather than copy the TS polynomial.
    # Current selectable variances are perfect squares, so all arithmetic is rational.
    pe=F(int(float(p)**0.5));ve=F(int(float(r)**0.5))
    assert pe*pe==p and ve*ve==r
    errors=[(1-k)*s*pe-k*(b+t*ve) for s,t in product([-1,1],repeat=2)]
    return sum(e*e for e in errors)/4
max_diff=0
for row in json.loads((folder/'actual-ts.json').read_text(encoding='utf8')):
    p,r,k=F(str(row['p'])),F(str(row['r'])),F(str(row['k']))
    actual=row['result']; optimum=p/(p+r)
    expected={'priorMean':F(20),'measurement':F(23),'innovation':F(3),'estimate':20+3*k,
              'risk':exact_risk(p,r,k),'optimalGain':optimum,'optimalRisk':exact_risk(p,r,optimum)}
    for key,value in expected.items():
        delta=abs(float(value)-actual[key]);max_diff=max(max_diff,delta);assert delta<1e-12,(row,key,value)
main=scopes[0]; edge=scopes[1]
assert F(4,5)*25==20
assert F(4,5)**2*4+F(36,25)==4
assert np.allclose([main['gain'],main['estimate'],main['risk']],[float(F(4,5)),float(F(112,5)),float(F(4,5))],rtol=0,atol=1e-12)
assert exact_risk(F(4),F(1),F(4,5),F(3))==F(164,25)
assert np.allclose(edge['answer2'],[float(F(1,5)),float(F(103,5)),float(F(4,5))],rtol=0,atol=1e-12)
assert np.allclose(edge['answer3'],[5,2,float(F(1,2)),6,1],rtol=0,atol=1e-12)
report={'pass':True,'maxDifference':max_diff,'rawNotebookOutput':raw,'exact':{'prediction':['20','4'],'default':['4/5','112/5','4/5'],'biasMean':'-12/5','biasedRisk':'164/25','exercise2':['1/5','103/5','4/5'],'exercise3':['5','2','1/2','6','1']}}
(folder/'reference.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(report,ensure_ascii=False))
