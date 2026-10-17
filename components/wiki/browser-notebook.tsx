'use client';
import {useEffect, useRef, useState} from 'react';
import {browserPython, releaseBrowserPython, stopBrowserPython, type PythonOutput} from '@/lib/browser-python';

export function BrowserNotebook({title, setupCode = '', cells: initial}: {title?: string; setupCode?: string; cells: {code: string}[]}) {
  const [cells, setCells] = useState(() => initial.map(c => ({...c, outputs: [] as PythonOutput[]})));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('首次运行需下载 Python 和科学计算库，计算使用本机浏览器。');
  const key = useRef('');
  const mounted = useRef(true);
  useEffect(() => {key.current = crypto.randomUUID(); mounted.current = true; return () => {mounted.current = false; releaseBrowserPython(key.current);};}, []);
  async function run(indices: number[]) {
    if (busy) return;
    setBusy(true); setMessage('正在运行（首次加载可能较慢，可点击停止）…');
    try {
      for (const index of indices) {
        const outputs = await browserPython(key.current, setupCode, cells[index].code);
        if (!mounted.current) return;
        setCells(previous => previous.map((cell, i) => i === index ? {...cell, outputs} : cell));
        if (outputs.some(output => output.type === 'error')) {setMessage('运行出错，请查看单元格输出。'); return;}
      }
      setMessage('运行完成 · Pyodide 0.27.7 · 浏览器本地计算');
    } catch (error) {if (mounted.current) setMessage(String(error));}
    finally {if (mounted.current) setBusy(false);}
  }
  async function reset() {
    setBusy(true);
    try {await browserPython(key.current, '', '', 'reset'); setCells(initial.map(c => ({...c, outputs: []}))); setMessage('已重置本实验，变量和输出已清空。');}
    catch (error) {setMessage(String(error));} finally {setBusy(false);}
  }
  return <section aria-label={title || '浏览器 Python'} className="not-prose" style={{border: '1px solid #94a3b8', borderRadius: 8, padding: 14, margin: '16px 0'}}>
    <strong>{title || 'Python Notebook'}</strong>
    <p role="status">{message}</p>
    <p>本次试验支持数学两课；刷新页面会清空变量。停止会结束本页所有 Python 实验并清空变量。</p>
    <button disabled={busy} onClick={() => run(cells.map((_, i) => i))}>全部运行</button>{' '}
    <button disabled={busy} onClick={reset}>重置实验</button>{' '}
    <button disabled={!busy} onClick={stopBrowserPython}>停止本页 Python</button>
    {setupCode && <details><summary>初始化代码</summary><pre style={{overflowX: 'auto'}}>{setupCode}</pre></details>}
    {cells.map((cell, index) => <div key={index} style={{borderTop: '1px solid #cbd5e1', marginTop: 12, paddingTop: 12}}>
      <label>代码 {index + 1}<textarea aria-label={`代码 ${index + 1}`} value={cell.code} disabled={busy} spellCheck={false} onChange={event => setCells(previous => previous.map((c, i) => i === index ? {...c, code: event.target.value} : c))} style={{display: 'block', width: '100%', minHeight: 120, boxSizing: 'border-box', fontFamily: 'monospace', color: '#111827', background: '#f8fafc'}} /></label>
      <button disabled={busy} onClick={() => run([index])}>运行代码 {index + 1}</button>
      <div aria-label={`输出 ${index + 1}`}>{cell.outputs.map((output, i) => output.type === 'image' ? <img key={i} src={`data:image/png;base64,${output.data}`} alt="Python 绘图输出" style={{maxWidth: '100%'}} /> : <pre key={i} style={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: output.type === 'error' ? '#b91c1c' : undefined}}>{output.type === 'error' ? `${output.ename}: ${output.evalue}\n${output.traceback?.join('\n')}` : output.text}</pre>)}</div>
    </div>)}
  </section>;
}
