import json,sys,numpy as np
records=json.load(open(sys.argv[1],encoding='utf-8'))
x=np.array([-1.,-.5,0.,.5,1.]);v=np.array([-.8,-.2,.2,.8]);t=np.array([-.9,-.6,-.3,.3,.6,.9])
maximum=0.
for row in records:
    k,a,d=row['degree'],row['noise'],row['shift']
    y=1+2*x+a*np.array([1,-1,1,-1,1])
    coeff=np.linalg.lstsq(np.vander(x,k+1,increasing=True),y,rcond=None)[0]
    pred=lambda z:np.polynomial.polynomial.polyval(z,coeff)
    expected=dict(c=coeff.tolist(),train=float(np.mean((pred(x)-y)**2)),validation=float(np.mean((pred(v)-(1+2*v))**2)),test=float(np.mean((pred(t)-(1+2*t+d*t*t))**2)))
    for key in expected:
        err=float(np.max(np.abs(np.array(expected[key])-np.array(row['result'][key]))))
        maximum=max(maximum,err)
        assert err<1e-9,(row,key,err)
print(json.dumps(dict(pass_=True,cases=len(records),maximum_error=maximum,reference='NumPy SVD lstsq; actual TypeScript uses pivoted normal equations')))
