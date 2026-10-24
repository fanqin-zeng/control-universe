"""Independent high precision oracle: endpoint calibration and exact ZOH."""
from decimal import Decimal as D, localcontext, ROUND_HALF_UP
from pathlib import Path
import json
def rounded(x):return int(x.quantize(D(1),rounding=ROUND_HALF_UP))
def adc(x,n):return rounded(min(D(100),max(D(0),x))*(2**n-1)/100)
def run(n,m,r):
    with localcontext() as ctx:
        ctx.prec=55
        a=(-D(1)/20).exp(); y=D(20); z=D(20); r=D(r); rows=[]; gap=D(0); clips=0
        for k in range(100):
            code=adc(y,n); read=D(code)*100/(2**n-1)
            raw=D('0.03')*(r-read); d=min(D(1),max(D(0),raw)); word=rounded(d*m)
            ideal=min(D(1),max(D(0),D('.03')*(r-z)))
            rows.append(dict(t=k/10,y=float(y),ideal=float(z),read=float(read),code=code,pwm=word,duty=float(D(word)/m)))
            clips+=int(raw<0 or raw>1)
            y=a*y+(1-a)*(20+80*D(word)/m);z=a*z+(1-a)*(20+80*ideal)
            gap=max(gap,abs(y-z))
        rows.append(dict(t=10,y=float(y),ideal=float(z),read=None,code=None,pwm=None,duty=None))
        return dict(bits=n,slots=m,target=int(r),firstCode=rows[0]['code'],firstRead=rows[0]['read'],firstPWM=rows[0]['pwm'],firstY=rows[1]['y'],finalY=float(y),finalIdeal=float(z),maxGap=float(gap),saturated=clips,points=rows)
cases=[run(n,m,r) for n in [4,8,12] for m in [20,100,1000] for r in [20,60,110]]
with localcontext() as ctx:
    ctx.prec=55
    conversions=[dict(input=x,bits=n,code=adc(D(str(x)),n),read=float(D(adc(D(str(x)),n))*100/(2**n-1))) for n in [4,8,12] for x in [-5,0,20,50,100,105]]
result=dict(cases=cases,conversions=conversions,default=next(v for v in cases if (v['bits'],v['slots'],v['target'])==(8,100,60)),step8=100/255,bound8=50/255,idealEquilibrium=164/3.4,first=20+80*(1-float((-D('.05')).exp())))
out=Path(__file__).with_name('reference.json');out.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in result['default'].items() if k!='points'}));print('cases',len(cases))
