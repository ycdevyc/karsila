import { redirect } from "next/navigation";

import { DriverProfileForm } from "./DriverProfileForm";
import {
  getAvailableVehicles,
  getCurrentDriverProfile,
} from "@/lib/driver/profile-server";

export default async function EditDriverProfilePage() {
  const [profile, vehicles] = await Promise.all([
    getCurrentDriverProfile(),
    getAvailableVehicles(),
  ]);

  if (!profile) {
    redirect("/driver/login");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Sürücü hesabı
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Profili düzenle
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Kişisel bilgilerinizi, dillerinizi, aracınızı ve profil
            fotoğrafınızı güncelleyin. Güncellenen bilgiler yeni tekliflerde
            kullanılır.
          </p>
        </section>

        <DriverProfileForm
          profile={{
            name: profile.name,
            phone: profile.phone,
            languages: profile.languages,
            vehicle_id: profile.vehicle_id,
            profile_photo: profile.profile_photo,
          }}
          vehicles={vehicles}
        />
      </div>
    </main>
  );
}
