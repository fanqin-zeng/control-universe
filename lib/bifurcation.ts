export function logisticOrbit(r=3.2,x0=.2,burn=2000,keep=256,window=8000){
  if(r<0||r>4||x0<0||x0>1||!Number.isFinite(r+x0))throw Error('invalid map domain');
  const orbit=[x0];let x=x0,sum=0,zeroDerivative=false;
  for(let n=0;n<burn+Math.max(keep,window);n++){
    if(n>=burn&&n<burn+window){const derivative=Math.abs(r*(1-2*x));if(derivative===0)zeroDerivative=true;else sum+=Math.log(derivative);}
    x=r*x*(1-x);orbit.push(x);
  }
  const cycle=r>3?[(r+1-Math.sqrt((r-3)*(r+1)))/(2*r),(r+1+Math.sqrt((r-3)*(r+1)))/(2*r)]:[];
  return {r,x0,burn,keep,window,orbit,series:orbit.slice(burn+1,burn+keep+1).map((v,i)=>[burn+1+i,v]),lyapunov:zeroDerivative?null:sum/window,zeroDerivative,cycle,cycleMultiplier:4+2*r-r*r};
}
export function logisticCloud(x0=.2){const points:number[][]=[];for(let i=0;i<=120;i++){const r=2.8+i*.01,run=logisticOrbit(r,x0,2000,48,48);for(const row of run.series)points.push([r,row[1]]);}return points;}
