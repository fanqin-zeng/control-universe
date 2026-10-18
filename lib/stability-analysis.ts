/** CLASSIC-04: fixed teaching models; no generic numerical Routh solver. */
export function cubicPlane(a2:number){
 if(!Number.isFinite(a2)||a2<=0)throw new RangeError('a2 must be positive');
 const boundary:[number,number][]=[],stable:[number,number][]=[];
 for(let i=0;i<=100;i++){const a1=i/10;boundary.push([a1,a1*a2]);for(let j=0;j<=50;j++){const a0=j/5;if(a1>0&&a0>0&&a2*a1>a0+1e-10)stable.push([a1,a0]);}}
 return {boundary,stable,atFive:5*a2};
}
export function pendulumPlane(kp:number,kd:number){
 if(!Number.isFinite(kp)||!Number.isFinite(kd))throw new RangeError('invalid gains');
 const stable:[number,number][]=[];for(let i=1;i<=50;i++)for(let j=0;j<=50;j++)if(j*.4>9.8+1e-10)stable.push([i*.2,j*.4]);
 const discriminant=kd*kd-4*(kp-9.8),real=-kd/2;
 const poles=discriminant<0?[[real,Math.sqrt(-discriminant)/2],[real,-Math.sqrt(-discriminant)/2]]:[[real+Math.sqrt(discriminant)/2,0],[real-Math.sqrt(discriminant)/2,0]];
 return {stable,poles,status:kd>0&&kp>9.8?'严格稳定':kp===9.8?'含零根，不严格稳定':kd===0&&kp>9.8?'简单虚轴根，不渐近稳定':'不严格稳定'};
}
export function delayBounds(k:number){
 if(!Number.isFinite(k)||k<=0)throw new RangeError('K must be positive');
 const omega=k/Math.sqrt(Math.hypot(2,k)+2); // stable form avoids cancellation
 const exact=Math.atan2(2,omega)/omega,pade=4/(Math.hypot(k,2)+k-2);
 return {omega,exact,pade};
}
export function delayStatus(k:number,l:number){
 if(!Number.isFinite(l)||l<0)throw new RangeError('invalid delay');const b=delayBounds(k);
 const label=(edge:number)=>Math.abs(l-edge)<1e-10?'临界，不严格稳定':l<edge?'严格稳定':'不稳定';
 return {...b,exactStatus:label(b.exact),padeStatus:label(b.pade)};
}
export function delayCurves(){return Array.from({length:146},(_,i)=>{const k=.5+i*.1;return {k,...delayBounds(k)};});}
