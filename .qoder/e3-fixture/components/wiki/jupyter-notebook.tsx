"use client";

/**
 * E3 负向测试数据 —— **故意写坏**的 jupyter-notebook.tsx 副本。
 *
 * 这不是课程代码，也不会被 Next.js 编译（.qoder/ 不在 tsconfig 的 include 里）。
 * 它存在的唯一目的：证明 nb-cells.mjs 的 S8（fix-011 结构前提）真的在测量，
 * 而不是一条永远 PASS 的空门槛（E2 新发现 ②）。
 *
 * 相对真组件，这里注入了三处 fix-011 的原始病因，S8 应当逐条报 FAIL：
 *   1 计数器放进了 useRef —— 每个组件实例各有一份，同页第二个 notebook 又从 0 开始
 *   2 没有模块级 `let nbSeq = 0`
 *   3 没有 newNotebookId()，id 直接在 effect 里拼
 * 结果：同一页两个 notebook 会拿到相同的 kernel id，服务端撞车。
 *
 * **不要修它**——修好就等于删掉测试。
 */

import { useEffect, useRef, useState } from "react";

export default function JupyterNotebook({ cells, setupCode, title }: {
  cells: { code: string }[];
  setupCode?: string;
  title?: string;
}) {
  // 病因 1：useRef 计数器（fix-011 的原始形态）
  const nbCounter = useRef(0);
  const [outputs, setOutputs] = useState<unknown[]>([]);

  useEffect(() => {
    // 病因 3：没有 newNotebookId()，id 在 effect 里现拼；
    // 病因 2：依赖的 nbCounter 是实例级的，同页第二个 notebook 又从 0 开始
    const notebookId = `nb-${Date.now()}-${nbCounter.current++}`;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/notebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notebook_id: notebookId, setup_code: setupCode }),
      });
      if (!res.ok || cancelled) return;
      const collected: unknown[] = [];
      for (const cell of cells) {
        const r = await fetch(`/api/notebook/${notebookId}/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: cell.code }),
        });
        if (!r.ok) break;
        const j = await r.json();
        collected.push(...(j.outputs || []));
      }
      if (!cancelled) setOutputs(collected);
    })();
    return () => { cancelled = true; };
  }, [cells, setupCode]);

  return (
    <div>
      {title ? <h4>{title}</h4> : null}
      <pre>{JSON.stringify(outputs, null, 2)}</pre>
    </div>
  );
}
