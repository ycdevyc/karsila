import Link from "next/link";
import type { ReactNode } from "react";

type QuickAction = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: ReactNode;
  featured?: boolean;
};

const actions: QuickAction[] = [
  {
    title: "Yeni talepleri görüntüle",
    description:
      "Uygun transfer taleplerini görün ve hemen teklif gönderin.",
    href: "/driver/rides",
    label: "Talepleri görüntüle",
    featured: true,
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
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
    ),
  },
  {
    title: "Tekliflerim",
    description:
      "Gönderilen tekliflerin ve kabul edilen yolculukların durumunu takip edin.",
    href: "/driver/offers",
    label: "Teklifleri aç",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 10.5h7.5m-7.5 3h4.5M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v9A2.25 2.25 0 0 1 17.25 18H12l-4.5 3v-3h-.75A2.25 2.25 0 0 1 4.5 15.75v-9A2.25 2.25 0 0 1 6.75 4.5Z"
        />
      </svg>
    ),
  },
  {
    title: "Aktif yolculuklar",
    description:
      "Onaylı transferlerinizi ve sizin için planlanan yolculukları görün.",
    href: "/driver/active",
    label: "Planı görüntüle",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
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
    ),
  },
  {
    title: "Profili yönet",
    description:
      "Sürücü bilgilerinizi, aracınızı ve görünen profil bilgilerinizi kontrol edin.",
    href: "/driver/profile",
    label: "Profilime git",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0 17.9 17.9 0 0 1-15 0Z"
        />
      </svg>
    ),
  },
];

function ActionCard({ action }: { action: QuickAction }) {
  if (action.featured) {
    return (
      <Link
        href={action.href}
        className="group relative isolate overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-4 dark:border-white/10 dark:focus-visible:ring-offset-slate-950"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl transition duration-500 group-hover:scale-125"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"
        />

        <div className="relative flex min-h-[230px] flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200 backdrop-blur-md">
              {action.icon}
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Kullanılabilir
            </span>
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Aanbevolen actie
            </p>

            <h3 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              {action.title}
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
              {action.description}
            </p>
          </div>

          <div className="mt-auto pt-7">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
              {action.label}

              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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
      </Link>
    );
  }

  return (
    <Link
      href={action.href}
      className="group flex min-h-[230px] flex-col rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-4 dark:border-white/10 dark:bg-slate-950 dark:hover:border-white/20 dark:focus-visible:ring-offset-slate-950"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition duration-300 group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/65 dark:group-hover:border-cyan-300/20 dark:group-hover:bg-cyan-300/10 dark:group-hover:text-cyan-200">
          {action.icon}
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition duration-200 group-hover:translate-x-0.5 group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700 dark:border-white/10 dark:text-white/35 dark:group-hover:border-cyan-300/20 dark:group-hover:bg-cyan-300/10 dark:group-hover:text-cyan-200">
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

      <div className="mt-7">
        <h3 className="text-lg font-black tracking-tight text-slate-950 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
          {action.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/50">
          {action.description}
        </p>
      </div>

      <p className="mt-auto pt-6 text-sm font-bold text-slate-800 dark:text-white/80">
        {action.label}
      </p>
    </Link>
  );
}

export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
          Hızlı erişim
        </p>

        <h2
          id="quick-actions-heading"
          className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white"
        >
          Ne yapmak istiyorsunuz?
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-white/50">
          Sürücü ortamınızın en önemli bölümlerine doğrudan gidin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <ActionCard key={action.href} action={action} />
        ))}
      </div>
    </section>
  );
}
