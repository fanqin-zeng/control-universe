import sympy as s
A=s.Matrix([[1,0],[1,1],[0,1]]); b=s.Matrix([1,2,2])
Q,R=A.QRdecomposition(); G=A.T*A; C=G.cholesky()
x=A.pinv()*b; r=b-A*x
print('QR',Q.tolist(),R.tolist()); print('Qt b',list(Q.T*b))
print('G/Cholesky',G.tolist(),C.tolist())
print('pinv',A.pinv().tolist(),'x',list(x),'r',list(r),'r2',r.dot(r),'Atr',list(A.T*r))
v1=s.Matrix([1,1])/s.sqrt(2); v2=s.Matrix([1,-1])/s.sqrt(2)
print('singular',A.singular_values(),'u1',list(A*v1/s.sqrt(3)),'u2',list(A*v2))
M=s.Matrix([[2,1],[4,3]])
print('LU',M.LUdecomposition(),'solve',list(M.LUsolve(s.Matrix([1,3]))))
print('noise',[1,s.Rational(11,10)],'error',s.Rational(1,10))
