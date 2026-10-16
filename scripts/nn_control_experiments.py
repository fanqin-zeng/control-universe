"""NN control experiments: depth/width study, ES, REINFORCE, robustness.
Plant: rotary inverted pendulum, theta_ddot = 19.6*sin(theta) + 4*u, |u|<=15
"""
import json
import numpy as np

rng = np.random.default_rng(42)

DEG = np.pi / 180.0
U_MAX = 15.0
THETA0 = 20.0 * DEG
T, DT = 6.0, 1e-4

# normalization params from previous PID data collection
E_MEAN, E_STD = -0.001608, 0.045776
EDOT_MEAN, EDOT_STD = 0.051381, 0.239134


def simulate(theta0, T, dt, ctrl):
    n = int(T / dt)
    th = np.zeros(n + 1)
    thdot = np.zeros(n + 1)
    u = np.zeros(n + 1)
    th[0] = theta0
    integ = 0.0
    prev_e = -theta0
    for k in range(n):
        e = -th[k]
        edot = -thdot[k]
        if hasattr(ctrl, 'ki'):
            pass
        u[k] = ctrl(e, edot, dt, k)
        u[k] = np.clip(u[k], -U_MAX, U_MAX)
        th[k + 1] = th[k] + thdot[k] * dt
        thdot[k + 1] = thdot[k] + (19.6 * np.sin(th[k]) + 4.0 * u[k]) * dt
    u[n] = u[n - 1]
    return th, u


class PIDCtrl:
    def __init__(self, kp=40.0, ki=10.0, kd=6.0):
        self.kp, self.ki, self.kd = kp, ki, kd
        self.integ = 0.0
        self.prev_e = None

    def reset(self):
        self.integ = 0.0
        self.prev_e = None

    def __call__(self, e, edot, dt, k):
        self.integ += e * dt
        self.integ = np.clip(self.integ, -U_MAX / self.ki, U_MAX / self.ki)
        return self.kp * e + self.ki * self.integ + self.kd * edot


def pid_ctrl_factory():
    p = PIDCtrl()
    def ctrl(e, edot, dt, k):
        return p(e, edot, dt, k)
    ctrl._pid = p
    return ctrl


def run_pid(theta0):
    ctrl = pid_ctrl_factory()
    th, u = simulate(theta0, T, DT, ctrl)
    return th, u


def metrics(th, u):
    return {
        "rms_theta_deg": float(np.sqrt(np.mean(th**2)) / DEG),
        "final_theta_deg": float(th[-1] / DEG),
        "TV_u": float(np.sum(np.abs(np.diff(u)))),
        "max_u": float(np.max(np.abs(u))),
        "J_cost": float(np.sum(th**2 + 0.01 * u**2) * DT),
    }


# ---------- NN machinery ----------

def arch_params(sizes):
    """sizes e.g. [2,10,1] -> param count"""
    n = 0
    for i in range(len(sizes) - 1):
        n += sizes[i] * sizes[i + 1] + sizes[i + 1]
    return n


def init_weights(sizes, std_mult=1.0):
    ws = []
    for i in range(len(sizes) - 1):
        std = std_mult * np.sqrt(2.0 / (sizes[i] + sizes[i + 1]))
        ws.append(rng.normal(0, std, (sizes[i + 1], sizes[i])))
        ws.append(np.zeros(sizes[i + 1]))
    return ws


def flatten(ws):
    return np.concatenate([w.ravel() for w in ws])


def unflatten(theta, sizes):
    ws = []
    idx = 0
    for i in range(len(sizes) - 1):
        n1, n0 = sizes[i + 1], sizes[i]
        ws.append(theta[idx:idx + n1 * n0].reshape(n1, n0))
        idx += n1 * n0
        ws.append(theta[idx:idx + n1].copy())
        idx += n1
    return ws


def forward(ws, x):
    h = x
    for i in range(0, len(ws) - 2, 2):
        h = np.tanh(ws[i] @ h + ws[i + 1])
    z = ws[-2] @ h + ws[-1]
    return U_MAX * np.tanh(z)


def nn_ctrl(ws):
    def ctrl(e, edot, dt, k):
        x = np.array([(e - E_MEAN) / E_STD, (edot - EDOT_MEAN) / EDOT_STD])
        return float(forward(ws, x)[0])
    return ctrl


def eval_nn(ws, theta0=THETA0):
    th, u = simulate(theta0, T, DT, nn_ctrl(ws))
    return th, u, metrics(th, u)


