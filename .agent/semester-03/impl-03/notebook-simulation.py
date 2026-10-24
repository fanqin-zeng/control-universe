# Actual page experiment; output precedes conditional integral update.
def experiment(lam=1., scenario="nominal"):
    dt=.05; N=600; a=np.exp(-dt/4)
    Kp=4/(2*(lam+.5)); Ti=min(4.,4*(lam+.5)); Ki=Kp/Ti
    delay=30 if scenario=="delay" else 10
    r=3. if scenario=="unreachable" else 1.
    y=0.; I=0.; previous=0.; iae=0.; tv=0.; saturated=0; peak=0.
    history=[]; rows=[]
    for k in range(N+1):
        t=k*dt
        noise=.02*np.sin(8*t) if scenario=="noise" else 0.
        e=r-y-noise
        raw=Kp*e+I; u=float(np.clip(raw,0.,1.))
        rows.append([t,y,u,r]); peak=max(peak,y)
        if k==N: break
        history.append(u); iae+=abs(r-y)*dt
        tv+=abs(u-previous); previous=u
        saturated+=int(raw<=0 or raw>=1)
        if not ((raw>=1 and e>0) or (raw<=0 and e<0)):
            I+=Ki*dt*e
        delayed=history[k-delay] if k>=delay else 0.
        load=-.2 if scenario=="noise" and k>=300 else 0.
        y=a*y+(1-a)*2*(delayed+load)
    return {"Kp":Kp,"Ti":Ti,"Ki":Ki,"points":rows,
            "metrics":{"iae":iae,"overshoot":100*max(0.,peak-r)/r,
                       "tv":tv,"saturated":saturated,"finalError":r-y}}
