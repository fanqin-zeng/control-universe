"""Independent oracle: adaptive quadrature + DOP853 held-input propagation.
Does not import the lesson implementation or its notebook helper.
"""
import json, math
from pathlib import Path
import numpy as np
from scipy.integrate import quad, solve_ivp

here=Path(__file__).parent
actual=json.loads((here/'actual-ts.json').read_text(encoding='utf8'))

def oracle(e,de,n,design,mode='PD'):
    centres=np.linspace(-1,1,n); h=(centres[1]-centres[0])*(.5 if design=='legacy' else 1)
    def memberships(x):
        v=np.maximum(0,1-abs(x-centres)/h)
        if x<=-1: v[0]=1
        if x>=1: v[-1]=1
        return v
    firing=np.minimum(memberships(e)[:,None],memberships(de)[None,:])
    heights=np.zeros(n)
    for i,j in np.argwhere(firing>0):
        index=i if mode=='P' else j if mode=='D' else max(0,min(n-1,int(i+j-(n-1)//2))) if design=='repaired' else round(float(i+j)/2)
        heights[index]=max(heights[index],firing[i,j])
    active=np.flatnonzero(heights>0)
    if not len(active): return 0.,0.
    points={-1.,1.}
    for k in active:
        points.update(float(x) for x in [centres[k]-h,centres[k],centres[k]+h,centres[k]-h*(1-heights[k]),centres[k]+h*(1-heights[k])] if -1<x<1)
    # Equal-width opposing triangle slopes meet at a centre midpoint. Supplying
    # these known kinks prevents adaptive quadrature from skipping tiny slivers.
    points.update(float((centres[i]+centres[j])/2) for i in active for j in active if i<j)
    for k in active:
        for level in heights[active]:
            points.update(float(x) for x in [centres[k]-h*(1-level),centres[k]+h*(1-level)] if -1<x<1)
    def envelope(y): return float(np.max(np.minimum(heights,memberships(y))))
    kwargs=dict(points=sorted(points)[1:-1],epsabs=1e-10,epsrel=1e-10,limit=150)
    area=quad(envelope,-1,1,**kwargs)[0]
    moment=quad(lambda y:y*envelope(y),-1,1,**kwargs)[0]
    return moment/area if area>1e-14 else 0.,area

rows=[]
for case in actual['static']:
    value,area=oracle(**case['input'])
    rows.append(dict(input=case['input'],value=value,area=area,error=abs(value-case['result']['value']),areaError=abs(area-case['result']['area'])))
print('largest quadrature disagreements=',sorted(rows,key=lambda x:x['error'],reverse=True)[:4],flush=True)
assert max(x['error'] for x in rows)<2e-8
assert max(x['areaError'] for x in rows)<2e-8

dynamic=[]
for case in actual['dynamics']:
    p=case['params']; s=case['scenario']; dt=s.get('dt',.002); T=s.get('T',6)
    state=np.array([math.radians(s.get('angle',20)),s.get('omega',0.)]); theta=[state[0]]; commands=[]
    for _ in range(round(T/dt)):
        v,_=oracle(-state[0]*p['Ge'],-state[1]*p['Gce'],p['n'],p['design'],p.get('mode','PD'))
        torque=np.clip(p['Gu']*v,-15,15)
        gravity=s.get('gravity',19.6); load=s.get('disturbance',0.)
        result=solve_ivp(lambda t,x:[x[1],gravity*np.sin(x[0])+4*(torque+load)],(0,dt),state,method='DOP853',rtol=1e-11,atol=1e-13)
        state=result.y[:,-1];theta.append(state[0]);commands.append(float(torque))
    theta=np.rad2deg(theta); commands=np.array(commands)
    metrics=dict(rms=float(np.sqrt(np.mean(theta**2))),final=float(theta[-1]),tail=float(np.max(abs(theta[round(max(0,T-1)/dt):]))),tv=float(np.sum(abs(np.diff(commands)))),maxU=float(np.max(abs(commands))))
    errors={k:abs(v-case['result'][k]) for k,v in metrics.items()}
    # Legacy discontinuities can change switching sequence. Only continuous repaired
    # designs are used for this independent dynamics certificate.
    assert max(errors.values())<2e-5,errors
    dynamic.append(dict(params=p,scenario=s,metrics=metrics,errors=errors))
out=dict(method='SciPy quad + per-hold DOP853, independent from production/helper',static=rows,dynamics=dynamic)
(here/'reference.json').write_text(json.dumps(out,indent=2),encoding='utf8')
print(json.dumps(dict(points=len(rows),maxError=max(x['error'] for x in rows),maxAreaError=max(x['areaError'] for x in rows),dynamics=dynamic),indent=2))
