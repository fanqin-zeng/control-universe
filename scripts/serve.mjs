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
  process.exit(code ?? 0);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}
