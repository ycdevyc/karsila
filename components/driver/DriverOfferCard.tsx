import type { DriverOffer } from "@/lib/driver/offers";

type DriverOfferCardProps = {
  offer: DriverOffer;
};

type OfferDurumStyle = {
  label: string;
  description: string;
  badgeClassName: string;
  iconClassName: string;
  accentClassName: string;
  priceClassName: string;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "Tarih henüz bilinmiyor";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tarih bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Gönderim zamanı bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getRideDurumLabel(status: string) {
  if (status === "pending") {
    return "İşlemde";
  }

  if (status === "new") {
    return "Yeni";
  }

  if (status === "open") {
    return "Tekliflere açık";
  }

  if (status === "offered") {
    return "Teklifler alındı";
  }

  if (status === "confirmed") {
    return "Transfer onaylandı";
  }

  if (status === "cancelled") {
    return "İptal edildi";
  }

  return status;
}

function getOfferDurumStyle(status: string): OfferDurumStyle {
  if (status === "accepted") {
    return {
      label: "Kabul edildi",
      description: "Müşteri teklifinizi seçti.",
      badgeClassName:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200",
      iconClassName:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200",
      accentClassName: "bg-emerald-500",
      priceClassName: "text-emerald-600 dark:text-emerald-300",
    };
  }

  if (status === "rejected") {
    return {
      label: "Seçilmedi",
      description: "Müşteri başka bir teklif seçti.",
      badgeClassName:
        "border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/50",
      iconClassName:
        "border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/40",
      accentClassName: "bg-slate-300 dark:bg-white/20",
      priceClassName: "text-slate-600 dark:text-white/60",
    };
  }

  if (status === "withdrawn") {
    return {
      label: "Geri çekildi",
      description: "Bu teklif artık aktif değil.",
      badgeClassName:
        "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-300/20 dark:bg-orange-300/10 dark:text-orange-200",
      iconClassName:
        "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-300/20 dark:bg-orange-300/10 dark:text-orange-200",
      accentClassName: "bg-orange-400",
      priceClassName: "text-orange-600 dark:text-orange-300",
    };
  }

  return {
    label: "Beklemede",
    description: "Müşteri henüz bir sürücü seçmedi.",
    badgeClassName:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200",
    iconClassName:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200",
    accentClassName: "bg-cyan-500",
    priceClassName: "text-slate-950 dark:text-white",
  };
}

function OfferDurumIcon({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  if (status === "accepted") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6.75 12.75 3 3 7.5-7.5"
        />
      </svg>
    );
  }

  if (status === "rejected") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m7.5 7.5 9 9m0-9-9 9"
        />
      </svg>
    );
  }

  if (status === "withdrawn") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 12h10.5"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l3.75 2.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white/45">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/30">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-white/80">
          {value}
        </p>
      </div>
    </div>
  );
}

