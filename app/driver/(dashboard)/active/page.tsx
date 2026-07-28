import Link from "next/link";
import type { ReactNode } from "react";

import {
  getActiveDriverRides,
  type ActiveDriverRide,
} from "@/lib/driver/active-rides";

function formatDateTime(value: string | null): string {
  if (!value) {
    return "Tarih ve saat henüz bilinmiyor";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tarih ve saat bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

function formatPrice(value: number | null): string {
  if (value === null) {
    return "Fiyat mevcut değil";
  }

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

function DetailCard({
  label,
  value,
  icon,
  children,
}: {
  label: string;
  value?: string | number;
  icon: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-200 hover:bg-cyan-50/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-300/20 dark:hover:bg-cyan-300/[0.04]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-cyan-200 group-hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/45 dark:group-hover:border-cyan-300/20 dark:group-hover:text-cyan-200">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-white/30">
            {label}
          </p>

          {children ?? (
            <p className="mt-1 break-words text-sm font-black text-slate-900 dark:text-white/80">
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function RouteTimeline({
  pickupLocation,
  dropoffLocation,
}: {
  pickupLocation: string;
  dropoffLocation: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.025]">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-[1.15rem] top-6 w-px bg-gradient-to-b from-cyan-400 via-slate-300 to-slate-950 dark:via-white/20 dark:to-white"
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

          <div className="min-w-0 pb-7">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-white/30">
              Alış
            </p>

            <p className="mt-1 break-words text-sm font-black leading-6 text-slate-950 sm:text-base dark:text-white">
              {pickupLocation}
            </p>
          </div>
        </div>

        <div className="relative flex gap-4">
          <div className="relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-950 bg-slate-950 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-950">
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
              {dropoffLocation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveRideCard({ ride }: { ride: ActiveDriverRide }) {
  const whatsappPhone = formatPhoneForWhatsApp(ride.phone);

  const whatsappMessage = encodeURIComponent(
    `Merhaba ${ride.customer_name}, ${ride.pickup_location} noktasından ${ride.dropoff_location} noktasına transferiniz için sürücünüz benim. Karsila üzerinden teklifimi kabul ettiniz. Son ayrıntıları netleştirmek için sizinle iletişime geçiyorum.`,
  );

  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`
    : null;

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-white shadow-sm shadow-emerald-950/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/10 dark:border-emerald-300/20 dark:bg-slate-950 dark:shadow-black/20">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5 bg-emerald-500"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl transition duration-500 group-hover:bg-emerald-200/70 dark:bg-emerald-400/[0.04]"
      />

      <header className="relative border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 px-5 py-6 sm:px-7 sm:py-7 dark:border-emerald-300/10 dark:from-emerald-300/[0.08] dark:via-transparent dark:to-cyan-300/[0.03]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-700 shadow-sm dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6.75 12.75 3 3 7.5-7.5"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.12em] text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>

                  Eşleşme onaylandı
                </span>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.68rem] font-bold text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/40">
                  Transfer #{ride.id.slice(0, 8)}
                </span>
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.17em] text-emerald-700 dark:text-emerald-300">
                Teklif kabul edildi
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                Şu müşteriyle eşleştiniz: {ride.customer_name}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-white/50">
                Alış saatini, buluşma noktasını ve özel ayrıntıları
                netleştirmek için müşteriyle doğrudan iletişime geçin.
              </p>
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-auto">
            <div className="rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-sm dark:border-emerald-300/20 dark:bg-emerald-300/[0.08]">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-200/70">
                Kabul edilen fiyat
              </p>

              <p className="mt-1 text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-300">
                {formatPrice(ride.accepted_price_eur)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative p-5 sm:p-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-cyan-700 dark:text-cyan-300">
                  Transferroute
                </p>

                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                  Yolculuk özeti
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-cyan-600 dark:text-cyan-300"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3.75v3m10.5-3v3M4.5 9.75h15m-12.75-4.5h10.5A2.25 2.25 0 0 1 19.5 7.5v10.5a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25V7.5a2.25 2.25 0 0 1 2.25-2.25Z"
                  />
                </svg>

                {formatDateTime(ride.scheduled_at)}
              </div>
            </div>

            <RouteTimeline
              pickupLocation={ride.pickup_location}
              dropoffLocation={ride.dropoff_location}
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DetailCard
                label="Müşteri"
                value={ride.customer_name}
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

              <DetailCard
                label="Yolcular"
                value={
                  ride.passengers
                    ? `${ride.passengers} ${
                        ride.passengers === 1
                          ? "yolcu"
                          : "yolcu"
                      }`
                    : "Belirtilmedi"
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

              <DetailCard
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

              <DetailCard
                label="Telefon numarası"
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
                      d="M6.75 3.75h2.5l1.25 4-2 1.5a14 14 0 0 0 6.25 6.25l1.5-2 4 1.25v2.5A2.75 2.75 0 0 1 17.5 20C10 19.5 4.5 14 4 6.5a2.75 2.75 0 0 1 2.75-2.75Z"
                    />
                  </svg>
                }
              >
                <a
                  href={`tel:${ride.phone}`}
                  className="mt-1 block break-all text-sm font-black text-slate-900 underline-offset-4 hover:text-cyan-700 hover:underline dark:text-white/80 dark:hover:text-cyan-200"
                >
                  {ride.phone}
                </a>
              </DetailCard>

              <DetailCard
                label="E-posta adresi"
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
                      d="M4.5 6.75h15A2.25 2.25 0 0 1 21.75 9v9A2.25 2.25 0 0 1 19.5 20.25h-15A2.25 2.25 0 0 1 2.25 18V9A2.25 2.25 0 0 1 4.5 6.75Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3 8.25 7.6 5.1a2.5 2.5 0 0 0 2.8 0l7.6-5.1"
                    />
                  </svg>
                }
              >
                {ride.email ? (
                  <a
                    href={`mailto:${ride.email}`}
                    className="mt-1 block break-all text-sm font-black text-slate-900 underline-offset-4 hover:text-cyan-700 hover:underline dark:text-white/80 dark:hover:text-cyan-200"
                  >
                    {ride.email}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-black text-slate-900 dark:text-white/80">
                    Belirtilmedi
                  </p>
                )}
              </DetailCard>

              <DetailCard
                label="Durum"
                value="Onaylandı"
                icon={
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
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
          </div>

          <aside className="space-y-4">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"
              />

              <div className="relative">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cyan-300">
                  Sonraki adım
                </p>

                <h3 className="mt-2 text-xl font-black tracking-tight">
                  İletişime geç
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  Buluşma noktasını, kesin alınış saatini ve bagaj ya da çocuk
                  koltuğu gibi ihtiyaçları doğrudan netleştirin.
                </p>

                <div className="mt-5 space-y-3">
                  <a
                    href={`tel:${ride.phone}`}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-slate-950 transition hover:bg-cyan-50"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      stroke="currentColor"
                      strokeWidth="1.9"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3.75h2.5l1.25 4-2 1.5a14 14 0 0 0 6.25 6.25l1.5-2 4 1.25v2.5A2.75 2.75 0 0 1 17.5 20C10 19.5 4.5 14 4 6.5a2.75 2.75 0 0 1 2.75-2.75Z"
                      />
                    </svg>

                    Bel {ride.customer_name}
                  </a>

                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 text-sm font-black text-emerald-300 transition hover:bg-emerald-400/20"
                    >
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
                          d="M12 21a8.25 8.25 0 1 0-7.1-4.05L3.75 21l4.2-1.1A8.2 8.2 0 0 0 12 21Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 8.75c.5 2.75 2.5 4.75 5.25 5.25"
                        />
                      </svg>

                      WhatsApp gönder
                    </a>
                  ) : (
                    <div className="flex h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/35">
                      WhatsApp kullanılamıyor
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link
              href={`/driver/rides/${ride.id}`}
              className="group/link flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-200 hover:bg-cyan-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-300/20 dark:hover:bg-cyan-300/[0.04]"
            >
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-white/30">
                  Transferdossier
                </p>

                <p className="mt-1 text-sm font-black text-slate-900 group-hover/link:text-cyan-700 dark:text-white/80 dark:group-hover/link:text-cyan-200">
                  Tüm yolculuk detaylarını görüntüle
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition group-hover/link:border-cyan-200 group-hover/link:text-cyan-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/40 dark:group-hover/link:border-cyan-300/20 dark:group-hover/link:text-cyan-200">
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
              </div>
            </Link>
          </aside>
        </div>

        {ride.customer_note ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 dark:border-amber-300/20 dark:bg-amber-300/[0.07]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-700 shadow-sm dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
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
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-200/70">
                  Müşteri mesajı
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-amber-950 dark:text-amber-50/80">
                  {ride.customer_note}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {ride.accepted_message ? (
          <div className="mt-4 rounded-[1.5rem] border border-cyan-200 bg-cyan-50/70 p-5 dark:border-cyan-300/20 dark:bg-cyan-300/[0.06]">
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
                  Kabul edilen teklifiniz
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-cyan-950 dark:text-cyan-50/80">
                  {ride.accepted_message}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default async function DriverActivePage() {
  const rides = await getActiveDriverRides();

  const totalRevenue = rides.reduce(
    (total, ride) => total + (ride.accepted_price_eur ?? 0),
    0,
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-emerald-50/90 via-slate-50/40 to-transparent dark:from-emerald-950/20 dark:via-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-16 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/[0.05]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[36rem] h-[28rem] w-[28rem] rounded-full bg-cyan-200/20 blur-3xl dark:bg-cyan-500/[0.04]"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-6 py-8 shadow-2xl shadow-slate-950/15 sm:px-8 sm:py-10 lg:px-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                </span>

                Onaylanan transferler
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
                Karsila Sürücü
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Onaylanan eşleşmeler
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                Teklifinizi kabul eden tüm müşterileri görün ve son transfer
                ayrıntılarını doğrudan onlarla netleştirin.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/35">
                  Onaylanan eşleşmeler
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {rides.length}
                </p>

                <p className="mt-2 text-xs leading-5 text-white/40">
                  {rides.length === 1
                    ? "Bir aktif transfer"
                    : "Aktif atanmış transferler"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/35">
                  Toplam yolculuk değeri
                </p>

                <p className="mt-2 text-3xl font-black text-emerald-300">
                  {formatPrice(totalRevenue)}
                </p>

                <p className="mt-2 text-xs leading-5 text-white/40">
                  Kabul edilen tekliflere göre
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-7">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Aktif transferler
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Onaylı yolculuklarınız
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-white/45">
                Her müşteriyle zamanında iletişime geçin; kesin buluşma
                noktasını ve alınış saatini netleştirin.
              </p>
            </div>

            <Link
              href="/driver/rides"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60 dark:hover:border-cyan-300/20 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200"
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

          {rides.length === 0 ? (
            <div className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-14 text-center sm:px-8 sm:py-16 dark:border-white/15 dark:bg-white/[0.03]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-300/[0.06]"
              />

              <div className="relative mx-auto max-w-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white/45">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-7 w-7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M12 3.75l7.5 3v5.5c0 4.7-3.2 7.25-7.5 8.5-4.3-1.25-7.5-3.8-7.5-8.5v-5.5l7.5-3Z"
                    />
                  </svg>
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-emerald-700 dark:text-emerald-300">
                  Henüz eşleşme yok
                </p>

                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  İlk onayınız bekleniyor
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-white/45">
                  Bir turist teklifinizi kabul ettiğinde
                  iletişim bilgileri ve transfer detayları bu sayfada otomatik olarak görünür.
                </p>

                <Link
                  href="/driver/rides"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-black text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 dark:bg-emerald-300 dark:text-slate-950 dark:hover:bg-emerald-200"
                >
                  Açık talepleri görüntüle

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
          ) : (
            <div className="space-y-6">
              {rides.map((ride) => (
                <ActiveRideCard key={ride.id} ride={ride} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
