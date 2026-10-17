#!/usr/bin/env python3
"""Lightweight Jupyter kernel HTTP server for Control Universe Wiki.

Manages Jupyter kernels and executes Python code, returning text/image/error outputs.
Requires: pip install jupyter_client ipykernel matplotlib numpy scipy
"""

import json
import os
import sys
import threading
import time
import uuid
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler

try:
    from jupyter_client.manager import KernelManager
except ImportError:
    print("[jupyter-server] ERROR: jupyter_client not installed.")
    print("[jupyter-server] Run: pip install jupyter_client ipykernel matplotlib numpy scipy")
    sys.exit(1)

PORT = int(os.environ.get("JUPYTER_PORT", "8891"))
# A page reload is a hard navigation: React cleanup never runs, so the browser
# cannot DELETE its kernels. Without reaping, every reload leaks a kernel per
# notebook. Set to 0 to disable.
IDLE_TIMEOUT = float(os.environ.get("JUPYTER_IDLE_TIMEOUT", "1800"))
REAP_INTERVAL = float(os.environ.get("JUPYTER_REAP_INTERVAL", "60"))

kernels = {}
last_used = {}
busy = set()
lock = threading.Lock()

DEFAULT_SETUP = """\
import matplotlib
matplotlib.use('module://matplotlib_inline.backend_inline')
import numpy as np
import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False
"""


def new_kernel():
    km = KernelManager()
    km.start_kernel(stderr=open(os.devnull, "w"))
    kc = km.client()
    kc.start_channels()
    try:
        kc.wait_for_ready(timeout=30)
    except RuntimeError:
        kc.stop_channels()
        km.shutdown_kernel(now=True)
        raise
    return km, kc


def shutdown_kernel(notebook_id):
    with lock:
        entry = kernels.pop(notebook_id, None)
        last_used.pop(notebook_id, None)
        busy.discard(notebook_id)
    if entry is None:
        return
    km, kc = entry
    try:
        kc.stop_channels()
        km.shutdown_kernel(now=True)
    except Exception:
        pass


def reap_idle_kernels():
    while True:
        time.sleep(REAP_INTERVAL)
        now = time.monotonic()
        with lock:
            stale = [nid for nid, t in last_used.items()
                     if nid not in busy and now - t > IDLE_TIMEOUT]
        for nid in stale:
            shutdown_kernel(nid)
            # stdout is block-buffered when serve.mjs pipes it into logs/dev.log
            print(f"[jupyter-server] Recycled idle kernel {nid} "
                  f"(idle > {IDLE_TIMEOUT:.0f}s), {len(kernels)} left", flush=True)


def start_reaper():
    t = threading.Thread(target=reap_idle_kernels, daemon=True)
    t.start()


def execute(km, kc, code, timeout=30):
    msg_id = kc.execute(code)
    outputs = []

    while True:
        try:
            msg = kc.get_iopub_msg(timeout=timeout)
        except Exception:
            outputs.append({"type": "error", "ename": "Timeout",
                            "evalue": f"Execution timed out after {timeout}s", "traceback": []})
            break

        if msg["parent_header"].get("msg_id") != msg_id:
            continue

        mtype = msg["header"]["msg_type"]

        if mtype == "status" and msg["content"]["execution_state"] == "idle":
            break
        elif mtype == "stream":
            outputs.append({"type": "stream", "name": msg["content"]["name"],
                            "text": msg["content"]["text"]})
        elif mtype in ("display_data", "execute_result"):
            _collect_data(msg["content"]["data"], outputs)
        elif mtype == "error":
            outputs.append({"type": "error", "ename": msg["content"]["ename"],
                            "evalue": msg["content"]["evalue"],
                            "traceback": _strip_ansi(msg["content"]["traceback"])})

    return outputs


def _collect_data(data, outputs):
    if "image/png" in data:
        outputs.append({"type": "image", "mime": "image/png",
                        "data": data["image/png"]})
    elif "image/svg+xml" in data:
        outputs.append({"type": "image", "mime": "image/svg+xml",
                        "data": data["image/svg+xml"]})
    elif "text/html" in data:
        outputs.append({"type": "html", "data": data["text/html"]})
    elif "text/plain" in data:
        outputs.append({"type": "text", "text": data["text/plain"]})


