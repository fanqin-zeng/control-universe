from pathlib import Path
import json,sys
import numpy as np
from scipy.signal import lfilter
sys.path.insert(0,str(Path(__file__).parent));from model import *
f=Path('.agent/semester-03/id-09');actual=json.loads((f/'actual-ts.json').read_text());count=0;worst=0.
def compare(a,b):
    global count,worst
    if isinstance(a,dict):
        assert set(a)==set(b),(set(a),set(b))
        for k in a:compare(a[k],b[k])
    elif isinstance(a,list):
        assert len(a)==len(b)
        for x,y in zip(a,b):compare(x,y)
    elif isinstance(a,bool) or isinstance(a,str) or a is None:assert a==b,(a,b)
    else:
        assert b is not None,(a,b)
        err=abs(a-b);worst=max(worst,err);count+=1;assert err<1e-8,(a,b,err)
for item in actual['cases']:
    r=experiment(item['config']);compare(item['result'],r)
    for part in ['train','validation','test']:
        d=r[part];a,b=(.5,.1) if part=='test' and item['config']['changed'] else (.8,.3)
        if part=='train':compare(d['x'][1:],lfilter([b],[1,-a],d['u'][:-1]).tolist());compare((np.array(d['y'])-d['x'])[1:].tolist(),lfilter([1],[1,-item['config']['rho']],d['w'][:-1]).tolist())
for item in actual['repeated']:compare(item['result'],experiment({'amplitude':.1 if item['label']=='weak' else .5,'sigma':0 if item['label']=='noiseless' else .2,'seed':item['seed']}))
summaries={}
for label in ['noiseless','nominal','weak']:
    rows=[i['result'] for i in actual['repeated'] if i['label']==label];summary={}
    for name in ['OLS','IV']:
        scores=[r['models'][name]['test']['rmse'] for r in rows if r['models'][name]['valid']]
        summary[name]={'invalid':32-len(scores),'test_q10_median_q90':np.quantile(scores,[.1,.5,.9]).tolist() if scores else None}
    summary['IV_selected']=sum(r['selected']=='IV' for r in rows);summary['admitted']=sum(r['admitted'] for r in rows);summaries[label]=summary
(f/'summaries.json').write_text(json.dumps(summaries,indent=2));(f/'numeric.json').write_text(json.dumps(dict(passed=True,comparisons=count,worst=worst,configurations=len(actual['cases']),repeated=len(actual['repeated']),independent='NumPy lstsq, FFT; SciPy lfilter state/noise recurrence',summaries=summaries),indent=2));print(json.dumps(dict(comparisons=count,worst=worst,summaries=summaries)))
