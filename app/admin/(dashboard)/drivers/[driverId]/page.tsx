import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CarFront,
  ExternalLink,
  FileCheck2,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { DriverReviewActions } from "@/components/admin/DriverReviewActions";
import { getAdminDriverApplication } from "@/lib/admin/drivers";

type PageProps = {
  params: Promise<{
    driverId: string;
  }>;
};

const documentLabels: Record<string, string> = {
  driver_license: "Driver licence",
  commercial_driver_license: "Commercial driver permit",
  vehicle_registration: "Vehicle registration",
  vehicle_insurance: "Vehicle insurance",
};

export default async function AdminDriverApplicationPage({
  params,
}: PageProps) {
  const { driverId } = await params;
  const application = await getAdminDriverApplication(driverId);

  if (!application) {
    notFound();
  }

  return (
    <main className="px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to applications
        </Link>

        <section className="mt-6 rounded-[2rem] bg-[#0b2944] px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-cyan-200">
                Driver application
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
                {application.fullName}
              </h1>
              <p className="mt-3 text-sm text-white/60">{application.email}</p>
            </div>

            <span className="w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.13em]">
              {formatStatus(application.applicationStatus)}
            </span>
          </div>
        </section>

        <div className="mt-7 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <ReviewSection
              title="Personal information"
              icon={<UserRound className="h-5 w-5" />}
            >
              <InfoGrid
                items={[
                  ["Full name", application.fullName, <UserRound key="name" />],
                  ["Email", application.email, <Mail key="email" />],
                  ["Phone", application.phone ?? "Not provided", <Phone key="phone" />],
                  [
                    "Languages",
                    application.languages ?? "Not provided",
                    <Languages key="languages" />,
                  ],
                ]}
              />
            </ReviewSection>

            <ReviewSection
              title="Company and operating area"
              icon={<Building2 className="h-5 w-5" />}
            >
              <InfoGrid
                items={[
                  [
                    "Company",
                    application.companyName ?? "Independent driver",
                    <Building2 key="company" />,
                  ],
                  [
                    "VAT or tax number",
                    application.vatNumber ?? "Not provided",
                    <ShieldCheck key="vat" />,
                  ],
                  [
                    "Location",
                    [application.city, application.country]
                      .filter(Boolean)
                      .join(", ") || "Not provided",
                    <MapPin key="location" />,
                  ],
                  [
                    "Airport region",
                    application.airportRegion ?? "Not provided",
                    <MapPin key="airport" />,
                  ],
                ]}
              />
            </ReviewSection>

            <ReviewSection
              title="Registered vehicle"
              icon={<CarFront className="h-5 w-5" />}
            >
              {application.vehicles.length === 0 ? (
                <EmptyText text="No vehicle is registered." />
              ) : (
                <div className="space-y-4">
                  {application.vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="rounded-2xl bg-muted/55 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-extrabold">{vehicle.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {vehicle.licensePlate ?? "No licence plate"}
                          </p>
                        </div>
                        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold">
                          {vehicle.productionYear ?? "Year unknown"}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <SmallDetail
                          label="Colour"
                          value={vehicle.color ?? "Not provided"}
                        />
                        <SmallDetail
                          label="Passengers"
                          value={String(vehicle.capacity ?? "Unknown")}
                        />
                        <SmallDetail
                          label="Luggage"
                          value={String(vehicle.luggageCapacity ?? "Unknown")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ReviewSection>

            <ReviewSection
              title="Verification documents"
              icon={<FileCheck2 className="h-5 w-5" />}
            >
              {application.documents.length === 0 ? (
                <EmptyText text="No documents are available." />
              ) : (
                <div className="grid gap-3">
                  {application.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-col gap-4 rounded-2xl border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-bold">
                          {documentLabels[document.documentType] ??
                            document.documentType}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {document.fileName ?? "Unnamed document"} ·{" "}
                          {formatFileSize(document.fileSizeBytes)}
                        </p>
                      </div>

                      <a
                        href={`/api/admin/documents/${document.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold transition hover:bg-muted"
                      >
                        Open securely
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </ReviewSection>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-6">
            <DriverReviewActions
              driverId={application.id}
              currentStatus={application.applicationStatus}
            />

            <section className="rounded-[1.75rem] border border-border/70 bg-background p-5 shadow-sm">
              <h2 className="text-sm font-extrabold">Application summary</h2>
              <div className="mt-4 space-y-3">
                <SummaryRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Submitted"
                  value={formatDate(application.submittedAt)}
                />
                <SummaryRow
                  icon={<CarFront className="h-4 w-4" />}
                  label="Vehicles"
                  value={String(application.vehicles.length)}
                />
                <SummaryRow
                  icon={<FileCheck2 className="h-4 w-4" />}
                  label="Documents"
                  value={`${application.documents.length} / 4 required`}
                />
                <SummaryRow
                  icon={<UsersRound className="h-4 w-4" />}
                  label="Marketplace access"
                  value={
                    application.verified &&
                    application.active &&
                    application.isActive
                      ? "Enabled"
                      : "Blocked"
                  }
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ReviewSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b8295]/10 text-[#1b8295]">
          {icon}
        </span>
        <h2 className="text-lg font-extrabold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoGrid({
  items,
}: {
  items: Array<[string, string, React.ReactElement]>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value, icon]) => (
        <div key={label} className="rounded-xl bg-muted/55 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
            <p className="text-[10px] font-bold uppercase tracking-[0.13em]">
              {label}
            </p>
          </div>
          <p className="mt-2 break-words text-sm font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SmallDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/55 px-3 py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <p className="rounded-xl bg-muted/55 px-4 py-5 text-sm text-muted-foreground">
      {text}
    </p>
  );
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

function formatFileSize(value: number | null) {
  if (!value || value <= 0) {
    return "Size unknown";
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}
