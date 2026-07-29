import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import {
  isPublicLocale,
  publicPath,
  type PublicLocale,
} from "@/lib/i18n/public";

const routePath = "/antalya-airport-to-belek";

const copy = {
  en: {
    title: "Antalya Airport to Belek Transfer",
    description:
      "Arrange a private transfer from Antalya Airport (AYT) to Belek. Compare fixed-price offers from verified local drivers and choose your vehicle.",
    eyebrow: "Antalya Airport → Belek",
    heading: "Your private transfer from Antalya Airport to Belek",
    intro:
      "Start your Belek holiday with a comfortable, pre-arranged airport pickup. Tell us about your flight and group, then compare personal offers from verified local drivers.",
    cta: "Request transfer offers",
    home: "Home",
    route: "Antalya Airport to Belek",
    distance: "Approx. 33 km",
    duration: "Usually 35–45 minutes",
    privateRide: "Private vehicle",
    flightPickup: "Flight-aware pickup",
    overviewLabel: "Route overview",
    overviewTitle: "From arrivals to your Belek hotel",
    overview:
      "Your driver collects you at Antalya Airport and takes you directly to Belek, including its resort, golf and hotel districts. Journey time varies with traffic and your exact destination.",
    benefits: [
      {
        title: "Compare fixed-price offers",
        description:
          "See each driver’s price, vehicle and personal message before choosing.",
      },
      {
        title: "Verified local drivers",
        description:
          "Driver profiles are reviewed before they can make you an offer.",
      },
      {
        title: "Space for your group",
        description:
          "Share passenger and luggage details to receive suitable vehicle offers.",
      },
    ],
    howLabel: "How Karsila works",
    howTitle: "A better welcome in three simple steps",
    steps: [
      "Enter your flight, arrival time, hotel and passenger details.",
      "Receive fixed-price offers from local Antalya transfer drivers.",
      "Compare your options and choose the welcome that suits your trip.",
    ],
    faqLabel: "Good to know",
    faqTitle: "Antalya Airport to Belek transfer questions",
    faqs: [
      {
        question: "How long is the transfer from Antalya Airport to Belek?",
        answer:
          "The drive usually takes around 35–45 minutes. Traffic, terminal pickup and your exact hotel location can affect the journey time.",
      },
      {
        question: "Is the transfer private?",
        answer:
          "Yes. Offers on Karsila are for a private vehicle for you and the passengers included in your request.",
      },
      {
        question: "Can the driver follow my flight?",
        answer:
          "Add your flight number to the request so drivers can prepare for your actual arrival time and mention their pickup arrangements in the offer.",
      },
    ],
    finalTitle: "Make your arrival in Belek effortless.",
    finalDescription:
      "Request your route once, compare local driver offers and select the transfer that feels right.",
    footer: "Private airport transfers across Antalya.",
  },
  ru: {
    title: "Трансфер из аэропорта Антальи в Белек",
    description:
      "Закажите частный трансфер из аэропорта Антальи (AYT) в Белек. Сравните предложения с фиксированной ценой от проверенных местных водителей.",
    eyebrow: "Аэропорт Антальи → Белек",
    heading: "Частный трансфер из аэропорта Антальи в Белек",
    intro:
      "Начните отдых в Белеке с комфортной встречи в аэропорту. Укажите данные рейса и количество пассажиров, получите предложения проверенных местных водителей и выберите подходящее.",
    cta: "Получить предложения",
    home: "Главная",
    route: "Аэропорт Антальи — Белек",
    distance: "Около 33 км",
    duration: "Обычно 35–45 минут",
    privateRide: "Частный автомобиль",
    flightPickup: "Встреча с учётом рейса",
    overviewLabel: "О маршруте",
    overviewTitle: "Из зоны прилёта прямо в ваш отель в Белеке",
    overview:
      "Водитель встретит вас в аэропорту Антальи и отвезёт прямо в Белек, включая курортные, гольф- и гостиничные районы. Время в пути зависит от трафика и точного адреса.",
    benefits: [
      {
        title: "Фиксированные цены",
        description:
          "Сравните цену, автомобиль и личное сообщение каждого водителя.",
      },
      {
        title: "Проверенные водители",
        description:
          "Профили водителей проверяются до отправки предложений.",
      },
      {
        title: "Место для группы и багажа",
        description:
          "Укажите пассажиров и багаж, чтобы получить предложения подходящих автомобилей.",
      },
    ],
    howLabel: "Как работает Karsila",
    howTitle: "Комфортная встреча за три простых шага",
    steps: [
      "Укажите рейс, время прилёта, отель и количество пассажиров.",
      "Получите предложения с фиксированной ценой от местных водителей.",
      "Сравните варианты и выберите подходящий трансфер.",
    ],
    faqLabel: "Полезная информация",
    faqTitle: "Вопросы о трансфере из аэропорта Антальи в Белек",
    faqs: [
      {
        question: "Сколько ехать из аэропорта Антальи в Белек?",
        answer:
          "Обычно поездка занимает около 35–45 минут. На время влияют трафик, терминал прилёта и расположение вашего отеля.",
      },
      {
        question: "Трансфер будет частным?",
        answer:
          "Да. Предложения на Karsila рассчитаны на частный автомобиль для вас и пассажиров, указанных в заявке.",
      },
      {
        question: "Водитель сможет отслеживать мой рейс?",
        answer:
          "Добавьте номер рейса в заявку, чтобы водители могли учесть фактическое время прилёта и описать встречу в своём предложении.",
      },
    ],
    finalTitle: "Начните отдых в Белеке без лишних забот.",
    finalDescription:
      "Создайте одну заявку, сравните предложения местных водителей и выберите свой трансфер.",
    footer: "Частные трансферы из аэропорта по всей Анталье.",
  },
  tr: {
    title: "Antalya Havalimanı Belek Transferi",
    description:
      "Antalya Havalimanı'ndan (AYT) Belek'e özel transfer talep edin. Doğrulanmış yerel sürücülerden sabit fiyatlı teklifleri karşılaştırın.",
    eyebrow: "Antalya Havalimanı → Belek",
    heading: "Antalya Havalimanı'ndan Belek'e özel transferiniz",
    intro:
      "Belek tatilinize konforlu ve önceden planlanmış bir karşılama ile başlayın. Uçuş ve grup bilgilerinizi paylaşın, doğrulanmış yerel sürücülerin tekliflerini karşılaştırın.",
    cta: "Transfer teklifleri al",
    home: "Ana sayfa",
    route: "Antalya Havalimanı - Belek",
    distance: "Yaklaşık 33 km",
    duration: "Genellikle 35–45 dakika",
    privateRide: "Özel araç",
    flightPickup: "Uçuş takibine göre karşılama",
    overviewLabel: "Rota özeti",
    overviewTitle: "Gelen yolcu kapısından Belek otelinize",
    overview:
      "Sürücünüz sizi Antalya Havalimanı'ndan alır ve Belek'teki tatil köyü, golf veya otel bölgenize doğrudan götürür. Yolculuk süresi trafiğe ve tam adresinize göre değişir.",
    benefits: [
      {
        title: "Sabit fiyatlı teklifleri karşılaştırın",
        description:
          "Seçmeden önce her sürücünün fiyatını, aracını ve kişisel mesajını görün.",
      },
      {
        title: "Doğrulanmış yerel sürücüler",
        description:
          "Sürücü profilleri teklif verebilmeden önce incelenir.",
      },
      {
        title: "Grubunuza uygun alan",
        description:
          "Uygun araç teklifleri için yolcu ve bagaj bilgilerinizi paylaşın.",
      },
    ],
    howLabel: "Karsila nasıl çalışır?",
    howTitle: "Üç kolay adımda daha iyi bir karşılama",
    steps: [
      "Uçuş, varış saati, otel ve yolcu bilgilerinizi girin.",
      "Yerel Antalya transfer sürücülerinden sabit fiyatlı teklifler alın.",
      "Seçenekleri karşılaştırın ve yolculuğunuza uygun karşılamayı seçin.",
    ],
    faqLabel: "Bilmeniz gerekenler",
    faqTitle: "Antalya Havalimanı Belek transferi hakkında sorular",
    faqs: [
      {
        question: "Antalya Havalimanı'ndan Belek'e transfer ne kadar sürer?",
        answer:
          "Yolculuk genellikle 35–45 dakika sürer. Trafik, terminal ve otelinizin tam konumu süreyi etkileyebilir.",
      },
      {
        question: "Transfer özel mi?",
        answer:
          "Evet. Karsila'daki teklifler, talebinizde belirttiğiniz siz ve yolcularınız için özel bir araca aittir.",
      },
      {
        question: "Sürücü uçuşumu takip edebilir mi?",
        answer:
          "Sürücülerin gerçek varış saatinize hazırlanabilmesi ve karşılama ayrıntılarını teklifinde belirtebilmesi için uçuş numaranızı ekleyin.",
      },
    ],
    finalTitle: "Belek'e varışınızı zahmetsiz hale getirin.",
    finalDescription:
      "Rotanızı bir kez paylaşın, yerel sürücü tekliflerini karşılaştırın ve size uygun transferi seçin.",
    footer: "Antalya genelinde özel havalimanı transferleri.",
  },
} satisfies Record<PublicLocale, Record<string, unknown>>;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/antalya-airport-to-belek">): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  const content = copy[locale];
  const canonical = publicPath(locale, routePath);

  return {
    title: content.title as string,
    description: content.description as string,
    alternates: {
      canonical,
      languages: {
        en: publicPath("en", routePath),
        ru: publicPath("ru", routePath),
        tr: publicPath("tr", routePath),
        "x-default": publicPath("en", routePath),
      },
    },
    openGraph: {
      title: content.title as string,
      description: content.description as string,
      url: canonical,
      type: "website",
      locale: locale === "ru" ? "ru_RU" : locale === "tr" ? "tr_TR" : "en_GB",
    },
  };
}

const benefitIcons = [BadgeCheck, ShieldCheck, Luggage];

export default async function AntalyaAirportToBelekPage({
  params,
}: PageProps<"/[locale]/antalya-airport-to-belek">) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  const content = copy[locale];
  const requestLocale = locale === "tr" ? "en" : locale;
  const requestHref = `${publicPath(requestLocale, "/request")}?pickup=Antalya%20Airport&destination=Belek`;
  const pageUrl = `https://www.karsila.app${publicPath(locale, routePath)}`;
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
      url: "https://www.karsila.app",
    },
    areaServed: [
      { "@type": "City", name: "Antalya" },
      { "@type": "City", name: "Belek" },
    ],
    serviceType: "Private airport transfer",
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
