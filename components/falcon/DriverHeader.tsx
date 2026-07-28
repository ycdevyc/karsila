"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CarFront,
  LayoutDashboard,
  LogOut,
  Menu,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { supabase } from "@/lib/supabase";

const driverNavigation = [
  {
    href: "/driver",
    label: "Kontrol paneli",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/driver/rides",
    label: "Uygun yolculuklar",
    icon: CarFront,
  },
  {
    href: "/driver/offers",
    label: "Tekliflerim",
    icon: Send,
  },
  {
    href: "/driver/profile",
    label: "Profil",
    icon: UserRound,
  },
];

export function DriverHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Driver logout failed:", error);
      setLoggingOut(false);
      return;
    }

    router.replace("/driver/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/65 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/driver" className="flex items-center gap-3">
          <KarsilaLogo subtitle="Sürücü platformu" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {driverNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition ${
                  active
                    ? "bg-[#0b2944] text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Çıkış yapılıyor..." : "Çıkış yap"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Sürücü navigasyonunu aç veya kapat"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border lg:hidden"
        >
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-border bg-background px-5 py-5 lg:hidden">
          <nav className="space-y-2">
            {driverNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold ${
                    active
                      ? "bg-[#0b2944] text-white"
                      : "bg-muted/50 text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-bold disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Çıkış yapılıyor..." : "Çıkış yap"}
          </button>
        </div>
      ) : null}
    </header>
  );
}
