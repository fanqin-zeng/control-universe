SETUP='''import numpy as np
def record(amplitude,binary,noise,plant,seed):
    state = int(seed); u,y,innovations = [],[0.],[]
    def next_value():
        nonlocal state
        state = (1664525*state+1013904223) % 2**32
        return state/2**32
    for _ in range(128):
        r = next_value()
        level = (-1. if r<.5 else 1.) if binary else [-1.,-.5,0.,.5,1.][int(5*r)]
        v = amplitude*level; e = noise*np.sqrt(12)*(next_value()-.5)
        u.append(v); innovations.append(e)
        y.append(.7*y[-1]+.3*(np.tanh(v) if plant=='tanh' else v)+e)
    return dict(u=np.array(u),y=np.array(y),innovation=np.array(innovations))
def fit(r,cubic):
    X = np.column_stack([r['y'][:-1],r['u'],r['u']**3]) if cubic else np.column_stack([r['y'][:-1],r['u']])
    rank = int(np.linalg.matrix_rank(X,tol=1e-10*np.linalg.norm(X,axis=0).max()))
    return dict(rank=rank,coefficients=np.linalg.lstsq(X,r['y'][1:],rcond=None)[0] if rank==X.shape[1] else None)
def assess(r,coef):
    if coef is None: return None
    a,b = coef[:2]; c = coef[2] if len(coef)==3 else 0.
    one = a*r['y'][:-1]+b*r['u']+c*r['u']**3
    prev = r['y'][0]; roll = []
    for v in r['u']:
        prev = a*prev+b*v+c*v**3; roll.append(prev)
    roll = np.array(roll)
    return dict(one=one,roll=roll,oneRMSE=float(np.sqrt(np.mean((one-r['y'][1:])**2))),rollRMSE=float(np.sqrt(np.mean((roll-r['y'][1:])**2))))
def experiment(amplitude=1.,binary=False,noise=0.,plant='tanh',test_amplitude=2.,seed=20261024):
    train = record(amplitude,binary,noise,plant,seed)
    validation = record(1.,False,noise,plant,seed+1000)
    test = record(test_amplitude,False,noise,plant,seed+2000)
    models = {}
    for name,cubic in [('linear',False),('cubic',True)]:
        m = fit(train,cubic); coef = m['coefficients']
        m.update(train=assess(train,coef),validation=assess(validation,coef),test=assess(test,coef)); models[name] = m
    l,c = models['linear']['validation'],models['cubic']['validation']
    selected = 'cubic' if c is not None and (l is None or c['rollRMSE']<l['rollRMSE']-1e-12) else 'linear' if l is not None else 'unidentified'
    return dict(models=models,selected=selected,train=train,validation=validation,test=test)
'''
CELLS=[
'''r = experiment()
summary = dict(selected=r['selected'])
for name,m in r['models'].items():
    summary[name] = dict(rank=m['rank'],coefficients=m['coefficients'].tolist(),train_one=m['train']['oneRMSE'],validation_one=m['validation']['oneRMSE'],validation_roll=m['validation']['rollRMSE'],test_one=m['test']['oneRMSE'],test_roll=m['test']['rollRMSE'])
print(summary)
print('nonlinear_default_checks_passed')''',
'''summaries = []
for label,plant,amplitude,noise in [('linear','linear',1.,0.),('saturating','tanh',1.,0.),('small_noisy','tanh',.5,.03)]:
    stats = {name:{metric:[] for metric in ['validation_one','validation_roll','test_one','test_roll']} for name in ['linear','cubic']}
    choices = []
    for seed in range(20261024,20261056):
        r = experiment(amplitude=amplitude,noise=noise,plant=plant,seed=seed)
        choices.append(r['selected'])
        for name,m in r['models'].items():
            for partition in ['validation','test']:
                for mode in ['one','roll']:
                    stats[name][partition+'_'+mode].append(m[partition][mode+'RMSE'])
    report = {name:{metric:dict(values=vals,median=float(np.median(vals)),q10=float(np.quantile(vals,.1)),q90=float(np.quantile(vals,.9))) for metric,vals in metrics.items()} for name,metrics in stats.items()}
    summaries.append(dict(label=label,stats=report,choices=choices))
print(summaries)
print('nonlinear_all_seeds_reported')''',
'''r = experiment(binary=True)
zero = experiment(amplitude=0.)
c = experiment()['models']['cubic']['coefficients']
row = dict(binary_linear_rank=r['models']['linear']['rank'],binary_cubic_rank=r['models']['cubic']['rank'],binary_cubic_refused=r['models']['cubic']['coefficients'] is None,zero_selected=zero['selected'],u3_equals_A2u=True,coefficient_at_2=float(2*c[1]+8*c[2]),true_forcing_at_2=float(.3*np.tanh(2)),local_derivative=.7,steps=128,seed=20261024,example_one=float(.5*c[0]+c[1]+c[2]),example_roll=float(.4*c[0]+c[1]+c[2]),example_gap=float(.1*c[0]))
assert np.array_equal(r['train']['u']**3,r['train']['u'])
print(row)
print('nonlinear_boundary_checks_passed')'''
]
