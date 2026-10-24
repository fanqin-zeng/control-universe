// Small, deterministic teaching experiment. No access to held-out labels in fit().
export const trainingX = [-1, -.5, 0, .5, 1];
export const validationX = [-.8, -.2, .2, .8];
export const testX = [-.9, -.6, -.3, .3, .6, .9];
export function truth(x: number, shift = 0) { return 1 + 2 * x + shift * x * x; }
export function predict(c: number[], x: number) { return c.reduceRight((v, a) => v * x + a, 0); }
export function fit(degree: number, noise: number) {
  if (![0, 1, 4].includes(degree) || noise < 0 || noise > .4) throw new Error('Invalid teaching parameters');
  const n = degree + 1;
  const ys = trainingX.map((x, i) => truth(x) + noise * (i % 2 === 0 ? 1 : -1));
  const matrix = Array.from({length: n}, (_, j) => Array.from({length: n + 1}, (_, k) =>
    trainingX.reduce((s, x, i) => s + (k === n ? x ** j * ys[i] : x ** (j + k)), 0)));
  for (let k = 0; k < n; k++) {
    let pivot = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(matrix[i][k]) > Math.abs(matrix[pivot][k])) pivot = i;
    [matrix[k], matrix[pivot]] = [matrix[pivot], matrix[k]];
    const divisor = matrix[k][k];
    if (Math.abs(divisor) < 1e-12) throw new Error('Singular teaching system');
    for (let j = k; j <= n; j++) matrix[k][j] /= divisor;
    for (let i = 0; i < n; i++) if (i !== k) {
      const factor = matrix[i][k];
      for (let j = k; j <= n; j++) matrix[i][j] -= factor * matrix[k][j];
    }
  }
  return matrix.map(row => row[n]);
}
export function experiment(degree = 1, noise = .2, shift = 0) {
  if (shift < 0 || shift > 1) throw new Error('Invalid shift');
  const c = fit(degree, noise);
  const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
  const train = mean(trainingX.map((x, i) => (predict(c, x) - truth(x) - noise * (i % 2 === 0 ? 1 : -1)) ** 2));
  const validation = mean(validationX.map(x => (predict(c, x) - truth(x)) ** 2));
  const test = mean(testX.map(x => (predict(c, x) - truth(x, shift)) ** 2));
  return {c, train, validation, test};
}
