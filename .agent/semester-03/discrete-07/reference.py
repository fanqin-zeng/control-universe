"""Independent state-space and high-precision reference; no python-control imports."""
import json,sys,math
import numpy as np
import mpmath as mp
from scipy.optimize import brentq
mp.mp.dps=60
M=mp.mpf
def budget(params):
    ts,d,w,p,r,work=map(lambda x:M(str(x)),params)
    x=w*ts/2000
    upper=2000*((p-r)*mp.pi/(180*w)-d/1000)
    loss=(ts/2000+d/1000)*w*180/mp.pi
    return dict(upperMs=float(upper),loss=float(loss),estimatedPM=float(p-loss),holdAmplitude=float(abs(mp.sin(x)/x)),ratio=float(2000*mp.pi/(ts*w)),deadlineOK=ts>=work,phaseOK=ts<=upper,feasible=upper>=work)
max_ts_error=0
for case in json.load(open(sys.argv[1],encoding='utf-8')):
    expected=budget(case['params'])
    for name,v in expected.items():
        a=case['result'][name]
        if isinstance(v,bool):assert a==v
        else:
            error=abs(a-v);max_ts_error=max(max_ts_error,error)
            assert error<1e-10,(name,a,v)
Ap=mp.matrix([[0,1],[-100,-2]]); Bp=mp.matrix([0,100]); Cp=mp.matrix([[1,0]])
Ac=mp.matrix([[0,0],[0,-100]]); Bc=mp.matrix([1,100]); Cc=mp.matrix([[10,-50]])
def model(ts):
    h=M(str(ts)); aug=mp.matrix(3);aug[:2,:2]=Ap;aug[:2,2]=Bp
    ex=mp.expm(h*aug); P=ex[:2,:2]; Q=ex[:2,2]
    inv=(mp.eye(2)-h*Ac/2)**-1
    A=inv*(mp.eye(2)+h*Ac/2); B=inv*Bc*h; C=Cc*inv; D=55+(Cc*inv*Bc)[0]*h/2
    cl=mp.matrix(4);cl[:2,:2]=P-Q*D*Cp;cl[:2,2:]=Q*C;cl[2:,:2]=-B*Cp;cl[2:,2:]=A
    rhs=mp.matrix(4,1);rhs[:2,0]=Q*D;rhs[2:,0]=B
    rho=max(abs(v) for v in mp.eig(cl,left=False,right=False))
    Pn=np.array(P.tolist(),float);Qn=np.array(Q.tolist(),float);An=np.array(A.tolist(),float);Bn=np.array(B.tolist(),float);Cn=np.array(C.tolist(),float)
    def freq(w):
        z=np.exp(1j*w*ts)
        return (np.array([[1.,0.]])@np.linalg.solve(z*np.eye(2)-Pn,Qn))[0,0]*(float(D)+(Cn@np.linalg.solve(z*np.eye(2)-An,Bn))[0,0])
    # Independent bisection of the unit-gain equation. Phase branch anchored to negative low-frequency phase.
    grid=np.geomspace(.001,np.pi/ts*(1-1e-7),3000)
    vals=np.array([freq(w) for w in grid]); f=np.abs(vals)-1
    phase=np.unwrap(np.angle(vals));phase-=2*np.pi if phase[0]>0 else 0
    cross=[]
    for k in np.where(f[:-1]*f[1:]<0)[0]:
        w=brentq(lambda v:abs(freq(v))-1,grid[k],grid[k+1],xtol=1e-12)
        angle=np.angle(freq(w));angle+=2*np.pi*round((np.interp(w,grid,phase)-angle)/(2*np.pi))
        cross.append([float(w),float(180+angle*180/np.pi)])
    return np.array(cl.tolist(),float),np.array(rhs.tolist(),float).reshape(-1),float(rho),cross
metrics=[];curves=[]
for ts in [.001,.005,.01,.02,.05,.08,.1,.2]:
    cl,rhs,rho,cross=model(ts);x=np.zeros(4);ys=[]
    for k in range(int(math.floor(5/ts+1e-9))+1):ys.append(float(x[0]));x=cl@x+rhs
    metrics.append([ts,rho,min((p[1] for p in cross),default=None),max(ys),ys[-1],(len(ys)-1)*ts]);curves.append(ys)
