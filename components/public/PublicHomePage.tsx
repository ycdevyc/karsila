import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  Luggage,
  MapPin,
  MessageCircle,
  Palmtree,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
  Waves,
} from "lucide-react";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { SiteHeader } from "@/components/falcon/SiteHeader";
import {
  publicPath,
  type PublicLocale,
} from "@/lib/i18n/public";

const holidayImages = {
  hero: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=2400&q=90",
  coast:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85",
  oldTown:
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1600&q=85",
  resort:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
};

const homeCopy = {
  en: {
    heroEyebrow: "Your Antalya holiday starts here",
    heroLines: ["Land.", "Relax.", "We’ll take you there."],
    heroDescription:
      "Request your private Antalya airport transfer, receive offers from trusted local drivers and choose the ride that suits your holiday.",
    requestTransfer: "Request your transfer",
    driverLogin: "Driver login",
    trustPoints: [
      "Fixed driver offers",
      "No hidden booking fees",
      "Flight-aware pickup",
      "Private VIP vehicles",
    ],
    exampleTransfer: "Example transfer",
    exampleAirport: "Antalya Airport",
    exampleRoute: "AYT → Lara Beach",
    recommendedOffer: "Recommended offer",
    fixedPrice: "Fixed price",
    journey: "Journey",
    guests: "Guests",
    included: "Included",
    luggage: "Luggage",
    driverQuote:
      "“I will wait at arrivals with your name sign and track your flight.”",
    similarTransfer: "Request a similar transfer",
    trustedDrivers: "Trusted drivers",
    driversReviewed: "Reviewed before joining",
    flightAwarePickup: "Flight-aware pickup",
    delayedFlight: "Delayed flight? Your driver knows.",
    discoverKarsila: "Discover Karsila",
    arrivalLabel: "Arrival, reimagined",
    arrivalTitle: "From airport doors to holiday mode.",
    arrivalDescription:
      "Karsila is not a traditional taxi booking site. You describe your trip, local VIP drivers make their best offer, and you decide who welcomes you to Antalya.",
    continue: "Continue",
    transferConfirmed: "Transfer confirmed",
    steps: [
      {
        title: "Tell us where you are going",
        description:
          "Enter your airport, hotel, travel date, flight number and number of passengers.",
      },
      {
        title: "Receive local driver offers",
        description:
          "Verified Antalya drivers respond with a fixed price, vehicle and personal message.",
      },
      {
        title: "Choose with confidence",
        description:
          "Compare the offers and confirm the transfer that feels right for your holiday.",
      },
    ],
    popularRoutes: "Popular Antalya routes",
    holidayQuestion: "Where does your holiday begin?",
    anotherDestination: "Request another destination",
    fromAirport: "from AYT",
    destinations: [
      { name: "Lara", subtitle: "Beach resorts", duration: "25–35 min" },
      { name: "Belek", subtitle: "Luxury & golf", duration: "35–45 min" },
      { name: "Side", subtitle: "History by the sea", duration: "55–70 min" },
    ],
    moreThanTransport: "More than transportation",
    warmWelcome: "The first warm welcome of your trip.",
    differenceLabel: "The Karsila difference",
    differenceTitle: "Personal service before you even arrive.",
    differenceDescription:
      "Instead of accepting one anonymous price, you receive genuine proposals from local drivers. Compare their vehicle, message and fixed price before making your decision.",
    features: [
      {
        title: "Verified local drivers",
        description:
          "Driver profiles are reviewed before they can send offers.",
      },
      {
        title: "Built around your flight",
        description:
          "Share your flight number so the driver can prepare for your arrival.",
      },
      {
        title: "A real message from your driver",
        description:
          "Know who will meet you and what service is included.",
      },
    ],
    startRequest: "Start your transfer request",
    readyLabel: "Ready when you are",
    readyTitle: "Start your holiday without the airport stress.",
    readyDescription:
      "Submit your route in a few moments and let Antalya’s local transfer drivers come to you.",
    requestMine: "Request my transfer",
    footerDescription: "Private airport transfers across Antalya.",
    footerRequest: "Request transfer",
  },
  ru: {
    heroEyebrow: "Ваш отдых в Анталье начинается здесь",
    heroLines: ["Прилетайте.", "Отдыхайте.", "Мы вас доставим."],
    heroDescription:
      "Закажите частный трансфер из аэропорта Антальи, получите предложения от проверенных местных водителей и выберите подходящий вариант.",
    requestTransfer: "Заказать трансфер",
    driverLogin: "Вход для водителей",
    trustPoints: [
      "Фиксированные предложения",
      "Без скрытых комиссий",
      "Встреча с учётом рейса",
      "Частные VIP-автомобили",
    ],
    exampleTransfer: "Пример трансфера",
    exampleAirport: "Аэропорт Антальи",
    exampleRoute: "AYT → Лара-Бич",
    recommendedOffer: "Рекомендуемое предложение",
    fixedPrice: "Фиксированная цена",
    journey: "В пути",
    guests: "Гостей",
    included: "Включено",
    luggage: "Багаж",
    driverQuote:
      "«Я встречу вас в зоне прилёта с табличкой и буду следить за статусом рейса.»",
    similarTransfer: "Заказать похожий трансфер",
    trustedDrivers: "Проверенные водители",
    driversReviewed: "Проверка перед подключением",
    flightAwarePickup: "Встреча с учётом рейса",
    delayedFlight: "Рейс задержан? Водитель будет в курсе.",
    discoverKarsila: "Узнать больше",
    arrivalLabel: "Новый взгляд на встречу",
    arrivalTitle: "Из аэропорта — сразу в режим отдыха.",
    arrivalDescription:
      "Karsila — это не обычный сервис заказа такси. Вы описываете поездку, местные VIP-водители предлагают свою лучшую цену, а вы выбираете, кто встретит вас в Анталье.",
    continue: "Далее",
    transferConfirmed: "Трансфер подтверждён",
    steps: [
      {
        title: "Укажите маршрут",
        description:
          "Добавьте аэропорт, отель, дату поездки, номер рейса и количество пассажиров.",
      },
      {
        title: "Получите предложения водителей",
        description:
          "Проверенные водители Антальи предложат фиксированную цену, автомобиль и личное сообщение.",
      },
      {
        title: "Выберите с уверенностью",
        description:
          "Сравните предложения и подтвердите трансфер, который подходит именно вам.",
      },
    ],
    popularRoutes: "Популярные маршруты Антальи",
    holidayQuestion: "Где начнётся ваш отдых?",
    anotherDestination: "Указать другое направление",
    fromAirport: "из AYT",
    destinations: [
      { name: "Лара", subtitle: "Пляжные курорты", duration: "25–35 мин" },
      { name: "Белек", subtitle: "Роскошь и гольф", duration: "35–45 мин" },
      { name: "Сиде", subtitle: "История у моря", duration: "55–70 мин" },
    ],
    moreThanTransport: "Больше, чем поездка",
    warmWelcome: "Первый тёплый приём вашего путешествия.",
    differenceLabel: "Преимущество Karsila",
    differenceTitle: "Персональный сервис ещё до вашего прилёта.",
    differenceDescription:
      "Вместо одной безличной цены вы получаете реальные предложения от местных водителей. Сравните автомобиль, сообщение и фиксированную стоимость перед выбором.",
    features: [
      {
        title: "Проверенные местные водители",
        description:
          "Профиль каждого водителя проверяется до отправки предложений.",
      },
      {
        title: "С учётом вашего рейса",
        description:
          "Укажите номер рейса, чтобы водитель подготовился к вашему прибытию.",
      },
      {
        title: "Личное сообщение водителя",
        description:
          "Заранее узнайте, кто вас встретит и что входит в услугу.",
      },
    ],
    startRequest: "Оформить заявку на трансфер",
    readyLabel: "Когда будете готовы",
    readyTitle: "Начните отдых без стресса в аэропорту.",
    readyDescription:
      "Укажите маршрут за несколько минут и получите предложения от местных водителей Антальи.",
    requestMine: "Заказать трансфер",
    footerDescription: "Частные трансферы из аэропорта по всей Анталье.",
    footerRequest: "Заказать трансфер",
  },
  tr: {
    heroEyebrow: "Antalya tatiliniz burada başlıyor",
    heroLines: ["İnin.", "Rahatlayın.", "Sizi biz götürelim."],
    heroDescription:
      "Özel Antalya havalimanı transferinizi talep edin, güvenilir yerel sürücülerden teklifler alın ve tatilinize en uygun yolculuğu seçin.",
    requestTransfer: "Transfer talebi oluştur",
    driverLogin: "Sürücü girişi",
    trustPoints: [
      "Sabit fiyatlı sürücü teklifleri",
      "Gizli rezervasyon ücreti yok",
      "Uçuş takibine göre karşılama",
      "Özel VIP araçlar",
    ],
    exampleTransfer: "Örnek transfer",
    exampleAirport: "Antalya Havalimanı",
    exampleRoute: "AYT → Lara Plajı",
    recommendedOffer: "Önerilen teklif",
    fixedPrice: "Sabit fiyat",
    journey: "Yolculuk",
    guests: "Misafir",
    included: "Dahil",
    luggage: "Bagaj",
    driverQuote:
      "“Gelen yolcu bölümünde isim tabelanızla bekleyeceğim ve uçuşunuzu takip edeceğim.”",
    similarTransfer: "Benzer transfer talep et",
    trustedDrivers: "Güvenilir sürücüler",
    driversReviewed: "Katılmadan önce incelenir",
    flightAwarePickup: "Uçuş takibine göre karşılama",
    delayedFlight: "Uçuşunuz gecikti mi? Sürücünüz haberdar olur.",
    discoverKarsila: "Karsila'yı keşfedin",
    arrivalLabel: "Karşılamaya yeni bir bakış",
    arrivalTitle: "Havalimanı kapısından tatil moduna.",
    arrivalDescription:
      "Karsila klasik bir taksi rezervasyon sitesi değildir. Yolculuğunuzu anlatırsınız, yerel VIP sürücüler en iyi tekliflerini sunar ve Antalya’da sizi kimin karşılayacağına siz karar verirsiniz.",
    continue: "Devam",
    transferConfirmed: "Transfer onaylandı",
    steps: [
      {
        title: "Nereye gideceğinizi söyleyin",
        description:
          "Havalimanınızı, otelinizi, seyahat tarihinizi, uçuş numaranızı ve yolcu sayısını girin.",
      },
      {
        title: "Yerel sürücülerden teklif alın",
        description:
          "Onaylı Antalya sürücüleri sabit fiyat, araç bilgisi ve kişisel mesajla yanıt verir.",
      },
      {
        title: "Güvenle seçiminizi yapın",
        description:
          "Teklifleri karşılaştırın ve tatilinize uygun transferi onaylayın.",
      },
    ],
    popularRoutes: "Popüler Antalya rotaları",
    holidayQuestion: "Tatiliniz nerede başlıyor?",
    anotherDestination: "Başka bir varış noktası belirt",
    fromAirport: "AYT’den",
    destinations: [
      { name: "Lara", subtitle: "Sahil otelleri", duration: "25–35 dk" },
      { name: "Belek", subtitle: "Lüks ve golf", duration: "35–45 dk" },
      { name: "Side", subtitle: "Deniz kıyısında tarih", duration: "55–70 dk" },
    ],
    moreThanTransport: "Ulaşımdan daha fazlası",
    warmWelcome: "Yolculuğunuzun ilk sıcak karşılaması.",
    differenceLabel: "Karsila farkı",
    differenceTitle: "Daha gelmeden kişisel hizmet.",
    differenceDescription:
      "Tek bir anonim fiyatı kabul etmek yerine yerel sürücülerden gerçek teklifler alırsınız. Karar vermeden önce araçlarını, mesajlarını ve sabit fiyatlarını karşılaştırın.",
    features: [
      {
        title: "Onaylı yerel sürücüler",
        description:
          "Sürücü profilleri teklif göndermeden önce incelenir.",
      },
      {
        title: "Uçuşunuza göre planlama",
        description:
          "Sürücünün varışınıza hazırlanabilmesi için uçuş numaranızı paylaşın.",
      },
      {
        title: "Sürücünüzden gerçek bir mesaj",
        description:
          "Sizi kimin karşılayacağını ve hizmete nelerin dahil olduğunu önceden bilin.",
      },
    ],
    startRequest: "Transfer talebinizi başlatın",
    readyLabel: "Hazır olduğunuzda",
    readyTitle: "Tatilinize havalimanı stresi olmadan başlayın.",
    readyDescription:
      "Rotanızı birkaç dakika içinde gönderin ve Antalya’daki yerel transfer sürücülerinden teklif alın.",
    requestMine: "Transferimi talep et",
    footerDescription: "Antalya genelinde özel havalimanı transferleri.",
    footerRequest: "Transfer talep et",
  },
} as const;

