/** Horizontal frictionless slide, constant commanded force, no stop contact. SI units. */
export function robotSlide(mass: number, command: number, initialVelocity: number) {
  const force = Math.max(-2, Math.min(2, command));
  const acceleration = force / mass;
  const samples = Array.from({ length: 101 }, (_, k) => {
    const t = k / 100;
    return { t, q: initialVelocity * t + acceleration * t * t / 2, v: initialVelocity + acceleration * t };
  });
  return { force, acceleration, samples, end: samples[100] };
}
