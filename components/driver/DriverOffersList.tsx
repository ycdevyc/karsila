"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { DriverOfferCard } from "@/components/driver/DriverOfferCard";
import {
  getDriverOffers,
  type DriverOffer,
} from "@/lib/driver/offers";
import {
  getCurrentDriver,
  type CurrentDriver,
} from "@/lib/driver/profile";

type OfferFilter =
  | "all"
  | "pending"
  | "accepted"
  | "rejected";

type FilterOption = {
  value: OfferFilter;
  label: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  {
    value: "all",
    label: "Tümü",
  },
  {
    value: "pending",
    label: "Beklemede",
  },
  {
    value: "accepted",
    label: "Kabul edildi",
  },
  {
    value: "rejected",
    label: "Reddedildi",
  },
];

function getOfferCreatedAt(offer: DriverOffer): number {
  const createdAt = new Date(offer.created_at).getTime();

  if (Number.isNaN(createdAt)) {
    return 0;
  }

  return createdAt;
}

function OfferSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
            <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100 dark:bg-white/[0.06]" />
          </div>

          <div className="space-y-3">
            <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100 dark:bg-white/[0.06]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.05]" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.05]" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.05]" />
          </div>
        </div>

        <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200 sm:w-40 dark:bg-white/10" />
      </div>
    </div>
  );
}

