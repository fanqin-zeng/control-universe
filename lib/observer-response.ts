/** Actual observer trajectories: physical cart u=0, x0=[1,0], xhat0=0. */
export function observerResponse(p:number,t:number){
 if(!Number.isFinite(p)||p< -30||p> -5||!Number.isFinite(t)||t<0)throw Error('observer domain');
 const l1=-2*p-3,l2=p*p-3*l1-2,ep=Math.exp(p*t);
 const position=2*Math.exp(-t)-Math.exp(-2*t),velocity=-2*Math.exp(-t)+2*Math.exp(-2*t);
 const e1=(-1-(p+3)*t)*ep,e2=(p+3)**2*t*ep,w=100;
 const noiseVelocity=Math.hypot(-2*l1,w*l2)/Math.hypot(p*p-w*w,-2*p*w);
 return {position,velocity,estimate:position+e1,velocityEstimate:velocity+e2,e1,e2,l1,l2,peakTime:-1/p,peak:(p+3)**2/(-p*Math.E),noiseVelocity};
}
