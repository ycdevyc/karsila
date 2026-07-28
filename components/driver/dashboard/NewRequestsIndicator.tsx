"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NewRequestsIndicatorProps = {
  openRequestCount: number;
};

const STORAGE_KEY = "falcon-driver-last-open-request-count";

export function NewRequestsIndicator({
  openRequestCount,
}: NewRequestsIndicatorProps) {
  const [newRequestCount, setNewRequestCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const previousCount = storedValue ? Number.parseInt(storedValue, 10) : null;
    window.localStorage.setItem(STORAGE_KEY, String(openRequestCount));

    const updateId = window.setTimeout(() => {
      if (
        previousCount !== null &&
        Number.isFinite(previousCount) &&
        openRequestCount > previousCount
      ) {
        setNewRequestCount(openRequestCount - previousCount);
      } else {
        setNewRequestCount(0);
      }

      setIsReady(true);
    }, 0);

    return () => {
      window.clearTimeout(updateId);
    };
  }, [openRequestCount]);

  if (!isReady) {
    return null;
  }

  if (newRequestCount === 0) {
    return (
      <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-xs text-muted-foreground shadow-sm">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-emerald-500"
        />

        <span>Son ziyaretinizden beri yeni talep yok</span>
      </div>
    );
  }

  return (
    <Link
      href="/driver/rides"
      className="group flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-100"
    >
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {newRequestCount} yeni talep
        </p>

        <p className="text-xs text-emerald-700">
          Yeni transfer taleplerini görüntüle
        </p>
      </div>

      <span
        aria-hidden="true"
        className="text-lg transition group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
