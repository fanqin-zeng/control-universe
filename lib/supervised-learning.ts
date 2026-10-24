export const ridgeValues = [0, .5, 1, 2];
export const iterationBudgets = [0, 1, 5, 20, 40, 200];
export const regressionX = [-1, 0, 1];
export const classificationX = [-2, -1, 1, 2];
export const classificationY = [0, 0, 1, 1];
export function sigmoid(z: number) {
  return z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z));
}
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
export function fitRegression(lambda = 1, disturbance = 0) {
  if (!ridgeValues.includes(lambda) || !Number.isFinite(disturbance) || disturbance < 0 || disturbance > 2) throw new RangeError('Invalid regression parameters');
  const y = [0, 1, 2 + disturbance];
  const b = mean(y), w = mean(regressionX.map((x, i) => x * y[i])) / (mean(regressionX.map(x => x * x)) + lambda);
  const mse = mean(regressionX.map((x, i) => (b + w * x - y[i]) ** 2));
  const validation = mean([-.5, .5].map(x => (b + w * x - (1 + x)) ** 2));
  const test = mean([-.75, .75].map(x => (b + w * x - (1 + x)) ** 2));
  const penalty = lambda * w * w / 2;
  return {b, w, mse, dataLoss: mse / 2, penalty, objective: mse / 2 + penalty, validation, test};
}
export function fitClassifier(lambda = 1, budget = 40) {
  if (!ridgeValues.includes(lambda) || !iterationBudgets.includes(budget)) throw new RangeError('Invalid classification parameters');
  let b = 0, w = 0, updates = 0;
  const gradient = () => {
    const residual = classificationX.map((x, i) => sigmoid(b + w * x) - classificationY[i]);
    return [mean(residual), mean(residual.map((r, i) => r * classificationX[i])) + lambda * w];
  };
  let [gb, gw] = gradient();
  while (updates < budget && Math.hypot(gb, gw) > 1e-10) {
    b -= .5 * gb; w -= .5 * gw; updates++;
    [gb, gw] = gradient();
  }
  const ce = mean(classificationX.map((x, i) => {
    const z = b + w * x;
    return Math.max(z, 0) + Math.log1p(Math.exp(-Math.abs(z))) - classificationY[i] * z;
  }));
  const penalty = lambda * w * w / 2;
  const gradientNorm = Math.hypot(gb, gw);
  return {b, w, updates, gradientNorm, converged: gradientNorm <= 1e-10, ce, penalty, objective: ce + penalty,
    probabilities: classificationX.map(x => sigmoid(b + w * x))};
}
export function trainingAccuracy(probabilities: number[], threshold: number) {
  return mean(probabilities.map((p, i) => Number(Number(p >= threshold) === classificationY[i])));
}
