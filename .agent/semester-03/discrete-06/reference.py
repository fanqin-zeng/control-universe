import json,math,sys
import numpy as np
import mpmath as mp
from decimal import Decimal,localcontext
from scipy.optimize import brentq
mp.mp.dps=60
cases=json.load(open(sys.argv[1],encoding='utf8'));max_error=0.
for case in cases:
    a,T=[mp.mpf(str(x)) for x in case['params']];h=a*T
    poles=[1-h,1/(1+h),(1-h/2)/(1+h/2),mp.exp(-h)]
    actual=case['result'];assert actual['stable']==[abs(p)<1 for p in poles]
    for j,p in enumerate(poles):
        max_error=max(max_error,abs(actual['multipliers'][j]-float(p)))
        assert abs(actual['multipliers'][j]-float(p))<1e-12
        for k,row in enumerate(actual['samples'][j]):assert abs(mp.mpf(row[1])-p**k)<=mp.mpf('2e-12')*max(1,abs(p**k))

def matched(kp,ki,T):
    kp,ki,T=map(mp.mpf,map(str,[kp,ki,T]));q=mp.exp(-ki/kp*T);zr=mp.exp(1j*T)
    g=abs(kp+ki/1j)*abs(zr-1)/abs(zr-q);return q,g
q,gain=matched(.005,.05,.01)
def pi_values(z,kp,ki,T):
    q,g=matched(kp,ki,T)
    return [kp+ki*T/(z-1),kp+ki*T*z/(z-1),kp+ki*T/2*(z+1)/(z-1),g*(z-q)/(z-1)]
metrics=[]
for w in [.1,1,5,50]:
    z=mp.exp(mp.j*mp.mpf(str(w))*.01);c=mp.mpf('.005')+mp.mpf('.05')/(mp.j*w)
    metrics.append([[float(100*(abs(v)/abs(c)-1)),float(mp.arg(v/c)*180/mp.pi)] for v in pi_values(z,mp.mpf('.005'),mp.mpf('.05'),mp.mpf('.01'))])
w=np.geomspace(.1,.95*np.pi/.01,500);curvePairs=[[] for _ in range(4)]
for omega in w:
    z=mp.exp(mp.j*mp.mpf(str(omega))*mp.mpf('.01'))
    for j,v in enumerate(pi_values(z,mp.mpf('.005'),mp.mpf('.05'),mp.mpf('.01'))):curvePairs[j].append([float(mp.re(v)),float(mp.im(v))])
coefficients=[[.005,-.0045],[.0055,-.005],[.00525,-.00475],[float(gain),float(-gain*q)]]

aw=[];summary=[]
with localcontext() as ctx:
    ctx.prec=50
    d=Decimal;T=d('.01');p=(-d(10)*T).exp();b=d(100)*(1-p)
    for limit,release in [(50,False),(.6,False),(.6,True)]:
        pair=[];rows=[]
        for kb in [0,10]:
            y=[d(0)];I=[d(0)];raw=[];us=[];ref=[];lim=d(str(limit))
            for k in range(500):
                r=d(100) if not release or k<250 else d(0);e=r-y[-1];u=d('.005')*e+I[-1];v=max(-lim,min(lim,u))
                raw.append(u);us.append(v);ref.append(r)
                I.append(I[-1]+T*(d('.05')*e+d(kb)*(v-u)));y.append(p*y[-1]+b*v)
            pair.append([[float(x) for x in arr] for arr in [y,I,raw,us,ref]])
            rows.append([float(max(y)),float(max(map(abs,I))),sum(abs(x-v)>d('1e-12') for x,v in zip(raw,us)),float(y[-1])])
        aw.append(pair);summary.append(rows)

def digital_loop(T,kp=.005,ki=.05,gain=1000,rate=10):
    t=mp.mpf(str(T));p=mp.exp(-rate*t);b=mp.mpf(str(gain))/rate*(1-p);kp=mp.mpf(str(kp));ki=mp.mpf(str(ki))
    def loop(omega):
        z=mp.exp(mp.j*mp.mpf(str(omega))*t);return b/(z-p)*(kp+ki*t/2*(z+1)/(z-1))
    A=mp.matrix([[p-b*(kp+ki*t/2),b*ki],[-t,1]]);B=mp.matrix([b*(kp+ki*t/2),t])
    return loop,A,B
