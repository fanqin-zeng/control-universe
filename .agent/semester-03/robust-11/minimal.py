"""Execute the extracted, evaluated original page setup/cells; retain stdout and assertions."""
from pathlib import Path
import json,hashlib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
E=Path('.agent/semester-03/robust-11');d=json.loads((E/'extracted.json').read_text(encoding='utf8'));reference=json.loads((E/'reconciliation.json').read_text(encoding='utf8'))
plt.show=lambda:plt.close('all')
counts=[]
for nb in d['notebooks']:
    namespace={};exec(compile(nb['setupCode'],'page-setup','exec'),namespace)
    for cell in nb['cells']:
        print('NOTEBOOK',nb['index']+1,'CELL',cell['index']+1)
        exec(compile(cell['code'],'page-cell','exec'),namespace)
    counts.append(len(nb['cells']))
    if nb['index']==1:
        import numpy as np
        values=[float(namespace['os'].min()),float(namespace['os'].mean()),float(namespace['os'].max()),float(np.percentile(namespace['os'],95))]
        assert max(abs(a-b) for a,b in zip(values,reference['samples']['overshootMinMeanMaxP95']))<1e-9
        assert abs(float(np.nanmax(namespace['settling']))-reference['samples']['settlingMax'])<1e-9
        assert len(namespace['metrics'])==1000
assert counts==[2,3,1]
source=Path('content/robust/robust-case-study.mdx').read_bytes()
(E/'minimal.json').write_text(json.dumps({'pass':True,'cellsPerNotebook':counts,'sampleMetricsMatchIndependentPhysicalEigenvectors':True,'sourceSha256Bytes':hashlib.sha256(source).hexdigest()},indent=2),encoding='utf8')
print('PASS original page cells, independent 1000-sample agreement')
