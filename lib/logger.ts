type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isServer = typeof process !== "undefined" && process.versions?.node;

let _level = LEVELS.info;
if (isServer) {
  const envLevel = process.env.LOG_LEVEL as LogLevel | undefined;
  if (envLevel && envLevel in LEVELS) _level = LEVELS[envLevel];
}

let _fsPromise: Promise<typeof import("node:fs")> | null = null;
let _pathPromise: Promise<typeof import("node:path")> | null = null;

const dynamicImport = new Function("s", "return import(s)") as (
  s: string,
) => Promise<unknown>;

function loadFs() {
  if (!_fsPromise) {
    _fsPromise = dynamicImport("node:fs") as Promise<typeof import("node:fs")>;
  }
  return _fsPromise;
}

function loadPath() {
  if (!_pathPromise) {
    _pathPromise = dynamicImport("node:path") as Promise<
      typeof import("node:path")
    >;
  }
  return _pathPromise;
}

const LOG_DIR = "logs";
const LOG_FILE = "app.log";
const MAX_SIZE = 10 * 1024 * 1024;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatLine(
  level: LogLevel,
  msg: string,
  meta?: Record<string, unknown>,
) {
  const tag = `[${level.toUpperCase().padEnd(5)}]`;
  let line = `${timestamp()} ${tag} ${msg}`;
  if (meta && Object.keys(meta).length > 0) {
    const parts = Object.entries(meta).map(([k, v]) => {
      if (v instanceof Error) return `${k}="${v.message}"`;
      if (typeof v === "string" && v.includes(" ")) return `${k}="${v}"`;
      return `${k}=${v}`;
    });
    line += " " + parts.join(" ");
  }
  return line;
}

function writeFileSync(line: string) {
  if (!isServer) return;
  Promise.all([loadFs(), loadPath()])
    .then(([fs, path]) => {
      const dir = path.resolve(process.cwd(), LOG_DIR);
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, LOG_FILE);

      try {
        const stat = fs.statSync(file);
        if (stat.size > MAX_SIZE) {
          fs.renameSync(file, file + ".1");
        }
      } catch {
        /* file doesn't exist yet */
      }

      fs.appendFileSync(file, line + "\n");
    })
    .catch(() => {
      /* silently drop — logging must never crash the app */
    });
}

function consoleLog(
  level: LogLevel,
  msg: string,
  meta?: Record<string, unknown>,
) {
  if (isServer) {
    const tag = `[${level.toUpperCase()}]`;
    const args: unknown[] = [`${tag} ${msg}`, ...(meta ? [meta] : [])];
    if (level === "error") console.error(...args);
    else if (level === "warn") console.warn(...args);
    else if (level === "debug") console.debug(...args);
    else console.log(...args);
  } else {
    const style =
      level === "error"
        ? "color:#ef4444;font-weight:bold"
        : level === "warn"
          ? "color:#f59e0b;font-weight:bold"
          : level === "debug"
            ? "color:#6b7280"
            : "color:#3b82f6;font-weight:bold";
    const tag = `[${level.toUpperCase()}]`;
    const args: unknown[] = [`%c${tag} ${msg}`, style];
    if (meta) args.push(meta);
    if (level === "error") console.error(...args);
    else if (level === "warn") console.warn(...args);
    else if (level === "debug") console.debug(...args);
    else console.log(...args);
  }
}

function log(
  level: LogLevel,
  msg: string,
  meta?: Record<string, unknown>,
) {
  if (LEVELS[level] < _level) return;
  consoleLog(level, msg, meta);
  writeFileSync(formatLine(level, msg, meta));
}

export const logger = {
  debug(msg: string, meta?: Record<string, unknown>) {
    log("debug", msg, meta);
  },
  info(msg: string, meta?: Record<string, unknown>) {
    log("info", msg, meta);
  },
  warn(msg: string, meta?: Record<string, unknown>) {
    log("warn", msg, meta);
  },
  error(msg: string, meta?: Record<string, unknown>) {
    log("error", msg, meta);
  },
};
