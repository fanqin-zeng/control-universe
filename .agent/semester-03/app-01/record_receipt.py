"""Record an existing APP-01 commit, preserving concurrent index/working changes."""
from pathlib import Path
import subprocess,json,re,os,tempfile
root=Path.cwd();ev=root/'.agent/semester-03/app-01'
def git(args,**kw):return subprocess.check_output(['git',*args],cwd=root,**kw)
core=git(['log','master','-1','--format=%H','--grep=^feat: deliver APP-01'],text=True).strip()
assert re.fullmatch('[a-f0-9]{40}',core)
git(['merge-base','--is-ancestor',core,'master'])
acceptance=(ev/'acceptance.md').read_text(encoding='utf-8')
if core not in acceptance:
    acceptance+='\n\n## 实际master交付回执\n\n交付提交：`'+core+'`。只包含APP-01正文、组件、计算、图示、讨论及证据与本课共享元数据；普通提交已进入master。\n\n最终提交范围的check、Python支持及计划校验均通过，见scoped-check.log、scoped-python-policy.log、scoped-semester-check.json。原验证基线后的变化若仅为其它课程回执，保持其HEAD内容并复核元数据；无覆盖或重写已有提交。共享暂存区以逐文件的本课语义更新保留其它会话内容。\n'
    (ev/'acceptance.md').write_text(acceptance,encoding='utf-8')
row='| APP-01 | [x] | [x] | [x] | [x] | [x] | [x] | docs/discuss-log/semester-03/21-applications/01-power-electronics.md;.agent/semester-03/app-01/acceptance.md;commit:'+core+' |'
checklist_path='.agent/semester-03-checklist.md'
for attempt in range(5):
    base=git(['rev-parse','HEAD'],text=True).strip()
    checklist=git(['show',base+':'+checklist_path],text=True,encoding='utf-8')
    checklist=re.sub(r'^\| APP-01 \|.*$',lambda m:row,checklist,flags=re.M)
    config={'root':str(root),'plan':git(['show',base+':.agent/semester-03-plan.md'],text=True,encoding='utf-8'),
            'checklist':checklist,'baseline':json.loads(git(['show',base+':.agent/semester-03-baseline.json'],text=True,encoding='utf-8'))}
    code="import fs from 'node:fs';import {validateSemester03} from './scripts/check-semester03.mjs';const r=validateSemester03(JSON.parse(fs.readFileSync(0,'utf8')));console.log(JSON.stringify(r));if(r.errors.length)process.exitCode=1;"
    proof=subprocess.check_output(['node','--input-type=module','-e',code],input=json.dumps(config,ensure_ascii=False).encode())
    (ev/'receipt-semester.json').write_bytes(proof)
    receipt={'deliveryCommit':core,'parentForReceipt':base,'paths':git(['diff-tree','--no-commit-id','--name-only','-r',core],text=True).splitlines()}
    (ev/'master-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
    blobs={checklist_path:checklist.encode(),'.agent/semester-03/app-01/acceptance.md':(ev/'acceptance.md').read_bytes(),
           '.agent/semester-03/app-01/receipt-semester.json':proof,
           '.agent/semester-03/app-01/master-receipt.json':(ev/'master-receipt.json').read_bytes()}
    fd,index=tempfile.mkstemp(prefix='rank15-receipt-',suffix='.index');os.close(fd);os.unlink(index)
    env={**os.environ,'GIT_INDEX_FILE':index}
    try:
        git(['read-tree',base],env=env)
        for path,data in blobs.items():
            blob=git(['hash-object','-w','--path='+path,'--stdin'],input=data).decode().strip()
            git(['update-index','--add','--cacheinfo','100644',blob,path],env=env)
        tree=git(['write-tree'],env=env).decode().strip()
        commit=git(['commit-tree',tree,'-p',base,'-m','docs: record APP-01 master delivery and verified acceptance'],env=env).decode().strip()
        try:git(['update-ref','-m','commit: APP-01 receipt','refs/heads/master',commit,base])
        except subprocess.CalledProcessError:continue
        # Keep only our row changes in the working copy and existing real index.
        for target in ['working','index']:
            text=(root/checklist_path).read_text(encoding='utf-8') if target=='working' else git(['show',':'+checklist_path],text=True,encoding='utf-8')
            text=re.sub(r'^\| APP-01 \|.*$',lambda m:row,text,flags=re.M)
            if target=='working':(root/checklist_path).write_text(text,encoding='utf-8')
            else:
                blob=git(['hash-object','-w','--path='+checklist_path,'--stdin'],input=text.encode()).decode().strip()
                git(['update-index','--add','--cacheinfo','100644',blob,checklist_path])
        for path,data in blobs.items():
            if path==checklist_path:continue
            blob=git(['hash-object','-w','--path='+path,'--stdin'],input=data).decode().strip()
            git(['update-index','--add','--cacheinfo','100644',blob,path])
        print(json.dumps({'delivery':core,'receipt':commit}));break
    finally:
        if os.path.exists(index):os.unlink(index)
else:raise RuntimeError('master kept advancing during receipt')
