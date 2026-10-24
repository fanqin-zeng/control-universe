from pathlib import Path
import json,subprocess,urllib.request
root=Path.cwd();folder=root/'.agent/semester-03/est-07';records=json.loads((root/'logs/est07-services.json').read_text());op=urllib.request.build_opener(urllib.request.ProxyHandler({}));audit=[]
for row in records:
 query=f"@(Get-NetTCPConnection -LocalPort {row['port']} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique) | ConvertTo-Json -Compress"
 raw=subprocess.check_output(['powershell','-NoProfile','-Command',query],text=True).strip();owners=json.loads(raw) if raw else [];owners=owners if isinstance(owners,list) else [owners];assert owners==[row['pid']],(row,owners)
 item=dict(row,verifiedOwners=owners)
 if row['label']=='jupyter':
  with op.open('http://127.0.0.1:19874/health') as r:health=json.load(r)
  for notebook in health['idle_seconds']:
   req=urllib.request.Request('http://127.0.0.1:19874/api/notebook/'+notebook,method='DELETE')
   with op.open(req) as r:assert r.status==200
  with op.open('http://127.0.0.1:19874/health') as r:after=json.load(r)
  assert after['kernels']==0;item.update(kernelsBefore=health['kernels'],kernelsAfter=0)
 subprocess.run(['powershell','-NoProfile','-Command',f"Stop-Process -Id {row['pid']} -ErrorAction Stop"],check=True);item['stopped']=True;audit.append(item)
(folder/'own-resource-cleanup.json').write_text(json.dumps(dict(ownedOnly=True,services=audit,nativeAndPagesPreview='owned subprocesses stopped by finally blocks'),indent=2),encoding='utf8');print('Owned services stopped; kernels explicitly closed')
