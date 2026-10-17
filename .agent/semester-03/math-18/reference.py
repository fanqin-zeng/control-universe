import mpmath as mp,json,numpy,scipy,sympy
mp.mp.dps=80
ns=[4,8,16,32,64]
def values(k,n):
 h=mp.mpf(4)/n;z=-k*h
 factors=[1+z,1/(1-z),1+z+z*z/2+z**3/6+z**4/24]
 rows=[[float(j*h),float(20+60*mp.exp(-k*j*h)),*[float(20+60*r**j) for r in factors]] for j in range(n+1)]
 return rows
cases=[]
for i in range(9):
 k=mp.mpf(i)/4
 for n in ns:
  rows=values(k,n);last=rows[-1][1:];h=mp.mpf(4)/n
  convergence=[]
  for m in ns:
   zz=-k*4/m;rs=[1+zz,1/(1-zz),1+zz+zz**2/2+zz**3/6+zz**4/24];exact=20+60*mp.exp(-4*k)
   convergence.append([4/m,*[float(abs(20+60*r**m-exact)) for r in rs]])
  exact=20+60*mp.exp(-4*k);z=-k*h;rs=[1+z,1/(1-z),1+z+z*z/2+z**3/6+z**4/24]
  cases.append(dict(reference=[[float(mp.mpf(j)/50),float(20+60*mp.exp(-k*mp.mpf(j)/50))] for j in range(201)],parameters=[float(k),n],h=float(h),kh=float(k*h),factor=float(1-k*h),samples=rows,finals=last,errors=[float(abs(20+60*r**n-exact)) for r in rs],convergence=convergence,work=[n,n,4*n],eulerDecay=bool(k>0 and abs(1-k*h)<1),nonnegative=bool(1-k*h>=0),zeroCase=bool(k==0)))
print(json.dumps(dict(versions=dict(mpmath=mp.__version__,numpy=numpy.__version__,scipy=scipy.__version__,sympy=sympy.__version__),cases=cases)))
