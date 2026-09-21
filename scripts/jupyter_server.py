#!/usr/bin/env python3
"""Lightweight Jupyter kernel HTTP server for Control Universe Wiki.

Manages Jupyter kernels and executes Python code, returning text/image/error outputs.
Requires: pip install jupyter_client ipykernel matplotlib numpy scipy
"""

import json
import os
import sys
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
kernels = {}

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
    if notebook_id in kernels:
        km, kc = kernels.pop(notebook_id)
        try:
            kc.stop_channels()
            km.shutdown_kernel(now=True)
        except Exception:
            pass


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
            self._json(200, {"status": "ok", "kernels": len(kernels)})
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

        try:
            km, kc = new_kernel()
            kernels[nid] = (km, kc)
            if setup.strip():
                execute(km, kc, setup)
            self._json(200, {"notebook_id": nid, "status": "ready"})
        except Exception as e:
            traceback.print_exc()
            self._json(500, {"error": f"Kernel start failed: {e}"})

    def _handle_execute(self, nid):
        if nid not in kernels:
            self._json(404, {"error": "notebook not found"})
            return
        body = self._read()
        code = body.get("code", "")
        km, kc = kernels[nid]
        outputs = execute(km, kc, code)
        self._json(200, {"outputs": outputs})

    def log_message(self, fmt, *args):
        print(f"[jupyter-server] {fmt % args}")


def main():
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"[jupyter-server] Listening on http://127.0.0.1:{PORT}")
    print("[jupyter-server] Press Ctrl+C to stop")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[jupyter-server] Shutting down kernels...")
        for nid in list(kernels):
            shutdown_kernel(nid)
        server.server_close()


if __name__ == "__main__":
    main()
