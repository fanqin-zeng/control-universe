# Teaching signed-16 storage; wide exact integer accumulator, one final rounding.
def away(x):
    return int(np.sign(x)*np.floor(abs(x)+.5))
def fixed_experiment(Ts=.02,F=8,kind="step"):
    a=(.4-Ts)/(.4+Ts);b=2*Ts/(.4+Ts);S=2**F
    A=away(a*S);B=away(b*S)
    yp=.25 if kind=="decay" else 0.;word=away(yp*S);ep=0.
    rows=[];maxerr=0.;clips=0
    for k in range(80):
        e=0. if kind=="decay" else 1. if kind=="step" or k<20 else -1. if k<40 else 0.
        floating=a*yp+b*(e+ep)
        acc=A*word+B*away(e*S)+B*away(ep*S)
        rounded=away(acc/S);nextword=max(-32768,min(32767,rounded))
        clips+=int(nextword!=rounded)
        fixed=nextword/S;maxerr=max(maxerr,abs(fixed-floating))
        rows.append([k*Ts,e,floating,fixed,nextword])
        yp=floating;word=nextword;ep=e
    return {"a":a,"b":b,"A":A,"B":B,"aq":A/S,"first":rows[0][2],
            "fixedFirst":rows[0][3],"finalFloat":yp,"finalFixed":word/S,
            "maxError":maxerr,"clipped":clips,"deadbandBound":1/(2*(S-abs(A))),"points":rows}
