export function dwellConstants(a=3) {
  const p=.5,q=a/4,r=.5+a*a/4;
  const maxEigen=(p+r+Math.hypot(p-r,2*q))/2;
  const trace=(p*p+r*r-2*q*q)/(p*r-q*q);
  const mu=(trace+Math.sqrt(Math.max(0,trace*trace-4)))/2;
  return {lambda:1/maxEigen,mu,threshold:Math.log(mu)*maxEigen};
}
/** Exact per-mode flow, split at every switching event. No state reset. */
export function simulateSwitched(tau=2,a=3,T=16,dt=.02) {
  if(tau<=0||dt<=0||T<=0)throw new Error('Positive times required');
  let state=[1,0],time=0,mode=1,switches=0;
  const flow=(h:number)=>{const e=Math.exp(-h),[x,y]=state;state=mode===1?[e*(x+a*h*y),e*y]:[e*x,e*(y+a*h*x)];};
  const rows:number[][]=[];
  for(let i=0;i<=Math.round(T/dt);i++){
    const target=i===Math.round(T/dt)?T:i*dt;
    while((switches+1)*tau<=target+1e-12){const event=(switches+1)*tau;flow(Math.max(0,event-time));time=event;mode=3-mode;switches++;}
    flow(Math.max(0,target-time));time=target;
    rows.push([target,state[0],state[1],Math.hypot(...state),mode]);
  }
  const logRho=-2*tau+2*Math.asinh(a*tau/2),rho=Math.exp(logRho);
  return {rows,final:rows[rows.length-1],rho,logRho,switches,...dwellConstants(a)};
}
