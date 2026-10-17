from fractions import Fraction as F
from itertools import product
import math
p,t,f=F(1,100),F(9,10),F(1,20)
cells=[p*t,p*(1-t),(1-p)*f,(1-p)*(1-f)]
print('joint/expected10000:',cells,[v*10000 for v in cells])
print('bell/posterior/union:',cells[0]+cells[2],cells[0]/(cells[0]+cells[2]),p+cells[2])
print('prior.1 posterior:',F(1,10)*t/(F(1,10)*t+F(9,10)*f))
values=[F(b)+sum(F(e) for e in es)/4 for b,*es in product([-1,1],repeat=5)]
print('common mean/variance:',sum(values)/32,sum(x*x for x in values)/32)
print('normal +-sigma:',math.erf(1/math.sqrt(2)))
assert cells[0]/(cells[0]+cells[2])==F(2,13)
