from pathlib import Path
import re
f=Path('.agent/semester-03/id-08');r=Path('D:/Workspace/control-universe-rank3-id08')
def setrow(path,test,row):
 p=Path(path);s=p.read_text(encoding='utf8');s='\n'.join(row if test(l) else l for l in s.split('\n'));p.write_text(s,encoding='utf8')
done=(f/'ready.txt').exists();phase=' | '.join(['[x]']*(5 if done else 2)+['[ ]']*(1 if done else 4))
row='| ID-08 | '+phase+' | docs/discuss-log/semester-03/09-identification/08-nonlinear-data-driven-id.md;.agent/semester-03/id-08/acceptance.md;rank3 '+('验收通过，待提交回执' if done else 'P1/P2完成，数值独立核通过，浏览器与构建验收中')+' |'
setrow('.agent/semester-03-checklist.md',lambda l:l.startswith('| ID-08 |'),row)
p=Path('.agent/semester-03-plan.md');s=p.read_text(encoding='utf8');row=next(l for l in (r/p).read_text(encoding='utf8').splitlines() if l.startswith('| ID-08 | DISCRETE-'))
if row not in s:s=s.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->');p.write_text(s,encoding='utf8')
for name in ['content/catalog.ts','lib/wiki-components.ts','docs/semester-02/03-glossary.md']:
 p=Path(name);s=p.read_text(encoding='utf8');preview=(r/name).read_text(encoding='utf8')
 if name.startswith('content/'):
  i=s.index('"slug": "nonlinear-data-driven-id"');j=s.index('\n      },',i);a=preview.index('"slug": "nonlinear-data-driven-id"');b=preview.index('\n      },',a);s=s[:i]+preview[a:b]+s[j:]
 elif name.startswith('lib/'):
  if 'import { NonlinearIdentificationExplorer }' not in s:s='import { NonlinearIdentificationExplorer } from "@/components/wiki/nonlinear-identification-explorer";\n'+s
  if '  NonlinearIdentificationExplorer,' not in s:s=re.sub(r'(export const wikiComponents[^=]*=\s*\{)',r'\1\n  NonlinearIdentificationExplorer,',s,count=1)
 else:
  for row in preview.splitlines():
   if '| ID-08 |' in row and row not in s:s=s.replace('<!-- REGISTER-END -->',row+'\n<!-- REGISTER-END -->')
 p.write_text(s,encoding='utf8')
if done:
 row=next(l for l in (r/'.agent/delivery-tracker.md').read_text(encoding='utf8').splitlines() if '(nonlinear-data-driven-id)' in l);setrow('.agent/delivery-tracker.md',lambda l:'(nonlinear-data-driven-id)' in l,row)
print('Progress saved for ID-08 only')
