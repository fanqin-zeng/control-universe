"""Independent exact arithmetic and augmented-matrix verification."""
from fractions import Fraction as F
import json
import numpy as np

a, r = F(4, 5), F(2, 5)
first = [F(10)-6*a**k for k in range(9)]
off = [4*a**k for k in range(9)]
unit = [F(4+2*k) for k in range(9)]
distinct = [F(25, 3)-10*a**k+F(5, 3)*r**k for k in range(9)]
repeated = [(k+1)*a**k for k in range(9)]
ratios = [F(4, 5)*F(k+2, k+1) for k in range(4, 8)]
# Exact polynomial and initial-condition checks, independent of float assertions.
assert a*a-F(6, 5)*a+F(8, 25) == 0
assert r*r-F(6, 5)*r+F(8, 25) == 0
assert (a*a-F(8, 5)*a+F(16, 25)) == 0
assert distinct[:2] == [0, 1] and repeated[:2] == [1, F(8, 5)]
assert max(ratios) == F(24, 25)

M = np.array([[0., 1., 0.], [-.32, 1.2, 1.], [0., 0., 1.]])
R = np.array([[0., 1.], [-.64, 1.6]])
matrix_distinct = [(np.linalg.matrix_power(M, k) @ [0., 1., 1.])[0] for k in range(9)]
matrix_repeated = [(np.linalg.matrix_power(R, k) @ [1., 1.6])[0] for k in range(9)]
assert np.max(np.abs(np.array(matrix_distinct)-np.array(list(map(float, distinct))))) < 1e-12
assert np.max(np.abs(np.array(matrix_repeated)-np.array(list(map(float, repeated))))) < 1e-12

q1 = [2*(1-F(1, 2)**k) for k in range(4)]
q2 = [-a**k+2*r**k for k in range(4)]
q3 = [a**k for k in range(6)]
q4 = [4+2*k for k in range(4)]
assert q1[3] == F(7, 4) and q2[2] == -F(8, 25)
assert q3[5] == F(1024, 3125) and q4[3] == 10
# Rational Z-domain expressions at three points in their common ROC.
for z in [F(3, 2), F(2), F(3)]:
    X = 4*z/(z-a)+2*z/((z-1)*(z-a))
    assert X == 10*z/(z-1)-6*z/(z-a)
    assert (z-a)*X-4*z == 2*z/(z-1)

result = dict(passed=True, tolerance=1e-12,
              heated=list(map(float, first)), off=list(map(float, off)), unit=list(map(float, unit)),
              distinct=list(map(float, distinct)), repeated=list(map(float, repeated)), ratios=list(map(float, ratios)),
              q1=list(map(float, q1)), q2=list(map(float, q2)), q3=list(map(float, q3)), q4=q4,
              initial=[4., 0.], residuals=[0., 0.], root_checks=True,
              k5=[float(first[5]), float(distinct[5]), float(repeated[5])],
              exact={"first5":str(first[5]), "distinct5":str(distinct[5]), "repeated5":str(repeated[5])})
print(json.dumps(result))
