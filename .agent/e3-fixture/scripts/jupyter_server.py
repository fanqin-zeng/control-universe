#!/usr/bin/env python3
"""
E3 负向测试数据 —— **故意写坏**的 jupyter_server.py 副本。

这不是服务代码，永远不会被启动（真服务是仓库根的 scripts/jupyter_server.py）。
它存在的唯一目的：证明 nb-cells.mjs 的 S8 会核对**服务端**那道防线，
而不是只看前端组件。

相对真服务，这里删掉了「同一个 notebook_id 被重复注册时打 WARNING 并关停旧内核」的兜底：
重复 id 会被静默覆盖，于是 fix-011 的撞车在前端后端都无人报警。
S8 靠「服务端源码里必须出现那句重复注册的英文 WARNING 原文」来核对这道防线，
所以本文件**故意不写那句话**，S8 应当因此报 WARN。
（写这行注释时踩过坑：第一版在这里把那句原文照抄了一遍做说明，结果正则命中、WARN 不报，
测试数据自己把自己治好了。判据依赖字面形状时，连注释都能让它假绿——E2 新发现 ②。）

**不要修它**——修好就等于删掉测试。
"""

import json
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

KERNELS = {}
DEFAULT_SETUP = "import numpy as np\nimport matplotlib\nmatplotlib.use('Agg')\n"
PORT = 8899  # 故意与真服务的 8891 不同，免得误连


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            self._send(200, {"status": "ok", "kernels": len(KERNELS)})
        else:
            self._send(404, {"error": "not found"})

    def do_POST(self):
        length = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(length) or b"{}")
        if self.path == "/api/notebook":
            nid = body.get("notebook_id") or str(uuid.uuid4())
            # 病因：重复 id 直接覆盖，既不 WARNING 也不关停旧内核。
            # 真服务在这里会先判断 nid in KERNELS，命中就打重复注册的 WARNING 并回收旧内核。
            KERNELS[nid] = {"setup": body.get("setup_code", DEFAULT_SETUP), "id": nid}
            self._send(200, {"notebook_id": nid})
        else:
            self._send(404, {"error": "not found"})

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
