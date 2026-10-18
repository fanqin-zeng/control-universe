/** Sample one continuous exponential mode; this is not a full discretizer. */
export function sampledMode(sigma = -0.5, omega = 2, Ts = 0.1) {
  if (![sigma, omega, Ts].every(Number.isFinite) || sigma < -2 || sigma > 0.5 || omega < 0 || omega > 80 || Ts < 0.05 || Ts > 0.2) throw new RangeError("Outside the lesson domain");
  const radius = Math.exp(sigma * Ts), angle = omega * Ts;
  const real = radius * Math.cos(angle), imag = radius * Math.sin(angle);
  const samples = Array.from({length: 21}, (_, k) => [k, Math.exp(sigma * Ts * k) * Math.cos(angle * k), Math.exp(sigma * Ts * k) * Math.sin(angle * k)]);
  return {sigma, omega, Ts, radius, angle, real, imag, samples};
}
