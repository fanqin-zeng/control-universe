/** Dimensionless pendulum: all integration uses the unwrapped angle. */
export const PENDULUM_DEFAULT = { d: 0.3, theta: 2, omega: 0 };
export const pendulumEnergy = (theta: number, omega: number) => 0.5*omega*omega + 1-Math.cos(theta);
export const wrapAngle = (theta: number) => ((theta+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
export function pendulumTrajectory(d: number, theta: number, omega: number) {
  if (![d,theta,omega].every(Number.isFinite) || d<0 || d>2 || Math.abs(theta)>3 || Math.abs(omega)>3) throw new RangeError("Parameters outside lesson controls");
  const dt=0.01, steps=6000;
  const samples=[{t:0,theta,omega,energy:pendulumEnergy(theta,omega)}];
  const f=(q:number,v:number):[number,number]=>[v,-Math.sin(q)-d*v];
  for(let i=1;i<=steps;i++) {
    const a=f(theta,omega), b=f(theta+dt*a[0]/2,omega+dt*a[1]/2);
    const c=f(theta+dt*b[0]/2,omega+dt*b[1]/2), e=f(theta+dt*c[0],omega+dt*c[1]);
    theta+=dt*(a[0]+2*b[0]+2*c[0]+e[0])/6;
    omega+=dt*(a[1]+2*b[1]+2*c[1]+e[1])/6;
    if(i%4===0) samples.push({t:i*dt,theta,omega,energy:pendulumEnergy(theta,omega)});
  }
  return samples;
}
export function pendulumLevel(c:number):[number,number][] {
  if(!(c>0 && c<2)) return [];
  const limit=Math.acos(1-c), upper:[number,number][]=[], lower:[number,number][]=[];
  for(let i=0;i<=140;i++) {
    const q=-limit+2*limit*i/140, w=Math.sqrt(Math.max(0,2*(c-1+Math.cos(q))));
    upper.push([q,w]);lower.push([q,-w]);
  }
  return upper.concat(lower.reverse());
}
export function wrappedPhase(samples:ReturnType<typeof pendulumTrajectory>) {
  const data:([number,number]|null)[]=[];
  for(const s of samples) {
    const q=wrapAngle(s.theta),prev=data[data.length-1];
    if(prev && Math.abs(q-prev[0])>Math.PI) data.push(null);
    data.push([q,s.omega]);
  }
  return data;
}
