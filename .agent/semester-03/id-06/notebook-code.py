"""Canonical raw notebook strings, embedded verbatim by author.py."""
SETUP = '''import numpy as np
L, fs = 64, 20.0
lines = np.array([1,4,8,12,20,28])
def experiment(a=.7, output_noise=.2, input_noise=0., periods=8, missing=False, seed=20261024):
    bins = lines[lines != 8] if missing else lines
    n = np.arange(L)
    u = np.sin(2*np.pi*bins[:,None]*n/L).sum(axis=0)
    w = 2*np.pi*np.arange(L)/L
    G = (1-a)*np.exp(-1j*w)/(1-a*np.exp(-1j*w))
    y = np.fft.ifft(np.fft.fft(u)*G).real
    state = int(seed)
    def noise(size):
        nonlocal state
        vals = []
        for _ in range(size):
            state = (1664525*state+1013904223) % 2**32
            vals.append(np.sqrt(12)*(state/2**32-.5))
        return np.array(vals)
    inputs, outputs = [], []
    for _ in range(periods):
        inputs.append(u+input_noise*noise(L))
        outputs.append(y+output_noise*noise(L))
    inputs, outputs = np.array(inputs), np.array(outputs)
    U, Y = np.fft.fft(inputs,axis=1), np.fft.fft(outputs,axis=1)
    suu = np.mean(abs(U)**2,axis=0)/L
    syy = np.mean(abs(Y)**2,axis=0)/L
    suy = np.mean(U.conj()*Y,axis=0)/L
    valid = np.isin(np.arange(L),bins) & (suu>1e-10) & (syy>1e-10)
    H = np.full(L,np.nan+1j*np.nan); C = np.full(L,np.nan)
    H[valid] = suy[valid]/suu[valid]
    C[valid] = np.minimum(1,abs(suy[valid])**2/(suu[valid]*syy[valid]))
    return dict(G=G,H=H,C=C,suu=suu,inputs=inputs,outputs=outputs)
'''
CELLS = [
'''r = experiment()
k = 8
row = dict(hz=k*fs/L, omega=2*np.pi*k/L, true_gain=float(abs(r['G'][k])), true_phase=float(np.angle(r['G'][k],deg=True)), gain=float(abs(r['H'][k])), phase=float(np.angle(r['H'][k],deg=True)), coherence=float(r['C'][k]), power=float(r['suu'][k]), samples=8*L, duration=8*L/fs, grid=fs/L, delay_phase=-360*k/L, omitted_delay_phase=float(np.angle(r['G'][k],deg=True)+360*k/L))
print(row)
print('default_frequency_checks_passed')''',
'''summaries = []
for label, sy, su in [('noiseless',0.,0.),('output',.8,0.),('input',0.,.8)]:
    errors = {}
    for periods in [1,4,16]:
        vals = []
        for seed in range(20261024,20261056):
            r = experiment(output_noise=sy,input_noise=su,periods=periods,seed=seed)
            vals.append(float(np.sqrt(np.mean(abs(r['H'][lines]-r['G'][lines])**2))))
        errors[periods] = dict(median=float(np.median(vals)), q10=float(np.quantile(vals,.1)), q90=float(np.quantile(vals,.9)), values=vals)
    improved = sum(x<y for x,y in zip(errors[16]['values'],errors[1]['values']))
    summaries.append(dict(label=label,errors=errors,improved=improved))
print(summaries)
print('all_32_frequency_seeds_reported')''',
'''n = np.arange(L)
def leakage(cycles,window):
    v = np.exp(2j*np.pi*cycles*n/L)*window
    power = abs(np.fft.fft(v))**2
    return float(1-power[8]/power.sum())
hann = .5-.5*np.cos(2*np.pi*n/L)
row = dict(rect_integer=leakage(8,np.ones(L)),rect_offgrid=leakage(8.5,np.ones(L)),hann_integer=leakage(8,hann),hann_offgrid=leakage(8.5,hann),grid=fs/L,zero_padded_grid=fs/(4*L))
r = experiment(output_noise=.8,periods=1)
row['single_segment_coherence'] = float(r['C'][8])
row['missing_refused'] = bool(np.isnan(experiment(missing=True)['H'][8]))
row['input_noise_target_factor'] = 16/(16+.8**2)
row['input_noise_target_gain'] = float(abs(r['G'][8])*row['input_noise_target_factor'])
assert np.allclose(r['C'][lines],1)
print(row)
print('leakage_and_boundary_checks_passed')'''
]
