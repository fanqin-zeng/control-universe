"""Independent exact-rational lifted-state oracle for the actual TS module's output."""
import json
from fractions import Fraction as F
from pathlib import Path

base = Path(__file__).parent
cases = json.loads((base/'ts-results.json').read_text())
worst = 0.0
count = 0
for case in cases:
    p = case['p']
    d, h, g, b = p['delay'], p['hold'], F(str(p['gain'])), F(str(p['body']))
    # Lifted memory: newest state first, then delayed states; held action separate.
    memory = [F(0)] * (d+1)
    held = F(0)
    expected_x, expected_y, expected_u = [F(0)], [], []
    for k in range(60):
        observed = memory[d]
        if k % h == 0:
            held = min(F(1), max(F(-1), g*(1-observed)))
        newest = memory[0]+b*held/10 - (F(1,5) if k==20 else F(0))
        memory = [newest]+memory[:-1]
        expected_y.append(observed)
        expected_u.append(held)
        expected_x.append(newest)
    for name, expected in [('x',expected_x),('y',expected_y),('u',expected_u)]:
        for actual, exact in zip(case[name], expected, strict=True):
            err = abs(actual-float(exact))
            worst = max(worst,err)
            count += 1
            assert err < 1e-10, (p,name,actual,float(exact))
    assert case['updates'] == (59//h+1)
# Default: five saturated steps, then e[n]=0.5*(4/5)**(n-5).
# The pulse adds 1/5 to e[21], then decays for 39 further updates.
closed = 1 - F(1,2)*F(4,5)**55 - F(1,5)*F(4,5)**39
default = next(c for c in cases if c['p']==dict(delay=0,hold=1,gain=2,body=1))
assert abs(default['final']-float(closed)) < 1e-14
summary = dict(configurations=len(cases),scalar_checks=count,max_abs_error=worst,default_closed_form=float(closed),status='PASS')
(base/'oracle-results.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary))
