"""Attach the real master delivery hash after its commit exists."""
from pathlib import Path
import subprocess,os,json,re
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-04';snap=root.parent/'control-universe-rank1-impl04-validation'
def git(*a,**kw):return subprocess.check_output(['git',*a],cwd=root,**kw)
delivery=json.loads((e/'delivery.json').read_text(encoding='utf-8'))
subprocess.run(['git','merge-base','--is-ancestor',delivery['commit'],'master'],cwd=root,check=True)
row='| IMPL-04 | '+' | '.join(['[x]']*6)+' | docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md;.agent/semester-03/impl-04/acceptance.md;.agent/semester-03/impl-04/validation.json;commit:'+delivery['commit']+' |'
p=root/'.agent/semester-03-checklist.md';p.write_text(re.sub(r'^\| IMPL-04 \|.*$',row,p.read_text(encoding='utf-8'),flags=re.M),encoding='utf-8')
note=f'\n真实master交付提交：`{delivery["commit"]}`，父提交`{delivery["base"]}`。采用独立索引与预期父提交原子更新master，未改写共享默认索引。最终原始catalog CLI：PASS21/WARN2/FAIL0，学期完整校验errors=[]，Python策略检查pass。两项WARN为既有跨章motion-planning重名及存量正文缺日志，未新增本课死锚点。本课进入master列在提交存在后据实回填，未发布Pages。\n'
for p in [e/'acceptance.md',root/'docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md']:
    p.write_text(p.read_text(encoding='utf-8').replace('真实master提交回执待登记。','真实master提交回执见下。')+note,encoding='utf-8')
with (e/'receipt-semester.log').open('w',encoding='utf-8') as out:subprocess.run(['node',str(e/'check-scope.mjs'),'--receipt'],cwd=root,stdout=out,stderr=subprocess.STDOUT,check=True)
env=os.environ.copy();env['GIT_INDEX_FILE']=str(snap/'rank1-impl04-receipt.index')
indexed=lambda *a,**kw:git(*a,env=env,**kw)
for attempt in range(15):
    base=git('rev-parse','HEAD',text=True).strip();indexed('read-tree',base)
    subprocess.run(['git','add','--','.agent/semester-03/impl-04','docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md'],cwd=root,env=env,check=True)
    text=git('show',base+':.agent/semester-03-checklist.md',text=True,encoding='utf-8');text=re.sub(r'^\| IMPL-04 \|.*$',row,text,flags=re.M)
    oid=git('hash-object','-w','--path=.agent/semester-03-checklist.md','--stdin',input=text.encode()).decode().strip()
    subprocess.run(['git','update-index','--add','--cacheinfo','100644,'+oid+',.agent/semester-03-checklist.md'],cwd=root,env=env,check=True)
    changed=indexed('diff','--cached','--name-only',text=True,encoding='utf-8').splitlines()
    assert all(p.startswith('.agent/semester-03/impl-04/') or p in ['.agent/semester-03-checklist.md','docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md'] for p in changed)
    subprocess.run(['git','diff','--cached','--check','--','.',':(glob,exclude)**/*.log'],cwd=root,env=env,check=True)
    tree=indexed('write-tree',text=True).strip();commit=git('commit-tree',tree,'-p',base,input=b'docs: record IMPL-04 master delivery and acceptance receipt\n').decode().strip()
    r=subprocess.run(['git','update-ref','-m','record IMPL-04 receipt','refs/heads/master',commit,base],cwd=root)
    if r.returncode==0:print(json.dumps({'delivery':delivery['commit'],'receipt':commit,'parent':base,'sharedIndexModified':False}));break
else:raise RuntimeError('HEAD kept advancing; retry receipt')
