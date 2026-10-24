"""Independent Fraction line-time ledger + normal-polynomial CRC long division."""
from pathlib import Path
from fractions import Fraction as F
import json,struct
E=Path(__file__).resolve().parent

def crc(data):
 r=0xffff
 for byte in data:
  r^=int(f"{byte:08b}"[::-1],2)<<8
  for _ in range(8):r=((r<<1)^0x8005 if r&0x8000 else r<<1)&0xffff
 return int(f"{r:016b}"[::-1],2)
def frame(data):return data+list(crc(data).to_bytes(2,'little'))
def budget(baud=19200,registers=2,stations=1,period=20):
 char=F(11000,baud);gap=char*F(7,2) if baud<=19200 else F(7,4)
 segments=[F(8)*char,gap,F(1),F(5+2*registers)*char,gap]
 slot=sum(segments);cycle=slot*stations
 return dict(baud=baud,registers=registers,stations=stations,period=period,charMs=float(char),gapMs=float(gap),requestBytes=8,responseBytes=5+2*registers,segments=list(map(float,segments)),slotMs=float(slot),cycleMs=float(cycle),marginMs=float(F(period)-cycle),ratio=float(cycle/F(period)),fits=cycle<=period)
cases=[budget(b,n,m,p) for b in [9600,19200,38400,115200] for n in [1,2,8,16] for m in [1,3,4] for p in [20,50,100]]+[budget(b,2,1,20) for b in [19199,19201]]
request=frame([1,3,0,0,0,2]);response=frame([1,3,4,0x12,0x34,0xff,0x9c]);raw,signed=struct.unpack('>Hh',bytes(response[3:7]))
vectors=[dict(data=d,crc=crc(d),frame=frame(d)) for d in [[2,7],[1,3,0,0,0,2],[1,3,4,0x12,0x34,0xff,0x9c],[],[0],[255],list(range(256))]]
assert vectors[0]['crc']==0x1241
report=dict(cases=cases,default=budget(),request=request,response=response,vectors=vectors,decode=dict(registers=[raw,int.from_bytes(bytes(response[5:7]),'big')],signed=signed,temperature=signed/10),boundary=budget(9600),high=budget(115200,2,3))
(E/'reference.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['cases','vectors']}))
