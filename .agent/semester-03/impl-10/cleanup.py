"""Release only the kernels recorded on this task's rank1 gateway."""
from pathlib import Path
import urllib.request,json
e=Path(__file__).resolve().parent;o=urllib.request.build_opener(urllib.request.ProxyHandler({}))
owned=json.loads((e/'kernel-ownership.json').read_text(encoding='utf-8'))
health=json.load(o.open('http://127.0.0.1:8991/health'))
assert set(health['idle_seconds'])<=set(owned['idle_seconds']),'Unrecorded kernel appeared; do not delete it'
released=[]
for key in health['idle_seconds']:
    json.load(o.open(urllib.request.Request('http://127.0.0.1:8991/api/notebook/'+key,method='DELETE')));released.append(key)
after=json.load(o.open('http://127.0.0.1:8991/health'));assert after['kernels']==0
(e/'cleanup.json').write_text(json.dumps({'gateway':8991,'released':released,'after':after,'staticPreviewRetained':9292},indent=2)+'\n',encoding='utf-8')
print(json.dumps({'released':len(released),'remaining':after['kernels']}))
