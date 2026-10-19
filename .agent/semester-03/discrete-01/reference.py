"""Independent 60-digit analytic transfer-polynomial and residue reference; no control/scipy."""
import json,sys,mpmath as m
m.mp.dps=60
M=lambda x:m.mpf(str(x))
def conv(a,b):
 c=[m.mpf(0)]*(len(a)+len(b)-1)
 for i,x in enumerate(a):
  for j,y in enumerate(b):c[i+j]+=x*y
 return c
def roots(p):
 n=len(p)-1; A=m.matrix(n)
 for j in range(n):A[0,j]=-p[j+1]/p[0]
 for i in range(1,n):A[i,i-1]=1
 return m.eig(A,left=False,right=False)
def response(num,den,times):
 rr=roots(den); deriv=[den[i]*(len(den)-1-i) for i in range(len(den)-1)]
 residues=[m.polyval(num,p)/(p*m.polyval(deriv,p)) for p in rr]
 dc=num[-1]/den[-1]
 return [m.re(dc+sum(c*m.exp(p*t) for c,p in zip(residues,rr))) for t in times]
def quant(x,n):
 q=M(4)/2**n;j=max(0,min(2**n-1,int(m.floor((x+2)/q))))
 return -2+(j+M('.5'))*q
def floats(v):
 if isinstance(v,dict):return {k:floats(x) for k,x in v.items()}
 if isinstance(v,list):return list(map(floats,v))
 return float(v)
out={};bw=m.sqrt(50+50*m.sqrt(5))
out['hold_values']=[[M(t),bw*M(t)/2*180/m.pi] for t in [.001,.005,.01,.05]]
out['bw']=bw
out['alias_records']=[]
for fs in [250,100,190]:
 vals=[m.sin(2*m.pi*5*k/fs)+m.sin(2*m.pi*95*k/fs)/2 for k in range(round(.4*fs)+1)]
 out['alias_records'].append(dict(fs=fs,alias=(95+fs/2)%fs-fs/2,values=vals))
ys=response(list(map(M,[10,5])),list(map(M,[1,.5,11,5])),[M(20)*k/9999 for k in range(10000)])
out['offline_values']=[]
for n in [8,12,16]:
 z=[quant(y,n) for y in ys]
 out['offline_values'].append(dict(bits=n,q=M(4)/2**n,error=max(abs(a-b) for a,b in zip(z,ys)),span=max(z[-1000:])-min(z[-1000:])))
out['feedback_records']=[]
for n in [0,8,12,16]:
 y=I=m.mpf(0);v=[y];a=m.exp(-M('.1'))
 for k in range(2000):
  e=1-(quant(y,n) if n else y);u=e+I;I+=M('.04')*e;y=a*y+(1-a)*u;v.append(y)
 out['feedback_records'].append(dict(bits=n,values=v,terminal=v[-1],error=max(abs(x-1) for x in v[1800:]),span=max(v[1800:])-min(v[1800:])))
out['pid_records']=[]
for tf in [.001,.005,.01,.02,.05]:
 t=M(tf);r=m.exp(-5*t);w=m.sqrt(75);cs=m.cos(w*t)
 dg=[1,-2*r*cs,r*r];b1=1-r*(cs+5/w*m.sin(w*t));ng=[b1,sum(dg)-b1]
 c=2/t;nk=[55*c*c+510*c+1000,-110*c*c+2000,55*c*c-510*c+1000];dk=[c*c+100*c,-2*c*c,c*c-100*c]
 den=conv(dg,dk);num=[0]+conv(ng,nk);den=[a+b for a,b in zip(den,num)]
 v=[]
 for k in range(round(2/t)+1):
  v.append((sum(num[:min(k+1,len(num))])-sum(den[j]*v[k-j] for j in range(1,min(k+1,len(den)))))/den[0])
 out['pid_records'].append(dict(Ts=t,rho=max(abs(p) for p in roots(den)),values=v))
out['budget_values']=[]
for fc in [400,50]:
 hs=[1/(1-(f/fc)**2+1j*m.sqrt(2)*f/fc) for f in [M(20),M(500),50/(2*m.pi)]]
 out['budget_values'].append([fc,*[-20*m.log10(abs(h)) for h in hs],*[m.arg(h)*180/m.pi for h in hs]])
L=lambda w:(M('.5')*(1j*w)**2+10j*w+5)/((1j*w)**2*(1j*w+2))
wc=m.findroot(lambda w:abs(L(w))-1,3);wb=m.findroot(lambda w:abs(L(w)/(1+L(w)))**2-M('.5'),4.5);loss=M('.05')*180/m.pi
out['answer_values']=[wc,wb,wb*M('.005')*180/m.pi,loss,55-loss,2*m.pi/180*5/20,M(200)/4096,M(100)/4096]
maxerr=0
if len(sys.argv)>1:
 for case in json.load(open(sys.argv[1])):
  fs=int(case['fs']);bits=int(case['bits']);q=M(4)/2**bits
  for row in case['rows']:
   t,x,z,e=row;n=round(t*fs);expected=m.sin(2*m.pi*5*n/fs)+m.sin(2*m.pi*95*n/fs)/2
   assert abs(M(x)-expected)<M('1e-12');assert abs(M(e)-expected)<M('1e-12')
   maxerr=max(maxerr,float(abs(M(x)-expected)))
   assert abs(M(z)-expected)<=q/2+M('1e-12')
   boundary=abs((expected+2)/q-m.nint((expected+2)/q))<M('1e-9')
   if not boundary:assert abs(M(z)-quant(expected,bits))<M('1e-12')
out['max_ts_error']=maxerr
print(json.dumps(floats(out)))