def adam(loss_grad_fn, theta0_vec, lr=0.005, epochs=5000):
    m = np.zeros_like(theta0_vec)
    v = np.zeros_like(theta0_vec)
    b1, b2, eps = 0.9, 0.999, 1e-8
    for t in range(1, epochs + 1):
        g = loss_grad_fn(theta0_vec)
        m = b1 * m + (1 - b1) * g
        v = b2 * v + (1 - b2) * g * g
        mh = m / (1 - b1**t)
        vh = v / (1 - b2**t)
        theta0_vec = theta0_vec - lr * mh / (np.sqrt(vh) + eps)
    return theta0_vec


# ---------- data collection ----------

def collect_pid_data(n_points=2000):
    ctrl = pid_ctrl_factory()
    th, u = simulate(THETA0, T, DT, ctrl)
    idx = np.linspace(0, len(th) - 2, n_points).astype(int)
    idx = np.unique(idx)
    X, U = [], []
    for k in idx:
        e = -th[k]
        edot = -th[k + 1] / DT if k + 1 < len(th) else 0.0
        # edot from finite diff of theta
        edot = -(th[k + 1] - th[k]) / DT
        X.append([(e - E_MEAN) / E_STD, (edot - EDOT_MEAN) / EDOT_STD])
        U.append(u[k] / U_MAX)
    return np.array(X), np.array(U)


# ---------- supervised training ----------

def train_supervised(sizes, X, U, epochs=5000, lr=0.005):
    ws = init_weights(sizes)
    p0 = flatten(ws)

    def loss_grad_batch(p):
        ws_l = unflatten(p, sizes)
        n = len(X)
        H = X.T  # (2,n)
        caches = [H]
        for j in range(0, len(ws_l) - 2, 2):
            Z = ws_l[j] @ H + ws_l[j + 1][:, None]
            H = np.tanh(Z)
            caches.append(H)
        Zout = ws_l[-2] @ H + ws_l[-1][:, None]  # (1,n)
        TanhOut = np.tanh(Zout)
        Pred = TanhOut[0]  # in [-1,1] == u/U_MAX
        Err = Pred - U  # (n,)
        loss = np.mean(Err**2)
        dZout = (Err * (1 - TanhOut[0]**2))[None, :]  # (1,n)
        grads = [None] * len(ws_l)
        grads[-2] = dZout @ caches[-1].T
        grads[-1] = dZout.sum(axis=1)
        delta = ws_l[-2].T @ dZout  # (nh,n)
        for j in range(len(caches) - 1, 0, -1):
            dH = delta
            dZ = dH * (1 - caches[j]**2)
            idx_w = (j - 1) * 2
            grads[idx_w] = dZ @ caches[j - 1].T
            grads[idx_w + 1] = dZ.sum(axis=1)
            if j - 1 > 0:
                delta = ws_l[idx_w].T @ dZ
        return flatten([g / n for g in grads]), loss

    def lg(p):
        g, _ = loss_grad_batch(p)
        return g

    p_trained = adam(lg, p0, lr=lr, epochs=epochs)
    ws = unflatten(p_trained, sizes)
    # final loss
    _, final_loss = loss_grad_batch(p_trained)
    return ws, float(final_loss)


# ---------- ES training ----------

def train_es(sizes, pop=50, gens=200, lr=0.05, sigma=0.1, theta0=THETA0, dt=1e-3):
    p0 = flatten(init_weights(sizes))
    mu = p0.copy()
    # use coarser dt for speed
    def fitness(p):
        ws = unflatten(p, sizes)
        th, u = simulate(theta0, T, dt, nn_ctrl(ws))
        return -float(np.sum(th**2 + 0.01 * u**2) * dt)
    for g in range(gens):
        noise = rng.normal(0, sigma, (pop, len(mu)))
        fits = np.array([fitness(mu + noise[i]) for i in range(pop)])
        adv = (fits - fits.mean()) / (fits.std() + 1e-8)
        mu = mu + lr / (pop * sigma) * (adv @ noise)
        if (g + 1) % 50 == 0:
            print(f"  ES gen {g+1}: best fit={fits.max():.5f}")
    return unflatten(mu, sizes)


# ---------- REINFORCE ----------

