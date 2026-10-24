from pathlib import Path
import json,math,re,hashlib
E=Path(__file__).resolve().parent;R=E.parents[2]
load=lambda p:json.loads((E/p).read_text(encoding="utf-8-sig"))
rec=load("reconciliation.json");ref=load("reference.json");count=0

def same(a,b,tol=1e-10):
 global count
 if isinstance(b,dict):
  for k,v in b.items():same(a[k],v,tol)
 elif isinstance(b,list):
  assert len(a)==len(b),(len(a),len(b))
  for x,y in zip(a,b):same(x,y,tol)
 elif isinstance(b,(int,float)):
  assert math.isclose(a,b,rel_tol=tol,abs_tol=tol),(a,b);count+=1
 else:assert a==b,(a,b)
def summary(q):return {k:v for k,v in q.items() if k!="points"}
expect=[rec["values"][0],dict(default=summary(rec["values"][1]["default"]),table=[summary(q) for q in rec["values"][1]["results"]]),rec["values"][2]]
source=(R/"content/implementation/networked-control.mdx").read_text(encoding="utf-8").replace("\r\n","\n")
assert hashlib.sha256(source.encode()).hexdigest()==rec["sourceHash"]
for route in ["native","pages"]:
 d=load("ui-"+route+".json");assert len(d["h1"])==1 and len(d["h2"])==10 and d["katex"]==0 and not d["errors"]
 assert len(set(d["ids"]))==len(d["ids"])
 assert [v["id"] for v in d["h2"]]==[v["id"] for v in rec["rendered"]["h2"]]
 from urllib.parse import unquote
 for href in d["anchors"]:
  if href.startswith("#"):assert unquote(href[1:]) in d["ids"],href
 assert len(d["outputs"])==3 and d["canvases"]==2
 for a,b in zip(d["outputs"],expect):same(json.loads(a),b)
 assert len(d["images"])==4 and all(q["loaded"] for q in d["images"])
 assert d["scrollWidth"]==d["width"] and d["articleWidth"]>500
 for row in d["table"]:
  mode={"即时":"clean","恒一拍时延":"delay","交替时延与乱序":"reorder","连续丢三包":"burst"}[row[0]]
  q=next(q for q in ref["cases"] if q["K"]==4 and q["mode"]==mode and q["policy"]==row[1])
  for val,key in zip(row[2:],["final","peak","maxAge","rejected"]):same(float(val),q[key],1e-6)
 n=load("ui-narrow-"+route+".json");assert n["width"]==n["scroll"]==360;assert len(n["canvas"])==2 and all(200<v<360 for v in n["canvas"]);assert n["table"]>n["container"] and n["container"]<360
py=load("pyodide.json");lesson=py["lessons"][0];assert lesson["sourceHash"]==rec["sourceHash"] and len(lesson["notebooks"])==3
for i,nb in enumerate(lesson["notebooks"]):
 assert nb["status"]=="passed" and len(nb["cells"])==2
 out=nb["cells"][0]["outputs"];text="".join(q.get("text","") for q in out if q["type"]=="stream")
 same(json.loads(text),expect[i]);assert all(c["status"]=="passed" for c in nb["cells"])
for case in load("ui-interactions.json"):
 q=next(q for q in ref["cases"] if all(q[k]==case[k] for k in ["K","mode","policy"]))
 vals=re.findall(r"=(-?[0-9.]+(?:e[+-]?[0-9]+)?)",case["metrics"])
 assert len(vals)==6
 wanted=[q["final"],q["peak"],q["maxAge"],q["rejected"],1.1-.1*q["K"],ref["roots"][str(q["K"])]["rho"]]
 for a,b in zip(vals,wanted):same(float(a),b,1e-6)
assert all(x["exit"]==0 for x in load("build-results.json"))
assert load("build-origin.json")["sourceHash"]==rec["sourceHash"]
result=dict(pass_=True,sourceHash=rec["sourceHash"],browserQuantities=count,tsQuantities=rec["tsQuantities"],totalNumeric=rec["quantities"],configs=rec["configs"],maxAbsoluteError=rec["maxError"],tolerance="1e-10*(1+abs(reference)); UI displayed 1e-6",staticPreview="http://127.0.0.1:9196/control-universe/implementation/networked-control/")
result["pass"]=result.pop("pass_");(E/"validation.json").write_text(json.dumps(result,indent=2)+"\n")
print(json.dumps(result))
