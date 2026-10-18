/** CLASSIC-05 fixed teaching models; frequencies rad/s, phase degrees. */
export function secondFrequency(z:number,wn:number,w:number){
 if(!Number.isFinite(z)||z<=0||!Number.isFinite(wn)||wn<=0||!Number.isFinite(w)||w<0)throw new RangeError('invalid frequency parameters');
 const a=1-(w/wn)**2,b=2*z*w/wn,d=a*a+b*b,re=a/d,im=-b/d,mag=Math.hypot(re,im);
 return {re,im,mag,db:20*Math.log10(mag),phase:Math.atan2(im,re)*180/Math.PI};
}
export function secondCurve(z:number,wn:number){return Array.from({length:601},(_,i)=>{const w=10**(-2+5*i/600);return {w,...secondFrequency(z,wn,w)};});}
export function secondMetrics(z:number,wn:number){
 secondFrequency(z,wn,0);const a=1-2*z*z,bandwidth=wn*Math.sqrt(a+Math.hypot(a,1));
 const wr=z<Math.SQRT1_2?wn*Math.sqrt(1-2*z*z):0,mr=wr?secondFrequency(z,wn,wr).mag:1;
 const ratio=1/Math.sqrt(Math.sqrt(1+4*z**4)+2*z*z),pm=Math.atan2(2*z,ratio)*180/Math.PI;
 return {bandwidth,wr,mr,mrDb:20*Math.log10(mr),pm,wc:wn*ratio,mp:z<1?100*Math.exp(-Math.PI*z/Math.sqrt(1-z*z)):0};
}
export function bandwidthExample(wn:number){
 if(!Number.isFinite(wn)||wn<=0)throw new RangeError('wn>0');
 const at=(x:number)=>1-Math.exp(-x/2)*(Math.cos(Math.sqrt(.75)*x)+Math.sin(Math.sqrt(.75)*x)/Math.sqrt(3));
 const crossing=(target:number)=>{let lo=0,hi=Math.PI/Math.sqrt(.75);for(let i=0;i<55;i++){const m=(lo+hi)/2;if(at(m)<target)lo=m;else hi=m;}return (lo+hi)/(2*wn);};
 const tr=crossing(.9)-crossing(.1),metrics=secondMetrics(.5,wn);
 return {...metrics,tr,product:tr*metrics.bandwidth,steps:Array.from({length:601},(_,i)=>[i/200,at(wn*i/200)] as [number,number])};
}
export function rcFrequency(r:number,cMicro:number,w:number){
 if(!Number.isFinite(r)||r<=0||!Number.isFinite(cMicro)||cMicro<=0||!Number.isFinite(w)||w<0)throw new RangeError('invalid RC');
 const tau=r*cMicro*1e-6,q=w*tau,mag=1/Math.hypot(1,q);
 return {mag,db:20*Math.log10(mag),phase:-Math.atan(q)*180/Math.PI,tau,omega0:1/tau,f0:1/(2*Math.PI*tau)};
}
export function rcCurve(r:number,c:number){return Array.from({length:601},(_,i)=>{const w=10**(6*i/600);return {w,...rcFrequency(r,c,w)};});}
