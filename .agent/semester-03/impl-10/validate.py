"""Validate saved browser DOM readings against the independently executed oracle."""
from pathlib import Path
import json,re,hashlib,urllib.parse
R=Path(__file__).resolve().parents[3];E=Path(__file__).resolve().parent
load=lambda name:json.loads((E/name).read_text(encoding='utf-8'))
ref=load('reference.json');rec=load('reconciliation.json');count=0
def same(a,b,tol=1e-9):
    global count
    if isinstance(b,dict):
        for k,v in b.items():same(a[k],v,tol)
    elif isinstance(b,list):
        assert len(a)==len(b)
        for x,y in zip(a,b):same(x,y,tol)
    elif isinstance(b,bool) or isinstance(b,str) or b is None:assert a==b,(a,b)
    else:
        assert abs(a-b)<=tol,(a,b);count+=1
source=(R/'content/implementation/implementation-case-study.mdx').read_text(encoding='utf-8')
assert rec['pass'] and rec['configs']==36
assert hashlib.sha256(source.encode()).hexdigest()==rec['sourceHash']
summ=lambda c:{k:v for k,v in c.items() if k!='points'}
expected=[dict(default=summ(ref['default']),first=ref['first'],quantization=dict(measurementStep=4/255,outputStep=1/255,measurementHalf=2/255)),ref['table'],dict(bounds=ref['bounds'],boundary=ref['boundary'],events=ref['events'])]
def state(v):
    q=next(c for c in ref['cases'] if all(c[k]==v[k] for k in ['bits','mode','path','costMs']))
    vals=[float(x) for x in re.findall(r'=(-?[0-9.]+)',v['metrics'])]
    same(vals,[q[k] for k in ['final','iae','lastError','overshoot','invalid','degraded','saturated']],1e-8)
    for a,b in zip(re.findall(r'：([^；。]+)',v['gates']),[q[k] for k in ['tracking','peakOk','freshness','accepted']]):assert a==('通过' if b else '不通过')
    vals=[float(x) for x in re.findall(r'=(-?[0-9.]+)',v['first'])]
    same(vals,[q['points'][0]['u'],q['points'][1]['y'],q['points'][1]['measured'],q['points'][1]['integral'],q['points'][1]['u']],1e-8)
    assert v['costDisabled']==(v['mode']=='late')
for name in ['ui-native.json','ui-pages.json']:
    v=load(name);assert len(v['h1'])==1 and len(v['h2'])==10 and v['katex']==0
    assert len(v['anchors'])>=10
    assert len(v['ids'])==len(set(v['ids'])) and all(urllib.parse.unquote(h.split('#')[1]) in v['ids'] for h in v['anchors'])
    assert not v['errors'] and v['canvases']==2 and len(v['images'])==4 and all(x['loaded'] for x in v['images'])
    same(v['outputs'],expected)
    assert len(v['table'])==10
    for cells,q in zip(v['table'],ref['table']):
        assert cells[:2]==[q['mode'],q['path']]
        same([float(x) for x in cells[2:7]],[q[k] for k in ['final','iae','lastError','invalid','degraded']],1e-8)
        assert cells[7]==('是' if q['accepted'] else '否')
    state(dict(bits=8,mode='nominal',path='guarded',costMs=4,costDisabled=False,**{k:v[k] for k in ['metrics','gates','first']}))
for name in ['ui-narrow-native.json','ui-narrow-pages.json']:
    v=load(name);assert v['width']==360 and v['scroll']<=360 and len(v['canvas'])==2 and all(0<x<=360 for x in v['canvas']) and v['table']>v['container']
ui=load('ui-interactions.json');assert len(ui)==64
for v in ui:state(v)
py=load('pyodide.json');assert py['complete'] and py['lessons'][0]['sourceHash']==rec['sourceHash']
for n in py['lessons'][0]['notebooks']:assert n['status']=='passed' and len(n['cells'])==2 and all(c['status']=='passed' for c in n['cells'])
for i,n in enumerate(py['lessons'][0]['notebooks']):
    streams=''.join(o['text'] for o in n['cells'][0]['outputs'] if o['type']=='stream');same(json.loads(streams),expected[i])
origin=load('build-origin.json');assert origin['sourceHash']==rec['sourceHash']
for key,rel in [('componentHash','components/wiki/implementation-case-explorer.tsx'),('calculationHash','lib/implementation-case.ts')]:assert origin[key]==hashlib.sha256((R/rel).read_text(encoding='utf-8').encode()).hexdigest()
assert all(v['exit']==0 for v in load('build-results.json')) and load('css-artifacts.json')['sameConfig']
assert load('console-pages.json')==[]
assert 'PASS 9 · WARN 0 · FAIL 0 · SKIPPED 0' in (E/'verify-native.log').read_text(encoding='utf-8')
result=dict(pass_=True,sourceHash=rec['sourceHash'],configs=36,rawQuantities=rec['quantities'],tsQuantities=rec['tsQuantities'],browserQuantities=count,browserStates=len(ui),maxAbsoluteError=rec['maxError'],tolerance='raw<=1e-9; UI<=1e-8; codes/states/flags exact',staticPreview='http://127.0.0.1:9292/control-universe/implementation/implementation-case-study/')
result['pass']=result.pop('pass_');(E/'validation.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result))