export function DriverOfferCard({ offer }: DriverOfferCardProps) {
  const ride = offer.ride;
  const statusStyle = getOfferDurumStyle(offer.status);
  const isAccepted = offer.status === "accepted";

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.75rem] border bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:bg-slate-950 ${
        isAccepted
          ? "border-emerald-200 shadow-emerald-950/5 dark:border-emerald-300/20 dark:shadow-emerald-950/20"
          : "border-slate-200 shadow-slate-950/5 hover:border-cyan-200 dark:border-white/10 dark:shadow-black/20 dark:hover:border-cyan-300/20"
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1.5 ${statusStyle.accentClassName}`}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl transition duration-500 group-hover:bg-cyan-200/70 dark:bg-cyan-400/[0.03] dark:group-hover:bg-cyan-400/[0.06]"
      />

      {isAccepted ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald-100/50 blur-3xl dark:bg-emerald-400/[0.04]"
        />
      ) : null}

      <div className="relative p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.7rem] font-black uppercase tracking-[0.1em] ${statusStyle.badgeClassName}`}
              >
                <span className="relative flex h-2 w-2">
                  {offer.status === "pending" ? (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-40" />
                  ) : null}

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                </span>

                {statusStyle.label}
              </span>

              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.7rem] font-bold text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/40">
                Gönderildi: {formatCreatedAt(offer.created_at)}
              </span>
            </div>

            <div className="mt-6 flex items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${statusStyle.iconClassName}`}
              >
                <OfferDurumIcon
                  status={offer.status}
                  className="h-6 w-6"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-cyan-700 dark:text-cyan-300">
                  Transfer teklifi
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                  {ride
                    ? `${ride.pickup_location} → ${ride.dropoff_location}`
                    : "Yolculuk bilgileri kullanılamıyor"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/45">
                  {statusStyle.description}
                </p>
              </div>
            </div>

            {ride ? (
              <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.025]">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-6 left-[1.15rem] top-6 w-px bg-gradient-to-b from-cyan-400 via-slate-300 to-slate-900 dark:via-white/20 dark:to-white"
                  />

                  <div className="relative flex gap-4">
                    <div className="relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="3.25" />
                        <circle cx="12" cy="12" r="8.25" />
                      </svg>
                    </div>

                    <div className="min-w-0 pb-6">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-white/30">
                        Alış
                      </p>

                      <p className="mt-1 break-words text-sm font-black leading-6 text-slate-950 sm:text-base dark:text-white">
                        {ride.pickup_location}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-900 bg-slate-950 text-white shadow-sm dark:border-white/20 dark:bg-white dark:text-slate-950">
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
                          d="M12 21s6-4.35 6-11a6 6 0 1 0-12 0c0 6.65 6 11 6 11Z"
                        />

                        <circle cx="12" cy="10" r="2" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-white/30">
                        Varış noktası
                      </p>

                      <p className="mt-1 break-words text-sm font-black leading-6 text-slate-950 sm:text-base dark:text-white">
                        {ride.dropoff_location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-7 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5 dark:border-white/15 dark:bg-white/[0.025]">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/35">
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
                        d="M12 9v3.75m8.25 5.5H3.75L12 3.75l8.25 14.5Zm-8.25-2h.008v.008H12V16.25Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      Yolculuk bilgileri eksik
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-white/40">
                      Bağlı transfer bilgileri alınamadı.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="w-full shrink-0 xl:w-[280px]">
            <div
              className={`relative overflow-hidden rounded-[1.5rem] border p-5 ${
                isAccepted
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-300/[0.08]"
                  : "border-slate-200 bg-slate-950 text-white dark:border-white/10 dark:bg-white/[0.05]"
              }`}
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl ${
                  isAccepted
                    ? "bg-emerald-200/70 dark:bg-emerald-300/10"
                    : "bg-cyan-400/20"
                }`}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
                        isAccepted
                          ? "text-emerald-700 dark:text-emerald-200/70"
                          : "text-white/40"
                      }`}
                    >
                      Teklifiniz
                    </p>

                    <p
                      className={`mt-2 text-4xl font-black tracking-tight ${statusStyle.priceClassName}`}
                    >
                      {formatPrice(offer.price_eur)}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      isAccepted
                        ? "border-emerald-200 bg-white text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200"
                        : "border-white/10 bg-white/[0.07] text-cyan-300"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="8.25" />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.25 8.25a3.5 3.5 0 1 0 0 7.5M7.5 10.25h6m-6 3.5h6"
                      />
                    </svg>
                  </div>
                </div>

                <div
                  className={`my-5 h-px ${
                    isAccepted
                      ? "bg-emerald-200 dark:bg-emerald-300/15"
                      : "bg-white/10"
                  }`}
                />

                <div className="flex items-start gap-3">
                  <OfferDurumIcon
                    status={offer.status}
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      isAccepted
                        ? "text-emerald-600 dark:text-emerald-300"
                        : "text-cyan-300"
                    }`}
                  />

                  <p
                    className={`text-xs leading-5 ${
                      isAccepted
                        ? "text-emerald-800 dark:text-emerald-100/70"
                        : "text-white/50"
                    }`}
                  >
                    {isAccepted
                      ? "Bu transfer size atandı. Yolculuk artık onaylandı."
                      : statusStyle.description}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {ride ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoItem
              label="Tarih ve saat"
              value={formatDate(ride.scheduled_at)}
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
                    d="M6.75 3.75v3m10.5-3v3M4.5 9.75h15m-12.75-4.5h10.5A2.25 2.25 0 0 1 19.5 7.5v10.5a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25V7.5a2.25 2.25 0 0 1 2.25-2.25Z"
                  />
                </svg>
              }
            />

            <InfoItem
              label="Yolcular"
              value={
                ride.passengers
                  ? `${ride.passengers} ${
                      ride.passengers === 1 ? "yolcu" : "yolcu"
                    }`
                  : "Bilinmiyor"
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
                    d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                  />
                </svg>
              }
            />

            <InfoItem
              label="Uçuş numarası"
              value={ride.flight_number || "Belirtilmedi"}
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
                    d="m3.75 15.75 6-3.75V6.75a2.25 2.25 0 0 1 4.5 0V12l6 3.75v1.5l-6-1.5V19.5l2.25 1.5v.75L12 21l-4.5.75V21l2.25-1.5v-3.75l-6 1.5v-1.5Z"
                  />
                </svg>
              }
            />

            <InfoItem
              label="Talep durumu"
              value={getRideDurumLabel(ride.status)}
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
                    d="M9 12.75 11.25 15 15 9.75M12 3.75l7.5 3v5.5c0 4.7-3.2 7.25-7.5 8.5-4.3-1.25-7.5-3.8-7.5-8.5v-5.5l7.5-3Z"
                  />
                </svg>
              }
            />
          </div>
        ) : null}

        {offer.message ? (
          <div className="mt-6 rounded-[1.5rem] border border-cyan-200 bg-cyan-50/70 p-5 dark:border-cyan-300/20 dark:bg-cyan-300/[0.06]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-white text-cyan-700 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
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
                    d="M8.25 10.5h7.5m-7.5 3h4.5M5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5v9a2.25 2.25 0 0 1-2.25 2.25H9l-4.5 3v-3.42A2.25 2.25 0 0 1 3 16.2V7.5a2.25 2.25 0 0 1 2.25-2.25Z"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-200/70">
                  Müşteriye mesajınız
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-cyan-950 dark:text-cyan-50/80">
                  {offer.message}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 dark:border-white/15 dark:bg-white/[0.025]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/30">
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
                  d="M8.25 10.5h7.5m-7.5 3h4.5M5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5v9a2.25 2.25 0 0 1-2.25 2.25H9l-4.5 3v-3.42A2.25 2.25 0 0 1 3 16.2V7.5a2.25 2.25 0 0 1 2.25-2.25Z"
                />
              </svg>
            </div>

            <p className="text-sm font-medium text-slate-500 dark:text-white/35">
              Bu teklife kişisel mesaj eklenmedi.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
