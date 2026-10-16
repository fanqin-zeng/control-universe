"""Supplementary: (A) NN system identification demo, (B) REINFORCE per-episode return curve."""
import json
import numpy as np

rng = np.random.default_rng(7)
DEG = np.pi / 180.0
U_MAX = 15.0
T, DT = 6.0, 1e-4


# ---------- (A) System identification: learn theta_ddot = f(theta, thetadot, u) ----------
def collect_sysid_data(n=4000):
    # random exploratory input to excite dynamics
    th, thdot = 0.3, 0.0
    dt = 1e-3
    X, Y = [], []
    for k in range(60000):
        u = float(np.clip(rng.normal(0, 6), -U_MAX, U_MAX))
        thddot = 19.6 * np.sin(th) + 4.0 * u
        X.append([th, thdot, u])
        Y.append(thddot)
        th = th + thdot * dt
        thdot = thdot + thddot * dt
        # keep bounded
        if abs(th) > 1.2:
            th = float(rng.uniform(-0.5, 0.5)); thdot = 0.0
        if len(X) >= n and k > 5000:
            break
    X = np.array(X); Y = np.array(Y)
    # normalize inputs
    mu = X.mean(axis=0); sd = X.std(axis=0)
    Xn = (X - mu) / sd
    ymu = Y.mean(); ysd = Y.std()
    Yn = (Y - ymu) / ysd
    return Xn, Yn, mu, sd, ymu, ysd


def train_small(Xn, Yn, sizes=(3, 12, 1), epochs=4000, lr=0.01):
    d = len(sizes)
    ws = []
    for i in range(d - 1):
        ws.append(rng.normal(0, np.sqrt(2/(sizes[i]+sizes[i+1])), (sizes[i+1], sizes[i])))
        ws.append(np.zeros(sizes[i+1]))
    # adam on flattened
    def flat(ws): return np.concatenate([w.ravel() for w in ws])
    def unflat(p):
        out=[]; idx=0
        for i in range(d-1):
            n1,n0=sizes[i+1],sizes[i]
            out.append(p[idx:idx+n1*n0].reshape(n1,n0)); idx+=n1*n0
            out.append(p[idx:idx+n1].copy()); idx+=n1
        return out
    p = flat(ws)
    m=np.zeros_like(p); v=np.zeros_like(p); b1,b2,eps=0.9,0.999,1e-8
    n=len(Xn)
    Xt=Xn.T  # (3,n)
    for t in range(1,epochs+1):
        wl=unflat(p)
        caches=[Xt]; H=Xt
        for j in range(0,len(wl)-2,2):
            H=np.tanh(wl[j]@H+wl[j+1][:,None]); caches.append(H)
        Pred=(wl[-2]@H+wl[-1][:,None])[0]  # (n,)
        Err=Pred-Yn
        loss=np.mean(Err**2)
        dOut=(2*Err/n)[None,:]
        grads=[None]*len(wl)
        grads[-2]=dOut@caches[-1].T; grads[-1]=dOut.sum(axis=1)
        delta=wl[-2].T@dOut
        for j in range(len(caches)-1,0,-1):
            dZ=delta*(1-caches[j]**2)
            iw=(j-1)*2
            grads[iw]=dZ@caches[j-1].T; grads[iw+1]=dZ.sum(axis=1)
            if j-1>0: delta=wl[iw].T@dZ
        g=flat(grads)
        m=b1*m+(1-b1)*g; v=b2*v+(1-b2)*g*g
        mh=m/(1-b1**t); vh=v/(1-b2**t)
        p=p-lr*mh/(np.sqrt(vh)+eps)
    return unflat(p), float(loss)


def sysid_eval(ws, mu, sd, ymu, ysd):
    # test on true dynamics grid
    def f(th, thdot, u):
        x=(np.array([th,thdot,u])-mu)/sd
        h=x
        for j in range(0,len(ws)-2,2):
            h=np.tanh(ws[j]@h+ws[j+1])
        return float((ws[-2]@h+ws[-1])[0]*ysd+ymu)
    # compare to true on random points
    errs=[]
    for _ in range(2000):
        th=float(rng.uniform(-0.6,0.6)); thdot=float(rng.uniform(-3,3)); u=float(rng.uniform(-15,15))
        true=19.6*np.sin(th)+4.0*u
        pred=f(th,thdot,u)
        errs.append(abs(pred-true))
    errs=np.array(errs)
    return {"max_abs_err": float(errs.max()), "mean_abs_err": float(errs.mean()),
            "rmse": float(np.sqrt(np.mean(errs**2)))}


# ---------- (B) REINFORCE with per-episode logging ----------
E_MEAN, E_STD = -0.001608, 0.045776
EDOT_MEAN, EDOT_STD = 0.051381, 0.239134

