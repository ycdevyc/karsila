import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CarFront,
  Clock3,
  FileCheck2,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { getPendingDriverApplications } from "@/lib/admin/drivers";

function formatSubmittedAt(value: string | null) {
  if (!value) {
    return "Submission time unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Submission time unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const applications = await getPendingDriverApplications();

  return (
    <main className="px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#0b2944] px-6 py-8 text-white shadow-xl sm:px-8 sm:py-10">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                Secure review center
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
                Driver applications
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Review pending driver profiles, vehicles and verification
                documents before granting access to the Karsila marketplace.
              </p>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/8 px-5 py-4 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                Waiting for review
              </p>
              <p className="mt-2 text-4xl font-extrabold tracking-[-0.05em]">
                {applications.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#1b8295]">
                Review queue
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                Pending applications
              </h2>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="mt-6 rounded-[1.75rem] border border-border/70 bg-background p-10 text-center shadow-sm">
              <BadgeCheck className="mx-auto h-9 w-9 text-emerald-600" />
              <h3 className="mt-4 text-lg font-extrabold">
                All applications reviewed
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                New driver applications will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {applications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-[1.75rem] border border-border/70 bg-background p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1b8295]/10 text-[#1b8295]">
                        <UserRound className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-extrabold">
                          {application.fullName}
                        </h3>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {application.email}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                      {application.applicationStatus === "under_review"
                        ? "Under review"
                        : "Pending"}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <ApplicationDetail
                      icon={<MapPin className="h-4 w-4" />}
                      label="Operating area"
                      value={
                        [application.city, application.country]
                          .filter(Boolean)
                          .join(", ") || "Not provided"
                      }
                    />
                    <ApplicationDetail
                      icon={<CarFront className="h-4 w-4" />}
                      label="Vehicle"
                      value={application.vehicleName ?? "Not provided"}
                    />
                    <ApplicationDetail
                      icon={<Building2 className="h-4 w-4" />}
                      label="Company"
                      value={application.companyName ?? "Independent driver"}
                    />
                    <ApplicationDetail
                      icon={<FileCheck2 className="h-4 w-4" />}
                      label="Documents"
                      value={`${application.documentCount} uploaded`}
                    />
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-border/70 pt-4 text-xs font-semibold text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    Submitted {formatSubmittedAt(application.submittedAt)}
                  </div>

                  <Link
                    href={`/admin/drivers/${application.id}`}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b2944] px-5 text-sm font-bold text-white transition hover:bg-[#123a5d]"
                  >
                    Review application
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ApplicationDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/55 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-[0.13em]">
          {label}
        </p>
      </div>
      <p className="mt-2 truncate text-sm font-bold">{value}</p>
    </div>
  );
}
