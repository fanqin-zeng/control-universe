from pathlib import Path
import json,subprocess,os,shutil
root=Path('D:/Workspace/control-universe');e=root/'.agent/semester-03/id-09/pages-release';report=json.loads((e/'public-validation.json').read_text());assert report['pass'];sha=report['pagesCommit'];approved=report['approved']
note=f'''# ID-09 系统辨识案例授权发布

2026-10-24用户要求“将这些内容推送到github pages”。固定批准版本master `{approved}`；在独立rank3发布工作树，从origin/gh-pages `{json.loads((e/'candidate.json').read_text())['previousPages']}`正常no-ff合入，生成 `{sha}`。发布树与批准版本完全相同；之后并行产生的master课程更新未自动纳入。主工作区保持master，共享暂存与其它修改保留，没有强推。

本地npm run check：PASS21/WARN2/FAIL0；14项Pages/路由/浏览器Python/发布决策测试通过；npm run math:check和npm run build:pages退出0。静态导出205课、9旧入口及资源检查通过，release.json sourceCommit精确等于发布提交且sourceDirty=false。两WARN为既有motion-planning跨章重名和5门历史正文缺日志。

GitHub Actions构建、部署均成功：[运行记录]({report['actions']})。正式站点为https://fanqin-zeng.github.io/control-universe/ ，公网release.json再次精确核对同一发布SHA及sourceDirty=false。

公网检查：{report['lessons']}课、{report['legacyRoutes']}旧入口、{report['requests']}请求通过，未知地址404；CSS/字体、标题与Python运行模式核验通过。本课实际页面运行3Notebook/3cell，全部96条重复记录保留，{report['pythonValues']}个输出与独立Python期望值核对，最大差{report['maxError']:.17g}；实际服务Worker字节hash匹配。六预设、十控件端点、拒绝、恢复默认，11H2的文本/ID/目录、SVG/双图、375px及pageerror0通过，公网页面截图已复核。

本次只重跑ID-09的三个公网实验，不声称执行全站全部Python。证据位于`.agent/semester-03/id-09/pages-release/`和同级browser-public.json及public截图。工作树只作发布隔离，未占共享8080/8891。回执仅记入master，不自动再部署发布分支。
'''
doc=Path('docs/deployment/id09-release.md');(root/doc).write_text(note,encoding='utf8')
marker='<!-- ID09-PAGES-RECEIPT-BEGIN -->';block=f'\n{marker}\n2026-10-24用户授权发布ID-09：固定master {approved[:7]}，正常合入gh-pages {sha[:7]}。Actions构建/部署与公网{report["requests"]}请求通过；ID-09三个Notebook/3cell页内运行、1023输出对账、375px与控件通过。详见[发布记录](id09-release.md)。未发布之后的并行master更新。\n<!-- ID09-PAGES-RECEIPT-END -->\n'
p=root/'docs/deployment/github-pages.md';s=p.read_text(encoding='utf8')
if marker not in s:p.write_text(s+block,encoding='utf8')
p=root/'.agent/semester-03/id-09/acceptance.md';s=p.read_text(encoding='utf8')
if sha not in s:s+=f'\n用户后续明确授权Pages发布：gh-pages `{sha}`，Actions与公网复核通过，见docs/deployment/id09-release.md及pages-release/public-validation.json；未自动发布其它后续课程。\n';p.write_text(s,encoding='utf8')
env={**os.environ,'GIT_INDEX_FILE':str(root/'.git/id09-pages-receipt.index')}
def git(*args,data=None):return subprocess.check_output(['git',*args],cwd=root,env=env,input=data)
for attempt in range(4):
 base=git('rev-parse','HEAD').decode().strip();runtime=Path('D:/Workspace/control-universe-rank3-id09')
 tar=runtime/'receipt-snapshot.tar';subprocess.run(['git','archive',base,'--format=tar','-o',str(tar)],cwd=root,check=True);subprocess.run(['tar','-xf',str(tar),'-C',str(runtime)],check=True);tar.unlink()
 with (e/'receipt-check.log').open('wb') as out:r=subprocess.run(['npm.cmd','run','check'],cwd=runtime,env={**os.environ,'GIT_DIR':str(root/'.git')},stdout=out,stderr=subprocess.STDOUT)
 assert r.returncode==0,'Latest committed master checker failed; receipt not committed'
 (e/'receipt-check.json').write_text(json.dumps(dict(base=base,command=['npm','run','check'],exitCode=r.returncode),indent=2))
 if git('rev-parse','HEAD').decode().strip()!=base:continue
 git('read-tree',base)
 files=[p.relative_to(root).as_posix() for p in e.rglob('*') if p.is_file() and p.name!='receipt-commit.txt']+[doc.as_posix(),'.agent/semester-03/id-09/acceptance.md']+['.agent/semester-03/id-09/'+n for n in ['browser-public.json','desktop-public.png','mobile-public.png','diagram-public.png','controls-public.png']]
 git('add','-f','--',*files)
 name='docs/deployment/github-pages.md';head=git('show',base+':'+name).decode();assert marker not in head;blob=git('hash-object','-w','--stdin',data=(head+block).encode()).decode().strip();git('update-index','--cacheinfo','100644',blob,name)
 paths=git('diff','--cached','--name-only',base).decode().splitlines();assert set(paths)<=set(files+[name]);subprocess.run(['git','diff','--cached','--check','--','.',':(exclude)*.log'],cwd=root,env=env,check=True)
 tree=git('write-tree').decode().strip();commit=git('commit-tree',tree,'-p',base,'-m','docs: record authorized ID-09 Pages deployment and public verification').decode().strip()
 r=subprocess.run(['git','update-ref','refs/heads/master',commit,base],cwd=root,env=env,capture_output=True)
 if r.returncode:continue
 (e/'receipt-commit.txt').write_text(commit+'\n');print(commit);break
else:raise RuntimeError('Concurrent HEAD kept advancing; preserved it without force')