export function PublicHomePage({
  locale,
}: {
  locale: PublicLocale;
}) {
  const copy = homeCopy[locale];
  const requestHref = publicPath(
    locale === "tr" ? "en" : locale,
    "/request",
  );
  const transferSteps = [
    { number: "01", icon: MapPin, ...copy.steps[0] },
    { number: "02", icon: MessageCircle, ...copy.steps[1] },
    { number: "03", icon: BadgeCheck, ...copy.steps[2] },
  ];
  const destinations = [
    { ...copy.destinations[0], image: holidayImages.resort },
    { ...copy.destinations[1], image: holidayImages.coast },
    { ...copy.destinations[2], image: holidayImages.oldTown },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader locale={locale} />

      <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#071c31] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-[1.04] bg-cover bg-center animate-[falconHeroZoom_18s_ease-in-out_infinite_alternate]"
          style={{
            backgroundImage: `url("${holidayImages.hero}")`,
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,21,39,0.96)_0%,rgba(5,21,39,0.76)_42%,rgba(5,21,39,0.28)_72%,rgba(5,21,39,0.5)_100%)]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,28,49,0.2)_0%,rgba(7,28,49,0.05)_45%,rgba(7,28,49,0.82)_100%)]"
        />

        <div
          aria-hidden="true"
          className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-cyan-300/15 blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-amber-300/15 blur-[120px]"
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid flex-1 items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.72fr)]">
            <div className="max-w-4xl pt-4 lg:pt-0">
              <div className="animate-[falconReveal_.8s_ease-out_both]">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-xl">
                  <Sun className="h-4 w-4 text-amber-300" />
                  {copy.heroEyebrow}
                </div>
              </div>

              <h1 className="mt-7 max-w-4xl animate-[falconReveal_.9s_.08s_ease-out_both] text-balance text-[clamp(3.25rem,8vw,7.5rem)] font-extrabold leading-[0.88] tracking-[-0.065em]">
                {copy.heroLines[0]}
                <span className="block text-amber-200">
                  {copy.heroLines[1]}
                </span>
                <span className="block">{copy.heroLines[2]}</span>
              </h1>

              <p className="mt-7 max-w-2xl animate-[falconReveal_.9s_.16s_ease-out_both] text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
                {copy.heroDescription}
              </p>

              <div className="mt-9 flex animate-[falconReveal_.9s_.24s_ease-out_both] flex-col gap-3 sm:flex-row">
                <Link
                  href={requestHref}
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-amber-200 px-7 py-4 text-sm font-bold text-[#10283e] shadow-[0_18px_50px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:bg-amber-100"
                >
                  {copy.requestTransfer}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/driver/login"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/24 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/16"
                >
                  {copy.driverLogin}
                </Link>
              </div>

              <div className="mt-10 flex animate-[falconReveal_.9s_.32s_ease-out_both] flex-wrap gap-x-6 gap-y-3 text-sm text-white/72">
                {copy.trustPoints.map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-300/18 text-emerald-200">
                      <Check className="h-3 w-3" />
                    </span>
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden min-h-[590px] animate-[falconReveal_1s_.2s_ease-out_both] lg:block">
              <div className="absolute right-0 top-1/2 w-full max-w-[430px] -translate-y-1/2">
                <div className="animate-[falconFloat_6s_ease-in-out_infinite] rounded-[2rem] border border-white/16 bg-white/12 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                  <div className="overflow-hidden rounded-[1.45rem] bg-[#f8f3e9] text-[#10283e]">
                    <div className="relative h-40 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                        style={{
                          backgroundImage: `url("${holidayImages.coast}")`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071c31]/75 via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/88 px-3 py-1.5 text-xs font-bold text-[#10283e] shadow-lg backdrop-blur">
                        <Plane className="h-3.5 w-3.5" />
                        {copy.exampleTransfer}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
                          {copy.exampleAirport}
                        </p>
                        <p className="mt-1 text-xl font-extrabold tracking-tight text-white">
                          {copy.exampleRoute}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#657688]">
                            {copy.recommendedOffer}
                          </p>
                          <h2 className="mt-2 text-xl font-extrabold tracking-tight">
                            Mercedes Vito VIP
                          </h2>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-semibold text-[#657688]">
                            {copy.fixedPrice}
                          </p>
                          <p className="mt-1 text-3xl font-extrabold tracking-[-0.05em]">
                            €45
                          </p>
                        </div>
                      </div>

                      <div className="my-5 h-px bg-[#10283e]/10" />

                      <div className="grid grid-cols-3 gap-3">
                        <TransferDetail
                          icon={Clock3}
                          value={locale === "tr" ? "30 dk" : "30 min"}
                          label={copy.journey}
                        />
                        <TransferDetail
                          icon={Users}
                          value="1–6"
                          label={copy.guests}
                        />
                        <TransferDetail
                          icon={Luggage}
                          value={copy.included}
                          label={copy.luggage}
                        />
                      </div>

                      <div className="mt-5 rounded-2xl border border-[#10283e]/8 bg-white/60 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#183e5f] text-sm font-extrabold text-white">
                            AK
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold">Ahmet Kaya</p>
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                4.9
                              </span>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-[#657688]">
                              {copy.driverQuote}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={requestHref}
                        className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#173b5b] px-5 text-sm font-bold text-white transition duration-300 hover:bg-[#0d2c48]"
                      >
                        {copy.similarTransfer}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-20 top-16 animate-[falconFloatReverse_7s_ease-in-out_infinite] rounded-2xl border border-white/16 bg-[#10283e]/75 p-4 text-white shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300/16 text-emerald-200">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        {copy.trustedDrivers}
                      </p>
                      <p className="mt-0.5 text-xs text-white/62">
                        {copy.driversReviewed}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-12 right-8 animate-[falconFloat_8s_1s_ease-in-out_infinite] rounded-2xl border border-white/16 bg-white/12 p-4 text-white shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300/16 text-amber-200">
                      <CalendarClock className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        {copy.flightAwarePickup}
                      </p>
                      <p className="mt-0.5 text-xs text-white/62">
                        {copy.delayedFlight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a
            href="#discover"
            className="mt-10 hidden w-fit animate-[falconReveal_1s_.45s_ease-out_both] items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/65 transition hover:text-white md:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/8 backdrop-blur">
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </span>
            {copy.discoverKarsila}
          </a>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"
        />
      </section>

      <section
        id="discover"
        className="relative px-5 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="absolute left-0 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/25 blur-[110px]"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="falcon-section-label">{copy.arrivalLabel}</p>

              <h2 className="mt-4 max-w-xl text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {copy.arrivalTitle}
              </h2>
            </div>

            <div className="lg:pb-2">
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {copy.arrivalDescription}
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {transferSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative overflow-hidden rounded-[2rem] border border-border/65 bg-card/82 p-6 shadow-[var(--falcon-shadow-sm)] backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:shadow-[var(--falcon-shadow-md)] sm:p-8"
                >
                  <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-falcon-mist/50 blur-3xl transition duration-500 group-hover:scale-125"
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="falcon-icon-tile-light">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-sm font-extrabold tracking-[0.14em] text-muted-foreground/55">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-12 text-2xl font-extrabold tracking-tight">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>

                    {index < transferSteps.length - 1 && (
                      <div className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-falcon-ocean">
                        {copy.continue}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    )}

                    {index === transferSteps.length - 1 && (
                      <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <Check className="h-3.5 w-3.5" />
                        {copy.transferConfirmed}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-[#09233b] px-5 py-20 text-white sm:px-6 md:py-28 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:26px_26px]"
        />

        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-300/12 blur-[130px]"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                <Palmtree className="h-4 w-4" />
                {copy.popularRoutes}
              </div>

              <h2 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {copy.holidayQuestion}
              </h2>
            </div>

            <Link
              href={requestHref}
              className="group inline-flex items-center gap-3 text-sm font-bold text-white/72 transition hover:text-white"
            >
              {copy.anotherDestination}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {destinations.map((destination, index) => (
              <Link
                key={destination.name}
                href={requestHref}
                className={`group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 ${
                  index === 1 ? "md:translate-y-8" : ""
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: `url("${destination.image}")`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#061728]/95 via-[#061728]/22 to-transparent" />

                <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-[#10283e]">
                  <ArrowRight className="h-4 w-4" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                    <Clock3 className="h-3.5 w-3.5" />
                    {destination.duration} {copy.fromAirport}
                  </div>

                  <h3 className="mt-3 text-4xl font-extrabold tracking-[-0.045em]">
                    {destination.name}
                  </h3>

                  <p className="mt-2 text-sm text-white/66">
                    {destination.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.25rem] border border-border/65 bg-card/88 shadow-[var(--falcon-shadow-lg)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-[640px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] hover:scale-105"
              style={{
                backgroundImage: `url("${holidayImages.oldTown}")`,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071c31]/80 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/16 bg-[#071c31]/52 p-5 text-white backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                <Waves className="h-4 w-4" />
                {copy.moreThanTransport}
              </div>

              <p className="mt-3 text-xl font-extrabold tracking-tight">
                {copy.warmWelcome}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-falcon-mist/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-falcon-navy dark:bg-white/8 dark:text-white/80">
              <Sparkles className="h-4 w-4" />
              {copy.differenceLabel}
            </div>

            <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
              {copy.differenceTitle}
            </h2>

            <p className="mt-6 text-base leading-8 text-muted-foreground">
              {copy.differenceDescription}
            </p>

            <div className="mt-8 space-y-5">
              <FeatureRow
                icon={ShieldCheck}
                title={copy.features[0].title}
                description={copy.features[0].description}
              />

              <FeatureRow
                icon={Plane}
                title={copy.features[1].title}
                description={copy.features[1].description}
              />

              <FeatureRow
                icon={MessageCircle}
                title={copy.features[2].title}
                description={copy.features[2].description}
              />
            </div>

            <Link
              href={requestHref}
              className="falcon-button-primary mt-10 w-full sm:w-fit"
            >
              {copy.startRequest}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-[#0b2944] px-6 py-14 text-white shadow-[var(--falcon-shadow-lg)] sm:px-10 lg:px-16 lg:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(235,198,119,0.22),transparent_25%),radial-gradient(circle_at_10%_100%,rgba(51,177,188,0.2),transparent_32%)]"
          />

          <div
            aria-hidden="true"
            className="absolute -right-14 -top-14 rotate-12 text-[18rem] font-black leading-none text-white/[0.025]"
          >
            K
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                {copy.readyLabel}
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {copy.readyTitle}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
                {copy.readyDescription}
              </p>
            </div>

            <Link
              href={requestHref}
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-amber-200 px-7 py-4 text-sm font-bold text-[#10283e] transition duration-300 hover:-translate-y-1 hover:bg-amber-100"
            >
              {copy.requestMine}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/65 px-5 py-9 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <KarsilaLogo />
            <p className="mt-1 text-xs">
              {copy.footerDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={requestHref}
              className="transition hover:text-foreground"
            >
              {copy.footerRequest}
            </Link>

            <Link
              href="/driver/login"
              className="transition hover:text-foreground"
            >
              {copy.driverLogin}
            </Link>

          </div>

          <p className="text-xs">© 2026 Karsila</p>
        </div>
      </footer>

      <style>{`
        @keyframes falconReveal {
          from {
            opacity: 0;
            transform: translateY(28px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes falconHeroZoom {
          from {
            transform: scale(1.04);
          }

          to {
            transform: scale(1.11);
          }
        }

        @keyframes falconFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-14px);
          }
        }

        @keyframes falconFloatReverse {
          0%,
          100% {
            transform: translateY(-8px);
          }

          50% {
            transform: translateY(10px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [class*="falconReveal"],
          [class*="falconFloat"],
          [class*="falconHeroZoom"] {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}

type TransferDetailProps = {
  icon: typeof Clock3;
  value: string;
  label: string;
};

function TransferDetail({
  icon: Icon,
  value,
  label,
}: TransferDetailProps) {
  return (
    <div className="rounded-xl bg-[#10283e]/[0.045] p-3">
      <Icon className="h-4 w-4 text-[#275f82]" />
      <p className="mt-2 text-xs font-extrabold">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold text-[#71808d]">
        {label}
      </p>
    </div>
  );
}

type FeatureRowProps = {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
};

function FeatureRow({
  icon: Icon,
  title,
  description,
}: FeatureRowProps) {
  return (
    <div className="flex gap-4">
      <div className="falcon-icon-tile-light">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-base font-extrabold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
