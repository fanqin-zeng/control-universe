from fractions import Fraction as F
import cmath,json, sympy as s
z=3+4j
print(json.dumps({'cases':[{'a':a,'b':b,'r':abs(complex(a,b)),'angle':None if a==b==0 else cmath.phase(complex(a,b))*180/cmath.pi} for a,b in [(3,4),(-3,4),(0,1),(0,-1),(0,0),(-5,-5)]],'sum':[4,2],'product':[-5,10],'quotient':[str(F(11,5)),str(F(-2,5))],'polar_product':[0,6],'rotation':[-4,3],'motion':[{'t':t/4,'position':(t/4)**2,'speed':2*t/4} for t in range(17)]},indent=2))
