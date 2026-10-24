import numpy as np
u=np.array([1,0,1,1,0,0,1,0],float)
y=np.zeros(9)
for k in range(8): y[k+1]=.8*y[k]+.2*u[k]
Phi=np.column_stack([y[:-1],u])
theta,_,rank,s=np.linalg.lstsq(Phi,y[1:],rcond=None)
print('batch',theta.tolist(),'rank',rank)
for lam in [1,.9]:
    t=np.zeros(2);P=np.eye(2)
    for k,(phi,target) in enumerate(zip(Phi,y[1:]),1):
        L=P@phi/(lam+phi@P@phi)
        t=t+L*(target-phi@t)
        P=(P-np.outer(L,phi)@P)/lam
    W=np.array([lam**(8-i-1) for i in range(8)])
    R=lam**8*np.eye(2)+Phi.T@(W[:,None]*Phi)
    exact=np.linalg.solve(R,Phi.T@(W*y[1:]))
    print('lambda',lam,'same_prior',t.tolist(),'batch_delta',float(np.max(abs(t-exact))))
for lam in [1,.9]:
    estimate=0.;P=1.
    for k in range(32):
        phi=[1,0,1,1][k%4];L=P*phi/(lam+phi*P*phi)
        estimate+=L*(.2*phi-phi*estimate);P=(P-L*phi*P)/lam
    print('scalar',lam,estimate,P,'no_input_P',lam**-32)
