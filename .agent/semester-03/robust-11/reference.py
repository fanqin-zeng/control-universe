from pathlib import Path
import json,sys
import numpy as np,scipy,sympy as sp,control as ctrl
from scipy.linalg import expm
from scipy.signal import residue
E=Path('.agent/semester-03/robust-11');data=json.loads((E/'actual-ts.json').read_text(encoding='utf8'))
err=0.;coarse=0.;fine=0.;lft_error=0.
def A(m,k,q):
    return np.array([[0,0,1,0],[0,0,0,1],[-k,k-q,-.7,.5],[k/m,-k/m,.5/m,-.5/m]])
for case in data['cases']:
    p=case['p'];m,k,q=p['m'],p['k'],p['q'];aa=A(m,k,q)
    alpha=max(np.linalg.eigvals(aa).real)
    assert (alpha < -1e-9)==case['r']['stable']
    for f in case['frequency']:
        w=f['w'];z=1j*w
        t=np.linalg.solve(z*np.eye(4)-aa,[0,0,q,0])[1]
        for key,ref in [('T',abs(t)),('S',abs(1-t)),('KS',q*abs(1-t))]:err=max(err,abs(f[key]-ref));assert abs(f[key]-ref)<1e-9
for tr in data['traces']:
    m,k,q=(tr['p'][key] for key in ['m','k','q']);aa=A(m,k,q);equilibrium=np.linalg.solve(aa,-np.array([0,0,q,0]))
    for mode in ['coarse','fine']:
        v=tr[mode];dt=v['time'][1]-v['time'][0];F=expm(aa*dt);z=-equilibrium.copy();worst=0.;scale=max(1,max(abs(a) for a in v['y']),max(abs(a) for a in v['force']))
        for i,t in enumerate(v['time']):
            y=(z+equilibrium)[1];worst=max(worst,abs(y-v['y'][i])/scale,abs(q*(1-y)-v['force'][i])/scale);z=F@z
        if mode=='coarse':coarse=max(coarse,worst)
        else:fine=max(fine,worst)
        assert worst < 1e-5,(mode,tr['p'],worst)
# Independent uncertainty port closure through dynamic stiffness inverse.
rng=np.random.default_rng(9011)
for i in range(500):
    dm,dk=rng.uniform(-1,1,2);z=.1+1j*10**rng.uniform(-2,2)
    H=np.linalg.inv([[z*z+.7*z+10,-(.5*z+10)],[-(.5*z+10),.5*z*z+.5*z+10]])
    gu=np.array([[0,.5*z*z],[10,-10],[0,1]])@H@np.array([[0,-.2,1],[-.4,.2,0]])
    delta=np.diag([dm,dk]);closed=gu[2,2]+gu[2,:2]@delta@np.linalg.solve(np.eye(2)-gu[:2,:2]@delta,gu[:2,2])
    m=.5*(1+.4*dm);k=10*(1+.2*dk)
    physical=np.linalg.solve([[z*z+.7*z+k,-(.5*z+k)],[-(.5*z+k),m*z*z+.5*z+k]],[1,0])[1]
    lft_error=max(lft_error,abs(closed-physical)/max(1,abs(physical)))
assert lft_error<1e-9
# Symbolic physical determinant and positive coefficient certificate.
m,k,s,u,v=sp.symbols('m k s u v');mat=sp.Matrix([[s*s+sp.Rational(7,10)*s+k,-(s/2+k)],[-(s/2+k),m*s*s+s/2+k]])
assert sp.expand(mat.det()-(m*s**4+(sp.Rational(1,2)+sp.Rational(7,10)*m)*s**3+((1+m)*k+sp.Rational(1,10))*s*s+k*s/5))==0
a3=sp.Rational(1,2)+sp.Rational(7,10)*m;a2=(1+m)*k+sp.Rational(1,10);a1=k/5+sp.Rational(1,2)
proof={}
for key,expr in [('d2',a3*a2-m*a1),('d3',(a3*a2-m*a1)*a1-a3*a3*k)]:
    poly=sp.Poly(sp.expand(expr.subs({m:sp.Rational(3,10)+u,k:8+v})),u,v);assert all(c>0 for c in poly.coeffs());proof[key]={'expression':str(poly.as_expr()),'lower':float(poly.eval({u:0,v:0}))}
# Sample metrics from independent physical eigenvector solution, no notebook helper.
rng=np.random.default_rng(42);draws=rng.uniform(-1,1,(1000,2));t=np.linspace(0,120,3001);metrics=[]
for dm,dk in draws:
    aa=A(.5*(1+.4*dm),10*(1+.2*dk),1);poles,V=np.linalg.eig(aa);assert max(poles.real)<0
    equilibrium=np.array([1,1,0,0]);amplitudes=V[1,:]*np.linalg.solve(V,-equilibrium)
    y=1+np.real(amplitudes@np.exp(poles[:,None]*t));force=1-y;bad=np.flatnonzero(abs(y-1)>.02)
    metrics.append([max(0,y.max()-1),max(abs(force)),np.nan if len(bad) and bad[-1]==len(t)-1 else t[bad[-1]+1] if len(bad) else 0])
v=np.array(metrics);samples={'N':1000,'stable':1000,'overshootMinMeanMaxP95':[float(v[:,0].min()),float(v[:,0].mean()),float(v[:,0].max()),float(np.percentile(v[:,0],95))],'forceMinMax':[float(v[:,1].min()),float(v[:,1].max())],'settlingMax':float(np.nanmax(v[:,2])),'unsettled':int(np.isnan(v[:,2]).sum())}
result={'pass':True,'scalarError':err,'traceCoarseNormalizedError':coarse,'traceFineNormalizedError':fine,'lft500Error':lft_error,'proof':proof,'samples':samples}
(E/'reconciliation.json').write_text(json.dumps(result,indent=2,allow_nan=False),encoding='utf8');(E/'runtime-versions.json').write_text(json.dumps({'python':sys.version,'numpy':np.__version__,'scipy':scipy.__version__,'control':ctrl.__version__,'sympy':sp.__version__},indent=2),encoding='utf8');print(json.dumps(result,indent=2))