def _strip_ansi(lines):
    import re
    pat = re.compile(r"\x1b\[[0-9;]*m")
    return [pat.sub("", l) for l in lines]


class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._cors()
        self.end_headers()
        self.wfile.write(body)

    def _read(self):
        n = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(n)) if n else {}

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            now = time.monotonic()
            with lock:
                ages = {nid: round(now - t) for nid, t in last_used.items()}
            self._json(200, {"status": "ok", "kernels": len(kernels),
                             "idle_timeout": IDLE_TIMEOUT, "idle_seconds": ages})
        else:
            self._json(404, {"error": "not found"})

    def do_POST(self):
        try:
            p = self.path.rstrip("/")
            if p == "/api/notebook":
                self._handle_create()
            elif p.startswith("/api/notebook/") and p.endswith("/execute"):
                nid = p.split("/")[3]
                self._handle_execute(nid)
            else:
                self._json(404, {"error": "not found"})
        except Exception as e:
            traceback.print_exc()
            self._json(500, {"error": str(e)})

    def do_DELETE(self):
        try:
            if self.path.startswith("/api/notebook/"):
                nid = self.path.rstrip("/").split("/")[3]
                shutdown_kernel(nid)
                self._json(200, {"status": "ok"})
            else:
                self._json(404, {"error": "not found"})
        except Exception as e:
            self._json(500, {"error": str(e)})

    def _handle_create(self):
        body = self._read()
        nid = body.get("notebook_id", str(uuid.uuid4()))
        setup = body.get("setup_code", DEFAULT_SETUP)

        with lock:
            reused = nid in kernels
        if reused:
            print(f"[jupyter-server] WARNING: notebook_id {nid} already registered; "
                  f"shutting the old kernel down so two notebooks never share a namespace",
                  flush=True)
            shutdown_kernel(nid)

        try:
            km, kc = new_kernel()
            with lock:
                kernels[nid] = (km, kc)
                last_used[nid] = time.monotonic()
            if setup.strip():
                outputs = execute(km, kc, setup)
                error = next((o for o in outputs if o.get("type") == "error"), None)
                if error is not None:
                    shutdown_kernel(nid)
                    self._json(422, {
                        "error": f"Setup failed: {error['ename']}: {error['evalue']}",
                        "outputs": outputs,
                    })
                    return
            self._json(200, {"notebook_id": nid, "status": "ready"})
        except Exception as e:
            traceback.print_exc()
            shutdown_kernel(nid)
            self._json(500, {"error": f"Kernel start failed: {e}"})

    def _handle_execute(self, nid):
        body = self._read()
        code = body.get("code", "")

        with lock:
            entry = kernels.get(nid)
            if entry is not None:
                busy.add(nid)
                last_used[nid] = time.monotonic()
        if entry is None:
            self._json(404, {"error": "notebook not found"})
            return

        km, kc = entry
        try:
            outputs = execute(km, kc, code)
        finally:
            with lock:
                busy.discard(nid)
                if nid in last_used:
                    last_used[nid] = time.monotonic()
        self._json(200, {"outputs": outputs})

    def log_message(self, fmt, *args):
        print(f"[jupyter-server] {fmt % args}")


def main():
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"[jupyter-server] Listening on http://127.0.0.1:{PORT}")
    if IDLE_TIMEOUT > 0:
        start_reaper()
        print(f"[jupyter-server] Recycling kernels idle > {IDLE_TIMEOUT:.0f}s "
              f"(check every {REAP_INTERVAL:.0f}s)")
    else:
        print("[jupyter-server] Idle recycling disabled (JUPYTER_IDLE_TIMEOUT=0)")
    print("[jupyter-server] Press Ctrl+C to stop")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[jupyter-server] Shutting down kernels...")
        with lock:
            ids = list(kernels)
        for nid in ids:
            shutdown_kernel(nid)
        server.server_close()


if __name__ == "__main__":
    main()
