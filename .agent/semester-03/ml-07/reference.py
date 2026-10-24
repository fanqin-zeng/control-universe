"""Independent NumPy eigensolver/orthogonal projection/lstsq and Decimal loss oracle."""
from pathlib import Path
from decimal import Decimal as D,getcontext
import numpy as np,json,sys,math
getcontext().prec=70
ANGLES=[0,15,30,45,60,75,90]
def pca(points):
    x=np.asarray(points,dtype=float);center=x.mean(axis=0);c=np.cov(x,rowvar=False,bias=True);ev,vec=np.linalg.eigh(c);gap=ev[-1]-ev[0];tie=gap<=1e-12
    w=np.array([1.,0.]) if tie else vec[:,-1]
    if w[0]<-1e-15 or (abs(w[0])<1e-15 and w[1]<0):w=-w
    w[np.abs(w)<1e-15]=0
    return dict(center=center.tolist(),covariance=c.tolist(),eigenvalues=ev[::-1].tolist(),degenerate=bool(tie),w=w.tolist(),angle=float(np.degrees(np.arctan2(w[1],w[0]))))
def samples(a,b,split):
    f={'train':(1,1),'validation':(1.5,.75),'test':(.75,1.5)}[split]
    x=np.array([[-a,-b],[-a,b],[a,-b],[a,b]])*np.array(f);y=np.array([-1,1,-1,1])
    return x,y
def metric(x,y,w,head):
    score=(x@w)*head['slope']+head['intercept'];pred=np.where((np.abs(score)<=1e-12)|(score>0),1,-1)
    return dict(mse=float(np.mean((score-y)**2)),accuracy=float(np.mean(pred==y)),scores=score.tolist(),pred=pred.tolist())
def evaluate(x,y,vx,vy,w,angle):
    w=np.array(w);z=x@w;design=np.column_stack([z,np.ones(len(z))]);coef=np.linalg.lstsq(design,y,rcond=None)[0];coef[np.abs(coef)<1e-14]=0
    head=dict(slope=float(coef[0]),intercept=float(coef[1]));projected=np.outer(z,w)
    return dict(angle=angle,w=w.tolist(),head=head,z=z.tolist(),projected=projected.tolist(),reconstruction=float(np.mean((x-projected)**2)),train=metric(x,y,w,head),validation=metric(vx,vy,w,head))
def oracle(a=2,b=.5,standardized=False):
    raw,y=samples(a,b,'train');mean=raw.mean(axis=0);sd=raw.std(axis=0);scale=np.where(standardized&(sd>0),sd,1);x=(raw-mean)/scale;vx,vy=samples(a,b,'validation');vx=(vx-mean)/scale
    model=pca(x);candidates=[]
    for deg in ANGLES:
        w=np.array([np.cos(np.radians(deg)),np.sin(np.radians(deg))]);w[np.abs(w)<1e-15]=0;candidates.append(evaluate(x,y,vx,vy,w,deg))
    selected=min(candidates,key=lambda r:r['validation']['mse'])
    return dict(a=a,b=b,standardized=standardized,preprocess=dict(mean=mean.tolist(),scale=scale.tolist(),constant=(sd==0).tolist()),points=[dict(id='train-'+str(i//2)+str(i%2),x=row.tolist(),y=int(y[i])) for i,row in enumerate(x)],pcaModel=model,pca=evaluate(x,y,vx,vy,model['w'],model['angle']),candidates=candidates,selected=selected)
def audit(a=2,b=.5,standardized=False):
    s=oracle(a,b,standardized);raw,y=samples(a,b,'test');mean=np.array(s['preprocess']['mean']);scale=np.array(s['preprocess']['scale']);x=(raw-mean)/scale;flipped=(raw@np.diag([1,-1])-mean)/scale
    return dict(pcaTest=metric(x,y,np.array(s['pca']['w']),s['pca']['head']),selectedTest=metric(x,y,np.array(s['selected']['w']),s['selected']['head']),polarityPcaTest=metric(flipped,y,np.array(s['pca']['w']),s['pca']['head']),polaritySelectedTest=metric(flipped,y,np.array(s['selected']['w']),s['selected']['head']))
def summary(s):
    def shrink(r):return dict(angle=r['angle'],reconstruction=r['reconstruction'],head=r['head'],trainMSE=r['train']['mse'],validationMSE=r['validation']['mse'],validationAccuracy=r['validation']['accuracy'])
    return dict(preprocess=s['preprocess'],pcaModel=s['pcaModel'],pca=shrink(s['pca']),selected=shrink(s['selected']))
def contrast(a,b,temperature):
    a,b,t=map(lambda x:D(str(x)),[a,b,temperature]);c=(b*b-a*a)/(a*a+b*b);same=D(2).ln()
    return dict(cosPositive=float(c),cosWrong=float(-c),informative=float((1+(-2/t).exp()).ln()),collapsed=float(same),wrongPositive=float(same),falseNegative=float(same))
default=oracle()
expected=[[summary(default),dict(candidates=[dict(angle=r['angle'],trainMSE=r['train']['mse'],validationMSE=r['validation']['mse'],validationAccuracy=r['validation']['accuracy'],reconstruction=r['reconstruction']) for r in default['candidates']],test=audit())],[[contrast(2,.5,t) for t in [.1,.5,1]],[summary(oracle(1,1,False)),summary(oracle(2,.5,True))]]]
count=0;maxerror=0
def compare(a,b):
    global count,maxerror
    if isinstance(b,dict):
        for k,v in b.items():compare(a[k],v)
    elif isinstance(b,list):
        assert len(a)==len(b)
        for x,y in zip(a,b):compare(x,y)
    elif isinstance(b,(str,bool)):assert a==b,(a,b)
    else:
        e=abs(a-float(b));count+=1;maxerror=max(maxerror,e);assert e<1e-10,(a,float(b))
if len(sys.argv)>1:
    data=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    for row in data['runs']:
        compare(row['result'],oracle(**row['config']));compare(row['audit'],audit(**row['config']))
    for row in data['extraPca']:compare(row['result'],pca(row['points']))
    for row in data['contrastive']:compare(row['result'],contrast(**row['config']))
    for i,nb in enumerate(data['notebooks']):compare(nb,expected[i])
print(json.dumps(dict(pass_=True,quantities=count,max_error=maxerror,expected_notebooks=expected)))
