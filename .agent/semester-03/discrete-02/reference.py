"""Independent closed-form checks: no copy of the lesson's state-update loop."""
import json
import numpy as np
from scipy.signal import dlsim, dimpulse

k = np.arange(6)
a, b, x0 = .8, 2., 4.
initial = x0*a**k
forced = 10*(1-a**k)
total = 10-6*a**k
_, library, _ = dlsim(([[a]], [[b]], [[1.]], [[0.]], 1.), np.ones(6), x0=[x0])
assert np.max(np.abs(library[:, 0]-total)) < 1e-12
assert np.max(np.abs(initial+forced-total)) < 1e-12
A = np.array([[.8, 0], [.25, .5]])
B = np.array([2., 0.])
state0 = np.array([4., 0.])
states = np.array([np.linalg.matrix_power(A, n) @ state0 + sum(
    (np.linalg.matrix_power(A, j) @ B for j in range(n)), start=np.zeros(2)) for n in k])
_, _, library_states = dlsim((A, B[:, None], [[0., 1.]], [[0.]], 1.), np.ones(6), x0=state0)
assert np.max(np.abs(states-library_states)) < 1e-12
h = np.r_[0, 2*a**np.arange(5)]
_, impulse = dimpulse(([[a]], [[b]], [[1.]], [[0.]], 1.), n=6)
assert np.max(np.abs(h-impulse[0][:, 0])) < 1e-12
u = np.array([1., 0., 2., 0., 0., 0.])
_, arbitrary, _ = dlsim(([[a]], [[b]], [[1.]], [[0.]], 1.), u)
assert np.max(np.abs(np.convolve(u, h)[:6]-arbitrary[:, 0])) < 1e-12
result = dict(passed=True, tolerance=1e-12, initial=initial.tolist(), forced=forced.tolist(),
              total=total.tolist(), equilibrium=10., states=states.tolist(), impulse=h.tolist(),
              convolution=arbitrary[:, 0].tolist(), Q1=[4.2, 4.36],
              Q2=[float(initial[5]), float(forced[5]), float(total[5])], Q3=[5.2, 1.],
              Q4=[.5, 2., 1.6], boundaries=[.8**5, -1., 1.1**5], wrong_update=1.3)
assert abs(result['boundaries'][2]-1.61051) < 1e-12
assert abs((.8*4+2)*.25-result['wrong_update']) < 1e-12
print(json.dumps(result))
