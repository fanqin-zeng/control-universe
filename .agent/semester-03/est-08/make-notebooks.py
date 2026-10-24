from pathlib import Path
import json,numpy as np
root=Path.cwd();d=root/'.agent/semester-03/est-08';data={}
for seed in sorted(set(range(20))|{43}):
 rng=np.random.Generator(np.random.PCG64(seed));data[str(seed)]={'initial':rng.standard_normal(2).tolist(),'draws':rng.standard_normal((12,3)).tolist()}
(root/'lib/estimation-case-data.json').write_text(json.dumps(data,indent=2),encoding='utf8')
setup='''import numpy as np
import math
DATA = __DATA__
F=np.array([[1.,1.],[0.,1.]])
G=np.array([.5,1.]);H=np.array([[1.,0.]])

def run_case(scenario="clean",qscale=1.,gate=False,seed=7,information=False,single=False,reverse=False):
    if scenario not in ["clean","dropout","spike"] or qscale<=0 or not np.isfinite(qscale):raise ValueError("invalid case contract")
    data=DATA[str(seed)];truth=np.array([0.,1.])+data["initial"]
    mean=np.array([0.,1.]);P=np.eye(2);history=[]
    for k,(na,n1,n2) in enumerate(data["draws"],1):
        truth=F@truth+G*(.2*na)
        mean=F@mean;P=F@P@F.T+.04*qscale*np.outer(G,G)
        readings=[truth[0]+n1,truth[0]+2*n2]
        if scenario=="spike" and k==6:readings[0]+=8
        available=[not(scenario=="dropout" and 5<=k<=8),not(single or scenario=="dropout" and 6<=k<=8)]
        events=[]
        for i in ([1,0] if reverse else [0,1]):
            if not available[i]:continue
            r=[1.,4.][i];residual=readings[i]-mean[0];S=P[0,0]+r;nis=residual**2/S;accept=bool(not gate or nis<=9)
            events.append(dict(sensor=i+1,reading=readings[i],innovation=residual,S=S,nis=nis,accepted=accept))
            if accept:
                if information:
                    Y=np.linalg.solve(P,np.eye(2));y=Y@mean
                    P=np.linalg.solve(Y+H.T@H/r,np.eye(2));mean=P@(y+H.ravel()*readings[i]/r)
                else:
                    K=P[:,0]/S;mean=mean+K*residual;A=np.eye(2)-np.outer(K,H.ravel());P=A@P@A.T+np.outer(K,K)*r
                P=(P+P.T)/2
        history.append(dict(step=k,truth=truth.tolist(),mean=mean.tolist(),covariance=[P[0,0],P[0,1],P[1,1]],error=mean[0]-truth[0],sigma=np.sqrt(P[0,0]),events=events,predictionOnly=not any(e['accepted'] for e in events)))
    return dict(history=history,rmse=np.sqrt(np.mean([r['error']**2 for r in history])),coverage=sum(int(abs(r['error'])<=2*r['sigma']) for r in history),rejected=sum(not e['accepted'] for r in history for e in r['events']),predictionOnly=sum(r['predictionOnly'] for r in history),peakNis=max((e['nis'] for r in history for e in r['events']),default=0.))
'''
setup=setup.replace('__DATA__',repr(data))
cells=[[
'''r=run_case();first=r['history'][0]
print("default_first_readings",[e['reading'] for e in first['events']])
print("predicted_first_mean_P",[1.,1.],[[2.01,1.02],[1.02,1.04]])
print("default_first_mean_covariance",first['mean'],first['covariance'])
print("default_metrics",r['rmse'],r['coverage'],r['rejected'],r['predictionOnly'],r['peakNis'])
print("default_final_mean_covariance",r['history'][-1]['mean'],r['history'][-1]['covariance'])
print("default_single_RMSE",run_case(single=True)['rmse'])
''',
'''maxdiff=0.
for seed in [7,19,43]:
    a=run_case(seed=seed);b=run_case(seed=seed,reverse=True)
    for x,y in zip(a['history'],b['history']):maxdiff=max(maxdiff,*np.abs(np.array(x['mean']+x['covariance'])-np.array(y['mean']+y['covariance'])))
r=run_case("dropout");print("dropout_prediction_only_steps",[x['step'] for x in r['history'] if x['predictionOnly']])
print("dropout_position_variance_steps5to9",[r['history'][i-1]['covariance'][0] for i in range(5,10)])
print("ungated_reverse_max_difference",maxdiff)
assert maxdiff<1e-10 and [x['step'] for x in r['history'] if x['predictionOnly']]==[6,7,8]
print("case_recursion_checks_passed")
'''],[
'''rows=[]
for scenario in ["clean","dropout","spike"]:
    for qscale in [.25,1.,4.]:
        for gate in [False,True]:
            for seed in range(20):
                a=run_case(scenario,qscale,gate,seed);b=run_case(scenario,qscale,gate,seed,single=True)
                rows.append(dict(scenario=scenario,qscale=qscale,gate=gate,seed=seed,rmse=a['rmse'],singleRmse=b['rmse'],coverage=a['coverage'],rejected=a['rejected'],predictionOnly=a['predictionOnly']))
print("multi_seed_runs",len(rows),"steps_each",12,"seeds",list(range(20)))
for scenario in ["clean","dropout","spike"]:
    for gate in [False,True]:
        r=run_case(scenario,1,gate,7)
        print("seed7_scenario_gate_RMSE_coverage_rejected",scenario,gate,r['rmse'],r['coverage'],r['rejected'])
''',
'''for scenario in ["clean","dropout","spike"]:
    a=[r for r in rows if r['scenario']==scenario and r['qscale']==1 and not r['gate']]
    b=[r for r in rows if r['scenario']==scenario and r['qscale']==1 and r['gate']]
    print("summary_scenario_ungated_RMSE_min_median_max",scenario,np.min([r['rmse'] for r in a]),np.median([r['rmse'] for r in a]),np.max([r['rmse'] for r in a]))
    print("summary_scenario_gated_RMSE_min_median_max",scenario,np.min([r['rmse'] for r in b]),np.median([r['rmse'] for r in b]),np.max([r['rmse'] for r in b]))
    print("gate_worse_and_fusion_worse_counts",scenario,sum(y['rmse']>x['rmse']+1e-12 for x,y in zip(a,b)),sum(x['rmse']>x['singleRmse']+1e-12 for x in a))
assert len(rows)==360
print("multi_seed_checks_passed")
'''],[
'''r=run_case("spike",1,True,7)
print("spike_step6_gate_events",[(e['sensor'],e['nis'],e['accepted']) for e in r['history'][5]['events']])
p=1.;velocity_var=1.;cross=0.
observability=np.vstack([H,H@F])
print("observability_matrix_rank",observability.tolist(),int(np.linalg.matrix_rank(observability)))
print("Q_discrete_acceleration",(.04*np.outer(G,G)).tolist(),"rank",int(np.linalg.matrix_rank(.04*np.outer(G,G))))
print("white_acceleration_spectral_Q_if_density_point04",(.04*np.array([[1/3,1/2],[1/2,1]])).tolist())
print("normal_three_sigma_single_test_probability",math.erf(3/math.sqrt(2)))
print("controlled_clean_extreme_reading_NIS_rejected",7.,(7-1)**2/(2.01+1),(7-1)**2/(2.01+1)>9)
''',
'''maximum=0.;count=0
for scenario in ["clean","dropout","spike"]:
    for qscale in [.25,1.,4.]:
        for gate in [False,True]:
            for seed in range(20):
                a=run_case(scenario,qscale,gate,seed);b=run_case(scenario,qscale,gate,seed,information=True)
                for x,y in zip(a['history'],b['history']):
                    maximum=max(maximum,*np.abs(np.array(x['mean']+x['covariance'])-np.array(y['mean']+y['covariance'])))
                    assert np.linalg.det([[x['covariance'][0],x['covariance'][1]],[x['covariance'][1],x['covariance'][2]]])>0
                count+=1
print("independent_information_runs_max_difference",count,maximum)
assert count==360 and maximum<1e-10
print("case_diagnostics_checks_passed")
''']]
contract={'notebooks':[dict(title=t,setupCode=setup,cells=[dict(code=c) for c in cs]) for t,cs in zip(['共同预测与双路更新','完整工况与多种子分布','创新诊断与独立信息核验'],cells)]}
(d/'notebook-contract.json').write_text(json.dumps(contract,ensure_ascii=False,indent=2),encoding='utf8')
import io,contextlib
reports=[]
for i,nb in enumerate(contract['notebooks']):
 ns={};out=io.StringIO()
 with contextlib.redirect_stdout(out):
  exec(nb['setupCode'],ns)
  for c in nb['cells']:exec(c['code'],ns)
 reports.append(dict(notebook=i,output=out.getvalue()))
 if 'rows' in ns:(d/'multi-seed.json').write_text(json.dumps(ns['rows'],indent=2),encoding='utf8')
(d/'minimal-notebook-output.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf8');print('\n'.join(x['output'] for x in reports))
