"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface NotebookOutput {
  type: "text" | "image" | "error" | "stream" | "html";
  text?: string;
  data?: string;
  mime?: string;
  name?: string;
  ename?: string;
  evalue?: string;
  traceback?: string[];
}

interface CellState {
  id: string;
  code: string;
  outputs: NotebookOutput[];
  running: boolean;
}

const API = "http://127.0.0.1:8891";

// Module-level so notebooks mounting in the same millisecond never share a kernel id.
let nbSeq = 0;
function newNotebookId() {
  return `nb-${Date.now()}-${nbSeq++}`;
}

async function createNotebook(id: string, setup: string) {
  const res = await fetch(`${API}/api/notebook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notebook_id: id, setup_code: setup }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to create notebook");
  }
  return res.json();
}

// The server recycles kernels that have been idle too long, so a 404 means
// "your namespace is gone" rather than "execution failed" — the caller can recover.
class KernelGoneError extends Error {}

async function execCode(notebookId: string, code: string) {
  const res = await fetch(`${API}/api/notebook/${notebookId}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (res.status === 404) throw new KernelGoneError("kernel recycled");
  if (!res.ok) throw new Error("Execution failed");
  return res.json() as Promise<{ outputs: NotebookOutput[] }>;
}

async function deleteNotebook(notebookId: string) {
  await fetch(`${API}/api/notebook/${notebookId}`, { method: "DELETE" }).catch(
    () => {}
  );
}

interface JupyterNotebookProps {
  cells: { code: string }[];
  setupCode?: string;
  title?: string;
}

export function JupyterNotebook({
  cells: initCells,
  setupCode = "",
  title,
}: JupyterNotebookProps) {
  const [cells, setCells] = useState<CellState[]>(() =>
    initCells.map((c, i) => ({
      id: `cell-${i}`,
      code: c.code,
      outputs: [],
      running: false,
    }))
  );
  const [notebookId, setNotebookId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Source of truth for requests: kernel recovery swaps the id while a run is
  // in flight, and a state value captured by that run would be stale.
  const idRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = newNotebookId();

    createNotebook(id, setupCode)
      .then(() => {
        if (!cancelled) {
          idRef.current = id;
          setNotebookId(id);
          setReady(true);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
      deleteNotebook(id);
    };
  }, []);

  const updateCell = useCallback(
    (cellId: string, patch: Partial<CellState>) =>
      setCells((prev) =>
        prev.map((c) => (c.id === cellId ? { ...c, ...patch } : c))
      ),
    []
  );

  const reviveKernel = useCallback(async () => {
    const stale = idRef.current;
    idRef.current = null;
    if (stale) await deleteNotebook(stale);
    const id = newNotebookId();
    await createNotebook(id, setupCode);
    idRef.current = id;
    setNotebookId(id);
    setReady(true);
    return id;
  }, [setupCode]);

  const execCell = useCallback(
    async (id: string, cell: CellState) => {
      updateCell(cell.id, { running: true, outputs: [] });
      try {
        const { outputs } = await execCode(id, cell.code);
        updateCell(cell.id, { outputs, running: false });
      } catch (e: unknown) {
        if (e instanceof KernelGoneError) {
          updateCell(cell.id, { running: false });
          throw e;
        }
        updateCell(cell.id, {
          outputs: [
            {
              type: "error",
              ename: "Error",
              evalue: e instanceof Error ? e.message : String(e),
              traceback: [],
            },
          ],
          running: false,
        });
      }
    },
    [updateCell]
  );

  const runCell = useCallback(
    async (cellId: string) => {
      const id = idRef.current;
      if (!id || !ready) return;
      const idx = cells.findIndex((c) => c.id === cellId);
      if (idx < 0 || !cells[idx].code.trim()) return;

      try {
        await execCell(id, cells[idx]);
      } catch {
        // The server recycled this kernel while the page sat idle. A fresh
        // namespace has none of the earlier cells' variables, so replay them.
        let fresh: string;
        try {
          fresh = await reviveKernel();
        } catch {
          setError("Jupyter 内核已被回收且重建失败，请点击 ↺ 重置");
          return;
        }
        for (let i = 0; i <= idx; i++) {
          if (cells[i].code.trim()) await execCell(fresh, cells[i]);
        }
      }
    },
    [cells, ready, execCell, reviveKernel]
  );

  const runAll = useCallback(async () => {
    for (const cell of cells) {
      if (cell.code.trim()) await runCell(cell.id);
    }
  }, [cells, runCell]);

  const addCell = useCallback(() => {
    setCells((prev) => [
      ...prev,
      { id: `cell-${Date.now()}`, code: "", outputs: [], running: false },
    ]);
  }, []);

  const reset = useCallback(async () => {
    const stale = idRef.current;
    idRef.current = null;
    setReady(false);
    if (stale) await deleteNotebook(stale);
    const id = newNotebookId();
    setCells((prev) => prev.map((c) => ({ ...c, outputs: [] })));
    try {
      await createNotebook(id, setupCode);
      idRef.current = id;
      setNotebookId(id);
      setReady(true);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [setupCode]);

  if (error) {
    return (
      <div style={s.errorBox}>
        <div style={s.errorTitle}>Jupyter 连接失败</div>
        <div style={s.errorText}>{error}</div>
        <div style={s.errorHint}>
          请确保已安装依赖并启动 Jupyter 服务：
        </div>
        <pre style={s.errorCmd}>
{`pip install -r requirements.txt
python scripts/jupyter_server.py`}
        </pre>
      </div>
    );
  }

  return (
    <div style={s.wrapper} className="not-prose">
      <div style={s.toolbar}>
        <span style={s.toolbarTitle}>
          {title || "Python Notebook"}
          {notebookId && (
            <span style={s.readyDot} title="Kernel ready" />
          )}
        </span>
        <div style={s.toolbarBtns}>
          <button onClick={runAll} disabled={!ready} style={s.btnPrimary}>
            {ready ? "▶ 全部运行" : "初始化中..."}
          </button>
          <button onClick={addCell} disabled={!ready} style={s.btn}>
            + 添加
          </button>
          <button onClick={reset} disabled={!ready} style={s.btn}>
            ↺ 重置
          </button>
        </div>
      </div>

      {cells.map((cell, idx) => (
        <div key={cell.id} style={s.cell}>
          <div style={s.cellHeader}>
            <span style={s.cellNum}>In [{cell.running ? "*" : cell.outputs.length ? "✓" : ""}]:</span>
            <span style={s.cellLabel}>Cell {idx + 1}</span>
            <button
              onClick={() => runCell(cell.id)}
              disabled={!ready || cell.running || !cell.code.trim()}
              style={{
                ...s.runBtn,
                opacity: !ready || cell.running || !cell.code.trim() ? 0.4 : 1,
              }}
            >
              {cell.running ? "⏳ 运行中..." : "▶ 运行"}
            </button>
          </div>

          <textarea
            value={cell.code}
            onChange={(e) => updateCell(cell.id, { code: e.target.value })}
            style={s.editor}
            spellCheck={false}
            placeholder="# 输入 Python 代码..."
          />

          {cell.outputs.length > 0 && (
            <div style={s.outputArea}>
              {cell.outputs.map((out, i) => (
                <OutputView key={i} output={out} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OutputView({ output }: { output: NotebookOutput }) {
  switch (output.type) {
    case "text":
      return <pre style={s.outText}>{output.text}</pre>;
    case "stream":
      return (
        <pre
          style={{
            ...s.outText,
            color: output.name === "stderr" ? "#d32f2f" : undefined,
          }}
        >
          {output.text}
        </pre>
      );
    case "image":
      // SVG/HTML from local Jupyter kernel — trusted (user's own Python output)
      return output.mime === "image/svg+xml" ? (
        <div
          style={s.outImage}
          dangerouslySetInnerHTML={{ __html: output.data! }}
        />
      ) : (
        <div style={s.outImage}>
          <img
            src={`data:${output.mime};base64,${output.data}`}
            alt="output"
            style={{ maxWidth: "100%" }}
          />
        </div>
      );
    case "error":
      return (
        <pre style={s.outError}>
          {output.ename}: {output.evalue}
          {output.traceback?.length ? "\n" + output.traceback.join("\n") : ""}
        </pre>
      );
    case "html":
      return (
        <div
          style={s.outHtml}
          dangerouslySetInnerHTML={{ __html: output.data! }}
        />
      );
    default:
      return null;
  }
}

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    margin: "24px 0",
    overflow: "hidden",
    background: "#fff",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
    background: "#f8f9fa",
    borderBottom: "1px solid #e5e7eb",
  },
  toolbarTitle: {
    fontWeight: 600,
    fontSize: 14,
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  readyDot: {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
  },
  toolbarBtns: { display: "flex", gap: 8 },
  btn: {
    padding: "4px 12px",
    fontSize: 13,
    borderRadius: 4,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    color: "#374151",
  },
  btnPrimary: {
    padding: "4px 12px",
    fontSize: 13,
    borderRadius: 4,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
  },
  cell: {
    borderBottom: "1px solid #f0f0f0",
    padding: "12px 16px",
  },
  cellHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cellNum: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#2563eb",
    fontWeight: 600,
    minWidth: 50,
  },
  cellLabel: {
    fontSize: 12,
    color: "#9ca3af",
    flex: 1,
  },
  runBtn: {
    padding: "3px 10px",
    fontSize: 12,
    borderRadius: 4,
    border: "1px solid #2563eb",
    background: "#eff6ff",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: 500,
  },
  editor: {
    width: "100%",
    minHeight: 80,
    fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
    fontSize: 13,
    lineHeight: 1.6,
    padding: 12,
    border: "1px solid #e5e7eb",
    borderRadius: 4,
    background: "#f8f9fa",
    resize: "vertical" as const,
    outline: "none",
    boxSizing: "border-box" as const,
    tabSize: 4,
  },
  outputArea: {
    marginTop: 8,
    padding: 12,
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 4,
  },
  outText: {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap" as const,
    margin: 0,
    color: "#1f2937",
  },
  outImage: {
    margin: "8px 0",
    textAlign: "center" as const,
  },
  outError: {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap" as const,
    margin: 0,
    color: "#dc2626",
    background: "#fef2f2",
    padding: 8,
    borderRadius: 4,
  },
  outHtml: { margin: 0 },
  errorBox: {
    border: "1px solid #fca5a5",
    borderRadius: 8,
    padding: 20,
    margin: "24px 0",
    background: "#fef2f2",
  },
  errorTitle: {
    fontWeight: 600,
    fontSize: 16,
    color: "#dc2626",
    marginBottom: 8,
  },
  errorText: { fontSize: 14, color: "#991b1b", marginBottom: 8 },
  errorHint: { fontSize: 13, color: "#6b7280", marginBottom: 8 },
  errorCmd: {
    fontFamily: "monospace",
    fontSize: 13,
    background: "#1f2937",
    color: "#e5e7eb",
    padding: 12,
    borderRadius: 4,
    overflow: "auto",
  },
};
