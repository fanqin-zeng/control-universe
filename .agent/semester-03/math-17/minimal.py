import numpy as np
from scipy.optimize import linprog
for c in [0,.25,.45]:
 n=np.linalg.solve([[1,c],[c,1]],[2,2]);s=np.linalg.solve([[1,2*c],[2*c,1]],[2,2])
 f=lambda x:.5*(x-2)**2+c*x*x[::-1]
 print('c/NE/J/central/J/totalgap',c,n,f(n),s,f(s),sum(f(n))-sum(f(s)))
c=.25;x=np.array([0.,4.]);rows=[x.copy()]
for k in range(12):x=np.clip(2-c*x[::-1],0,4);rows.append(x.copy())
print('BR rows',np.array(rows)[[0,1,2,12]])
a=2*(1-c)/(1-2*c*c);b=2-c*a
print('leader',a,b,.5*(a-2)**2+c*a*b,.5*(b-2)**2+c*a*b)
print('default cost/BR/gain',1,1.5,.125)
