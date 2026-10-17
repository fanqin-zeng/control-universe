import sympy as s
x,y=s.symbols('x y',real=True); h=10-x*x-2*y*y
p={x:1,y:1}; grad=s.Matrix([s.diff(h,x),s.diff(h,y)])
print('h/grad/Hessian:',h.subs(p),grad.subs(p),s.hessian(h,(x,y)))
for a,b in [(s.Rational(1,10),0),(s.Rational(1,10),-s.Rational(1,10))]:
    print('step/pred/true/remainder',a,b,7+(grad.subs(p).dot(s.Matrix([a,b]))),h.subs({x:1+a,y:1+b}),-a*a-2*b*b)
print('direction 3/5,4/5:',grad.subs(p).dot(s.Matrix([s.Rational(3,5),s.Rational(4,5)])))
t=s.symbols('t',real=True)
print('path derivative:',s.diff(h.subs({x:s.cos(t),y:s.sin(t)}),t).subs(t,s.pi/4))
print('area integral:',s.integrate(h,(y,0,1),(x,0,1)))
