"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Ban,
  CircleAlert,
  LoaderCircle,
  XCircle,
} from "lucide-react";

type ReviewAction = "approve" | "reject" | "suspend";

export function DriverReviewActions({
  driverId,
  currentStatus,
}: {
  driverId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loadingAction, setLoadingAction] = useState<ReviewAction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submitDecision(action: ReviewAction) {
    if ((action === "reject" || action === "suspend") && !note.trim()) {
      setErrorMessage("Add a reason before continuing.");
      return;
    }

    setLoadingAction(action);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/admin/drivers/${driverId}/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            note: note.trim() || null,
          }),
        },
      );

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ?? "The review decision could not be saved.",
        );
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The review decision could not be saved.",
      );
    } finally {
      setLoadingAction(null);
    }
  }

  const locked = loadingAction !== null;
  const canSuspend = currentStatus === "approved";

  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-background p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-extrabold">Review decision</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Add an internal note or provide a required reason when rejecting or
        suspending this driver.
      </p>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        disabled={locked}
        rows={4}
        maxLength={2000}
        placeholder="Internal review note or reason..."
        className="mt-5 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      />

      {errorMessage ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <DecisionButton
          label="Approve application"
          icon={<BadgeCheck className="h-4 w-4" />}
          loading={loadingAction === "approve"}
          disabled={locked}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => void submitDecision("approve")}
        />
        <DecisionButton
          label="Reject application"
          icon={<XCircle className="h-4 w-4" />}
          loading={loadingAction === "reject"}
          disabled={locked}
          className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
          onClick={() => void submitDecision("reject")}
        />
        {canSuspend ? (
          <DecisionButton
            label="Suspend driver"
            icon={<Ban className="h-4 w-4" />}
            loading={loadingAction === "suspend"}
            disabled={locked}
            className="border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300 sm:col-span-2"
            onClick={() => void submitDecision("suspend")}
          />
        ) : null}
      </div>
    </section>
  );
}

function DecisionButton({
  label,
  icon,
  loading,
  disabled,
  className,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  disabled: boolean;
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : icon}
      {label}
    </button>
  );
}