def train_reinforce(sizes, episodes=100, lr=0.001, dt=1e-3, theta0=THETA0):
    ws = init_weights(sizes, std_mult=0.5)
    p = flatten(ws)

    def policy(p_vec, e, edot):
        ws_l = unflatten(p_vec, sizes)
        x = np.array([(e - E_MEAN) / E_STD, (edot - EDOT_MEAN) / EDOT_STD])
        h = x
        caches = [h]
        for j in range(0, len(ws_l) - 2, 2):
            h = np.tanh(ws_l[j] @ h + ws_l[j + 1])
            caches.append(h)
        z = ws_l[-2] @ h + ws_l[-1]
        mean = U_MAX * np.tanh(z)[0]
        return mean, caches, ws_l

    for ep in range(episodes):
        # rollout
        n = int(T / dt)
        th = np.zeros(n + 1)
        th[0] = theta0
        thdot = 0.0
        log_probs, rewards, cache_list = [], [], []
        for k in range(n):
            e = -th[k]
            edot = -thdot
            mean, caches, ws_l = policy(p, e, edot)
            # gaussian policy with fixed std
            std = 1.5
            action = mean + rng.normal(0, std)
            action = np.clip(action, -U_MAX, U_MAX)
            logp = -0.5 * ((action - mean) / std)**2 - np.log(std * np.sqrt(2 * np.pi))
            log_probs.append(logp)
            cache_list.append((caches, ws_l, mean, action))
            r = -(th[k]**2 + 0.01 * action**2) * dt
            rewards.append(r)
            # plant step
            th[k + 1] = th[k] + thdot * dt
            thdot = thdot + (19.6 * np.sin(th[k]) + 4.0 * action) * dt
        rewards = np.array(rewards)
        returns = np.cumsum(rewards[::-1])[::-1]
        baseline = returns.mean()
        adv = returns - baseline
        # policy gradient (numeric: d logp/d mean * d mean/d p)
        grad = np.zeros_like(p)
        for k in range(n):
            caches, ws_l, mean, action = cache_list[k]
            dlogp_dmean = (action - mean) / 1.5**2
            # analytic grad of mean wrt p
            # recompute forward to get dz_out
            h = caches[-1]
            z_out = ws_l[-2] @ h + ws_l[-1]
            dmean_dz = U_MAX * (1 - np.tanh(z_out[0])**2)
            grads_w = [None] * len(ws_l)
            grads_w[-2] = np.outer(np.array([dmean_dz]), h)
            grads_w[-1] = np.array([dmean_dz])
            delta = ws_l[-2].T @ np.array([dmean_dz])
            for j in range(len(caches) - 1, 0, -1):
                dh = delta.ravel()
                dz = dh * (1 - caches[j]**2)
                idx_w = (j - 1) * 2
                grads_w[idx_w] = np.outer(dz, caches[j - 1])
                grads_w[idx_w + 1] = dz
                if j - 1 > 0:
                    delta = ws_l[idx_w].T @ dz[:, None]
            g = flatten(grads_w)
            grad += -dlogp_dmean * g * adv[k]
        grad /= n
        p = p + lr * grad
        if (ep + 1) % 20 == 0:
            print(f"  REINFORCE ep {ep+1}: return={rewards.sum():.4f}")
    return unflatten(p, sizes)


# ---------- main ----------

