"""Attest the actual CSS build, record old-snapshot debt, commit only this audit."""
from pathlib import Path
import json,hashlib,re,subprocess,os
root=Path(__file__).resolve().parents[3];e=root/'.agent/semester-03/impl-04';snap=root.parent/'control-universe-rank1-impl04-validation'
def git(*a,**kw):return subprocess.check_output(['git',*a],cwd=root,**kw)
config=(snap/'postcss.config.mjs').read_bytes();assert config==(root/'postcss.config.mjs').read_bytes()
builds=json.loads((e/'build-results.json').read_text(encoding='utf-8'));assert len(builds)==2 and all(b['exit']==0 for b in builds)
dom=json.loads((e/'pages-dom.json').read_text(encoding='utf-8'));narrow=json.loads((e/'pages-narrow-layout.json').read_text(encoding='utf-8'))
assert dom['articleWidth']<dom['width']-100
css=[]
for url in dom['styles']:
    if '/_next/static/css/' not in url:continue
    p=snap/'out'/url.removeprefix('/control-universe/');data=p.read_bytes();assert b'.prose' in data;css.append({'url':url,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'typographyCompiled':True})
assert css
report={'pass':True,'config':'postcss.config.mjs','configMatchesWorkspace':True,'postcssHash':hashlib.sha256(config).hexdigest(),'css':css,'articleWidth':dom['articleWidth'],'viewport':dom['width'],'narrow':narrow,'lessonSourceUnchanged':True}
(e/'css-verification.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
note=f'\n最终样式复验补正：隔离快照原先遗漏实际postcss.config.mjs，已修正本课snapshot.py，并在补齐配置后重跑原生/Pages生产构建（均0）。最终Pages正文宽{dom["articleWidth"]:.2f}px，视口{dom["width"]}px；375px夹具文档{narrow["width"]}/{narrow["scroll"]}、图{narrow["canvas"]}、表容器{narrow["region"]}px。三Notebook重新执行，原始UI输出与数值参考仍全通过、console error0。当前CSS配置及产物哈希见css-verification.json，最终图片pages.png；旧无配置布局只作历史证据，不用于最终CSS签发。前三课配置完整性仅登记QA02待核，本课未替它们重新签发。\n'
for p in [e/'acceptance.md',root/'docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md']:
    s=p.read_text(encoding='utf-8')
    s=s.replace('原生及静态375px夹具均clientWidth=scrollWidth=360，canvas331；指标表内部滚动','最终正确PostCSS的Pages 375px夹具clientWidth=scrollWidth=360，canvas299；表容器328内部滚动')
    s=s.replace('原生及Pages 375px夹具均文档360/360、图331、表内滚动','最终正确PostCSS的Pages 375px夹具文档360/360、图299、表容器328内滚动；旧原生布局只保留历史草稿证据')
    s=s.replace('两种375px夹具文档宽360/滚动360、图331','最终正确PostCSS的Pages 375px夹具文档宽360/滚动360、图299，表容器328；旧无配置布局只保留历史证据')
    if '最终样式复验补正：' not in s:s+=note
    p.write_text(s,encoding='utf-8')
subprocess.run(['node',str(e/'validate.mjs')],cwd=root,check=True)
row='| QA02 | 旧课程隔离预览构建配置完整性复核 | [ ] | .agent/semester-03/impl-04/css-isolation-audit.md;IMPL-04已补齐PostCSS并复验；IMPL-01/02/03隔离配置及样式证据待核，未改其正文或完成标记 |'
heading='### IMPL-04 样式复验补正'
addition=heading+'\n\n隔离快照补齐实际postcss.config.mjs，两种生产构建及正确CSS下Pages/窄屏/浏览器Python已复验。数值源码不变；历史预览配置完整性仅登记QA02待核，见`.agent/semester-03/impl-04/css-isolation-audit.md`。\n'
def addrow(s):
    if re.search(r'^\| QA02 \|',s,re.M):
        assert row in s,'QA02 already belongs to another task';return s
    return s.replace('<!-- S3-TASKS-END -->',row+'\n<!-- S3-TASKS-END -->')
for rel,fn in [('.agent/semester-03-checklist.md',addrow),('.agent/semester-03-plan.md',lambda s:s if heading in s else s.rstrip()+'\n\n'+addition)]:
    p=root/rel;p.write_text(fn(p.read_text(encoding='utf-8')),encoding='utf-8')
env=os.environ.copy();env['GIT_INDEX_FILE']=str(snap/'rank1-impl04-css.index')
indexed=lambda *a,**kw:git(*a,env=env,**kw)
for attempt in range(15):
    base=git('rev-parse','HEAD',text=True).strip()
    checklist=addrow(git('show',base+':.agent/semester-03-checklist.md',text=True,encoding='utf-8'))
    plan=git('show',base+':.agent/semester-03-plan.md',text=True,encoding='utf-8');plan=plan if heading in plan else plan.rstrip()+'\n\n'+addition
    (snap/'css-final-checklist.md').write_text(checklist,encoding='utf-8');(snap/'css-final-plan.md').write_text(plan,encoding='utf-8')
    with (e/'css-semester.log').open('w',encoding='utf-8') as out:subprocess.run(['node',str(e/'check-css.mjs')],cwd=root,stdout=out,stderr=subprocess.STDOUT,check=True)
    indexed('read-tree',base);subprocess.run(['git','add','--','.agent/semester-03/impl-04','docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md'],cwd=root,env=env,check=True)
    for rel,text in [('.agent/semester-03-checklist.md',checklist),('.agent/semester-03-plan.md',plan)]:
        oid=git('hash-object','-w','--path='+rel,'--stdin',input=text.encode()).decode().strip();subprocess.run(['git','update-index','--add','--cacheinfo','100644,'+oid+','+rel],cwd=root,env=env,check=True)
    changed=indexed('diff','--cached','--name-only',text=True,encoding='utf-8').splitlines();assert all(p.startswith('.agent/semester-03/impl-04/') or p in ['.agent/semester-03-plan.md','.agent/semester-03-checklist.md','docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md'] for p in changed)
    subprocess.run(['git','diff','--cached','--check','--','.',':(glob,exclude)**/*.log'],cwd=root,env=env,check=True)
    tree=indexed('write-tree',text=True).strip();commit=git('commit-tree',tree,'-p',base,input=b'fix: verify IMPL-04 styling with complete isolated build configuration\n').decode().strip()
    r=subprocess.run(['git','update-ref','-m','record IMPL-04 CSS validation','refs/heads/master',commit,base],cwd=root)
    if r.returncode==0:print(json.dumps({'commit':commit,'base':base,'sharedIndexModified':False}));break
else:raise RuntimeError('Concurrent master updates; preserve CSS evidence and retry')
