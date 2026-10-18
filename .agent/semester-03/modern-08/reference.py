import sys,json
import numpy as np
from scipy.integrate import solve_ivp
raw=np.fromfile(sys.argv[1],dtype=np.float64).reshape(2116,501,4)
A=np.diag([-1.,-3.,-2.,-1.]);B=np.array([[1.,0.],[0.,.5],[.3,0.],[0.,1.]]);C=np.array([[1.,1.,0.,0.],[0.,0.,1.,1.]])
Kdc=-C@np.linalg.solve(A,B);t=np.linspace(0,10,501);records=[];maxerr=0.;worst=None;maxpole=-1e9
for index,(i,j) in enumerate((i,j) for i in range(5,51) for j in range(5,51)):
    kp=np.diag([i/10,j/10]);F=A-B@kp@C;forcing=B@kp@np.array([1.,0.]);pole=np.max(np.real(np.linalg.eigvals(F)));assert pole<0;maxpole=max(maxpole,pole)
    sol=solve_ivp(lambda time,x:F@x+forcing,[0,10],np.zeros(4),t_eval=t,rtol=1e-11,atol=1e-13);assert sol.success
    y=sol.y.T@C.T;u=(np.array([1.,0.])-y)@kp;allvals=np.c_[y,u];error=float(np.max(abs(allvals-raw[index])))
    if error>maxerr:maxerr=error;worst=[i/10,j/10]
    assert error<1e-8,(i,j,error)
    steady=np.linalg.solve(np.eye(2)+Kdc@kp,Kdc@kp@np.array([1.,0.]));peak=int(np.argmax(abs(y[:,1])))
    records.append({'params':[i/10,j/10],'samples':allvals[[0,50,250,500]].tolist(),'steady':steady.tolist(),'peak':[float(abs(y[peak,1])),float(t[peak])]})
print(json.dumps({'maxError':maxerr,'worst':worst,'maxRealPole':float(maxpole),'records':records}))