if __name__ == "__main__":
    print("=== PID baseline ===")
    th_pid, u_pid = run_pid(THETA0)
    m_pid = metrics(th_pid, u_pid)
    print(f"  PID: rms={m_pid['rms_theta_deg']:.2f} deg, J={m_pid['J_cost']:.4f}")

    print("\n=== Collect PID data for supervised ===")
    X, U = collect_pid_data(2000)
    print(f"  {len(X)} samples")

    archs = {
        "arch_2_5_1": [2, 5, 1],
        "arch_2_10_1": [2, 10, 1],
        "arch_2_20_1": [2, 20, 1],
        "arch_2_10_10_1": [2, 10, 10, 1],
        "arch_2_15_15_15_1": [2, 15, 15, 15, 1],
        "arch_2_20_20_20_1": [2, 20, 20, 20, 1],
    }

    results = {"pid_metrics": m_pid, "supervised": {}, "normalization": {
        "e_mean": E_MEAN, "e_std": E_STD,
        "edot_mean": EDOT_MEAN, "edot_std": EDOT_STD,
    }}

    print("\n=== Experiment 1: supervised depth/width study ===")
    trained_ws = {}
    for name, sizes in archs.items():
        print(f"  Training {name} ({arch_params(sizes)} params)...")
        ws, loss = train_supervised(sizes, X, U, epochs=3000, lr=0.005)
        trained_ws[name] = ws
        th, u, m = eval_nn(ws)
        m["train_loss"] = loss
        m["n_params"] = arch_params(sizes)
        results["supervised"][name] = {"metrics": m, "sizes": sizes}
        print(f"    loss={loss:.5f}, rms={m['rms_theta_deg']:.2f}, J={m['J_cost']:.4f}, TV={m['TV_u']:.1f}")

    # pick best by J
    best_name = min(results["supervised"], key=lambda k: results["supervised"][k]["metrics"]["J_cost"])
    best_sizes = results["supervised"][best_name]["sizes"]
    print(f"\n  Best supervised arch: {best_name}")

    print("\n=== Experiment 2: ES on best arch ===")
    ws_es = train_es(best_sizes, pop=40, gens=120, lr=0.05, sigma=0.1)
    th_es, u_es, m_es = eval_nn(ws_es)
    results["es_best"] = {"metrics": m_es, "arch": best_name, "sizes": best_sizes}
    print(f"  ES: rms={m_es['rms_theta_deg']:.2f}, J={m_es['J_cost']:.4f}, TV={m_es['TV_u']:.1f}")

    print("\n=== Experiment 3: REINFORCE on deep arch ===")
    ws_rl = train_reinforce([2, 20, 20, 1], episodes=80, lr=0.0005, dt=2e-3)
    th_rl, u_rl, m_rl = eval_nn(ws_rl)
    results["reinforce"] = {"metrics": m_rl, "sizes": [2, 20, 20, 1]}
    print(f"  REINFORCE: rms={m_rl['rms_theta_deg']:.2f}, J={m_rl['J_cost']:.4f}")

    print("\n=== Experiment 4: robustness ===")
    theta0_list = [5, 10, 15, 20, 25, 30, 35, 40, 45]
    rob = {"theta0_list": theta0_list, "pid": []}
    for t0d in theta0_list:
        ctrl = pid_ctrl_factory()
        th, u = simulate(t0d * DEG, T, DT, ctrl)
        rob["pid"].append(float(np.sqrt(np.mean(th**2)) / DEG))
    results["robustness_pid"] = rob

    # save weights for key models (JSON serializable)
    def ws_to_list(ws):
        return [w.tolist() for w in ws]

    print("\n=== Saving weights ===")
    ws_10 = trained_ws["arch_2_10_1"]
    ws_best = trained_ws[best_name]
    results["weights_sup_2_10_1"] = ws_to_list(ws_10)
    results["weights_sup_best"] = ws_to_list(ws_best)
    results["best_arch_name"] = best_name
    results["weights_es_best"] = ws_to_list(ws_es)
    results["weights_reinforce"] = ws_to_list(ws_rl)

    # robustness for saved models
    rob_nn = {"arch_2_10_1": [], "best_sup": [], "es": [], "reinforce": []}
    for t0d in theta0_list:
        for key, ws_x in [("arch_2_10_1", ws_10), ("best_sup", ws_best), ("es", ws_es), ("reinforce", ws_rl)]:
            th, u = simulate(t0d * DEG, T, DT, nn_ctrl(ws_x))
            rob_nn[key].append(float(np.sqrt(np.mean(th**2)) / DEG))
    results["robustness_nn"] = rob_nn

    with open("scripts/nn_control_results.json", "w") as f:
        json.dump(results, f, indent=1)
    print("\nSaved scripts/nn_control_results.json")

    print("\n=== SUMMARY ===")
    print(f"PID:        rms={m_pid['rms_theta_deg']:.2f}, J={m_pid['J_cost']:.4f}, TV={m_pid['TV_u']:.1f}")
    for name, d in results["supervised"].items():
        m = d["metrics"]
        print(f"{name:22s} rms={m['rms_theta_deg']:.2f}, J={m['J_cost']:.4f}, TV={m['TV_u']:.1f}, loss={m['train_loss']:.5f}")
    print(f"ES ({best_name}):  rms={m_es['rms_theta_deg']:.2f}, J={m_es['J_cost']:.4f}, TV={m_es['TV_u']:.1f}")
    print(f"REINFORCE:    rms={m_rl['rms_theta_deg']:.2f}, J={m_rl['J_cost']:.4f}, TV={m_rl['TV_u']:.1f}")
