from pathlib import Path
import json,re,hashlib
from urllib.parse import unquote,urlparse
E=Path(__file__).resolve().parent;R=E.parents[2]
load=lambda f:json.loads((E/f).read_text(encoding="utf-8-sig"))
rec=load("reconciliation.json");ref=load("reference.json");count=0

def same(a,b,tol=1e-10):
 global count
 if isinstance(b,dict):
  for k,v in b.items():same(a[k],v,tol)
 elif isinstance(b,list):
  assert len(a)==len(b)
  for x,y in zip(a,b):same(x,y,tol)
 elif isinstance(b,bool):assert a==b
 elif isinstance(b,(int,float)):
  assert abs(a-b)<=tol,(a,b);count+=1
 else:assert a==b,(a,b)
def summary(v):return {k:q for k,q in v.items() if k not in ["points","jobs"]}
expect=[dict(default=summary(rec["values"][0]["default"]),first=rec["values"][0]["first"],equilibrium=rec["values"][0]["equilibrium"]),rec["values"][1]["table"],rec["values"][2]]
source=(R/"content/implementation/hil-rapid-prototyping.mdx").read_text(encoding="utf-8").replace("\r\n","\n")
assert hashlib.sha256(source.encode()).hexdigest()==rec["sourceHash"]
for route in ["native","pages"]:
 d=load("ui-"+route+".json");assert len(d["h1"])==1 and len(d["h2"])==10 and d["katex"]==0 and not d["errors"]
 assert len(set(d["ids"]))==len(d["ids"])
 assert [q["id"] for q in d["h2"]]==[q["id"] for q in rec["rendered"]["h2"]]
 for href in d["anchors"]:
  if href.startswith("#") or "/implementation/hil-rapid-prototyping" in urlparse(href).path:assert unquote(urlparse(href).fragment) in d["ids"],href
 assert len(d["outputs"])==3 and d["canvases"]==2
 for a,b in zip(d["outputs"],expect):same(json.loads(a),b)
 assert len(d["images"])==4 and all(q["loaded"] for q in d["images"])
 assert d["scrollWidth"]==d["width"] and d["articleWidth"]>500
 for row in d["table"]:
  mode={"成本可调":"clean","恰好20ms":"edge","连续10次超期":"burst","全部超期":"overload"}[row[0]]
  q=next(q for q in ref["cases"] if q["mode"]==mode and q["policy"]==row[1] and q["steps"]==10 and q["costMs"]==4)
  for val,key in zip(row[2:],["final","iae","misses","zeroFrames"]):same(float(val),q[key],1e-9)
 n=load("ui-narrow-"+route+".json");assert n["width"]==n["scroll"]==360;assert len(n["canvas"])==2 and all(200<v<360 for v in n["canvas"]);assert n["table"]>n["container"] and n["container"]<360
py=load("pyodide.json");lesson=py["lessons"][0];assert lesson["sourceHash"]==rec["sourceHash"] and len(lesson["notebooks"])==3
for i,nb in enumerate(lesson["notebooks"]):
 assert nb["status"]=="passed" and len(nb["cells"])==2
 out=nb["cells"][0]["outputs"];text="".join(q.get("text","") for q in out if q["type"]=="stream")
 same(json.loads(text),expect[i]);assert all(c["status"]=="passed" for c in nb["cells"])
for case in load("ui-interactions.json"):
 q=next(q for q in ref["cases"] if all(q[k]==case[k] for k in ["steps","mode","policy","costMs"]))
 assert case["costDisabled"]==(case["mode"]!="clean")
 vals=re.findall(r"=(-?[0-9.]+)",case["metrics"]);assert len(vals)==5
 for a,key in zip(vals,["final","iae","maxError","misses","zeroFrames"]):same(float(a),q[key],1e-9)
 vals=re.findall(r"=(-?[0-9.]+)",case["first"]);assert len(vals)==4
 for a,b in zip(vals,[q["points"][0]["u"],q["points"][1]["x"],q["points"][1]["u"],q["points"][2]["x"]]):same(float(a),b,1e-9)
assert all(q["exit"]==0 for q in load("build-results.json"));origin=load("build-origin.json");assert origin["sourceHash"]==rec["sourceHash"]
for key,rel in [("componentHash","components/wiki/hil-rehearsal-explorer.tsx"),("calculationHash","lib/hil-rehearsal.ts")]:assert origin[key]==hashlib.sha256((R/rel).read_text(encoding="utf-8").replace("\r\n","\n").encode()).hexdigest()
assert load("css-artifacts.json")["sameConfig"] and any(q["prose"] for q in load("css-artifacts.json")["css"])
assert load("pages-console.json")["errors"]==[]
result=dict(sourceHash=rec["sourceHash"],browserQuantities=count,tsQuantities=rec["tsQuantities"],totalNumeric=rec["quantities"],configs=rec["configs"],maxAbsoluteError=rec["maxError"],tolerance="raw absolute 1e-10; UI 1e-9; event/boolean exact",staticPreview="http://127.0.0.1:9291/control-universe/implementation/hil-rapid-prototyping/")
result["pass"]=True;(E/"validation.json").write_text(json.dumps(result,indent=2)+"\n");print(json.dumps(result))
