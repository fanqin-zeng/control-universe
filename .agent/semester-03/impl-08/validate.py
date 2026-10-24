from pathlib import Path
import json,math,re,hashlib,contextlib,io,runpy
E=Path(__file__).resolve().parent;R=E.parents[2]
load=lambda f:json.loads((E/f).read_text(encoding="utf-8-sig"))
rec=load("reconciliation.json");ref=load("reference.json");count=0
with contextlib.redirect_stdout(io.StringIO()):oracle=runpy.run_path(str(E/"reference.py"))
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
expect=[rec["values"][0],{k:v for k,v in rec["values"][1].items() if k!="cases"},rec["values"][2]]
source=(R/"content/implementation/industrial-bus-protocols.mdx").read_text(encoding="utf-8").replace("\r\n","\n")
assert hashlib.sha256(source.encode()).hexdigest()==rec["sourceHash"]
for route in ["native","pages"]:
 d=load("ui-"+route+".json");assert len(d["h1"])==1 and len(d["h2"])==10 and d["katex"]==0 and not d["errors"]
 assert len(set(d["ids"]))==len(d["ids"])
 assert [q["id"] for q in d["h2"]]==[q["id"] for q in rec["rendered"]["h2"]]
 from urllib.parse import unquote,urlparse
 for href in d["anchors"]:
  if href.startswith("#") or "/implementation/industrial-bus-protocols" in urlparse(href).path:assert unquote(urlparse(href).fragment) in d["ids"],href
 assert len(d["outputs"])==3 and d["canvases"]==2
 for a,b in zip(d["outputs"],expect):same(json.loads(a),b)
 assert len(d["images"])==4 and all(q["loaded"] for q in d["images"])
 assert d["scrollWidth"]==d["width"] and d["articleWidth"]>500
 for row in d["table"]:
  q=next(q for q in ref["cases"] if q["baud"]==int(row[0]) and q["registers"]==2 and q["stations"]==1 and q["period"]==20)
  for val,key in zip(row[1:4],["slotMs","cycleMs","marginMs"]):same(float(val),q[key],1e-6)
  assert (row[4]=="是")==q["fits"]
 assert d["request"].split("：")[1]==" ".join(f"{b:02X}" for b in ref["request"])
 assert d["response"].split("：")[1]==" ".join(f"{b:02X}" for b in ref["response"])
 assert d["decode"]=="接受；寄存器=4660 / 65436；温度=-10 °C"
 n=load("ui-narrow-"+route+".json");assert n["width"]==n["scroll"]==360;assert len(n["canvas"])==2 and all(200<v<360 for v in n["canvas"]);assert n["table"]>n["container"] and n["container"]<360
py=load("pyodide.json");lesson=py["lessons"][0];assert lesson["sourceHash"]==rec["sourceHash"] and len(lesson["notebooks"])==3
for i,nb in enumerate(lesson["notebooks"]):
 assert nb["status"]=="passed" and len(nb["cells"])==2
 out=nb["cells"][0]["outputs"];text="".join(q.get("text","") for q in out if q["type"]=="stream")
 same(json.loads(text),expect[i]);assert all(c["status"]=="passed" for c in nb["cells"])
for case in load("ui-interactions.json"):
 q=next(q for q in ref["cases"] if all(q[k]==case[k] for k in ["baud","registers","stations","period"]))
 vals=re.findall(r"=(-?[0-9.]+)",case["metrics"]);assert len(vals)==8
 for a,key in zip(vals,["charMs","gapMs","requestBytes","responseBytes","slotMs","cycleMs","marginMs","ratio"]):same(float(a),q[key],1e-6)
 assert ("可容纳" in case["status"])==q["fits"]
 request=[int(x,16) for x in case["request"].split("：")[1].split()];response=[int(x,16) for x in case["response"].split("：")[1].split()]
 assert oracle["crc"](request)==0 and request[:6]==[1,3,0,0,0,case["registers"]]
 assert (oracle["crc"](response)!=0)==case["corrupt"]
 if case["corrupt"]:assert case["decode"]=="拒收（crc），不更新工程量。"
 else:assert "接受" in case["decode"] and ("未读取第二寄存器" in case["decode"] if case["registers"]==1 else "-10 °C" in case["decode"])
assert all(q["exit"]==0 for q in load("build-results.json"));assert load("build-origin.json")["sourceHash"]==rec["sourceHash"]
origin=load("build-origin.json")
for key,rel in [("componentHash","components/wiki/industrial-serial-explorer.tsx"),("calculationHash","lib/industrial-serial.ts")]:assert origin[key]==hashlib.sha256((R/rel).read_text(encoding="utf-8").replace("\r\n","\n").encode()).hexdigest()
assert load("css-artifacts.json")["sameConfig"]
assert any(q["prose"] for q in load("css-artifacts.json")["css"])
assert load("pages-console.json")["errors"]==[]
result=dict(sourceHash=rec["sourceHash"],browserQuantities=count,tsQuantities=rec["tsQuantities"],totalNumeric=rec["quantities"],configs=rec["configs"],maxAbsoluteError=rec["maxError"],tolerance="raw 1e-10 ms; UI 1e-6; integer/CRC exact",staticPreview="http://127.0.0.1:9197/control-universe/implementation/industrial-bus-protocols/")
result["pass"]=True;(E/"validation.json").write_text(json.dumps(result,indent=2)+"\n");print(json.dumps(result))
