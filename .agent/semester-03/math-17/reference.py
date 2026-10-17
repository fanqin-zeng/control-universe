import numpy as np,json,scipy,sympy
cases=[]
for c in np.arange(10)/20:
 def f(a,b):return .5*(a-2)**2+c*a*b
 def response(b):
  # Fit the declared cost at three points; optimize that polynomial on the interval.
  poly=np.polynomial.Polynomial.fit([0,2,4],[f(0,b),f(2,b),f(4,b)],2).convert()
  roots=[float(x.real) for x in poly.deriv().roots() if abs(x.imag)<1e-12 and 0<=x.real<=4]
  return min([0.,4.]+roots,key=poly)
 n=np.linalg.solve([[1,c],[c,1]],[2,2]);z=np.linalg.solve([[1,2*c],[2*c,1]],[2,2])
 nc=[f(n[0],n[1]),f(n[1],n[0])];zc=[f(z[0],z[1]),f(z[1],z[0])]
 for a in np.arange(9)/2:
  for b in np.arange(9)/2:
   br=[response(b),response(a)];costs=[f(a,b),f(b,a)];g=[costs[0]-f(br[0],b),costs[1]-f(br[1],a)]
   cases.append(dict(parameters=[float(c),float(a),float(b)],costs=costs,bestResponses=br,gains=g,epsilon=max(g),nash=n.tolist(),planner=z.tolist(),nashCosts=nc,plannerCosts=zc,totals=[sum(nc),sum(zc)],costCurves=[[float(x),f(x,b),f(x,a)] for x in np.arange(81)/20],brCurves=[[float(x),response(x)] for x in np.arange(81)/20]))
print(json.dumps(dict(versions=dict(numpy=np.__version__,scipy=scipy.__version__,sympy=sympy.__version__),cases=cases)))
