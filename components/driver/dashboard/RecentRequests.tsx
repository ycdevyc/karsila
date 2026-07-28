import Link from "next/link";

type RecentRequest = {
  id: string;
  public_id?: string | null;
  pickup_location: string;
  dropoff_location: string;
  scheduled_at: string | null;
  passengers: number | null;
  flight_number: string | null;
  status?: string | null;
  created_at?: string | null;
};

type RecentRequestsProps = {
  requests: RecentRequest[];
};

function formatTransferDate(value: string | null): string {
  if (!value) {
    return "Tarih henüz bilinmiyor";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tarih henüz bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

function formatCreatedAt(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const differenceInMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60_000),
  );

  if (differenceInMinutes < 1) {
    return "Az önce alındı";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} dk önce`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 24) {
    return `${differenceInHours} saat önce`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);

  return differenceInDays === 1
    ? "Dün alındı"
    : `${differenceInDays} gün önce`;
}

function getStatusDetails(status?: string | null): {
  label: string;
  className: string;
} {
  switch (status) {
    case "pending":
    case "new":
      return {
        label: "Yeni",
        className:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200",
      };

    case "offered":
      return {
        label: "Teklif alındı",
        className:
          "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-300/20 dark:bg-violet-300/10 dark:text-violet-200",
      };

    case "confirmed":
      return {
        label: "Onaylandı",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200",
      };

    case "open":
    case null:
    case undefined:
      return {
        label: "Açık",
        className:
          "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200",
      };

    default:
      return {
        label: status,
        className:
          "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/60",
      };
  }
}

function EmptyState() {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center">
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
            d="M8.25 18.75h7.5m-9-15h10.5A2.25 2.25 0 0 1 19.5 6v12A2.25 2.25 0 0 1 17.25 20.25H6.75A2.25 2.25 0 0 1 4.5 18V6a2.25 2.25 0 0 1 2.25-2.25Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 8.25h7.5m-7.5 3.75h4.5"
          />
        </svg>
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">
        Henüz yeni talep yok
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-white/50">
        Müşteriler talep oluşturduğunda yeni transfer talepleri burada görünür.
      </p>

      <Link
        href="/driver/rides"
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-4 dark:text-white dark:hover:text-cyan-300 dark:focus-visible:ring-offset-slate-950"
      >
        Tüm taleplere git

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

export function RecentRequests({ requests }: RecentRequestsProps) {
  const visibleRequests = requests.slice(0, 5);

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Pazaryeri
            </span>

            {requests.length > 0 ? (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-cyan-50 px-2 py-0.5 text-[0.65rem] font-bold text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">
                {requests.length}
              </span>
            ) : null}
          </div>

          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">
            Son talepler
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-white/50">
            Teklif verebileceğiniz en yeni transferler.
          </p>
        </div>

        <Link
          href="/driver/rides"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:self-auto dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:focus-visible:ring-offset-slate-950"
        >
          Tümünü görüntüle

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
      </header>

      {visibleRequests.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-white/[0.07]">
          {visibleRequests.map((request) => {
            const status = getStatusDetails(request.status);
            const createdAt = formatCreatedAt(request.created_at);
            const passengerCount = request.passengers ?? 1;

            return (
              <article
                key={request.id}
                className="group relative transition hover:bg-slate-50/80 dark:hover:bg-white/[0.025]"
              >
                <Link
                  href={`/driver/rides/${request.id}`}
                  className="block px-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500 sm:px-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="relative mt-0.5 hidden shrink-0 sm:block">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/50 dark:group-hover:border-cyan-300/20 dark:group-hover:bg-cyan-300/10 dark:group-hover:text-cyan-200">
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
                              d="M6.75 6.75h10.5M6.75 17.25h10.5M8.25 6.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm10.5 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 8.25v4.5a4.5 4.5 0 0 0 4.5 4.5h4.5"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] ${status.className}`}
                          >
                            {status.label}
                          </span>

                          {createdAt ? (
                            <span className="text-xs font-medium text-slate-400 dark:text-white/35">
                              {createdAt}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-3 text-base font-bold leading-6 text-slate-950 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                          <span className="block truncate">
                            {request.pickup_location || "Alış noktası"}
                          </span>

                          <span className="my-1 block text-xs font-medium uppercase tracking-[0.16em] text-slate-400 dark:text-white/30">
                            varış
                          </span>

                          <span className="block truncate">
                            {request.dropoff_location || "Varış noktası"}
                          </span>
                        </h3>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right dark:border-white/[0.07]">
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white/85">
                          {formatTransferDate(request.scheduled_at)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-white/45">
                          {passengerCount}{" "}
                          {passengerCount === 1
                            ? "yolcu"
                            : "yolcu"}
                        </p>
                      </div>

                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:translate-x-0.5 group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700 dark:border-white/10 dark:text-white/35 dark:group-hover:border-cyan-300/20 dark:group-hover:bg-cyan-300/10 dark:group-hover:text-cyan-200">
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
                      </span>
                    </div>
                  </div>

                  {request.flight_number ? (
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 sm:ml-[60px] dark:text-white/45">
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

                      Uçuş numarası: {request.flight_number}
                    </div>
                  ) : null}
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
