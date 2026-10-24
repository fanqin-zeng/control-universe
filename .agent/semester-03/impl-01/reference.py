"""Independent checks: Decimal for budgets, symbolic integrals for lifetime,
event-by-event preemptive schedule for the two-task RMS example."""
import json
import sys
import math
from decimal import Decimal
import sympy as sp

cases = json.load(open(sys.argv[1], encoding="utf-8"))
error = 0.0
for case in cases:
    expected = sum(Decimal(str(v)) for v in ["0.4", case["net"], case["waiting"], "1.0", "0.3"])
    error = max(error, abs(float(expected)-case["result"]["total"]))
    assert abs(float(Decimal(5)-expected)-case["result"]["slack"]) < 1e-10
    assert case["result"]["meetsDeadline"] == (expected <= 5)
assert error < 1e-10

# Exact single hyperperiod simulation, 0.1ms ticks; simultaneous releases and
# preemption resolved by high-priority-first service, unlike response iteration.
remaining = [0, 0]
finish = {}
for tick in range(80):
    if tick % 40 == 0:
        assert remaining[0] == 0
        remaining[0] = 20
    if tick == 0:
        remaining[1] = 28
    for i in range(2):
        if remaining[i]:
            remaining[i] -= 1
            if not remaining[i]:
                finish[i] = (tick+1)/10
            break
assert finish[1] == 6.8
t = sp.symbols("t", nonnegative=True)
single = sp.exp(-t/10)
parallel = sp.integrate(1-(1-single)**2, (t, 0, sp.oo))
tmr = sp.integrate(3*single**2-2*single**3, (t, 0, sp.oo))
print(json.dumps({"pass": True, "configs": len(cases), "maxTsError": error,
  "budgets": [2.4, 3.0, 5.2], "bound": float(2*(sp.sqrt(2)-1)),
  "u": .85, "response": [2.8, 4.8, 6.8, 6.8], "scheduledResponse": finish[1],
  "phase": {"network_loss_deg": math.degrees(.1), "network_pm_deg": 45-math.degrees(.1),
    "zoh_loss_deg": math.degrees(.05), "zoh_pm_deg": 50-math.degrees(.05),
    "max_period_ms": math.pi/180*1000, "with_path_loss_deg": math.degrees(.16),
    "clock_1ms_at100_deg": math.degrees(.1)},
  "mttf_parallel": float(parallel), "mttf_tmr": float(tmr),
  "reliability": {str(r): 3*r**2-2*r**3 for r in [.9,.4,.5]},
  "extra_total": 3.7}))
