import type { ReactNode } from "react";

import type { DriverRide } from "@/lib/driver/rides";

type DriverRideDetailsProps = {
  ride: DriverRide;
};

const DISPLAY_TIME_ZONE = "Europe/Istanbul";

function formatDate(value: string | null): string {
  if (!value) {
    return "Tarih henüz bilinmiyor";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tarih henüz bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: DISPLAY_TIME_ZONE,
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
    timeZone: DISPLAY_TIME_ZONE,
  }).format(date);
}

function formatDurum(status: string | null | undefined): string {
  switch (status) {
    case "pending":
      return "İşlemde";

    case "new":
      return "Yeni";

    case "open":
      return "Açık";

    case "offered":
      return "Teklif alındı";

    case "confirmed":
      return "Onaylandı";

    default:
      return status || "Bilinmiyor";
  }
}

function getDurumClasses(status: string | null | undefined): string {
  switch (status) {
    case "confirmed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200";

    case "offered":
      return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-300/20 dark:bg-violet-300/10 dark:text-violet-200";

    case "pending":
    case "new":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200";

    case "open":
    default:
      return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200";
  }
}

function InformationCard({
  eyebrow,
  value,
  description,
  icon,
}: {
  eyebrow: string;
  value: ReactNode;
  description?: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white sm:p-5 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/15 dark:hover:bg-white/[0.06]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-white/60">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-white/35">
            {eyebrow}
          </p>

          <div className="mt-1 text-base font-black leading-6 text-slate-950 dark:text-white">
            {value}
          </div>

          {description ? (
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-white/40">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CheckItem({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 dark:border-white/10 dark:bg-white/[0.04]">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
          completed
            ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200"
            : "border-slate-200 bg-slate-50 text-slate-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/20"
        }`}
      >
        {completed ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6.75 12.75 3 3 7.5-7.5"
            />
          </svg>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
      </span>

      <p className="text-sm font-semibold text-slate-700 dark:text-white/65">
        {label}
      </p>
    </div>
  );
}

export function DriverRideDetails({
  ride,
}: DriverRideDetailsProps) {
  const hasPickupLocation = Boolean(ride.pickup_location?.trim());
  const hasDropoffLocation = Boolean(ride.dropoff_location?.trim());
  const hasScheduledAt = Boolean(ride.scheduled_at);
  const hasPassengerCount =
    ride.passengers !== null &&
    ride.passengers !== undefined &&
    ride.passengers > 0;
  const hasFlightNumber = Boolean(ride.flight_number?.trim());

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950 p-5 shadow-xl shadow-slate-950/10 sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-16 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl"
        />

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-cyan-200">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h3m-7.5 6h12m-9.75 6h7.5M4.5 3.75h15v16.5h-15V3.75Z"
                />
              </svg>

              VIP transfer
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] ${getDurumClasses(
                ride.status,
              )}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {formatDurum(ride.status)}
            </span>
          </div>

          <div className="mt-7 grid grid-cols-[38px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-x-5">
            <div className="flex flex-col items-center">
              <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
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
                    d="M12 21s6-5.1 6-11.25a6 6 0 1 0-12 0C6 15.9 12 21 12 21Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12a2.25 2.25 0 1 0 0-4.5A2.25 2.25 0 0 0 12 12Z"
                  />
                </svg>
              </span>

              <span className="my-2 h-14 w-px bg-gradient-to-b from-cyan-300/80 to-white/15" />

              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-white/70">
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
                    d="M4.5 20.25h15m-13.5 0V9.75l6-4.5 6 4.5v10.5M9 20.25v-6h6v6"
                  />
                </svg>
              </span>
            </div>

            <div className="min-w-0 space-y-7">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cyan-300/70">
                  Alış noktası
                </p>

                <p className="mt-1 break-words text-xl font-black leading-7 text-white sm:text-2xl">
                  {ride.pickup_location || "Alış noktası bilinmiyor"}
                </p>
              </div>

              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/35">
                  Varış noktası
                </p>

                <p className="mt-1 break-words text-xl font-black leading-7 text-white sm:text-2xl">
                  {ride.dropoff_location || "Varış noktası bilinmiyor"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/60">
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
                  d="M6.75 3v2.25m10.5-2.25v2.25M3.75 9h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z"
                />
              </svg>

              {formatDate(ride.scheduled_at)}
            </span>

            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/60">
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
                  d="M12 6v6l3.75 2.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              {formatTime(ride.scheduled_at)}
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            Yolculuk özeti
          </p>

          <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">
            Temel bilgiler
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InformationCard
            eyebrow="Tarih"
            value={formatDate(ride.scheduled_at)}
            description={`Planlanan alış saati: ${formatTime(
              ride.scheduled_at,
            )}`}
            icon={
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
                  d="M6.75 3v2.25m10.5-2.25v2.25M3.75 9h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z"
                />
              </svg>
            }
          />

          <InformationCard
            eyebrow="Yolcular"
            value={
              hasPassengerCount
                ? `${ride.passengers} ${
                    ride.passengers === 1
                      ? "yolcu"
                      : "yolcu"
                  }`
                : "Sayı bilinmiyor"
            }
            description="Aracın yeterli kapasiteye sahip olduğunu kontrol edin."
            icon={
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
                  d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0 17.9 17.9 0 0 1-15 0Z"
                />
              </svg>
            }
          />

          <InformationCard
            eyebrow="Uçuş numarası"
            value={ride.flight_number || "Belirtilmedi"}
            description={
              hasFlightNumber
                ? "Olası gecikmeleri kontrol etmek için bu numarayı kullanın."
                : "Müşteri uçuş numarası vermedi."
            }
            icon={
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
                  d="m3 16.5 7.5-2.25V6.75a1.5 1.5 0 0 1 3 0v7.5L21 16.5v2.25l-7.5-1.5V21l-1.5 1.5L10.5 21v-3.75L3 18.75V16.5Z"
                />
              </svg>
            }
          />

          <InformationCard
            eyebrow="Talep durumu"
            value={
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getDurumClasses(
                  ride.status,
                )}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {formatDurum(ride.status)}
              </span>
            }
            description="Bu transfer talebinin güncel durumu."
            icon={
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
                  d="m8.25 12 2.25 2.25 5.25-5.25"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3.75 14.1 5.1l2.48-.04.73 2.37 2.03 1.43-.8 2.35.8 2.35-2.03 1.43-.73 2.37-2.48-.04L12 18.75l-2.1-1.35-2.48.04-.73-2.37-2.03-1.43.8-2.35-.8-2.35 2.03-1.43.73-2.37 2.48.04L12 3.75Z"
                />
              </svg>
            }
          />
        </div>
      </section>

      {ride.customer_note ? (
        <section className="relative overflow-hidden rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 dark:border-amber-300/20 dark:bg-amber-300/10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-200/50 blur-3xl dark:bg-amber-300/10"
          />

          <div className="relative flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-white text-amber-700 shadow-sm dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
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
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-200/70">
                Müşteri notu
              </p>

              <blockquote className="mt-2 text-base font-semibold leading-7 text-amber-950 dark:text-amber-100">
                “{ride.customer_note}”
              </blockquote>

              <p className="mt-3 text-xs leading-5 text-amber-700 dark:text-amber-200/60">
                Fiyatınızı ve araç planlamanızı belirlerken bu istekleri
                dikkate alın.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-cyan-700 dark:text-cyan-300">
            Kontrol listesi
          </p>

          <h3 className="mt-1 text-lg font-black tracking-tight text-slate-950 dark:text-white">
            Talep değerlendirmeye hazır
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-white/45">
            Kesin teklifinizi göndermeden önce eksik bilgileri kontrol edin.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <CheckItem
            label="Alış noktası girildi"
            completed={hasPickupLocation}
          />

          <CheckItem
            label="Varış noktası girildi"
            completed={hasDropoffLocation}
          />

          <CheckItem
            label="Tarih ve saat biliniyor"
            completed={hasScheduledAt}
          />

          <CheckItem
            label="Yolcu sayısı biliniyor"
            completed={hasPassengerCount}
          />

          <CheckItem
            label="Uçuş numarası belirtildi"
            completed={hasFlightNumber}
          />

          <CheckItem
            label="Talep durumu"
            completed={Boolean(ride.status)}
          />
        </div>
      </section>
    </div>
  );
}
