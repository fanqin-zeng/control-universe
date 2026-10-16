#!/usr/bin/env node
/**
 * mock-kernel.mjs —— E3 负向测试用的假 Jupyter 内核，专门打 nb-cells.mjs 的「404 复活」分支
 *
 * 为什么需要它：scripts/jupyter_server.py 只在空闲 1800 秒后才回收内核，
 * 靠等是等不出来的，靠改真服务又会污染现网。runNotebook 里那段
 * 「收到 404 → 换新 id 重建 → 重放前面所有 cell → 重试当前 cell」的逻辑
 * 因此从来没被真跑过。A7 的教训是「只对着干净的当前仓库跑等于没测」——
 * 没被跑过的分支就等于没写。
 *
 * 用法（三步，端口自便，别撞真内核的 8891）：
 *   node .qoder/e3-fixture/mock-kernel.mjs --port 8999 &
 *   node scripts/nb-cells.mjs verify content/fx/nb-kernel.mdx --root .qoder/e3-fixture --port 8999
 *   curl -s http://127.0.0.1:8999/__log      # 读请求流水，核对重放确实发生
 *
 * 行为：第 1 个内核的第 3 次 execute 返回 404（模拟空闲回收），之后一切正常。
 * 对 4 个 cell 的 nb-kernel.mdx，正确的复活实现应当产生：
 *   creates == 2、executes == 7（cell0, cell1, cell2→404, 重放 cell0, 重放 cell1, 重试 cell2, cell3）
 * 少了就说明没重放（新命名空间里缺前面 cell 定义的变量），多了就说明重复重试。
 *
 * /__log 返回 JSON 流水；/__reset 清零。GET /health 与真服务同形，好让 kernelAlive() 认。
 */
import { createServer } from "node:http";

const argv = process.argv.slice(2);
const optVal = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const PORT = Number(optVal("--port") || 8999);
const FAIL_AT_EXECUTE = Number(optVal("--fail-at") || 3);   // 第 1 个内核的第几次 execute 返 404

const log = [];
let creates = 0;
let firstKernelExecutes = 0;
let firstKernelId = null;

function send(res, code, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(code, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

const server = createServer((req, res) => {
  let raw = "";
  req.on("data", (d) => { raw += d; });
  req.on("end", () => {
    const body = raw ? JSON.parse(raw) : {};
    if (req.method === "GET" && req.url === "/health") {
      return send(res, 200, { status: "ok", kernels: creates, idle_timeout: 1800, idle_seconds: 0 });
    }
    if (req.method === "GET" && req.url === "/__log") {
      return send(res, 200, { creates, executes: log.filter((l) => l.kind === "execute").length, log });
    }
    if (req.method === "GET" && req.url === "/__reset") {
      log.length = 0; creates = 0; firstKernelExecutes = 0; firstKernelId = null;
      return send(res, 200, { reset: true });
    }
    if (req.method === "POST" && req.url === "/api/notebook") {
      creates++;
      if (firstKernelId === null) firstKernelId = body.notebook_id;
      log.push({ kind: "create", id: body.notebook_id, setupLen: (body.setup_code || "").length });
      return send(res, 200, { notebook_id: body.notebook_id });
    }
    const m = /^\/api\/notebook\/([^/]+)\/execute$/.exec(req.url || "");
    if (req.method === "POST" && m) {
      const id = decodeURIComponent(m[1]);
      const isFirst = id === firstKernelId;
      if (isFirst) firstKernelExecutes++;
      log.push({ kind: "execute", id, isFirst, n: isFirst ? firstKernelExecutes : null, codeLen: (body.code || "").length });
      // 只在「第 1 个内核」的第 FAIL_AT_EXECUTE 次 execute 上返 404；复活后的新内核一切正常
      if (isFirst && firstKernelExecutes === FAIL_AT_EXECUTE) {
        return send(res, 404, { error: "mock: notebook_id 已被空闲回收" });
      }
      return send(res, 200, { outputs: [{ type: "stream", name: "stdout", text: "mock ok\n" }] });
    }
    if (req.method === "DELETE") {
      log.push({ kind: "delete", url: req.url });
      return send(res, 200, { deleted: true });
    }
    return send(res, 404, { error: "mock: 未实现 " + req.method + " " + req.url });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`mock-kernel 已监听 127.0.0.1:${PORT} · 第 1 个内核的第 ${FAIL_AT_EXECUTE} 次 execute 返回 404`);
  console.log("读流水：curl -s http://127.0.0.1:" + PORT + "/__log");
});
