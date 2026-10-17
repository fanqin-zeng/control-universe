import json, sympy as s
cases=[]
for t in [0,s.Rational(1,4),1,s.Rational(7,4),2]:
    A=s.Matrix([[1,t],[1,2]])
    for u1 in [-2,0,2]:
        for u2 in [-1,0,1]:
            y=A*s.Matrix([u1,u2])
            grid=[]
            for k in [-1,s.Rational(-1,2),0,s.Rational(1,2),1]:
                grid.extend([[list(A*s.Matrix([-1,k])),list(A*s.Matrix([1,k]))],[list(A*s.Matrix([k,-1])),list(A*s.Matrix([k,1]))]])
            cases.append(dict(t=float(t),u1=u1,u2=u2,output=list(y),determinant=A.det(),rank=A.rank(),norm=y.norm(),grid=grid))
print(json.dumps(dict(cases=cases),default=lambda x:float(x)))
