"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  publicLocales,
  publicRequestLocales,
  type PublicLocale,
} from "@/lib/i18n/public";

const localeLabels: Record<PublicLocale, string> = {
  en: "EN",
  ru: "RU",
  tr: "TR",
};

export function PublicLocaleSwitcher({
  locale,
}: {
  locale: PublicLocale;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const availableLocales = pathname.includes("/request")
    ? publicRequestLocales
    : publicLocales;

  function localizedHref(nextLocale: PublicLocale) {
    const segments = pathname.split("/").filter(Boolean);

    if (
      segments[0] === "en" ||
      segments[0] === "ru" ||
      segments[0] === "tr"
    ) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }

    const query = searchParams.toString();
    const nextPath = `/${segments.join("/")}`;

    return query ? `${nextPath}?${query}` : nextPath;
  }

  return (
    <div
      aria-label="Language"
      className="inline-flex rounded-xl border border-border/70 bg-background/80 p-1"
    >
      {availableLocales.map((item) => (
        <Link
          key={item}
          href={localizedHref(item)}
          hrefLang={item}
          aria-current={item === locale ? "page" : undefined}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-extrabold transition ${
            item === locale
              ? "bg-[#0b2944] text-white"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {localeLabels[item]}
        </Link>
      ))}
    </div>
  );
}
