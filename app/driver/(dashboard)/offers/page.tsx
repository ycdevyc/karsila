import { DriverOffersList } from "@/components/driver/DriverOffersList";

export default function DriverOffersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-cyan-50/80 via-slate-50/30 to-transparent dark:from-cyan-950/20 dark:via-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-16 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/[0.05]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-80 h-[28rem] w-[28rem] rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-500/[0.05]"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-6 py-8 shadow-2xl shadow-slate-950/15 sm:px-8 sm:py-10 lg:px-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Karsila Pazaryeri
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                Sürücü portalı
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Tekliflerim
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                Gönderdiğiniz tüm teklifleri görüntüleyin, durumlarını takip
                edin ve hangi transferlerin size atandığını hemen görün.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/35">
                  Durum
                </p>

                <p className="mt-2 text-lg font-black text-white">
                  Canlı güncellemeler
                </p>

                <p className="mt-2 text-xs leading-5 text-white/40">
                  Tüm teklifler gerçek zamanlı olarak güncellenir.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/35">
                  Kabul
                </p>

                <p className="mt-2 text-lg font-black text-white">
                  Anında görünürlük
                </p>

                <p className="mt-2 text-xs leading-5 text-white/40">
                  Bir müşteri teklifinizi seçtiğinde hemen görün.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/35">
                  Geçmiş
                </p>

                <p className="mt-2 text-lg font-black text-white">
                  Eksiksiz görünüm
                </p>

                <p className="mt-2 text-xs leading-5 text-white/40">
                  Tüm aktif ve tamamlanmış teklifleriniz tek yerde.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-7">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                Teklif merkezi
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Gönderilen teklifler
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/45">
                Gönderdiğiniz tüm teklifleri ve güncel durumlarını burada
                görüntüleyin.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                <p className="text-sm font-bold text-cyan-900 dark:text-cyan-100">
                  Gerçek zamanlı senkronizasyon etkin
                </p>
              </div>
            </div>
          </div>

          <DriverOffersList />
        </section>
      </div>
    </main>
  );
}
