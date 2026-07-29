import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AirportTransferLandingPage,
  buildAirportTransferMetadata,
  type AirportTransferLandingCopy,
} from "@/components/falcon/AirportTransferLandingPage";
import {
  isPublicLocale,
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
    relatedLabel: "Explore another route",
    relatedRoutes: [
      {
        routePath: "/antalya-airport-to-lara",
        title: "Staying closer to Antalya in Lara?",
        description:
          "See transfer details for Lara’s beachfront hotels and neighbourhoods, a shorter journey west from the airport.",
        cta: "View the Lara route",
      },
      {
        routePath: "/antalya-airport-to-side",
        title: "Continuing east to historic Side?",
        description:
          "Plan the longer coastal journey to Side’s old town, beachfront hotels and nearby resort areas.",
        cta: "View the Side route",
      },
      {
        routePath: "/antalya-airport-to-kemer",
        title: "Heading west towards the mountains in Kemer?",
        description:
          "Explore the route around Antalya to Kemer’s marina, beaches and surrounding resort villages.",
        cta: "View the Kemer route",
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
    relatedLabel: "Другой маршрут",
    relatedRoutes: [
      {
        routePath: "/antalya-airport-to-lara",
        title: "Ваш отель находится в Ларе?",
        description:
          "Узнайте подробнее о трансфере к пляжным отелям и районам Лары — это более короткий путь от аэропорта.",
        cta: "Посмотреть маршрут в Лару",
      },
      {
        routePath: "/antalya-airport-to-side",
        title: "Едете дальше на восток, в Сиде?",
        description:
          "Спланируйте более длинную поездку к старому городу, пляжным отелям и курортным районам Сиде.",
        cta: "Посмотреть маршрут в Сиде",
      },
      {
        routePath: "/antalya-airport-to-kemer",
        title: "Направляетесь на запад, к горам Кемера?",
        description:
          "Узнайте о маршруте к яхтенной гавани, пляжам и курортным посёлкам в окрестностях Кемера.",
        cta: "Посмотреть маршрут в Кемер",
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
    relatedLabel: "Başka bir rotayı keşfedin",
    relatedRoutes: [
      {
        routePath: "/antalya-airport-to-lara",
        title: "Antalya'ya daha yakın Lara'da mı kalıyorsunuz?",
        description:
          "Havalimanından daha kısa bir yolculukla Lara'nın sahil otellerine ve mahallelerine ulaşım ayrıntılarını inceleyin.",
        cta: "Lara rotasını görüntüle",
      },
      {
        routePath: "/antalya-airport-to-side",
        title: "Doğuya, tarihi Side'ye mi devam ediyorsunuz?",
        description:
          "Side'nin antik merkezi, sahil otelleri ve çevredeki tatil bölgelerine uzanan rotayı planlayın.",
        cta: "Side rotasını görüntüle",
      },
      {
        routePath: "/antalya-airport-to-kemer",
        title: "Batıya, Kemer'in dağlarına doğru mu gidiyorsunuz?",
        description:
          "Antalya çevresinden Kemer'in marinası, plajları ve çevre tatil beldelerine uzanan rotayı inceleyin.",
        cta: "Kemer rotasını görüntüle",
      },
    ],
    finalTitle: "Belek'e varışınızı zahmetsiz hale getirin.",
    finalDescription:
      "Rotanızı bir kez paylaşın, yerel sürücü tekliflerini karşılaştırın ve size uygun transferi seçin.",
    footer: "Antalya genelinde özel havalimanı transferleri.",
  },
} satisfies Record<PublicLocale, AirportTransferLandingCopy>;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/antalya-airport-to-belek">): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return buildAirportTransferMetadata(locale, routePath, copy[locale]);
}

export default async function AntalyaAirportToBelekPage({
  params,
}: PageProps<"/[locale]/antalya-airport-to-belek">) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return (
    <AirportTransferLandingPage
      locale={locale}
      routePath={routePath}
      destination="Belek"
      serviceType="Private airport transfer from Antalya Airport to Belek"
      content={copy[locale]}
    />
  );
}
