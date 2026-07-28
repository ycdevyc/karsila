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
          <PublicLocaleSwitcher locale={locale} />

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
