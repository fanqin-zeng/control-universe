from pathlib import Path
import urllib.request,urllib.parse,json
f=Path('.agent/semester-03/id-05');ports=json.loads((f/'ports.json').read_text());base=f"http://127.0.0.1:{ports['kernel']}";op=urllib.request.build_opener(urllib.request.ProxyHandler({}));before=json.load(op.open(base+'/health',timeout=5));closed=[]
for key in before.get('idle_seconds',{}):
 with op.open(urllib.request.Request(base+'/api/notebook/'+urllib.parse.quote(key,safe=''),method='DELETE'),timeout=10) as result:closed.append({'id':key,'status':result.status})
after=json.load(op.open(base+'/health',timeout=5));assert after['kernels']==0;report={'kernelPort':ports['kernel'],'kernelPid':ports['kernelPid'],'before':before['kernels'],'closed':closed,'after':after['kernels']};(f/'kernels-closed.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'closed':len(closed),'remaining':after['kernels']}))
