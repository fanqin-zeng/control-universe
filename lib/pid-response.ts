/** Exact zero-state response for ideal parallel PID with G=1/(s+1).
 * The ideal derivative creates direct feedthrough; this is an algebraic lesson,
 * not an actuator implementation. */
export function pidResponse(kp: number, ki: number, kd: number) {
  if (![kp,ki,kd].every(Number.isFinite) || kp < 0 || ki < 0 || kd < 0) throw new RangeError("nonnegative finite gains required");
  const d = kd/(1+kd), a1=(1+kp)/(1+kd), a0=ki/(1+kd);
  const c1=kp/(1+kd)-d*a1, c0=a0*(1-d);
  return Array.from({length:501},(_,i):[number,number]=>{
    const t=i/50;
    if (ki===0) return [t,kp/(1+kp)+(d-kp/(1+kp))*Math.exp(-a1*t)];
    const z=a1/2, delta=z*z-a0, q=Math.sqrt(Math.abs(delta));
    const f=q<1e-9?t:(delta>0?Math.sinh(q*t):Math.sin(q*t))/q;
    const g=delta>0?Math.cosh(q*t):Math.cos(q*t), e=Math.exp(-z*t);
    const x=(1-e*(g+z*f))/a0, v=e*f;
    return [t,d+c0*x+c1*v];
  });
}

export function pidFilter(kd: number, tf: number) {
  if (!(kd>0 && tf>0 && Number.isFinite(kd) && Number.isFinite(tf))) throw new RangeError("positive finite filter parameters required");
  return Array.from({length:201},(_,i)=>{
    const w=10**(-2+i/40), h=kd*w/Math.hypot(1,tf*w);
    return {w,ideal:20*Math.log10(kd*w),actual:20*Math.log10(h),phase:90-Math.atan(tf*w)*180/Math.PI};
  });
}
