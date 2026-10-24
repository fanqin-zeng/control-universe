import numpy as np

DEFAULT=dict(amplitude=.5,rho=.6,sigma=.2,feedback=.4,changed=False,seed=20261024)
def rng(seed):
    state=int(seed)
    def sample():
        nonlocal state
        state=(1664525*state+1013904223)%2**32
        return state/2**32
    return sample

def record(c,part):
    train=part=='train';offset={'train':0,'validation':1000,'test':2000}[part]
    ru,rw=rng(c['seed']+offset),rng(c['seed']+offset+777)
    a,b=(.5,.1) if part=='test' and c['changed'] else (.8,.3)
    x=v=0.;ys=[];us=[];rs=[];xs=[];ws=[]
    for k in range(641 if train else 832):
        r=c['amplitude']*(1 if ru()>=.5 else -1) if train else sum(np.sin(2*np.pi*j*k/64) for j in [2,8,20])/3
        y=x+v;u=r-c['feedback']*y if train else r
        ys.append(y);us.append(u);rs.append(r);xs.append(x)
        w=c['sigma']*np.sqrt(12)*(rw()-.5);ws.append(w)
        x=a*x+b*u;v=c['rho']*v+w
    sl=slice(None) if train else slice(256,None)
    return {key:np.array(val)[sl] for key,val in dict(y=ys,u=us,r=rs,x=xs,w=ws).items()}

def experiment(c=None):
    c={**DEFAULT,**(c or {})};tr,va,te=[record(c,p) for p in ['train','validation','test']]
    phi=np.column_stack([tr['y'][128:640],tr['u'][128:640]]);target=tr['y'][129:641]
    z=np.column_stack([tr['r'][128:640],tr['r'][127:639]])
    models={}
    for name in ['OLS','IV']:
        matrix,rhs=(phi,target) if name=='OLS' else (z.T@phi,z.T@target)
        theta=None if np.linalg.matrix_rank(matrix)<2 else np.linalg.lstsq(matrix,rhs,rcond=None)[0]
        valid=theta is not None and 0<theta[0]<=.95 and 0<theta[1]<=1
        m=dict(coefficients=None if theta is None else theta.tolist(),valid=bool(valid))
        for label,data in [('validation',va),('test',te)]:
            if not valid:m[label]=None;continue
            pred=np.zeros(576);pred[0]=data['y'][0]
            for k in range(1,576):pred[k]=theta[0]*pred[k-1]+theta[1]*data['u'][k-1]
            err=data['y'][64:]-pred[64:];res=data['y'][64:]-theta[0]*data['y'][63:575]-theta[1]*data['u'][63:575]
            rmse=float(np.sqrt(np.mean(err**2)));base=float(np.sqrt(np.mean(data['y'][64:]**2)))
            m[label]=dict(rmse=rmse,improvement=1-rmse/base if base>1e-14 else None,pred=pred.tolist(),residualLag1=float(np.dot(res[1:],res[:-1])/np.dot(res,res)) if np.dot(res,res)>1e-20 else None)
        models[name]=m
    valid=[n for n,m in models.items() if m['valid']]
    selected=None if not valid else min(valid,key=lambda n:(round(models[n]['validation']['rmse'],12),n!='OLS'))
    peak=max(np.max(abs(d['u'])) for d in [tr,va,te]);score=models[selected]['test'] if selected else None
    admitted=bool(score and peak<=2 and score['rmse']<=.35 and score['improvement'] is not None and score['improvement']>=.1)
    uf=np.fft.fft(te['u'][64:].reshape(8,64),axis=1);yf=np.fft.fft(te['y'][64:].reshape(8,64),axis=1);spectrum=[]
    for j in [2,8,20]:
        cross=np.mean(np.conj(uf[:,j])*yf[:,j]);pu=np.mean(abs(uf[:,j])**2);py=np.mean(abs(yf[:,j])**2);h=cross/pu
        spectrum.append(dict(bin=j,frequency=j/64,re=float(h.real),im=float(h.imag),gain=float(abs(h)),coherence=float(abs(cross)**2/(pu*py))))
    return dict(train={k:v.tolist() for k,v in tr.items()},validation={k:v.tolist() for k,v in va.items()},test={k:v.tolist() for k,v in te.items()},models=models,selected=selected,admitted=admitted,inputPeak=float(peak),spectrum=spectrum)

def compact(r):
    return dict(selected=r['selected'],admitted=r['admitted'],inputPeak=r['inputPeak'],models={n:dict(coefficients=m['coefficients'],valid=m['valid'],**{p:None if m[p] is None else {k:v for k,v in m[p].items() if k!='pred'} for p in ['validation','test']}) for n,m in r['models'].items()},spectrum=r['spectrum'])

if __name__=='__main__':
    import json
    print(json.dumps(compact(experiment()),indent=2))
