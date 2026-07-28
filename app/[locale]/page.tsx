import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PublicHomePage } from "@/components/public/PublicHomePage";
import { isPublicLocale } from "@/lib/i18n/public";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  const russian = locale === "ru";
  const turkish = locale === "tr";

  return {
    title: russian
      ? "Частные трансферы из аэропорта Антальи"
      : turkish
        ? "Özel Antalya Havalimanı Transferleri"
        : "Private Antalya Airport Transfers",
    description: russian
      ? "Получите предложения от проверенных местных водителей и выберите частный трансфер из аэропорта Антальи."
      : turkish
        ? "Güvenilir yerel sürücülerden teklifler alın ve özel Antalya havalimanı transferinizi seçin."
        : "Receive offers from trusted local drivers and choose your private Antalya airport transfer.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ru: "/ru",
        tr: "/tr",
      },
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return <PublicHomePage locale={locale} />;
}
