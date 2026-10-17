import json, numpy as np, scipy
from scipy.signal import StateSpace, step
cases=[]
for z in [0.,.05,.5,.95,.999,1.,1.001,1.05,2.]:
    for wn in [.5,8.,20.]:
        t=np.linspace(0,3,401)
        _,y=step(StateSpace([[0,1],[-wn*wn,-2*z*wn]],[[0],[wn*wn]],[[1,0]],[[0]]),T=t)
        poles=np.roots([1,2*z*wn,wn*wn])
        item={'zeta':z,'wn':wn,'step':list(map(list,zip(t,y))),
              'poles':[[float(p.real),float(p.imag)] for p in poles]}
        if z>0:
            w=np.logspace(-1,2,401)
            g=wn*wn/((1j*w)**2+2*z*wn*1j*w+wn*wn)
            item['bode']=list(map(list,zip(w,20*np.log10(abs(g)))))
        cases.append(item)
print(json.dumps({'versions':{'numpy':np.__version__,'scipy':scipy.__version__},'cases':cases}))
