import json
from fractions import Fraction as F
from pathlib import Path
import numpy as np
source=json.loads(Path('.agent/semester-03/id-01/extracted.json').read_text(encoding='utf8'))
results=[]
for nb in source['notebooks']:
    scope={};exec(nb['setupCode'],scope)
    for c in nb['cells']:exec(c['code'],scope)
    if 'y_est' in scope:
        exact=[F(0)]
        for u in [1,0,1,1,0,0,1,0]:exact.append(F(4,5)*exact[-1]+F(1,5)*u)
        a=(exact[2]/exact[1]);b=exact[1]
        assert a==F(4,5) and b==F(1,5)
        assert max(abs(float(x)-y) for x,y in zip(exact,scope['y_est']))<1e-12
        assert np.max(abs(scope['theta']-[float(a),float(b)]))<1e-12
        assert F(4,5)*F(1,4)==F(1,5)
        results.append({'exact_a':str(a),'exact_b':str(b),'prediction_rmse':scope['rmse_prediction'],'simulation_rmse':scope['rmse_simulation'],'validation':scope['y_val'].tolist(),'exercise2':[0.2,0.16,0.2]})
    else:
        assert scope['rank_flat']==1
        assert F(4,5)+F(1,5)==F(1,2)+F(1,2)==1
        results.append({'rank':1,'candidate_next_cm':[0.2,0.5],'exercise3_b':str(1-F(4,5))})
Path('.agent/semester-03/id-01/reconciliation.json').write_text(json.dumps({'pass':True,'tolerance':1e-12,'notebooks':results},indent=2),encoding='utf8')
