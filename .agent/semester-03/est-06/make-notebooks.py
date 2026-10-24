"""Build original notebook literals from a single reviewed Python experiment contract."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-06'
setup='''import numpy as np
import math, json
from scipy.special import logsumexp
from scipy.integrate import quad
from scipy.signal import fftconvolve

def normalized(logs):
    logs=np.asarray(logs,dtype=float)
    if not np.isfinite(logs).any() or np.isnan(logs).any() or np.isposinf(logs).any():
        raise ValueError("No valid particle likelihood")
    return np.exp(logs-logsumexp(logs))

def stats(x,w):
    m=float(w@x)
    return dict(mean=m,variance=float(w@((x-m)**2)),negative=float(w[x<0].sum()),ess=float(1/(w@w)))

def systematic(w,u0):
    n=len(w)
    assert 0<=u0<1/n
    c=np.cumsum(w);c[-1]=1.
    return np.searchsorted(c,u0+np.arange(n)/n,side="right")

def reference(mu,r,z):
    log=lambda x:-(x-mu)**2/2-(z-x*x)**2/(2*r)
    stationary=sorted(float(t.real) for t in np.roots([2,0,r-2*z,-r*mu]) if abs(t.imag)<1e-9)
    shift=max(log(t) for t in stationary);cuts=[-np.inf]+sorted(set(stationary))+[np.inf]
    def I(n):return sum(quad(lambda x:x**n*math.exp(log(x)-shift),a,b,epsabs=1e-12,epsrel=1e-12)[0] for a,b in zip(cuts,cuts[1:]))
    mass=I(0);m=I(1)/mass
    neg=quad(lambda x:math.exp(log(x)-shift),-np.inf,0,epsabs=1e-12,epsrel=1e-12)[0]/mass
    return dict(mean=m,variance=I(2)/mass-m*m,negative=neg)
'''
c1='''x=np.array([-2.,-1.,1.,2.]);w=normalized(-(4-x*x)**2/2)
print("four_particles_weights",x.tolist(),w.tolist())
print("four_particle_mean_variance_ESS",stats(x,w))
print("likelihood_ratio_inner_to_outer",np.exp(-4.5))
print("four_particle_CDF_at_minus2_minus1_plus1_plus2",np.cumsum(w).tolist())
assert abs(stats(x,w)["variance"]-3.9670391721082203)<1e-12
assert abs(stats(x,w)["ess"]-2.0444305029932996)<1e-12
'''
c2='''a=systematic(w,.125);y=x[a];uniform=np.full(4,.25)
print("systematic_offset_targets_ancestors",.125,(.125+np.arange(4)/4).tolist(),a.tolist())
print("resampled_positions_stats_unique",y.tolist(),stats(y,uniform),len(np.unique(a)))
print("adaptive_condition_ESS_less_N_over_2",stats(x,w)["ess"]<len(x)/2)
print("log_underflow_example",np.exp([-1000.,-1001.]).tolist(),normalized([-1000.,-1001.]).tolist())
bad=np.full(4,2.);bad_w=normalized(-(4-bad*bad)**2/2)
print("missing_negative_branch_ESS_mass",stats(bad,bad_w))
try:normalized([-np.inf,-np.inf])
except ValueError:print("invalid_likelihood_rejected")
else:raise AssertionError("must not fall back to uniform weights")
assert a.tolist()==[0,0,3,3]
assert stats(y,uniform)["variance"]==4 and len(np.unique(a))==2
print("hand_resampling_checks_passed")
'''
c3='''cases=[(0.,.25,4.),(2.,1.,4.),(0.,4.,1.)]
truths={case:reference(*case) for case in cases}
for case,truth in truths.items():print("Gaussian_reference",case,truth)
mc_rows=[]
for case in cases:
    mu,r,z=case;truth=truths[case]
    for n in [64,256,1024]:
        for seed in range(10):
            rng=np.random.default_rng(seed);x=rng.normal(mu,1,n);w=normalized(-(z-x*x)**2/(2*r))
            before=stats(x,w);a=systematic(w,rng.random()/n);after=stats(x[a],np.full(n,1/n))
            mc_rows.append(dict(case=list(case),n=n,seed=seed,meanError=abs(before["mean"]-truth["mean"]),negativeError=abs(before["negative"]-truth["negative"]),afterMeanError=abs(after["mean"]-truth["mean"]),ess=before["ess"],unique=len(np.unique(a))))
assert len(mc_rows)==90
print("multi_seed_count",len(mc_rows),"PCG64_seeds",list(range(10)))
'''
c4='''for case in cases:
    for n in [64,256,1024]:
        rows=[q for q in mc_rows if q["case"]==list(case) and q["n"]==n]
        print("MC_summary_case_N_mean_abs_error_min_median_max",case,n,np.quantile([q["meanError"] for q in rows],[0,.5,1]).tolist(),"negative_mass_error",np.quantile([q["negativeError"] for q in rows],[0,.5,1]).tolist())
print("MC_all_trials_preserved_in_mc_rows",len(mc_rows))
assert all(np.isfinite(q["meanError"]) and 1-1e-10<=q["ess"]<=q["n"]+1e-10 for q in mc_rows)
print("multi_seed_checks_passed")
'''
c5='''observations=np.array([4.,4.41,3.61,4.,4.84]*4)
def grid_filter(size):
    x=np.linspace(-8,8,size);dx=x[1]-x[0]
    p=np.exp(-x*x/2)/np.sqrt(2*np.pi);p/=p.sum()*dx
    kernel=np.exp(-x*x/(2*.04))/np.sqrt(2*np.pi*.04)
    records=[]
    for z in observations:
        p=np.maximum(fftconvolve(p,kernel,mode="same")*dx,0)
        logs=-(z-x*x)**2/(2*.25);p*=np.exp(logs-logs.max());p/=p.sum()*dx
        mean=float((p*x).sum()*dx);variance=float((p*(x-mean)**2).sum()*dx)
        # Half of the x=0 bin belongs to each half-line under symmetric quadrature.
        negative=float(p[x<0].sum()*dx+.5*p[len(x)//2]*dx)
        records.append([mean,variance,negative])
    return np.array(records)
coarse=grid_filter(1001);fine=grid_filter(2001)
grid_difference=float(np.max(abs(coarse-fine)))
print("sequential_grid_steps_max_difference_last",len(observations),grid_difference,fine[-1].tolist())
assert grid_difference<1e-6
assert np.max(abs(fine[:,0]))<1e-10 and np.max(abs(fine[:,2]-.5))<1e-10
'''
c6='''seq_rows=[]
for n in [64,256,1024]:
    for seed in range(10):
        rng=np.random.default_rng(seed);x=rng.normal(0,1,n);w=np.full(n,1/n);history=[];resamples=0;lost=False
        for k,z in enumerate(observations,1):
            x=x+rng.normal(0,.2,n)
            logs=np.full(n,-np.inf);positive=w>0;logs[positive]=np.log(w[positive]);w=normalized(logs-(z-x*x)**2/(2*.25))
            current=stats(x,w);history.append([k,current["mean"],current["variance"],current["negative"],current["ess"]])
            if current["ess"]<n/2:
                a=systematic(w,rng.random()/n);x=x[a];w=np.full(n,1/n);resamples+=1
            lost=lost or bool(np.all(x>=0) or np.all(x<0))
        last=history[-1];seq_rows.append(dict(n=n,seed=seed,mean=last[1],variance=last[2],negative=last[3],ess=last[4],resamples=resamples,lost=lost,history=history))
for n in [64,256,1024]:
    rows=[q for q in seq_rows if q["n"]==n]
    print("sequential_N_negative_mass_min_median_max_lost",n,np.quantile([q["negative"] for q in rows],[0,.5,1]).tolist(),sum(q["lost"] for q in rows))
print("sequential_all_histories_preserved_in_seq_rows",len(seq_rows),len(seq_rows[0]["history"]))
assert len(seq_rows)==30 and all(len(q["history"])==20 for q in seq_rows)
print("sequential_filter_checks_passed")
'''
notebooks=[dict(title='四粒子更新与重采样',setupCode=setup,cells=[dict(code=c1),dict(code=c2)]),dict(title='同模型多种子重要性采样',setupCode=setup,cells=[dict(code=c3),dict(code=c4)]),dict(title='随机游走的逐拍bootstrap滤波',setupCode=setup,cells=[dict(code=c5),dict(code=c6)])]
(folder/'notebook-contract.json').write_text(json.dumps(dict(notebooks=notebooks),ensure_ascii=False,indent=2),encoding='utf8')
outputs=[]
import contextlib,io
for i,nb in enumerate(notebooks):
    ns={};out=io.StringIO()
    with contextlib.redirect_stdout(out):
        exec(nb['setupCode'],ns)
        for c in nb['cells']:exec(c['code'],ns)
    outputs.append(dict(notebook=i,output=out.getvalue()))
    if i==1:(folder/'monte-carlo.json').write_text(json.dumps(ns['mc_rows'],indent=2),encoding='utf8')
    if i==2:(folder/'sequential.json').write_text(json.dumps(dict(gridDifference=ns['grid_difference'],reference=ns['fine'].tolist(),runs=ns['seq_rows']),indent=2),encoding='utf8')
(folder/'minimal-notebook-output.json').write_text(json.dumps(outputs,ensure_ascii=False,indent=2),encoding='utf8')
for row in outputs:
    print('\n'.join(l for l in row['output'].splitlines() if not l.startswith(('MC_raw','sequential_raw'))))
