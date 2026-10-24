from pathlib import Path
import json,numpy as np
p=Path('.agent/semester-03/est-07');ns={};contract=json.loads((p/'notebook-contract.json').read_text(encoding='utf8'));exec(contract['notebooks'][0]['setupCode'],ns)
rows=[]
for p0 in [1,4]:
 for r2 in [1,4]:
  for rho in [-.5,0,.5,.9]:
   for z1 in [0,2]:
    for z2 in [2,3]:
     (m,v,k),R=ns['pair'](p0,r2,rho,z1,z2);(mn,pn,kn),_=ns['pair'](p0,r2,0,z1,z2)
     rows.append(dict(prior=p0,secondVariance=r2,correlation=rho,firstReading=z1,secondReading=z2,mean=m,variance=v,naiveMean=mn,naiveVariance=pn,naiveActualMse=(1-kn.sum())**2*p0+(kn@R@kn).item()))
(p/'reference-controls.json').write_text(json.dumps(rows,indent=2),encoding='utf8')
density=[]
for r in rows:
 x=np.linspace(-4,6,241);single=r['prior']/(r['prior']+1)
 def pdf(m,v):return (np.exp(-(x-m)**2/(2*v))/np.sqrt(2*np.pi*v)).tolist()
 density.append(dict(joint=pdf(r['mean'],r['variance']),naive=pdf(r['naiveMean'],r['naiveVariance']),single=pdf(single*r['firstReading'],single)))
(p/'reference-density.json').write_text(json.dumps(density),encoding='utf8')
print('64 independent Kalman/Joseph reference rows')
