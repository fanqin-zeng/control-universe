from pathlib import Path
import subprocess,json,shutil,re
f=Path('.agent/semester-03/id-09');runtime=Path('D:/Workspace/control-universe-rank3-id09');runtime.mkdir(exist_ok=True)
ports=json.loads((f/'ports.json').read_text());base=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip();(f/'scope-base.txt').write_text(base+'\n')
subprocess.run(['git','archive',base,'--format=tar','-o',str(runtime/'scope.tar')],check=True);subprocess.run(['tar','-xf',str(runtime/'scope.tar'),'-C',str(runtime)],check=True);(runtime/'scope.tar').unlink()
for p,target in [('node_modules','D:/Workspace/control-universe/node_modules'),('public/pyodide','D:/Workspace/control-universe/public/pyodide')]:
 if not (runtime/p).exists():subprocess.run(['cmd','/c','mklink','/J',str(runtime/p),str(Path(target))],check=True,stdout=subprocess.DEVNULL)
def head(p):return subprocess.check_output(['git','show',base+':'+p]).decode().replace('\r\n','\n')
def write(p,s):(runtime/p).write_text(s,encoding='utf8')
names=['引言', '把工程问题写成验收合同', '记录与时序先审计', '闭环候选怎样估计', '验证选择与测试放行', '频域证据与残差检查', '交互复核整条链路', '重复记录与失败边界', '小结', '习题', '答案']
shared=['content/catalog.ts','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/delivery-tracker.md','OUTLINE.md','lib/wiki-components.ts','docs/semester-02/03-glossary.md','lib/python-support.json','docs/deployment/python-expansion-local.json']
owned=['content/identification/identification-case-study.mdx','lib/identification-case.ts','components/wiki/identification-case-explorer.tsx','public/diagrams/identification/identification-case-pipeline.svg','docs/discuss-log/semester-03/09-identification/09-identification-case-study.md']
p='content/catalog.ts';s=head(p);i=s.index('"slug": "identification-case-study"');j=s.index('\n      },',i);block=s[i:j];assert '"status": "empty"' in block;block=block.replace('"status": "empty"','"status": "'+('v1.3' if (f/'ready.txt').exists() else 'draft')+'",\n        "subsections": '+json.dumps([{'slug':n.lower(),'title':n} for n in names],ensure_ascii=False,indent=2).replace('\n','\n        '));write(p,s[:i]+block+s[j:])
p='lib/wiki-components.ts';s=head(p);s='import { IdentificationCaseExplorer } from "@/components/wiki/identification-case-explorer";\n'+s;s=re.sub(r'(export const wikiComponents[^=]*=\s*\{)',r'\1\n  IdentificationCaseExplorer,',s,count=1);write(p,s)
p='.agent/semester-03-plan.md';s=head(p);prior='DISCRETE-01;'+ ';'.join(f'IMPL-{n:02}' for n in range(1,11))+';'+ ';'.join(f'ML-{n:02}' for n in range(1,10));row=f'| ID-09 | {prior} | 2026-10-24用户明确指定继续ID-09，rank3；保留并行课程，闭环/频域已交付；评估课未交付，局部定义分区与冻结，ID08提供已交付支撑 | .agent/semester-03/id-09/acceptance.md |';s=s.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->');write(p,s)
p='.agent/semester-03-checklist.md';s=head(p);current=next(l for l in Path(p).read_text(encoding='utf8').splitlines() if l.startswith('| ID-09 |'));s='\n'.join(current if l.startswith('| ID-09 |') else l for l in s.split('\n'));write(p,s)
p='.agent/delivery-tracker.md';s=head(p)
if (f/'ready.txt').exists():s='\n'.join('| [x] 系统辨识案例 (identification-case-study) | 学期3ID-09：水箱闭环OLS/IV、冻结选择、独立测试与频域复核；3Notebook/Explorer；.agent/semester-03/id-09/acceptance.md |' if '(identification-case-study)' in l else l for l in s.split('\n'))
write(p,s)
p='docs/semester-02/03-glossary.md';s=head(p)
for row in ['| 模型验证 | model validation | — | ID-09 | 在独立记录核对模型的指定用途 |','| 输入端注入 | input injection | — | ID-09 | 叠加到执行器输入的外部辨识信号 |']:s=s.replace('<!-- REGISTER-END -->',row+'\n<!-- REGISTER-END -->')
write(p,s)
if (f/'pyodide.json').exists():
 proof=json.loads((f/'pyodide.json').read_text(encoding='utf8'));lesson=proof['lessons'][0];assert proof['releaseTotals']['enabled']==3
 for p in ['lib/python-support.json','docs/deployment/python-expansion-local.json']:
  a=json.loads(head(p));assert a['workerHash']==proof['workerHash']
  if p.startswith('lib/'):a['lessons'][lesson['key']]={'sourceHash':lesson['sourceHash'],'notebooks':[{'id':n['id'],'title':n['title'],'status':'enabled','reason':'','cells':n['cellCount']} for n in lesson['notebooks']]}
  else:
   records={l['key']:l for l in a['lessons']};records[lesson['key']]=lesson;a['lessons']=list(records.values());a['provenance']=a.get('provenance',[])+[{'testedAt':proof['testedAt'],'url':proof['url'],'inputPath':'.agent/semester-03/id-09/pyodide.json'}];a['totals']={'lessons':len(records),'notebooks':sum(len(l['notebooks']) for l in records.values()),'enabled':sum(n['status']=='passed' for l in records.values() for n in l['notebooks']),'codeOnly':sum(n['status']=='code' for l in records.values() for n in l['notebooks'])};a['releaseTotals']=dict(a['totals'])
  write(p,json.dumps(a,ensure_ascii=False,indent=2)+'\n')
for p in owned:
 (runtime/p).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,runtime/p)
shutil.copytree(f,runtime/f,dirs_exist_ok=True)
p=runtime/'components/wiki/jupyter-notebook.tsx';s=p.read_text(encoding='utf8');s=re.sub(r'http://127.0.0.1:(8891|8981)',lambda _:f"http://127.0.0.1:{ports['kernel']}",s);p.write_text(s,encoding='utf8')
(f/'manifest.json').write_text(json.dumps({'base':base,'runtime':str(runtime),'shared':shared,'owned':owned},indent=2));print('Prepared ID-09 over '+base[:7])
