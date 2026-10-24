export type MixedParameters={a:number;k:number;rho:number;wb:number};
export const mixedDefault:MixedParameters={a:20,k:200,rho:.01,wb:5};
export function mixedFrequency(p:MixedParameters,w:number){
 const x=w*w,d=(p.k-x)**2+p.a*p.a*x;
 const S=Math.sqrt(x*(x+p.a*p.a)/d),T=p.k/Math.sqrt(d);
 const KS=p.k/100*Math.sqrt(((100-x)**2+x)/d);
 const W1=Math.sqrt((.25*x+p.wb*p.wb)/(x+(.01*p.wb)**2));
 return {S,T,KS,W1,bound:1/W1,stack:Math.hypot(W1*S,.1*T,p.rho*KS)};
}
export function mixedReadings(p:MixedParameters){
 let scanPeak=1,gamma=Math.max(.1,Math.hypot(.5,p.rho*p.k/100));
 for(let i=0;i<=4000;i++){const r=mixedFrequency(p,10**(-4+8*i/4000));scanPeak=Math.max(scanPeak,r.S);gamma=Math.max(gamma,r.stack);}
 return {scanPeak,gamma,T10:mixedFrequency(p,10).T,DC:0,initialControl:p.k/100,stable:p.a>0&&p.k>0};
}
