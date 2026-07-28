import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/driver/dashboard/DashboardHeader";
import { QuickActions } from "@/components/driver/dashboard/QuickActions";
import { RecentRequests } from "@/components/driver/dashboard/RecentRequests";
import { StatCard } from "@/components/driver/dashboard/StatCard";
import { TodaySchedule } from "@/components/driver/dashboard/TodaySchedule";
import { getDriverDashboard } from "@/lib/driver/dashboard";
import { getCurrentDriverProfile } from "@/lib/driver/profile-server";

function RequestsIcon() {
  return (
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
        d="M8.25 18.75h7.5m-9-15h10.5A2.25 2.25 0 0 1 19.5 6v12A2.25 2.25 0 0 1 17.25 20.25H6.75A2.25 2.25 0 0 1 4.5 18V6a2.25 2.25 0 0 1 2.25-2.25Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 8.25h7.5m-7.5 3.75h4.5"
      />
    </svg>
  );
}

function ActiveTripsIcon() {
  return (
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
        d="M12 21s6-5.1 6-11.25a6 6 0 1 0-12 0C6 15.9 12 21 12 21Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12a2.25 2.25 0 1 0 0-4.5A2.25 2.25 0 0 0 12 12Z"
      />
    </svg>
  );
}

function PendingOffersIcon() {
  return (
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
        d="M8.25 10.5h7.5m-7.5 3h4.5M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v9a2.25 2.25 0 0 1-2.25 2.25H12l-4.5 3v-3h-.75A2.25 2.25 0 0 1 4.5 15.75v-9A2.25 2.25 0 0 1 6.75 4.5Z"
      />
    </svg>
  );
}

function AcceptedOffersIcon() {
  return (
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
  );
}

export default async function DriverDashboardPage() {
  const [dashboard, profile] = await Promise.all([
    getDriverDashboard(),
    getCurrentDriverProfile(),
  ]);

  if (!dashboard || !profile) {
    redirect("/driver/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-cyan-50/70 via-slate-50/40 to-transparent dark:from-cyan-950/20 dark:via-slate-950/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl dark:bg-cyan-500/5"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-80 h-[28rem] w-[28rem] rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-500/5"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="space-y-8 lg:space-y-10">
          <DashboardHeader
            driverName={profile.name}
            vehicleName={profile.vehicle_name ?? null}
            rating={profile.rating}
            verified={profile.verified}
            openRequests={dashboard.stats.openRequests}
            activeRides={dashboard.stats.activeTrips}
          />

          <section aria-labelledby="dashboard-overview-heading">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                  Performans özeti
                </p>

                <h2
                  id="dashboard-overview-heading"
                  className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white"
                >
                  Karsila durumunuz
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-white/50">
                  Sürücü hesabınızdaki taleplerin, yolculukların ve tekliflerin
                  güncel özeti.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                Panel aktif
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Açık talepler"
                value={dashboard.stats.openRequests}
                description="Teklif verebileceğiniz yeni transfer talepleri."
                href="/driver/rides"
                linkLabel="Talepleri görüntüle"
                icon={<RequestsIcon />}
              />

              <StatCard
                title="Aktif yolculuklar"
                value={dashboard.stats.activeTrips}
                description="Şu anda size atanmış onaylı transferler."
                href="/driver/active"
                linkLabel="Aktif yolculukları görüntüle"
                icon={<ActiveTripsIcon />}
              />

              <StatCard
                title="Bekleyen teklifler"
                value={dashboard.stats.pendingOffers}
                description="Müşteri tarafından hâlâ değerlendirilen teklifler."
                href="/driver/offers"
                linkLabel="Teklifleri görüntüle"
                icon={<PendingOffersIcon />}
              />

              <StatCard
                title="Kabul edilen"
                value={dashboard.stats.acceptedOffers}
                description="Müşteriler tarafından kabul edilen teklifler."
                href="/driver/offers"
                linkLabel="Sonuçları görüntüle"
                icon={<AcceptedOffersIcon />}
              />
            </div>
          </section>

          <section
            aria-label="Talepler ve günlük plan"
            className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)] xl:gap-8"
          >
            <RecentRequests requests={dashboard.recentRequests} />

            <div className="xl:sticky xl:top-8">
              <TodaySchedule rides={dashboard.activeTrips} />
            </div>
          </section>

          <QuickActions />
        </div>
      </div>
    </main>
  );
}
