export const publicLocales = ["en", "ru", "tr"] as const;
export const publicRequestLocales = ["en", "ru"] as const;

export type PublicLocale = (typeof publicLocales)[number];

export function isPublicLocale(value: string): value is PublicLocale {
  return publicLocales.includes(value as PublicLocale);
}

export type PublicRequestLocale = (typeof publicRequestLocales)[number];

export function isPublicRequestLocale(
  value: string,
): value is PublicRequestLocale {
  return publicRequestLocales.includes(value as PublicRequestLocale);
}

export function publicPath(locale: PublicLocale, path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}
