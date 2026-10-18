"""W13指定旧材料审计；不把有限扫频当全局分支认证。"""
import json, hashlib, time
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp
from scipy.optimize import root
started=time.time(); out={'source':'.agent/semester-03/nonlinear-01/source-before.mdx','sourceHash':hashlib.sha256(Path('.agent/semester-03/nonlinear-01/source-before.mdx').read_bytes()).hexdigest(),'sweeps':[]}
def run_sweep(freqs,z0,phase,T,div):
    rows=[]
    for w in freqs:
        P=2*np.pi/w
        def rhs(t,y):return [y[1],-.2*y[1]-y[0]-.5*y[0]**3+1.5*np.cos(w*t+phase)]
        sol=solve_ivp(rhs,[0,T],z0,method='DOP853',rtol=1e-9,atol=1e-11,max_step=P/div,dense_output=True)
        assert sol.success
        tt=np.linspace(T-12*P,T,12*128+1);xx=sol.sol(tt)[0]
        # Exact integer-cycle integration window, actual forcing phase retained.
        fund=2/(12*P)*np.hypot(np.trapezoid(xx*np.cos(w*tt+phase),tt),np.trapezoid(xx*np.sin(w*tt+phase),tt))
        residual=float(np.linalg.norm(sol.sol(T)-sol.sol(T-P)))
        nextphase=float((phase+w*T)%(2*np.pi))
        rows.append({'w':float(w),'fundamental':float(fund),'samplePeak':float(max(abs(xx))),'period1Residual':residual,'endState':sol.y[:,-1].tolist(),'phase':nextphase,'success':bool(sol.success)})
        z0=sol.y[:,-1];phase=nextphase
    return rows,z0,phase
for name,points,T,div in [('baseline',37,120,32),('longer',37,240,32),('halfStep',37,240,64),('finerGrid',73,240,64)]:
    freqs=np.linspace(.8,2.6,points)
    up,z,phase=run_sweep(freqs,np.array([.05,0.]),0.,T,div)
    down,_,_=run_sweep(freqs[::-1],z,phase,T,div)
    def jump(rows):
        j=int(np.argmax(abs(np.diff([a['fundamental'] for a in rows]))));return [rows[j]['w'],rows[j+1]['w']]
    out['sweeps'].append({'name':name,'T':T,'maxStep':'period/'+str(div),'points':points,'up':up,'down':down,'jumpIntervals':{'up':jump(up),'down':jump(down)},'maxPeriod1Residual':max(a['period1Residual'] for a in up+down)})
    Path('.agent/semester-03/nonlinear-12/w13-audit.json').write_text(json.dumps(out,indent=2))
    print(name, out['sweeps'][-1]['jumpIntervals'],flush=True)
out['pendulum']=[]
for tau in [.95,1.,1.05]:
    angles=[] if tau>1 else [np.arcsin(tau)] if tau==1 else [np.arcsin(tau),np.pi-np.arcsin(tau)]
    out['pendulum'].append({'torque':tau,'angles':list(map(float,angles)),'eigenvalues':[[[float(v.real),float(v.imag)] for v in np.roots([1,.2,np.cos(th)])] for th in angles]})
out['seconds']=time.time()-started
out['scope']='Finite directional sweeps, not global attractor/branch completeness. NB9 local friction review is retained in NONLINEAR-02.'
Path('.agent/semester-03/nonlinear-12/w13-audit.json').write_text(json.dumps(out,indent=2));print('DONE',out['seconds'])
