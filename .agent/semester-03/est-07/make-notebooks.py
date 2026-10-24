"""Deterministic original Gaussian-fusion notebook experiment contract."""
from pathlib import Path
import json,contextlib,io
root=Path(__file__).resolve().parents[3];folder=root/'.agent/semester-03/est-07'
setup='''import numpy as np
import math

def condition(mu,p,H,predicted,z,R):
    H=np.asarray(H,dtype=float).reshape(-1,1);R=np.asarray(R,dtype=float)
    z=np.asarray(z);predicted=np.asarray(predicted)
    K=np.linalg.solve(p*(H@H.T)+R,p*H).T
    mean=mu+(K@(z-predicted)).item();A=1-(K@H).item()
    variance=A*A*p+(K@R@K.T).item()
    return mean,variance,K.ravel()

def pair(p,r2,rho,z1,z2):
    c=rho*np.sqrt(r2);R=np.array([[1,c],[c,r2]])
    return condition(0,p,[1,1],[0,0],[z1,z2],R),R

def sequential_cholesky(p,R,z,reverse=False):
    H=np.ones(2);z=np.array(z,dtype=float)
    if reverse:R=R[::-1,::-1];z=z[::-1];H=H[::-1]
    if R[0,0]*R[1,1]-R[0,1]**2<=0:raise np.linalg.LinAlgError("positive definite R required")
    L=np.linalg.cholesky(R);h=np.linalg.solve(L,H);y=np.linalg.solve(L,z);mean=0.
    for hi,yi in zip(h,y):
        gain=p*hi/(1+hi*hi*p);mean+=gain*(yi-hi*mean)
        p=(1-gain*hi)**2*p+gain*gain
    return mean,p

def ci(m1,p1,m2,p2,omega):
    variance=1/(omega/p1+(1-omega)/p2)
    a=variance*omega/p1;b=variance*(1-omega)/p2
    return a*m1+b*m2,variance,a,b
'''
c1='''for rho in [0,.5,-.5,.9]:
    (m,p,k),R=pair(4,4,rho,2,3)
    naive=condition(0,4,[1,1],[0,0],[2,3],np.diag([1.,4.]))
    kn=naive[2];actual_naive=(1-kn.sum())**2*4+kn@R@kn
    print("same_model_rho_joint_mean_P_K_actualMSE_naive",rho,m,p,k.tolist(),p,naive[0],naive[1],actual_naive)
    if rho==0:assert np.allclose([m,p],[11/6,2/3],atol=1e-12)
    if rho==.5:assert np.allclose([m,p,actual_naive],[1.6,.8,8/9],atol=1e-12)
print("single_sensor1_mean_P",1.6,.8,"sensor2",1.5,2.)
'''
c2='''maximum=0.;count=0
for p0 in [1.,4.]:
    for r2 in [1.,4.]:
        for rho in [-.5,0,.5,.9]:
            for z1 in [0.,2.]:
                for z2 in [2.,3.]:
                    (m,p,k),R=pair(p0,r2,rho,z1,z2)
                    for reverse in [False,True]:
                        sm,sp=sequential_cholesky(p0,R,[z1,z2],reverse)
                        maximum=max(maximum,abs(sm-m),abs(sp-p))
                    count+=1
print("joint_whitened_64_cases_max_difference",count,maximum)
print("rho_half_conditional_H_reading_noise",1-1,3-2,4-1)
assert count==64 and maximum<1e-12
try:sequential_cholesky(4,np.array([[1.,2.],[2.,4.]]),[2,3])
except np.linalg.LinAlgError:print("singular_R_rejected")
else:raise AssertionError("singular joint covariance must not be silently treated as invertible")
print("joint_whitening_checks_passed")
'''
c3='''m0,p0=0.,4.;m1,p1=1.6,.8;m2,p2=1.5,2.
naive_p=1/(1/p1+1/p2);naive_m=naive_p*(m1/p1+m2/p2)
correct_p=1/(1/p1+1/p2-1/p0);correct_m=correct_p*(m1/p1+m2/p2-m0/p0)
cross=(p1/p0)*(p2/p0)*p0
a=naive_p/p1;b=naive_p/p2
actual=a*a*p1+b*b*p2+2*a*b*cross
print("shared_prior_local_cross",cross)
print("track_naive_mean_P_actualMSE",naive_m,naive_p,actual)
print("subtract_known_prior_mean_P",correct_m,correct_p)
assert np.allclose([naive_m,naive_p,actual,correct_m,correct_p],[11/7,4/7,36/49,11/6,2/3],atol=1e-12)
print("duplicate_same_estimate_mean_claimed_actual",1.6,.4,.8)
'''
c4='''worst_slack=0.;tested=0
for omega in [0,.25,.5,.75,1]:
    m,p,a,b=ci(1.6,.8,1.5,2.,omega)
    worst=(a*np.sqrt(.8)+b*np.sqrt(2.))**2
    print("CI_omega_mean_P_worstMSE",omega,m,p,worst)
    for rho in np.linspace(-1,1,21):
        actual=a*a*.8+b*b*2+2*a*b*rho*np.sqrt(.8*2)
        worst_slack=max(worst_slack,actual-p);tested+=1
        assert actual<=p+1e-12
    dup=ci(1.6,.8,1.6,.8,omega)
    assert np.allclose(dup[:2],[1.6,.8],atol=1e-12)
print("CI_bound_cases_max_violation",tested,worst_slack)
best=min((ci(1.6,.8,1.5,2.,w)[1],w) for w in np.linspace(0,1,101))
print("scalar_variance_objective_best_P_omega",best)
assert np.allclose(best,[.8,1.])
print("shared_information_checks_passed")
'''
c5='''def independent_readings(a,b):return condition(0,4,[1,1],[0,0],[a,b],np.eye(2))[:2]
bias=10.;local=-8.;world=local+bias
print("coordinate_offset_local_world",bias,local,world)
print("frame_wrong_correct_mean_P",independent_readings(2,local),independent_readings(2,world))
delay=.5;velocity=2.;old=1.;aligned=old+velocity*delay
print("time_delay_velocity_old_aligned",delay,velocity,old,aligned)
print("time_wrong_correct_mean_P",independent_readings(2,old),independent_readings(2,aligned))
assert np.allclose(independent_readings(2,world),[16/9,4/9])
assert np.allclose(independent_readings(2,local),[-8/3,4/9])
assert np.allclose(independent_readings(2,old),[4/3,4/9])
'''
c6='''mu,p=2.,.25
frozen=condition(mu,p,[1,4],[2,4],[3,5],np.eye(2))
m1,p1,_=condition(mu,p,[1],[2],[3],[[1.]])
relinearized=condition(m1,p1,[2*m1],[m1*m1],[5],[[1.]])
print("nonlinear_same_point_batch_mean_P",frozen[:2])
print("nonlinear_relinearized_after_first_mean_P",relinearized[:2])
print("first_linear_update_mean_P",m1,p1)
assert np.allclose(frozen[:2],[47/21,1/21],atol=1e-12)
assert not np.allclose(frozen[:2],relinearized[:2],atol=1e-6)
print("alignment_nonlinear_checks_passed")
'''
notebooks=[dict(title='同一先验的独立与相关观测',setupCode=setup,cells=[dict(code=c1),dict(code=c2)]),dict(title='共享先验、重复数据与协方差交集',setupCode=setup,cells=[dict(code=c3),dict(code=c4)]),dict(title='时间坐标与非线性更新的对齐',setupCode=setup,cells=[dict(code=c5),dict(code=c6)])]
(folder/'notebook-contract.json').write_text(json.dumps(dict(notebooks=notebooks),ensure_ascii=False,indent=2),encoding='utf8')
outputs=[]
for i,nb in enumerate(notebooks):
    ns={};out=io.StringIO()
    with contextlib.redirect_stdout(out):
        exec(nb['setupCode'],ns)
        for c in nb['cells']:exec(c['code'],ns)
    outputs.append(dict(notebook=i,output=out.getvalue()))
(folder/'minimal-notebook-output.json').write_text(json.dumps(outputs,ensure_ascii=False,indent=2),encoding='utf8')
print('\n'.join(r['output'] for r in outputs))
