/** Exact finite teaching model; no fitted parameters or learning algorithm. */
export function rlProblem(p = .6, gamma = .9, alpha = 1) {
  const direct = p * 6 + (1 - p) * -4;
  const charge = -1 + gamma * 6;
  const expected = alpha * charge + (1 - alpha) * direct;
  return { direct, charge, expected, success: alpha + (1 - alpha) * p,
    steps: 1 + alpha, threshold: (3 + 6 * gamma) / 10 };
}
