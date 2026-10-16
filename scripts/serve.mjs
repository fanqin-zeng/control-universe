import { spawn } from "node:child_process";
import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const mode = process.argv[2] === "prod" ? "prod" : "dev";
const args =
  mode === "prod"
    ? ["start", "-H", "127.0.0.1", "-p", "8080"]
    : ["dev", "-H", "127.0.0.1", "-p", "8080"];

mkdirSync("logs", { recursive: true });
const logFile = path.join("logs", `${mode}.log`);

function write(line) {
  try {
    appendFileSync(logFile, `${new Date().toISOString()} ${line}\n`, "utf8");
  } catch {
    // 日志失败不能拖垮服务
  }
}

function pipe(stream, toStderr) {
  stream.setEncoding("utf8");
  let buf = "";
  stream.on("data", (chunk) => {
    process[toStderr ? "stderr" : "stdout"].write(chunk);
    buf += chunk;
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) if (line.trim()) write(line);
  });
}

// --- Jupyter kernel server ---
let pyProc = null;
let pyRestartTimer = null;

function startJupyter() {
  try {
    pyProc = spawn("python", ["scripts/jupyter_server.py"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    pipe(pyProc.stdout, false);
    pipe(pyProc.stderr, true);
    pyProc.on("error", (err) => {
      write(`[serve] Jupyter server not started: ${err.message}`);
      console.log(`[serve] Jupyter server unavailable (${err.message}). Python code execution disabled.`);
      pyProc = null;
    });
    pyProc.on("exit", (code) => {
      write(`[serve] jupyter server exited (code=${code})`);
      pyProc = null;
      // Auto-restart after 3 seconds
      if (!pyRestartTimer) {
        pyRestartTimer = setTimeout(() => {
          pyRestartTimer = null;
          write("[serve] restarting jupyter server...");
          startJupyter();
        }, 3000);
      }
    });
    write("[serve] jupyter server started on port 8891");
  } catch {
    console.log("[serve] Jupyter server unavailable. Python code execution disabled.");
  }
}

startJupyter();

// --- Next.js ---
console.log(`[serve] mode=${mode} log=${logFile}`);
const child = spawn(
  process.execPath,
  [path.join("node_modules", "next", "dist", "bin", "next"), ...args],
  { stdio: ["inherit", "pipe", "pipe"] }
);

pipe(child.stdout, false);
pipe(child.stderr, true);

child.on("exit", (code, signal) => {
  write(`[serve] next ${mode} exited (code=${code} signal=${signal})`);
  if (pyRestartTimer) clearTimeout(pyRestartTimer);
  if (pyProc) pyProc.kill();
  process.exit(code ?? 0);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    if (pyRestartTimer) clearTimeout(pyRestartTimer);
    child.kill(sig);
    if (pyProc) pyProc.kill(sig);
  });
}
