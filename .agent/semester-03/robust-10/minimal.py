from pathlib import Path
import numpy as np,json
from scipy.special import lambertw
from scipy.optimize import brentq
a,k=1.,2.;wc=np.sqrt(k*k-a*a);tc=np.arccos(-a/k)/wc;tsg=2/np.sqrt(4*k*k-(a+k)**2)
rows=[]
for tau in [0,.5,tsg,1.,tc,1.5,2.]:
 if tau==0:alpha=-a-k;pa=alpha
 else:
  roots=-a+lambertw(-k*tau*np.exp(a*tau),np.arange(-20,21))/tau;alpha=float(max(roots.real));pa=float(max(np.roots([tau/2,1+(a-k)*tau/2,a+k]).real))
 rows.append({'tau':tau,'sampledLambertAlpha':alpha,'padeAlpha':pa,'sgBound':2*k*tau/np.hypot(2,(a+k)*tau)})
out={'default':{'a':a,'k':k,'tau':.5},'exactMargin':float(tc),'crossingFrequency':float(wc),'sgMargin':float(tsg),'padeMargin':2.,'rows':rows,'halanay_a1_k05_tau1':brentq(lambda e:1-.5*np.exp(e)-e,0,.5)}
Path('.agent/semester-03/robust-10/minimal.json').write_text(json.dumps(out,indent=2),encoding='utf8');print(json.dumps(out,indent=2))
