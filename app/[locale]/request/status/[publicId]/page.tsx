import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicRequestStatusPage } from "@/components/request/PublicRequestStatusPage";
import { isPublicRequestLocale } from "@/lib/i18n/public";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/request/status/[publicId]">): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicRequestLocale(locale)) {
    return {};
  }

  return {
    title: locale === "ru" ? "Статус трансфера" : "Transfer request status",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function LocalizedRequestStatusPage({
  params,
  searchParams,
}: PageProps<"/[locale]/request/status/[publicId]">) {
  const { locale, publicId } = await params;
  const { token } = await searchParams;

  if (!isPublicRequestLocale(locale)) {
    notFound();
  }

  return (
    <PublicRequestStatusPage
      locale={locale}
      publicId={publicId}
      token={typeof token === "string" ? token : undefined}
    />
  );
}
