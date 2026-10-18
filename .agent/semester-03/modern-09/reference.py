import sys,json
import numpy as np
from scipy.linalg import solve_continuous_are
raw=json.load(open(sys.argv[1],encoding='utf-8'));M,m,l,g=1,.1,.5,9.81
H=np.array([[M+m,m*l],[m*l,4*m*l*l/3]]);v=np.linalg.solve(H,[[0,1],[m*g*l,0]])
A=np.array([[0,1,0,0],[0,0,v[0,0],0],[0,0,0,1],[0,0,v[1,0],0]]);B=np.array([[0],[v[0,1]],[0],[v[1,1]]]);C=np.array([[1,0,0,0],[0,0,1,0]])
Pc=solve_continuous_are(A,B,np.diag([1.,1.,10.,10.]),[[.1]]);K=10*B.T@Pc
Pe=solve_continuous_are(A.T,C.T,1.6e-5*np.eye(4),1e-4*np.eye(2));L=Pe@C.T/1e-4;N=float((-1/(C[:1]@np.linalg.solve(A-B@K,B))).item())
def normals(seed):
    state=seed;out=[]
    for i in range(3000):
        row=[]
        for j in range(3):
            state=(1664525*state+1013904223)%2**32;u=(state+.5)/2**32;state=(1664525*state+1013904223)%2**32;v=(state+.5)/2**32
            radius=np.sqrt(-2*np.log(u));row.extend([radius*np.cos(2*np.pi*v),radius*np.sin(2*np.pi*v)])
        out.append(row)
    return np.array(out)
streams={seed:normals(seed) for seed in [7,23,101]};dt=.002;Ad=np.eye(8)+dt*np.block([[A,np.zeros((4,4))],[L@C,A-L@C]]);Bd=np.r_[B.ravel(),B.ravel()]*dt;records=[];maximum=0.
for row in raw['cases']:
    sw,sv,seed=row['params'];z=np.r_[np.array([0.,0.,.05,0.]),np.zeros(4)];noise=np.block([[sw*np.eye(4),np.zeros((4,2))],[np.zeros((4,4)),sv*L]])*np.sqrt(dt);history=[];forces=[]
    for i in range(3001):
        force=float(np.clip((-K@z[4:]+N*.1).item(),-50,50));history.append(z.copy());forces.append(force)
        if i<3000:z=Ad@z+Bd*force+noise@streams[seed][i]
    history=np.array(history);forces=np.array(forces);idx=np.arange(0,3001,10);points=np.c_[idx*dt,history[idx,0],history[idx,4],history[idx,2],history[idx,6],forces[idx]]
    error=history[1500:,:4]-history[1500:,4:];rmse=[float(np.sqrt(np.mean(error[:,0]**2))),float(np.sqrt(np.mean(error[:,2]**2)))];peak=float(max(abs(forces)))
    value=float(max(np.max(abs(points-np.array(row['points']))),np.max(abs(np.array(rmse)-row['rmse'])),abs(peak-row['peak'])));assert value<1e-8,value;maximum=max(maximum,value)
    records.append({'params':row['params'],'points':points.tolist(),'rmse':rmse,'peak':peak})
for name,value in [('A',A),('B',B),('K',K),('L',L),('P',Pc),('Pe',Pe)]:assert np.max(abs(value-np.array(raw['design'][name])))<1e-8,name
print(json.dumps({'records':records,'maxError':maximum,'gains':{'K':K.tolist(),'L':L.tolist(),'N':N}}))
