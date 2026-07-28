"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CircleAlert,
  LoaderCircle,
  LogOut,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { supabase } from "@/lib/supabase";

type DriverDashboardGuardProps = {
  children: React.ReactNode;
};

type DriverAccessStatus =
  | "checking"
  | "unauthenticated"
  | "missing-profile"
  | "pending"
  | "approved"
  | "error";

type DriverProfile = {
  id: string;
  full_name: string | null;
  name: string | null;
  verified: boolean | null;
  active: boolean | null;
  is_active: boolean | null;
};

export function DriverDashboardGuard({
  children,
}: DriverDashboardGuardProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<DriverAccessStatus>("checking");

  const [driver, setDriver] =
    useState<DriverProfile | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [signingOut, setSigningOut] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkDriverAccess() {
      try {
        setStatus("checking");
        setErrorMessage(null);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!mounted) {
          return;
        }

        if (userError || !user) {
          setStatus("unauthenticated");
          return;
        }

        const {
          data: driverData,
          error: driverError,
        } = await supabase
          .from("drivers")
          .select(
            `
            id,
            full_name,
            name,
            verified,
            active,
            is_active
            `,
          )
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (!mounted) {
          return;
        }

        if (driverError) {
          console.error(
            "Failed to check driver dashboard access:",
            driverError,
          );

          setErrorMessage(
            "Sürücü profiliniz kontrol edilemedi.",
          );
          setStatus("error");
          return;
        }

        if (!driverData) {
          setStatus("missing-profile");
          return;
        }

        const profile =
          driverData as DriverProfile;

        setDriver(profile);

        const isApproved =
          profile.verified === true &&
          profile.active === true &&
          profile.is_active === true;

        setStatus(
          isApproved ? "approved" : "pending",
        );
      } catch (error) {
        console.error(
          "Unexpected driver access error:",
          error,
        );

        if (mounted) {
          setErrorMessage(
            "Sürücü hesabınız kontrol edilirken bir sorun oluştu.",
          );
          setStatus("error");
        }
      }
    }

    void checkDriverAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.replace("/driver/login");
        router.refresh();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function signOut() {
    setSigningOut(true);

    await supabase.auth.signOut();

    router.replace("/driver/login");
    router.refresh();
  }

  if (status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071c31] px-5">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-white backdrop-blur-xl">
            <LoaderCircle className="h-6 w-6 animate-spin" />
          </span>

          <p className="mt-5 text-sm font-bold text-white">
            Sürücü erişimi kontrol ediliyor...
          </p>

          <p className="mt-2 text-xs text-white/50">
            Karsila hesabınızı doğruluyoruz.
          </p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <AccessMessage
        icon={
          <ShieldCheck className="h-7 w-7" />
        }
        eyebrow="Sürücü erişimi"
        title="Lütfen önce giriş yapın."
        description="Bu panele erişmek için onaylı bir Karsila sürücü hesabına ihtiyacınız var."
        primaryHref="/driver/login"
        primaryLabel="Sürücü girişine git"
        secondaryHref="/"
        secondaryLabel="Karsila'ya dön"
      />
    );
  }

  if (status === "missing-profile") {
    return (
      <AccessMessage
        icon={
          <CircleAlert className="h-7 w-7" />
        }
        eyebrow="Sürücü profili"
        title="Sürücü profili bulunamadı."
        description="Giriş hesabınız mevcut ancak bir Karsila sürücü profiline bağlı değil. Başvurunuzu tamamlayabilmemiz için Karsila destek ekibiyle iletişime geçin."
        primaryHref="/driver/register"
        primaryLabel="Sürücü başvurusu oluştur"
        secondaryHref="/"
        secondaryLabel="Karsila'ya dön"
        onSignOut={signOut}
        signingOut={signingOut}
      />
    );
  }

  if (status === "pending") {
    const driverName =
      driver?.full_name ||
      driver?.name ||
      "sürücü";

    return (
      <main className="min-h-screen bg-[#f5f7f8] px-5 py-10 dark:bg-background">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center">
          <section className="w-full overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-xl">
            <div className="bg-[#071c31] px-6 py-8 text-white sm:px-10 sm:py-10">
              <Link
                href="/"
                className="flex w-fit items-center gap-3"
              >
                <KarsilaLogo tone="light" subtitle="Sürücü ağı" />
              </Link>

              <div className="mt-10">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-300/15 text-amber-200">
                  <BadgeCheck className="h-7 w-7" />
                </span>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                  Başvuru inceleniyor
                </p>

                <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
                  Teşekkürler, {driverName}.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                  Sürücü başvurunuz alındı ancak hesabınız henüz
                  etkinleştirilmedi. Panel erişimi verilmeden önce Karsila
                  profilinizi inceleyecektir.
                </p>
              </div>
            </div>

            <div className="px-6 py-7 sm:px-10 sm:py-9">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-300/20 dark:bg-amber-300/10">
                <div className="flex items-start gap-4">
                  <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />

                  <div>
                    <h2 className="text-sm font-extrabold text-amber-900 dark:text-amber-100">
                      Başvurunuz hâlâ inceleniyor
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-200">
                      Karsila sürücü profilinizi, aracınızı ve belgelerinizi
                      inceliyor. Hesabınız kullanıma hazır olduğunda size haber
                      vereceğiz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href="mailto:support@karsila.app"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b2944] px-5 text-sm font-bold text-white transition hover:bg-[#123a5d]"
                >
                  <Mail className="h-4 w-4" />
                  Karsila ile iletişime geç
                </a>

                <button
                  type="button"
                  onClick={signOut}
                  disabled={signingOut}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {signingOut ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}

                  Çıkış yap
                </button>
              </div>

              <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
                Başvurunuz onaylandığında giriş yapabilir ve transfer
                taleplerine hemen erişebilirsiniz.
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <AccessMessage
        icon={
          <CircleAlert className="h-7 w-7" />
        }
        eyebrow="Erişim hatası"
        title="Hesabınızı kontrol edemedik."
        description={
          errorMessage ??
          "Lütfen çıkış yapıp tekrar deneyin."
        }
        primaryHref="/driver/login"
        primaryLabel="Girişe dön"
        secondaryHref="/"
        secondaryLabel="Karsila'ya dön"
        onSignOut={signOut}
        signingOut={signingOut}
      />
    );
  }

  return <>{children}</>;
}

type AccessMessageProps = {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  onSignOut?: () => void;
  signingOut?: boolean;
};

function AccessMessage({
  icon,
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  onSignOut,
  signingOut = false,
}: AccessMessageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f8] px-5 py-10 dark:bg-background">
      <section className="w-full max-w-lg rounded-[2rem] border border-border/70 bg-background p-7 text-center shadow-xl sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#0b2944]/10 text-[#0b2944] dark:bg-white/10 dark:text-white">
          {icon}
        </span>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-[#1b8295]">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em]">
          {title}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          {description}
        </p>

        <div className="mt-8 grid gap-3">
          <Link
            href={primaryHref}
            className="flex h-12 items-center justify-center rounded-xl bg-[#0b2944] px-5 text-sm font-bold text-white transition hover:bg-[#123a5d]"
          >
            {primaryLabel}
          </Link>

          <Link
            href={secondaryHref}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold transition hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            {secondaryLabel}
          </Link>

          {onSignOut ? (
            <button
              type="button"
              onClick={onSignOut}
              disabled={signingOut}
              className="flex h-11 items-center justify-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground disabled:opacity-50"
            >
              {signingOut ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}

              Çıkış yap
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
