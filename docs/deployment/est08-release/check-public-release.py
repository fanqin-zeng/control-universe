from pathlib import Path
import json,urllib.request
root=Path.cwd();d=root/'docs/deployment/est08-release';target=json.loads((d/'target.json').read_text(encoding='utf8'));expected=json.loads((d/'merge.json').read_text(encoding='utf8'))['release']
op=urllib.request.build_opener(urllib.request.ProxyHandler({}))
try:
 req=urllib.request.Request(target['pagesUrl']+'release.json',headers={'Cache-Control':'no-cache','User-Agent':'control-universe-public-release-check'})
 with op.open(req,timeout=30) as r:release=json.load(r)
except Exception as e:print(type(e).__name__,str(e));raise SystemExit(0)
matched=release.get('sourceCommit')==expected and release.get('sourceDirty') is False
print(json.dumps(dict(matched=matched,publicCommit=release.get('sourceCommit'),expected=expected),indent=2))
if matched:(d/'public-release.json').write_text(json.dumps(release,indent=2),encoding='utf8')
