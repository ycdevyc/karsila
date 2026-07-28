import Link from "next/link";

type DashboardHeaderProps = {
  driverName: string;
  vehicleName?: string | null;
  rating?: number | null;
  verified?: boolean;
  openRequests?: number;
  activeRides?: number;
  completedToday?: number;
};

function getFirstName(name: string): string {
  const [firstName] = name.trim().split(/\s+/);

  return firstName || "sürücü";
}

function getInitials(name: string): string {
  const names = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (names.length === 0) {
    return "CH";
  }

  return names.map((part) => part.charAt(0).toUpperCase()).join("");
}

function getGreeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Europe/Istanbul",
    }).format(new Date()),
  );

  if (hour < 12) {
    return "Günaydın";
  }

  if (hour < 18) {
    return "İyi günler";
  }

  return "İyi akşamlar";
}

type DashboardMetricProps = {
  label: string;
  value: number;
  description: string;
};

function DashboardMetric({
  label,
  value,
  description,
}: DashboardMetricProps) {
  return (
    <div className="min-w-0">
      <p className="text-2xl font-bold tracking-tight text-white">
        {value.toLocaleString("tr-TR")}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">{label}</p>

      <p className="mt-1 text-xs leading-5 text-white/60">{description}</p>
    </div>
  );
}

export function DashboardHeader({
  driverName,
  vehicleName,
  rating,
  verified = false,
  openRequests = 0,
  activeRides = 0,
  completedToday = 0,
}: DashboardHeaderProps) {
  const firstName = getFirstName(driverName);
  const initials = getInitials(driverName);
  const greeting = getGreeting();

  const hasRating = rating !== null && rating !== undefined;

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-950/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%,rgba(34,211,238,0.05))]"
      />

      <div className="relative px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                Karsila
              </span>

              <span className="h-1 w-1 rounded-full bg-white/30" />

              <span className="text-xs font-medium text-white/55">
                Sürücü paneli
              </span>
            </div>

            <div className="mt-6 flex items-start gap-4 sm:gap-5">
              <div className="relative hidden shrink-0 sm:block">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-bold text-white shadow-lg backdrop-blur-md">
                  {initials}
                </div>

                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-4 border-slate-950 bg-emerald-400">
                  <span className="sr-only">Çevrimiçi</span>
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-white/60">
                  {greeting}, {firstName}
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Sıradaki yolculuğa hazır mısınız?
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
                  Yeni transfer taleplerini görün, tekliflerinizi yönetin ve
                  onaylı yolculuklarınızı tek panelden takip edin.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {vehicleName ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold text-white/85 backdrop-blur-md">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 text-cyan-300"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5 5.6 8.58A2.25 2.25 0 0 1 7.7 7.125h8.6a2.25 2.25 0 0 1 2.1 1.455l1.85 4.92M5.25 17.25h13.5M6 20.25v-1.5m12 1.5v-1.5M4.5 13.5h15a1.5 1.5 0 0 1 1.5 1.5v2.25a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V15a1.5 1.5 0 0 1 1.5-1.5Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 16.125h.008v.008H6.75v-.008Zm10.5 0h.008v.008h-.008v-.008Z"
                    />
                  </svg>

                  {vehicleName}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3.5 py-2 text-xs font-semibold text-amber-100 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  Bağlı araç yok
                </span>
              )}

              {hasRating ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold text-white/85 backdrop-blur-md">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-amber-300"
                  >
                    <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.07 4.67a.56.56 0 0 0 .46.33l5.08.52a.56.56 0 0 1 .32.99l-3.8 3.42a.56.56 0 0 0-.17.54l1.07 5a.56.56 0 0 1-.84.61l-4.43-2.55a.56.56 0 0 0-.56 0l-4.43 2.55a.56.56 0 0 1-.84-.61l1.07-5a.56.56 0 0 0-.17-.54l-3.8-3.42a.56.56 0 0 1 .32-.99l5.08-.52a.56.56 0 0 0 .46-.33l2.07-4.67Z" />
                  </svg>

                  5 üzerinden {rating.toFixed(1)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-xs font-medium text-white/55 backdrop-blur-md">
                  Henüz değerlendirme yok
                </span>
              )}

              {verified ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3.5 py-2 text-xs font-semibold text-emerald-100 backdrop-blur-md">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 text-emerald-300"
                    stroke="currentColor"
                    strokeWidth="2"
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

                  Doğrulandı
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3.5 py-2 text-xs font-semibold text-amber-100 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  Doğrulama bekleniyor
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/driver/rides"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Talepleri görüntüle

              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
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

            <Link
              href="/driver/profile"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
                  d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0 17.9 17.9 0 0 1-15 0Z"
                />
              </svg>

              Profilim
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          <div className="bg-slate-950/70 p-5 backdrop-blur-md sm:p-6">
            <DashboardMetric
              label="Yeni talepler"
              value={openRequests}
              description="Yanıt vermeye hazır"
            />
          </div>

          <div className="bg-slate-950/70 p-5 backdrop-blur-md sm:p-6">
            <DashboardMetric
              label="Aktif yolculuklar"
              value={activeRides}
              description="Planlanmış onaylı transferler"
            />
          </div>

          <div className="bg-slate-950/70 p-5 backdrop-blur-md sm:p-6">
            <DashboardMetric
              label="Bugün tamamlanan"
              value={completedToday}
              description="Başarıyla tamamlanan transferler"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
