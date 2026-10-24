"""Independent continuous-feedback DOP853 check; the lesson uses held input RK4.

Not an identical discrete model: the explicit tolerance covers O(dt) differences.
Memberships use vector hat bases, local LQR gains use scalar CARE closed forms.
"""
from pathlib import Path
import json, math
import numpy as np
from scipy.integrate import solve_ivp
from scipy.optimize import brentq

dir=Path('.agent/semester-03/intel-01')
degree=math.pi/180
def hat(x,c,h):
    a=np.maximum(0,1-np.abs(x-c)/h)
    if x<=c[0]:a[0]=1
    if x>=c[-1]:a[-1]=1
    return a
def make(n,kind='mamdani'):
    theta=np.linspace(-30,30,n)*degree;omega=np.linspace(-120,120,n)*degree
    output=np.linspace(-15,15,n);ug=np.linspace(-15,15,401)
    v=-((np.arange(n)[:,None]-(n-1)/2)+.7*(np.arange(n)[None,:]-(n-1)/2))
    rules=(np.sign(v)*np.minimum((n-1)/2,np.floor(np.abs(v)+.5))+(n-1)/2).astype(int)
    bases=np.array([hat(u,output,30/(n-1)) for u in ug]).T
    aa=19.6*np.cos(theta)
    gains=(aa+np.sqrt(aa**2+16*50))/4
    damping=np.sqrt(2*gains/4+1)
    def control(th,w):
        a=np.minimum(hat(th,theta,60*degree/(n-1))[:,None],hat(w,omega,240*degree/(n-1))[None,:])
        if kind=='sugeno':return np.sum(a*output[rules])/np.sum(a)
        if kind=='scheduled':return np.sum(a*(-gains[:,None]*th-damping[:,None]*w))/np.sum(a)
        mu=np.max(np.minimum(a[:,:,None],bases[rules]),axis=(0,1))
        return np.trapezoid(ug*mu,ug)/np.trapezoid(mu,ug)
    return control
k1=(19.6+math.sqrt(19.6**2+16*50))/4;k2=math.sqrt(k1/2+1)
controls={'LQR':lambda x,w:-k1*x-k2*w,'SMC':lambda x,w:-(4.9*math.sin(x)+1.25*w)-2*math.tanh((1.25*w+4.9*math.sin(x))/.05),
          **{'M'+str(n):make(n) for n in [3,5,7,9]},'S0':make(5,'sugeno'),'S1':make(5,'scheduled')}
cases=[('nominal',1,.5),('halfMass',.5,.5),('doubleMass',2,.5),('short',1,.35),('long',1,.75)]
expected={'LQR':[3.7007,3.14,5.49,3.26,4.64],'SMC':[3.7755,3.29,6.37,3.34,4.89],
          'M5':[3.5118,3.14,4.23,3.24,3.99],'M7':[2.9339,2.62,3.86,2.67,3.65],
          'S1':[3.7573,3.17,5.71,3.30,4.74],'M3':[11.0722],'M9':[2.8640],'S0':[3.3092]}
records=[]
for name,ctrl in controls.items():
    for index,(label,m,l) in enumerate(cases[:len(expected[name])]):
        def rhs(t,z):return [z[1],9.8/l*math.sin(z[0])+np.clip(ctrl(*z),-15,15)/(m*l*l)]
        sol=solve_ivp(rhs,[0,6],[20*degree,0],method='DOP853',rtol=2e-8,atol=2e-10,max_step=.015,dense_output=True)
        assert sol.success
        times=np.linspace(0,6,60001);angles=sol.sol(times)[0]/degree
        rms=float(np.sqrt(np.mean(angles**2)));error=abs(rms-expected[name][index])
        # The native model holds u for dt=1e-4; the reference continuously updates it.
        tolerance=.012 if index else .006
        assert error<tolerance,(name,label,rms,expected[name][index],error)
        record={'controller':name,'case':label,'referenceRmsDegrees':rms,'lessonRmsDegrees':expected[name][index],'absError':error,'tolerance':tolerance}
        records.append(record);print(json.dumps(record),flush=True)
# Independent equilibrium equation for the four constant disturbances (zero angular speed).
pd=controls['M5'];disturbances=[]
for d in [.2,.5,1,2]:
    th=brentq(lambda x:4.9*math.sin(x)+pd(x,0)+d,0,25*degree)
    disturbances.append({'torqueNm':d,'equilibriumDegrees':th/degree})
answer={'pass':True,'method':'Independent continuous feedback DOP853 vs native dt1e-4 held-input RK4','cases':records,'disturbanceEquilibria':disturbances,'lqrGain':[k1,k2]}
(dir/'dynamics-reference.json').write_text(json.dumps(answer,indent=2)+'\n')
print(json.dumps({'pass':True,'cases':len(records),'disturbances':disturbances}),flush=True)
