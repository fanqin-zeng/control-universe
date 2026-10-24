"""Independent Decimal audit of the held-input model and PI state ordering."""
from decimal import Decimal as D, localcontext
import math,json,sys
from pathlib import Path
def simulate(lam,scenario):
    with localcontext() as c:
        c.prec=42
        lam=D(str(lam));h=D('.05');a=(-h/4).exp()
        kp=2/(lam+D('.5'));ti=min(D(4),4*(lam+D('.5')));ki=kp/ti
        n=30 if scenario=='delay' else 10;r=D(3 if scenario=='unreachable' else 1)
        measured=D(0);integral=D(0);commands=[];points=[];area=D(0);variation=D(0);peak=D(0);sat=0
        for k in range(601):
            disturbance=D(str(.02*math.sin(8*k*.05))) if scenario=='noise' else D(0)
            error=r-measured-disturbance
            command=kp*error+integral
            applied=min(D(1),max(D(0),command))
            points.append({'t':k*.05,'y':float(measured),'u':float(applied),'r':float(r)})
            peak=max(peak,measured)
            if k==600:break
            area+=abs(r-measured)*h
            variation+=abs(applied-(commands[-1] if commands else D(0)))
            commands.append(applied)
            if command>=1 or command<=0:sat+=1
            increment=ki*h*error
            if not (command>=1 and increment>0 or command<=0 and increment<0):integral+=increment
            input_value=commands[k-n] if k>=n else D(0)
            if scenario=='noise' and k>=300:input_value-=D('.2')
            measured=2*input_value+(measured-2*input_value)*a
        return {'Kp':float(kp),'Ti':float(ti),'Ki':float(ki),'points':points,'metrics':{'iae':float(area),'overshoot':float(max(D(0),peak-r)*100/r),'tv':float(variation),'saturated':sat,'finalError':float(r-measured)}}
def identification():
    q1=1-math.exp(-1/3);q2=1-math.exp(-1)
    t1=.5+4/3;t2=4.5;T=(t2-t1)*1.5;L=t2-T
    return {'K':.8/.4,'T':T,'L':L,'q1':q1,'q2':q2,'t1':t1,'t2':t2,'y1':.8*q1,'y2':.8*q2,'Kp':4/3,'Ti':4.,'Ki':1/3,'exerciseKp':.8,'exerciseKi':.2,'capacity':2.,'unreachableGap':1.}
def main():
    p=Path(__file__).resolve().parent
    report={'identification':identification(),'cases':[]}
    for lam in [.25,.5,.75,1,1.5,2,3]:
        for scenario in ['nominal','delay','unreachable','noise']:
            report['cases'].append({'lambda':lam,'scenario':scenario,**simulate(lam,scenario)})
    if len(sys.argv)>1:
        actual=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'));maximum=0;quantities=0
        for item,ref in zip(actual,report['cases']):
            assert (item['lambda'],item['scenario'])==(ref['lambda'],ref['scenario'])
            def compare(x,y):
                nonlocal maximum,quantities
                if isinstance(y,dict):
                    for key,v in y.items():compare(x[key],v)
                elif isinstance(y,list):
                    assert len(x)==len(y)
                    for a,b in zip(x,y):compare(a,b)
                else:
                    error=abs(x-y);maximum=max(maximum,error);quantities+=1
                    assert error<1e-10,(error,x,y)
            compare(item, {k:ref[k] for k in ['Kp','Ti','Ki','metrics','points']})
        report['maxTsError']=maximum;report['quantities']=quantities
    (p/'reference.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'identification':report['identification'],'metrics':[{k:v for k,v in row.items() if k in ['lambda','scenario','metrics']} for row in report['cases'] if row['lambda'] in [.5,1,2]],'maxTsError':report.get('maxTsError'),'quantities':report.get('quantities')},ensure_ascii=False))
if __name__=='__main__':main()
