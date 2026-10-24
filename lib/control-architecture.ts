/** Serial measurement-to-output budget; all arguments and outputs are in ms.
 * This is an allocated upper-bound sum, not a WCET measurement or scheduler. */
export function controlArchitectureBudget(communication = 0.8, waiting = 0.5) {
  if (!Number.isFinite(communication) || communication < 0 || communication > 8 ||
      !Number.isFinite(waiting) || waiting < 0 || waiting > 2) {
    throw new RangeError('communication must be in [0,8], waiting in [0,2] ms');
  }
  const stages = [0.4, communication, waiting, 1.0, 0.3];
  const total = stages.reduce((sum, time) => sum + time, 0);
  const deadline = 5;
  return { stages, total, slack: deadline - total, deadline, period: 10,
    meetsDeadline: total <= deadline + 1e-12 };
}
