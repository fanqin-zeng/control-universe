from pathlib import Path
import re,json,hashlib
R=Path(__file__).resolve().parents[3];E=Path(__file__).resolve().parent;S=R.parent/"control-universe-rank1-impl10-validation"
html=S/"out/implementation/implementation-case-study.html"
if not html.exists():html=S/"out/implementation/implementation-case-study/index.html"
s=html.read_text(encoding="utf-8");links=re.findall(r'<link[^>]*href="([^"]+\.css[^"]*)"',s);css=[]
for link in links:
 p=S/"out"/link.split("/control-universe/")[-1].split("?")[0];assert p.exists() and p.stat().st_size
 css.append(dict(href=link,bytes=p.stat().st_size,prose=".prose" in p.read_text(encoding="utf-8")))
assert any(q["prose"] for q in css)
report=dict(css=css,postcssHash=hashlib.sha256((S/"postcss.config.mjs").read_bytes()).hexdigest(),sameConfig=(S/"postcss.config.mjs").read_bytes()==(R/"postcss.config.mjs").read_bytes())
(E/"css-artifacts.json").write_text(json.dumps(report,indent=2)+"\n")
assert "implementation-case-explorer.tsx" not in (E/"build.log").read_text(encoding="utf-8"),"Own hook warnings remain"
print(json.dumps(report))
