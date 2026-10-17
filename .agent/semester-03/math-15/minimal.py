import sympy as s
import numpy as np
z=s.symbols('z',real=True);f=s.Matrix([s.cos(z),s.sin(z),0]);g=s.Matrix([0,0,1]);vars=s.Matrix(s.symbols('x y')+(z,));print('bracket',g.jacobian(vars)*f-f.jacobian(vars)*g)
e=.5;d=np.array([e*(1-np.cos(e)),-e*np.sin(e)]);a=np.array([0,-e*e]);print('net',d,'norm',np.linalg.norm(d),'approx',a,'error',np.linalg.norm(d-a),'time',4*e)
print('normalized',d/e**2)
