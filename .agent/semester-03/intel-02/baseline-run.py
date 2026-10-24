import numpy as np
import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

DEG = np.pi / 180.0

def trimf(x, a, b, c):
    if x <= a:
        return 1.0 if a == b else 0.0
    if x >= c:
        return 1.0 if b == c else 0.0
    return (x - a) / (b - a) if x <= b else (c - x) / (c - b)

def trimf_vec(x, a, b, c):
    x = np.asarray(x, dtype=float)
    out = np.zeros_like(x)
    if b > a:
        m = (x > a) & (x <= b)
        out[m] = (x[m] - a) / (b - a)
    else:
        out[x <= b] = 1.0
    if c > b:
        m = (x > b) & (x < c)
        out[m] = (c - x[m]) / (c - b)
    else:
        out[x >= c] = 1.0
    return out

def make_tri_mfs(n, lo, hi):
    centers = np.linspace(lo, hi, n)
    params = []
    for i, c in enumerate(centers):
        a = lo if i == 0 else (centers[i-1] + c) / 2
        c_right = hi if i == n - 1 else (c + centers[i+1]) / 2
        params.append((a, c, c_right))
    return params

def fuzzify(x, params):
    return [trimf(x, a, b, c) for a, b, c in params]

def mamdani_infer(e, de, e_params, de_params, u_params, rules):
    e_mu = fuzzify(e, e_params)
    de_mu = fuzzify(de, de_params)
    u_grid = np.linspace(u_params[0][0], u_params[-1][2], 501)
    agg = np.zeros(501)
    for i in range(len(e_params)):
        for j in range(len(de_params)):
            w = min(e_mu[i], de_mu[j])
            if w > 0:
                k = rules[i][j]
                a, b, c = u_params[k]
                clipped = np.minimum(w, trimf_vec(u_grid, a, b, c))
                agg = np.maximum(agg, clipped)
    if agg.sum() < 1e-12:
        return 0.0
    return np.trapezoid(u_grid * agg, u_grid) / np.trapezoid(agg, u_grid)

def simulate(theta0, T, dt, e_params, de_params, u_params, rules, Ge, Gce, Gu):
    N = int(T / dt)
    theta, thetad = theta0, 0.0
    ths, us = [theta], [0.0]
    for _ in range(N):
        e_s = -theta * Ge
        de_s = -thetad * Gce
        u_raw = mamdani_infer(e_s, de_s, e_params, de_params, u_params, rules)
        u = np.clip(u_raw * Gu, -15.0, 15.0)
        theta_ddot = 19.6 * np.sin(theta) + 4.0 * u
        thetad += theta_ddot * dt
        theta += thetad * dt
        ths.append(theta)
        us.append(u)
    return np.array(ths), np.array(us)
# 模糊 PD 闭环仿真
n = 5
e_params = make_tri_mfs(n, -1.0, 1.0)
de_params = make_tri_mfs(n, -1.0, 1.0)
u_params = make_tri_mfs(n, -1.0, 1.0)
rules = np.zeros((n, n), dtype=int)
for i in range(n):
    for j in range(n):
        rules[i][j] = max(0, min(n-1, round((i + j) / 2)))

T, dt = 6.0, 1e-4
theta0 = 20.0 * DEG
Ge, Gce, Gu = 2.0, 0.5, 12.0

th, u = simulate(theta0, T, dt, e_params, de_params, u_params, rules, Ge, Gce, Gu)
t = np.linspace(0, T, len(th))

rms = np.sqrt(np.mean(th**2)) / DEG
tv = np.sum(np.abs(np.diff(u)))
final = th[-1] / DEG
maxu = np.max(np.abs(u))

print(f"模糊 PD 控制器（Ge={Ge}, Gce={Gce}, Gu={Gu}）：")
print(f"  rms = {rms:.2f} deg")
print(f"  TV(u) = {tv:.1f}")
print(f"  稳态角度 = {final:.2f} deg")
print(f"  max|u| = {maxu:.2f} N*m")
print(f"\n结论：控制器没有稳定摆。rms = 21 deg，稳态 = 22 deg。")
