"""Execute extracted page cells; compare arrays to exact rational formulas."""
from pathlib import Path
from fractions import Fraction as F
import json
import matplotlib
matplotlib.use('Agg')
import numpy as np

folder = Path('.agent/semester-03/id-02')
notebooks = json.loads((folder / 'extracted.json').read_text(encoding='utf8'))['notebooks']
measurements = []

def compare(name, actual, expected):
    actual = np.asarray(actual, dtype=float)
    expected = np.asarray([float(x) for x in expected], dtype=float)
    assert actual.shape == expected.shape, name
    error = float(np.max(np.abs(actual - expected)))
    assert error < 1e-12, (name, error)
    measurements.append({'name': name, 'count': actual.size, 'maxError': error})

def response(pole, inputs):
    return [sum(F(1, 5) * pole ** (k-1-j) * F(str(inputs[j])) for j in range(k)) for k in range(len(inputs))]

for index, nb in enumerate(notebooks):
    scope = {}
    exec(nb['setupCode'], scope)
    for cell in nb['cells']:
        exec(cell['code'], scope)
    if index == 0:
        a = F(4, 5)
        compare('input impulse', scope['g'], [F(0)] + [F(1, 5) * a**j for j in range(11)])
        compare('ARX driver impulse', scope['h_arx'], [a**j for j in range(12)])
        compare('OE driver impulse', scope['h_oe'], [F(1)] + [F(0)]*11)
        compare('ARX reconstructed driver', scope['innovation_arx'], [F(1)] + [F(0)]*11)
        compare('OE reconstructed driver', scope['innovation_oe'], [F(1)] + [F(0)]*11)
        for pole, actual_arx, actual_oe in scope['boundary_cases']:
            p = F(str(pole))
            driven = response(p, scope['u'])
            compare('ARX boundary '+str(pole), actual_arx, [d + p**k for k,d in enumerate(driven)])
            compare('OE boundary '+str(pole), actual_oe, [d + int(k==0) for k,d in enumerate(driven)])
    else:
        a = F(4, 5)
        exact = [F(0)] + [F(1, 5) * a**j for j in range(11)]
        compare('full impulse', scope['g_exact'], exact)
        compare('truncated impulse', scope['g_fir'], exact[:5]+[F(0)]*7)
        assert abs(scope['gain_exact'] - 1) < 1e-12
        assert abs(scope['gain_fir'] - float(F(369,625))) < 1e-12
        assert abs(scope['gain_exact']-scope['gain_fir']-float(F(256,625))) < 1e-12
        coordinates = response(a, list(scope['u']) + [0])
        compare('state x', scope['x'], coordinates)
        compare('state z', scope['z'], [2*x for x in coordinates])
        compare('ARMAX impulse', scope['h_armax'], [F(1)] + [(a+F(3,10))*a**j for j in range(3)])
        compare('BJ impulse', scope['h_bj'], [F(2,5)**j for j in range(4)])

report = {'pass': True, 'tolerance': 1e-12, 'values': sum(x['count'] for x in measurements),
          'maxError': max(x['maxError'] for x in measurements), 'measurements': measurements,
          'exercise': {'armax':[1,1.1], 'arx':[1,.8], 'oe':[1,0],
                       'FIR': {'nb':4,'nk':1,'firstOmission':.08192,'gainLoss':.4096},
                       'scaledState': {'A':.8,'B':.4,'C':.5,'initialScale':2}}}
(folder/'reconciliation.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps({'pass':True,'values':report['values'],'maxError':report['maxError']}))
