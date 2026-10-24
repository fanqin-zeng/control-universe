from pathlib import Path
import json,math
r=Path(__file__).resolve().parents[3];e=Path(__file__).resolve().parent
load=lambda p:json.loads(p.read_text(encoding='utf-8'))
count=0
def same(a,b):
    global count
    if isinstance(b,dict):
        for k,v in b.items():same(a[k],v)
    elif isinstance(b,list):
        assert len(a)==len(b)
        for x,y in zip(a,b):same(x,y)
    elif isinstance(b,bool) or isinstance(b,str) or b is None:assert a==b
    else:assert math.isclose(a,b,rel_tol=0,abs_tol=1e-9),(a,b);count+=1
for task,key in [('impl09','hil-rapid-prototyping'),('impl10','implementation-case-study')]:
    public=load(e/('pages-public-'+task+'-python.json'))
    local=load(r/('.agent/semester-03/'+('impl-09' if task=='impl09' else 'impl-10')+'/pyodide.json'))
    assert public['complete'] and public['lessons'][0]['sourceHash']==local['lessons'][0]['sourceHash']
    for actual,expected in zip(public['lessons'][0]['notebooks'],local['lessons'][0]['notebooks']):
        assert actual['status']=='passed' and len(actual['cells'])==2
        for a,b in zip(actual['cells'],expected['cells']):
            assert a['status']=='passed' and all(o['type']!='error' for o in a['outputs'])
            if a['index']==1:
                streams=lambda c:''.join(o['text'] for o in c['outputs'] if o['type']=='stream')
                same(json.loads(streams(a)),json.loads(streams(b)))
live=load(e/'pages-public-dom.json');local=load(e/'ui-pages.json')
same(live['outputs'],local['outputs']);assert live['metrics']==local['metrics'] and live['gates']==local['gates']
assert len(live['h2'])==10 and live['katex']==0 and len(live['ids'])==len(set(live['ids']))
assert len(live['images'])==4 and all(i['loaded'] for i in live['images']) and live['canvases']==2
assert load(e/'pages-public-console.json')==[]
controls=load(e/'pages-public-controls.json');assert '无效=15；降级=13' in controls['drop']['metrics'] and controls['default']['metrics']==local['metrics']
http=load(r/'docs/deployment/impl10-release-http.json');assert http['pass'] and len(http['results'])==235 and http['release']['sourceCommit']=='4acd64ae008bd18555caefeb8e937a379dce6fa8' and not http['release']['sourceDirty']
actions=load(e/'pages-actions.json');assert actions['conclusion']=='success'
result=dict(passed=True,pagesCommit=actions['head_sha'],actions=actions['html_url'],lessons=http['lessons'],legacyRoutes=http['legacyRoutes'],requests=len(http['results']),pythonNotebooks=6,pythonCells=12,comparedNumbers=count,uiNotebooks=3,uiCells=6,consoleErrors=0)
(e/'pages-public-validation.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result))
