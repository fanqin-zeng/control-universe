import json,cmath,math,sys
import numpy as np
import mpmath as mp
from scipy.linalg import expm
from scipy.signal import lfilter
mp.mp.dps=60
cases=json.load(open(sys.argv[1],encoding='utf-8'))
largest=0.
for case in cases:
    sigma,omega,T=case['params'];actual=case['result']
    pole=mp.exp(mp.mpc(str(sigma),str(omega))*mp.mpf(str(T)))
    expected=[float(mp.re(pole)),float(mp.im(pole)),float(abs(pole))]
    for x,y in zip([actual['real'],actual['imag'],actual['radius']],expected):
        largest=max(largest,abs(x-y));assert abs(x-y)<1e-12
    for k,row in enumerate(actual['samples']):
        v=mp.exp(mp.mpc(str(sigma),str(omega))*mp.mpf(str(T))*k)
        assert abs(row[1]-float(mp.re(v)))<1e-11
        assert abs(row[2]-float(mp.im(v)))<1e-11

points=[-1+0j,-.5+2j,2j,.5+0j,-2+0j]
mapping=[[cmath.exp(s*.1).real,cmath.exp(s*.1).imag,abs(cmath.exp(s*.1))] for s in points]
poles=[.8,.2,-.6,.7+.5j,1.,1.1]
modes=[[complex(p)**k for k in range(50)] for p in poles]
modes=[[v.real for v in row] for row in modes]
w=np.geomspace(.1,.95*math.pi/.01,500)
block=np.array([[0.,1.,0.],[-100.,-10.,100.],[0.,0.,0.]])
E=expm(block*.01);Ad=E[:2,:2];Bd=E[:2,2]
def continuous(omega):return 100/((1j*omega)**2+10j*omega+100)
def held(omega):return (np.linalg.solve(cmath.exp(1j*omega*.01)*np.eye(2)-Ad,Bd))[0]
def tustin(omega):
    z=cmath.exp(1j*omega*.01);s=200*(z-1)/(z+1)
    return 100/(s*s+10*s+100)
responses=[[[v.real,v.imag] for v in [f(float(omega)) for omega in w]] for f in [continuous,held,tustin]]
metrics=[]
for omega in [0.,1.,10.,100.]:
    ref=continuous(omega);row=[omega]
    for f in [held,tustin]:
        H=f(omega);row += [100*(abs(H)/abs(ref)-1),cmath.phase(H/ref)*180/math.pi]
    metrics.append(row)
b=[1/421,2/421,1/421];a=[1.,-798/421,381/421]
y_filter=lfilter(b,a,np.ones(200)).tolist()
proper=lfilter([0.,.2,.1],[1.,-.8,.2],np.ones(6)).tolist()
seq=[2-2*(complex(.5,.5)**k).real for k in range(8)]
p=math.exp(-.25);z=cmath.exp(.5j);ref=5/(5+10j)
answers3=[]
for H in [(1-p)/(z-p),(z+1)/(9*z-7)]:answers3.append([abs(H),100*(abs(H)/abs(ref)-1),cmath.phase(H/ref)*180/math.pi])
manual=lfilter([0.,.2,.1],[1.,-.8,.2],np.ones(6),zi=[0.,.1])[0].tolist()
# zi above yields y0=0,y1=.3; it is intentionally not zero history.
assert abs(manual[1]-.3)<1e-12 and abs(manual[2]-.54)<1e-12
result=dict(pass_=True,tsCases=len(cases),maxTsError=largest,mapping=mapping,modes=modes,jordan=list(range(50)),
 metrics=metrics,responses=responses,b=b,a=a,y_filter=y_filter,proper=proper,normalized=[0.,.2,.1],
 seq=seq,q1b=math.exp(-.1),answers3=answers3,manual=manual,forward=200*math.atan(.25),reverse=200*math.tan(.25),
 a2=[math.exp(-.2),(1-math.exp(-.2))/2,.5], mainMagnitudes=[2.,2/math.sqrt(5),2/3])
print(json.dumps(result))
