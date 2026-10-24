"""Independent Decimal filter evaluation and analytic plant convolution.
NB plant uses numpy.exp; here math.expm1 and explicit velocity/position formulas.
"""
import json,math,sys
from decimal import Decimal as D
cases=json.load(open(sys.argv[1],encoding='utf-8'))
max_error=0.
for a in cases:
    n,c,k=map(lambda x:D(str(x)),[a['N'],a['c'],a['kb']])
    alpha=D(1)/(D(1)+n/D(10)); derivative=(D(1)-alpha)*D('.5')*c/D('.1')
    expected={'alpha':alpha,'derivative':derivative,'integralNext':D('1.1')-k/D(5),'pole':D(1)-k/D(10),'raw':D(3),'actual':D(1),'Ts':D('.1')}
    for key,v in expected.items():
        err=abs(float(v)-a['result'][key]);max_error=max(max_error,err);assert err<1e-10
    for i,p in enumerate(a['result']['response']):
        assert abs(p['time']-i*.1)<1e-12
        assert abs(p['derivative']-float(derivative*alpha**i))<1e-10
    assert a['result']['trackingStable']==(D(0)<k<D(20))

# Explicit arithmetic makes algorithm/units independent from notebook arrays.
samples=[1.,.5,-.2,0.,.4,.1]
equivalence={}
for rule in ['rectangle','trapezoid']:
    integ=0.;past=0.;us=[]
    for e in samples:
        integ+=.1*(e if rule=='rectangle' else .5*(e+past))
        us.append(2*e+integ+5*(e-past));past=e
    equivalence[rule]=us
metrics={}
for scenario in ['reachable','unreachable','release']:
    metrics[scenario]={}
    for mode in ['ordinary','separation','variable','backcalc']:
        y=integ=iae=0.;peak=0.;maxu=0.
        for k in range(1201):
            t=k/100
            r=.5 if scenario=='reachable' else 0. if scenario=='release' and k>=400 else 10.
            e=r-y;raw=2*e+integ;u=max(-5.,min(5.,raw))
            peak=max(peak,y);maxu=max(maxu,abs(u))
            if k==1200:break
            iae+=.01*abs(e)
            gate=float(abs(e)<=2) if mode=='separation' else math.exp(-.5*abs(e)) if mode=='variable' else 1.
            integ+=.01*(gate*e+(2*(u-raw) if mode=='backcalc' else 0))
            y+=(-math.expm1(-.01))*(u-y)
        metrics[scenario][mode]={'IAE':iae,'peak_y':peak,'last_y':y,'last_I':integ,'max_abs_u':maxu}

ko=2*math.sqrt(1.01);q=v=integ=rv=0.;peak=maxu=0.
for k in range(1601):
    if k%4==0:rv=max(-2.,min(2.,ko*(1-q)))
    error=rv-v;itrial=integ+.02*error;raw=.4*error+itrial;u=max(-5.,min(5.,raw));integ=itrial+.01*(u-raw)
    peak=max(peak,q);maxu=max(maxu,abs(u))
    if k==1600:break
    # Analytic integration of v'= -10v+50u, q'=v under held u.
    a=-math.expm1(-.05)
    q+=v*a/10+5*u*(.005-a/10)
    v+=(5*u-v)*a
cascade={'last_position':q,'peak_position':peak,'max_abs_u':maxu,'samples':1601}
print(json.dumps({'maxTsError':max_error,'equivalence':equivalence,'metrics':metrics,'cascade':cascade,'outer_gain':ko}))
