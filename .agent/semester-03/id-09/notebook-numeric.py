from pathlib import Path
import json,runpy,contextlib,io,sys
import numpy as np
f=Path('.agent/semester-03/id-09');sys.path.insert(0,str(f));from model import *
ns=runpy.run_path(str(f/'notebook-code.py'));raw=json.loads((f/'extracted.json').read_text(encoding='utf8'));norm=lambda s:s.replace('\r\n','\n');outputs=[]
for i,nb in enumerate(raw['notebooks']):
    assert norm(nb['setupCode'])==norm(ns['SETUP']);assert norm(nb['cells'][0]['code'])==norm(ns['CELLS'][i])
    scope={};exec(nb['setupCode'],scope);out=io.StringIO()
    with contextlib.redirect_stdout(out):exec(nb['cells'][0]['code'],scope)
    outputs.append(out.getvalue());assert f'id09_cell_{i+1}_passed' in outputs[-1]
expected=[json.loads(o.splitlines()[0]) for o in outputs]
assert expected[0]['selected']=='IV' and expected[0]['admitted'];assert expected[1]['zero']['selected'] is None and not expected[1]['zero']['admitted'];assert expected[1]['drift']['selected']=='IV' and not expected[1]['drift']['admitted'];assert expected[1]['frequencies']==[.03125,.125,.3125]
assert abs(expected[1]['epsilon_variance']-.0425)<1e-14;assert abs(expected[1]['epsilon_lag1']+.0065)<1e-14
summaries=json.loads((f/'summaries.json').read_text());
for r in expected[2]:
    ref=summaries[r['label']]
    for name in ['OLS','IV']:
        assert r['summary'][name]['invalid']==ref[name]['invalid']
        np.testing.assert_allclose(r['summary'][name]['test_q10_median_q90'],ref[name]['test_q10_median_q90'],atol=1e-12,rtol=0)
    assert r['summary']['IV_selected']==ref['IV_selected'] and r['summary']['admitted']==ref['admitted']
(f/'raw-python-output.txt').write_text('\n'.join(outputs),encoding='utf8');(f/'notebook-expected.json').write_text(json.dumps(expected,indent=2))
proof=json.loads((f/'pyodide.json').read_text(encoding='utf8'));count=0;worst=0.
def compare(a,b):
    global count,worst
    if isinstance(a,dict):
        assert set(a)==set(b)
        for k in a:compare(a[k],b[k])
    elif isinstance(a,list):
        assert len(a)==len(b)
        for x,y in zip(a,b):compare(x,y)
    elif isinstance(a,bool) or isinstance(a,str) or a is None:assert a==b
    else:count+=1;err=abs(a-b);worst=max(worst,err);assert err<1e-8,(a,b)
for i,nb in enumerate(proof['lessons'][0]['notebooks']):
    text=''.join(o.get('text','') for o in nb['cells'][0]['outputs'] if o['type']=='stream');assert f'id09_cell_{i+1}_passed' in text
    compare(json.loads(text.splitlines()[0]),expected[i])
report=dict(pass_=True,values=count,maxError=worst,tolerance=1e-8,originalCells=3,seedRows=96,source='Actual Pyodide stdout vs actual extracted clean-kernel Python, with independent TS QR / FFT / SciPy verification');report['pass']=report.pop('pass_');(f/'browser-numeric.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
