"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function WikiError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("页面渲染异常", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-xl font-semibold">页面出错了</h2>
      <p className="text-muted-foreground text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
      >
        重试
      </button>
    </div>
  );
}
