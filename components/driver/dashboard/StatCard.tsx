import Link from "next/link";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  href: string;
  linkLabel: string;
  icon: ReactNode;
};

export function StatCard({
  title,
  value,
  description,
  href,
  linkLabel,
  icon,
}: StatCardProps) {
  return (
    <article className="group relative isolate flex min-h-[250px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10 dark:border-white/10 dark:bg-slate-950 dark:hover:border-white/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-cyan-100/70 blur-3xl transition duration-500 group-hover:scale-125 dark:bg-cyan-400/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
      />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm transition duration-300 group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:group-hover:border-cyan-300/20 dark:group-hover:bg-cyan-300/10 dark:group-hover:text-cyan-200">
            {icon}
          </div>

          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/45">
            Canlı
          </span>
        </div>

        <div className="mt-6">
          <p className="text-4xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
            {value.toLocaleString("tr-TR")}
          </p>

          <h3 className="mt-2 text-base font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/55">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-4 dark:text-white dark:hover:text-cyan-300 dark:focus-visible:ring-offset-slate-950"
          >
            {linkLabel}

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
          </Link>
        </div>
      </div>
    </article>
  );
}
