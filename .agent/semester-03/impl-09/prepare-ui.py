from pathlib import Path
import sys,shutil
root=Path(__file__).resolve().parents[3];snap=root.parent/'control-universe-rank1-impl09-validation'
pages='--pages' in sys.argv
path=snap/('out' if pages else 'public')/'impl09-narrow.html'
prefix='/control-universe' if pages else ''
path.write_text('<!doctype html><html><meta charset="utf-8"><title>IMPL09 375px viewport</title><body style="margin:0;background:#eef2f7"><iframe title="375px课程验收" style="width:375px;height:812px;border:0" src="'+prefix+'/implementation/hil-rapid-prototyping/#可运行的虚拟台架"></iframe></body></html>',encoding='utf-8')
if not pages:shutil.copy2(root/'content/implementation/hil-rapid-prototyping.mdx',snap/'content/implementation/hil-rapid-prototyping.mdx')
print(path)
