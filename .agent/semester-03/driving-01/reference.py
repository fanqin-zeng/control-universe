"""Independent integration of velocity in time, using exact fractions."""
from fractions import Fraction as F
import json

rows = []
for v, tau, b, d in [(20,F(3,10),5,50),(20,F(6,10),5,50),(10,F(6,10),5,50),(0,1,5,50),(20,F(4,10),5,50),(25,1,2,10)]:
    v, tau, b, d = map(F, (v,tau,b,d))
    # Integrate affine speed exactly by its trapezoid area over braking time.
    time_to_zero = v/b
    travel = v*tau + (v+0)*time_to_zero/2
    rows.append(dict(v=float(v),tau=float(tau),b=float(b),d=float(d),travel=float(travel),required=float(travel+2),reserve=float(d-travel-2)))
print(json.dumps(rows,indent=2))
assert rows[0]['required']==48 and rows[0]['reserve']==2
assert rows[1]['required']==54 and rows[1]['reserve']==-4
assert rows[2]['required']==18 and rows[2]['reserve']==32
