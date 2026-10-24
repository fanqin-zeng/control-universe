SETUP='''import numpy as np
def era(amplitude=.5,pole=.3,noise=0.,order=2,tolerance=1e-8):
    truth = .8**np.arange(20)+amplitude*pole**np.arange(20)
    state = 20261024; vals = []
    for _ in range(8):
        state = (1664525*state+1013904223) % 2**32
        vals.append(np.sqrt(12)*(state/2**32-.5))
    measured = truth[:8]+noise*np.array(vals)
    H = np.array([[measured[i+j] for j in range(4)] for i in range(4)])
    H1 = np.array([[measured[i+j+1] for j in range(4)] for i in range(4)])
    U,s,Vh = np.linalg.svd(H)
    rank = int(np.sum(s>tolerance*s[0]))
    result = dict(singular=s,rank=rank,truth=truth,measured=measured)
    if order>rank: return result
    root = np.sqrt(s[:order]); U,Vh = U[:,:order],Vh[:order]
    A = (U.T@H1@Vh.T)/root[:,None]/root[None,:]
    B,C = root*Vh[:,0],U[0]*root
    x = B.copy(); pred = []
    for _ in range(20):
        pred.append(float(C@x)); x = A@x
    result.update(A=A,B=B,C=C,prediction=np.array(pred),poles=np.linalg.eigvals(A),rmse=float(np.sqrt(np.mean((pred-truth)**2))))
    return result
def prng(seed,size):
    state = int(seed); vals = []
    for _ in range(size):
        state = (1664525*state+1013904223) % 2**32
        vals.append(1. if state>=2**31 else -1.)
    return np.array(vals)
def simulate(A,B,C,D,u):
    x = np.zeros(len(B)); ys = []
    for v in u:
        ys.append(float(C@x+D*v)); x = A@x+B*v
    return np.array(ys)
def identify(u,y,order=2):
    rows = 6; J = len(u)-rows+1
    Uf = np.array([u[i:i+J] for i in range(rows)])
    Yf = np.array([y[i:i+J] for i in range(rows)])
    Q,_ = np.linalg.qr(Uf.T,mode='reduced')
    residual = Yf-(Yf@Q)@Q.T
    U,s,_ = np.linalg.svd(residual,full_matrices=False)
    if order>np.sum(s>1e-10*s[0]): return None
    O = U[:,:order]*np.sqrt(s[:order])
    A = np.linalg.lstsq(O[:-1],O[1:],rcond=None)[0]; C = O[0]
    # Fit x0, B and D jointly to all training outputs; no hidden true state used.
    power = np.eye(order); forced = np.zeros((order,order)); F = []
    for uk in u:
        F.append(np.r_[C@power,C@forced,uk])
        power = power@A; forced = A@forced+uk*np.eye(order)
    theta,_,rank,_ = np.linalg.lstsq(np.array(F),y,rcond=None)
    return dict(A=A,B=theta[order:2*order],C=C,D=float(theta[-1]),x0=theta[:order],fitrank=int(rank),singular=s,rawrank=int(np.linalg.matrix_rank(Yf)),projectedrank=int(np.linalg.matrix_rank(residual)))
Atrue = np.diag([.8,.3]); Btrue = np.ones(2); Ctrue = np.array([1.,.5]); Dtrue = 0.
'''
CELLS=[
'''r = era()
summary = dict(h0=0.,h=r['truth'][:8].tolist(), singular=r['singular'].tolist(), rank=r['rank'],poles=np.sort(r['poles']).tolist(),rmse=r['rmse'],ratio=float(r['singular'][1]/r['singular'][0]),order1_rmse=era(order=1)['rmse'])
T = np.array([[1.,1.],[0.,2.]])
At,Bt,Ct = T@Atrue@np.linalg.inv(T),T@Btrue,Ctrue@np.linalg.inv(T)
summary['similarity_A'] = At.tolist(); summary['similarity_B'] = Bt.tolist(); summary['similarity_C'] = Ct.tolist()
summary['similarity_error'] = float(np.max(abs(simulate(At,Bt,Ct,0,prng(71,128))-simulate(Atrue,Btrue,Ctrue,0,prng(71,128)))))
for label,amp,pole in [('weak',.05,.3),('absent',0.,.3),('coincident',.5,.8)]:
    e = era(amplitude=amp,pole=pole)
    summary[label] = dict(rank=e['rank'],ratio=float(e['singular'][1]/e['singular'][0]),defined='A' in e)
print(summary)
print('era_default_checks_passed')''',
'''u = prng(20261024,256); y = simulate(Atrue,Btrue,Ctrue,0.,u)
r = identify(u,y)
uv = prng(20262024,128); truth = simulate(Atrue,Btrue,Ctrue,0.,uv)
pred = simulate(r['A'],r['B'],r['C'],r['D'],uv)
summary = dict(shape=[6,251],rawrank=r['rawrank'],projectedrank=r['projectedrank'],singular=r['singular'].tolist(),poles=np.sort(np.real(np.linalg.eigvals(r['A']))).tolist(),fitrank=r['fitrank'],D=r['D'],validation_rmse=float(np.sqrt(np.mean((pred-truth)**2))))
assert r['rawrank']==6 and r['projectedrank']==2 and r['fitrank']==5
print(summary)
print('input_projection_checks_passed')''',
'''summaries = []
for sigma in [0.,.001,.03]:
    errors = {1:[],2:[],3:[]}
    for seed in range(20261024,20261056):
        u = prng(seed,256); clean = simulate(Atrue,Btrue,Ctrue,0.,u)
        noise = prng(seed+5000,256)*sigma
        uv = prng(seed+1000,128); target = simulate(Atrue,Btrue,Ctrue,0.,uv)
        for order in [1,2,3]:
            r = identify(u,clean+noise,order)
            if r is None:
                errors[order].append(None); continue
            pred = simulate(r['A'],r['B'],r['C'],r['D'],uv)
            errors[order].append(float(np.sqrt(np.mean((pred-target)**2))))
    report = {}
    for order,vals in errors.items():
        valid = [v for v in vals if v is not None]
        report[order] = dict(values=vals,unavailable=len(vals)-len(valid),median=float(np.median(valid)) if valid else None,q10=float(np.quantile(valid,.1)) if valid else None,q90=float(np.quantile(valid,.9)) if valid else None)
    summaries.append(dict(sigma=sigma,errors=report))
print(summaries)
print('subspace_all_seeds_reported')'''
]
