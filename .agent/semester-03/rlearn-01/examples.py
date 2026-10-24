"""Deterministic teaching audit; no hardware, downloads, training, or third-party packages."""
import json
import math

def alignment():
    frames = [
        {"capture": 0, "arrival": 10},
        {"capture": 40, "arrival": 90},
        {"capture": 80, "arrival": 85},
        {"capture": 120, "arrival": 125},
    ]
    decisions = [50, 100, 150, 200]
    selected = []
    for decision in decisions:
        candidates = [f for f in frames if f["arrival"] <= decision and 0 <= decision-f["capture"] <= 60]
        selected.append(max(candidates, key=lambda f: f["capture"])["capture"] if candidates else None)
    assert selected == [0, 80, 120, None]
    return {"decision_ms": decisions, "selected_capture_ms": selected,
            "age_ms": [d-c if c is not None else None for d,c in zip(decisions,selected)],
            "accepted": sum(c is not None for c in selected),
            "dt_50ms_m": 0.1*0.05, "dt_100ms_m": 0.1*0.1,
            "causal_at_50": [f["capture"] for f in frames if f["arrival"]<=50]}

def splitting():
    cases = [("none", {"A","B"}, {"C","D"}), ("partial", {"A","B"}, {"B","C"}),
             ("all", {"A","B"}, {"A","B"})]
    overlap = {name: len(tr & te)/len(te) for name,tr,te in cases}
    # Four episodes with six ordered frames each. Odd/even frame splitting leaks every episode.
    train = [(ep,k) for ep in "ABCD" for k in range(6) if k%2==0]
    test = [(ep,k) for ep in "ABCD" for k in range(6) if k%2==1]
    assert {e for e,k in train} == {e for e,k in test}
    frames = [(ep,k) for ep in "ABCD" for k in range(6)]
    windows = [frames[i:i+3] for i in range(len(frames)-2)]
    invalid = sum(len({e for e,k in w})>1 for w in windows)
    return {"cases":overlap,"train_frames":len(train),"test_frames":len(test),
            "frame_split_overlap":1.0,"global_windows":len(windows),"cross_episode_windows":invalid,
            "episode_windows":sum(6-3+1 for _ in "ABCD")}

def normalization():
    train = [0.0,2.0,4.0,6.0]
    test = [10.0,12.0]
    mean = sum(train)/len(train)
    scale = math.sqrt(sum((x-mean)**2 for x in train)/len(train))
    mixed = sum(train+test)/len(train+test)
    assert math.isclose(mean,3.0) and math.isclose(scale,math.sqrt(5))
    return {"train_mean":mean,"train_scale":scale,"test_z":[(x-mean)/scale for x in test],
            "leaked_mean":mixed,"constant_scale_fallback":1.0,
            "success_only_rate":2/2,"all_attempts_rate":2/4}

if __name__ == '__main__':
    print(json.dumps({"alignment":alignment(),"splitting":splitting(),"normalization":normalization()},indent=2))
