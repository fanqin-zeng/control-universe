/** Ideal nonsynchronous Buck, first-order small-ripple CCM estimate only. */
export function buckEstimate(duty = 0.5, resistance = 6, inductanceMh = 1) {
  const vin = 24, fs = 20000, capacitance = 100e-6;
  const inductance = inductanceMh * 1e-3;
  const voltage = duty * vin;
  const current = voltage / resistance;
  const ripple = voltage * (1 - duty) / (inductance * fs);
  const minimum = current - ripple / 2;
  const maximum = current + ripple / 2;
  const voltageRipple = ripple / (8 * fs * capacitance);
  const boundary = 2 * inductance * fs / (1 - duty);
  const valid = minimum > 0;
  const points: number[][] = [];
  if (valid) for (let period = 0; period < 2; period++) {
    points.push([period * 50, minimum], [(period + duty) * 50, maximum], [(period + 1) * 50, minimum]);
  }
  return { voltage, current, ripple, minimum, maximum, voltageRipple, boundary, valid, points };
}