# Closed-loop continuous state matrix, independent of transfer polynomial construction.
Mc=np.block([[np.array((Ap-Bp*55*Cp).tolist(),float),np.array((Bp*Cc).tolist(),float)],[-np.array((Bc*Cp).tolist(),float),np.array(Ac.tolist(),float)]])
def continuous(w):
    s=1j*w
    return 100/(s*s+2*s+100)*(5+10/s+.5*s/(1+.01*s))
wc=brentq(lambda w:abs(continuous(w))-1,10,100,xtol=1e-12)
pmc=180+np.angle(continuous(wc))*180/np.pi
scan=[]
for ts in np.linspace(.001,.2,100):
    _,_,rho,cross=model(ts);scan.append([float(ts),min((p[1] for p in cross),default=None),rho])
# Motor state transition uses a 60-digit exponential and a separate component-wise recurrence.
aug=mp.matrix(4);aug[:3,:3]=mp.matrix([[-500,-10,0],[1,M('-.1'),0],[0,1,0]]);aug[:3,3]=mp.matrix([1000,0,0])
E=np.array(mp.expm(aug*M('.00001')).tolist(),float)
cmetrics=[];ccurves=[]
for ticks in [(100,10,1),(100,100,100),(1000,100,10)]:
    h=[t*1e-5 for t in ticks];x=[0.,0.,0.];ints=[0.,0.,0.];prev=[0.,0.,0.];held=[0.,0.,0.];counts=[0,0,0];ys=[x[:]];peak=0
    for step in range(50000):
        for loop,(kp,ki,kd),limit in zip(range(3),[(8,1,.05),(5,10,.01),(2,50,.001)],[100,200,400]):
            if step%ticks[loop]==0:
                target=1 if loop==0 else held[loop-1];error=target-x[2-loop]
                ints[loop]+=ki*h[loop]*error
                raw=kp*error+ints[loop]+kd*(error-prev[loop])/h[loop]
                held[loop]=min(limit,max(-limit,raw));prev[loop]=error;counts[loop]+=1
        state=x+[held[2]];x=[sum(E[i,j]*state[j] for j in range(4)) for i in range(3)];peak=max(peak,x[2])
        if (step+1)%100==0:ys.append(x[:])
    cmetrics.append([peak,x[2],abs(1-x[2]),*counts]);ccurves.append(ys)
qwc=float(mp.findroot(lambda w:abs(10*(2*mp.j*w+5)/((mp.j*w)**2*(mp.j*w+2)))-1,4.5))
qphase=float(mp.arg(10*(2*mp.j*qwc+5)/((mp.j*qwc)**2*(mp.j*qwc+2)))*180/mp.pi)-180
roots=np.roots([1,2,20,50])
answer=[qwc,qphase,float(max(roots.real)),float(2*(M('51.3')-40)*mp.pi/(180*M('4.5'))),*[float(2*mp.pi/(20*w)) for w in [500,50,5]],.00071,float(2*(15*mp.pi/(180*200)-M('.00071'))),float(55-(M('.001')/2+M('.00071'))*200*180/mp.pi)]
report=dict(pass_=True,max_ts_error=max_ts_error,response_metrics=metrics,response_curves=curves,wc=wc,pmc=pmc,scan=scan,budget_rows=[[t,d,budget([t,d,100,60,45,.7])['upperMs'],budget([t,d,100,60,45,.7])['estimatedPM']] for t,d in [(3,1),(5,0),(5,1),(.5,1),(1,3)]],answer_values=answer,losses=[90,18,9,6,3.6],hold_losses=[float(w*M('.001')/2*180/mp.pi) for w in [100,1000]],extra_answers=[float(mp.atan(M(1)/3)*180/mp.pi),float(2*mp.pi/(M(".05")*M("4.5")))],application_ratios=[2*math.pi/(t*w) for t,w in zip([1,.1,.05,.001,.0001,.00001],[.01,.1,.5,50,200,1000])],cascade_results=cmetrics,cascade_curves=ccurves)
print(json.dumps(report,allow_nan=False))
