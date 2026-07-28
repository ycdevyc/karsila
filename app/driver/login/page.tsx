"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CarFront,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const driverImage =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1800&q=88";

export default function DriverLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (session) {
        router.replace("/driver");
        return;
      }

      setCheckingSession(false);
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setErrorMessage("E-posta adresinizi ve şifrenizi girin.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(
        error.message === "Invalid login credentials"
          ? "E-posta adresi veya şifre hatalı."
          : error.message,
      );

      setLoading(false);
      return;
    }

    router.replace("/driver");
    router.refresh();
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071c31]">
        <div className="flex items-center gap-3 text-sm font-bold text-white">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Sürücü platformu açılıyor...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f8] dark:bg-background">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)]">
        <section className="relative hidden overflow-hidden bg-[#071c31] text-white lg:flex lg:flex-col">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${driverImage}")`,
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,20,36,0.97)_0%,rgba(4,20,36,0.84)_55%,rgba(4,20,36,0.48)_100%)]"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#071c31] via-transparent to-[#071c31]/30"
          />

          <div className="relative flex min-h-screen flex-col px-10 py-9 xl:px-16 xl:py-12">
            <Link href="/" className="flex w-fit items-center gap-3">
              <KarsilaLogo tone="light" subtitle="Sürücü ağı" />
            </Link>

            <div className="my-auto max-w-xl py-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur-xl">
                <CarFront className="h-4 w-4 text-amber-200" />
                Karsila Sürücü
              </div>

              <h1 className="mt-7 text-5xl font-extrabold leading-[1.03] tracking-[-0.055em] xl:text-6xl">
                Sıradaki premium
                <span className="block text-amber-200">
                  transferiniz burada başlıyor.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-white/68">
                Transfer taleplerini görüntüleyin, kendi sabit fiyatlı
                tekliflerinizi gönderin ve programınıza uygun yolculukları seçin.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <DriverBenefit text="Transferlerinizi kendiniz seçin" />
                <DriverBenefit text="Fiyatlarınızı kendiniz belirleyin" />
                <DriverBenefit text="Aylık abonelik yok" />
                <DriverBenefit text="Müşteriyle doğrudan iletişim" />
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/50">
              <ShieldCheck className="h-4 w-4" />
              Erişim yalnızca onaylı Karsila sürücülerine açıktır.
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen flex-col">
          <div className="flex h-[72px] items-center justify-between border-b border-border/65 bg-background px-5 sm:px-8 lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <KarsilaLogo />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
            <div className="w-full max-w-md">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Karsila&apos;ya dön
              </Link>

              <div className="mt-9">
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#1b8295]">
                  Sürücü girişi
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
                  Tekrar hoş geldiniz.
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Uygun transfer taleplerini görmek ve Karsila tekliflerinizi
                  yönetmek için giriş yapın.
                </p>
              </div>

              <form onSubmit={login} className="mt-9 space-y-5">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="inline-flex items-center gap-2 font-bold"
                  >
                    <Mail className="h-4 w-4 text-[#1b8295]" />
                    E-posta adresi
                  </Label>

                  <Input
                    id="email"
                    placeholder="driver@example.com"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading}
                    className="h-12 rounded-xl bg-background"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="password"
                      className="inline-flex items-center gap-2 font-bold"
                    >
                      <LockKeyhole className="h-4 w-4 text-[#1b8295]" />
                      Şifre
                    </Label>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Şifrenizi girin"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={loading}
                      className="h-12 rounded-xl bg-background pr-12"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      aria-label={
                        showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                      }
                      className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {errorMessage ? (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
                  >
                    {errorMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0b2944] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#123a5d] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    <>
                      Sürücü platformuna giriş yap
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Karsila&apos;da yeni misiniz?
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="rounded-[1.5rem] border border-border/70 bg-background p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    <BadgeCheck className="h-5 w-5" />
                  </span>

                  <div>
                    <h3 className="font-extrabold">
                      Sürücü olarak kayıt olun
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Karsila&apos;ya katılmak ve Antalya&apos;yı ziyaret eden
                      yolculardan transfer fırsatları almak için başvurun.
                    </p>
                  </div>
                </div>

                <Link
                  href="/driver/register"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#0b2944]/20 bg-[#0b2944]/5 text-sm font-bold text-[#0b2944] transition hover:border-[#0b2944]/35 hover:bg-[#0b2944]/10 dark:text-white"
                >
                  Sürücü kaydını başlat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-7 text-center text-xs leading-6 text-muted-foreground">
                Panel erişimi açılmadan önce sürücü başvuruları incelenir.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DriverBenefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
        <Check className="h-3.5 w-3.5" />
      </span>

      <span className="text-sm font-bold text-white/88">{text}</span>
    </div>
  );
}
