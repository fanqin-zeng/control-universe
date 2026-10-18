/** Zero-state unit-reference responses for q''+3q'+2q=u. */
export function stateFeedbackResponse(p: number, t: number) {
  if (!Number.isFinite(p) || p < -10 || p > -0.5 || !Number.isFinite(t) || t < 0) throw new RangeError('p in [-10,-0.5], t>=0 required');
  const a=-p, e=Math.exp(-a*t), k1=a*a-2, k2=2*a-3, N=a*a;
  const position=1-(1+a*t)*e, velocity=a*a*t*e;
  const force=N-k1*position-k2*velocity, baseline=(1-Math.exp(-t))**2;
  return {position,velocity,force,baseline,rawOpen:baseline/2,baselineForce:2,k1,k2,N};
}
