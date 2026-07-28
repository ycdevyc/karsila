import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentDriverProfile } from "@/lib/driver/profile-server";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getStatusLabel(active: boolean): string {
  return active ? "Aktif" : "Aktif değil";
}

export default async function DriverProfilePage() {
  const profile = await getCurrentDriverProfile();

  if (!profile) {
    redirect("/driver/login");
  }

  const initials = getInitials(profile.name);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Sürücü hesabı
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Profilim
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Bu bilgiler tekliflerde kullanılır ve onaylı bir eşleşmeden
              sonra kısmen müşteriyle paylaşılır.
            </p>
          </div>

          <Link
            href="/driver/profile/edit"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Profili düzenle
          </Link>
        </section>

        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {profile.profile_photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profile_photo}
                  alt={profile.name}
                  className="h-24 w-24 shrink-0 rounded-full border bg-background object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border bg-background text-2xl font-bold shadow-sm">
                  {initials || "CH"}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="truncate text-2xl font-bold">
                    {profile.name}
                  </h2>

                  {profile.verified ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Doğrulandı
                    </span>
                  ) : (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Henüz doğrulanmadı
                    </span>
                  )}

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      profile.active
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    {getStatusLabel(profile.active)}
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Karsila sürücüsü
                </p>

                {profile.rating !== null ? (
                  <p className="mt-2 text-sm font-medium">
                    Puan: {profile.rating.toFixed(1)} / 5
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Henüz değerlendirme yok
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b p-6 md:border-r">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ad
              </p>

              <p className="mt-2 font-medium">{profile.name}</p>
            </div>

            <div className="border-b p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Telefon numarası
              </p>

              <p className="mt-2 font-medium">
                {profile.phone ?? "Doldurulmadı"}
              </p>
            </div>

            <div className="border-b p-6 md:border-r">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Diller
              </p>

              <p className="mt-2 font-medium">
                {profile.languages ?? "Doldurulmadı"}
              </p>
            </div>

            <div className="border-b p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Araç
              </p>

              <p className="mt-2 font-medium">
                {profile.vehicle_name ?? "Bağlı araç yok"}
              </p>
            </div>

            <div className="p-6 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Profil fotoğrafı
              </p>

              <p className="mt-2 break-all text-sm">
                {profile.profile_photo ?? "Profil fotoğrafı ayarlanmadı"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Müşteri ne görür?
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Müşteri teklifinizde adınızı, aracınızı, dillerinizi, puanınızı ve
            profil fotoğrafınızı görür. Telefon numaranız yalnızca müşteri
            teklifinizi kabul ettikten sonra görünür.
          </p>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/driver"
            className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            Panele dön
          </Link>

          <Link
            href="/driver/profile/edit"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Profili düzenle
          </Link>
        </div>
      </div>
    </main>
  );
}
