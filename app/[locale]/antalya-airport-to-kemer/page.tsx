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

const routePath = "/antalya-airport-to-kemer";

const copy = {
  en: {
    title: "Antalya Airport to Kemer Transfer | Private Driver Offers",
    description:
      "Arrange a private Antalya Airport (AYT) to Kemer transfer. Compare fixed-price offers from verified drivers for Kemer and nearby coastal resorts.",
    eyebrow: "Antalya Airport → Kemer",
    heading: "A private transfer from Antalya Airport to Kemer",
    intro:
      "Leave the airport with your westbound journey already planned. Share your Kemer hotel or resort village, compare offers from verified local drivers and choose a direct ride towards the Taurus Mountains and Mediterranean coast.",
    cta: "Compare Kemer transfer offers",
    home: "Home",
    route: "Antalya Airport to Kemer",
    distance: "Approx. 58–60 km",
    duration: "Usually 60–75 minutes",
    privateRide: "Private coast-bound ride",
    flightPickup: "Pickup planned for your arrival",
    overviewLabel: "The route west",
    overviewTitle: "Across Antalya to Kemer’s mountain-backed coast",
    overview:
      "The drive heads west around Antalya before following the coastal road towards Kemer. Beldibi and Göynük are reached before Kemer centre, while Kiriş, Çamyuva and Tekirova lie further south. Your hotel location and city traffic determine the final journey time.",
    benefits: [
      {
        title: "Know the full route price",
        description:
          "Compare fixed-price offers for the airport pickup and complete journey to your accommodation.",
      },
      {
        title: "Matched to the right resort",
        description:
          "Include your exact hotel so drivers can distinguish Kemer centre from the surrounding coastal villages.",
      },
      {
        title: "Choose comfort for your group",
        description:
          "Add luggage, passenger and child-seat details to receive offers from suitable vehicles.",
      },
    ],
    howLabel: "Organise your arrival",
    howTitle: "From flight details to your Kemer hotel in three steps",
    steps: [
      "Enter your flight, arrival time and the exact name or address of your Kemer accommodation.",
      "Review each driver’s fixed price, vehicle details and proposed meeting arrangement.",
      "Choose the offer that suits you and travel directly west from the airport.",
    ],
    faqLabel: "Before you travel",
    faqTitle: "Antalya Airport to Kemer transfer questions",
    faqs: [
      {
        question: "How long is the transfer from Antalya Airport to Kemer?",
        answer:
          "The drive to Kemer centre usually takes about 60–75 minutes. Antalya traffic and hotels further south of Kemer can add time to the journey.",
      },
      {
        question: "How far is Kemer from Antalya Airport?",
        answer:
          "Kemer centre is roughly 58–60 km from Antalya Airport. Beldibi and Göynük are closer, while Kiriş, Çamyuva and Tekirova are further along the coast.",
      },
      {
        question: "Is this a shared shuttle or a private transfer?",
        answer:
          "Offers on Karsila are for a private vehicle to the accommodation in your request, without scheduled hotel stops for other groups.",
      },
    ],
    relatedLabel: "Compare other Antalya transfer routes",
    relatedRoutes: [
      {
        routePath: "/antalya-airport-to-lara",
        title: "Staying near the airport in Lara?",
        description:
          "See the much shorter route to Lara’s neighbourhoods, beach properties and Kundu hotel zone.",
        cta: "View the Lara route",
      },
      {
        routePath: "/antalya-airport-to-belek",
        title: "Is your resort east of Antalya in Belek?",
        description:
          "Explore the transfer to Belek’s golf hotels, resort complexes and accommodation districts.",
        cta: "View the Belek route",
      },
      {
        routePath: "/antalya-airport-to-side",
        title: "Continuing further east to Side?",
        description:
          "Plan the longer coastal journey to Side’s ancient centre and the hotel areas around Manavgat.",
        cta: "View the Side route",
      },
    ],
    finalTitle: "Arrive ready for Kemer, with the westbound ride considered.",
    finalDescription:
      "Share your journey once, compare clear local offers and select the driver and vehicle for your trip to the coast.",
    footer: "Private airport transfers across Antalya.",
  },
  ru: {
    title: "Трансфер из аэропорта Антальи в Кемер | Частный водитель",
    description:
      "Закажите частный трансфер из аэропорта Антальи (AYT) в Кемер. Сравните фиксированные цены проверенных водителей до Кемера и соседних курортов.",
    eyebrow: "Аэропорт Антальи → Кемер",
    heading: "Частный трансфер из аэропорта Антальи в Кемер",
    intro:
      "Начните поездку на запад с заранее продуманной встречи. Укажите отель в Кемере или курортный посёлок, сравните предложения проверенных местных водителей и выберите прямой трансфер к Таврским горам и Средиземному морю.",
    cta: "Сравнить предложения в Кемер",
    home: "Главная",
    route: "Аэропорт Антальи — Кемер",
    distance: "Примерно 58–60 км",
    duration: "Обычно 60–75 минут",
    privateRide: "Частная поездка к побережью",
    flightPickup: "Встреча к вашему прилёту",
    overviewLabel: "Маршрут на запад",
    overviewTitle: "Через Анталью к горному побережью Кемера",
    overview:
      "Дорога огибает Анталью с запада и продолжается вдоль моря в сторону Кемера. Бельдиби и Гёйнюк находятся до центра Кемера, а Кириш, Чамьюва и Текирова — южнее. Итоговое время зависит от расположения отеля и городского трафика.",
    benefits: [
      {
        title: "Полная цена маршрута",
        description:
          "Сравните фиксированные цены за встречу в аэропорту и всю поездку до места проживания.",
      },
      {
        title: "Точно до вашего курорта",
        description:
          "Укажите отель, чтобы водитель отличил центр Кемера от соседних прибрежных посёлков.",
      },
      {
        title: "Комфорт для вашей группы",
        description:
          "Добавьте багаж, число пассажиров и детские кресла для предложений подходящих автомобилей.",
      },
    ],
    howLabel: "Организуйте прибытие",
    howTitle: "От данных рейса до отеля в Кемере за три шага",
    steps: [
      "Укажите рейс, время прилёта и точное название или адрес места проживания в Кемере.",
      "Сравните фиксированную цену, автомобиль и предложенный план встречи каждого водителя.",
      "Выберите подходящий вариант и отправляйтесь из аэропорта прямо на запад.",
    ],
    faqLabel: "До поездки",
    faqTitle: "Вопросы о трансфере из аэропорта Антальи в Кемер",
    faqs: [
      {
        question: "Сколько ехать из аэропорта Антальи в Кемер?",
        answer:
          "Дорога до центра Кемера обычно занимает около 60–75 минут. Трафик в Анталье и расположение отеля южнее Кемера могут увеличить время.",
      },
      {
        question: "Как далеко Кемер от аэропорта Антальи?",
        answer:
          "Центр Кемера находится примерно в 58–60 км от аэропорта. Бельдиби и Гёйнюк ближе, а Кириш, Чамьюва и Текирова расположены дальше по побережью.",
      },
      {
        question: "Это общий шаттл или частный трансфер?",
        answer:
          "Предложения Karsila рассчитаны на частный автомобиль до адреса из заявки, без запланированных заездов в отели других пассажиров.",
      },
    ],
    relatedLabel: "Сравните другие маршруты из аэропорта Антальи",
    relatedRoutes: [
      {
        routePath: "/antalya-airport-to-lara",
        title: "Вы остановились рядом с аэропортом, в Ларе?",
        description:
          "Посмотрите значительно более короткий маршрут к районам Лары, пляжным объектам и гостиничной зоне Кунду.",
        cta: "Посмотреть маршрут в Лару",
      },
      {
        routePath: "/antalya-airport-to-belek",
        title: "Ваш курорт находится восточнее Антальи, в Белеке?",
        description:
          "Узнайте о трансфере к гольф-отелям, курортным комплексам и районам проживания Белека.",
        cta: "Посмотреть маршрут в Белек",
      },
      {
        routePath: "/antalya-airport-to-side",
        title: "Вы едете ещё дальше на восток, в Сиде?",
        description:
          "Спланируйте более длинную поездку к античному центру Сиде и гостиничным районам Манавгата.",
        cta: "Посмотреть маршрут в Сиде",
      },
    ],
    finalTitle: "Прилетайте с понятным планом поездки на запад, в Кемер.",
    finalDescription:
      "Один раз укажите детали, сравните предложения местных водителей и выберите автомобиль для дороги к побережью.",
    footer: "Частные трансферы из аэропорта по всей Анталье.",
  },
  tr: {
    title: "Antalya Havalimanı Kemer Transferi | Özel Sürücü Teklifleri",
    description:
      "Antalya Havalimanı'ndan (AYT) Kemer'e özel transfer ayarlayın. Kemer ve çevre sahil beldeleri için doğrulanmış sürücü fiyatlarını karşılaştırın.",
    eyebrow: "Antalya Havalimanı → Kemer",
    heading: "Antalya Havalimanı'ndan Kemer'e özel transfer",
    intro:
      "Batı yönündeki yolculuğunuza, karşılamanız önceden planlanmış olarak başlayın. Kemer'deki otelinizi veya tatil beldenizi paylaşın, doğrulanmış yerel sürücü tekliflerini karşılaştırın ve Toros Dağları ile Akdeniz kıyısına doğrudan ulaşımınızı seçin.",
    cta: "Kemer transfer tekliflerini karşılaştır",
    home: "Ana sayfa",
    route: "Antalya Havalimanı - Kemer",
    distance: "Yaklaşık 58–60 km",
    duration: "Genellikle 60–75 dakika",
    privateRide: "Sahile özel yolculuk",
    flightPickup: "Varışınıza göre planlanan karşılama",
    overviewLabel: "Batı rotası",
    overviewTitle: "Antalya'yı geçerek Kemer'in dağ manzaralı kıyılarına",
    overview:
      "Yol, Antalya'nın çevresinden batıya ilerledikten sonra Kemer yönündeki sahil rotasını izler. Beldibi ve Göynük, Kemer merkezden önce; Kiriş, Çamyuva ve Tekirova ise daha güneyde yer alır. Otelinizin konumu ve şehir trafiği toplam süreyi belirler.",
    benefits: [
      {
        title: "Tüm rota fiyatını bilin",
        description:
          "Havalimanı karşılaması ve konaklama yerinize kadar tüm yolculuk için sabit fiyatları karşılaştırın.",
      },
      {
        title: "Doğru tatil beldesine ulaşın",
        description:
          "Sürücülerin Kemer merkez ile çevredeki sahil beldelerini ayırt edebilmesi için otelinizi ekleyin.",
      },
      {
        title: "Grubunuza uygun konfor",
        description:
          "Uygun araç teklifleri için bagaj, yolcu ve çocuk koltuğu ayrıntılarını paylaşın.",
      },
    ],
    howLabel: "Varışınızı düzenleyin",
    howTitle: "Uçuş bilgilerinden Kemer otelinize üç adım",
    steps: [
      "Uçuşunuzu, varış saatinizi ve Kemer'deki konaklama yerinizin tam adını veya adresini girin.",
      "Her sürücünün sabit fiyatını, araç bilgilerini ve önerdiği buluşma düzenini inceleyin.",
      "Size uygun teklifi seçin ve havalimanından batıya doğrudan yolculuk edin.",
    ],
    faqLabel: "Yolculuk öncesi",
    faqTitle: "Antalya Havalimanı Kemer transferi hakkında sorular",
    faqs: [
      {
        question: "Antalya Havalimanı'ndan Kemer'e transfer ne kadar sürer?",
        answer:
          "Kemer merkeze yolculuk genellikle 60–75 dakika sürer. Antalya trafiği ve Kemer'in güneyindeki oteller süreyi uzatabilir.",
      },
      {
        question: "Kemer, Antalya Havalimanı'na ne kadar uzak?",
        answer:
          "Kemer merkez, Antalya Havalimanı'na yaklaşık 58–60 km uzaklıktadır. Beldibi ve Göynük daha yakın; Kiriş, Çamyuva ve Tekirova ise sahilin ilerisindedir.",
      },
      {
        question: "Bu ortak servis mi, özel transfer mi?",
        answer:
          "Karsila teklifleri, başka grupların otellerinde planlı duraklar olmadan talebinizdeki konaklama adresine özel araç içindir.",
      },
    ],
    relatedLabel: "Diğer Antalya transfer rotalarını karşılaştırın",
    relatedRoutes: [
      {
        routePath: "/antalya-airport-to-lara",
        title: "Havalimanına yakın Lara'da mı kalıyorsunuz?",
        description:
          "Lara'nın mahalleleri, sahil tesisleri ve Kundu oteller bölgesine giden çok daha kısa rotayı inceleyin.",
        cta: "Lara rotasını görüntüle",
      },
      {
        routePath: "/antalya-airport-to-belek",
        title: "Tatil yeriniz Antalya'nın doğusundaki Belek mi?",
        description:
          "Belek'in golf otelleri, tatil tesisleri ve konaklama bölgelerine ulaşım rotasını keşfedin.",
        cta: "Belek rotasını görüntüle",
      },
      {
        routePath: "/antalya-airport-to-side",
        title: "Doğuya, Side'ye kadar mı devam ediyorsunuz?",
        description:
          "Side'nin antik merkezi ve Manavgat çevresindeki otel bölgelerine uzanan uzun sahil yolculuğunu planlayın.",
        cta: "Side rotasını görüntüle",
      },
    ],
    finalTitle: "Kemer'e giden batı yolculuğunuzu planlamış olarak varın.",
    finalDescription:
      "Seyahat bilgilerinizi bir kez paylaşın, açık yerel teklifleri karşılaştırın ve sahil yolculuğunuz için sürücünüzü seçin.",
    footer: "Antalya genelinde özel havalimanı transferleri.",
  },
} satisfies Record<PublicLocale, AirportTransferLandingCopy>;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/antalya-airport-to-kemer">): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return buildAirportTransferMetadata(locale, routePath, copy[locale]);
}

export default async function AntalyaAirportToKemerPage({
  params,
}: PageProps<"/[locale]/antalya-airport-to-kemer">) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return (
    <AirportTransferLandingPage
      locale={locale}
      routePath={routePath}
      destination="Kemer"
      serviceType="Private airport transfer from Antalya Airport to Kemer"
      content={copy[locale]}
    />
  );
}
