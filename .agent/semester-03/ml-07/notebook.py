import math,json
ANGLES=[0,15,30,45,60,75,90]
def records(a,b,split):
    f={'train':(1,1),'validation':(1.5,.75),'test':(.75,1.5)}[split]
    return [dict(id=split+'-'+str(i)+str(j),x=[u*a*f[0],v*b*f[1]],y=v) for i,u in enumerate([-1,1]) for j,v in enumerate([-1,1])]
def fit_preprocess(rows,standardized):
    mean=[sum(r['x'][j] for r in rows)/len(rows) for j in range(2)]
    sd=[math.sqrt(sum((r['x'][j]-mean[j])**2 for r in rows)/len(rows)) for j in range(2)]
    return dict(mean=mean,scale=[v if standardized and v>0 else 1 for v in sd],constant=[v==0 for v in sd])
def transform(rows,prep):
    return [dict(r,x=[(v-prep['mean'][j])/prep['scale'][j] for j,v in enumerate(r['x'])]) for r in rows]
def pca(points):
    mean=[sum(r[j] for r in points)/len(points) for j in range(2)]
    c=[[sum((r[i]-mean[i])*(r[j]-mean[j]) for r in points)/len(points) for j in range(2)] for i in range(2)]
    gap=math.hypot(c[0][0]-c[1][1],2*c[0][1]);tie=gap<=1e-12
    theta=0 if tie else .5*math.atan2(2*c[0][1],c[0][0]-c[1][1])
    w=[0 if abs(v)<1e-15 else v for v in [math.cos(theta),math.sin(theta)]]
    return dict(center=mean,covariance=c,eigenvalues=[(c[0][0]+c[1][1]+gap)/2,(c[0][0]+c[1][1]-gap)/2],degenerate=tie,w=w,angle=theta*180/math.pi)
def unit(deg):return [0 if deg==90 else math.cos(deg*math.pi/180),0 if deg==0 else math.sin(deg*math.pi/180)]
def dot(a,b):return sum(x*y for x,y in zip(a,b))
def metrics(rows,w,head):
    scores=[head['slope']*dot(w,r['x'])+head['intercept'] for r in rows];pred=[1 if abs(v)<=1e-12 or v>0 else -1 for v in scores]
    return dict(mse=sum((v-r['y'])**2 for v,r in zip(scores,rows))/len(rows),accuracy=sum(v==r['y'] for v,r in zip(pred,rows))/len(rows),scores=scores,pred=pred)
def evaluate(train,validation,w,angle):
    z=[dot(w,r['x']) for r in train];mz=sum(z)/len(z);my=sum(r['y'] for r in train)/len(train)
    den=sum((v-mz)**2 for v in z);slope=sum((v-mz)*(r['y']-my) for v,r in zip(z,train))/den if den else 0
    head=dict(slope=slope,intercept=my-slope*mz);projected=[[v*x for x in w] for v in z]
    return dict(angle=angle,w=w,head=head,z=z,projected=projected,reconstruction=sum(sum((v-p[j])**2 for j,v in enumerate(r['x'])) for r,p in zip(train,projected))/(2*len(train)),train=metrics(train,w,head),validation=metrics(validation,w,head))
def study(a=2,b=.5,standardized=False):
    raw=records(a,b,'train');prep=fit_preprocess(raw,standardized);train=transform(raw,prep);validation=transform(records(a,b,'validation'),prep);model=pca([r['x'] for r in train])
    candidates=[evaluate(train,validation,unit(deg),deg) for deg in ANGLES];selected=min(candidates,key=lambda row:row['validation']['mse'])
    return dict(a=a,b=b,standardized=standardized,preprocess=prep,points=train,pcaModel=model,pca=evaluate(train,validation,model['w'],model['angle']),candidates=candidates,selected=selected)
def summary(s):
    shrink=lambda r:dict(angle=r['angle'],reconstruction=r['reconstruction'],head=r['head'],trainMSE=r['train']['mse'],validationMSE=r['validation']['mse'],validationAccuracy=r['validation']['accuracy'])
    return dict(preprocess=s['preprocess'],pcaModel=s['pcaModel'],pca=shrink(s['pca']),selected=shrink(s['selected']))
def audit(a=2,b=.5,standardized=False):
    s=study(a,b,standardized);raw=records(a,b,'test');test=transform(raw,s['preprocess']);flipped=transform([dict(r,x=[r['x'][0],-r['x'][1]]) for r in raw],s['preprocess'])
    return dict(pcaTest=metrics(test,s['pca']['w'],s['pca']['head']),selectedTest=metrics(test,s['selected']['w'],s['selected']['head']),polarityPcaTest=metrics(flipped,s['pca']['w'],s['pca']['head']),polaritySelectedTest=metrics(flipped,s['selected']['w'],s['selected']['head']))
def contrastive(a=2,b=.5,temperature=.5):
    c=(b*b-a*a)/(a*a+b*b)
    def loss(pos,neg):
        x=(neg-pos)/temperature
        return max(x,0)+math.log1p(math.exp(-abs(x)))
    return dict(cosPositive=c,cosWrong=-c,informative=loss(1,-1),collapsed=loss(1,1),wrongPositive=loss(-1,-1),falseNegative=loss(1,1))
