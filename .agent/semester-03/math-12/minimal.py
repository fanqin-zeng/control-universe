import sympy as s
from scipy.integrate import quad
import math
a=s.Rational(1,2);q=s.Rational(3,4)
print('P1/P2/P3/Pinf:',q,a*a*q+q,a**4*q+a*a*q+q,q/(1-a*a))
for a in [s.Rational(-1,2),s.Integer(0),s.Rational(1,2)]:
 print('a/4点平均方差:',a,(4+2*sum((4-l)*a**l for l in range(1,4)))/16)
T=s.Matrix([[s.Rational(4,5),s.Rational(1,5)],[s.Rational(3,10),s.Rational(7,10)]])
p=s.Matrix([[1,0]]);print('chain:',p*T,p*T*T,s.Matrix([[s.Rational(3,5),s.Rational(2,5)]])*T)
A=s.diag(s.Rational(1,2),s.Rational(1,4));Q=s.Matrix([[s.Rational(3,4),s.Rational(1,4)],[s.Rational(1,4),s.Rational(15,16)]])
P=s.Matrix([[1,s.Rational(2,7)],[s.Rational(2,7),1]])
print('vector P2/Pinf residual:',A*Q*A.T+Q,P-A*P*A.T-Q)
print('PSD theta0/pi2/pi:',3,3/5,s.Rational(1,3))
