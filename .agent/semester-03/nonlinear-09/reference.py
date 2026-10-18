import json,sys
import numpy as np
from model import run

cases=json.load(open(sys.argv[1],encoding='utf-8'))
results=[]
for case in cases:
    c,b,shaped=case['params']
    actual=np.asarray(case['result']['rows'])
    independent=run(c,b,shaped)[::10]
    error=float(np.max(np.abs(actual-independent)))
    assert error<1e-7,(case['params'],error)
    assert case['result']['maxBalance']<1e-7
    results.append(dict(params=case['params'],maxAbsError=error,final=independent[-1].tolist(),balance=case['result']['maxBalance']))
print(json.dumps(dict(pass_=True,cases=results),ensure_ascii=False))
