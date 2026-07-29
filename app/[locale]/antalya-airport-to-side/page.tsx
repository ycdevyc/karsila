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

const routePath = "/antalya-airport-to-side";

const copy = {
  en: {
    title: "Antalya Airport to Side Transfer | Private Driver Offers",
    description:
      "Arrange a private transfer from Antalya Airport (AYT) to Side. Compare fixed-price offers from verified drivers for Side hotels and resort areas.",
    eyebrow: "Antalya Airport → Side",
    heading: "Your private transfer from Antalya Airport to Side",
    intro:
      "Travel east from Antalya Airport to Side with a pickup planned around your arrival. Share your hotel or resort area, compare clear offers from local drivers and choose the vehicle that fits your party.",
    cta: "Compare Side transfer offers",
    home: "Home",
    route: "Antalya Airport to Side",
    distance: "Approx. 65–70 km",
    duration: "Usually 60–75 minutes",
    privateRide: "Direct private journey",
    flightPickup: "Arrival-aware pickup",
    overviewLabel: "The road to Side",
    overviewTitle: "A direct ride to your place on the Manavgat coast",
    overview:
      "The airport route follows the coastal road east towards Side. Your exact journey depends on whether you are staying near the ancient town, around Sorgun, or in the hotel areas west of Side such as Kumköy and Evrenseki. A private transfer avoids shared-coach stops along the way.",
    benefits: [
      {
        title: "Compare the complete journey price",
        description:
          "Review fixed-price offers for the full airport-to-Side route before selecting a driver.",
      },
      {
        title: "Your exact hotel matters",
        description:
          "Add the property name so drivers can plan for the correct Side or Manavgat resort area.",
      },
      {
        title: "Comfort for a longer transfer",
        description:
          "Share passenger, luggage and child-seat needs to receive offers from suitable vehicles.",
      },
    ],
    howLabel: "Plan before landing",
    howTitle: "Three steps from your flight to the Side coast",
    steps: [
      "Enter your flight, arrival time and exact hotel or accommodation in Side.",
      "Compare each driver’s fixed price, vehicle information and pickup plan.",
      "Choose your preferred offer and travel directly from the terminal to your stay.",
    ],
    faqLabel: "Route essentials",
    faqTitle: "Antalya Airport to Side transfer questions",
    faqs: [
      {
        question: "How long is the transfer from Antalya Airport to Side?",
        answer:
          "The journey usually takes around 60–75 minutes. Traffic and your exact hotel area can make the trip shorter or longer.",
      },
      {
        question: "How far is Side from Antalya Airport?",
        answer:
          "Side is approximately 65–70 km from Antalya Airport. Hotels around Kumköy or Evrenseki are reached before central Side, while Sorgun and addresses further east take longer.",
      },
      {
        question: "Will the driver take me directly to my hotel?",
        answer:
          "Yes. Karsila offers are for a private transfer to the accommodation in your request, without scheduled stops for other travellers.",
      },
    ],
    relatedLabel: "Compare Antalya coast routes",
    relatedRoutes: [
      {
        routePath: "/antalya-airport-to-belek",
        title: "Is your resort in Belek?",
        description:
          "See the shorter eastbound transfer to Belek’s golf resorts, hotels and accommodation districts.",
        cta: "View the Belek route",
      },
      {
        routePath: "/antalya-airport-to-lara",
        title: "Staying close to the airport in Lara?",
        description:
          "Explore the quick route to Lara’s city-side addresses, beach hotels and Kundu hotel zone.",
        cta: "View the Lara route",
      },
    ],
    finalTitle: "Start your time in Side with the long drive already arranged.",
    finalDescription:
      "Send one request, compare local fixed-price offers and select the driver and vehicle for your coast-bound journey.",
    footer: "Private airport transfers across Antalya.",
  },
  ru: {
    title: "Трансфер из аэропорта Антальи в Сиде | Частный водитель",
    description:
      "Закажите частный трансфер из аэропорта Антальи (AYT) в Сиде. Сравните фиксированные цены проверенных водителей до отелей и курортных районов.",
    eyebrow: "Аэропорт Антальи → Сиде",
    heading: "Частный трансфер из аэропорта Антальи в Сиде",
    intro:
      "Отправляйтесь из аэропорта Антальи на восток, в Сиде, с заранее продуманной встречей. Укажите отель или курортный район, сравните предложения местных водителей и выберите подходящий автомобиль.",
    cta: "Сравнить предложения в Сиде",
    home: "Главная",
    route: "Аэропорт Антальи — Сиде",
    distance: "Примерно 65–70 км",
    duration: "Обычно 60–75 минут",
    privateRide: "Прямая частная поездка",
    flightPickup: "Встреча с учётом прилёта",
    overviewLabel: "Дорога в Сиде",
    overviewTitle: "Прямо к месту проживания на побережье Манавгата",
    overview:
      "Маршрут проходит на восток по прибрежной дороге. Точное время зависит от того, остановились ли вы у античного центра, в районе Соргун или в гостиничных зонах западнее Сиде, например Кумкёй и Эвренсеки. Частный трансфер едет без остановок общего автобуса.",
    benefits: [
      {
        title: "Полная цена поездки заранее",
        description:
          "Сравните фиксированную стоимость всего маршрута из аэропорта в Сиде до выбора водителя.",
      },
      {
        title: "Учитывается точный отель",
        description:
          "Добавьте название отеля, чтобы водитель подготовил маршрут в нужный район Сиде или Манавгата.",
      },
      {
        title: "Комфорт в дальней дороге",
        description:
          "Укажите пассажиров, багаж и детские кресла, чтобы получить предложения подходящих машин.",
      },
    ],
    howLabel: "План до прилёта",
    howTitle: "Три шага от вашего рейса до побережья Сиде",
    steps: [
      "Укажите рейс, время прилёта и точный отель или адрес проживания в Сиде.",
      "Сравните фиксированную цену, автомобиль и план встречи каждого водителя.",
      "Выберите предложение и отправляйтесь из терминала прямо к месту проживания.",
    ],
    faqLabel: "Главное о маршруте",
    faqTitle: "Вопросы о трансфере из аэропорта Антальи в Сиде",
    faqs: [
      {
        question: "Сколько ехать из аэропорта Антальи в Сиде?",
        answer:
          "Обычно поездка занимает около 60–75 минут. Трафик и расположение вашего отеля могут сократить или увеличить время в пути.",
      },
      {
        question: "Как далеко Сиде от аэропорта Антальи?",
        answer:
          "Расстояние составляет примерно 65–70 км. Отели Кумкёя и Эвренсеки находятся по пути раньше центра Сиде, а Соргун и адреса восточнее требуют больше времени.",
      },
      {
        question: "Водитель отвезёт меня прямо в отель?",
        answer:
          "Да. Предложения Karsila относятся к частному трансферу до адреса из вашей заявки, без запланированных остановок для других пассажиров.",
      },
    ],
    relatedLabel: "Сравните маршруты по побережью Антальи",
    relatedRoutes: [
      {
        routePath: "/antalya-airport-to-belek",
        title: "Ваш курорт находится в Белеке?",
        description:
          "Посмотрите более короткий маршрут на восток к гольф-курортам, отелям и районам Белека.",
        cta: "Посмотреть маршрут в Белек",
      },
      {
        routePath: "/antalya-airport-to-lara",
        title: "Вы остановились рядом с аэропортом, в Ларе?",
        description:
          "Узнайте о коротком пути к городским адресам Лары, пляжным отелям и гостиничной зоне Кунду.",
        cta: "Посмотреть маршрут в Лару",
      },
    ],
    finalTitle: "Начните отдых в Сиде, заранее организовав долгую дорогу.",
    finalDescription:
      "Создайте одну заявку, сравните фиксированные цены местных водителей и выберите автомобиль для поездки к побережью.",
    footer: "Частные трансферы из аэропорта по всей Анталье.",
  },
  tr: {
    title: "Antalya Havalimanı Side Transferi | Özel Sürücü Teklifleri",
    description:
      "Antalya Havalimanı'ndan (AYT) Side'ye özel transfer ayarlayın. Side otelleri ve tatil bölgeleri için doğrulanmış sürücü fiyatlarını karşılaştırın.",
    eyebrow: "Antalya Havalimanı → Side",
    heading: "Antalya Havalimanı'ndan Side'ye özel transferiniz",
    intro:
      "Antalya Havalimanı'ndan doğuya, Side'ye doğru uçuşunuza göre planlanmış bir karşılamayla yola çıkın. Otelinizi veya tatil bölgenizi paylaşın, yerel sürücü tekliflerini karşılaştırın ve grubunuza uygun aracı seçin.",
    cta: "Side transfer tekliflerini karşılaştır",
    home: "Ana sayfa",
    route: "Antalya Havalimanı - Side",
    distance: "Yaklaşık 65–70 km",
    duration: "Genellikle 60–75 dakika",
    privateRide: "Doğrudan özel yolculuk",
    flightPickup: "Varışa göre karşılama",
    overviewLabel: "Side yolu",
    overviewTitle: "Manavgat sahilindeki adresinize doğrudan ulaşım",
    overview:
      "Havalimanı rotası sahil yolunu izleyerek doğuya, Side yönüne uzanır. Yolculuk; antik kent yakınında, Sorgun'da veya Side'nin batısındaki Kumköy ve Evrenseki gibi otel bölgelerinde kalmanıza göre değişir. Özel transferde ortak servis durakları bulunmaz.",
    benefits: [
      {
        title: "Tüm yolculuğun fiyatını karşılaştırın",
        description:
          "Sürücü seçmeden önce havalimanından Side'ye kadar olan sabit fiyatlı teklifleri inceleyin.",
      },
      {
        title: "Tam oteliniz dikkate alınır",
        description:
          "Sürücülerin doğru Side veya Manavgat tatil bölgesine hazırlanması için tesis adını ekleyin.",
      },
      {
        title: "Uzun transfer için konfor",
        description:
          "Uygun araç teklifleri için yolcu, bagaj ve çocuk koltuğu ihtiyaçlarınızı paylaşın.",
      },
    ],
    howLabel: "İnmeden önce planlayın",
    howTitle: "Uçuşunuzdan Side sahiline üç adım",
    steps: [
      "Uçuşunuzu, varış saatinizi ve Side'deki otelinizin tam adını veya adresini girin.",
      "Her sürücünün sabit fiyatını, araç bilgisini ve karşılama planını karşılaştırın.",
      "Tercih ettiğiniz teklifi seçin ve terminalden konaklama yerinize doğrudan gidin.",
    ],
    faqLabel: "Rota bilgileri",
    faqTitle: "Antalya Havalimanı Side transferi hakkında sorular",
    faqs: [
      {
        question: "Antalya Havalimanı'ndan Side'ye transfer ne kadar sürer?",
        answer:
          "Yolculuk genellikle 60–75 dakika sürer. Trafik ve otelinizin tam bölgesi süreyi kısaltabilir veya uzatabilir.",
      },
      {
        question: "Side, Antalya Havalimanı'na ne kadar uzak?",
        answer:
          "Side, Antalya Havalimanı'na yaklaşık 65–70 km uzaklıktadır. Kumköy ve Evrenseki otellerine merkezden önce ulaşılır; Sorgun ve daha doğudaki adresler ise daha uzun sürer.",
      },
      {
        question: "Sürücü beni doğrudan otelime götürür mü?",
        answer:
          "Evet. Karsila teklifleri, diğer yolcular için planlı duraklar olmadan talebinizdeki konaklama adresine özel transfer içindir.",
      },
    ],
    relatedLabel: "Antalya sahil rotalarını karşılaştırın",
    relatedRoutes: [
      {
        routePath: "/antalya-airport-to-belek",
        title: "Tatil yeriniz Belek'te mi?",
        description:
          "Belek'in golf tesisleri, otelleri ve konaklama bölgelerine uzanan daha kısa doğu rotasını inceleyin.",
        cta: "Belek rotasını görüntüle",
      },
      {
        routePath: "/antalya-airport-to-lara",
        title: "Havalimanına yakın Lara'da mı kalıyorsunuz?",
        description:
          "Lara'nın şehir tarafındaki adresleri, sahil otelleri ve Kundu oteller bölgesine giden kısa rotayı keşfedin.",
        cta: "Lara rotasını görüntüle",
      },
    ],
    finalTitle: "Side tatilinize uzun yolculuğu önceden planlayarak başlayın.",
    finalDescription:
      "Tek bir talep oluşturun, yerel sabit fiyatlı teklifleri karşılaştırın ve sahil yolculuğunuz için aracınızı seçin.",
    footer: "Antalya genelinde özel havalimanı transferleri.",
  },
} satisfies Record<PublicLocale, AirportTransferLandingCopy>;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/antalya-airport-to-side">): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return buildAirportTransferMetadata(locale, routePath, copy[locale]);
}

export default async function AntalyaAirportToSidePage({
  params,
}: PageProps<"/[locale]/antalya-airport-to-side">) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return (
    <AirportTransferLandingPage
      locale={locale}
      routePath={routePath}
      destination="Side"
      serviceType="Private airport transfer from Antalya Airport to Side"
      content={copy[locale]}
    />
  );
}
