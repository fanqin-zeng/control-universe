from pathlib import Path
import json,numpy as np
p=Path('.agent/semester-03/est-08');contract=json.loads((p/'notebook-contract.json').read_text(encoding='utf8'));ns={};exec(contract['notebooks'][0]['setupCode'],ns);rows=[];maximum=0.
for scenario in ['clean','dropout','spike']:
 for qscale in [.25,1,4]:
  for gate in [False,True]:
   for seed in sorted(set(range(20))|{43}):
    a=ns['run_case'](scenario,qscale,gate,seed,information=True);b=ns['run_case'](scenario,qscale,gate,seed,single=True,information=True)
    rows.append(dict(**a,scenario=scenario,qscale=qscale,gate=gate,seed=seed,singleRmse=b['rmse'],singleHistory=b['history']))
(p/'reference-all.json').write_text(json.dumps(rows,indent=2),encoding='utf8');(p/'reference-controls.json').write_text(json.dumps([r for r in rows if r['seed'] in [7,19,43]],indent=2),encoding='utf8');print('378 independent information-filter references')
