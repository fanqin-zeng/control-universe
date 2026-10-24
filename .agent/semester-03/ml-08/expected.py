import json
from pathlib import Path
from reference import reference
r=Path(__file__).resolve().parent
base=dict(m=2,s=.5,a=.5,t=.5,n=8,sign=1)
def result(**kw):return reference(dict(base,**kw))
def diff(**kw):return result(**kw)['diffusion']
expected=[
 [diff(),dict(decomposition=[.05,.2,.25],conditionalNoiseVariance=.5,extraDataVariance=.125,levels={str(a):diff(a=a) for a in [.1,.5,.9]})],
 [dict(field=result()['field'],runs={str(n):result(n=n)['flow'] for n in [1,4,8,16,64]}),dict(sameEndpoints=result(m=0,s=1,n=1)['flow'],wrongSign=result(sign=-1)['flow'],exercise=dict(dataVariance=.25,flowMidVariance=.3125,residualRisk=.8))]
]
(r/'expected-notebooks.json').write_text(json.dumps(expected,indent=2),encoding='utf-8')
