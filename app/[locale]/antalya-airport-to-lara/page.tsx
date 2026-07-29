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

const routePath = "/antalya-airport-to-lara";

const copy = {
  en: {
    title: "Antalya Airport to Lara Transfer | Private Driver Offers",
    description:
      "Plan a private Antalya Airport (AYT) to Lara transfer. Compare fixed-price offers from verified local drivers for Lara hotels and neighbourhoods.",
    eyebrow: "Antalya Airport → Lara",
    heading: "A smooth private transfer from Antalya Airport to Lara",
    intro:
      "Lara is one of Antalya Airport’s closest coastal destinations. Arrange your pickup before landing, share where you are staying and compare driver offers for a direct ride to your hotel, apartment or resort.",
    cta: "Compare Lara transfer offers",
    home: "Home",
    route: "Antalya Airport to Lara",
    distance: "Approx. 10–18 km",
    duration: "Usually 20–35 minutes",
    privateRide: "Door-to-door ride",
    flightPickup: "Pickup planned around your flight",
    overviewLabel: "Your Lara arrival",
    overviewTitle: "From the terminal to the coast without a detour",
    overview:
      "Lara stretches from residential streets near central Antalya to the hotel zone towards Kundu, so driving time depends on your exact address. A private transfer takes you straight from the airport to your accommodation without shared shuttle stops.",
    benefits: [
      {
        title: "Choose with the full price visible",
        description:
          "Compare fixed-price offers before you travel instead of negotiating after landing.",
      },
      {
        title: "A pickup matched to your stay",
        description:
          "Drivers can see whether you need Lara Beach, a city-side address or the hotel district.",
      },
      {
        title: "The right vehicle after your flight",
        description:
          "Include child seats, suitcases and group size so drivers can offer a suitable vehicle.",
      },
    ],
    howLabel: "Arrange your ride",
    howTitle: "Your Lara pickup, organised before arrival",
    steps: [
      "Add your flight details and the name or address of your Lara accommodation.",
      "Review offers with the driver’s price, vehicle details and pickup message.",
      "Select the option you prefer and arrive knowing who will meet you.",
    ],
    faqLabel: "Planning your transfer",
    faqTitle: "Questions about travelling from Antalya Airport to Lara",
    faqs: [
      {
        question: "How far is Lara from Antalya Airport?",
        answer:
          "The distance is roughly 10–18 km depending on where you stay. Addresses near Lara’s western side are closer, while hotels towards Kundu require a longer drive.",
      },
      {
        question: "How long does an airport transfer to Lara take?",
        answer:
          "Most journeys take about 20–35 minutes. Traffic, your arrival terminal and the location of your accommodation can change the travel time.",
      },
      {
        question: "Can I request a child seat or extra luggage space?",
        answer:
          "Yes. Add these needs to your request so drivers can respond with a vehicle and setup suitable for your party.",
      },
    ],
    relatedLabel: "Compare nearby destinations",
    relatedTitle: "Travelling beyond Lara to Belek?",
    relatedDescription:
      "Explore the longer eastbound route from Antalya Airport to Belek’s resorts, golf hotels and accommodation areas.",
    relatedCta: "View the Belek route",
    finalTitle: "Land in Antalya with your Lara ride already considered.",
    finalDescription:
      "Share your trip once, compare clear local offers and choose the driver and vehicle that suit your arrival.",
    footer: "Private airport transfers across Antalya.",
  },
  ru: {
    title: "Трансфер из аэропорта Антальи в Лару | Частный водитель",
    description:
      "Спланируйте частный трансфер из аэропорта Антальи (AYT) в Лару. Сравните фиксированные цены проверенных водителей до отеля или апартаментов.",
    eyebrow: "Аэропорт Антальи → Лара",
    heading: "Комфортный частный трансфер из аэропорта Антальи в Лару",
    intro:
      "Лара — один из ближайших к аэропорту прибрежных районов Антальи. Заранее укажите место проживания и сравните предложения водителей для прямой поездки в отель, апартаменты или курортный комплекс.",
    cta: "Сравнить предложения в Лару",
    home: "Главная",
    route: "Аэропорт Антальи — Лара",
    distance: "Примерно 10–18 км",
    duration: "Обычно 20–35 минут",
    privateRide: "Поездка до двери",
    flightPickup: "Встреча с учётом рейса",
    overviewLabel: "Прибытие в Лару",
    overviewTitle: "Из терминала к побережью без лишних остановок",
    overview:
      "Лара тянется от жилых кварталов рядом с центром Антальи до гостиничной зоны в направлении Кунду, поэтому время в пути зависит от адреса. Частный трансфер доставит вас прямо к месту проживания без заездов к другим отелям.",
    benefits: [
      {
        title: "Цена известна заранее",
        description:
          "Сравните предложения с фиксированной стоимостью до поездки, не торгуясь после прилёта.",
      },
      {
        title: "Маршрут до вашего адреса",
        description:
          "Водитель заранее увидит, едете ли вы на пляж Лара, в жилой квартал или гостиничную зону.",
      },
      {
        title: "Подходящий автомобиль",
        description:
          "Укажите детские кресла, багаж и число пассажиров, чтобы получить подходящие варианты.",
      },
    ],
    howLabel: "Организуйте поездку",
    howTitle: "Встреча в аэропорту продумана до вашего прилёта",
    steps: [
      "Добавьте данные рейса и название или адрес места проживания в Ларе.",
      "Изучите цену, автомобиль и сообщение о встрече в каждом предложении.",
      "Выберите удобный вариант и заранее знайте, кто вас встретит.",
    ],
    faqLabel: "Планирование трансфера",
    faqTitle: "Вопросы о поездке из аэропорта Антальи в Лару",
    faqs: [
      {
        question: "Как далеко Лара находится от аэропорта Антальи?",
        answer:
          "Расстояние составляет примерно 10–18 км и зависит от адреса. Западная часть Лары ближе, а дорога до отелей в направлении Кунду немного длиннее.",
      },
      {
        question: "Сколько занимает трансфер из аэропорта в Лару?",
        answer:
          "Большинство поездок занимает около 20–35 минут. На время влияют трафик, терминал прилёта и расположение вашего отеля или апартаментов.",
      },
      {
        question: "Можно заказать детское кресло или место для большого багажа?",
        answer:
          "Да. Укажите эти пожелания в заявке, чтобы водители предложили подходящий автомобиль и комплектацию.",
      },
    ],
    relatedLabel: "Сравните соседние направления",
    relatedTitle: "После Лары вы направляетесь в Белек?",
    relatedDescription:
      "Посмотрите информацию о более длинном маршруте на восток — к курортам, гольф-отелям и другим районам Белека.",
    relatedCta: "Посмотреть маршрут в Белек",
    finalTitle: "Прилетайте в Анталью с понятным планом поездки в Лару.",
    finalDescription:
      "Один раз укажите детали, сравните предложения местных водителей и выберите подходящий автомобиль.",
    footer: "Частные трансферы из аэропорта по всей Анталье.",
  },
  tr: {
    title: "Antalya Havalimanı Lara Transferi | Özel Sürücü Teklifleri",
    description:
      "Antalya Havalimanı'ndan (AYT) Lara'ya özel transferinizi planlayın. Otel veya adresiniz için doğrulanmış sürücülerin sabit fiyatlarını karşılaştırın.",
    eyebrow: "Antalya Havalimanı → Lara",
    heading: "Antalya Havalimanı'ndan Lara'ya rahat bir özel transfer",
    intro:
      "Lara, Antalya Havalimanı'na en yakın sahil bölgelerinden biridir. Konaklama adresinizi önceden paylaşın; otelinize, evinize veya tatil köyünüze doğrudan ulaşım için sürücü tekliflerini karşılaştırın.",
    cta: "Lara transfer tekliflerini karşılaştır",
    home: "Ana sayfa",
    route: "Antalya Havalimanı - Lara",
    distance: "Yaklaşık 10–18 km",
    duration: "Genellikle 20–35 dakika",
    privateRide: "Kapıdan kapıya yolculuk",
    flightPickup: "Uçuşunuza göre planlanan karşılama",
    overviewLabel: "Lara'ya varışınız",
    overviewTitle: "Terminalden sahile, gereksiz duraklar olmadan",
    overview:
      "Lara, Antalya merkezine yakın yerleşim sokaklarından Kundu yönündeki oteller bölgesine kadar uzanır; bu nedenle süre tam adresinize göre değişir. Özel transfer sizi ortak servis durakları olmadan doğrudan konaklama yerinize götürür.",
    benefits: [
      {
        title: "Fiyatı önceden görerek seçin",
        description:
          "İnişten sonra pazarlık yapmak yerine yolculuktan önce sabit fiyatlı teklifleri karşılaştırın.",
      },
      {
        title: "Konaklamanıza uygun karşılama",
        description:
          "Sürücüler Lara Plajı'na, şehir tarafındaki bir adrese veya oteller bölgesine gideceğinizi görür.",
      },
      {
        title: "Uçuş sonrası doğru araç",
        description:
          "Çocuk koltuğu, valiz ve grup bilgilerini ekleyerek uygun araç teklifleri alın.",
      },
    ],
    howLabel: "Yolculuğunuzu düzenleyin",
    howTitle: "Lara karşılamanız, siz varmadan planlansın",
    steps: [
      "Uçuş bilgilerinizi ve Lara'daki otelinizin adını veya açık adresini ekleyin.",
      "Her teklifin fiyatını, araç ayrıntılarını ve karşılama mesajını inceleyin.",
      "Size uygun seçeneği belirleyin ve sizi kimin karşılayacağını bilerek varın.",
    ],
    faqLabel: "Transfer planı",
    faqTitle: "Antalya Havalimanı'ndan Lara'ya ulaşım hakkında sorular",
    faqs: [
      {
        question: "Lara, Antalya Havalimanı'na ne kadar uzak?",
        answer:
          "Mesafe konaklama yerinize göre yaklaşık 10–18 km'dir. Lara'nın batı tarafındaki adresler daha yakınken Kundu yönündeki oteller için yol biraz daha uzundur.",
      },
      {
        question: "Havalimanından Lara'ya transfer ne kadar sürer?",
        answer:
          "Çoğu yolculuk yaklaşık 20–35 dakika sürer. Trafik, varış terminaliniz ve konaklama yerinizin konumu süreyi değiştirebilir.",
      },
      {
        question: "Çocuk koltuğu veya fazla bagaj alanı isteyebilir miyim?",
        answer:
          "Evet. Sürücülerin grubunuza uygun araç ve donanımla teklif verebilmesi için bu ihtiyaçları talebinize ekleyin.",
      },
    ],
    relatedLabel: "Yakındaki rotaları karşılaştırın",
    relatedTitle: "Lara'dan daha ileride Belek'e mi gidiyorsunuz?",
    relatedDescription:
      "Antalya Havalimanı'ndan Belek'in tatil köyleri, golf otelleri ve konaklama bölgelerine uzanan doğu rotasını inceleyin.",
    relatedCta: "Belek rotasını görüntüle",
    finalTitle: "Antalya'ya, Lara yolculuğunuzu planlamış olarak inin.",
    finalDescription:
      "Seyahat bilgilerinizi bir kez paylaşın, açık fiyatlı yerel teklifleri karşılaştırın ve size uygun sürücüyü seçin.",
    footer: "Antalya genelinde özel havalimanı transferleri.",
  },
} satisfies Record<PublicLocale, AirportTransferLandingCopy>;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/antalya-airport-to-lara">): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return buildAirportTransferMetadata(locale, routePath, copy[locale]);
}

export default async function AntalyaAirportToLaraPage({
  params,
}: PageProps<"/[locale]/antalya-airport-to-lara">) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return (
    <AirportTransferLandingPage
      locale={locale}
      routePath={routePath}
      destination="Lara"
      serviceType="Private airport transfer from Antalya Airport to Lara"
      content={copy[locale]}
      relatedRoutePath="/antalya-airport-to-belek"
    />
  );
}
