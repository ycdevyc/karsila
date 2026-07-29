import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Luggage,
  MapPin,
  Plane,
  ShieldCheck,
  Users,
} from "lucide-react";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { SiteHeader } from "@/components/falcon/SiteHeader";
import { publicPath, type PublicLocale } from "@/lib/i18n/public";

const siteUrl = "https://www.karsila.app";

type Benefit = {
  title: string;
  description: string;
};

type Faq = {
  question: string;
  answer: string;
};

type RelatedRoute = {
  routePath: string;
  title: string;
  description: string;
  cta: string;
};

export type AirportTransferLandingCopy = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  cta: string;
  home: string;
  route: string;
  distance: string;
  duration: string;
  privateRide: string;
  flightPickup: string;
  overviewLabel: string;
  overviewTitle: string;
  overview: string;
  benefits: [Benefit, Benefit, Benefit];
  howLabel: string;
  howTitle: string;
  steps: [string, string, string];
  faqLabel: string;
  faqTitle: string;
  faqs: [Faq, Faq, Faq];
  relatedLabel: string;
  relatedRoutes: RelatedRoute[];
  finalTitle: string;
  finalDescription: string;
  footer: string;
};

type AirportTransferLandingPageProps = {
  locale: PublicLocale;
  routePath: string;
  destination: string;
  serviceType: string;
  content: AirportTransferLandingCopy;
};

export function buildAirportTransferMetadata(
  locale: PublicLocale,
  routePath: string,
  content: AirportTransferLandingCopy,
): Metadata {
  const canonical = `${siteUrl}${publicPath(locale, routePath)}`;

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}${publicPath("en", routePath)}`,
        ru: `${siteUrl}${publicPath("ru", routePath)}`,
        tr: `${siteUrl}${publicPath("tr", routePath)}`,
        "x-default": `${siteUrl}${publicPath("en", routePath)}`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonical,
      type: "website",
      siteName: "Karsila",
      locale: locale === "ru" ? "ru_RU" : locale === "tr" ? "tr_TR" : "en_GB",
    },
  };
}

const benefitIcons = [BadgeCheck, ShieldCheck, Luggage];

export function AirportTransferLandingPage({
  locale,
  routePath,
  destination,
  serviceType,
  content,
}: AirportTransferLandingPageProps) {
  const requestLocale = locale === "tr" ? "en" : locale;
  const requestHref = `${publicPath(requestLocale, "/request")}?pickup=Antalya%20Airport&destination=${encodeURIComponent(destination)}`;
  const pageUrl = `${siteUrl}${publicPath(locale, routePath)}`;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.title,
    description: content.description,
    url: pageUrl,
    provider: {
      "@type": "Organization",
      name: "Karsila",
      url: siteUrl,
    },
    areaServed: [
      { "@type": "City", name: "Antalya" },
      { "@type": "Place", name: destination },
    ],
    serviceType,
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader locale={locale} />

      <section className="relative bg-[#09233b] px-5 py-16 text-white sm:px-6 md:py-24 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(235,198,119,0.22),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(51,177,188,0.2),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/60">
            <Link href={publicPath(locale)} className="transition hover:text-white">
              {content.home}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{content.route}</span>
          </nav>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                {content.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl lg:text-7xl">
                {content.heading}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                {content.intro}
              </p>
              <Link
                href={requestHref}
                className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-amber-200 px-7 py-4 text-sm font-bold text-[#10283e] transition hover:-translate-y-1 hover:bg-amber-100"
              >
                {content.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [MapPin, content.distance],
                [Clock3, content.duration],
                [Users, content.privateRide],
                [Plane, content.flightPickup],
              ].map(([Icon, label]) => (
                <div
                  key={label as string}
                  className="rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-amber-200" />
                  <p className="mt-3 text-sm font-bold">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="falcon-section-label">{content.overviewLabel}</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
                {content.overviewTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {content.overview}
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {content.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <article
                  key={benefit.title}
                  className="rounded-[2rem] border border-border/65 bg-card/85 p-7 shadow-[var(--falcon-shadow-sm)]"
                >
                  <div className="falcon-icon-tile-light">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-8 text-xl font-extrabold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#09233b] px-5 py-20 text-white sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
            {content.howLabel}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
            {content.howTitle}
          </h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {content.steps.map((step, index) => (
              <li
                key={step}
                className="rounded-[2rem] border border-white/12 bg-white/7 p-7"
              >
                <span className="text-sm font-extrabold text-amber-200">
                  0{index + 1}
                </span>
                <p className="mt-8 text-base font-bold leading-7">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="falcon-section-label">{content.faqLabel}</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
            {content.faqTitle}
          </h2>
          <div className="mt-10 divide-y divide-border rounded-[2rem] border border-border/65 bg-card/85 px-6 sm:px-9">
            {content.faqs.map((faq) => (
              <article key={faq.question} className="py-7">
                <h3 className="text-lg font-extrabold">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="falcon-section-label">{content.relatedLabel}</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {content.relatedRoutes.map((relatedRoute) => (
              <article
                key={relatedRoute.routePath}
                className="flex flex-col rounded-[2rem] border border-border/65 bg-card/85 p-7 shadow-[var(--falcon-shadow-sm)] sm:p-9"
              >
                <h2 className="text-2xl font-extrabold tracking-[-0.035em]">
                  {relatedRoute.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                  {relatedRoute.description}
                </p>
                <Link
                  href={publicPath(locale, relatedRoute.routePath)}
                  className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-2xl border border-border px-5 py-3 text-sm font-bold transition hover:border-foreground/30"
                >
                  {relatedRoute.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.25rem] bg-[#0b2944] px-6 py-14 text-white shadow-[var(--falcon-shadow-lg)] sm:px-10 lg:px-16">
          <h2 className="max-w-3xl text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
            {content.finalTitle}
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-white/68">
            {content.finalDescription}
          </p>
          <Link
            href={requestHref}
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-amber-200 px-7 py-4 text-sm font-bold text-[#10283e] transition hover:bg-amber-100"
          >
            {content.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/65 px-5 py-9 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 text-sm text-muted-foreground">
          <div>
            <KarsilaLogo />
            <p className="mt-1 text-xs">{content.footer}</p>
          </div>
          <p className="text-xs">© 2026 Karsila</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceJsonLd, faqJsonLd]).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
