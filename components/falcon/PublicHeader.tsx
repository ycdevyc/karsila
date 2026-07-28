"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
const navigation = [
  {
    href: "/request",
    label: "Request transfer",
  },
  {
    href: "/#how-it-works",
    label: "How it works",
  },
  {
    href: "/driver/login",
    label: "For drivers",
  },
];

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-border/65 bg-background/92 shadow-sm backdrop-blur-xl"
            : "border-border/50 bg-background/82 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <KarsilaLogo subtitle="Antalya transfers" />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-bold text-muted-foreground transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/driver/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold transition hover:border-foreground/20 hover:bg-muted"
            >
              <UserRound className="h-4 w-4" />
              Driver login
            </Link>

            <Link
              href="/request"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0b2944] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#123a5d] hover:shadow-md"
            >
              Request transfer
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 bg-background lg:hidden">
          <div className="flex min-h-full flex-col px-5 pb-8 pt-28 sm:px-6">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex min-h-14 items-center rounded-2xl px-4 text-lg font-extrabold transition hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-3">
              <Link
                href="/driver/login"
                onClick={closeMenu}
                className="flex h-13 items-center justify-center gap-2 rounded-xl border border-border text-sm font-bold"
              >
                <UserRound className="h-4 w-4" />
                Driver login
              </Link>

              <Link
                href="/request"
                onClick={closeMenu}
                className="flex h-13 items-center justify-center rounded-xl bg-[#0b2944] text-sm font-bold text-white"
              >
                Request transfer
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
