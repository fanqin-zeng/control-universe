import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import lsq_linear

default=dict(mean=.5,P=1.,Q=.25,R=.25,capacity=1.,spike=0.)
def original(c,bounded=True):
    y=np.array([.2,1.4+c['spike'],1.1]);d=np.array([.5,0.])
    A=np.zeros((6,3));b=np.zeros(6);A[0,0]=1/np.sqrt(c['P']);b[0]=c['mean']/np.sqrt(c['P'])
    for i in range(2):A[i+1,i]=-1/np.sqrt(c['Q']);A[i+1,i+1]=1/np.sqrt(c['Q']);b[i+1]=d[i]/np.sqrt(c['Q'])
    for i in range(3):A[i+3,i]=1/np.sqrt(c['R']);b[i+3]=y[i]/np.sqrt(c['R'])
    if not bounded:x=np.linalg.lstsq(A,b,rcond=None)[0]
    elif c['capacity']==0:x=np.zeros(3)
    else:
        opt=lsq_linear(A,b,bounds=(0,c['capacity']),tol=1e-13,max_iter=1000,lsmr_tol=1e-14);assert opt.success;x=opt.x
    return dict(x=x,cost=.5*np.sum((A@x-b)**2),measurement=y-x,process=np.diff(x)-d,A=A,b=b)

def kf(measurements,mean=.5,P=1.,Q=.25,R=.25,inputs=None):
    inputs=[.5]+[0.]*(len(measurements)-2) if inputs is None else inputs
    filtered=[];priors=[]
    for i,y in enumerate(measurements):
        priors.append((mean,P));K=P/(P+R);mean=mean+K*(y-mean);P=(1-K)*P;filtered.append((mean,P))
        if i<len(measurements)-1:mean+=inputs[i];P+=Q
    return filtered,priors
