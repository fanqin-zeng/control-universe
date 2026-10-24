// Run the actual TypeScript model; independent reference uses ODE integration.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync('lib/safety-stopping.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;
const {stoppingBudget}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const cases=[];
for(const v of [0,.1,2,4])for(const delay of [0,.2,1])for(const brake of [.5,1,2,4])for(const gap of [.5,1.5,1.8,6])cases.push({v,delay,brake,gap});
const py=String.raw`import sys,json,math
import numpy as np
from scipy.integrate import solve_ivp
from scipy.linalg import expm
from fractions import Fraction as F
results=[]
for c in json.load(sys.stdin):
    v,delay,a,gap=(c[k] for k in ('v','delay','brake','gap'))
    # Integrate phase states [distance, velocity], terminating brake at rest.
    if v==0:
        stop=0.; end=0.; dense=lambda s: 0.
    else:
        def zero(t,y): return y[1]
        zero.terminal=True
        zero.direction=-1
        sol=solve_ivp(lambda t,y:[y[1],-a],[delay,delay+v/a+1],[v*delay,v],events=zero,rtol=1e-12,atol=1e-13,dense_output=True)
        end=float(sol.t_events[0][0]);stop=float(sol.y_events[0][0][0])
        dense=lambda t:float(sol.sol(t)[0])
    curve=[]
    for t in np.arange(401)/40:
        curve.append(float(v*t if t<=delay else stop if t>=end else dense(t)))
    results.append(dict(distance=stop,stopTime=end,margin=gap-.1-stop,curve=curve))
A=np.array([[0.,1.],[-1.,-2.]])
err=max(abs((expm(A*t)@np.array([0.,3.]))[0]-3*t*math.exp(-t)) for t in np.linspace(0,6,601))
coast=F(3,2)*F(2,5); braking=F(3,2)**2/(2*F(3,2)); available=F(8,5)-F(3,20)
print(json.dumps(dict(cases=results,stableMatrixError=err,poles=np.linalg.eigvals(A).tolist(),peak=3/math.e,exercise=[float(coast),float(braking),float(available),float(coast+braking),float(available-coast-braking)],speedLimits=[-a*.2+math.sqrt((a*.2)**2+2*a*1.7) for a in [2,1]])))`;
const p=spawnSync('python',['-c',py],{input:JSON.stringify(cases),encoding:'utf8',maxBuffer:20*1024*1024});
assert.equal(p.status,0,p.stderr);
const reference=JSON.parse(p.stdout);let maxError=0;
for(let i=0;i<cases.length;i++){
  const c=cases[i],actual=stoppingBudget(c.v,c.delay,c.brake,c.gap),expected=reference.cases[i];
  for(const key of ['distance','stopTime','margin']){const err=Math.abs(actual[key]-expected[key]);assert(err<1e-10,`${i}:${key}:${err}`);maxError=Math.max(maxError,err);}
  actual.curve.forEach(([t,s],j)=>{assert.equal(t,j/40);const err=Math.abs(s-expected.curve[j]);assert(err<1e-10,`${i}:${j}:${err}`);maxError=Math.max(maxError,err);});
}
for(const args of [[-1,0,1,1],[1,-1,1,1],[1,0,0,1],[1,0,1,-1],[NaN,0,1,1],[1,0,1,1,-1]])assert.throws(()=>stoppingBudget(...args),RangeError);
assert(reference.stableMatrixError<1e-12);
const report={cases:cases.length,trajectoryValues:cases.length*401,maxError,stableMatrixError:reference.stableMatrixError,poles:reference.poles,peak:reference.peak,exercise:reference.exercise,speedLimits:reference.speedLimits,default:stoppingBudget(2,.2,2,1.8),zeroSpeedStopTime:stoppingBudget(0,1,.5,.5).stopTime,invalidCases:6};
delete report.default.curve;
const output=resolve(process.argv[2]||'.agent/semester-03/safe-01/numerical.json');mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
