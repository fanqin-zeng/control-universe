import json
import numpy as np
import matplotlib.pyplot as plt
def adc(temp,bits):
    return int(np.floor(np.clip(temp,0,100)*(2**bits-1)/100+.5))
def pwm(raw,slots):
    return int(np.floor(np.clip(raw,0,1)*slots+.5))
def experiment(bits=8,slots=100,target=60):
    a=np.exp(-.1/2); y=20.; ideal=20.; rows=[]; gap=0.; saturated=0
    for k in range(100):
        code=adc(y,bits); read=100*code/(2**bits-1); raw=.03*(target-read)
        word=pwm(raw,slots); duty=word/slots
        rows.append([k/10,y,ideal,read,code,word,duty]); saturated+=int(raw<0 or raw>1)
        y=a*y+(1-a)*(20+80*duty)
        ideal=a*ideal+(1-a)*(20+80*np.clip(.03*(target-ideal),0,1))
        gap=max(gap,abs(y-ideal))
    rows.append([10,y,ideal,None,None,None,None])
    return dict(bits=bits,slots=slots,target=target,firstCode=rows[0][4],firstRead=rows[0][3],firstPWM=rows[0][5],firstY=rows[1][1],finalY=y,finalIdeal=ideal,maxGap=gap,saturated=saturated,points=rows)
