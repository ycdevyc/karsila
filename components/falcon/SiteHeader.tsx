import { Suspense } from "react";
import Link from "next/link";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { PublicLocaleSwitcher } from "@/components/public/PublicLocaleSwitcher";
import { Button } from "@/components/ui/button";
import {
  publicPath,
  type PublicLocale,
} from "@/lib/i18n/public";

export function SiteHeader({
  locale = "en",
}: {
  locale?: PublicLocale;
}) {
  const driverLabel =
    locale === "ru"
      ? "Водителям"
      : locale === "tr"
        ? "Sürücü"
        : "Driver";
  const bookLabel =
    locale === "ru" ? "Заказать" : locale === "tr" ? "Rezervasyon" : "Book";
  const requestLocale = locale === "tr" ? "en" : locale;

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href={publicPath(locale)}
          className="shrink-0"
        >
          <KarsilaLogo />
        </Link>

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <Suspense
            fallback={
              <span className="inline-flex rounded-xl border border-border/70 bg-background/80 p-1">
                <span className="rounded-lg bg-[#0b2944] px-2.5 py-1.5 text-xs font-extrabold text-white">
                  {locale.toUpperCase()}
                </span>
              </span>
            }
          >
            <PublicLocaleSwitcher locale={locale} />
          </Suspense>

          <Link href="/driver/login" className="hidden sm:block">
            <Button variant="outline" size="sm">
              {driverLabel}
            </Button>
          </Link>

          <Link href={publicPath(requestLocale, "/request")}>
            <Button size="sm">
              {bookLabel}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
