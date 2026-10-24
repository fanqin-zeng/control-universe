"""Record the real master commit using only a private index, then CAS master."""
from pathlib import Path
import subprocess,os,json,re
root=Path(__file__).resolve().parents[3];evidence=root/'.agent/semester-03/impl-02';snap=root.parent/'control-universe-rank1-impl02-validation'
report=json.loads((evidence/'delivery.json').read_text(encoding='utf-8'));delivery=report['commit']
def git(*args,**kw):return subprocess.check_output(['git',*args],cwd=root,**kw)
subprocess.run(['git','merge-base','--is-ancestor',delivery,'master'],cwd=root,check=True)
row=f'| IMPL-02 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/07-implementation/02-digital-pid.md;.agent/semester-03/impl-02/acceptance.md;.agent/semester-03/impl-02/validation.json;commit:{delivery} |'
p=root/'.agent/semester-03-checklist.md';before=p.read_bytes();s=before.decode('utf-8');s=re.sub(r'^\| IMPL-02 \|.*$',row,s,flags=re.M);assert p.read_bytes()==before;p.write_text(s,encoding='utf-8')
for p in [evidence/'acceptance.md',root/'docs/discuss-log/semester-03/07-implementation/02-digital-pid.md']:
    s=p.read_text(encoding='utf-8')
    if p.name=='acceptance.md':
        policy=json.loads((evidence/'python-policy.log').read_text(encoding='utf-8').strip())
        fixlog=(evidence/'fix-check-scoped.log').read_text(encoding='utf-8')
        indexed_count=re.search(r'"indexed":\s*(\d+)',fixlog).group(1);detail_count=re.search(r'"details":\s*(\d+)',fixlog).group(1);reserved_count=re.search(r'"reserved":\s*(\d+)',fixlog).group(1)
        s=re.sub(r'\n最终独立索引暂存基线：[^\n]+\n','\n',s)
        s=s.replace('共享默认索引从未被本课提交工具读写','本课提交工具没有修改共享默认索引')
        s=re.sub(r'并行ID-02与EST-01已先后进入master。本课提交元数据基线刷新为[^\n]+',f'本课最终父提交为{report["base"]}，完整保留此前已进入master的并行交付。源码检查基线与回执追赶分别见staging-base.json及可能存在的receipt-forward.json。',s)
        s=re.sub(r'Python策略检查退出0：87课/402实验，386可运行、16代码保留',f'Python策略检查退出0：{policy["lessons"]}课，{policy["enabled"]}可运行、{policy["codeOnly"]}代码保留',s)
        s=s.replace('70索引/70详情/4预留',f'{indexed_count}索引/{detail_count}详情/{reserved_count}预留')
        s+='\n最终目录检查直接执行原scripts/check-catalog.mjs；重复运行由私有Node进程复用该模块现有标题缓存，源码+课程键变化会重新编译，任一校验依赖变化会拒绝复用。判定规则和实际CLI退出码未修改，运行记录见catalog-runs.json。原始旧文与工具stdout保留原空白；其它新代码/文档git diff --check通过。共享索引的过期预留/排序/字段同步见index-normalization.md，未改其它课修复详情。\n'
    s+=f'\n\n真实master交付回执：`{delivery}`。独立索引提交，比较预期父提交后原子更新master；本课提交没有改写共享默认索引，也未提交其它会话的在写文件。课程进入master列据此回填；Pages只保留本地9190预览，未发布。8991验证内核已释放。\n';p.write_text(s,encoding='utf-8')
with (evidence/'scoped-semester-receipt.log').open('w',encoding='utf-8') as out:
    subprocess.run(['node',str(evidence/'check-scope.mjs'),'--receipt'],cwd=root,stdout=out,stderr=subprocess.STDOUT,check=True)
env=os.environ.copy();env['GIT_INDEX_FILE']=str(snap/'rank1-impl02-receipt.index')
def indexed(*args,**kw):return git(*args,env=env,**kw)
for attempt in range(10):
    base=git('rev-parse','HEAD',text=True).strip();indexed('read-tree',base)
    subprocess.run(['git','add','--','.agent/semester-03/impl-02','docs/discuss-log/semester-03/07-implementation/02-digital-pid.md'],cwd=root,env=env,check=True)
    original=git('show',base+':.agent/semester-03-checklist.md',text=True,encoding='utf-8')
    checklist=re.sub(r'^\| IMPL-02 \|.*$',row,original,flags=re.M)
    oid=git('hash-object','-w','--path=.agent/semester-03-checklist.md','--stdin',input=checklist.encode()).decode().strip()
    subprocess.run(['git','update-index','--add','--cacheinfo','100644,'+oid+',.agent/semester-03-checklist.md'],cwd=root,env=env,check=True)
    changed=indexed('diff','--cached','--name-only',text=True,encoding='utf-8').splitlines()
    assert all(p.startswith('.agent/semester-03/impl-02/') or p in ['.agent/semester-03-checklist.md','docs/discuss-log/semester-03/07-implementation/02-digital-pid.md'] for p in changed)
    subprocess.run(['git','diff','--cached','--check','--','.',':(glob,exclude)**/*.log',':(exclude).agent/semester-03/impl-02/source-before.mdx'],cwd=root,env=env,check=True)
    tree=indexed('write-tree',text=True).strip()
    commit=git('commit-tree',tree,'-p',base,input=b'docs: record IMPL-02 master delivery and isolated acceptance\n').decode().strip()
    r=subprocess.run(['git','update-ref','-m','record IMPL-02 receipt','refs/heads/master',commit,base],cwd=root)
    if r.returncode==0:
        print(json.dumps({'delivery':delivery,'receipt':commit,'parent':base,'sharedIndexModified':False}));break
else:raise RuntimeError('master kept advancing; receipt files preserved')
