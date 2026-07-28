"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentDriver,
  type CurrentDriver,
} from "@/lib/driver";
import {
  getOpenDriverRides,
  type DriverRide,
} from "@/lib/driver/rides";
import { supabase } from "@/lib/supabase";

type DriverOffer = {
  id: string;
  ride_id: string;
  price_eur: number;
  status: string;
};

type MarketplaceFilter =
  | "all"
  | "today"
  | "tomorrow"
  | "airport"
  | "without_offer";

type FilterOption = {
  id: MarketplaceFilter;
  label: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: "all",
    label: "Tüm talepler",
  },
  {
    id: "today",
    label: "Bugün",
  },
  {
    id: "tomorrow",
    label: "Yarın",
  },
  {
    id: "airport",
    label: "Havalimanı",
  },
  {
    id: "without_offer",
    label: "Teklifsiz",
  },
];

const MARKETPLACE_TIME_ZONE = "Europe/Istanbul";

function formatDateTime(value: string | null): string {
  if (!value) {
    return "Alış zamanı henüz bilinmiyor";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Alış zamanı henüz bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: MARKETPLACE_TIME_ZONE,
  }).format(date);
}

function formatTime(value: string | null): string {
  if (!value) {
    return "--:--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: MARKETPLACE_TIME_ZONE,
  }).format(date);
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getDateKey(
  value: string | Date,
  timeZone = MARKETPLACE_TIME_ZONE,
): string {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function getTodayKey(): string {
  return getDateKey(new Date());
}

function getTomorrowKey(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getDateKey(tomorrow);
}

function isAirportRide(ride: DriverRide): boolean {
  const searchableText = [
    ride.pickup_location,
    ride.dropoff_location,
    ride.flight_number,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const airportTerms = [
    "airport",
    "havalimanı",
    "antalya",
    "ayt",
    "terminal",
    "flight",
    "uçuş",
  ];

  return airportTerms.some((term) => searchableText.includes(term));
}

function getUrgencyDetails(scheduledAt: string | null): {
  label: string;
  className: string;
} | null {
  if (!scheduledAt) {
    return null;
  }

  const scheduledDate = new Date(scheduledAt);

  if (Number.isNaN(scheduledDate.getTime())) {
    return null;
  }

  const differenceInHours =
    (scheduledDate.getTime() - Date.now()) / 3_600_000;

  if (differenceInHours >= 0 && differenceInHours <= 2) {
    return {
      label: "2 saat içinde",
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200",
    };
  }

  if (differenceInHours > 2 && differenceInHours <= 6) {
    return {
      label: "6 saat içinde",
      className:
        "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-300/20 dark:bg-orange-300/10 dark:text-orange-200",
    };
  }

  return null;
}

function getOfferDurumLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Beklemede";

    case "accepted":
      return "Kabul edildi";

    case "rejected":
      return "Seçilmedi";

    default:
      return status;
  }
}

function IconContainer({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={
        dark
          ? "flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200"
          : "flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/55"
      }
    >
      {children}
    </div>
  );
}

function MarketplaceSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-[1440px] animate-pulse space-y-6">
        <div className="h-64 rounded-[2rem] bg-slate-200 dark:bg-white/[0.06]" />

        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[360px] rounded-[1.75rem] bg-slate-200 dark:bg-white/[0.06]"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function DriverRidesPage() {
  const [driver, setDriver] = useState<CurrentDriver | null>(null);
  const [rides, setRides] = useState<DriverRide[]>([]);
  const [offers, setOffers] = useState<DriverOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<MarketplaceFilter>("all");

  const fetchData = useCallback(async (backgroundRefresh = false) => {
    if (backgroundRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setErrorMessage("");

    try {
      const currentDriver = await getCurrentDriver();

      setDriver(currentDriver);

      if (!currentDriver) {
        setRides([]);
        setOffers([]);
        return;
      }

      const [openRides, offersResult] = await Promise.all([
        getOpenDriverRides(),
        supabase
          .from("offers")
          .select(
            `
              id,
              ride_id,
              price_eur,
              status
            `,
          )
          .eq("driver_id", currentDriver.id),
      ]);

      if (offersResult.error) {
        throw offersResult.error;
      }

      setRides(openRides);
      setOffers((offersResult.data ?? []) as DriverOffer[]);
    } catch (error) {
      console.error("Failed to load open transfer requests:", error);

      setErrorMessage(
        "Açık transfer talepleri yüklenemedi. Tekrar deneyin.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void fetchData();
    }, 0);

    const channel = supabase
      .channel("driver-open-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
        },
        () => {
          void fetchData(true);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "offers",
        },
        () => {
          void fetchData(true);
        },
      )
      .subscribe();

    return () => {
      window.clearTimeout(initialLoadTimer);
      void supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const offersByRideId = useMemo(() => {
    return new Map(
      offers.map((offer) => [offer.ride_id, offer]),
    );
  }, [offers]);

  const filteredRides = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const todayKey = getTodayKey();
    const tomorrowKey = getTomorrowKey();

    return rides
      .filter((ride) => {
        const myOffer = offersByRideId.get(ride.id);
        const rideDateKey = ride.scheduled_at
          ? getDateKey(ride.scheduled_at)
          : "";

        const matchesFilter = (() => {
          switch (activeFilter) {
            case "today":
              return rideDateKey === todayKey;

            case "tomorrow":
              return rideDateKey === tomorrowKey;

            case "airport":
              return isAirportRide(ride);

            case "without_offer":
              return !myOffer;

            case "all":
            default:
              return true;
          }
        })();

        if (!matchesFilter) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const searchableText = [
          ride.pickup_location,
          ride.dropoff_location,
          ride.flight_number,
          ride.customer_note,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
      .sort((firstRide, secondRide) => {
        if (!firstRide.scheduled_at && !secondRide.scheduled_at) {
          return 0;
        }

        if (!firstRide.scheduled_at) {
          return 1;
        }

        if (!secondRide.scheduled_at) {
          return -1;
        }

        return (
          new Date(firstRide.scheduled_at).getTime() -
          new Date(secondRide.scheduled_at).getTime()
        );
      });
  }, [
    activeFilter,
    offersByRideId,
    rides,
    searchQuery,
  ]);

  const todayRequestCount = useMemo(() => {
    const todayKey = getTodayKey();

    return rides.filter(
      (ride) =>
        ride.scheduled_at &&
        getDateKey(ride.scheduled_at) === todayKey,
    ).length;
  }, [rides]);

  const ridesWithoutOfferCount = useMemo(() => {
    return rides.filter(
      (ride) => !offersByRideId.has(ride.id),
    ).length;
  }, [offersByRideId, rides]);

  const airportRequestCount = useMemo(() => {
    return rides.filter(isAirportRide).length;
  }, [rides]);

  if (loading) {
    return <MarketplaceSkeleton />;
  }

  if (!driver) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <section className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-900/5 sm:p-10 dark:border-white/10 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/50">
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
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0 17.9 17.9 0 0 1-15 0Z"
              />
            </svg>
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
            Sürücü hesabı
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Sürücü bulunamadı
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-white/50">
            Açık transfer taleplerini görmek için bir Karsila sürücü profiline
            bağlı hesapla giriş yapın.
          </p>

          <Link
            href="/driver/login"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-4 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300 dark:focus-visible:ring-offset-slate-900"
          >
            Sürücü girişine git
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-cyan-50/80 via-slate-50/30 to-transparent dark:from-cyan-950/20 dark:via-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full bg-cyan-200/25 blur-3xl dark:bg-cyan-500/[0.06]"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="space-y-7">
          <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-5 py-6 shadow-2xl shadow-slate-950/15 sm:px-7 sm:py-8 lg:px-10 lg:py-10 dark:border-white/10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"
            />

            <div className="relative">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-emerald-200">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-50" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                      </span>

                      Canlı pazaryeri
                    </span>

                    {refreshing ? (
                      <span className="text-xs font-medium text-white/40">
                        Yeni veriler alınıyor…
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                    Karsila
                  </p>

                  <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Transfer Pazaryeri
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                    Uygun transfer taleplerini görüntüleyin, rotayı değerlendirin
                    ve müşterilere doğrudan en iyi teklifinizi gönderin.
                  </p>
                </div>

                <Link
                  href="/driver"
                  className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-bold text-white backdrop-blur-md transition hover:border-white/25 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15 18-6-6 6-6"
                    />
                  </svg>

                  Kontrol paneli
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">
                    {rides.length}
                  </p>

                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/40">
                    Açık talepler
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">
                    {todayRequestCount}
                  </p>

                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/40">
                    Bugün planlanan
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">
                    {ridesWithoutOfferCount}
                  </p>

                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/40">
                    Henüz teklifsiz
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-slate-900">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <label className="relative block w-full xl:max-w-xl">
                <span className="sr-only">Transfer taleplerini ara</span>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m1.1-5.4a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                  />
                </svg>

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Konum, uçuş veya nota göre ara…"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-white/30 dark:focus:border-cyan-300/40 dark:focus:bg-white/[0.07] dark:focus:ring-cyan-300/10"
                />
              </label>

              <button
                type="button"
                onClick={() => void fetchData(true)}
                disabled={refreshing}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/75 dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"
                  />
                </svg>

                Yenileniyor
              </button>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {FILTER_OPTIONS.map((filter) => {
                const isActive = activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm font-bold transition ${
                      isActive
                        ? "border-slate-950 bg-slate-950 text-white shadow-sm dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950"
                        : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/55 dark:hover:border-cyan-300/20 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200"
                    }`}
                  >
                    {filter.label}

                    {filter.id === "airport" &&
                    airportRequestCount > 0 ? (
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[0.65rem] ${
                          isActive
                            ? "bg-white/15 dark:bg-slate-950/15"
                            : "bg-slate-100 dark:bg-white/10"
                        }`}
                      >
                        {airportRequestCount}
                      </span>
                    ) : null}

                    {filter.id === "without_offer" &&
                    ridesWithoutOfferCount > 0 ? (
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[0.65rem] ${
                          isActive
                            ? "bg-white/15 dark:bg-slate-950/15"
                            : "bg-slate-100 dark:bg-white/10"
                        }`}
                      >
                        {ridesWithoutOfferCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          {errorMessage ? (
            <section className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5 dark:border-red-300/20 dark:bg-red-300/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-red-900 dark:text-red-100">
                    Pazaryeri kullanılamıyor
                  </p>

                  <p className="mt-1 text-sm text-red-700 dark:text-red-200/70">
                    {errorMessage}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void fetchData()}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-300 bg-white px-4 text-sm font-bold text-red-800 transition hover:bg-red-100 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-100 dark:hover:bg-red-300/15"
                >
                  Tekrar dene
                </button>
              </div>
            </section>
          ) : null}

          {!errorMessage && filteredRides.length === 0 ? (
            <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-white/15 dark:bg-slate-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/35">
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
                    d="M8.25 18.75h7.5m-9-15h10.5A2.25 2.25 0 0 1 19.5 6v12A2.25 2.25 0 0 1 17.25 20.25H6.75A2.25 2.25 0 0 1 4.5 18V6a2.25 2.25 0 0 1 2.25-2.25Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 8.25h7.5m-7.5 3.75h4.5"
                  />
                </svg>
              </div>

              <h2 className="mt-5 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                Talep bulunamadı
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-white/50">
                Şu anda aramanızla eşleşen talep yok:
                zoekopdracht of geselecteerde filter.
              </p>

              {searchQuery || activeFilter !== "all" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-cyan-700 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                >
                  Wis zoekopdracht en filters
                </button>
              ) : null}
            </section>
          ) : null}

          {!errorMessage && filteredRides.length > 0 ? (
            <section aria-labelledby="marketplace-results-heading">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                    Kullanılabilir transferler
                  </p>

                  <h2
                    id="marketplace-results-heading"
                    className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white"
                  >
                    Açık talepler
                  </h2>
                </div>

                <p className="text-sm font-bold text-slate-500 dark:text-white/45">
                  {filteredRides.length}{" "}
                  {filteredRides.length === 1
                    ? "sonuç"
                    : "sonuç"}
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {filteredRides.map((ride) => {
                  const myOffer =
                    offersByRideId.get(ride.id) ?? null;
                  const urgency = getUrgencyDetails(
                    ride.scheduled_at,
                  );
                  const airportRide = isAirportRide(ride);
                  const passengerCount = ride.passengers ?? null;

                  return (
                    <article
                      key={ride.id}
                      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900 dark:hover:border-white/20"
                    >
                      <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 opacity-70 transition group-hover:opacity-100" />

                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-300" />
                              Açık
                            </span>

                            {airportRide ? (
                              <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-violet-700 dark:border-violet-300/20 dark:bg-violet-300/10 dark:text-violet-200">
                                Havalimanı
                              </span>
                            ) : null}

                            {urgency ? (
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] ${urgency.className}`}
                              >
                                {urgency.label}
                              </span>
                            ) : null}
                          </div>

                          <div className="rounded-xl bg-slate-950 px-3 py-2 text-center text-white dark:bg-white dark:text-slate-950">
                            <p className="text-lg font-black leading-none">
                              {formatTime(ride.scheduled_at)}
                            </p>

                            <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.13em] opacity-55">
                              Alış
                            </p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-4">
                            <div className="flex flex-col items-center">
                              <span className="mt-1 h-3 w-3 rounded-full border-[3px] border-cyan-500 bg-white dark:bg-slate-900" />

                              <span className="my-1 h-12 w-px bg-gradient-to-b from-cyan-400 to-slate-300 dark:to-white/15" />

                              <span className="h-3 w-3 rounded-sm bg-slate-950 dark:bg-white" />
                            </div>

                            <div className="min-w-0 space-y-5">
                              <div>
                                <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-white/35">
                                  Alış noktası
                                </p>

                                <p className="mt-1 line-clamp-2 text-base font-bold leading-6 text-slate-950 dark:text-white">
                                  {ride.pickup_location ||
                                    "Alış noktası bilinmiyor"}
                                </p>
                              </div>

                              <div>
                                <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-white/35">
                                  Varış noktası
                                </p>

                                <p className="mt-1 line-clamp-2 text-base font-bold leading-6 text-slate-950 dark:text-white">
                                  {ride.dropoff_location ||
                                    "Varış noktası bilinmiyor"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-white/35">
                              Tarih
                            </p>

                            <p className="mt-1 text-sm font-bold leading-5 text-slate-800 dark:text-white/80">
                              {formatDateTime(ride.scheduled_at)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-white/35">
                              Yolcular
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-white/80">
                              {passengerCount
                                ? `${passengerCount} ${
                                    passengerCount === 1
                                      ? "yolcu"
                                      : "yolcu"
                                  }`
                                : "Belirtilmedi"}
                            </p>
                          </div>

                          <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:col-span-1 dark:border-white/10 dark:bg-white/[0.04]">
                            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-white/35">
                              Uçuş numarası
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-white/80">
                              {ride.flight_number || "Belirtilmedi"}
                            </p>
                          </div>
                        </div>

                        {ride.customer_note ? (
                          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                            <div className="flex gap-3">
                              <IconContainer>
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
                                    d="M8.25 10.5h7.5m-7.5 3h4.5M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v9A2.25 2.25 0 0 1 17.25 18H12l-4.5 3v-3h-.75A2.25 2.25 0 0 1 4.5 15.75v-9A2.25 2.25 0 0 1 6.75 4.5Z"
                                  />
                                </svg>
                              </IconContainer>

                              <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500 dark:text-white/40">
                                  Müşteri notu
                                </p>

                                <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-white/60">
                                  {ride.customer_note}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-auto pt-5">
                          {myOffer ? (
                            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/20 dark:bg-emerald-300/10">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-emerald-700 dark:text-emerald-200/70">
                                    Teklifiniz
                                  </p>

                                  <p className="mt-1 text-xl font-black text-emerald-950 dark:text-emerald-100">
                                    {formatPrice(myOffer.price_eur)}
                                  </p>
                                </div>

                                <span className="rounded-full border border-emerald-300 bg-white/60 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
                                  {getOfferDurumLabel(myOffer.status)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-white/15 dark:bg-white/[0.03]">
                              <IconContainer>
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
                                    d="M12 6v12m6-6H6"
                                  />
                                </svg>
                              </IconContainer>

                              <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white/80">
                                  Henüz teklif gönderilmedi
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500 dark:text-white/40">
                                  Talebi inceleyin ve fiyatınızı belirleyin.
                                </p>
                              </div>
                            </div>
                          )}

                          <Link
                            href={`/driver/rides/${ride.id}`}
                            className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-slate-900 ${
                              myOffer
                                ? "border border-slate-200 bg-white text-slate-900 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:hover:border-cyan-300/20 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200"
                                : "bg-slate-950 text-white shadow-lg shadow-slate-950/10 hover:bg-cyan-700 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                            }`}
                          >
                            {myOffer
                              ? "Teklifimi görüntüle"
                              : "Talebi görüntüle"}

                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14m-6-6 6 6-6 6"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
