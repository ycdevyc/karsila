import Link from "next/link";

type ScheduledRide = {
  id: string;
  public_id?: string | null;
  pickup_location: string;
  dropoff_location: string;
  scheduled_at: string | null;
  passengers: number | null;
  flight_number: string | null;
  status?: string | null;
};

type TodayScheduleProps = {
  rides: ScheduledRide[];
};

const TIME_ZONE = "Europe/Istanbul";

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

function getDateParts(date: Date): {
  year: number;
  month: number;
  day: number;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIME_ZONE,
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

function isToday(value: string | null): boolean {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  if (!isValidDate(date)) {
    return false;
  }

  const nowParts = getDateParts(new Date());
  const dateParts = getDateParts(date);

  return (
    nowParts.year === dateParts.year &&
    nowParts.month === dateParts.month &&
    nowParts.day === dateParts.day
  );
}

function formatTime(value: string | null): string {
  if (!value) {
    return "--:--";
  }

  const date = new Date(value);

  if (!isValidDate(date)) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(date);
}

function formatLongDate(): string {
  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TIME_ZONE,
  }).format(new Date());
}

function getStatusDetails(status?: string | null): {
  label: string;
  className: string;
} {
  switch (status) {
    case "active":
    case "in_progress":
      return {
        label: "Yolda",
        className:
          "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200",
      };

    case "completed":
      return {
        label: "Tamamlandı",
        className:
          "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/55",
      };

    case "confirmed":
    case null:
    case undefined:
      return {
        label: "Onaylandı",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200",
      };

    default:
      return {
        label: status,
        className:
          "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/55",
      };
  }
}

function EmptySchedule() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white/40">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3.75v2.5m10.5-2.5v2.5M4.5 9.25h15M6.75 5.25h10.5A2.25 2.25 0 0 1 19.5 7.5v10.75a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25V7.5a2.25 2.25 0 0 1 2.25-2.25Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.25 14 1.75 1.75 3.75-4"
            />
          </svg>
        </div>

        <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-400 dark:border-slate-950" />
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">
        Bugünkü planınız boş
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-white/50">
        Bugün için planınızda henüz onaylı transfer yok.
      </p>

      <Link
        href="/driver/rides"
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-4 dark:text-white dark:hover:text-cyan-300 dark:focus-visible:ring-offset-slate-950"
      >
        Açık talepleri görüntüle

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
            d="M5 12h14m-6-6 6 6-6 6"
          />
        </svg>
      </Link>
    </div>
  );
}

export function TodaySchedule({ rides }: TodayScheduleProps) {
  const todayRides = rides
    .filter((ride) => isToday(ride.scheduled_at))
    .sort((firstRide, secondRide) => {
      const firstTime = firstRide.scheduled_at
        ? new Date(firstRide.scheduled_at).getTime()
        : Number.MAX_SAFE_INTEGER;

      const secondTime = secondRide.scheduled_at
        ? new Date(secondRide.scheduled_at).getTime()
        : Number.MAX_SAFE_INTEGER;

      return firstTime - secondTime;
    });

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
      <header className="border-b border-slate-200/80 px-5 py-5 sm:px-6 dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Günlük plan
            </p>

            <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">
              Bugün
            </h2>

            <p className="mt-1 capitalize text-sm text-slate-500 dark:text-white/50">
              {formatLongDate()}
            </p>
          </div>

          <div className="flex h-11 min-w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white">
            {todayRides.length}
          </div>
        </div>
      </header>

      {todayRides.length === 0 ? (
        <EmptySchedule />
      ) : (
        <>
          <div className="divide-y divide-slate-100 dark:divide-white/[0.07]">
            {todayRides.map((ride, index) => {
              const status = getStatusDetails(ride.status);
              const isLastRide = index === todayRides.length - 1;

              return (
                <article
                  key={ride.id}
                  className="group relative px-5 py-5 transition hover:bg-slate-50/80 sm:px-6 dark:hover:bg-white/[0.025]"
                >
                  {!isLastRide ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[-1.25rem] left-[2.48rem] top-[4.25rem] w-px bg-slate-200 sm:left-[2.73rem] dark:bg-white/10"
                    />
                  ) : null}

                  <Link
                    href={`/driver/rides/${ride.id}`}
                    className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-slate-950"
                  >
                    <div className="flex gap-4">
                      <div className="relative z-10 shrink-0">
                        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition group-hover:border-cyan-200 group-hover:bg-cyan-50 dark:border-white/10 dark:bg-white/[0.05] dark:group-hover:border-cyan-300/20 dark:group-hover:bg-cyan-300/10">
                          <span className="text-sm font-black tracking-tight text-slate-950 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-200">
                            {formatTime(ride.scheduled_at)}
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] ${status.className}`}
                          >
                            {status.label}
                          </span>

                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-cyan-600 dark:text-white/25 dark:group-hover:text-cyan-300"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 12h14m-6-6 6 6-6 6"
                            />
                          </svg>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-start gap-2">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-500 ring-4 ring-cyan-50 dark:bg-cyan-300 dark:ring-cyan-300/10" />

                            <p className="min-w-0 truncate text-sm font-bold text-slate-950 dark:text-white">
                              {ride.pickup_location || "Alış noktası"}
                            </p>
                          </div>

                          <div className="ml-[3px] h-4 w-px bg-slate-200 dark:bg-white/10" />

                          <div className="flex items-start gap-2">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-slate-400 bg-white dark:border-white/50 dark:bg-slate-950" />

                            <p className="min-w-0 truncate text-sm font-semibold text-slate-600 dark:text-white/65">
                              {ride.dropoff_location || "Varış noktası"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-white/45">
                          <span className="inline-flex items-center gap-1.5">
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
                                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0 17.9 17.9 0 0 1-15 0Z"
                              />
                            </svg>

                            {ride.passengers ?? 1}{" "}
                            {(ride.passengers ?? 1) === 1
                              ? "yolcu"
                              : "yolcu"}
                          </span>

                          {ride.flight_number ? (
                            <span className="inline-flex items-center gap-1.5">
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
                                  d="m15.75 9-3.75 3.75L8.25 9m3.75 3.75V3.75m-7.5 13.5h15"
                                />
                              </svg>

                              {ride.flight_number}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          <footer className="border-t border-slate-200/80 bg-slate-50/70 px-5 py-4 sm:px-6 dark:border-white/10 dark:bg-white/[0.025]">
            <Link
              href="/driver/active"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-4 dark:text-white dark:hover:text-cyan-300 dark:focus-visible:ring-offset-slate-950"
            >
              Tüm planı görüntüle

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
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </Link>
          </footer>
        </>
      )}
    </section>
  );
}
