"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (user?.app_metadata?.role === "admin") {
        router.replace("/admin");
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
      setErrorMessage("Enter your admin email address and password.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.user) {
      setErrorMessage("The email address or password is incorrect.");
      setLoading(false);
      return;
    }

    if (data.user.app_metadata?.role !== "admin") {
      await supabase.auth.signOut();
      setErrorMessage("This account does not have admin access.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071c31]">
        <div className="flex items-center gap-3 text-sm font-bold text-white">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Checking secure admin access...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef2f4] px-5 py-10 dark:bg-background">
      <section className="w-full max-w-md overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-2xl">
        <div className="relative overflow-hidden bg-[#071c31] px-7 py-9 text-white sm:px-9">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl"
          />

          <div className="relative">
            <KarsilaLogo tone="light" subtitle="Administration" />

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Karsila
            </Link>

            <span className="mt-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
              <ShieldCheck className="h-7 w-7" />
            </span>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              Restricted access
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em]">
              Karsila administration
            </h1>

            <p className="mt-3 text-sm leading-7 text-white/60">
              Sign in with an authorized administrator account.
            </p>
          </div>
        </div>

        <form onSubmit={login} className="space-y-5 px-7 py-8 sm:px-9">
          <div className="grid gap-2">
            <Label htmlFor="admin-email" className="font-bold">
              Email address
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                className="h-12 rounded-xl pl-11"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="admin-password" className="font-bold">
              Password
            </Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                className="h-12 rounded-xl px-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
            >
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0b2944] px-5 text-sm font-bold text-white transition hover:bg-[#123a5d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Sign in securely
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
