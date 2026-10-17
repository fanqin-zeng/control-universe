"""MATH-01先行实验；独立精确分数/符号参考，不是组件实现副本。"""
import json
from fractions import Fraction as F
import sympy as sp

t = sp.symbols('t', real=True)
s = t**2
hs = [F(-1), F(-1, 2), F(-1, 10), F(-1, 100), F(1, 100), F(1, 10), F(1, 2), F(1)]
rows = []
for h in hs:
    # 从位置两次读数直接相除，不用组件中的简化表达式。
    secant = ((F(2) + h)**2 - F(2)**2) / h
    rows.append({'h': str(h), 'secant': str(secant), 'exact_derivative': str(sp.diff(s, t).subs(t, 2))})
rectangles = [{'n': n, 'right_sum': str(sum(F(4*i, n) * F(2, n) for i in range(1, n+1)))} for n in [1, 2, 4, 8, 16]]
v = 2*t - 2
result = {
    'derivatives': rows, 'rectangles': rectangles,
    'integral': str(sp.integrate(2*t, (t, 0, 2))),
    'signed_displacement': str(sp.integrate(v, (t, 0, 2))),
    'distance': str(-sp.integrate(v, (t, 0, 1)) + sp.integrate(v, (t, 1, 2))),
    'chain_at_one': str(sp.diff((1+2*t)**2, t).subs(t, 1)),
    'tangent_prediction': str(F(4)+F(4)*F(1,10)),
    'true_position': str(F(21,10)**2),
    'perturbed_secants': [{'h': str(h), 'value': str(((F(2)+h)**2 + F(1,100)-F(4))/h)} for h in [F(1,10), F(1,100)]],
    'cusp': [{'h': str(h), 'quotient': str(abs(h)/h)} for h in [F(-1,10),F(-1,100),F(1,100),F(1,10)]],
}
print(json.dumps(result, ensure_ascii=False, indent=2))
