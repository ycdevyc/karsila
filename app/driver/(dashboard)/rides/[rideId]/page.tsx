import Link from "next/link";
import { notFound } from "next/navigation";

import { DriverRideDetails } from "@/components/driver/DriverRideDetails";
import { ProposalForm } from "@/components/driver/ProposalForm";
import { getDriverRideById } from "@/lib/driver/rides-server";

type DriverRidePageProps = {
  params: Promise<{
    rideId: string;
  }>;
};

export default async function DriverRidePage({
  params,
}: DriverRidePageProps) {
  const { rideId } = await params;
  const ride = await getDriverRideById(rideId);

  if (!ride) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-cyan-50/80 via-slate-50/30 to-transparent dark:from-cyan-950/20 dark:via-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-cyan-200/25 blur-3xl dark:bg-cyan-500/[0.06]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-80 h-[28rem] w-[28rem] rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-500/[0.05]"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="space-y-6 lg:space-y-8">
          <Link
            href="/driver/rides"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-4 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/70 dark:hover:border-cyan-300/20 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200 dark:focus-visible:ring-offset-slate-950"
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

            Pazaryerine dön
          </Link>

          <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-5 py-7 shadow-2xl shadow-slate-950/15 sm:px-7 sm:py-9 lg:px-10 dark:border-white/10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-cyan-200">
                    <span className="h-2 w-2 rounded-full bg-cyan-300" />
                    Açık talep
                  </span>

                  <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/55">
                    Transfer ayrıntıları
                  </span>
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                  Karsila Pazaryeri
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Talebi inceleyin
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                  Güzergâhı, programı ve müşteri bilgilerini kontrol edin.
                  Ardından bu transfer için teklifinizi gönderin.
                </p>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[340px]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 backdrop-blur-md">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-white/35">
                    Talep numarası
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-white">
                    {ride.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 backdrop-blur-md">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-white/35">
                    Actie
                  </p>

                  <p className="mt-1 text-sm font-bold text-cyan-200">
                    Teklif ver
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            aria-label="Transfer talebi ve teklif"
            className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)] xl:gap-8"
          >
            <div className="min-w-0 rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6 dark:border-white/10 dark:bg-slate-900">
              <div className="mb-5 border-b border-slate-200 pb-5 dark:border-white/10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                  Transferinformatie
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  Yolculuk detayları
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/50">
                  Fiyat teklifi vermeden önce tüm bilgileri kontrol edin
                  verstuurt.
                </p>
              </div>

              <DriverRideDetails ride={ride} />
            </div>

            <aside className="xl:sticky xl:top-8">
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
                <div className="border-b border-slate-200 bg-slate-950 px-5 py-5 sm:px-6 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
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
                          d="M12 6v12m-4.5-9.75h6.75a2.25 2.25 0 0 1 0 4.5h-4.5a2.25 2.25 0 0 0 0 4.5H16.5"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                        Teklifiniz
                      </p>

                      <h2 className="mt-0.5 text-xl font-black text-white">
                        Teklif gönder
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/50">
                    Fiyatınızı ve varsa açıklamanızı girin. Müşteri daha sonra
                    teklifinizi diğer sürücülerin teklifleriyle karşılaştırabilir.
                  </p>
                </div>

                <div className="p-4 sm:p-6">
                  <ProposalForm rideId={ride.id} />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-300/20 dark:bg-amber-300/10">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
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
                        d="M12 9v4.5m0 3h.008v.008H12V16.5Zm8.25 2.25H3.75L12 3.75l8.25 14.5Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                      Fiyatınızı kontrol edin
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-200/70">
                      Teklifinizi göndermeden önce mesafeyi, bekleme süresini,
                      bagajı ve olası ek durakları dikkate alın.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}
