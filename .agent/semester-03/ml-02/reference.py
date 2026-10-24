import json,sys,numpy as np,mpmath as mp
from fractions import Fraction
mp.mp.dps=70
cases=json.load(open(sys.argv[1],encoding='utf-8'))
maxerr=0.
def reg(lam,a):
    x=np.array([-1.,0.,1.]);y=np.array([0.,1.,2.+a]);X=np.column_stack([np.ones(3),x])
    b,w=np.linalg.lstsq(np.vstack([X,[0.,np.sqrt(3*lam)]]),np.r_[y,0.],rcond=None)[0]
    exact_b=1+Fraction(str(a))/3;exact_w=(2+Fraction(str(a)))/(2+3*Fraction(str(lam)))
    assert abs(b-float(exact_b))<1e-12 and abs(w-float(exact_w))<1e-12
    mse=float(np.mean((X@np.array([b,w])-y)**2));pen=float(lam*w*w/2)
    return dict(b=float(b),w=float(w),mse=mse,dataLoss=mse/2,penalty=pen,objective=mse/2+pen,validation=float((b-1)**2+.25*(w-1)**2),test=float((b-1)**2+.5625*(w-1)**2))
def classify(lam,budget):
    lam=mp.mpf(str(lam));w=mp.mpf(0);n=0
    sig=lambda z:1/(1+mp.exp(-z))
    grad=lambda w:(sig(w)-1)/2+sig(2*w)-1+lam*w
    while n<budget and abs(grad(w))>mp.mpf('1e-10'):
        w-=grad(w)/2;n+=1
    ce=sum(mp.log(1+mp.exp(-abs(w*x))) for x in [-2,-1,1,2])/4
    penalty=lam*w*w/2
    return dict(b=0.,w=float(w),updates=n,gradientNorm=float(abs(grad(w))),converged=bool(abs(grad(w))<=mp.mpf('1e-10')),ce=float(ce),penalty=float(penalty),objective=float(ce+penalty),probabilities=[float(sig(w*x)) for x in [-2,-1,1,2]])
def compare(a,b,path=''):
    global maxerr
    if isinstance(b,dict):
        for k,v in b.items():compare(a[k],v,path+'.'+k)
    elif isinstance(b,list):
        assert len(a)==len(b)
        for i,v in enumerate(b):compare(a[i],v,path+str(i))
    elif isinstance(b,bool):assert a==b,(path,a,b)
    else:
        err=abs(a-b);maxerr=max(maxerr,err);assert err<1e-9,(path,a,b)
for r in cases['regression']:compare(r['result'],reg(r['lambda'],r['disturbance']))
for r in cases['classification']:compare(r['result'],classify(r['lambda'],r['budget']))
selection=[]
for a in [0.,1.,2.]:
    ls=[0.,.5,1.,2.];rs=[reg(l,a) for l in ls];i=min(range(4),key=lambda i:rs[i]['validation']);selection.append(dict(a=a,selected=ls[i],validation=rs[i]['validation'],test=rs[i]['test']))
sig=lambda z:1/(1+mp.exp(-z))
root=float(mp.findroot(lambda w:(sig(w)-1)/2+sig(2*w)-1+w,.5))
expected=[dict(default_reg=reg(1.,0.),selection_rows=selection,first_step=[.5,1/3]),dict(default_class=classify(1.,40),root=root)]
print(json.dumps(dict(pass_=True,maximum_error=maxerr,regression_cases=len(cases['regression']),classification_cases=len(cases['classification']),expected_notebooks=expected)))
