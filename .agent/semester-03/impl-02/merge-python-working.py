"""Copy only this course's accepted record into shared working metadata."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[3];snap=root.parent/'control-universe-rank1-impl02-validation';key='implementation/digital-pid'
for rel in ['lib/python-support.json','docs/deployment/python-expansion-local.json']:
    p=root/rel;before=p.read_bytes();current=json.loads(before);accepted=json.loads((snap/rel).read_text(encoding='utf-8'))
    if isinstance(current['lessons'],dict):current['lessons'][key]=accepted['lessons'][key]
    else:
        replacement=next(r for r in accepted['lessons'] if r['key']==key)
        current['lessons']=[replacement if r['key']==key else r for r in current['lessons']]
        current['totals']={'lessons':len(current['lessons']),'notebooks':sum(len(r['notebooks']) for r in current['lessons']),
          'enabled':sum(b['status']=='passed' for r in current['lessons'] for b in r['notebooks']),
          'codeOnly':sum(b['status']=='code' for r in current['lessons'] for b in r['notebooks'])}
        policy=json.loads((root/'lib/python-support.json').read_text(encoding='utf-8'))
        current['releaseTotals']={'lessons':len(policy['lessons']),'notebooks':sum(len(r['notebooks']) for r in policy['lessons'].values()),
          'enabled':sum(b['status']=='enabled' for r in policy['lessons'].values() for b in r['notebooks']),
          'codeOnly':sum(b['status']=='code' for r in policy['lessons'].values() for b in r['notebooks'])}
    assert p.read_bytes()==before,'Concurrent update detected; rerun merge'
    p.write_text(json.dumps(current,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
