"""Release kernels from this task's exclusively started rank1 gateway."""
from pathlib import Path
import urllib.request,json
p=Path(__file__).resolve().parent
o=urllib.request.build_opener(urllib.request.ProxyHandler({}))
health=json.load(o.open('http://127.0.0.1:8991/health'))
released=[]
for key in health['idle_seconds']:
    # These eight IDs are the native course tabs created by this task.
    assert key in ['nb-1792822912368-2','nb-1792822912377-3','nb-1792822997382-2','nb-1792822997392-3','nb-1792823146493-2','nb-1792823146505-3','nb-1792823213820-2','nb-1792823213830-3'],key
    json.load(o.open(urllib.request.Request('http://127.0.0.1:8991/api/notebook/'+key,method='DELETE')));released.append(key)
after=json.load(o.open('http://127.0.0.1:8991/health'));assert after['kernels']==0
(p/'cleanup.json').write_text(json.dumps({'gateway':8991,'released':released,'after':after,'staticPreviewRetained':9192},indent=2)+'\n',encoding='utf-8')
print(json.dumps({'released':len(released),'remaining':after['kernels']}))
