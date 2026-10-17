import itertools,json,numpy as np,sys,scipy
# Entire-horizon elimination: x=ones*x0+S*u, solve dense strictly positive Hessian.
def dense(n,q,r,s,x0):
 S=np.tril(np.ones((n+1,n)),-1);W=np.diag([q]*n+[s]);one=np.ones(n+1)
 H=r*np.eye(n)+S.T@W@S;g=S.T@W@one
 z=np.linalg.solve(H,g);u=-z*x0;x=one*x0+S@u
 P=float(one@W@one-g@z)
 return x,u,P,float(z[0])
cases=[]
for n,q,r,s,x0 in itertools.product([2,3,5,8],[0.,.5,1.,2.],[.5,1.,2.],[0.,.5,1.,2.],[-2.,-1.,0.,1.,2.]):
 x,u,p,k=dense(n,q,r,s,x0);ps=[];ks=[]
 for i in range(n):
  _,_,pv,kv=dense(n-i,q,r,s,1.);ps.append(pv);ks.append(kv)
 ps.append(s);st=(q*x[:-1]**2+r*u**2)/2;term=s*x[-1]**2/2
 bell=[ps[k]*x[k]**2/2-st[k]-ps[k+1]*x[k+1]**2/2 for k in range(n)]
 cases.append({'parameters':[n,q,r,s,x0],'p':ps,'gains':ks,'states':x.tolist(),'actions':u.tolist(),'stages':st.tolist(),'terminal':float(term),'total':float(sum(st)+term),'value':float(p*x0*x0/2),'bellman':bell})
print(json.dumps({'versions':{'python':sys.version,'numpy':np.__version__,'scipy':scipy.__version__},'cases':cases}))
