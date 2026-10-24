import numpy as np
from scipy.signal import lfilter
from fractions import Fraction as F

impulse = np.zeros(12)
impulse[0] = 1
A = [1, -0.8]
B = [0, 0.2]
g = lfilter(B, A, impulse)
h_arx = lfilter([1], A, impulse)
h_oe = impulse.copy()
print('G_first4_cm', g[:4].tolist())
print('H_ARX_first4', h_arx[:4].tolist())
print('H_OE_first4', h_oe[:4].tolist())
print('H_ARMAX_first4', lfilter([1, .3], A, impulse)[:4].tolist())
print('H_BJ_first4', lfilter([1], [1, -.4], impulse)[:4].tolist())
fir = [0, .2, .16, .128, .1024]
print('FIR_first_omitted_cm', g[5])
print('FIR_DC', sum(fir), 'exact_DC', .2/(1-.8))
exact = [F(0)] + [F(1,5)*F(4,5)**k for k in range(11)]
assert max(abs(float(a)-b) for a,b in zip(exact,g)) < 1e-12
assert sum(map(F, ['.2','.16','.128','.1024'])) == F(369,625)
assert F(1)-F(369,625) == F(256,625)
print('Fraction_crosscheck', True)
