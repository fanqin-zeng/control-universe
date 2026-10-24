export type RlsScenario = 'steady' | 'jump' | 'quiet';
export function rlsIdentification(lambda = 1, disturbance = 0, scenario: RlsScenario = 'steady') {
  if (!Number.isFinite(lambda) || lambda < .9 || lambda > 1 || !Number.isFinite(disturbance) || disturbance < 0 || disturbance > .12 || !['steady', 'jump', 'quiet'].includes(scenario)) throw new RangeError('Invalid RLS teaching parameters');
  let estimate = 0, informationInverse = 1, level = 0;
  const rows = [{n: 0, truth: .2, estimate, informationInverse, input: 0, level, residual: 0}];
  for (let k = 0; k < 32; k++) {
    const input = scenario === 'quiet' ? 0 : [1, 0, 1, 1][k % 4];
    const truth = scenario === 'jump' && k >= 16 ? .5 : .2;
    const error = scenario === 'quiet' ? 0 : (k % 2 === 0 ? disturbance : -disturbance);
    const nextLevel = .8 * level + truth * input + error;
    const target = nextLevel - .8 * level;
    const denominator = lambda + input * informationInverse * input;
    if (!(denominator > 0) || !Number.isFinite(denominator)) throw new Error('RLS denominator is invalid');
    const gain = informationInverse * input / denominator;
    const residual = target - input * estimate;
    estimate += gain * residual;
    informationInverse = (informationInverse - gain * input * informationInverse) / lambda;
    if (!(informationInverse > 0) || !Number.isFinite(estimate) || !Number.isFinite(informationInverse)) throw new Error('RLS lost finite positive information');
    level = nextLevel;
    rows.push({n: k + 1, truth, estimate, informationInverse, input, level, residual});
  }
  return {rows, final: rows[rows.length - 1]};
}
