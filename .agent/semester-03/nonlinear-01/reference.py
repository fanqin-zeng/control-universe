import json,sys,numpy as np
data=json.load(open(sys.argv[1],encoding='utf-8'));maximum=0.
for row in data:
    kind,A,p=row['kind'],row['A'],row['p'];r=row['r'];u=np.array(r['uGrid'])
    if kind=='hysteresis':rise=u+p;fall=u-p;area=4*p*A
    elif kind=='backlash':
        # Closed-form periodic play branches, including an input too small to engage.
        if A>p:rise=np.maximum(-A+p,u-p);fall=np.minimum(A-p,u+p);area=4*p*(A-p)
        else:rise=fall=np.full_like(u,np.clip(-A,A-p,-A+p));area=0.
    else:
        def f(x):
            if kind=='saturation':return np.clip(x,-p,p)
            if kind=='deadzone':return np.sign(x)*np.maximum(abs(x)-p,0)
            if kind=='relay':return np.where(x>=0,p,-p)
            return x+p*x**3
        rise=fall=f(u);area=0.
    for key,reference in [('yRise',rise),('yFall',fall)]:
        err=float(np.max(abs(np.array(r[key])-reference)));assert err<1e-12,(kind,key,err);maximum=max(maximum,err)
    assert abs(r['area']-area)<1e-5,(kind,r['area'],area)
    yy=np.array(r['yy'][:-1]);n=len(yy);amps=2*abs(np.fft.rfft(yy))/n
    assert abs(r['b1']-amps[1])<1e-11
    assert abs(r['b3']-amps[3])<1e-11
    thd=100*np.linalg.norm(amps[2:26])/amps[1] if amps[1]>1e-12 else 0
    assert abs(r['thd']-thd)<1e-9
print(json.dumps({'pass':True,'cases':len(data),'maxBranchError':maximum}))
