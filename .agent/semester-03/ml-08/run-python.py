import json,importlib.util,io,contextlib
from pathlib import Path
r=Path('.agent/semester-03/ml-08')
sp=importlib.util.spec_from_file_location('nb',r/'notebook.py');nb=importlib.util.module_from_spec(sp);sp.loader.exec_module(nb)
cases=json.loads((r/'cases.json').read_text(encoding='utf-8'));refs=json.loads((r/'reference.json').read_text(encoding='utf-8'));count=0;err=0
def compare(a,b):
 global count,err
 if isinstance(b,(int,float)):
  e=abs(a-b);assert e<=1e-10,(a,b);count+=1;err=max(err,e)
 elif isinstance(b,list):
  assert len(a)==len(b)
  for x,y in zip(a,b):compare(x,y)
 elif isinstance(b,dict):
  for k,v in b.items():compare(a[k],v)
for c,ref in zip(cases,refs):compare(nb.snapshot(**c),ref)
results=[]
for n in json.loads((r/'raw-notebooks.json').read_text(encoding='utf-8')):
 env={};exec(n['setup'],env);cells=[]
 for code in n['cells']:
  stream=io.StringIO()
  with contextlib.redirect_stdout(stream):exec(code,env)
  cells.append(json.loads(stream.getvalue()))
 results.append(dict(title=n['title'],cells=cells))
(r/'python-raw.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
(r/'python-numeric.json').write_text(json.dumps(dict(passed=True,quantities=count,maxError=err,cases=len(cases)),indent=2),encoding='utf-8')
print(count,err)
