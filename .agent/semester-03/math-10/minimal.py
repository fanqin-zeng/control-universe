import sympy as s
import numpy as np
a=s.Rational(1,2);N=8
partial=sum(a**k for k in range(N+1));print('partial/tail/infinite:',partial,2-partial,2)
print('step:',[sum(a**i for i in range(k+1)) for k in range(4)])
print('initial q4:',[4*a**(k+1) for k in range(4)])
z=s.I;H=s.simplify(1/(1-a/z));print('Hpi2/magnitude/phase:',H,s.Abs(H),s.arg(H),s.N(s.arg(H),12))
print('negative boundary partial:',[sum((-1)**k for k in range(n+1)) for n in range(5)])
print('pole mapping:',np.exp(-1),np.exp(-.5),np.exp(-2))
assert partial==s.Rational(511,256) and 2-partial==s.Rational(1,256)
