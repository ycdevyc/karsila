import type { MetadataRoute } from "next";

import { publicLocales } from "@/lib/i18n/public";

const siteUrl = "https://karsila.app";
const routePages = ["", "/antalya-airport-to-belek"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routePages.flatMap((route) => {
    const languages = Object.fromEntries(
      publicLocales.map((locale) => [
        locale,
        `${siteUrl}/${locale}${route}`,
      ]),
    );

    return publicLocales.map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      changeFrequency: route ? ("monthly" as const) : ("weekly" as const),
      priority: route ? 0.9 : 1,
      alternates: {
        languages: {
          ...languages,
          "x-default": `${siteUrl}/en${route}`,
        },
      },
    }));
  });
}
