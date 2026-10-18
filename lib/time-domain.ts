/** CLASSIC-03: zero-state, unit-DC models. x = wn*t; impulse has units s^-1. */
export function responseAt(zeta: number, wn: number, t: number, kind: "step" | "impulse" | "road" = "step") {
  if (!Number.isFinite(zeta) || zeta < 0 || zeta > 2 || !Number.isFinite(wn) || wn <= 0 || !Number.isFinite(t) || t < 0) throw new RangeError("invalid response parameters");
  const x=wn*t;
  let step: number, h: number;
  if(zeta<1){const d=Math.sqrt(1-zeta*zeta),e=Math.exp(-zeta*x);h=e*Math.sin(d*x)/d;step=1-e*(Math.cos(d*x)+zeta*Math.sin(d*x)/d);}
  else if(zeta===1){const e=Math.exp(-x);h=x*e;step=1-(1+x)*e;}
  else {const d=Math.sqrt(zeta*zeta-1),a=-zeta+d,b=-zeta-d;h=(Math.exp(a*x)-Math.exp(b*x))/(a-b);step=1+(b*Math.exp(a*x)-a*Math.exp(b*x))/(a-b);}
  return kind==="impulse" ? wn*h : kind==="road" ? step+2*zeta*h : step;
}

export function responseCurve(zeta: number, wn: number, end: number, count: number, kind: "step" | "impulse" | "road" = "step"): [number,number][] {
  if(!Number.isFinite(end)||end<=0||!Number.isInteger(count)||count<1)throw new RangeError("invalid time grid");
  return Array.from({length:count+1},(_,i)=>[end*i/count,responseAt(zeta,wn,end*i/count,kind)]);
}

/** Last crossing of the error band; search extends to an analytic all-future tail bound. */
export function settlingTime(zeta: number, wn: number, band=.02, road=false): number | null {
  if(!Number.isFinite(band)||band<=0||band>=1)throw new RangeError("invalid error band");
  responseAt(zeta,wn,0);
  if(zeta===0)return null;
  const bound=(x:number)=>{
    if(zeta<1)return Math.exp(-zeta*x)/Math.sqrt(1-zeta*zeta);
    if(zeta===1)return (1+x)*Math.exp(-x); // also bounds road |x-1|e^-x
    const d=Math.sqrt(zeta*zeta-1),a=-zeta+d,b=-zeta-d;
    const ca=(b+(road?2*zeta:0))/(a-b),cb=(-a-(road?2*zeta:0))/(a-b);
    return Math.abs(ca)*Math.exp(a*x)+Math.abs(cb)*Math.exp(b*x);
  };
  let end=1;while(bound(end)>band*.5){end*=2;if(end>1e6)throw new Error("tail bound not reached");}
  // Check every response extremum: a narrow excursion cannot hide between samples.
  const nodes=[0],f=(x:number)=>Math.abs(responseAt(zeta,1,x,road?"road":"step")-1)-band;
  if(zeta<1){const d=Math.sqrt(1-zeta*zeta),phase=road?2*Math.acos(zeta):Math.PI;for(let k=0;(phase+k*Math.PI)/d<end;k++)nodes.push((phase+k*Math.PI)/d);}
  else if(road){const d=Math.sqrt(zeta*zeta-1),peak=zeta===1?2:Math.log((-zeta-d)**2/(-zeta+d)**2)/(2*d);if(peak<end)nodes.push(peak);}
  nodes.push(end);
  let last=-1;for(let i=0;i<nodes.length;i++)if(f(nodes[i])>0)last=i;
  if(last<0)return 0;
  let lo=nodes[last],hi=nodes[last+1];
  for(let i=0;i<50;i++){const mid=(lo+hi)/2;if(f(mid)>0)lo=mid;else hi=mid;}
  return (lo+hi)/(2*wn);
}

export function responseMetrics(zeta: number, wn: number, road=false) {
  responseAt(zeta,wn,0);
  if(zeta===0)return {tp:null,mp:null,tr:null,ts:null,envelope:null};
  let tp:number|null=null;
  if(road){
    if(zeta<1)tp=2*Math.acos(zeta)/(wn*Math.sqrt(1-zeta*zeta));
    else if(zeta===1)tp=2/wn;
    else{const d=Math.sqrt(zeta*zeta-1),a=-zeta+d,b=-zeta-d;tp=Math.log(b*b/(a*a))/(wn*(a-b));}
  }else if(zeta<1)tp=Math.PI/(wn*Math.sqrt(1-zeta*zeta));
  return {tp,mp:tp===null?0:100*(responseAt(zeta,wn,tp,road?"road":"step")-1),
    tr:!road&&zeta<1?(Math.PI-Math.acos(zeta))/(wn*Math.sqrt(1-zeta*zeta)):null,
    ts:settlingTime(zeta,wn,.02,road),
    envelope:zeta<1?Math.log(1/(.02*Math.sqrt(1-zeta*zeta)))/(zeta*wn):null};
}

export function firstOrder(tau: number) {
  if(!Number.isFinite(tau)||tau<=0)throw new RangeError("invalid time constant");
  return {tr:tau*Math.log(9),ts2:-tau*Math.log(.02),ts5:-tau*Math.log(.05),
    samples:Array.from({length:501},(_,i)=>[30*i/500,1-Math.exp(-30*i/(500*tau))] as [number,number])};
}
