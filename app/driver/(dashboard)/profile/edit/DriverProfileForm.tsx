"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateDriverProfileAction,
  type DriverProfileFormState,
} from "./actions";

type VehicleOption = {
  id: string;
  name: string;
};

type DriverProfileFormProps = {
  profile: {
    name: string;
    phone: string | null;
    languages: string | null;
    vehicle_id: string | null;
    profile_photo: string | null;
  };
  vehicles: VehicleOption[];
};

const initialState: DriverProfileFormState = {
  success: false,
  errorMessage: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Profil kaydediliyor..." : "Değişiklikleri kaydet"}
    </button>
  );
}

export function DriverProfileForm({
  profile,
  vehicles,
}: DriverProfileFormProps) {
  const [state, formAction] = useActionState(
    updateDriverProfileAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-8">
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold">
            Kişisel bilgiler
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Bu bilgiler tekliflerinizde gösterilir. Telefon numaranız yalnızca
            müşteriyle onaylı bir eşleşmeden sonra paylaşılır.
          </p>
        </div>

        <div className="mt-6 grid gap-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              Ad
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={profile.name}
              autoComplete="name"
              placeholder="Örneğin Mehmet Yılmaz"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium"
            >
              Telefon numarası
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone ?? ""}
              autoComplete="tel"
              placeholder="+90 555 123 45 67"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <p className="text-xs text-muted-foreground">
              Tercihen ülke kodu dahil uluslararası formatı kullanın.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="languages"
              className="text-sm font-medium"
            >
              Diller
            </label>

            <input
              id="languages"
              name="languages"
              type="text"
              defaultValue={profile.languages ?? ""}
              placeholder="Örneğin Türkçe, İngilizce, Almanca"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <p className="text-xs text-muted-foreground">
              Birden fazla dili virgülle ayırın.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold">
            Araç
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Müşterilerin tekliflerinizde görebileceği aracı seçin.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <label
            htmlFor="vehicleId"
            className="text-sm font-medium"
          >
            Bağlı araç
          </label>

          <select
            id="vehicleId"
            name="vehicleId"
            defaultValue={profile.vehicle_id ?? ""}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Araç seçilmedi</option>

            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>

          {vehicles.length === 0 ? (
            <p className="text-xs text-amber-700">
              Veritabanında henüz kullanılabilir araç yok.
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold">
            Profil fotoğrafı
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Şimdilik herkese açık bir görsel adresi kullanıyoruz. Supabase
            Storage yüklemesi daha sonra eklenecek.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <label
            htmlFor="profilePhoto"
            className="text-sm font-medium"
          >
            Profil fotoğrafı adresi
          </label>

          <input
            id="profilePhoto"
            name="profilePhoto"
            type="url"
            defaultValue={profile.profile_photo ?? ""}
            placeholder="https://ornek.com/profil-fotografi.jpg"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <p className="text-xs text-muted-foreground">
            Profil fotoğrafı göstermek istemiyorsanız bu alanı boş bırakın.
          </p>
        </div>

        {profile.profile_photo ? (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">
              Mevcut profil fotoğrafı
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.profile_photo}
              alt={profile.name}
              className="h-24 w-24 rounded-full border object-cover"
            />
          </div>
        ) : null}
      </section>

      {state.errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.errorMessage}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/driver/profile"
          className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
        >
          İptal
        </Link>

        <SubmitButton />
      </div>
    </form>
  );
}