def analyze(T,kp=.005,ki=.05,gain=1000,rate=10):
    H,A,B=digital_loop(T,kp,ki,gain,rate)
    wc=brentq(lambda w:float(mp.log(abs(H(w)))),.01,.95*math.pi/T,xtol=1e-12)
    phase=float(180+mp.arg(H(wc))*180/mp.pi)
    def closed(w):
        L=H(w);return L/(1+L)
    bw=brentq(lambda w:float(abs(closed(w)))-1/math.sqrt(2),1e-5,.999999*math.pi/T,xtol=1e-12)
    eigen=mp.eig(A,left=False,right=False);rho=float(max(map(abs,eigen)))
    return H,A,B,phase,wc,bw,rho
responses=[];freq_curves=[];sweep=[]
for T in [.001,.005,.01,.02,.05,.1]:
    H,A,B,pm,wc,bw,rho=analyze(T)
    x=mp.matrix([0,0]);N=round(3/T);time=np.arange(N+1)*T;ys=[]
    for k in range(N+1):ys.append(float(x[0]));x=A*x+B
    responses.append([time.tolist(),ys]);first=float(time[np.flatnonzero(np.array(ys)>=.9)[0]])
    sweep.append([T,rho,pm,wc,bw,first,float(max(0,max(ys)-1)*100)])
    omega=np.geomspace(.1,.95*np.pi/T,500);values=[H(float(w)) for w in omega]
    freq_curves.append([omega.tolist(),[float(mp.re(v)) for v in values],[float(mp.im(v)) for v in values]])
motor_metrics=[sweep[2][2],sweep[2][3],sweep[2][4],math.log(10)/5,sweep[2][5],max(abs(np.array(responses[2][1])-(1-np.exp(-5*np.array(responses[2][0])))))]
qc,qg=matched(2,.5,.05);q1coeff=[[2,-1.975],[2.025,-2],[2.0125,-1.9875],[float(qg),float(-qg*qc)]]
T=mp.mpf('.1');omega=mp.mpf(2);kappa=omega/mp.tan(omega*T/2);warped=2/T*mp.tan(omega*T/2)
q2coeff=[float(10+20/kappa),float(-10+20/kappa)]
initial_bw=analyze(.02,.04,.2,250,5)[5]
def target(kp):
    H,_,_=digital_loop(.02,kp,5*kp,250,5);L=H(10);return float(abs(L/(1+L)))-1/math.sqrt(2)
refined=brentq(target,.01,.05,xtol=1e-14);res=analyze(.02,refined,5*refined,250,5)
q4metrics=[initial_bw,refined,5*refined,res[5],res[6]]
result=dict(pass_=True,tsCases=len(cases),maxMultiplierError=max_error,q=float(q),gain=float(gain),coefficients=coefficients,metrics=metrics,curvePairs=curvePairs,aw=aw,summary=summary,motor_metrics=motor_metrics,y_disc=responses[2][1],y_cont=(1-np.exp(-5*np.array(responses[2][0]))).tolist(),sweep=sweep,responses=responses,freq_curves=freq_curves,q1coeff=q1coeff,qzero=float(qc),qgain=float(qg),q2coeff=q2coeff,warped=float(warped),kappa=float(kappa),q4metrics=q4metrics)
result.update(alpha=float(mp.mpf(5)/6),beta=float(mp.mpf(5)/3),derivativePeak=float(mp.mpf(20)/11),ratios=[float(mp.tan(x/2)/(x/2)) for x in [mp.mpf(".1"),mp.mpf(".3"),mp.mpf(".5"),mp.mpf(1),mp.pi/2]],tau=float(-mp.mpf(".01")/mp.log(mp.mpf(".9"))),targetQ2=[10.,-10.])
print(json.dumps(result))
