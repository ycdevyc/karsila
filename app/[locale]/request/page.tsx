import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicRequestPage } from "@/components/request/PublicRequestPage";
import { isPublicRequestLocale } from "@/lib/i18n/public";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/request">): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicRequestLocale(locale)) {
    return {};
  }

  const isRussian = locale === "ru";

  return {
    title: isRussian
      ? "Заказать трансфер в Анталье"
      : "Request an Antalya transfer",
    description: isRussian
      ? "Получите предложения с фиксированной ценой от проверенных водителей в Анталье."
      : "Receive fixed-price offers from trusted local drivers in Antalya.",
    alternates: {
      canonical: `/${locale}/request`,
      languages: {
        en: "/en/request",
        ru: "/ru/request",
      },
    },
  };
}

export default async function LocalizedRequestPage({
  params,
}: PageProps<"/[locale]/request">) {
  const { locale } = await params;

  if (!isPublicRequestLocale(locale)) {
    notFound();
  }

  return <PublicRequestPage locale={locale} />;
}
