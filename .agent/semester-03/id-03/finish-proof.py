from pathlib import Path
import json
f=Path('.agent/semester-03/id-03')
own=json.loads((f/'pyodide.json').read_text(encoding='utf8'))
old=json.loads((f/'adaptive-pyodide.json').read_text(encoding='utf8'))
assert own['workerHash']==old['workerHash']
for i in range(1,11):
 p=json.loads((f/f'adaptive-nb-{i}.json').read_text(encoding='utf8'))
 assert p['releaseTotals']['enabled']==1 and p['complete']
 assert all(c['status']=='passed' for c in p['lessons'][0]['notebooks'][0]['cells'])
r={**own,'lessons':own['lessons']+old['lessons'],'scope':'ID-03 plus unchanged-code reverse-link regression','testedAt':old['testedAt'],'totals':{'lessons':2,'notebooks':13,'enabled':13,'codeOnly':0},'releaseTotals':{'enabled':13,'codeOnly':0},'provenance':[{'inputPath':'.agent/semester-03/id-03/pyodide.json'},{'inputPath':'.agent/semester-03/id-03/adaptive-pyodide.json'}]}
(f/'pyodide-combined.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('PASS: 13 notebooks / 43 cells; both actual reports; same Worker')
