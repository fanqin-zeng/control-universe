"""Independent original-QP numerical solve and rational whole-region certificates."""
from pathlib import Path
from fractions import Fraction as Q
from itertools import combinations
import json,math,contextlib,io
from scipy.optimize import minimize_scalar
base=Path('.agent/semester-03/mpc-07');data=json.loads((base/'ts-cases.json').read_text(encoding='utf8'))
G=[1,-1,1,-1];w=[1,1,2,2];S=[(0,0),(0,0),(-1,0),(1,0)];F=[2,-2]
box=[(Q(1),Q(0),Q(3)),(Q(-1),Q(0),Q(3)),(Q(0),Q(1),Q(3)),(Q(0),Q(-1),Q(3))]
def vertices(h):
    out=set()
    for a,b in combinations(h,2):
        det=a[0]*b[1]-a[1]*b[0]
        if not det:continue
        x=(a[2]*b[1]-a[1]*b[2])/det;r=(a[0]*b[2]-a[2]*b[0])/det
        if all(c[0]*x+c[1]*r<=c[2] for c in h):out.add((x,r))
    if not out:return []
    cx=sum(v[0] for v in out)/len(out);cy=sum(v[1] for v in out)/len(out)
    return sorted(out,key=lambda v:math.atan2(float(v[1]-cy),float(v[0]-cx)))
def area(v):return abs(sum(v[i][0]*v[(i+1)%len(v)][1]-v[i][1]*v[(i+1)%len(v)][0] for i in range(len(v)))/2) if v else Q(0)
proof=[];areas=[];polys=[]
for index,p in enumerate(data['regions']):
    active=index-1
    if index==0:K=[Q(-f,4) for f in F];c=Q(0);L=[Q(0),Q(0)];d=Q(0)
    else:
        K=[Q(s,G[active]) for s in S[active]];c=Q(w[active],G[active]);L=[-(4*K[j]+F[j])/G[active] for j in range(2)];d=-4*c/G[active]
    assert K==list(map(Q,p['gain'])) and c==Q(p['offset'])
    # Derive complete primal and dual critical region directly from original constraints.
    h=box+[(G[i]*K[0]-S[i][0],G[i]*K[1]-S[i][1],Q(w[i])-G[i]*c) for i in range(4)]
    if index:h.append((-L[0],-L[1],d))
    v=vertices(h);pv=[tuple(map(Q,xy)) for xy in p['polygon']]
    assert set(v)==set(pv),(p['id'],v,pv)
    actual=box+[tuple(map(Q,[*a,b])) for a,b in zip(p['A'],p['b'])]
    assert set(vertices(actual))==set(v)
    for x,r in v:
        u=K[0]*x+K[1]*r+c;lam=L[0]*x+L[1]*r+d if index else Q(0)
        assert lam>=0 and all(G[i]*u<=w[i]+S[i][0]*x+S[i][1]*r for i in range(4))
        assert 4*u+F[0]*x+F[1]*r+(G[active]*lam if index else 0)==0
        if index:assert G[active]*u==w[active]+S[active][0]*x+S[active][1]*r
    polys.append((h,K,c));areas.append(area(v));proof.append({'region':p['id'],'vertices':len(v),'area':str(area(v))})
shared=0
for a,b in combinations(polys,2):
    v=vertices(a[0]+b[0]);assert area(v)==0
    for x,r in v:assert a[1][0]*x+a[1][1]*r+a[2]==b[1][0]*x+b[1][1]*r+b[2];shared+=1
assert sum(areas)==36
# Interval projection proves total coverage including edges; rational certificate verifies every full polytope.
maxu=maxcost=maxres=0.;inside=outside=0
def original(x,r):
    lo=max(-1.,-2.-x);hi=min(1.,2.-x)
    if lo>hi:return None
    f=lambda u:(x+u-r)**2+u*u
    if lo==hi:u=lo
    else:
        result=minimize_scalar(f,bounds=(lo,hi),method='bounded',options={'xatol':1e-12});assert result.success
        u=min([lo,hi,result.x],key=f)
    return u,f(u)
for case in data['cases']:
    x,r=case['x'],case['r'];v=case['lookup'];q=original(x,r)
    assert case['qp']['feasible']==(q is not None)
    if q is not None:
        assert abs(case['qp']['u']-q[0])<1e-7 and abs(case['qp']['cost']-q[1])<1e-7
    if abs(x)>3 or abs(r)>3:assert not v['inDomain'];outside+=1;continue
    inside+=1;assert v['inDomain'] and v['found'] and q is not None
    du=abs(v['u']-q[0]);dc=abs(v['cost']-q[1]);maxu=max(maxu,du);maxcost=max(maxcost,dc);maxres=max(maxres,v['residual'])
    assert du<1e-7 and dc<1e-7 and v['residual']<1e-9,(case,du,dc)
    sl=[w[i]+S[i][0]*x+S[i][1]*r-G[i]*v['u'] for i in range(4)]
    lm=v['lambda'];independent_res=max(0,*[-z for z in sl],*[-z for z in lm],abs(4*v['u']+2*(x-r)+sum(G[i]*lm[i] for i in range(4))),*[abs(sl[i]*lm[i]) for i in range(4)])
    assert independent_res<1e-9 and abs(independent_res-v['residual'])<1e-12
loose=data['loose'];assert loose['region']=='R0' and abs(loose['u']+1.005)<1e-12 and abs(loose['violation']-.005)<1e-12
raw=json.loads((base/'extracted.json').read_text(encoding='utf8'));captured=io.StringIO();cells=0
with contextlib.redirect_stdout(captured):
    for nb in raw['notebooks']:
        ns={};exec(nb['setupCode'],ns)
        for cell in nb['cells']:exec(cell['code'],ns);cells+=1
        if 'closed' in ns:
            for loop in ns['closed']:
                for x,u in zip(loop['x'][:-1],loop['u']):
                    # Analytic stationary point projected on ORIGINAL interval, independently of table.
                    exact=max(-1,-2-x,min(1,2-x,(loop['ref']-x)/2))
                    assert abs(u-exact)<1e-9
(base/'raw-cells.log').write_text(captured.getvalue(),encoding='utf8')
report={'pass':True,'cases':len(data['cases']),'inside':inside,'outside':outside,'regions':proof,'area':'36','sharedVertexChecks':shared,'maxActionError':maxu,'maxCostError':maxcost,'maxKktResidual':maxres,'rawCellsExecuted':cells,'looseViolation':loose['violation'],'invalidRejected':data['invalidRejected']}
(base/'numeric.json').write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report,indent=2))

