"""Validate HEAD+IMPL02, use a private index and atomically advance master.
No commands in this script modify the shared default index.
"""
from pathlib import Path
import subprocess,os,json,sys,time,re
root=Path(__file__).resolve().parents[3];snap=root.parent/'control-universe-rank1-impl02-validation';evidence=root/'.agent/semester-03/impl-02'
def git(*args,**kwargs):return subprocess.check_output(['git',*args],cwd=root,**kwargs)
def run(args,cwd=root,log=None,expected=(0,)):
    if log:
        with (evidence/log).open('w',encoding='utf-8') as out:
            r=subprocess.run(args,cwd=cwd,stdout=out,stderr=subprocess.STDOUT)
    else:r=subprocess.run(args,cwd=cwd)
    if r.returncode not in expected:raise RuntimeError(f'{args}: exit {r.returncode}; see {log}')
    return r.returncode
assert git('symbolic-ref','--short','HEAD',text=True).strip()=='master'
def forward_receipts(base,current):
    """Reuse numerical/catalog checks only when source and catalog are unchanged.
    Changed completion rows are independently checked against actual master.
    """
    changed=git('diff','--name-only',base,current,text=True,encoding='utf-8').splitlines()
    allowed=lambda p:p=='.agent/semester-03-checklist.md' or p.startswith('docs/discuss-log/') or bool(re.match(r'^\.agent/semester-03/[^/]+/',p))
    if not all(allowed(p) for p in changed):return False
    old=git('show',base+':.agent/semester-03-checklist.md',text=True,encoding='utf-8')
    new=git('show',current+':.agent/semester-03-checklist.md',text=True,encoding='utf-8')
    isrow=lambda l:bool(re.match(r'^\| [A-Z]+-\d+ \|',l))
    if [l for l in old.splitlines() if not isrow(l)]!=[l for l in new.splitlines() if not isrow(l)]:return False
    def rows(s):return {c[0]:c for l in s.splitlines() if isrow(l) for c in [[v.strip() for v in l.split('|')[1:-1]]]}
    before,after=rows(old),rows(new)
    if before.keys()!=after.keys():return False
    checked=[]
    for key,v in after.items():
        if v==before[key]:continue
        if v[1:6]!=before[key][1:6] or v[1:7]!=['[x]']*6:return False
        match=re.search(r'commit:([a-f0-9]{7,40})',v[7]);assert match,key
        subprocess.run(['git','rev-parse','--verify',match[1]+'^{commit}'],cwd=root,stdout=subprocess.DEVNULL,check=True)
        subprocess.run(['git','merge-base','--is-ancestor',match[1],current],cwd=root,check=True)
        checked.append({'lesson':key,'commit':match[1]})
    own=next(l for l in (root/'.agent/semester-03-checklist.md').read_text(encoding='utf-8').splitlines() if l.startswith('| IMPL-02 |'))
    (snap/'.agent/semester-03-checklist.md').write_text(re.sub(r'^\| IMPL-02 \|.*$',own,new,flags=re.M),encoding='utf-8')
    meta=json.loads((evidence/'staging-base.json').read_text(encoding='utf-8'));meta.update(base=current,validatedSourceBase=meta.get('validatedSourceBase',base));(evidence/'staging-base.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
    p=evidence/'receipt-forward.json';history=json.loads(p.read_text(encoding='utf-8')) if p.exists() else []
    history.append({'from':base,'to':current,'changed':changed,'checkedReceipts':checked,'sourceCatalogPolicyRegistryUnchanged':True});p.write_text(json.dumps(history,indent=2)+'\n',encoding='utf-8')
    print('Reused checks for unchanged source; verified new receipt commits',current,flush=True)
    return True
for attempt in range(1,21):
    base=git('rev-parse','HEAD',text=True).strip();print('Attempt',attempt,'base',base,flush=True)
    run(['python',str(evidence/'snapshot.py')])
    try:run(['python',str(evidence/'metadata.py')])
    except RuntimeError:
        if git('rev-parse','HEAD',text=True).strip()!=base:continue
        raise
    run(['node','scripts/finalize-python-support.mjs',str(evidence/'pyodide.json'),'--merge'],snap,'python-finalize.log')
    run(['node','scripts/check-python-support.mjs'],snap,'python-policy.log')
    run(['python',str(evidence/'run-catalog.py'),'--fix'],root,expected=(0,1))
    run(['python',str(evidence/'run-catalog.py')],root)
    run(['node','scripts/check-fix-logs.mjs'],snap,'fix-check-scoped.log')
    run(['node',str(evidence/'check-scope.mjs')],root,'scoped-semester.log')
    delivered=False
    for final_attempt in range(15):
        current=git('rev-parse','HEAD',text=True).strip()
        if current!=base:
            if not forward_receipts(base,current):break
            base=current
        policy=json.loads((evidence/'python-policy.log').read_text(encoding='utf-8').strip())
        note=f'\n最终独立索引暂存基线：{base}。目录check退出0；fix检查退出0；Python策略{policy["lessons"]}课、{policy["enabled"]}可运行、{policy["codeOnly"]}代码保留；完整学期检查errors=[]。本课提交没有改写共享默认索引；master使用预期父提交原子更新。若期间只有回执变化，源码/目录/政策/注册字节未变且新增回执commit实际为master祖先后，复用已通过源码检查，详情见receipt-forward.json。\n'
        p=evidence/'acceptance.md';p.write_text(p.read_text(encoding='utf-8')+note,encoding='utf-8')
        try:run(['python',str(evidence/'stage.py'),'--isolated'])
        except RuntimeError:
            if git('rev-parse','HEAD',text=True).strip()!=base:continue
            raise
        env=os.environ.copy();env['GIT_INDEX_FILE']=str(snap/'rank1-impl02.index')
        tree=git('write-tree',env=env,text=True).strip()
        message='feat: deliver IMPL-02 digital PID with verified state updates\n'
        commit=git('commit-tree',tree,'-p',base,input=message.encode()).decode().strip()
        r=subprocess.run(['git','update-ref','-m',message.strip(),'refs/heads/master',commit,base],cwd=root)
        if r.returncode:continue
        report={'commit':commit,'base':base,'tree':tree,'index':str(snap/'rank1-impl02.index'),'sharedIndexModified':False,'method':'commit-tree + atomic update-ref with expected old master'}
        (evidence/'delivery.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
        print('DELIVERED',commit,flush=True);delivered=True;break
    if delivered:break
    print('Source changed in master; revalidating changed baseline',flush=True)
else:raise RuntimeError('master kept advancing; preserve all evidence and retry later')
