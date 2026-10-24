"""Direct Gaussian transition matrix, independent of notebook FFT convolution."""
import os
os.environ['OPENBLAS_NUM_THREADS']='2'
from pathlib import Path
import numpy as np,json
folder=Path('.agent/semester-03/est-06');source=json.loads((folder/'sequential.json').read_text(encoding='utf8'))
x=np.linspace(-8,8,801);dx=x[1]-x[0];p=np.exp(-x*x/2)/np.sqrt(2*np.pi);p/=p.sum()*dx
transition=np.exp(-((x[:,None]-x[None,:])**2)/.08)/np.sqrt(.08*np.pi)*dx;rows=[]
for z in [4,4.41,3.61,4,4.84]*4:
    p=transition@p;p*=np.exp(-(z-x*x)**2/.5);p/=p.sum()*dx
    mean=float((p*x).sum()*dx);variance=float((p*(x-mean)**2).sum()*dx);negative=float(p[x<0].sum()*dx+.5*p[len(x)//2]*dx)
    rows.append([mean,variance,negative])
maximum=float(np.max(abs(np.array(rows)-np.array(source['reference']))));assert maximum<1e-6,maximum
report=dict(passTest=True,method='801-node direct Gaussian transition matrix; compare 2001-node FFT reference at all 20 steps',maxDifference=maximum,rows=rows)
(folder/'independent-sequential.json').write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(dict(passTest=True,maxDifference=maximum)))
