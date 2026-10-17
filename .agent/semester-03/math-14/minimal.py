import sympy as s
from scipy.integrate import quad
u0,u1=s.symbols('u0 u1');x0=s.Integer(2);x1=x0+u0;x2=x1+u1
J=(x0*x0+u0*u0+x1*x1+u1*u1+x2*x2)/2
sol=s.solve([s.diff(J,u0),s.diff(J,u1)],[u0,u1]); print('dense optimum',sol,'x',x1.subs(sol),x2.subs(sol),'J',J.subs(sol))
t,e=s.symbols('t e',real=True);path=t+e*s.sin(s.pi*t);F=s.integrate(s.diff(path,t)**2/2,(t,0,1));print('functional',s.simplify(F));print('continuous s1 J',quad(lambda t:4*s.exp(-2*t),(0),1)[0]+2*float(s.exp(-2)))
