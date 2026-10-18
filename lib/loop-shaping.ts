/** CLASSIC-09: normalized continuous SISO examples; independent Python tests live in verify-classic09. */
export function secondOrder(zeta:number,wn=10){
 if(!(zeta>0&&wn>0&&Number.isFinite(zeta)&&Number.isFinite(wn)))throw new RangeError('positive parameters required');
 const resonant=zeta<1/Math.SQRT2,mr=resonant?1/(2*zeta*Math.sqrt(1-zeta*zeta)):1,wr=resonant?wn*Math.sqrt(1-2*zeta*zeta):0;
 const wb=wn*Math.sqrt(1-2*zeta*zeta+Math.sqrt(2-4*zeta*zeta+4*zeta**4));
 return {mr,wr,wb,mrDb:20*Math.log10(mr),mp:zeta<1?100*Math.exp(-Math.PI*zeta/Math.sqrt(1-zeta*zeta)):0};
}
export function secondMagnitude(zeta:number,w:number,wn=10){return wn*wn/Math.hypot(wn*wn-w*w,2*zeta*wn*w);}
export function delayMetrics(tau:number){
 if(!(tau>=0&&Number.isFinite(tau)))throw new RangeError('nonnegative delay required');
 const wc=Math.sqrt((-1+Math.sqrt(401))/2),pm0=Math.atan(1/wc)*180/Math.PI,limit=pm0*Math.PI/(180*wc),pm=pm0-wc*tau*180/Math.PI;
 return {wc,pm0,limit,pm,status:Math.abs(tau-limit)<1e-10?'临界':tau<limit?'渐近稳定':'不稳定'};
}
export function delayedFrequency(tau:number,w:number){if(!(w>0))throw new RangeError('positive frequency required');return {db:20*Math.log10(10/(w*Math.hypot(1,w))),phase:-90-Math.atan(w)*180/Math.PI-w*tau*180/Math.PI};}
export function sensitivity(k:number,w:number){
 if(!(k>0&&w>0&&Number.isFinite(k)&&Number.isFinite(w)))throw new RangeError('positive parameters required');
 const re=-11*w*w,im=w*(10-w*w),closed=Math.hypot(re+k,im),den=Math.hypot(re,im);
 return {s:den/closed,t:k/closed,db:20*Math.log10(k/den),phase:-90-(Math.atan(w)+Math.atan(w/10))*180/Math.PI};
}
export function loopMetrics(k:number){
 if(!(k>0&&k<=200&&Number.isFinite(k)))throw new RangeError('gain must be in (0,200]');
 let a=1e-10,b=1000;for(let i=0;i<100;i++){const m=(a+b)/2;if(sensitivity(k,m).db>0)a=m;else b=m;}
 const wc=(a+b)/2,pm=180+sensitivity(k,wc).phase,gm=20*Math.log10(110/k),status=k===110?'临界':k<110?'渐近稳定':'不稳定';
 if(k===110)return {wc,pm,gm,status,ms:Infinity,wms:Math.sqrt(10)};
 // d|S|²/dx numerator /K: -44x³+(3K-2222)x²+202Kx+100K.
 // For K<=200 the coefficient signs have one change, hence one positive root.
 const derivative=(x:number)=>-44*x**3+(3*k-2222)*x*x+202*k*x+100*k;
 let lo=0,hi=1;while(derivative(hi)>0)hi*=2;for(let i=0;i<100;i++){const m=(lo+hi)/2;if(derivative(m)>0)lo=m;else hi=m;}
 const wms=Math.sqrt((lo+hi)/2),ms=sensitivity(k,wms).s;return {wc,pm,gm,status,ms,wms};
}
