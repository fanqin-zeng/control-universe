import {withBasePath} from './deployment';

export interface PythonOutput {type: 'text' | 'image' | 'error' | 'stream'; text?: string; data?: string; mime?: string; ename?: string; evalue?: string; traceback?: string[]; name?: string}
let worker: Worker | null = null;
let activeVersion = '';
let sequence = 0;
const pending = new Map<number, {resolve: (outputs: PythonOutput[]) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout>}>();

export function releaseBrowserPython(namespace: string) {
  if (worker) void browserPython(namespace, '', '', 'reset').catch(() => {});
}

export function stopBrowserPython() {
  worker?.terminate(); worker = null; activeVersion = '';
  for (const request of Array.from(pending.values())) {clearTimeout(request.timer); request.reject(new Error('浏览器 Python 已停止；再次运行会重新初始化，之前变量已清空。'));}
  pending.clear();
}

export function browserPython(namespace: string, setup: string, code: string, action = 'execute', version = ''): Promise<PythonOutput[]> {
  if (worker && version && version !== activeVersion) stopBrowserPython();
  if (!worker) {
    worker = new Worker(withBasePath('/python-worker.js') + (version ? '?v=' + encodeURIComponent(version) : ''));
    activeVersion = version;
    worker.onmessage = ({data}) => {
      const request = pending.get(data.id); if (!request) return;
      clearTimeout(request.timer); pending.delete(data.id);
      if (data.error) request.reject(new Error(data.error)); else request.resolve(data.outputs);
    };
    const created = worker;
    worker.onerror = () => {if (worker === created) stopBrowserPython();};
  }
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => stopBrowserPython(), 180000);
    pending.set(id, {resolve, reject, timer});
    worker!.postMessage({id, namespace, setup, code, action});
  });
}
