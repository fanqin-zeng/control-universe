"""Independent closed forms: no source-cell copying, expm or Lyapunov solver."""
import json
import numpy as np

cases=[]
for c in [-.5,0.,1.]:
    t=np.linspace(0,6,601);w=np.sqrt(1-c*c/4)
    q=np.exp(-c*t/2)*(np.cos(w*t)+c*np.sin(w*t)/(2*w))
    v=-np.exp(-c*t/2)*np.sin(w*t)/w
    cases.append(dict(c=c,states=np.column_stack([q,v]).tolist(),E=((q*q+v*v)/2).tolist()))
eigenP=np.array([(5-np.sqrt(10))/12,(5+np.sqrt(10))/12])
beta=1/eigenP[-1];prefactor=np.sqrt(eigenP[-1]/eigenP[0]);cert=[]
for angle in np.linspace(0,2*np.pi,16,endpoint=False):
    t=np.linspace(0,6,301);a,b=np.cos(angle),np.sin(angle)
    x=np.exp(-t)*a+(np.exp(-t)-np.exp(-3*t))*b;y=np.exp(-3*t)*b
    cert.append(dict(norm=np.sqrt(x*x+y*y).tolist(),V=(x*x/2+x*y/2+y*y/3).tolist(),bound=(prefactor*np.exp(-beta*t/2)).tolist()))
r=np.sqrt(3)
P=[[r,1.],[1.,r]];Pcl=[[5/(2*r),.5],[.5,1/r]];Pobs=[[1/r,-.5],[-.5,5/(2*r)]]
return_difference=(1+np.logspace(-2,2,401)**-2+np.logspace(-2,2,401)**-4).tolist()
print(json.dumps(dict(cases=cases,cert=cert,beta=beta,prefactor=prefactor,P=P,K=[[1.,r]],L=[[r],[1.]],Pcl=Pcl,Pobs=Pobs,return_difference=return_difference)))
