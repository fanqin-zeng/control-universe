import json,sys,numpy as np
from scipy.optimize import linprog
rows=json.load(open(sys.argv[1],encoding='utf-8'));maxerr=0.;optimal_cases=0
def finite_lp(p,g,n):
    if not n:return np.zeros((1,2))
    dim=2*n;A=[];B=[];E=[];F=[]
    for h in range(n):
        for prev,reward in [(0,10*p-4),(1,-1)]:
            row=np.zeros(dim);row[2*h]=-1
            if h:row[2*(h-1)+prev]=g
            A.append(row);B.append(-reward)
        row=np.zeros(dim);row[2*h+1]=1
        if h:row[2*(h-1)]=-g
        E.append(row);F.append(6)
    out=linprog(np.ones(dim),A_ub=A,b_ub=B,A_eq=E,b_eq=F,bounds=[(None,None)]*dim,method='highs')
    assert out.success,out.message
    return np.vstack((np.zeros(2),out.x.reshape(n,2)))
for row in rows:
    p,g,a,n,opt=row['params'];x=row['result'];P=np.array([[1-a,a],[1.,0.]]);r=np.array([(1-a)*(10*p-4)-a,6.])
    if opt:
        hist=finite_lp(p,g,n);optimal_cases+=1
        A=np.array([[-(1-g),0.],[-1.,g],[g,-1.]])
        out=linprog(np.ones(2),A_ub=A,b_ub=[-(10*p-4),1.,-6.],bounds=[(None,None)]*2,method='highs');assert out.success;exact=out.x
    else:
        M=np.eye(3);M[:2,:2]=g*P;M[:2,2]=r
        hist=np.array([(np.linalg.matrix_power(M,k)@np.array([0.,0.,1.]))[:2] for k in range(n+1)])
        exact=np.linalg.solve(np.eye(2)-g*P,r)
    e=max(np.max(np.abs(np.array(x['history'])-hist)),np.max(np.abs(np.array(x['exact'])-exact)))
    maxerr=max(maxerr,float(e));assert e<1e-9,(row['params'],e)
    error=np.max(np.abs(hist[-1]-exact));assert error<=x['bound']+1e-9
print(json.dumps({'pass':True,'configs':len(rows),'finiteHorizonLP':optimal_cases,'maxError':maxerr,'reference':'matrix powers/linear solve for policy; time-expanded LP and stationary LP for optimal'}))
