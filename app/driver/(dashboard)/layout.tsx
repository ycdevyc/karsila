import Link from "next/link";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { DriverDashboardGuard } from "@/components/driver/DriverDashboardGuard";
import { DriverLogoutButton } from "@/components/driver/DriverLogoutButton";

const driverNavigation = [
  {
    href: "/driver",
    label: "Kontrol paneli",
  },
  {
    href: "/driver/rides",
    label: "Açık talepler",
  },
  {
    href: "/driver/offers",
    label: "Teklifler",
  },
  {
    href: "/driver/active",
    label: "Eşleşmeler",
  },
  {
    href: "/driver/profile",
    label: "Profil",
  },
];

export default function DriverLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DriverDashboardGuard>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-7">
              <Link
                href="/driver"
                className="flex shrink-0 items-center gap-3"
              >
                <KarsilaLogo subtitle="Sürücü platformu" />
              </Link>

              <nav
                aria-label="Sürücü navigasyonu"
                className="hidden items-center gap-1 lg:flex"
              >
                {driverNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3.5 py-2.5 text-sm font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <DriverLogoutButton />
          </div>

          <nav
            aria-label="Mobil sürücü navigasyonu"
            className="overflow-x-auto border-t border-border/60 lg:hidden"
          >
            <div className="mx-auto flex min-w-max gap-1 px-5 py-2 sm:px-6">
              {driverNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        {children}
      </div>
    </DriverDashboardGuard>
  );
}
