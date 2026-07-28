"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type DashboardAutoRefreshProps = {
  intervalMs?: number;
};

export function DashboardAutoRefresh({
  intervalMs = 45_000,
}: DashboardAutoRefreshProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const refreshDashboard = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      if (isRefreshingRef.current) {
        return;
      }

      isRefreshingRef.current = true;
      setIsRefreshing(true);

      router.refresh();

      window.setTimeout(() => {
        const refreshedAt = new Date();

        isRefreshingRef.current = false;
        setIsRefreshing(false);
        setLastUpdatedAt(refreshedAt);
      }, 800);
    };

    const intervalId = window.setInterval(refreshDashboard, intervalMs);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshDashboard();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [intervalMs, router]);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span
        className={`h-2 w-2 rounded-full ${
          isRefreshing
            ? "animate-pulse bg-amber-500"
            : "bg-emerald-500"
        }`}
        aria-hidden="true"
      />

      <span>
        {isRefreshing
          ? "Panel güncelleniyor..."
          : "Otomatik güncellemeler aktif"}
      </span>

      {lastUpdatedAt ? (
        <span>
          · Son güncelleme{" "}
          {new Intl.DateTimeFormat("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(lastUpdatedAt)}
        </span>
      ) : null}
    </div>
  );
}