function DurumSummaryCard({
  label,
  count,
  description,
  status,
}: {
  label: string;
  count: number;
  description: string;
  status: "all" | "pending" | "accepted" | "rejected";
}) {
  const statusClasses = {
    all: {
      icon: "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/60",
      count: "text-slate-950 dark:text-white",
    },
    pending: {
      icon: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200",
      count: "text-cyan-700 dark:text-cyan-200",
    },
    accepted: {
      icon: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200",
      count: "text-emerald-700 dark:text-emerald-200",
    },
    rejected: {
      icon: "border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/40",
      count: "text-slate-500 dark:text-white/50",
    },
  };

  const classes = statusClasses[status];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-white/35">
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-black tracking-tight ${classes.count}`}
          >
            {count}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-white/40">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${classes.icon}`}
        >
          {status === "all" ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 6.75h12m-12 5.25h12m-12 5.25h12M4.5 6.75h.008v.008H4.5V6.75Zm0 5.25h.008v.008H4.5V12Zm0 5.25h.008v.008H4.5v-.008Z"
              />
            </svg>
          ) : null}

          {status === "pending" ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l3.75 2.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          ) : null}

          {status === "accepted" ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6.75 12.75 3 3 7.5-7.5"
              />
            </svg>
          ) : null}

          {status === "rejected" ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m7.5 7.5 9 9m0-9-9 9"
              />
            </svg>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function DriverOffersList() {
  const [driver, setDriver] =
    useState<CurrentDriver | null>(null);

  const [offers, setOffers] =
    useState<DriverOffer[]>([]);

  const [activeFilter, setActiveFilter] =
    useState<OfferFilter>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function loadOffers({
    refreshing = false,
  }: {
    refreshing?: boolean;
  } = {}) {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage("");

    try {
      const currentDriver =
        await getCurrentDriver();

      if (!currentDriver) {
        setDriver(null);
        setOffers([]);
        return;
      }

      const driverOffers =
        await getDriverOffers(currentDriver.id);

      setDriver(currentDriver);
      setOffers(driverOffers);
    } catch (error) {
      console.error(
        "Failed to load driver offers:",
        error,
      );

      setErrorMessage(
        "Teklifleriniz yüklenemedi. Tekrar deneyin.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void loadOffers();
    }, 0);

    return () => {
      window.clearTimeout(initialLoadTimer);
    };
  }, []);

  const offerCounts = useMemo(() => {
    return offers.reduce(
      (counts, offer) => {
        counts.all += 1;

        if (offer.status === "accepted") {
          counts.accepted += 1;
        } else if (offer.status === "rejected") {
          counts.rejected += 1;
        } else {
          counts.pending += 1;
        }

        return counts;
      },
      {
        all: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
      },
    );
  }, [offers]);

  const filteredOffers = useMemo(() => {
    const sortedOffers = [...offers].sort((a, b) => {
      return (
        getOfferCreatedAt(b) -
        getOfferCreatedAt(a)
      );
    });

    if (activeFilter === "all") {
      return sortedOffers;
    }

    if (activeFilter === "pending") {
      return sortedOffers.filter(
        (offer) =>
          offer.status !== "accepted" &&
          offer.status !== "rejected",
      );
    }

    return sortedOffers.filter(
      (offer) =>
        offer.status === activeFilter,
    );
  }, [activeFilter, offers]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/[0.04]"
              />
            ),
          )}
        </div>

        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/40">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 animate-spin"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3a9 9 0 1 1-9 9"
            />
          </svg>

          Teklifler yükleniyor
        </div>

        <div className="space-y-4">
          <OfferSkeleton />
          <OfferSkeleton />
          <OfferSkeleton />
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-red-200 bg-red-50 p-6 sm:p-8 dark:border-red-300/20 dark:bg-red-300/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-200/50 blur-3xl dark:bg-red-300/10"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-white text-red-600 shadow-sm dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-200">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 15.75 21 18m0-2.25L18.75 18"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700 dark:text-red-200/70">
              Hesap sorunu
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-red-950 dark:text-red-100">
              Sürücü profili bulunamadı
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-red-700 dark:text-red-200/70">
              Bu hesap bir sürücü profiline bağlı değil. Giriş yapılan
              Supabase hesabının{" "}
              <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-xs dark:bg-red-300/10">
                auth_user_id
              </code>{" "}
              alanı üzerinden drivers tablosundaki bir kayda bağlı olduğunu kontrol edin.
            </p>

            <Link
              href="/driver/login"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-red-700 px-5 text-sm font-bold text-white transition hover:bg-red-600 dark:bg-red-200 dark:text-red-950 dark:hover:bg-red-100"
            >
              Yeniden giriş yap
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-12 text-center sm:px-8 sm:py-16 dark:border-white/10 dark:bg-white/[0.03]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-300/[0.06]"
        />

        <div className="relative mx-auto max-w-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white/45">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 5.25h10.5a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 16.5v-9a2.25 2.25 0 0 1 2.25-2.25Z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5.25 7.5 5.38 4.3a2.2 2.2 0 0 0 2.74 0l5.38-4.3"
              />
            </svg>
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-cyan-700 dark:text-cyan-300">
            Teklif merkezi
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Henüz teklif yok
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-white/45">
            Pazaryerinden bir fiyat teklifi gönderdiğinizde teklifiniz
            otomatik olarak bu listede görünür.
          </p>

          <Link
            href="/driver/rides"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-black text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
          >
            Pazaryerini görüntüle

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 12h13.5m-5.25-5.25L18.75 12l-5.25 5.25"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DurumSummaryCard
          label="Toplam"
          count={offerCounts.all}
          description="Gönderilen tüm teklifler"
          status="all"
        />

        <DurumSummaryCard
          label="Beklemede"
          count={offerCounts.pending}
          description="Seçim bekleniyor"
          status="pending"
        />

        <DurumSummaryCard
          label="Kabul edildi"
          count={offerCounts.accepted}
          description="Size atandı"
          status="accepted"
        />

        <DurumSummaryCard
          label="Reddedildi"
          count={offerCounts.rejected}
          description="Başka bir sürücü seçildi"
          status="rejected"
        />
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Teklifleri filtrele"
            className="flex gap-2 overflow-x-auto pb-1 lg:pb-0"
          >
            {FILTER_OPTIONS.map((option) => {
              const count =
                offerCounts[option.value];

              const isActive =
                activeFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setActiveFilter(option.value)
                  }
                  className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white shadow-sm dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50 dark:hover:border-white/20 dark:hover:text-white"
                  }`}
                >
                  {option.label}

                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-black ${
                      isActive
                        ? "bg-white/15 text-white dark:bg-slate-950/10 dark:text-slate-950"
                        : "bg-slate-100 text-slate-500 dark:bg-white/[0.07] dark:text-white/40"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              void loadOffers({
                refreshing: true,
              })
            }
            disabled={isRefreshing}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50 dark:hover:border-cyan-300/20 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className={`h-4 w-4 ${
                isRefreshing
                  ? "animate-spin"
                  : ""
              }`}
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.75v4.5h-4.5M3.75 17.25v-4.5h4.5"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.22 8.25A7.5 7.5 0 0 1 18.8 6.9l1.45 1.35M17.78 15.75A7.5 7.5 0 0 1 5.2 17.1l-1.45-1.35"
              />
            </svg>

            {isRefreshing
              ? "Yenileniyor"
              : "Yenile"}
          </button>
        </div>
      </section>

      {errorMessage ? (
        <div
          role="alert"
          className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-100"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="mt-0.5 h-5 w-5 shrink-0"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4.5m0 3h.008v.008H12V16.5Zm8.25 2.25H3.75L12 3.75l8.25 14.5Z"
            />
          </svg>

          <div>
            <p className="text-sm font-bold">
              Teklifler yüklenemedi
            </p>

            <p className="mt-1 text-xs leading-5 opacity-80">
              {errorMessage}
            </p>
          </div>
        </div>
      ) : null}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
              Resultaten
            </p>

            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">
              {activeFilter === "all"
                ? "Tüm teklifler"
                : FILTER_OPTIONS.find(
                    (option) =>
                      option.value === activeFilter,
                  )?.label}
            </h3>
          </div>

          <p className="text-sm font-medium text-slate-500 dark:text-white/40">
            {filteredOffers.length}{" "}
            {filteredOffers.length === 1
              ? "teklif"
              : "teklif"}
          </p>
        </div>

        {filteredOffers.length > 0 ? (
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <DriverOfferCard
                key={offer.id}
                offer={offer}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center dark:border-white/15 dark:bg-white/[0.03]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/35">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M6.75 12h10.5M9.75 17.25h4.5"
                />
              </svg>
            </div>

            <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white">
              Sonuç yok
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-white/40">
              Şu anda bu durumda teklif yok.
            </p>

            <button
              type="button"
              onClick={() =>
                setActiveFilter("all")
              }
              className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60 dark:hover:border-cyan-300/20 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200"
            >
              Tüm teklifleri göster
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
