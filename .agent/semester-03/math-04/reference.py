import json, sympy as s
P=s.Matrix([[1,1],[1,-1]])
cases=[]
for p in [s.Rational(1,2),s.Rational(3,4),1,s.Rational(5,4)]:
    for q in [s.Rational(-3,4),s.Rational(-1,2),0,s.Rational(1,2),s.Rational(3,4)]:
        A=P*s.diag(p,q)*P.inv()
        for k in range(9):
            z=P.inv()*(A**k)*s.Matrix([2,0])
            trajectory=[]
            for i in range(9):
                x=A**i*s.Matrix([2,0])
                c=P.inv()*x
                trajectory.append(dict(k=i,first=x[0],second=x[1],plus=c[0],minus=c[1]))
            cases.append(dict(p=p,q=q,k=k,matrix=A.tolist(),eigenvalues=[p,q],state=list(A**k*s.Matrix([2,0])),modes=list(z),trajectory=trajectory))
print(json.dumps(dict(cases=cases),default=lambda x:float(x)))
