from pathlib import Path
import subprocess,json,shutil,re
f=Path('.agent/semester-03/id-05');runtime=Path('D:/Workspace/control-universe-rank3-id05');runtime.mkdir(exist_ok=True)
ports=json.loads((f/'ports.json').read_text())
base=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip();(f/'scope-base.txt').write_text(base+'\n')
subprocess.run(['git','archive',base,'--format=tar','-o',str(runtime/'scope.tar')],check=True);subprocess.run(['tar','-xf',str(runtime/'scope.tar'),'-C',str(runtime)],check=True);(runtime/'scope.tar').unlink()
for p,target in [('node_modules','D:/Workspace/control-universe/node_modules'),('public/pyodide','D:/Workspace/control-universe/public/pyodide')]:
 if not (runtime/p).exists():subprocess.run(['cmd','/c','mklink','/J',str(runtime/p),str(Path(target))],check=True,stdout=subprocess.DEVNULL)
def head(p):return subprocess.check_output(['git','show',base+':'+p]).decode().replace('\r\n','\n')
def write(p,s):(runtime/p).write_text(s,encoding='utf8')
section_names=['引言','反馈怎样带来相关','一个有时序的闭环例','最小二乘趋向哪里','工具变量的两个条件','交互检查总体矩','同一批记录的有限样本实验','还有哪些闭环路线','小结','习题','答案']
shared=['content/catalog.ts','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/delivery-tracker.md','OUTLINE.md','lib/wiki-components.ts','docs/semester-02/03-glossary.md','lib/python-support.json','docs/deployment/python-expansion-local.json','content/identification/persistent-excitation.mdx']
owned=['content/identification/instrumental-variable.mdx','lib/closed-loop-identification.ts','components/wiki/closed-loop-identification-explorer.tsx','public/diagrams/identification/closed-loop-instrument.svg','docs/discuss-log/semester-03/09-identification/05-instrumental-variable.md']
p='content/catalog.ts';s=head(p);i=s.index('"slug": "instrumental-variable"');j=s.index('\n      },',i);block=s[i:j];block=block.replace('"status": "empty"','"status": "'+('v1.3' if (f/'ready.txt').exists() else 'draft')+'"'+',\n        "subsections": '+json.dumps([{'slug':n,'title':n} for n in section_names],ensure_ascii=False,indent=2).replace('\n','\n        '));write(p,s[:i]+block+s[j:])
p='lib/wiki-components.ts';s=head(p);s='import { ClosedLoopIdentificationExplorer } from "@/components/wiki/closed-loop-identification-explorer";\n'+s;s=re.sub(r'(export const wikiComponents[^=]*=\s*\{)',r'\1\n  ClosedLoopIdentificationExplorer,',s,count=1);write(p,s)
p='.agent/semester-03-plan.md';s=head(p);prior='DISCRETE-01;'+ ';'.join(f'IMPL-{n:02}' for n in range(1,11))+';'+ ';'.join(f'ML-{n:02}' for n in range(1,10));row=f'| ID-05 | {prior} | 2026-10-24用户明确指定继续ID-05，rank3；保留并行课程，仅依赖已交付ID-04、传递函数、随机过程和PID | .agent/semester-03/id-05/acceptance.md |';s=s.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',row+'\n<!-- S3-ORDER-EXCEPTIONS-END -->');write(p,s)
p='.agent/semester-03-checklist.md';s=head(p);current=next((l for l in Path(p).read_text(encoding='utf8').splitlines() if l.startswith('| ID-05 |')));s='\n'.join(current if l.startswith('| ID-05 |') else l for l in s.split('\n'));write(p,s)
p='.agent/delivery-tracker.md';s=head(p)
if (f/'ready.txt').exists():s='\n'.join('| [x] 闭环辨识 (instrumental-variable) | 学期3ID-05：闭环相关/工具条件/正确噪声模型/重复实验；3Notebook/Explorer；.agent/semester-03/id-05/acceptance.md |' if '(instrumental-variable)' in l else l for l in s.split('\n'))
write(p,s)
p='docs/semester-02/03-glossary.md';s=head(p);rows=['| 工具变量 | instrumental variable, IV | — | ID-05 | 与误差正交且与回归量有可解相关矩 |','| 弱工具变量 | weak instrument | — | ID-05 | 总体相关矩较弱时有限样本可能不稳定 |','| 估计一致性 | statistical consistency | — | ID-05 | 依概率收敛到真参数，区别多智能体Consensus |']
for row in rows:s=s.replace('<!-- REGISTER-END -->',row+'\n<!-- REGISTER-END -->')
write(p,s)
p='content/identification/persistent-excitation.mdx';s=head(p);assert s.count('是后续专题，当前尚未交付，不作已知前提。')==1;write(p,s.replace('是后续专题，当前尚未交付，不作已知前提。','可继续阅读；本课不以其方法为已知前提。'))
policy_paths=['lib/python-support.json','docs/deployment/python-expansion-local.json'];merged={p:json.loads(head(p)) for p in policy_paths}
for proof_name in ['pyodide.json','old-pyodide.json']:
 if not (f/proof_name).exists():continue
 proof=json.loads((f/proof_name).read_text(encoding='utf8'));lesson=proof['lessons'][0];assert proof['releaseTotals']['enabled']==3
 for p in policy_paths:
  a=merged[p];assert a['workerHash']==proof['workerHash']
  if p.startswith('lib/'):a['lessons'][lesson['key']]={'sourceHash':lesson['sourceHash'],'notebooks':[{'id':n['id'],'title':n['title'],'status':'enabled','reason':'','cells':n['cellCount']} for n in lesson['notebooks']]}
  else:
   records={l['key']:l for l in a['lessons']};records[lesson['key']]=lesson;a['lessons']=list(records.values());a['provenance']=a.get('provenance',[])+[{'testedAt':proof['testedAt'],'url':proof['url'],'inputPath':'.agent/semester-03/id-05/'+proof_name}];a['totals']={'lessons':len(records),'notebooks':sum(len(l['notebooks']) for l in records.values()),'enabled':sum(n['status']=='passed' for l in records.values() for n in l['notebooks']),'codeOnly':sum(n['status']=='code' for l in records.values() for n in l['notebooks'])};a['releaseTotals']=dict(a['totals'])
  write(p,json.dumps(a,ensure_ascii=False,indent=2)+'\n')
for p in owned:
 (runtime/p).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,runtime/p)
shutil.copytree(f,runtime/f,dirs_exist_ok=True)
p=runtime/'components/wiki/jupyter-notebook.tsx';s=p.read_text(encoding='utf8');s=re.sub(r'http://127.0.0.1:(8891|8981)',lambda _:f"http://127.0.0.1:{ports['kernel']}",s);p.write_text(s,encoding='utf8')
(f/'manifest.json').write_text(json.dumps({'base':base,'runtime':str(runtime),'shared':shared,'owned':owned},indent=2))
print('Prepared ID-05 over '+base[:7])
