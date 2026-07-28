import { notFound } from "next/navigation";

import { isPublicLocale, publicLocales } from "@/lib/i18n/public";

export function generateStaticParams() {
  return publicLocales.map((locale) => ({ locale }));
}

export default async function PublicLocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return <div lang={locale}>{children}</div>;
}
