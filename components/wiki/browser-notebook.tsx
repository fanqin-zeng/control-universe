'use client';
import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {browserPython, releaseBrowserPython, stopBrowserPython, type PythonOutput} from '@/lib/browser-python';

const buttonStyle: CSSProperties = {border: '1px solid #94a3b8', borderRadius: 4, padding: '5px 10px', background: '#f1f5f9', color: '#111827', cursor: 'pointer', margin: '3px 0'};
export function BrowserNotebook({title, setupCode = '', cells: initial, workerVersion = ''}: {title?: string; setupCode?: string; cells: {code: string}[]; workerVersion?: string}) {
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
        const outputs = await browserPython(key.current, setupCode, cells[index].code, 'execute', workerVersion);
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
    try {await browserPython(key.current, '', '', 'reset', workerVersion); setCells(initial.map(c => ({...c, outputs: []}))); setMessage('已重置本实验，变量和输出已清空。');}
    catch (error) {setMessage(String(error));} finally {setBusy(false);}
  }
  return <section data-python-mode="browser" aria-label={title || '浏览器 Python'} className="not-prose" style={{border: '1px solid #94a3b8', borderRadius: 8, padding: 14, margin: '16px 0', color:'#111827', background:'#fff'}}>
    <strong style={{color:'#111827'}}>{title || 'Python Notebook'}</strong>
    <p role="status" style={{color:'#334155'}}>{message}</p>
    <p style={{color:'#334155'}}>本实验默认代码已通过浏览器验收；自行修改后可能需要额外依赖。刷新页面会清空变量，停止会结束本页所有 Python 实验。</p>
    <button style={{...buttonStyle, opacity: busy ? 0.5 : 1}} disabled={busy} onClick={() => run(cells.map((_, i) => i))}>全部运行</button>{' '}
    <button style={{...buttonStyle, opacity: busy ? 0.5 : 1}} disabled={busy} onClick={reset}>重置实验</button>{' '}
    <button style={{...buttonStyle, opacity: busy ? 1 : 0.5}} disabled={!busy} onClick={stopBrowserPython}>停止本页 Python</button>
    {setupCode && <details><summary style={{color:'#334155'}}>初始化代码</summary><pre style={{overflowX: 'auto',color:'#111827'}}>{setupCode}</pre></details>}
    {cells.map((cell, index) => <div key={index} style={{borderTop: '1px solid #cbd5e1', marginTop: 12, paddingTop: 12}}>
      <label style={{color:'#334155'}}>代码 {index + 1}<textarea aria-label={`代码 ${index + 1}`} value={cell.code} disabled={busy} spellCheck={false} onChange={event => setCells(previous => previous.map((c, i) => i === index ? {...c, code: event.target.value} : c))} style={{display: 'block', width: '100%', minHeight: 120, boxSizing: 'border-box', fontFamily: 'monospace', color: '#111827', background: '#f8fafc'}} /></label>
      <button style={{...buttonStyle, opacity: busy ? 0.5 : 1}} disabled={busy} onClick={() => run([index])}>运行代码 {index + 1}</button>
      <div aria-label={`输出 ${index + 1}`}>{cell.outputs.map((output, i) => output.type === 'image' ? <img key={i} src={`data:image/png;base64,${output.data}`} alt="Python 绘图输出" style={{maxWidth: '100%'}} /> : <pre key={i} style={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: output.type === 'error' ? '#b91c1c' : '#111827'}}>{output.type === 'error' ? `${output.ename}: ${output.evalue}\n${output.traceback?.join('\n')}` : output.text}</pre>)}</div>
    </div>)}
  </section>;
}
