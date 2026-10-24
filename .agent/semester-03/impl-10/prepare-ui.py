from pathlib import Path
import sys,shutil
root=Path(__file__).resolve().parents[3];snap=root.parent/'control-universe-rank1-impl10-validation'
pages='--pages' in sys.argv
path=snap/('out' if pages else 'public')/'impl10-narrow.html'
prefix='/control-universe' if pages else ''
path.write_text('''<!doctype html><html><meta charset="utf-8"><title>IMPL10 360px viewport</title><body style="margin:0;background:#eef2f7"><button id="measure">测量课程布局</button><pre id="result"></pre><iframe title="360px课程验收" style="display:block;width:360px;height:812px;border:0" src="'''+prefix+'''/implementation/implementation-case-study/#默认结果先对账"></iframe><script>document.querySelector('#measure').onclick=()=>{const d=document.querySelector('iframe').contentDocument;const w=d.defaultView;document.querySelector('#result').textContent=JSON.stringify({width:w.innerWidth,scroll:d.documentElement.scrollWidth,canvas:[...d.querySelectorAll('canvas')].map(c=>c.getBoundingClientRect().width),table:d.querySelector('[aria-label="实现回归表"] table').getBoundingClientRect().width,container:d.querySelector('[aria-label="实现回归表"]').getBoundingClientRect().width});d.querySelector('[aria-label="控制实现回归"]').scrollIntoView();};</script></body></html>''',encoding='utf-8')
if not pages:shutil.copy2(root/'content/implementation/implementation-case-study.mdx',snap/'content/implementation/implementation-case-study.mdx')
print(path)