def flatten(ws): return np.concatenate([w.ravel() for w in ws])
def unflatten(p, sizes):
    out=[]; idx=0
    for i in range(len(sizes)-1):
        n1,n0=sizes[i+1],sizes[i]
        out.append(p[idx:idx+n1*n0].reshape(n1,n0)); idx+=n1*n0
        out.append(p[idx:idx+n1].copy()); idx+=n1
    return out

def train_reinforce_logged(sizes, episodes=120, lr=0.0008, dt=2e-3, theta0=20*DEG, seed=7):
    r2 = np.random.default_rng(seed)
    ws=[r2.normal(0,0.5*np.sqrt(2/(sizes[i]+sizes[i+1])),(sizes[i+1],sizes[i])) for i in range(len(sizes)-1)]
    ws2=[]
    for i in range(len(sizes)-1):
        ws2.append(ws[i]); ws2.append(np.zeros(sizes[i+1]))
    p=flatten(ws2)
    returns=[]
    T_,dt_=T,dt
    n=int(T_/dt_)
    for ep in range(episodes):
        th=np.zeros(n+1); th[0]=theta0; thdot=0.0
        cache_list=[]; rewards=[]
        std=1.5
        for k in range(n):
            e=-th[k]; edot=-thdot
            wl=unflatten(p,sizes)
            x=np.array([(e-E_MEAN)/E_STD,(edot-EDOT_MEAN)/EDOT_STD])
            h=x; caches=[h]
            for j in range(0,len(wl)-2,2):
                h=np.tanh(wl[j]@h+wl[j+1]); caches.append(h)
            z=wl[-2]@h+wl[-1]; mean=U_MAX*np.tanh(z)[0]
            action=float(np.clip(mean+r2.normal(0,std),-U_MAX,U_MAX))
            cache_list.append((caches,wl,mean,action))
            rewards.append(-(th[k]**2+0.01*action**2)*dt_)
            th[k+1]=th[k]+thdot*dt_
            thdot=thdot+(19.6*np.sin(th[k])+4.0*action)*dt_
        rewards=np.array(rewards); ep_return=float(rewards.sum()); returns.append(ep_return)
        ret=np.cumsum(rewards[::-1])[::-1]; adv=ret-ret.mean()
        grad=np.zeros_like(p)
        for k in range(n):
            caches,wl,mean,action=cache_list[k]
            dlogp=(action-mean)/std**2
            h=caches[-1]; z=wl[-2]@h+wl[-1]
            dmdz=U_MAX*(1-np.tanh(z[0])**2)
            gw=[None]*len(wl)
            gw[-2]=np.outer(np.array([dmdz]),h); gw[-1]=np.array([dmdz])
            delta=wl[-2].T@np.array([dmdz])
            for j in range(len(caches)-1,0,-1):
                dz=delta.ravel()*(1-caches[j]**2); iw=(j-1)*2
                gw[iw]=np.outer(dz,caches[j-1]); gw[iw+1]=dz
                if j-1>0: delta=wl[iw].T@dz[:,None]
            grad+= -dlogp*flatten(gw)*adv[k]
        grad/=n
        p=p+lr*grad
    return returns, unflatten(p,sizes)


if __name__ == "__main__":
    print("=== (A) System identification ===")
    Xn, Yn, mu, sd, ymu, ysd = collect_sysid_data(4000)
    ws_id, loss = train_small(Xn, Yn, sizes=(3,12,1), epochs=4000, lr=0.01)
    ev = sysid_eval(ws_id, mu, sd, ymu, ysd)
    print(f"  train loss(norm)={loss:.2e}")
    print(f"  sysid err: max={ev['max_abs_err']:.3f}, mean={ev['mean_abs_err']:.3f}, rmse={ev['rmse']:.3f} (rad/s^2)")
    # baseline: linear model theta_ddot ~ a*theta + b*u (no sin)
    print("  (true dynamics range: |19.6 sin(th)+4u| up to ~27 rad/s^2)")

    print("\n=== (B) REINFORCE logged (120 eps) ===")
    rets, ws_rl = train_reinforce_logged([2,20,20,1], episodes=120, lr=0.0008, dt=2e-3)
    print(f"  first10 mean={np.mean(rets[:10]):.3f}, last10 mean={np.mean(rets[-10:]):.3f}")
    print(f"  best ep return={max(rets):.3f} at ep {int(np.argmax(rets))+1}")
    # subsample curve for plotting
    curve = rets[::4]
    out = {
        "sysid": {"loss_norm": loss, **ev,
                  "norm": {"mu": mu.tolist(), "sd": sd.tolist(), "ymu": float(ymu), "ysd": float(ysd)},
                  "weights": [w.tolist() for w in ws_id]},
        "reinforce_curve": {"returns_subsampled": [float(x) for x in curve],
                            "first10_mean": float(np.mean(rets[:10])),
                            "last10_mean": float(np.mean(rets[-10:])),
                            "best_return": float(max(rets))},
    }
    json.dump(out, open("scripts/nn_supplement_results.json","w"), indent=1)
    print("\nSaved scripts/nn_supplement_results.json")
