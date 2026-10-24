"""Fraction frame propagator oracle, separate from the TS substep loop."""
from pathlib import Path
from fractions import Fraction as F
import math,json
E=Path(__file__).resolve().parent

def experiment(steps=10,mode="clean",policy="zero3",costMs=4):
 factor=(F(1)-F(1,25*steps))**steps
 x=F(0);exact=0.;u=F(0);pending=None;failures=0;points=[];jobs=[]
 for k in range(100):
  if pending is not None:
   if pending[0]:u=pending[1];failures=0
   else:failures+=1
  active=policy=="zero3" and failures>=3
  if active:u=F(0)
  points.append(dict(k=k,x=float(x),exact=exact,u=float(u),failures=failures,zero=active))
  command=min(F(2),max(F(0),2*(1-x)))
  cost=costMs if mode=="clean" else 20 if mode=="edge" else 25 if mode=="overload" or 20<=k<=29 else 4
  onTime=cost<=20;pending=(onTime,command)
  jobs.append(dict(k=k,command=float(command),costMs=cost,onTime=onTime,deadlineMs=(k+1)*20,completeMs=k*20+cost))
  x=factor*x+(1-factor)*u;exact=math.exp(-.04)*exact+(1-math.exp(-.04))*float(u)
 points.append(dict(k=100,x=float(x),exact=exact))
 return dict(steps=steps,mode=mode,policy=policy,costMs=costMs,points=points,jobs=jobs,final=float(x),iae=float(sum(abs(F(1)-F(str(q["x"]))) for q in points[:-1])*F(1,50)),maxError=max(abs(q["x"]-q["exact"]) for q in points),misses=sum(not q["onTime"] for q in jobs),zeroFrames=sum(q["zero"] for q in points[:-1]))
cases=[experiment(s,m,p) for s in [1,2,5,10,20] for m in ["clean","edge","burst","overload"] for p in ["hold","zero3"]]+[experiment(10,"clean",p,c) for p in ["hold","zero3"] for c in [1,20,21,30]]
report=dict(cases=cases,default=experiment(),table=[{k:v for k,v in experiment(10,m,p).items() if k not in ["points","jobs"]} for m in ["clean","edge","burst","overload"] for p in ["hold","zero3"]],bounds=[{k:v for k,v in experiment(s).items() if k not in ["points","jobs"]} for s in [1,2,5,10,20]])
(E/"reference.json").write_text(json.dumps(report,indent=2)+"\n")
print(json.dumps(dict(default={k:v for k,v in report["default"].items() if k not in ["points","jobs"]},first=report["default"]["points"][:3],table=report["table"],bounds=report["bounds"])))
