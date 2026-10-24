"""Rational/integer oracle + SciPy transfer-function and matrix checks."""
from fractions import Fraction as Q
from pathlib import Path
import math,json,sys
import numpy as np
from scipy import signal
def nearest(x):
    x=Q(x);sgn=1 if x>=0 else -1;x=abs(x)
    return sgn*((2*x.numerator+x.denominator)//(2*x.denominator))
def model(Ts,F,kind):
    h=Q(str(Ts));a=(Q(2,5)-h)/(Q(2,5)+h);b=2*h/(Q(2,5)+h);S=2**F
    A=nearest(a*S);B=nearest(b*S);state=Q(1,4) if kind=='decay' else Q(0);stored=nearest(state*S);past=0
    rows=[];errors=[]
    for k in range(80):
        sample=0 if kind=='decay' else 1 if kind=='step' or k<20 else -1 if k<40 else 0
        state=a*state+b*(sample+past)
        wide=A*stored+B*S*(sample+past)
        stored=min(32767,max(-32768,nearest(Q(wide,S))))
        rows.append({'t':k*Ts,'input':sample,'floating':float(state),'fixed':stored/S,'word':stored})
        errors.append(abs(float(state)-stored/S));past=sample
    # Independently use library bilinear + lfilter with compatible state history.
    num,den=signal.bilinear([2],[.2,1],fs=1/Ts)
    zi=[float(a)/4] if kind=='decay' else [0.]
    library,_=signal.lfilter(num,den,[r['input'] for r in rows],zi=zi)
    assert np.max(np.abs(library-[r['floating'] for r in rows]))<1e-12
    return {'Ts':Ts,'F':F,'signal':kind,'a':float(a),'b':float(b),'A':A,'B':B,'aq':A/S,'bq':B/S,'scale':S,'first':rows[0]['floating'],'fixedFirst':rows[0]['fixed'],'finalFloat':float(state),'finalFixed':stored/S,'maxError':max(errors),'clipped':0,'deadbandBound':1/(2*(S-abs(A))),'points':rows}
def timing():
    rows=[]
    for h in [.02,.1,.2]:
        A=math.exp(-h);B=-math.expm1(-h);pole=A-12*B
        M=np.array([[A,-12*B],[1.,0.]])
        eig=np.linalg.eigvals(M);rho=max(abs(eig))
        x=.1;pair=np.array([.1,0.])
        for _ in range(60):x=pole*x;pair=M@pair
        rows.append({'Ts':h,'A':A,'B':B,'pole':pole,'rho':float(rho),'noDelayEnd':x,'delayedEnd':float(pair[0]),'eigenvalues':[[float(z.real),float(z.imag)] for z in eig]})
    return rows
def main():
    p=Path(__file__).resolve().parent
    cases=[model(h,F,k) for h in [.01,.02,.05,.1] for F in [4,8,12] for k in ['step','pulse','decay']]
    report={'cases':cases,'timing':timing(),'example':model(.02,8,'step'),'decay':model(.02,8,'decay'),'stateFirst':float(Q(19,21)*Q(1,4)+Q(2,21)*(1+Q(1,2)))}
    if len(sys.argv)>1:
        actual=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'));maximum=0;count=0
        def compare(a,b):
            nonlocal maximum,count
            if isinstance(b,dict):
                for k,v in b.items():compare(a[k],v)
            elif isinstance(b,list):
                assert len(a)==len(b)
                for x,y in zip(a,b):compare(x,y)
            elif isinstance(b,str):assert a==b
            else:
                d=abs(a-b);assert d<1e-11,(a,b,d);maximum=max(maximum,d);count+=1
        compare(actual,cases);report.update(maxTsError=maximum,quantities=count)
    (p/'reference.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'step':{k:v for k,v in report['example'].items() if k!='points'},'decay':{k:v for k,v in report['decay'].items() if k!='points'},'timing':report['timing'],'stateFirst':report['stateFirst'],'maxTsError':report.get('maxTsError'),'quantities':report.get('quantities')}))
if __name__=='__main__':main()
